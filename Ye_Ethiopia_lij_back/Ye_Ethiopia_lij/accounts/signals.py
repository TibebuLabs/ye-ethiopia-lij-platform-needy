"""
Registration notification routing:
- USER_REGISTERED  → PROJECT_MANAGER first (for review)
- PM forwards to ADMIN after adding notes
- ACCOUNT_APPROVED / REJECTED / SUSPENDED → that specific user only

School profile:
- SCHOOL_PROFILE_CREATED → PROJECT_MANAGER first
- SCHOOL_PROFILE_UPDATED → PROJECT_MANAGER + ADMIN
"""
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
import logging

logger = logging.getLogger(__name__)

_prev_status: dict = {}


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


@receiver(pre_save, sender='accounts.User')
def capture_prev_status(sender, instance, **kwargs):
    """Store the previous status before save so post_save can diff it."""
    if instance.pk:
        try:
            old = sender.objects.get(pk=instance.pk)
            _prev_status[str(instance.pk)] = old.status
        except sender.DoesNotExist:
            pass


@receiver(post_save, sender='accounts.User')
def notify_user_events(sender, instance, created, **kwargs):
    from django.contrib.auth import get_user_model
    User = get_user_model()

    if created:
        # Skip ADMIN — they are auto-activated and are the approver
        if instance.role == 'ADMIN':
            return

        # New registration → notify all PROJECT_MANAGERs first for review
        pms = list(User.objects.filter(role='PROJECT_MANAGER', status='ACTIVE'))
        if pms:
            for pm in pms:
                _sys_notify(
                    'USER_REGISTERED',
                    'New Registration — Needs Review',
                    (
                        f'{instance.name} registered as {instance.role.replace("_", " ")}. '
                        f'Please review their documents and forward to Admin for approval.'
                    ),
                    pm,
                    related_type='User',
                    related_id=str(instance.id),
                )
        else:
            # No PM exists yet — fall back to notifying admins directly
            for admin in User.objects.filter(role='ADMIN', status='ACTIVE'):
                _sys_notify(
                    'USER_REGISTERED',
                    'New User Registered',
                    f'{instance.name} ({instance.role.replace("_", " ")}) registered and is awaiting approval.',
                    admin,
                    related_type='User',
                    related_id=str(instance.id),
                )
    else:
        prev = _prev_status.pop(str(instance.pk), None)

        # Only notify if status actually changed
        if prev is None or prev == instance.status:
            return

        # Notify only the specific user whose status changed
        if instance.status == 'ACTIVE':
            _sys_notify(
                'ACCOUNT_APPROVED',
                'Your Account Has Been Approved',
                'Your account has been approved. You can now log in and use the system.',
                instance,
                related_type='User',
                related_id=str(instance.id),
            )
        elif instance.status == 'REJECTED':
            _sys_notify(
                'ACCOUNT_REJECTED',
                'Your Account Registration Was Rejected',
                'Your account registration has been rejected. Please contact the administrator for more information.',
                instance,
                related_type='User',
                related_id=str(instance.id),
            )
        elif instance.status == 'SUSPENDED':
            _sys_notify(
                'ACCOUNT_SUSPENDED',
                'Your Account Has Been Suspended',
                'Your account has been suspended. Please contact the administrator.',
                instance,
                related_type='User',
                related_id=str(instance.id),
            )


@receiver(post_save, sender='accounts.SchoolProfile')
def notify_school_profile_events(sender, instance, created, **kwargs):
    from django.contrib.auth import get_user_model
    User = get_user_model()

    school_user = instance.user

    if created:
        # Notify PROJECT_MANAGERs first for review
        pms = list(User.objects.filter(role='PROJECT_MANAGER', status='ACTIVE'))
        if pms:
            for pm in pms:
                _sys_notify(
                    'SCHOOL_PROFILE_CREATED',
                    'School Profile Submitted — Needs Review',
                    (
                        f'{instance.school_name} ({school_user.email}) submitted their school profile. '
                        f'Please review and forward to Admin for approval.'
                    ),
                    pm,
                    related_type='SchoolProfile',
                    related_id=str(instance.pk),
                )
        else:
            # Fallback to admins if no PM exists
            for admin in User.objects.filter(role='ADMIN', status='ACTIVE'):
                _sys_notify(
                    'SCHOOL_PROFILE_CREATED',
                    'School Profile Submitted',
                    f'{instance.school_name} ({school_user.email}) submitted their school profile and is awaiting review.',
                    admin,
                    related_type='SchoolProfile',
                    related_id=str(instance.pk),
                )

        # Always confirm to the school user
        _sys_notify(
            'SCHOOL_PROFILE_CREATED',
            'School Profile Submitted',
            f'Your school profile for "{instance.school_name}" has been submitted and is under review.',
            school_user,
            related_type='SchoolProfile',
            related_id=str(instance.pk),
        )
    else:
        # Profile updated → notify PM + admins
        for pm in User.objects.filter(role='PROJECT_MANAGER', status='ACTIVE'):
            _sys_notify(
                'SCHOOL_PROFILE_UPDATED',
                'School Profile Updated',
                f'{instance.school_name} ({school_user.email}) updated their school profile.',
                pm,
                related_type='SchoolProfile',
                related_id=str(instance.pk),
            )
        for admin in User.objects.filter(role='ADMIN', status='ACTIVE'):
            _sys_notify(
                'SCHOOL_PROFILE_UPDATED',
                'School Profile Updated',
                f'{instance.school_name} ({school_user.email}) updated their school profile.',
                admin,
                related_type='SchoolProfile',
                related_id=str(instance.pk),
            )
