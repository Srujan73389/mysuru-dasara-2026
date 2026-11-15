from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    """Extended profile for Django's built-in User model."""

    LANGUAGE_CHOICES = [
        ('en', 'English'),
        ('kn', 'Kannada'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(blank=True, default='')
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    preferred_language = models.CharField(
        max_length=2,
        choices=LANGUAGE_CHOICES,
        default='en',
    )
    phone = models.CharField(max_length=20, blank=True, default='')
    city = models.CharField(max_length=100, blank=True, default='')
    saved_events = models.ManyToManyField(
        'events.FestivalEvent',
        blank=True,
        related_name='saved_by_users',
    )
    passport_points = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'User Profile'
        verbose_name_plural = 'User Profiles'

    def __str__(self):
        return f'{self.user.username} – Profile'
