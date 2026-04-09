# API Quick Reference - Ye Ethiopia Lij

## Base URL
```
http://localhost:8000/api
```

## Authentication

### Register
```bash
POST /accounts/register/
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John Doe",
  "role": "SPONSOR",
  "password": "SecurePass123!",
  "password_confirm": "SecurePass123!"
}

Response: 201 Created
{
  "message": "Welcome John Doe! Please verify your email.",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "SPONSOR",
    "status": "PENDING",
    "is_active": false,
    "created_at": "2024-01-01T00:00:00Z",
    "email_verified": false
  }
}
```

### Login
```bash
POST /accounts/login/
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

Response: 200 OK
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Refresh Token
```bash
POST /accounts/login/refresh/
Content-Type: application/json

{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}

Response: 200 OK
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Change Password
```bash
POST /accounts/manage/change_password/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "old_password": "SecurePass123!",
  "new_password": "NewSecurePass456!",
  "new_password_confirm": "NewSecurePass456!"
}

Response: 200 OK
{
  "message": "Password updated successfully"
}
```

## User Management (Admin Only)

### List Users
```bash
GET /accounts/manage/?role=SPONSOR&status=ACTIVE
Authorization: Bearer {admin_token}

Response: 200 OK
{
  "count": 10,
  "next": "http://localhost:8000/api/accounts/manage/?page=2",
  "previous": null,
  "results": [...]
}
```

### Change User Status
```bash
POST /accounts/manage/{user_id}/change_status/
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "status": "ACTIVE"
}

Response: 200 OK
{
  "message": "User status changed to ACTIVE",
  "data": {...}
}
```

## Child Profiles

### List Published Profiles
```bash
GET /childs/list/?gender=MALE&location=Addis%20Ababa&search=Abebe
Authorization: Bearer {token}

Response: 200 OK
{
  "count": 5,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "uuid",
      "full_name": "Abebe Kebede",
      "age": 10,
      "gender": "MALE",
      "location": "Addis Ababa",
      "biography": "...",
      "vulnerability_status": "orphan",
      "guardian_info": "...",
      "photo": "http://...",
      "supporting_docs": null,
      "status": "PUBLISHED",
      "organization": "uuid",
      "organization_name": "NGO Name",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z",
      "academic_history": []
    }
  ]
}
```

### Register Child (NGO Staff)
```bash
POST /childs/register/
Authorization: Bearer {ngo_token}
Content-Type: multipart/form-data

full_name: Abebe Kebede
age: 10
gender: MALE
location: Addis Ababa
biography: Abebe is a bright student...
vulnerability_status: orphan
guardian_info: Grandmother, Phone: 0911234567
photo: <file>
supporting_docs: <file>

Response: 201 Created
{
  "id": "uuid",
  "full_name": "Abebe Kebede",
  ...
  "status": "PENDING"
}
```

### Get Child Details
```bash
GET /childs/{child_id}/
Authorization: Bearer {token}

Response: 200 OK
{
  "id": "uuid",
  "full_name": "Abebe Kebede",
  ...
}
```

### Update Child (Admin)
```bash
PUT /childs/{child_id}/
Authorization: Bearer {admin_token}
Content-Type: multipart/form-data

full_name: Abebe Kebede
age: 11
...

Response: 200 OK
{
  "id": "uuid",
  ...
}
```

### Delete Child (Admin)
```bash
DELETE /childs/{child_id}/
Authorization: Bearer {admin_token}

Response: 204 No Content
```

## Sponsorship

### Sponsor a Child
```bash
POST /childs/sponsor/{child_id}/
Authorization: Bearer {sponsor_token}
Content-Type: application/json

{
  "commitment_amount": 100.00
}

Response: 201 Created
{
  "message": "Successfully sponsored Abebe Kebede",
  "data": {
    "id": "uuid",
    "sponsor": "uuid",
    "sponsor_name": "John Sponsor",
    "child": "uuid",
    "child_details": {...},
    "start_date": "2024-01-01T00:00:00Z",
    "end_date": null,
    "commitment_amount": "100.00",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

## Interventions

### List Interventions
```bash
GET /childs/interventions/?child={child_id}&type=HEALTH
Authorization: Bearer {token}

