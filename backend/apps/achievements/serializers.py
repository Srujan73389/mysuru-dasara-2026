from rest_framework import serializers
from .models import Achievement, UserAchievement, HeritagePassport, QuizQuestion, QuizAttempt


class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = ['id', 'name', 'name_kn', 'description', 'icon', 'badge_image', 'points', 'category', 'created_at']
        read_only_fields = ['id', 'created_at']


class UserAchievementSerializer(serializers.ModelSerializer):
    achievement = AchievementSerializer(read_only=True)

    class Meta:
        model = UserAchievement
        fields = ['id', 'achievement', 'earned_at']
        read_only_fields = ['id', 'earned_at']


class HeritagePassportSerializer(serializers.ModelSerializer):
    class Meta:
        model = HeritagePassport
        fields = ['id', 'user', 'total_points', 'level', 'stamps_earned', 'last_activity', 'created_at']
        read_only_fields = ['id', 'user', 'total_points', 'level', 'last_activity', 'created_at']


class QuizQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizQuestion
        fields = [
            'id', 'question', 'question_kn', 'options', 'correct_answer_index',
            'explanation', 'difficulty', 'category', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']


class QuizAttemptSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizAttempt
        fields = ['id', 'question', 'selected_answer', 'is_correct', 'attempted_at']
        read_only_fields = ['id', 'is_correct', 'attempted_at']
