from django.contrib import admin
from .models import Announcement


@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'is_urgent', 'is_active', 'published_at', 'expires_at', 'author']
    list_filter = ['category', 'is_urgent', 'is_active']
    search_fields = ['title', 'title_kn', 'content']
    readonly_fields = ['published_at']
    date_hierarchy = 'published_at'