Response: 200 OK
{
  "count": 3,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "uuid",
      "child": "uuid",
      "type": "HEALTH",
      "description": "Medical checkup and vaccination",
      "date_provided": "2024-01-01",
      "receipt_image": "http://...",
      "recorded_by": "uuid",
      "recorded_by_name": "NGO Staff",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Create Intervention
```bash
POST /childs/interventions/
Authorization: Bearer {token}
Content-Type: multipart/form-data

child: {child_id}
type: HEALTH
description: Medical checkup and vaccination
date_provided: 2024-01-01
receipt_image: <file>

Response: 201 Created
{
  "id": "uuid",
  ...
}
```

### Update Intervention
```bash
PUT /childs/interventions/{intervention_id}/
Authorization: Bearer {token}
Content-Type: multipart/form-data

type: EDUCATION
description: School supplies provided
date_provided: 2024-01-02
receipt_image: <file>

Response: 200 OK
{
  "id": "uuid",
  ...
}
```

### Delete Intervention
```bash
DELETE /childs/interventions/{intervention_id}/
Authorization: Bearer {token}

Response: 204 No Content
```

## Academic Reports

### List Reports
```bash
GET /acadamicreport/results/?child={child_id}&academic_year=2024&term=TERM_1
Authorization: Bearer {token}

Response: 200 OK
{
  "count": 2,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "uuid",
      "child": "uuid",
      "child_name": "Abebe Kebede",
      "reported_by": "uuid",
      "reported_by_name": "School Staff",
      "school_name": "ABC School",
      "academic_year": "2024",
      "term": "TERM_1",
      "grade_level": "Grade 5",
      "average_score": "85.50",
      "rank": 3,
      "attendance_rate": "95.00",
      "report_card_image": "http://...",
      "teacher_comments": "Excellent student",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Submit Report (School)
```bash
POST /acadamicreport/results/
Authorization: Bearer {school_token}
Content-Type: multipart/form-data

child: {child_id}
school_name: ABC School
academic_year: 2024
term: TERM_1
grade_level: Grade 5
average_score: 85.50
rank: 3
attendance_rate: 95.00
report_card_image: <file>
teacher_comments: Excellent student

Response: 201 Created
{
  "id": "uuid",
  ...
}
```

### Get Report Details
```bash
GET /acadamicreport/results/{report_id}/
Authorization: Bearer {token}

Response: 200 OK
{
  "id": "uuid",
  ...
}
```

### Update Report (School)
```bash
PUT /acadamicreport/results/{report_id}/
Authorization: Bearer {school_token}
Content-Type: multipart/form-data

average_score: 87.00
rank: 2
teacher_comments: Improved performance

Response: 200 OK
{
  "id": "uuid",
  ...
}
```

### Delete Report (Admin)
```bash
DELETE /acadamicreport/results/{report_id}/
Authorization: Bearer {admin_token}

Response: 204 No Content
```

### Get My Reports
```bash
GET /acadamicreport/results/my_reports/
Authorization: Bearer {school_token}

Response: 200 OK
{
  "count": 5,
  "next": null,
  "previous": null,
  "results": [...]
}
```

## Error Responses

### Validation Error
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data"
  }
}
```

### Authentication Error
```json
{
  "error": {
    "code": "AUTH_ERROR",
    "message": "Invalid credentials"
  }
}
```

### Permission Error
```json
{
  "error": {
    "code": "PERMISSION_DENIED",
    "message": "You do not have permission to perform this action"
  }
}
```

### Not Found
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found"
  }
}
```

### Conflict
```json
{
  "error": {
    "code": "CONFLICT",
    "message": "This child is already sponsored"
  }
}
```

## Query Parameters

### Pagination
```
?page=1&page_size=20
```

### Filtering
```
?role=SPONSOR&status=ACTIVE
?gender=MALE&location=Addis%20Ababa
?type=HEALTH&child={child_id}
```

### Search
```
?search=Abebe
?search=ABC%20School
```

### Ordering
```
?ordering=created_at
?ordering=-created_at
?ordering=full_name
```

## Common Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 204 | No Content - Successful deletion |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Permission denied |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource conflict |
| 500 | Internal Server Error |

## User Roles

| Role | Permissions |
|------|-------------|
| ADMIN | Full access |
| ORG_STAFF | Register children, create interventions |
| SPONSOR | Browse profiles, sponsor children |
| SCHOOL | Submit academic reports |
| GOVERNMENT | View reports |

## Rate Limits

- Anonymous: 100 requests/hour
- Authenticated: 1000 requests/hour

## Documentation

- **Swagger UI**: http://localhost:8000/api/docs/
- **ReDoc**: http://localhost:8000/api/redoc/
- **Schema**: http://localhost:8000/api/schema/

---

**Last Updated**: 2024
