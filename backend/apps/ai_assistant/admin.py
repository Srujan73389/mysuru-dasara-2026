from django.contrib import admin
from .models import ChatSession, ChatMessage, AIKnowledgeBase


class ChatMessageInline(admin.TabularInline):
    model = ChatMessage
    extra = 0
    readonly_fields = ['role', 'content', 'created_at']
    can_delete = False


@admin.register(ChatSession)
class ChatSessionAdmin(admin.ModelAdmin):
    list_display = ['session_id', 'user', 'language', 'created_at']
    list_filter = ['language', 'created_at']
    search_fields = ['session_id', 'user__username']
    readonly_fields = ['session_id', 'created_at', 'updated_at']
    inlines = [ChatMessageInline]


@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ['session', 'role', 'content_preview', 'created_at']
    list_filter = ['role', 'created_at']
    search_fields = ['content', 'session__session_id']
    readonly_fields = ['created_at']

    @admin.display(description='Content Preview')
    def content_preview(self, obj):
        return obj.content[:80]


@admin.register(AIKnowledgeBase)
class AIKnowledgeBaseAdmin(admin.ModelAdmin):
    list_display = ['topic', 'category', 'is_active', 'created_at']
    list_filter = ['category', 'is_active']
    search_fields = ['topic', 'content', 'category']
    readonly_fields = ['created_at', 'updated_at']
