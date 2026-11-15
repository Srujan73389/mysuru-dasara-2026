from rest_framework import serializers
from .models import HeritageLandmark


class HeritageLandmarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = HeritageLandmark
        fields = [
            'id', 'name', 'name_kn', 'description', 'description_kn',
            'category', 'latitude', 'longitude', 'historical_period',
            'significance', 'image', 'audio_en', 'audio_kn',
            'is_featured', 'order', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
