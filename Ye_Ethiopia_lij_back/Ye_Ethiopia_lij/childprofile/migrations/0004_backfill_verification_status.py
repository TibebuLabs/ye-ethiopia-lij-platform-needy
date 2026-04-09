from django.db import migrations


def backfill_verification_status(apps, schema_editor):
    """Set verification_status='PENDING' on records where it is NULL/None."""
    Sponsorship = apps.get_model('childprofile', 'Sponsorship')
    # Records with no verification_status → PENDING
    Sponsorship.objects.filter(verification_status__isnull=True).update(verification_status='PENDING')
    # Records that are already active (is_active=True) but have no status → VERIFIED
    Sponsorship.objects.filter(is_active=True, verification_status='PENDING').update(verification_status='VERIFIED')


class Migration(migrations.Migration):

    dependencies = [
        ('childprofile', '0003_sponsorship_payment_proof'),
    ]

    operations = [
        migrations.RunPython(backfill_verification_status, migrations.RunPython.noop),
    ]
