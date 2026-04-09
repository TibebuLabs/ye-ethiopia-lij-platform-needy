import logging
from django.contrib.auth.models import AnonymousUser

logger = logging.getLogger(__name__)


class AuditLogger:
    """Log user actions for audit trail"""
    
    @staticmethod
    def log_action(user, action, resource_type, resource_id, details=None, status='SUCCESS'):
        """Log an action"""
        user_email = user.email if user and not isinstance(user, AnonymousUser) else 'anonymous'
        
        log_message = (
            f"ACTION: {action} | "
            f"USER: {user_email} | "
            f"RESOURCE: {resource_type}({resource_id}) | "
            f"STATUS: {status}"
        )
        
        if details:
            log_message += f" | DETAILS: {details}"
        
        logger.info(log_message)
    
    @staticmethod
    def log_auth_attempt(email, success, reason=None):
        """Log authentication attempt"""
        status = 'SUCCESS' if success else 'FAILED'
        log_message = f"AUTH_ATTEMPT: {email} | STATUS: {status}"
        
        if reason:
            log_message += f" | REASON: {reason}"
        
        logger.info(log_message)
    
    @staticmethod
    def log_permission_denied(user, action, resource):
        """Log permission denied"""
        user_email = user.email if user and not isinstance(user, AnonymousUser) else 'anonymous'
        logger.warning(
            f"PERMISSION_DENIED: {user_email} attempted {action} on {resource}"
        )
