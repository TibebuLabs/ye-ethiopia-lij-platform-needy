# Quick Migration & Run Guide

## Prerequisites

Ensure you have:
- Python 3.8+
- MongoDB running
- Virtual environment activated
- All dependencies installed

```bash
# Verify Python
python --version

# Verify MongoDB is running
mongod --version

# Activate virtual environment
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate  # Windows

# Verify dependencies
pip list | grep Django
```

---

## Step 1: Verify Files Are in Place

```bash
# Check if extended files exist
ls -la childprofile/models_extended.py
ls -la childprofile/serializers_extended.py
ls -la childprofile/views_extended.py
ls -la childprofile/urls_extended.py

# Check if main urls.py is updated
grep "views_extended" childprofile/urls.py
```

If files are missing, they should be in your project directory.

---

## Step 2: Create Migrations

### Generate Migration Files

```bash
# Create migrations for new models
python manage.py makemigrations childprofile

# Output should show:
# Migrations for 'childprofile':
#   childprofile/migrations/XXXX_auto_YYYYMMDD_HHMM.py
#     - Create model ChildEnrollment
#     - Create model SponsorshipPayment
#     - Create model ChildProgressReport
#     - Create model DuplicationAlert
#     - Create model ChildNotification
#     - Create model FinancialDocument
#     - Create model ProgramMetrics
#     - Create model SystemLog
```

### Verify Migration File

```bash
# Check the generated migration
cat childprofile/migrations/XXXX_auto_YYYYMMDD_HHMM.py

# Should contain all 8 models
```

---

## Step 3: Apply Migrations

### Run Migrations

```bash
# Apply all migrations
python manage.py migrate

# Output should show:
# Running migrations:
#   Applying childprofile.XXXX_auto_YYYYMMDD_HHMM... OK
```

### Verify Migrations Applied

```bash
# Check migration status
python manage.py migrate --list

# Should show all migrations as applied (marked with [X])
```

---

## Step 4: Verify Database

### Check MongoDB Collections

```bash
# Connect to MongoDB
mongo

# In MongoDB shell:
use ye_ethiopia_lij_db

# List all collections
show collections

# Should include:
# childprofile_childenrollment
# childprofile_sponsorshippayment
# childprofile_childprogressreport
# childprofile_duplicationalert
# childprofile_childnotification
# childprofile_financialdocument
# childprofile_programmetrics
# childprofile_systemlog

# Exit MongoDB
exit
```

---

## Step 5: Start Development Server

### Run Django Server

```bash
# Start the development server
python manage.py runserver

# Output should show:
# Starting development server at http://127.0.0.1:8000/
# Quit the server with CONTROL-C.
```

### Verify Server is Running

```bash
# In another terminal, test the server
curl http://localhost:8000/api/docs/

# Should return HTML (Swagger UI)
```

---

## Step 6: Access API Documentation

### Open Swagger UI

```
http://localhost:8000/api/docs/
```

You should see all endpoints including:
- `/api/childs/enrollments/`
- `/api/childs/payments/`
- `/api/childs/progress-reports/`
- `/api/childs/duplication-alerts/`
- `/api/childs/notifications/`
- `/api/childs/financial-documents/`
- `/api/childs/program-metrics/`
- `/api/childs/system-logs/`

---

## Step 7: Test Endpoints

### 7.1 Create Test Users

```bash
# Create a school user
curl -X POST http://localhost:8000/api/accounts/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "school@test.com",
    "name": "Test School",
    "role": "SCHOOL",
    "password": "TestPass123!",
    "password_confirm": "TestPass123!"
  }'

# Response:
# {
#   "message": "Welcome Test School! Please verify your email.",
#   "data": {
#     "id": "school-uuid",
#     "email": "school@test.com",
#     "role": "SCHOOL",
#     "status": "PENDING"
#   }
# }

# Save the school user ID
SCHOOL_ID="school-uuid"
```

### 7.2 Approve School User (as Admin)

```bash
# Login as admin first
curl -X POST http://localhost:8000/api/accounts/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "AdminPass123!"
  }'

# Response:
# {
#   "access": "admin-token",
#   "refresh": "refresh-token"
# }

# Save the admin token
ADMIN_TOKEN="admin-token"

# Approve school user
curl -X POST http://localhost:8000/api/accounts/manage/$SCHOOL_ID/change-status/ \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "ACTIVE"}'

# Response:
# {
#   "message": "User status changed to ACTIVE",
#   "data": {
#     "status": "ACTIVE",
#     "is_active": true
#   }
# }
```

### 7.3 Login as School

```bash
# Login as school
curl -X POST http://localhost:8000/api/accounts/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "school@test.com",
    "password": "TestPass123!"
  }'

# Response:
# {
#   "access": "school-token",
#   "refresh": "refresh-token"
# }

# Save the school token
SCHOOL_TOKEN="school-token"
```

### 7.4 Test Child Enrollment Endpoint

