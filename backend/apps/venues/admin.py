from django.contrib import admin
from .models import FestivalVenue


@admin.register(FestivalVenue)
class FestivalVenueAdmin(admin.ModelAdmin):
    list_display = ['name', 'venue_type', 'capacity', 'is_active', 'created_at']
    list_filter = ['venue_type', 'is_active']
    search_fields = ['name', 'name_kn', 'address']
    readonly_fields = ['created_at', 'updated_at']
