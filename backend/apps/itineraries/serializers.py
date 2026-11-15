from rest_framework import serializers
from .models import UserItinerary, ItineraryItem
from apps.events.serializers import FestivalEventSerializer
from apps.tourism.serializers import HeritageLandmarkSerializer


class ItineraryItemSerializer(serializers.ModelSerializer):
    event_detail = FestivalEventSerializer(source='event', read_only=True)
    landmark_detail = HeritageLandmarkSerializer(source='landmark', read_only=True)

    class Meta:
        model = ItineraryItem
        fields = [
            'id', 'itinerary', 'event', 'event_detail',
            'landmark', 'landmark_detail', 'custom_title', 'custom_description',
            'start_time', 'end_time', 'order', 'travel_mode', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']


class UserItinerarySerializer(serializers.ModelSerializer):
    items = ItineraryItemSerializer(many=True, read_only=True)
    share_url = serializers.SerializerMethodField()

    class Meta:
        model = UserItinerary
        fields = [
            'id', 'user', 'title', 'start_date', 'end_date', 'interests',
            'notes', 'is_public', 'share_token', 'share_url',
            'items', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'user', 'share_token', 'created_at', 'updated_at']

    def get_share_url(self, obj):
        return f'/api/itineraries/shared/{obj.share_token}/'
