# Migration Guide - Extended Features Implementation

## Overview

This guide walks you through integrating the extended features (8 new models, 40+ endpoints) into your existing Ye Ethiopia Lij backend.

## Step 1: Copy Extended Files

### Copy Model File
```bash
# The models_extended.py file contains all 8 new models
cp childprofile/models_extended.py childprofile/
```

### Copy Serializer File
```bash
# The serializers_extended.py file contains all 8 new serializers
cp childprofile/serializers_extended.py childprofile/
```

### Copy View File
```bash
# The views_extended.py file contains all 8 new viewsets
cp childprofile/views_extended.py childprofile/
```

### Copy URL File
```bash
# The urls_extended.py file contains extended URL routing
cp childprofile/urls_extended.py childprofile/
```

## Step 2: Update Main URLs

The main `childprofile/urls.py` has already been updated to include all extended endpoints.

Verify it contains:
```python
from .views_extended import (
    ChildEnrollmentViewSet, SponsorshipPaymentViewSet,
    ChildProgressReportViewSet, DuplicationAlertViewSet,
    ChildNotificationViewSet, FinancialDocumentViewSet,
    ProgramMetricsViewSet, SystemLogViewSet
)

router.register(r'enrollments', ChildEnrollmentViewSet, basename='enrollment')
router.register(r'payments', SponsorshipPaymentViewSet, basename='payment')
router.register(r'progress-reports', ChildProgressReportViewSet, basename='progress-report')
router.register(r'duplication-alerts', DuplicationAlertViewSet, basename='duplication-alert')
router.register(r'notifications', ChildNotificationViewSet, basename='notification')
router.register(r'financial-documents', FinancialDocumentViewSet, basename='financial-document')
router.register(r'program-metrics', ProgramMetricsViewSet, basename='program-metrics')
router.register(r'system-logs', SystemLogViewSet, basename='system-log')
```

## Step 3: Create Migrations

### Generate Migrations
```bash
python manage.py makemigrations childprofile
```

This will create migration files for all 8 new models.

### Review Migrations
```bash
# Check the generated migration files
ls -la childprofile/migrations/
```

### Apply Migrations
```bash
python manage.py migrate childprofile
```

### Verify Migration
```bash
python manage.py migrate --list
# Should show all new migrations as applied
```

## Step 4: Update Settings (if needed)

Verify `config/settings.py` includes:
```python
INSTALLED_APPS = [
    ...
    'childprofile',
    ...
]
```

This should already be configured.

## Step 5: Test the New Endpoints

### Start Development Server
```bash
python manage.py runserver
```

### Access Swagger UI
```
http://localhost:8000/api/docs/
```

### Test Endpoints

#### 1. Test Child Enrollment
```bash
# Create enrollment
curl -X POST http://localhost:8000/api/childs/enrollments/ \
  -H "Authorization: Bearer {school_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "child": "{child_id}",
    "school": "{school_id}",
    "enrollment_date": "2024-01-01",
    "grade_level": "Grade 5",
    "enrollment_number": "ENR-2024-001",
    "class_section": "5A"
  }'

# List enrollments
curl -X GET http://localhost:8000/api/childs/enrollments/ \
  -H "Authorization: Bearer {token}"
```

#### 2. Test Sponsorship Payments
```bash
# Create payment
curl -X POST http://localhost:8000/api/childs/payments/ \
  -H "Authorization: Bearer {admin_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "sponsorship": "{sponsorship_id}",
    "amount": "100.00",
    "payment_date": "2024-01-01",
    "status": "COMPLETED",
    "payment_method": "BANK_TRANSFER",
    "transaction_id": "TXN-2024-001"
  }'

# Get payment summary
curl -X GET "http://localhost:8000/api/childs/payments/payment_summary/?sponsorship_id={sponsorship_id}" \
  -H "Authorization: Bearer {token}"
```

