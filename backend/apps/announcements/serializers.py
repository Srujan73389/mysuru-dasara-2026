from rest_framework import serializers
from .models import Announcement


class AnnouncementSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)

    class Meta:
        model = Announcement
        fields = [
            'id', 'title', 'title_kn', 'content', 'content_kn', 'category',
            'is_urgent', 'published_at', 'expires_at', 'is_active',
            'author', 'author_name',
        ]
        read_only_fields = ['id', 'published_at']
