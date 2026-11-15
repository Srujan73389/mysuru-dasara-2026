from rest_framework import viewsets, filters, permissions
from django_filters.rest_framework import DjangoFilterBackend
from .models import CulturalExhibit
from .serializers import CulturalExhibitSerializer


class ExhibitViewSet(viewsets.ReadOnlyModelViewSet):
    """List and retrieve cultural exhibits."""
    queryset = CulturalExhibit.objects.all()
    serializer_class = CulturalExhibitSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'is_featured']
    search_fields = ['name', 'name_kn', 'description']
    ordering_fields = ['order', 'name']
    ordering = ['order', 'name']