```bash
# Get a child ID first (from existing children)
curl -X GET http://localhost:8000/api/childs/list/ \
  -H "Authorization: Bearer $SCHOOL_TOKEN"

# Save a child ID
CHILD_ID="child-uuid"

# Create enrollment
curl -X POST http://localhost:8000/api/childs/enrollments/ \
  -H "Authorization: Bearer $SCHOOL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "child": "'$CHILD_ID'",
    "school": "'$SCHOOL_ID'",
    "enrollment_date": "2024-01-01",
    "grade_level": "Grade 5",
    "enrollment_number": "ENR-2024-001",
    "class_section": "5A"
  }'

# Response:
# {
#   "id": "enrollment-uuid",
#   "child": "child-uuid",
#   "child_name": "Abebe Kebede",
#   "school": "school-uuid",
#   "school_name": "Test School",
#   "enrollment_date": "2024-01-01",
#   "grade_level": "Grade 5",
#   "status": "ENROLLED",
#   "enrollment_number": "ENR-2024-001",
#   "class_section": "5A",
#   "created_at": "2024-01-01T00:00:00Z",
#   "updated_at": "2024-01-01T00:00:00Z"
# }
```

### 7.5 Test Progress Report Endpoint

```bash
# Create progress report
curl -X POST http://localhost:8000/api/childs/progress-reports/ \
  -H "Authorization: Bearer $SCHOOL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "child": "'$CHILD_ID'",
    "academic_progress": "EXCELLENT",
    "attendance_progress": "GOOD",
    "behavior_progress": "GOOD",
    "overall_progress": "EXCELLENT",
    "summary": "Excellent student with strong performance",
    "recommendations": "Continue current pace",
    "report_date": "2024-01-01"
  }'

# Response:
# {
#   "id": "report-uuid",
#   "child": "child-uuid",
#   "child_name": "Abebe Kebede",
#   "academic_progress": "EXCELLENT",
#   "attendance_progress": "GOOD",
#   "behavior_progress": "GOOD",
#   "overall_progress": "EXCELLENT",
#   "summary": "Excellent student with strong performance",
#   "recommendations": "Continue current pace",
#   "reported_by": "school-uuid",
#   "reported_by_name": "Test School",
#   "report_date": "2024-01-01",
#   "created_at": "2024-01-01T00:00:00Z",
#   "updated_at": "2024-01-01T00:00:00Z"
# }
```

### 7.6 Test Program Metrics Endpoint

```bash
# Get latest metrics
curl -X GET http://localhost:8000/api/childs/program-metrics/latest_metrics/ \
  -H "Authorization: Bearer $SCHOOL_TOKEN"

# Response:
# {
#   "id": "metrics-uuid",
#   "metric_date": "2024-01-01",
#   "total_children_registered": 150,
#   "total_children_sponsored": 120,
#   "total_children_unsponsored": 30,
#   "total_sponsorships": 120,
#   "active_sponsorships": 115,
#   "total_commitment_amount": "12000.00",
#   "total_interventions": 450,
#   "health_interventions": 150,
#   "education_interventions": 150,
#   "nutrition_interventions": 100,
#   "clothing_interventions": 50,
#   "average_attendance_rate": "92.50",
#   "average_score": "78.50",
#   "total_organizations": 10,
#   "active_organizations": 9,
#   "total_users": 50,
#   "total_sponsors": 30,
#   "total_schools": 5,
#   "created_at": "2024-01-01T00:00:00Z",
#   "updated_at": "2024-01-01T00:00:00Z"
# }
```

### 7.7 Test Notifications Endpoint

```bash
# Get notifications
curl -X GET http://localhost:8000/api/childs/notifications/ \
  -H "Authorization: Bearer $SCHOOL_TOKEN"

# Response:
# {
#   "count": 5,
#   "next": null,
#   "previous": null,
#   "results": [
#     {
#       "id": "notification-uuid",
#       "child": "child-uuid",
#       "child_name": "Abebe Kebede",
#       "notification_type": "PROFILE_APPROVED",
#       "title": "Profile Approved",
#       "message": "Your profile has been approved",
#       "recipient": "school-uuid",
#       "recipient_name": "Test School",
#       "is_read": false,
#       "read_at": null,
#       "created_at": "2024-01-01T00:00:00Z"
#     }
#   ]
# }

# Get unread count
curl -X GET http://localhost:8000/api/childs/notifications/unread_count/ \
  -H "Authorization: Bearer $SCHOOL_TOKEN"

# Response:
# {
#   "unread_count": 5
# }
```

---

## Step 8: Verify All Endpoints

### List All Available Endpoints

```bash
# Get schema
curl -X GET http://localhost:8000/api/schema/ \
  -H "Authorization: Bearer $SCHOOL_TOKEN"

# Or access Swagger UI
# http://localhost:8000/api/docs/
```

### Test Each Endpoint Category

