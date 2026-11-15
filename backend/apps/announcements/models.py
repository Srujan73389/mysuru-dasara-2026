from django.db import models
from django.contrib.auth.models import User


class Announcement(models.Model):
    """Festival announcements and notifications."""

    CATEGORY_CHOICES = [
        ('general', 'General'),
        ('event', 'Event'),
        ('safety', 'Safety'),
        ('transport', 'Transport'),
        ('weather', 'Weather'),
    ]

    title = models.CharField(max_length=300)
    title_kn = models.CharField(max_length=300, blank=True, default='', verbose_name='Title (Kannada)')
    content = models.TextField()
    content_kn = models.TextField(blank=True, default='', verbose_name='Content (Kannada)')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='general')
    is_urgent = models.BooleanField(default=False)
    published_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    author = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='announcements',
    )

    class Meta:
        verbose_name = 'Announcement'
        verbose_name_plural = 'Announcements'
        ordering = ['-is_urgent', '-published_at']

    def __str__(self):
        return self.title
