from rest_framework import permissions
from config.exceptions import PermissionException


class IsAdmin(permissions.BasePermission):
    """Allow only admin users"""
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'ADMIN'


class IsOrgStaff(permissions.BasePermission):
    """Allow only organization staff"""
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'ORG_STAFF'


class IsSponsor(permissions.BasePermission):
    """Allow only sponsors"""
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'SPONSOR'


class IsSchool(permissions.BasePermission):
    """Allow only school staff"""
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'SCHOOL'


class IsActiveUser(permissions.BasePermission):
    """Allow only active users"""
    def has_permission(self, request, view):
        return (request.user and request.user.is_authenticated and 
                request.user.status == 'ACTIVE')


class IsProjectManager(permissions.BasePermission):
    """Allow only project managers"""
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'PROJECT_MANAGER'


class IsAdminOrProjectManager(permissions.BasePermission):
    """Allow admin or project manager"""
    def has_permission(self, request, view):
        return (request.user and request.user.is_authenticated and
                request.user.role in ('ADMIN', 'PROJECT_MANAGER'))


class IsOwnerOrAdmin(permissions.BasePermission):
    """Allow owner or admin to access"""
    def has_object_permission(self, request, view, obj):
        if request.user.role == 'ADMIN':
            return True
        return obj.organization == request.user or obj.sponsor == request.user
