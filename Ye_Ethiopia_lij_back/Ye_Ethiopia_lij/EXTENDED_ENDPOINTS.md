# Extended API Endpoints - Complete Use Case Coverage

## New Endpoints Added

### 1. Child Enrollment Endpoints (UC-17)

#### List Enrollments
```
GET /api/childs/enrollments/
Authorization: Bearer {token}

Query Parameters:
- child={child_id}
- school={school_id}
- status=ENROLLED|GRADUATED|DROPPED
- page=1
- page_size=20

Response: 200 OK
{
  "count": 5,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "uuid",
      "child": "uuid",
      "child_name": "Abebe Kebede",
      "school": "uuid",
      "school_name": "ABC School",
      "enrollment_date": "2024-01-01",
      "grade_level": "Grade 5",
      "status": "ENROLLED",
      "enrollment_number": "ENR-2024-001",
      "class_section": "5A",
      "enrollment_document": "http://...",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### Create Enrollment
```
POST /api/childs/enrollments/
Authorization: Bearer {school_token}
Content-Type: multipart/form-data

child: {child_id}
school: {school_id}
enrollment_date: 2024-01-01
grade_level: Grade 5
enrollment_number: ENR-2024-001
class_section: 5A
enrollment_document: <file>

Response: 201 Created
{
  "id": "uuid",
  ...
}
```

#### Get Active Enrollments
```
GET /api/childs/enrollments/active_enrollments/
Authorization: Bearer {school_token}

Response: 200 OK
[
  {
    "id": "uuid",
    "child": "uuid",
    "child_name": "Abebe Kebede",
    ...
  }
]
```

---

### 2. Sponsorship Payment Endpoints

#### List Payments
```
GET /api/childs/payments/
Authorization: Bearer {token}

Query Parameters:
- sponsorship={sponsorship_id}
- status=PENDING|COMPLETED|FAILED
- payment_method=BANK_TRANSFER|CARD|CASH
- page=1

