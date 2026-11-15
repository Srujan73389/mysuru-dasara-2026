from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/accounts/', include('apps.accounts.urls')),
    path('api/events/', include('apps.events.urls')),
    path('api/venues/', include('apps.venues.urls')),
    path('api/tourism/', include('apps.tourism.urls')),
    path('api/itineraries/', include('apps.itineraries.urls')),
    path('api/heritage/', include('apps.heritage.urls')),
    path('api/achievements/', include('apps.achievements.urls')),
    path('api/announcements/', include('apps.announcements.urls')),
    path('api/ai/', include('apps.ai_assistant.urls')),
    path('api/festival/', include('apps.festival.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
