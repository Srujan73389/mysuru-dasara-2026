from django.db import models


class FestivalVenue(models.Model):
    """A physical venue where Dasara events are held."""

    VENUE_TYPE_CHOICES = [
        ('palace', 'Palace'),
        ('park', 'Park'),
        ('ground', 'Ground'),
        ('museum', 'Museum'),
        ('temple', 'Temple'),
        ('road', 'Road'),
        ('other', 'Other'),
    ]

    name = models.CharField(max_length=200)
    name_kn = models.CharField(max_length=200, blank=True, default='', verbose_name='Name (Kannada)')
    description = models.TextField(blank=True, default='')
    description_kn = models.TextField(blank=True, default='', verbose_name='Description (Kannada)')
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    address = models.TextField(blank=True, default='')
    venue_type = models.CharField(max_length=20, choices=VENUE_TYPE_CHOICES, default='other')
    facilities = models.JSONField(default=list, blank=True, help_text='List of available facilities')
    image = models.ImageField(upload_to='venues/', null=True, blank=True)
    is_active = models.BooleanField(default=True)
    capacity = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Festival Venue'
        verbose_name_plural = 'Festival Venues'
        ordering = ['name']

    def __str__(self):
        return self.name