Response: 200 OK
{
  "count": 10,
  "results": [
    {
      "id": "uuid",
      "sponsorship": "uuid",
      "sponsor_name": "John Sponsor",
      "child_name": "Abebe Kebede",
      "amount": "100.00",
      "payment_date": "2024-01-01",
      "status": "COMPLETED",
      "payment_method": "BANK_TRANSFER",
      "transaction_id": "TXN-2024-001",
      "receipt": "http://...",
      "notes": "Monthly payment",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### Create Payment
```
POST /api/childs/payments/
Authorization: Bearer {admin_token}
Content-Type: multipart/form-data

sponsorship: {sponsorship_id}
amount: 100.00
payment_date: 2024-01-01
status: COMPLETED
payment_method: BANK_TRANSFER
transaction_id: TXN-2024-001
receipt: <file>
notes: Monthly payment

Response: 201 Created
{
  "id": "uuid",
  ...
}
```

#### Get Payment Summary
```
GET /api/childs/payments/payment_summary/?sponsorship_id={sponsorship_id}
Authorization: Bearer {token}

Response: 200 OK
{
  "total_paid": 1000.00,
  "pending": 200.00,
  "payment_count": 12,
  "completed_count": 10
}
```

---

### 3. Child Progress Report Endpoints (UC-15)

#### List Progress Reports
```
GET /api/childs/progress-reports/
Authorization: Bearer {token}

Query Parameters:
- child={child_id}
- overall_progress=EXCELLENT|GOOD|SATISFACTORY|NEEDS_IMPROVEMENT
- page=1

Response: 200 OK
{
  "count": 5,
  "results": [
    {
      "id": "uuid",
      "child": "uuid",
      "child_name": "Abebe Kebede",
      "academic_progress": "EXCELLENT",
      "attendance_progress": "GOOD",
      "behavior_progress": "GOOD",
      "overall_progress": "EXCELLENT",
      "summary": "Excellent student with strong performance",
      "recommendations": "Continue current pace",
      "reported_by": "uuid",
      "reported_by_name": "School Staff",
      "report_date": "2024-01-01",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### Create Progress Report
```
POST /api/childs/progress-reports/
Authorization: Bearer {school_token}
Content-Type: application/json

{
  "child": "{child_id}",
  "academic_progress": "EXCELLENT",
  "attendance_progress": "GOOD",
  "behavior_progress": "GOOD",
  "overall_progress": "EXCELLENT",
  "summary": "Excellent student with strong performance",
  "recommendations": "Continue current pace",
  "report_date": "2024-01-01"
}

Response: 201 Created
{
  "id": "uuid",
  ...
}
```

#### Get Child Progress History
```
GET /api/childs/progress-reports/child_progress/?child_id={child_id}
Authorization: Bearer {token}

Response: 200 OK
[
  {
    "id": "uuid",
    "report_date": "2024-01-01",
    "overall_progress": "EXCELLENT",
    ...
  },
  {
    "id": "uuid",
    "report_date": "2023-12-01",
    "overall_progress": "GOOD",
    ...
  }
]
```

---

### 4. Duplication Alert Endpoints (UC-11)

#### List Duplication Alerts
```
GET /api/childs/duplication-alerts/
Authorization: Bearer {admin_token}

Query Parameters:
- status=PENDING|CONFIRMED|FALSE_POSITIVE|MERGED|RESOLVED
- page=1

Response: 200 OK
{
  "count": 3,
  "results": [
    {
      "id": "uuid",
      "primary_child": "uuid",
      "primary_child_name": "Abebe Kebede",
      "duplicate_child": "uuid",
      "duplicate_child_name": "Abebe Kebede",
      "similarity_score": 95.5,
      "matching_fields": {
        "name": true,
        "location": true,
        "age": true,
        "guardian": true
      },
      "status": "PENDING",
      "resolved_by": null,
      "resolved_by_name": null,
      "resolution_notes": "",
      "created_at": "2024-01-01T00:00:00Z",
      "resolved_at": null
    }
  ]
}
```

#### Resolve Duplication - Merge
```
POST /api/childs/duplication-alerts/{alert_id}/resolve_duplicate/
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "action": "merge",
  "notes": "Confirmed duplicate - merged records"
}

Response: 200 OK
{
  "message": "Duplication alert resolved as merge",
  "data": {
    "id": "uuid",
    "status": "MERGED",
    "resolved_by": "uuid",
    "resolved_at": "2024-01-01T00:00:00Z",
    ...
  }
}
```

#### Resolve Duplication - False Positive
```
POST /api/childs/duplication-alerts/{alert_id}/resolve_duplicate/
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "action": "false_positive",
  "notes": "Different children with similar names"
}

Response: 200 OK
{
  "message": "Duplication alert resolved as false_positive",
  "data": {
    "id": "uuid",
    "status": "FALSE_POSITIVE",
    ...
  }
}
```

#### Get Pending Alerts
```
GET /api/childs/duplication-alerts/pending_alerts/
Authorization: Bearer {admin_token}

Response: 200 OK
[
  {
    "id": "uuid",
    "similarity_score": 95.5,
    "status": "PENDING",
    ...
  }
]
```

---

### 5. Child Notification Endpoints

#### List Notifications
```
GET /api/childs/notifications/
Authorization: Bearer {token}

Query Parameters:
- is_read=true|false
- notification_type=PROFILE_APPROVED|SPONSORED|etc
- page=1

Response: 200 OK
{
  "count": 10,
  "results": [
    {
      "id": "uuid",
      "child": "uuid",
      "child_name": "Abebe Kebede",
      "notification_type": "PROFILE_APPROVED",
      "title": "Profile Approved",
      "message": "Your profile has been approved and is now visible to sponsors",
      "recipient": "uuid",
      "recipient_name": "NGO Staff",
      "is_read": false,
      "read_at": null,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### Mark Notification as Read
```
POST /api/childs/notifications/{notification_id}/mark_as_read/
Authorization: Bearer {token}

Response: 200 OK
{
  "message": "Notification marked as read",
  "data": {
    "id": "uuid",
    "is_read": true,
    "read_at": "2024-01-01T00:00:00Z",
    ...
  }
}
```

#### Get Unread Count
```
GET /api/childs/notifications/unread_count/
Authorization: Bearer {token}

Response: 200 OK
{
  "unread_count": 5
}
```

---

### 6. Financial Document Endpoints (UC-19)

#### List Financial Documents
```
GET /api/childs/financial-documents/
Authorization: Bearer {token}

Query Parameters:
- sponsorship={sponsorship_id}
- document_type=SPONSORSHIP_AGREEMENT|PAYMENT_RECEIPT|etc
- status=PENDING|APPROVED|REJECTED
- page=1

Response: 200 OK
{
  "count": 5,
  "results": [
    {
      "id": "uuid",
      "sponsorship": "uuid",
      "child_name": "Abebe Kebede",
      "document_type": "SPONSORSHIP_AGREEMENT",
      "document_file": "http://...",
      "document_date": "2024-01-01",
      "status": "APPROVED",
      "reviewed_by": "uuid",
      "reviewed_by_name": "Admin",
      "review_notes": "Approved",
      "reviewed_at": "2024-01-01T00:00:00Z",
      "amount": "100.00",
      "description": "Monthly sponsorship agreement",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### Upload Financial Document
```
POST /api/childs/financial-documents/
Authorization: Bearer {admin_token}
Content-Type: multipart/form-data

sponsorship: {sponsorship_id}
document_type: SPONSORSHIP_AGREEMENT
document_file: <file>
document_date: 2024-01-01
amount: 100.00
description: Monthly sponsorship agreement

Response: 201 Created
{
  "id": "uuid",
  ...
}
```

#### Approve Document
```
POST /api/childs/financial-documents/{document_id}/approve_document/
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "notes": "Document verified and approved"
}

Response: 200 OK
{
  "message": "Document approved",
  "data": {
    "id": "uuid",
    "status": "APPROVED",
    "reviewed_by": "uuid",
    "reviewed_at": "2024-01-01T00:00:00Z",
    ...
  }
}
```

#### Reject Document
```
POST /api/childs/financial-documents/{document_id}/reject_document/
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "notes": "Missing required information"
}

Response: 200 OK
{
  "message": "Document rejected",
  "data": {
    "id": "uuid",
    "status": "REJECTED",
    "reviewed_by": "uuid",
    "reviewed_at": "2024-01-01T00:00:00Z",
    ...
  }
}
```

---

### 7. Program Metrics Endpoints (UC-07)

#### List Program Metrics
```
GET /api/childs/program-metrics/
Authorization: Bearer {token}

Query Parameters:
- page=1

Response: 200 OK
{
  "count": 30,
  "results": [
    {
      "id": "uuid",
      "metric_date": "2024-01-01",
      "total_children_registered": 150,
      "total_children_sponsored": 120,
      "total_children_unsponsored": 30,
      "total_sponsorships": 120,
      "active_sponsorships": 115,
      "total_commitment_amount": "12000.00",
      "total_interventions": 450,
      "health_interventions": 150,
      "education_interventions": 150,
      "nutrition_interventions": 100,
      "clothing_interventions": 50,
      "average_attendance_rate": "92.50",
      "average_score": "78.50",
      "total_organizations": 10,
      "active_organizations": 9,
      "total_users": 50,
      "total_sponsors": 30,
      "total_schools": 5,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### Get Latest Metrics
```
GET /api/childs/program-metrics/latest_metrics/
Authorization: Bearer {token}

Response: 200 OK
{
  "id": "uuid",
  "metric_date": "2024-01-01",
  "total_children_registered": 150,
  ...
}
```

#### Get Metrics for Date Range
```
GET /api/childs/program-metrics/metrics_range/?start_date=2024-01-01&end_date=2024-01-31
Authorization: Bearer {token}

Response: 200 OK
[
  {
    "id": "uuid",
    "metric_date": "2024-01-01",
    ...
  },
  {
    "id": "uuid",
    "metric_date": "2024-01-02",
    ...
  }
]
```

---

### 8. System Log Endpoints

#### List System Logs
```
GET /api/childs/system-logs/
Authorization: Bearer {admin_token}

Query Parameters:
- log_type=USER_ACTION|SYSTEM_EVENT|ERROR|SECURITY
- status=SUCCESS|FAILED
- user={user_id}
- page=1

Response: 200 OK
{
  "count": 1000,
  "results": [
    {
      "id": "uuid",
      "log_type": "USER_ACTION",
      "user": "uuid",
      "user_name": "John Sponsor",
      "action": "SPONSOR_CHILD",
      "resource_type": "ChildProfile",
      "resource_id": "uuid",
      "details": {
        "child_name": "Abebe Kebede",
        "amount": "100.00"
      },
      "status": "SUCCESS",
      "error_message": "",
      "ip_address": "192.168.1.1",
      "user_agent": "Mozilla/5.0...",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### Get Recent Activity
```
GET /api/childs/system-logs/recent_activity/?limit=50
Authorization: Bearer {admin_token}

Response: 200 OK
[
  {
    "id": "uuid",
    "action": "SPONSOR_CHILD",
    "status": "SUCCESS",
    "created_at": "2024-01-01T00:00:00Z",
    ...
  }
]
```

#### Get Error Logs
```
GET /api/childs/system-logs/error_logs/
Authorization: Bearer {admin_token}

Response: 200 OK
[
  {
    "id": "uuid",
    "log_type": "ERROR",
    "action": "REGISTER_CHILD",
    "status": "FAILED",
    "error_message": "Validation error: age must be between 0 and 18",
    "created_at": "2024-01-01T00:00:00Z",
    ...
  }
]
```

---

## Complete Endpoint Summary

### Child Enrollment (UC-17)
```
GET    /api/childs/enrollments/
POST   /api/childs/enrollments/
GET    /api/childs/enrollments/{id}/
PUT    /api/childs/enrollments/{id}/
DELETE /api/childs/enrollments/{id}/
GET    /api/childs/enrollments/active_enrollments/
```

### Sponsorship Payments
```
GET    /api/childs/payments/
POST   /api/childs/payments/
GET    /api/childs/payments/{id}/
PUT    /api/childs/payments/{id}/
DELETE /api/childs/payments/{id}/
GET    /api/childs/payments/payment_summary/
```

### Child Progress Reports (UC-15)
```
GET    /api/childs/progress-reports/
POST   /api/childs/progress-reports/
GET    /api/childs/progress-reports/{id}/
PUT    /api/childs/progress-reports/{id}/
DELETE /api/childs/progress-reports/{id}/
GET    /api/childs/progress-reports/child_progress/
```

### Duplication Alerts (UC-11)
```
GET    /api/childs/duplication-alerts/
GET    /api/childs/duplication-alerts/{id}/
POST   /api/childs/duplication-alerts/{id}/resolve_duplicate/
GET    /api/childs/duplication-alerts/pending_alerts/
```

### Notifications
```
GET    /api/childs/notifications/
GET    /api/childs/notifications/{id}/
POST   /api/childs/notifications/{id}/mark_as_read/
GET    /api/childs/notifications/unread_count/
```

### Financial Documents (UC-19)
```
GET    /api/childs/financial-documents/
POST   /api/childs/financial-documents/
GET    /api/childs/financial-documents/{id}/
PUT    /api/childs/financial-documents/{id}/
DELETE /api/childs/financial-documents/{id}/
POST   /api/childs/financial-documents/{id}/approve_document/
POST   /api/childs/financial-documents/{id}/reject_document/
```

### Program Metrics (UC-07)
```
GET    /api/childs/program-metrics/
GET    /api/childs/program-metrics/{id}/
GET    /api/childs/program-metrics/latest_metrics/
GET    /api/childs/program-metrics/metrics_range/
```

### System Logs
```
GET    /api/childs/system-logs/
GET    /api/childs/system-logs/{id}/
GET    /api/childs/system-logs/recent_activity/
GET    /api/childs/system-logs/error_logs/
```

---

## Permissions by Endpoint

### Child Enrollment
- List: Authenticated users
- Create: SCHOOL role only
- Update: SCHOOL role only
- Delete: ADMIN only
- Active Enrollments: SCHOOL role only

### Sponsorship Payments
- List: Authenticated users
- Create: ADMIN only
- Update: ADMIN only
- Delete: ADMIN only
- Payment Summary: Authenticated users

### Child Progress Reports
- List: Authenticated users
- Create: SCHOOL role only
- Update: SCHOOL role only
- Delete: ADMIN only
- Child Progress: Authenticated users

### Duplication Alerts
- List: ADMIN only
- Resolve: ADMIN only
- Pending Alerts: ADMIN only

### Notifications
- List: Own notifications only
- Mark as Read: Own notifications only
- Unread Count: Own notifications only

### Financial Documents
- List: Authenticated users
- Create: ADMIN only
- Approve: ADMIN only
- Reject: ADMIN only

### Program Metrics
- List: Authenticated users
- Latest Metrics: Authenticated users
- Metrics Range: Authenticated users

### System Logs
- List: ADMIN only
- Recent Activity: ADMIN only
- Error Logs: ADMIN only

---

**Last Updated**: 2024
**Status**: ✅ ALL EXTENDED ENDPOINTS IMPLEMENTED
