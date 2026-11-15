from rest_framework import viewsets, filters, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from django_filters import rest_framework as df_filters
from .models import FestivalEvent, SavedEvent
from .serializers import FestivalEventSerializer, SavedEventSerializer


class EventPagination(PageNumberPagination):
    page_size = 100
    page_size_query_param = 'page_size'
    max_page_size = 200


class EventFilter(df_filters.FilterSet):
    start_after = df_filters.DateTimeFilter(field_name='start_datetime', lookup_expr='gte')
    start_before = df_filters.DateTimeFilter(field_name='start_datetime', lookup_expr='lte')

    class Meta:
        model = FestivalEvent
        fields = ['category', 'venue', 'is_free', 'status', 'is_featured']


class EventViewSet(viewsets.ReadOnlyModelViewSet):
    """List, retrieve, and filter festival events."""
    queryset = FestivalEvent.objects.select_related('venue').all()
    serializer_class = FestivalEventSerializer
    pagination_class = EventPagination
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = EventFilter
    search_fields = ['title', 'title_kn', 'description', 'tags']
    ordering_fields = ['start_datetime', 'title', 'ticket_price']
    ordering = ['start_datetime']

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def saved(self, request):
        """Return events saved by the current user."""
        saved = SavedEvent.objects.filter(user=request.user).select_related('event__venue')
        serializer = SavedEventSerializer(saved, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def save_event(self, request, pk=None):
        """Save an event for the current user."""
        event = self.get_object()
        obj, created = SavedEvent.objects.get_or_create(user=request.user, event=event)
        if created:
            return Response({'status': 'saved'}, status=status.HTTP_201_CREATED)
        return Response({'status': 'already_saved'})

    @action(detail=True, methods=['delete'], permission_classes=[permissions.IsAuthenticated])
    def unsave_event(self, request, pk=None):
        """Remove a saved event for the current user."""
        event = self.get_object()
        SavedEvent.objects.filter(user=request.user, event=event).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