#### 3. Test Progress Reports
```bash
# Create progress report
curl -X POST http://localhost:8000/api/childs/progress-reports/ \
  -H "Authorization: Bearer {school_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "child": "{child_id}",
    "academic_progress": "EXCELLENT",
    "attendance_progress": "GOOD",
    "behavior_progress": "GOOD",
    "overall_progress": "EXCELLENT",
    "summary": "Excellent student",
    "recommendations": "Continue current pace",
    "report_date": "2024-01-01"
  }'

# Get child progress history
curl -X GET "http://localhost:8000/api/childs/progress-reports/child_progress/?child_id={child_id}" \
  -H "Authorization: Bearer {token}"
```

#### 4. Test Duplication Alerts
```bash
# List pending alerts
curl -X GET http://localhost:8000/api/childs/duplication-alerts/pending_alerts/ \
  -H "Authorization: Bearer {admin_token}"

# Resolve duplication
curl -X POST http://localhost:8000/api/childs/duplication-alerts/{alert_id}/resolve_duplicate/ \
  -H "Authorization: Bearer {admin_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "merge",
    "notes": "Confirmed duplicate"
  }'
```

#### 5. Test Notifications
```bash
# List notifications
curl -X GET http://localhost:8000/api/childs/notifications/ \
  -H "Authorization: Bearer {token}"

# Mark as read
curl -X POST http://localhost:8000/api/childs/notifications/{notification_id}/mark_as_read/ \
  -H "Authorization: Bearer {token}"

# Get unread count
curl -X GET http://localhost:8000/api/childs/notifications/unread_count/ \
  -H "Authorization: Bearer {token}"
```

#### 6. Test Financial Documents
```bash
# Upload document
curl -X POST http://localhost:8000/api/childs/financial-documents/ \
  -H "Authorization: Bearer {admin_token}" \
  -F "sponsorship={sponsorship_id}" \
  -F "document_type=SPONSORSHIP_AGREEMENT" \
  -F "document_file=@agreement.pdf" \
  -F "document_date=2024-01-01"

# Approve document
curl -X POST http://localhost:8000/api/childs/financial-documents/{document_id}/approve_document/ \
  -H "Authorization: Bearer {admin_token}" \
  -H "Content-Type: application/json" \
  -d '{"notes": "Approved"}'
```

#### 7. Test Program Metrics
```bash
# Get latest metrics
curl -X GET http://localhost:8000/api/childs/program-metrics/latest_metrics/ \
  -H "Authorization: Bearer {token}"

# Get metrics range
curl -X GET "http://localhost:8000/api/childs/program-metrics/metrics_range/?start_date=2024-01-01&end_date=2024-01-31" \
  -H "Authorization: Bearer {token}"
```

#### 8. Test System Logs
```bash
# Get recent activity
curl -X GET "http://localhost:8000/api/childs/system-logs/recent_activity/?limit=50" \
  -H "Authorization: Bearer {admin_token}"

# Get error logs
curl -X GET http://localhost:8000/api/childs/system-logs/error_logs/ \
  -H "Authorization: Bearer {admin_token}"
```

## Step 6: Verify Database

### Check Tables Created
```bash
# Connect to MongoDB
mongo

# Switch to database
use ye_ethiopia_lij_db

# List collections
show collections

# Should include:
# - childprofile_childenrollment
# - childprofile_sponsorshippayment
# - childprofile_childprogressreport
# - childprofile_duplicationalert
# - childprofile_childnotification
# - childprofile_financialdocument
# - childprofile_programmetrics
# - childprofile_systemlog
```

### Verify Indexes
```bash
# Check indexes on a collection
db.childprofile_childenrollment.getIndexes()
```

## Step 7: Update Documentation

### Update API Documentation
The Swagger UI will automatically include all new endpoints.

