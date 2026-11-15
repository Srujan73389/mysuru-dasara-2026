from rest_framework import viewsets, filters, permissions
from django_filters.rest_framework import DjangoFilterBackend
from .models import FestivalVenue
from .serializers import FestivalVenueSerializer


class VenueViewSet(viewsets.ReadOnlyModelViewSet):
    """List and retrieve festival venues."""
    queryset = FestivalVenue.objects.filter(is_active=True)
    serializer_class = FestivalVenueSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['venue_type']
    search_fields = ['name', 'name_kn', 'address']
    ordering_fields = ['name', 'capacity']
    ordering = ['name']
