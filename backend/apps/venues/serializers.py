from rest_framework import serializers
from .models import FestivalVenue


class FestivalVenueSerializer(serializers.ModelSerializer):
    class Meta:
        model = FestivalVenue
        fields = [
            'id', 'name', 'name_kn', 'description', 'description_kn',
            'latitude', 'longitude', 'address', 'venue_type', 'facilities',
            'image', 'is_active', 'capacity', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class FestivalVenueMinimalSerializer(serializers.ModelSerializer):
    """Lightweight serializer used as a nested field in other serializers."""
    class Meta:
        model = FestivalVenue
        fields = ['id', 'name', 'name_kn', 'venue_type', 'address']
