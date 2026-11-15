from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import AchievementViewSet, PassportView, QuizViewSet

router = DefaultRouter()
router.register(r'achievements', AchievementViewSet, basename='achievement')
router.register(r'quiz', QuizViewSet, basename='quiz')

urlpatterns = router.urls + [
    path('passport/', PassportView.as_view({'get': 'list'}), name='passport'),
]
