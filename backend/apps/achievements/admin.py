from django.contrib import admin
from .models import Achievement, UserAchievement, HeritagePassport, QuizQuestion, QuizAttempt


@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'points', 'created_at']
    list_filter = ['category']
    search_fields = ['name', 'name_kn', 'description']
    readonly_fields = ['created_at']


@admin.register(UserAchievement)
class UserAchievementAdmin(admin.ModelAdmin):
    list_display = ['user', 'achievement', 'earned_at']
    list_filter = ['earned_at', 'achievement__category']
    search_fields = ['user__username', 'achievement__name']
    readonly_fields = ['earned_at']


@admin.register(HeritagePassport)
class HeritagePassportAdmin(admin.ModelAdmin):
    list_display = ['user', 'level', 'total_points', 'last_activity', 'created_at']
    list_filter = ['level']
    search_fields = ['user__username']
    readonly_fields = ['last_activity', 'created_at']


@admin.register(QuizQuestion)
class QuizQuestionAdmin(admin.ModelAdmin):
    list_display = ['question', 'difficulty', 'category', 'correct_answer_index', 'created_at']
    list_filter = ['difficulty', 'category']
    search_fields = ['question', 'question_kn', 'category']
    readonly_fields = ['created_at']


@admin.register(QuizAttempt)
class QuizAttemptAdmin(admin.ModelAdmin):
    list_display = ['user', 'question', 'selected_answer', 'is_correct', 'attempted_at']
    list_filter = ['is_correct', 'attempted_at']
    search_fields = ['user__username']
    readonly_fields = ['attempted_at']
