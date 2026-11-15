from django.db import models
from django.contrib.auth.models import User


class Achievement(models.Model):
    """A badge/achievement that users can earn."""

    CATEGORY_CHOICES = [
        ('explorer', 'Explorer'),
        ('historian', 'Historian'),
        ('enthusiast', 'Enthusiast'),
        ('participant', 'Participant'),
    ]

    name = models.CharField(max_length=200)
    name_kn = models.CharField(max_length=200, blank=True, default='', verbose_name='Name (Kannada)')
    description = models.TextField(blank=True, default='')
    icon = models.CharField(max_length=100, blank=True, default='', help_text='Icon name or emoji')
    badge_image = models.ImageField(upload_to='badges/', null=True, blank=True)
    points = models.PositiveIntegerField(default=10)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='explorer')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Achievement'
        verbose_name_plural = 'Achievements'
        ordering = ['-points']

    def __str__(self):
        return self.name


class UserAchievement(models.Model):
    """Records when a user earns an achievement."""

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='achievements')
    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE, related_name='earners')
    earned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'User Achievement'
        verbose_name_plural = 'User Achievements'
        unique_together = ('user', 'achievement')
        ordering = ['-earned_at']

    def __str__(self):
        return f'{self.user.username} – {self.achievement.name}'


class HeritagePassport(models.Model):
    """Digital heritage passport tracking a user's exploration progress."""

    LEVEL_CHOICES = [
        ('bronze', 'Bronze'),
        ('silver', 'Silver'),
        ('gold', 'Gold'),
        ('platinum', 'Platinum'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='passport')
    total_points = models.PositiveIntegerField(default=0)
    level = models.CharField(max_length=10, choices=LEVEL_CHOICES, default='bronze')
    stamps_earned = models.JSONField(default=list, blank=True, help_text='List of stamp identifiers earned')
    last_activity = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Heritage Passport'
        verbose_name_plural = 'Heritage Passports'

    def __str__(self):
        return f'{self.user.username} – Passport ({self.level})'


class QuizQuestion(models.Model):
    """A quiz question about Mysuru / Dasara heritage."""

    DIFFICULTY_CHOICES = [
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard'),
    ]

    question = models.TextField()
    question_kn = models.TextField(blank=True, default='', verbose_name='Question (Kannada)')
    options = models.JSONField(help_text='List of 4 answer options')
    correct_answer_index = models.PositiveSmallIntegerField(help_text='Zero-based index of correct option')
    explanation = models.TextField(blank=True, default='')
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES, default='medium')
    category = models.CharField(max_length=100, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Quiz Question'
        verbose_name_plural = 'Quiz Questions'

    def __str__(self):
        return self.question[:80]


class QuizAttempt(models.Model):
    """Records a user's attempt at a quiz question."""

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='quiz_attempts')
    question = models.ForeignKey(QuizQuestion, on_delete=models.CASCADE, related_name='attempts')
    selected_answer = models.PositiveSmallIntegerField()
    is_correct = models.BooleanField(default=False)
    attempted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Quiz Attempt'
        verbose_name_plural = 'Quiz Attempts'
        ordering = ['-attempted_at']

    def __str__(self):
        status = 'Correct' if self.is_correct else 'Wrong'
        return f'{self.user.username} – Q{self.question.pk} ({status})'
