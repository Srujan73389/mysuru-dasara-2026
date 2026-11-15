from rest_framework.routers import DefaultRouter
from .views import ExhibitViewSet

router = DefaultRouter()
router.register(r'exhibits', ExhibitViewSet, basename='exhibit')

urlpatterns = router.urls
