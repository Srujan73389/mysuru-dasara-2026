from django.contrib import admin
from .models import UserProfile


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'city', 'preferred_language', 'passport_points', 'created_at']
    list_filter = ['preferred_language', 'city']
    search_fields = ['user__username', 'user__email', 'city', 'phone']
    readonly_fields = ['passport_points', 'created_at', 'updated_at']
