from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from .models import UserItinerary, ItineraryItem
from .serializers import UserItinerarySerializer, ItineraryItemSerializer


class IsOwnerOrReadOnly(permissions.BasePermission):
    """Allow only the owner to edit an itinerary."""
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return obj.is_public or obj.user == request.user
        return obj.user == request.user


class ItineraryViewSet(viewsets.ModelViewSet):
    """CRUD for user itineraries. Only owner can create/update/delete."""
    serializer_class = UserItinerarySerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]

    def get_queryset(self):
        return UserItinerary.objects.filter(user=self.request.user).prefetch_related('items')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['get', 'post'], url_path='items')
    def items(self, request, pk=None):
        itinerary = self.get_object()
        if request.method == 'GET':
            items = ItineraryItem.objects.filter(itinerary=itinerary).order_by('order')
            serializer = ItineraryItemSerializer(items, many=True, context={'request': request})
            return Response(serializer.data)
        serializer = ItineraryItemSerializer(data={**request.data, 'itinerary': itinerary.pk}, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save(itinerary=itinerary)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'], url_path='shared/(?P<token>[^/.]+)', permission_classes=[permissions.AllowAny])
    def shared(self, request, token=None):
        itinerary = get_object_or_404(UserItinerary, share_token=token, is_public=True)
        serializer = UserItinerarySerializer(itinerary, context={'request': request})
        return Response(serializer.data)
