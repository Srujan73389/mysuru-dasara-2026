from django.db import models
from django.contrib.auth.models import User


class FestivalInfo(models.Model):
    """Core information about the Mysuru Dasara festival for a given year."""

    year = models.PositiveIntegerField(default=2026, unique=True)
    theme = models.CharField(max_length=300, blank=True, default='')
    theme_kn = models.CharField(max_length=300, blank=True, default='', verbose_name='Theme (Kannada)')
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    chief_guest = models.CharField(max_length=200, blank=True, default='')
    description = models.TextField(blank=True, default='')
    description_kn = models.TextField(blank=True, default='', verbose_name='Description (Kannada)')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Festival Info'
        verbose_name_plural = 'Festival Info'
        ordering = ['-year']

    def __str__(self):
        return f'Mysuru Dasara {self.year}'


class VisitorFeedback(models.Model):
    """Feedback submitted by festival visitors."""

    RATING_CHOICES = [(i, str(i)) for i in range(1, 6)]

    CATEGORY_CHOICES = [
        ('general', 'General'),
        ('event', 'Event'),
        ('venue', 'Venue'),
        ('transport', 'Transport'),
        ('food', 'Food'),
        ('app', 'App / Website'),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='feedback_submitted',
    )
    name = models.CharField(max_length=200, blank=True, default='')
    email = models.EmailField(blank=True, default='')
    message = models.TextField()
    rating = models.PositiveSmallIntegerField(choices=RATING_CHOICES, default=5)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='general')
    submitted_at = models.DateTimeField(auto_now_add=True)
    is_reviewed = models.BooleanField(default=False)

    class Meta:
        verbose_name = 'Visitor Feedback'
        verbose_name_plural = 'Visitor Feedback'
        ordering = ['-submitted_at']

    def __str__(self):
        label = self.user.username if self.user else self.name or 'Anonymous'
        return f'{label} – {self.rating}★ ({self.category})'
