from django.contrib import admin
from .models import User

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'name', 'role', 'status', 'is_staff', 'created_at')
    list_filter = ('role', 'status', 'is_staff')
    search_fields = ('email', 'name')
    ordering = ('-created_at',)
    
    # Organize fields in the edit page
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('name', 'role', 'status')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
    )