from django.db import models
from django.contrib.auth.models import User


class EventCategory(models.TextChoices):
    CULTURAL = 'cultural', 'Cultural'
    MUSIC = 'music', 'Music'
    FOLK = 'folk', 'Folk'
    SPORTS = 'sports', 'Sports'
    FOOD = 'food', 'Food'
    FLOWER = 'flower', 'Flower Show'
    EXHIBITION = 'exhibition', 'Exhibition'
    JAMBOO_SAVARI = 'jamboo_savari', 'Jamboo Savari'
    TORCHLIGHT = 'torchlight', 'Torchlight Procession'
    DRONE = 'drone', 'Drone Show'
    HERITAGE_WALK = 'heritage_walk', 'Heritage Walk'
    OTHER = 'other', 'Other'


class EventStatus(models.TextChoices):
    UPCOMING = 'upcoming', 'Upcoming'
    ONGOING = 'ongoing', 'Ongoing'
    COMPLETED = 'completed', 'Completed'
    CANCELLED = 'cancelled', 'Cancelled'


class FestivalEvent(models.Model):
    """A Dasara festival event."""

    title = models.CharField(max_length=300)
    title_kn = models.CharField(max_length=300, blank=True, default='', verbose_name='Title (Kannada)')
    description = models.TextField(blank=True, default='')
    description_kn = models.TextField(blank=True, default='', verbose_name='Description (Kannada)')
    category = models.CharField(
        max_length=30,
        choices=EventCategory.choices,
        default=EventCategory.OTHER,
    )
    venue = models.ForeignKey(
        'venues.FestivalVenue',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='events',
    )
    start_datetime = models.DateTimeField()
    end_datetime = models.DateTimeField()
    is_free = models.BooleanField(default=True)
    ticket_price = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    image = models.ImageField(upload_to='events/', null=True, blank=True)
    status = models.CharField(
        max_length=20,
        choices=EventStatus.choices,
        default=EventStatus.UPCOMING,
    )
    is_featured = models.BooleanField(default=False)
    tags = models.CharField(max_length=500, blank=True, default='', help_text='Comma-separated tags')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Festival Event'
        verbose_name_plural = 'Festival Events'
        ordering = ['start_datetime']

    def __str__(self):
        return self.title


class SavedEvent(models.Model):
    """Track which users saved which events."""

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='saved_event_records')
    event = models.ForeignKey(FestivalEvent, on_delete=models.CASCADE, related_name='save_records')
    saved_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Saved Event'
        verbose_name_plural = 'Saved Events'
        unique_together = ('user', 'event')
        ordering = ['-saved_at']

    def __str__(self):
        return f'{self.user.username} saved {self.event.title}'
