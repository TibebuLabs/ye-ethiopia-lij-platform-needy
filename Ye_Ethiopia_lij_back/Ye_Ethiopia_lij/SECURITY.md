# Security Documentation

## Overview

This document outlines the security features and best practices implemented in the Ye Ethiopia Lij API.

## Authentication & Authorization

### JWT Authentication
- **Token Type**: Bearer tokens
- **Algorithm**: HS256
- **Access Token Lifetime**: 60 minutes (configurable)
- **Refresh Token Lifetime**: 1 day (configurable)
- **Token Rotation**: Enabled - refresh tokens are rotated on each refresh

### Password Security
- **Minimum Length**: 8 characters
- **Complexity Requirements**:
  - At least one uppercase letter
  - At least one digit
  - At least one special character
- **Hashing**: PBKDF2 with SHA256 (Django default)
- **Password Change**: Users can change passwords anytime

### Account Lockout
- **Failed Attempts**: Account locks after 5 failed login attempts
- **Lockout Duration**: 30 minutes
- **Reset**: Automatic unlock after 30 minutes or manual admin reset

### Role-Based Access Control (RBAC)

| Role | Permissions |
|------|-------------|
| ADMIN | Full system access, user management, approve profiles |
| ORG_STAFF | Register children, track interventions, submit reports |
| SPONSOR | Browse profiles, sponsor children, view progress |
| SCHOOL | Submit academic reports, view student profiles |
| GOVERNMENT | View reports, monitor implementation |

## Data Protection

### File Upload Validation
- **Image Files**: 5MB max (jpg, jpeg, png, gif)
- **Document Files**: 10MB max (pdf, doc, docx, xls, xlsx)
- **Validation**: Extension and size checked before storage
- **Storage**: Files stored in `media/` directory with unique names

### Input Validation
- **Email**: RFC 5322 compliant validation
- **Age**: Must be between 0-18 for children
- **Scores**: Must be between 0-100
- **Attendance**: Must be between 0-100
- **Amounts**: Must be positive numbers

### Data Encryption
- **In Transit**: HTTPS/TLS (configured in production)
- **At Rest**: MongoDB encryption (recommended for production)
- **Sensitive Fields**: Passwords hashed with PBKDF2

## API Security

### Rate Limiting
- **Anonymous Users**: 100 requests/hour
- **Authenticated Users**: 1000 requests/hour
- **Purpose**: Prevent brute force and DoS attacks

### CORS Configuration
- **Allowed Origins**: Configurable via environment variables
- **Credentials**: Allowed for authenticated requests
- **Methods**: GET, POST, PUT, PATCH, DELETE, OPTIONS
- **Headers**: Standard headers allowed

### Request Validation
- **Content-Type**: Enforced for POST/PUT requests
- **CSRF Protection**: Enabled for form submissions
- **X-Frame-Options**: DENY (prevents clickjacking)

## Audit & Logging

### Audit Trail
All user actions are logged with:
- User email/ID
- Action type (CREATE, UPDATE, DELETE, etc.)
- Resource type and ID
- Timestamp
- Status (SUCCESS/FAILED)
- Additional details

### Log Locations
- **Application Logs**: `logs/django.log`
- **Rotation**: 10MB per file, 5 backup files
- **Format**: Verbose with timestamp, module, process ID, thread ID

### Logged Events
- User registration
- Login attempts (success/failure)
- Password changes
- Account status changes
- Child profile operations
- Sponsorship creation
- Academic report submissions
- Intervention logging

## Environment Security

### Sensitive Configuration
- **SECRET_KEY**: Must be unique and strong
- **DEBUG**: Must be False in production
- **ALLOWED_HOSTS**: Restricted to specific domains
- **Database Credentials**: Stored in environment variables

### Environment Variables
All sensitive data stored in `.env`:
```
SECRET_KEY=<strong-random-key>
DEBUG=False
ALLOWED_HOSTS=yourdomain.com
CORS_ALLOWED_ORIGINS=https://yourdomain.com
```

### .env File Protection
- Never commit `.env` to version control
- Use `.env.example` as template
- Restrict file permissions: `chmod 600 .env`

