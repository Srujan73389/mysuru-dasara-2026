from django.contrib import admin
from .models import CulturalExhibit


@admin.register(CulturalExhibit)
class CulturalExhibitAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'is_featured', 'order', 'created_at']
    list_filter = ['category', 'is_featured']
    search_fields = ['name', 'name_kn', 'description']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['order', 'name']
