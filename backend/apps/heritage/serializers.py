from rest_framework import serializers
from .models import CulturalExhibit


class CulturalExhibitSerializer(serializers.ModelSerializer):
    class Meta:
        model = CulturalExhibit
        fields = [
            'id', 'name', 'name_kn', 'description', 'description_kn',
            'category', 'image', 'model_url', 'audio_en', 'audio_kn',
            'video_url', 'is_featured', 'order', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
