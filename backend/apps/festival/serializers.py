from rest_framework import serializers
from .models import FestivalInfo, VisitorFeedback


class FestivalInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = FestivalInfo
        fields = [
            'id', 'year', 'theme', 'theme_kn', 'start_date', 'end_date',
            'chief_guest', 'description', 'description_kn', 'is_active',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class VisitorFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = VisitorFeedback
        fields = [
            'id', 'user', 'name', 'email', 'message', 'rating',
            'category', 'submitted_at', 'is_reviewed',
        ]
        read_only_fields = ['id', 'user', 'submitted_at', 'is_reviewed']
