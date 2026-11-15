from rest_framework import viewsets, permissions, mixins, status
from rest_framework.response import Response
from .models import FestivalInfo, VisitorFeedback
from .serializers import FestivalInfoSerializer, VisitorFeedbackSerializer


class FestivalInfoViewSet(viewsets.ReadOnlyModelViewSet):
    """Festival information (year, theme, dates, etc.)."""
    queryset = FestivalInfo.objects.filter(is_active=True)
    serializer_class = FestivalInfoSerializer
    permission_classes = [permissions.AllowAny]


class FeedbackViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    """Submit and list visitor feedback."""
    serializer_class = VisitorFeedbackSerializer

    def get_permissions(self):
        if self.action == 'list':
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        return VisitorFeedback.objects.all()

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(user=user)