```bash
# 1. Child Enrollments
curl -X GET http://localhost:8000/api/childs/enrollments/ \
  -H "Authorization: Bearer $SCHOOL_TOKEN"

# 2. Sponsorship Payments
curl -X GET http://localhost:8000/api/childs/payments/ \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# 3. Progress Reports
curl -X GET http://localhost:8000/api/childs/progress-reports/ \
  -H "Authorization: Bearer $SCHOOL_TOKEN"

# 4. Duplication Alerts
curl -X GET http://localhost:8000/api/childs/duplication-alerts/ \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# 5. Notifications
curl -X GET http://localhost:8000/api/childs/notifications/ \
  -H "Authorization: Bearer $SCHOOL_TOKEN"

# 6. Financial Documents
curl -X GET http://localhost:8000/api/childs/financial-documents/ \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# 7. Program Metrics
curl -X GET http://localhost:8000/api/childs/program-metrics/ \
  -H "Authorization: Bearer $SCHOOL_TOKEN"

# 8. System Logs
curl -X GET http://localhost:8000/api/childs/system-logs/ \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

---

## Troubleshooting

### Issue: Migration Fails

```bash
# Check for syntax errors
python manage.py makemigrations --dry-run

# If error, check models_extended.py for issues
# Common issues:
# - Missing imports
# - Invalid field definitions
# - Circular imports

# Solution: Fix the error and try again
python manage.py makemigrations childprofile
```

### Issue: Import Error

```bash
# Error: "No module named 'childprofile.models_extended'"

# Solution: Verify file exists
ls -la childprofile/models_extended.py

# If missing, copy the file to childprofile directory
# Then try again:
python manage.py makemigrations childprofile
```

### Issue: Permission Denied

```bash
# Error: "Permission denied" when accessing endpoints

# Solution: Ensure user has correct role
# Check user role:
curl -X GET http://localhost:8000/api/accounts/manage/ \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# Verify user status is ACTIVE
# Change status if needed:
curl -X POST http://localhost:8000/api/accounts/manage/{user_id}/change-status/ \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "ACTIVE"}'
```

### Issue: Database Connection Error

```bash
# Error: "Connection refused" or "Cannot connect to MongoDB"

# Solution: Verify MongoDB is running
mongod --version

# Start MongoDB if not running:
mongod

# Verify connection string in .env:
cat .env | grep MONGO
```

### Issue: Endpoint Not Found

```bash
# Error: 404 Not Found

# Solution: Verify URLs are updated
grep "views_extended" childprofile/urls.py

# Verify router is registered:
grep "router.register" childprofile/urls.py

# Restart server:
python manage.py runserver
```

---

## Complete Test Script

Save this as `test_extended_features.sh`:

```bash
#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "Testing Extended Features..."

# Test 1: Child Enrollments
echo -e "\n${GREEN}Test 1: Child Enrollments${NC}"
curl -X GET http://localhost:8000/api/childs/enrollments/ \
  -H "Authorization: Bearer $SCHOOL_TOKEN" \
  -s | python -m json.tool

# Test 2: Progress Reports
echo -e "\n${GREEN}Test 2: Progress Reports${NC}"
curl -X GET http://localhost:8000/api/childs/progress-reports/ \
  -H "Authorization: Bearer $SCHOOL_TOKEN" \
  -s | python -m json.tool

# Test 3: Notifications
echo -e "\n${GREEN}Test 3: Notifications${NC}"
curl -X GET http://localhost:8000/api/childs/notifications/ \
  -H "Authorization: Bearer $SCHOOL_TOKEN" \
  -s | python -m json.tool

# Test 4: Program Metrics
echo -e "\n${GREEN}Test 4: Program Metrics${NC}"
curl -X GET http://localhost:8000/api/childs/program-metrics/latest_metrics/ \
  -H "Authorization: Bearer $SCHOOL_TOKEN" \
  -s | python -m json.tool

echo -e "\n${GREEN}All tests completed!${NC}"
```

Run the script:
```bash
chmod +x test_extended_features.sh
./test_extended_features.sh
```

---

## Summary

### Migration Steps
1. ✅ Verify files are in place
2. ✅ Create migrations: `python manage.py makemigrations childprofile`
3. ✅ Apply migrations: `python manage.py migrate`
4. ✅ Verify database: Check MongoDB collections

### Running Steps
1. ✅ Start server: `python manage.py runserver`
2. ✅ Access Swagger: http://localhost:8000/api/docs/
3. ✅ Create test users
4. ✅ Test endpoints
5. ✅ Verify all features working

### Verification
- ✅ 8 new models created
- ✅ 40+ new endpoints available
- ✅ All permissions working
- ✅ All validations active
- ✅ Error handling operational
- ✅ Audit logging working

---

## Next Steps

1. **Test all endpoints** using Swagger UI
2. **Create test data** for each feature
3. **Verify permissions** for each role
4. **Check error handling** with invalid inputs
5. **Review audit logs** for all actions
6. **Deploy to staging** for integration testing
7. **Deploy to production** after verification

---

**Status**: ✅ READY TO MIGRATE AND RUN
**Last Updated**: 2024
