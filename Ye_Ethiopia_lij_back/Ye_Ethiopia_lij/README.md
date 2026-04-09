# Ye Ethiopia Lij - Child Sponsorship Management System

A comprehensive Django REST API backend for managing child sponsorship programs, academic tracking, and interventions across multiple organizations.

## Features

### Core Functionality
- **User Management**: Multi-role authentication (Admin, NGO Staff, Sponsors, Schools, Government)
- **Child Profiles**: Register and manage child profiles with photo/document uploads
- **Sponsorship**: Connect sponsors with children and track commitments
- **Academic Reports**: Track academic performance and progress
- **Intervention Logging**: Document aid provided (healthcare, education, nutrition, clothing)
- **Audit Logging**: Complete audit trail of all user actions

### Security Features
- JWT-based authentication with token refresh
- Role-based access control (RBAC)
- Account lockout after failed login attempts
- Strong password validation
- File upload validation (type, size)
- CORS configuration
- Rate limiting on API endpoints
- Comprehensive error handling
- Input validation and sanitization

## Project Structure

```
.
├── config/                 # Django configuration
│   ├── settings.py        # Settings with security hardening
│   ├── urls.py            # URL routing
│   ├── exceptions.py      # Custom exception handling
│   ├── permissions.py     # Role-based permissions
│   ├── validators.py      # Input validators
│   └── audit.py           # Audit logging
├── accounts/              # User authentication & management
│   ├── models.py          # User model with security fields
│   ├── views.py           # Auth endpoints
│   ├── serializers.py     # Data serialization
│   └── urls.py            # Auth routes
├── childprofile/          # Child profile management
│   ├── models.py          # Child, Sponsorship, Intervention models
│   ├── views.py           # Child endpoints
│   ├── serializers.py     # Child data serialization
│   └── urls.py            # Child routes
├── acadamicreport/        # Academic tracking
│   ├── models.py          # Academic report model
│   ├── views.py           # Report endpoints
│   ├── serializers.py     # Report serialization
│   └── urls.py            # Report routes
├── requirements.txt       # Python dependencies
├── .env.example          # Environment variables template
└── manage.py             # Django management script
```

## Installation

### Prerequisites
- Python 3.8+
- MongoDB 4.0+
- pip

### Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd ye-ethiopia-lij
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

5. **Run migrations**
```bash
python manage.py migrate
```

6. **Create superuser**
```bash
python manage.py createsuperuser
```

7. **Start development server**
```bash
python manage.py runserver
```

## API Documentation

### Base URL
```
http://localhost:8000/api
```

### Interactive Documentation
- **Swagger UI**: http://localhost:8000/api/docs/
- **ReDoc**: http://localhost:8000/api/redoc/
- **Schema**: http://localhost:8000/api/schema/

## Authentication

### Register User
```
POST /api/accounts/register/
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John Doe",
  "role": "SPONSOR",
  "password": "SecurePass123!",
  "password_confirm": "SecurePass123!"
}
```

### Login
```
POST /api/accounts/login/
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

Response:
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Refresh Token
```
POST /api/accounts/login/refresh/
Content-Type: application/json

