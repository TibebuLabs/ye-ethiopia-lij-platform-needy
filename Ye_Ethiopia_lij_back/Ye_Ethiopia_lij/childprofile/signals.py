"""
Auto-create ChildNotification records when key events happen.
Also runs duplicate detection when a new child is registered.
"""
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model

from .models import ChildProfile, Sponsorship, InterventionLog
from .models_extended import ChildNotification, DuplicationAlert

User = get_user_model()


def _push_ws(notification):
    """Push a notification to the user's WebSocket group (fire-and-forget)."""
    try:
        from asgiref.sync import async_to_sync
        from channels.layers import get_channel_layer
        channel_layer = get_channel_layer()
        if channel_layer is None:
            return
        payload = {
            'id': str(notification.id),
            'notification_type': notification.notification_type,
            'title': notification.title,
            'message': notification.message,
            'is_read': notification.is_read,
            'created_at': notification.created_at.isoformat(),
            # child may be None for system/org/account notifications
            'child': str(notification.child_id) if notification.child_id else None,
        }
        async_to_sync(channel_layer.group_send)(
            f'notifications_{notification.recipient_id}',
            {'type': 'send_notification', 'notification': payload},
        )
    except Exception:
        pass


def _notify(child, notification_type, title, message, recipient):
    """Helper to create a notification and push it via WebSocket."""
    try:
        notif = ChildNotification.objects.create(
            child=child,
            notification_type=notification_type,
            title=title,
            message=message,
            recipient=recipient,
        )
        _push_ws(notif)
    except Exception:
        pass  # Never let notification failure break the main flow


# ── Duplicate detection ───────────────────────────────────────────────────────

def _similarity_score(child, candidate):
    """
    Compute a 0-100 similarity score between two child profiles.
    Weighted field matching — no external libraries needed.
    """
    score = 0.0
    matching = []

    # Full name — normalise to lowercase, strip spaces (weight 40)
    name_a = child.full_name.lower().strip()
    name_b = candidate.full_name.lower().strip()
    if name_a == name_b:
        score += 40
        matching.append('full_name')
    else:
        # Partial: first word matches (first name)
        if name_a.split()[0] == name_b.split()[0]:
            score += 15
            matching.append('first_name')

    # Age — exact match (weight 15)
    if child.age == candidate.age:
        score += 15
        matching.append('age')
    elif abs(child.age - candidate.age) <= 1:
        score += 7

    # Gender (weight 10)
    if child.gender == candidate.gender:
        score += 10
        matching.append('gender')

    # Location — normalise (weight 20)
    loc_a = child.location.lower().strip()
    loc_b = candidate.location.lower().strip()
    if loc_a == loc_b:
        score += 20
        matching.append('location')
    elif loc_a[:5] == loc_b[:5]:          # same area prefix
        score += 10

    # Guardian info — first 20 chars (weight 15)
    guard_a = child.guardian_info.lower().strip()[:20]
    guard_b = candidate.guardian_info.lower().strip()[:20]
    if guard_a and guard_b and guard_a == guard_b:
        score += 15
        matching.append('guardian_info')

    return round(score, 1), matching


def detect_duplicates(new_child):
    """
    Compare new_child against all existing children (excluding itself).
    Create DuplicationAlert for any pair with similarity >= 60.
    Notify all admins about each alert.
    """
    THRESHOLD = 60.0

    existing = ChildProfile.objects.exclude(pk=new_child.pk)

    for candidate in existing:
        # Skip if an alert already exists for this pair
        already_exists = DuplicationAlert.objects.filter(
            primary_child=candidate,
            duplicate_child=new_child,
        ).exists() or DuplicationAlert.objects.filter(
            primary_child=new_child,
            duplicate_child=candidate,
        ).exists()
        if already_exists:
            continue

        score, matching_fields = _similarity_score(new_child, candidate)

        if score >= THRESHOLD:
            try:
                alert = DuplicationAlert.objects.create(
                    primary_child=candidate,
                    duplicate_child=new_child,
                    similarity_score=score,
                    matching_fields=matching_fields,
                    status='PENDING',
                )
                notif_message = (
                    f'New child "{new_child.full_name}" may be a duplicate of '
                    f'"{candidate.full_name}" (similarity: {score}%). '
                    f'Matching fields: {", ".join(matching_fields)}. Please review.'
                )
                # Notify all admins and project managers
                for reviewer in User.objects.filter(
                    role__in=['ADMIN', 'PROJECT_MANAGER'], status='ACTIVE'
                ):
                    _notify(
                        child=new_child,
                        notification_type='STATUS_UPDATED',
                        title='Possible Duplicate Child Detected',
                        message=notif_message,
                        recipient=reviewer,
                    )
            except Exception:
                pass  # Never block registration


