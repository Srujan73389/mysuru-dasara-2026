from django.contrib import admin
from .models import HeritageLandmark


@admin.register(HeritageLandmark)
class HeritageLandmarkAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'is_featured', 'order', 'created_at']
    list_filter = ['category', 'is_featured']
    search_fields = ['name', 'name_kn', 'description', 'historical_period']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['order', 'name']