{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

## API Endpoints

### Accounts
- `POST /api/accounts/register/` - Register new user
- `POST /api/accounts/login/` - User login
- `POST /api/accounts/login/refresh/` - Refresh access token
- `GET /api/accounts/manage/` - List users (Admin only)
- `POST /api/accounts/manage/{id}/change-status/` - Change user status (Admin only)
- `POST /api/accounts/manage/change-password/` - Change password (Authenticated)

### Child Profiles
- `GET /api/childs/list/` - List published child profiles
- `POST /api/childs/register/` - Register new child (NGO Staff)
- `GET /api/childs/{id}/` - Get child details
- `PUT /api/childs/{id}/` - Update child profile (Admin)
- `DELETE /api/childs/{id}/` - Delete child profile (Admin)
- `POST /api/childs/sponsor/{child_id}/` - Sponsor a child (Sponsor)

### Interventions
- `GET /api/childs/interventions/` - List interventions
- `POST /api/childs/interventions/` - Create intervention
- `GET /api/childs/interventions/{id}/` - Get intervention details
- `PUT /api/childs/interventions/{id}/` - Update intervention
- `DELETE /api/childs/interventions/{id}/` - Delete intervention

### Academic Reports
- `GET /api/acadamicreport/results/` - List academic reports
- `POST /api/acadamicreport/results/` - Submit academic report (School)
- `GET /api/acadamicreport/results/{id}/` - Get report details
- `PUT /api/acadamicreport/results/{id}/` - Update report (School)
- `DELETE /api/acadamicreport/results/{id}/` - Delete report (Admin)
- `GET /api/acadamicreport/results/my_reports/` - Get user's submitted reports

## User Roles

### ADMIN
- Manage all users
- Approve/reject child profiles
- View all reports and interventions
- System administration

### ORG_STAFF
- Register child profiles
- View assigned children
- Track interventions
- Submit reports

### SPONSOR
- Browse published child profiles
- Sponsor children
- View sponsored child progress
- Track academic reports

### SCHOOL
- Submit academic reports
- View student profiles
- Track attendance and performance

### GOVERNMENT
- View reports and statistics
- Monitor program implementation
- Generate reports

## Password Requirements

Passwords must meet the following criteria:
- Minimum 8 characters
- At least one uppercase letter
- At least one digit
- At least one special character (!@#$%^&*()_+-=[]{}|;:,.<>?)

## File Upload Limits

- **Images**: 5MB max (jpg, jpeg, png, gif)
- **Documents**: 10MB max (pdf, doc, docx, xls, xlsx)

## Error Handling

All errors follow a consistent format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message"
  }
}
```

### Common Error Codes
- `VALIDATION_ERROR` - Input validation failed
- `AUTH_ERROR` - Authentication failed
- `PERMISSION_DENIED` - User lacks permission
- `NOT_FOUND` - Resource not found
- `CONFLICT` - Resource conflict (e.g., already sponsored)
- `INTERNAL_ERROR` - Server error

## Rate Limiting

- Anonymous users: 100 requests/hour
- Authenticated users: 1000 requests/hour

## Security Best Practices

1. **Environment Variables**: Never commit `.env` file
2. **HTTPS**: Enable in production
3. **CORS**: Configure allowed origins
4. **JWT Tokens**: Keep refresh tokens secure
5. **File Uploads**: Validate all uploads
6. **Logging**: Monitor audit logs regularly
7. **Database**: Use strong MongoDB credentials
8. **Backups**: Regular database backups

## Deployment

### Production Checklist
- [ ] Set `DEBUG=False`
- [ ] Generate strong `SECRET_KEY`
- [ ] Configure `ALLOWED_HOSTS`
- [ ] Enable `SECURE_SSL_REDIRECT`
- [ ] Set `SESSION_COOKIE_SECURE=True`
- [ ] Set `CSRF_COOKIE_SECURE=True`
- [ ] Configure email backend
- [ ] Set up logging
- [ ] Configure CORS properly
- [ ] Use environment variables
- [ ] Enable HSTS headers
- [ ] Set up monitoring/alerting

## Troubleshooting

### MongoDB Connection Issues
```bash
# Check MongoDB is running
mongod --version

# Verify connection string in .env
MONGO_HOST=localhost
MONGO_PORT=27017
```

### Migration Issues
```bash
# Reset migrations (development only)
python manage.py migrate accounts zero
python manage.py migrate
```

### Permission Denied Errors
- Verify user role matches endpoint requirements
- Check user status is 'ACTIVE'
- Verify JWT token is valid

## Contributing

1. Create feature branch
2. Make changes with tests
3. Submit pull request
4. Code review required

## License

Proprietary - Ye Ethiopia Lij

## Support

For issues and questions, contact the development team.
