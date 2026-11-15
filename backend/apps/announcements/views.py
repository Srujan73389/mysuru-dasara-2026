from rest_framework import viewsets, filters, permissions
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from django.utils import timezone
from .models import Announcement
from .serializers import AnnouncementSerializer


class AnnouncementViewSet(viewsets.ReadOnlyModelViewSet):
    """List and retrieve festival announcements."""
    serializer_class = AnnouncementSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'is_urgent', 'is_active']
    search_fields = ['title', 'title_kn', 'content']
    ordering_fields = ['published_at', 'is_urgent']
    ordering = ['-is_urgent', '-published_at']

    def get_queryset(self):
        qs = Announcement.objects.all()
        # By default, return only active non-expired announcements.
        # Pass ?active_only=false to see all (e.g. for admin debugging).
        active_only = self.request.query_params.get('active_only', 'true').lower()
        if active_only != 'false':
            now = timezone.now()
            qs = qs.filter(is_active=True).filter(
                Q(expires_at__isnull=True) | Q(expires_at__gt=now)
            )
        return qs
