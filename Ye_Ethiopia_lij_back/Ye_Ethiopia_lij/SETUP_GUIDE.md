# Ye Ethiopia Lij - Complete Setup Guide

This guide walks you through setting up the complete backend system with all security features and improvements.

## Table of Contents
1. [Initial Setup](#initial-setup)
2. [Database Configuration](#database-configuration)
3. [Environment Configuration](#environment-configuration)
4. [Running the Application](#running-the-application)
5. [Testing the API](#testing-the-api)
6. [Troubleshooting](#troubleshooting)

## Initial Setup

### Step 1: Clone and Install Dependencies

```bash
# Clone repository
git clone <repository-url>
cd ye-ethiopia-lij

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Step 2: Create Logs Directory

```bash
mkdir -p logs
```

## Database Configuration

### MongoDB Setup

1. **Install MongoDB** (if not already installed)
   - Download from: https://www.mongodb.com/try/download/community
   - Follow installation guide for your OS

2. **Start MongoDB**
   ```bash
   # On Linux/Mac
   mongod
   
   # On Windows (if installed as service)
   # MongoDB should start automatically
   ```

3. **Verify MongoDB is running**
   ```bash
   mongo --version
   # Should show MongoDB version
   ```

## Environment Configuration

### Step 1: Create .env File

```bash
cp .env.example .env
```

### Step 2: Configure .env for Development

Edit `.env` with the following values:

```env
# Django Settings
SECRET_KEY=your-super-secret-key-change-this-in-production
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# CORS Settings (for frontend development)
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# JWT Settings
JWT_ACCESS_LIFETIME=60
JWT_REFRESH_LIFETIME=1

# Security Settings (False for development)
SECURE_SSL_REDIRECT=False
SESSION_COOKIE_SECURE=False
CSRF_COOKIE_SECURE=False
SECURE_HSTS_SECONDS=0

# Database Settings
MONGO_DB_NAME=ye_ethiopia_lij_db
MONGO_HOST=localhost
MONGO_PORT=27017

# Email Settings (optional for development)
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
```

### Step 3: Generate Secret Key

```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

Copy the output and update `SECRET_KEY` in `.env`

## Running the Application

### Step 1: Run Migrations

```bash
python manage.py migrate
```

### Step 2: Create Superuser

```bash
python manage.py createsuperuser
```

Follow the prompts:
- Email: admin@example.com
- Name: Admin User
- Role: ADMIN
- Password: (create a strong password)

### Step 3: Start Development Server

```bash
python manage.py runserver
```

You should see:
```
Starting development server at http://127.0.0.1:8000/
```

## Testing the API

### Access API Documentation

1. **Swagger UI** (Interactive)
   - URL: http://localhost:8000/api/docs/
   - Try out endpoints directly in browser

2. **ReDoc** (Alternative documentation)
   - URL: http://localhost:8000/api/redoc/

3. **Raw Schema**
   - URL: http://localhost:8000/api/schema/

### Test User Registration

```bash
curl -X POST http://localhost:8000/api/accounts/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "sponsor@example.com",
    "name": "John Sponsor",
    "role": "SPONSOR",
    "password": "SecurePass123!",
    "password_confirm": "SecurePass123!"
  }'
```

### Test Login

```bash
curl -X POST http://localhost:8000/api/accounts/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "sponsor@example.com",
    "password": "SecurePass123!"
  }'
```

Response will include:
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Test Protected Endpoint

```bash
curl -X GET http://localhost:8000/api/childs/list/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Creating Test Data

### 1. Create NGO Staff User

```bash
curl -X POST http://localhost:8000/api/accounts/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ngo@example.com",
    "name": "NGO Staff",
    "role": "ORG_STAFF",
    "password": "SecurePass123!",
    "password_confirm": "SecurePass123!"
  }'
```

### 2. Approve NGO Staff (as Admin)

```bash
# First, get the user ID from the response above
# Then use admin panel or API to change status

curl -X POST http://localhost:8000/api/accounts/manage/{user_id}/change-status/ \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "ACTIVE"}'
```

### 3. Register a Child Profile

```bash
curl -X POST http://localhost:8000/api/childs/register/ \
  -H "Authorization: Bearer NGO_TOKEN" \
  -H "Content-Type: multipart/form-data" \
  -F "full_name=Abebe Kebede" \
  -F "age=10" \
  -F "gender=MALE" \
  -F "location=Addis Ababa" \
  -F "biography=Abebe is a bright student..." \
  -F "vulnerability_status=orphan" \
  -F "guardian_info=Grandmother, Phone: 0911234567"
```

## Troubleshooting

### Issue: MongoDB Connection Error

**Error**: `pymongo.errors.ServerSelectionTimeoutError`

**Solution**:
```bash
# Check if MongoDB is running
mongod --version

# Start MongoDB
mongod

# Verify connection in .env
MONGO_HOST=localhost
MONGO_PORT=27017
```

### Issue: Migration Errors

**Error**: `django.core.management.base.SystemCheckError`

**Solution**:
```bash
# Reset migrations (development only)
python manage.py migrate accounts zero
python manage.py migrate
```

### Issue: Permission Denied on File Upload

**Error**: `Permission denied` when uploading files

**Solution**:
```bash
# Ensure logs directory exists
mkdir -p logs

# Ensure media directory exists
mkdir -p media

# Check permissions
chmod 755 logs media
```

### Issue: CORS Errors

**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**:
1. Check `.env` CORS_ALLOWED_ORIGINS includes your frontend URL
2. Restart Django server after changing .env
3. Clear browser cache

### Issue: Invalid Token

**Error**: `Token is invalid or expired`

**Solution**:
```bash
# Get new access token using refresh token
curl -X POST http://localhost:8000/api/accounts/login/refresh/ \
  -H "Content-Type: application/json" \
  -d '{"refresh": "YOUR_REFRESH_TOKEN"}'
```

### Issue: Account Locked

**Error**: `Account is temporarily locked. Try again later.`

**Solution**:
- Wait 30 minutes for automatic unlock
- Or use admin panel to reset failed login attempts

## Production Deployment Checklist

Before deploying to production:

- [ ] Set `DEBUG=False` in .env
- [ ] Generate new `SECRET_KEY`
- [ ] Configure `ALLOWED_HOSTS` with your domain
- [ ] Set `SECURE_SSL_REDIRECT=True`
- [ ] Set `SESSION_COOKIE_SECURE=True`
- [ ] Set `CSRF_COOKIE_SECURE=True`
- [ ] Configure email backend (Gmail, SendGrid, etc.)
- [ ] Set up HTTPS/SSL certificate
- [ ] Configure MongoDB with authentication
- [ ] Set up database backups
- [ ] Configure logging to file
- [ ] Set up monitoring/alerting
- [ ] Test all endpoints
- [ ] Load test the API
- [ ] Set up CI/CD pipeline

## Next Steps

1. **Frontend Integration**: Connect your frontend to these API endpoints
2. **Email Notifications**: Configure email for password resets
3. **Payment Integration**: Add payment processing for sponsorships
4. **Analytics**: Set up analytics dashboard
5. **Mobile App**: Build mobile app using the API

## Support

For issues or questions:
1. Check the README.md for API documentation
2. Review error logs in `logs/django.log`
3. Check MongoDB logs
4. Contact development team

## Additional Resources

- Django Documentation: https://docs.djangoproject.com/
- Django REST Framework: https://www.django-rest-framework.org/
- MongoDB Documentation: https://docs.mongodb.com/
- JWT Documentation: https://tools.ietf.org/html/rfc7519
