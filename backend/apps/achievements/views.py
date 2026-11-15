from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Achievement, UserAchievement, HeritagePassport, QuizQuestion, QuizAttempt
from .serializers import (
    AchievementSerializer, UserAchievementSerializer,
    HeritagePassportSerializer, QuizQuestionSerializer, QuizAttemptSerializer,
)


class AchievementViewSet(viewsets.ReadOnlyModelViewSet):
    """List all achievements."""
    queryset = Achievement.objects.all()
    serializer_class = AchievementSerializer
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def my_achievements(self, request):
        """Return achievements earned by the current user."""
        earned = UserAchievement.objects.filter(user=request.user).select_related('achievement')
        serializer = UserAchievementSerializer(earned, many=True, context={'request': request})
        return Response(serializer.data)


class PassportView(viewsets.ViewSet):
    """Heritage passport for the current user."""
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        passport, _ = HeritagePassport.objects.get_or_create(user=request.user)
        serializer = HeritagePassportSerializer(passport)
        return Response(serializer.data)


class QuizViewSet(viewsets.ReadOnlyModelViewSet):
    """Quiz questions."""
    queryset = QuizQuestion.objects.all()
    serializer_class = QuizQuestionSerializer
    permission_classes = [permissions.AllowAny]

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def attempt(self, request, pk=None):
        """Submit an answer to a quiz question."""
        question = self.get_object()
        selected = request.data.get('selected_answer')
        if selected is None:
            return Response({'detail': 'selected_answer is required.'}, status=status.HTTP_400_BAD_REQUEST)
        selected = int(selected)
        is_correct = selected == question.correct_answer_index
        attempt = QuizAttempt.objects.create(
            user=request.user,
            question=question,
            selected_answer=selected,
            is_correct=is_correct,
        )
        serializer = QuizAttemptSerializer(attempt)
        return Response({**serializer.data, 'explanation': question.explanation}, status=status.HTTP_201_CREATED)
