from rest_framework import serializers
from .models import FestivalEvent, SavedEvent
from apps.venues.serializers import FestivalVenueMinimalSerializer


class FestivalEventSerializer(serializers.ModelSerializer):
    venue_detail = FestivalVenueMinimalSerializer(source='venue', read_only=True)
    venue_name = serializers.CharField(source='venue.name', read_only=True)

    class Meta:
        model = FestivalEvent
        fields = [
            'id', 'title', 'title_kn', 'description', 'description_kn',
            'category', 'venue', 'venue_name', 'venue_detail',
            'start_datetime', 'end_datetime', 'is_free', 'ticket_price',
            'image', 'status', 'is_featured', 'tags',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class SavedEventSerializer(serializers.ModelSerializer):
    event = FestivalEventSerializer(read_only=True)
    event_id = serializers.PrimaryKeyRelatedField(
        source='event',
        queryset=FestivalEvent.objects.all(),
        write_only=True,
    )

    class Meta:
        model = SavedEvent
        fields = ['id', 'event', 'event_id', 'saved_at']
        read_only_fields = ['id', 'saved_at']
