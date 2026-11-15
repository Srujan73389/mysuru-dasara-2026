from django.db import models
from django.contrib.auth.models import User
import uuid


class UserItinerary(models.Model):
    """A user-created travel itinerary for the festival."""

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='itineraries')
    title = models.CharField(max_length=300)
    start_date = models.DateField()
    end_date = models.DateField()
    interests = models.JSONField(default=list, blank=True, help_text='List of interest categories')
    notes = models.TextField(blank=True, default='')
    is_public = models.BooleanField(default=False)
    share_token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'User Itinerary'
        verbose_name_plural = 'User Itineraries'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.user.username} – {self.title}'


class ItineraryItem(models.Model):
    """A single item/stop in a user itinerary."""

    TRAVEL_MODE_CHOICES = [
        ('walk', 'Walking'),
        ('drive', 'Driving'),
        ('auto', 'Auto-rickshaw'),
        ('bus', 'Bus'),
    ]

    itinerary = models.ForeignKey(UserItinerary, on_delete=models.CASCADE, related_name='items')
    event = models.ForeignKey(
        'events.FestivalEvent',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='itinerary_items',
    )
    landmark = models.ForeignKey(
        'tourism.HeritageLandmark',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='itinerary_items',
    )
    custom_title = models.CharField(max_length=300, blank=True, default='')
    custom_description = models.TextField(blank=True, default='')
    start_time = models.DateTimeField(null=True, blank=True)
    end_time = models.DateTimeField(null=True, blank=True)
    order = models.PositiveIntegerField(default=0)
    travel_mode = models.CharField(max_length=10, choices=TRAVEL_MODE_CHOICES, default='walk')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Itinerary Item'
        verbose_name_plural = 'Itinerary Items'
        ordering = ['order', 'start_time']

    def __str__(self):
        label = self.custom_title or (self.event.title if self.event else None) or (self.landmark.name if self.landmark else 'Item')
        return f'{self.itinerary.title} – {label}'