# ── Child profile submitted (status → PENDING) ────────────────────────────────
@receiver(post_save, sender=ChildProfile)
def notify_child_profile_events(sender, instance, created, **kwargs):
    org_staff = instance.organization  # The ORG_STAFF user who registered the child

    if created:
        # Run duplicate detection first
        detect_duplicates(instance)

        # Notify PROJECT_MANAGERs first — they review new child profiles before Admin decides
        pm_users = User.objects.filter(role='PROJECT_MANAGER', status='ACTIVE')
        if pm_users.exists():
            for pm in pm_users:
                _notify(
                    child=instance,
                    notification_type='STATUS_UPDATED',
                    title='New Child Profile Submitted',
                    message=f'{org_staff.name} submitted a new child profile: {instance.full_name}. Please review and forward to Admin.',
                    recipient=pm,
                )
        else:
            # Fallback: no PM — notify admins directly
            for admin in User.objects.filter(role='ADMIN', status='ACTIVE'):
                _notify(
                    child=instance,
                    notification_type='STATUS_UPDATED',
                    title='New Child Profile Submitted',
                    message=f'{org_staff.name} submitted a new child profile: {instance.full_name}. Awaiting review.',
                    recipient=admin,
                )

    else:
        # Status changed — notify the org staff who registered the child
        if instance.status == 'PUBLISHED':
            _notify(
                child=instance,
                notification_type='PROFILE_APPROVED',
                title='Child Profile Approved',
                message=f'Your child profile for {instance.full_name} has been approved and is now visible to sponsors.',
                recipient=org_staff,
            )
        elif instance.status == 'REJECTED':
            _notify(
                child=instance,
                notification_type='PROFILE_REJECTED',
                title='Child Profile Rejected',
                message=f'Your child profile for {instance.full_name} has been rejected. Please contact the admin for details.',
                recipient=org_staff,
            )
        elif instance.status == 'SPONSORED':
            # Notify org staff that their child got sponsored
            _notify(
                child=instance,
                notification_type='SPONSORED',
                title='Child Sponsored',
                message=f'{instance.full_name} has been sponsored.',
                recipient=org_staff,
            )


# ── Sponsorship created ───────────────────────────────────────────────────────
@receiver(post_save, sender=Sponsorship)
def notify_sponsorship(sender, instance, created, **kwargs):
    if not created:
        return

    child = instance.child
    sponsor = instance.sponsor
    org_staff = child.organization

    # Notify the org staff whose child got sponsored
    _notify(
        child=child,
        notification_type='SPONSORED',
        title='New Sponsorship Received',
        message=f'{sponsor.name} has sponsored {child.full_name} with ETB {instance.commitment_amount}/month.',
        recipient=org_staff,
    )

    # Notify PROJECT_MANAGERs first — they review the financial document before Admin decides
    pm_users = User.objects.filter(role='PROJECT_MANAGER', status='ACTIVE')
    if pm_users.exists():
        for pm in pm_users:
            _notify(
                child=child,
                notification_type='SPONSORED',
                title='New Sponsorship — Review Required',
                message=(
                    f'{sponsor.name} submitted a sponsorship for {child.full_name} '
                    f'(ETB {instance.commitment_amount}/month via {instance.payment_provider}). '
                    f'Please review the financial document and send your decision to Admin.'
                ),
                recipient=pm,
            )
    else:
        # Fallback: no PM exists — notify admins directly
        for admin in User.objects.filter(role='ADMIN', status='ACTIVE'):
            _notify(
                child=child,
                notification_type='SPONSORED',
                title='New Sponsorship — Pending Verification',
                message=(
                    f'{sponsor.name} sponsored {child.full_name} '
                    f'(ETB {instance.commitment_amount}/month). Awaiting your verification.'
                ),
                recipient=admin,
            )


# ── Intervention logged ───────────────────────────────────────────────────────
@receiver(post_save, sender=InterventionLog)
def notify_intervention(sender, instance, created, **kwargs):
    if not created:
        return

    child = instance.child
    org_staff = child.organization

    # Notify the org staff (if recorder is not the org staff themselves)
    if instance.recorded_by != org_staff:
        _notify(
            child=child,
            notification_type='INTERVENTION_ADDED',
            title='Intervention Logged',
            message=f'A {instance.type} intervention was logged for {child.full_name} on {instance.date_provided}.',
            recipient=org_staff,
        )

    # Notify active sponsors of this child
    try:
        sponsorship = child.sponsorship
        if sponsorship and sponsorship.is_active:
            _notify(
                child=child,
                notification_type='INTERVENTION_ADDED',
                title='Intervention Update',
                message=f'A {instance.type} intervention was provided for {child.full_name} on {instance.date_provided}.',
                recipient=sponsorship.sponsor,
            )
    except Exception:
        pass
