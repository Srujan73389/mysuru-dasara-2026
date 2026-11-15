from rest_framework import viewsets, filters, permissions
from django_filters.rest_framework import DjangoFilterBackend
from .models import HeritageLandmark
from .serializers import HeritageLandmarkSerializer


class LandmarkViewSet(viewsets.ReadOnlyModelViewSet):
    """List and retrieve heritage landmarks."""
    queryset = HeritageLandmark.objects.all()
    serializer_class = HeritageLandmarkSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'is_featured']
    search_fields = ['name', 'name_kn', 'description', 'historical_period']
    ordering_fields = ['order', 'name']
    ordering = ['order', 'name']
