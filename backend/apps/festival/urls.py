from rest_framework.routers import DefaultRouter
from .views import FestivalInfoViewSet, FeedbackViewSet

router = DefaultRouter()
router.register(r'info', FestivalInfoViewSet, basename='festival-info')
router.register(r'feedback', FeedbackViewSet, basename='feedback')

urlpatterns = router.urls
