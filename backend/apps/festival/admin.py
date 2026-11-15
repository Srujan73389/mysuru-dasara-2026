from django.contrib import admin
from .models import FestivalInfo, VisitorFeedback


@admin.register(FestivalInfo)
class FestivalInfoAdmin(admin.ModelAdmin):
    list_display = ['year', 'theme', 'start_date', 'end_date', 'chief_guest', 'is_active']
    list_filter = ['is_active', 'year']
    search_fields = ['theme', 'chief_guest', 'description']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(VisitorFeedback)
class VisitorFeedbackAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'rating', 'category', 'submitted_at', 'is_reviewed']
    list_filter = ['rating', 'category', 'is_reviewed']
    search_fields = ['name', 'email', 'message']
    readonly_fields = ['submitted_at']
    date_hierarchy = 'submitted_at'
