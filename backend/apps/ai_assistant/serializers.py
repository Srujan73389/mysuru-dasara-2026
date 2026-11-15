from rest_framework import serializers
from .models import ChatSession, ChatMessage, AIKnowledgeBase


class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ['id', 'session', 'role', 'content', 'created_at']
        read_only_fields = ['id', 'created_at']


class ChatSessionSerializer(serializers.ModelSerializer):
    messages = ChatMessageSerializer(many=True, read_only=True)

    class Meta:
        model = ChatSession
        fields = ['id', 'user', 'session_id', 'language', 'messages', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'session_id', 'created_at', 'updated_at']


class AIKnowledgeBaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIKnowledgeBase
        fields = ['id', 'topic', 'content', 'content_kn', 'category', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class AIChatRequestSerializer(serializers.Serializer):
    """Input serializer for the AI chat endpoint."""
    message = serializers.CharField(max_length=2000)
    language = serializers.ChoiceField(choices=[('en', 'English'), ('kn', 'Kannada')], default='en')
    session_id = serializers.UUIDField(required=False, allow_null=True)


class AIChatResponseSerializer(serializers.Serializer):
    """Output serializer for the AI chat endpoint."""
    response = serializers.CharField()
    session_id = serializers.UUIDField()
    is_ai_generated = serializers.BooleanField(default=True)
