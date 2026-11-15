from django.db import models
from django.contrib.auth.models import User
import uuid


class ChatSession(models.Model):
    """An AI chat session (anonymous or authenticated)."""

    LANGUAGE_CHOICES = [
        ('en', 'English'),
        ('kn', 'Kannada'),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='chat_sessions',
    )
    session_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    language = models.CharField(max_length=2, choices=LANGUAGE_CHOICES, default='en')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Chat Session'
        verbose_name_plural = 'Chat Sessions'
        ordering = ['-created_at']

    def __str__(self):
        user_label = self.user.username if self.user else 'Anonymous'
        return f'{user_label} – Session {self.session_id}'


class ChatMessage(models.Model):
    """A single message within a chat session."""

    ROLE_CHOICES = [
        ('user', 'User'),
        ('assistant', 'Assistant'),
    ]

    session = models.ForeignKey(ChatSession, on_delete=models.CASCADE, related_name='messages')
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Chat Message'
        verbose_name_plural = 'Chat Messages'
        ordering = ['created_at']

    def __str__(self):
        return f'[{self.role}] {self.content[:60]}'


class AIKnowledgeBase(models.Model):
    """Curated knowledge articles fed to the AI assistant."""

    topic = models.CharField(max_length=300)
    content = models.TextField(help_text='Content in English')
    content_kn = models.TextField(blank=True, default='', verbose_name='Content (Kannada)')
    category = models.CharField(max_length=100, blank=True, default='')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'AI Knowledge Base'
        verbose_name_plural = 'AI Knowledge Base Entries'
        ordering = ['category', 'topic']

    def __str__(self):
        return self.topic