## Database Security

### MongoDB Configuration
- **Authentication**: Username/password required
- **Network**: Bind to localhost in development
- **Backups**: Regular automated backups recommended
- **Encryption**: Enable MongoDB encryption at rest

### Connection Security
- **SSL/TLS**: Use in production
- **Connection String**: Stored in environment variables
- **Credentials**: Never hardcoded

## HTTPS/TLS

### Production Requirements
- **Certificate**: Valid SSL/TLS certificate
- **Redirect**: HTTP to HTTPS redirect enabled
- **HSTS**: HTTP Strict Transport Security enabled
- **Secure Cookies**: All cookies marked as secure

### Configuration
```env
SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
SECURE_HSTS_SECONDS=31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS=True
```

## Error Handling

### Error Response Format
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}
```

### Error Codes
- `VALIDATION_ERROR`: Input validation failed
- `AUTH_ERROR`: Authentication failed
- `PERMISSION_DENIED`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `CONFLICT`: Resource conflict
- `INTERNAL_ERROR`: Server error

### Security Considerations
- No sensitive information in error messages
- Stack traces not exposed to clients
- Detailed errors logged server-side only

## Dependency Security

### Regular Updates
- Check for security updates: `pip list --outdated`
- Update dependencies: `pip install --upgrade -r requirements.txt`
- Review changelogs for security fixes

### Vulnerable Dependencies
- Use `safety` to check for known vulnerabilities:
  ```bash
  pip install safety
  safety check
  ```

## API Security Headers

### Implemented Headers
- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-Content-Type-Options: nosniff` - Prevents MIME sniffing
- `X-XSS-Protection: 1; mode=block` - XSS protection
- `Strict-Transport-Security` - HTTPS enforcement (production)

## Security Testing

### Manual Testing Checklist
- [ ] Test SQL injection attempts
- [ ] Test XSS payloads
- [ ] Test CSRF attacks
- [ ] Test authentication bypass
- [ ] Test authorization bypass
- [ ] Test file upload vulnerabilities
- [ ] Test rate limiting
- [ ] Test error handling

### Automated Testing
```bash
# Run security checks
python manage.py check --deploy

# Check for common issues
python manage.py check
```

## Incident Response

### Security Incident Procedure
1. **Identify**: Detect and confirm the incident
2. **Contain**: Limit damage and prevent spread
3. **Investigate**: Determine root cause
4. **Remediate**: Fix the vulnerability
5. **Communicate**: Notify affected users
6. **Document**: Record incident details

### Contact
- Security Team: security@yeethiopialij.com
- Report vulnerabilities responsibly

## Compliance

### Data Protection
- GDPR: User data handling compliant
- Privacy: User data not shared without consent
- Retention: Data retention policies implemented

### Audit Requirements
- Maintain audit logs for 1 year minimum
- Regular security audits recommended
- Penetration testing annually

## Security Recommendations

### For Administrators
1. Change default admin credentials immediately
2. Enable two-factor authentication (future enhancement)
3. Monitor audit logs regularly
4. Keep dependencies updated
5. Regular security training

### For Users
1. Use strong, unique passwords
2. Never share authentication tokens
3. Report suspicious activity
4. Keep credentials confidential
5. Use HTTPS only

### For Developers
1. Follow secure coding practices
2. Validate all inputs
3. Use parameterized queries
4. Implement proper error handling
5. Regular code reviews

## Future Security Enhancements

- [ ] Two-factor authentication (2FA)
- [ ] OAuth2/OpenID Connect integration
- [ ] API key authentication
- [ ] IP whitelisting
- [ ] Request signing
- [ ] Encryption at rest
- [ ] Advanced threat detection
- [ ] Security event alerting

## References

- OWASP Top 10: https://owasp.org/www-project-top-ten/
- Django Security: https://docs.djangoproject.com/en/stable/topics/security/
- REST API Security: https://restfulapi.net/security-essentials/
- MongoDB Security: https://docs.mongodb.com/manual/security/

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024 | Initial security documentation |

---

**Last Updated**: 2024
**Maintained By**: Development Team
