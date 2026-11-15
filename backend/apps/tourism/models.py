from django.db import models


class HeritageLandmark(models.Model):
    """A heritage or tourist landmark in Mysuru."""

    CATEGORY_CHOICES = [
        ('palace', 'Palace'),
        ('temple', 'Temple'),
        ('garden', 'Garden'),
        ('museum', 'Museum'),
        ('market', 'Market'),
        ('other', 'Other'),
    ]

    name = models.CharField(max_length=200)
    name_kn = models.CharField(max_length=200, blank=True, default='', verbose_name='Name (Kannada)')
    description = models.TextField(blank=True, default='')
    description_kn = models.TextField(blank=True, default='', verbose_name='Description (Kannada)')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='other')
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    historical_period = models.CharField(max_length=200, blank=True, default='')
    significance = models.TextField(blank=True, default='')
    image = models.ImageField(upload_to='landmarks/', null=True, blank=True)
    audio_en = models.FileField(upload_to='audio/landmarks/en/', null=True, blank=True)
    audio_kn = models.FileField(upload_to='audio/landmarks/kn/', null=True, blank=True)
    is_featured = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Heritage Landmark'
        verbose_name_plural = 'Heritage Landmarks'
        ordering = ['order', 'name']

    def __str__(self):
        return self.name
