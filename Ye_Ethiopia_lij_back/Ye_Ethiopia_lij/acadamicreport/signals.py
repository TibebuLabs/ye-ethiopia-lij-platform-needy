from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import AcademicReport
from childprofile.models_extended import ChildNotification


def _notify(child, notification_type, title, message, recipient):
    try:
        ChildNotification.objects.create(
            child=child,
            notification_type=notification_type,
            title=title,
            message=message,
            recipient=recipient,
        )
    except Exception:
        pass


def _sys_notify(notification_type, title, message, recipient):
    """Notify without a child (system-level)."""
    try:
        ChildNotification.objects.create(
            child=None,
            notification_type=notification_type,
            title=title,
            message=message,
            recipient=recipient,
        )
    except Exception:
        pass


@receiver(post_save, sender=AcademicReport)
def notify_academic_report(sender, instance, created, **kwargs):
    if not created:
        return

    child = instance.child
    org_staff = child.organization

    # Notify the org staff whose child this report belongs to
    _notify(
        child=child,
        notification_type='REPORT_SUBMITTED',
        title='Academic Report Submitted',
        message=f'A {instance.term} academic report for {child.full_name} ({instance.academic_year}) was submitted by {instance.school_name}. Score: {instance.average_score}%.',
        recipient=org_staff,       # ← only the org that owns this child
    )

    # Notify the active sponsor of this child (if any)
    try:
        sponsorship = child.sponsorship
        if sponsorship and sponsorship.is_active:
            _notify(
                child=child,
                notification_type='REPORT_SUBMITTED',
                title='Academic Report Available',
                message=f'A new academic report for {child.full_name} is available. {instance.term} {instance.academic_year} — Score: {instance.average_score}%, Attendance: {instance.attendance_rate}%.',
                recipient=sponsorship.sponsor,   # ← only this child's sponsor
            )
    except Exception:
        pass