### Update README
Add to README.md:
```markdown
## Extended Features

### Child Enrollment (UC-17)
- Enroll children in schools
- Track enrollment status
- Manage class assignments

### Sponsorship Payments
- Record and track payments
- Generate payment reports
- Verify transactions

### Child Progress Reports (UC-15)
- Track academic and behavioral progress
- Submit progress reports
- View progress history

### Duplication Alerts (UC-11)
- Automated duplicate detection
- Admin review and resolution
- Merge duplicate records

### Notifications
- Send notifications to users
- Track notification status
- Mark as read

### Financial Documents (UC-19)
- Upload financial documents
- Admin review and approval
- Track document status

### Program Metrics (UC-07)
- Monitor program performance
- Generate reports
- Track trends

### System Logs
- Log all system activities
- Monitor system events
- Debug errors
```

## Step 8: Run Tests

### Create Test Data
```bash
# Create test school
curl -X POST http://localhost:8000/api/accounts/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "school@example.com",
    "name": "Test School",
    "role": "SCHOOL",
    "password": "SecurePass123!",
    "password_confirm": "SecurePass123!"
  }'

# Approve school (as admin)
curl -X POST http://localhost:8000/api/accounts/manage/{school_user_id}/change-status/ \
  -H "Authorization: Bearer {admin_token}" \
  -H "Content-Type: application/json" \
  -d '{"status": "ACTIVE"}'
```

### Run Unit Tests
```bash
python manage.py test childprofile
```

### Run Integration Tests
```bash
# Test all endpoints manually or with test suite
python manage.py test
```

## Step 9: Deploy to Production

### Pre-Deployment Checklist
- [ ] All tests passing
- [ ] No security warnings
- [ ] Database migrations tested
- [ ] Endpoints tested
- [ ] Documentation updated
- [ ] Permissions verified
- [ ] Error handling verified

### Deployment Steps
```bash
# 1. Backup database
mongodump --db ye_ethiopia_lij_db

# 2. Apply migrations
python manage.py migrate

# 3. Collect static files
python manage.py collectstatic --noinput

# 4. Restart application
# (depends on your deployment method)

# 5. Verify endpoints
curl http://your-domain/api/childs/program-metrics/latest_metrics/
```

## Troubleshooting

### Migration Errors
```bash
# If migration fails, check:
python manage.py showmigrations childprofile

# Rollback if needed:
python manage.py migrate childprofile 0001_initial
```

### Import Errors
```bash
# Ensure all imports are correct in views_extended.py
# Check that models_extended.py is in childprofile directory
# Verify serializers_extended.py is in childprofile directory
```

### Permission Errors
```bash
# Verify user roles are set correctly
# Check permission classes in views_extended.py
# Ensure JWT tokens are valid
```

### Database Errors
```bash
# Verify MongoDB is running
mongod

# Check connection string in .env
MONGO_HOST=localhost
MONGO_PORT=27017
```

## Rollback Plan

If you need to rollback:

```bash
# 1. Backup current data
mongodump --db ye_ethiopia_lij_db

# 2. Rollback migrations
python manage.py migrate childprofile 0001_initial

# 3. Remove extended files
rm childprofile/models_extended.py
rm childprofile/serializers_extended.py
rm childprofile/views_extended.py
rm childprofile/urls_extended.py

# 4. Restore original urls.py
git checkout childprofile/urls.py

# 5. Restart application
```

## Verification Checklist

After migration:
- [ ] All 8 new models created
- [ ] All 40+ endpoints accessible
- [ ] All permissions working
- [ ] All validations active
- [ ] All error handling working
- [ ] Audit logging operational
- [ ] Database indexes created
- [ ] Swagger UI updated
- [ ] Documentation updated
- [ ] Tests passing

## Support

If you encounter issues:
1. Check the troubleshooting section
2. Review error logs: `logs/django.log`
3. Check MongoDB logs
4. Review EXTENDED_ENDPOINTS.md for endpoint details
5. Review EXTENDED_FEATURES_SUMMARY.md for feature details

---

**Last Updated**: 2024
**Status**: ✅ READY FOR MIGRATION
