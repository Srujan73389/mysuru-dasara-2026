from django.contrib import admin
from .models import UserItinerary, ItineraryItem


class ItineraryItemInline(admin.TabularInline):
    model = ItineraryItem
    extra = 0
    readonly_fields = ['created_at']


@admin.register(UserItinerary)
class UserItineraryAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'start_date', 'end_date', 'is_public', 'created_at']
    list_filter = ['is_public', 'start_date']
    search_fields = ['title', 'user__username']
    readonly_fields = ['share_token', 'created_at', 'updated_at']
    inlines = [ItineraryItemInline]


@admin.register(ItineraryItem)
class ItineraryItemAdmin(admin.ModelAdmin):
    list_display = ['itinerary', 'event', 'landmark', 'custom_title', 'order', 'travel_mode']
    list_filter = ['travel_mode']
    search_fields = ['custom_title', 'itinerary__title', 'event__title', 'landmark__name']
    readonly_fields = ['created_at']
