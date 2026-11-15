from django.db import models


class CulturalExhibit(models.Model):
    """A cultural exhibit showcasing Karnataka/Mysuru heritage."""

    CATEGORY_CHOICES = [
        ('dance', 'Dance'),
        ('music', 'Music'),
        ('craft', 'Craft'),
        ('costume', 'Costume'),
        ('tradition', 'Tradition'),
        ('instrument', 'Instrument'),
    ]

    name = models.CharField(max_length=200)
    name_kn = models.CharField(max_length=200, blank=True, default='', verbose_name='Name (Kannada)')
    description = models.TextField(blank=True, default='')
    description_kn = models.TextField(blank=True, default='', verbose_name='Description (Kannada)')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='tradition')
    image = models.ImageField(upload_to='exhibits/', null=True, blank=True)
    model_url = models.CharField(max_length=500, blank=True, default='', help_text='Path or URL to a 3D model file')
    audio_en = models.FileField(upload_to='audio/exhibits/en/', null=True, blank=True)
    audio_kn = models.FileField(upload_to='audio/exhibits/kn/', null=True, blank=True)
    video_url = models.URLField(blank=True, default='', help_text='External video URL (YouTube/Vimeo)')
    is_featured = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Cultural Exhibit'
        verbose_name_plural = 'Cultural Exhibits'
        ordering = ['order', 'name']

    def __str__(self):
        return self.name
