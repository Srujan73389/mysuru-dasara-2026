from django.contrib import admin
from .models import FestivalEvent, SavedEvent


@admin.register(FestivalEvent)
class FestivalEventAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'venue', 'start_datetime', 'status', 'is_featured', 'is_free']
    list_filter = ['category', 'status', 'is_featured', 'is_free']
    search_fields = ['title', 'title_kn', 'description', 'tags']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'start_datetime'
    ordering = ['start_datetime']


@admin.register(SavedEvent)
class SavedEventAdmin(admin.ModelAdmin):
    list_display = ['user', 'event', 'saved_at']
    list_filter = ['saved_at']
    search_fields = ['user__username', 'event__title']
    readonly_fields = ['saved_at']
