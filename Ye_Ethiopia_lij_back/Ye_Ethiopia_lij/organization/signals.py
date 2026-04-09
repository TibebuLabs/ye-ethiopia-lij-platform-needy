"""
Organization notification routing:
- Org created → PROJECT_MANAGER first for review (fallback to ADMIN if no PM)
- Org status changed → notify the org owner only
"""
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
import logging

logger = logging.getLogger(__name__)

_prev_org_status: dict = {}


def _sys_notify(notification_type, title, message, recipient,
                related_type='', related_id=''):
    try:
        from childprofile.models_extended import ChildNotification
        ChildNotification.objects.create(
            child=None,
            notification_type=notification_type,
            title=title,
            message=message,
            recipient=recipient,
            related_object_type=related_type,
            related_object_id=related_id,
        )
    except Exception as e:
        logger.warning(f"_sys_notify failed: {e}")


@receiver(pre_save, sender='organization.Organization')
def capture_prev_org_status(sender, instance, **kwargs):
    if instance.pk:
        try:
            old = sender.objects.get(pk=instance.pk)
            _prev_org_status[str(instance.pk)] = old.status
        except sender.DoesNotExist:
            pass


@receiver(post_save, sender='organization.Organization')
def notify_org_events(sender, instance, created, **kwargs):
    from django.contrib.auth import get_user_model
    User = get_user_model()

    if created:
        # New org registered → notify PROJECT_MANAGERs first for review
        pms = list(User.objects.filter(role='PROJECT_MANAGER', status='ACTIVE'))
        if pms:
            for pm in pms:
                _sys_notify(
                    'ORG_CREATED',
                    'New Organization Registered — Needs Review',
                    (
                        f'"{instance.name}" ({instance.org_type}) registered by {instance.owner.name}. '
                        f'Please review their documents and forward to Admin for approval.'
                    ),
                    pm,
                    related_type='Organization',
                    related_id=str(instance.id),
                )
        else:
            # Fallback to admins if no PM exists
            for admin in User.objects.filter(role='ADMIN', status='ACTIVE'):
                _sys_notify(
                    'ORG_CREATED',
                    'New Organization Registered',
                    f'"{instance.name}" ({instance.org_type}) has been registered by {instance.owner.name} and is awaiting approval.',
                    admin,
                    related_type='Organization',
                    related_id=str(instance.id),
                )
    else:
        prev = _prev_org_status.pop(str(instance.pk), None)

        # Only notify if status actually changed
        if prev is None or prev == instance.status:
            return

        # Notify only the org owner
        if instance.status == 'ACTIVE':
            _sys_notify(
                'ORG_APPROVED',
                'Your Organization Has Been Approved',
                f'Your organization "{instance.name}" has been approved. You can now register children and submit reports.',
                instance.owner,
                related_type='Organization',
                related_id=str(instance.id),
            )
        elif instance.status == 'REJECTED':
            reason = getattr(instance, 'rejection_reason', None) or 'No reason provided.'
            _sys_notify(
                'ORG_REJECTED',
                'Your Organization Registration Was Rejected',
                f'Your organization "{instance.name}" was rejected. Reason: {reason}',
                instance.owner,
                related_type='Organization',
                related_id=str(instance.id),
            )
        elif instance.status == 'SUSPENDED':
            _sys_notify(
                'ORG_REJECTED',
                'Your Organization Has Been Suspended',
                f'Your organization "{instance.name}" has been suspended. Please contact the administrator.',
                instance.owner,
                related_type='Organization',
                related_id=str(instance.id),
            )
