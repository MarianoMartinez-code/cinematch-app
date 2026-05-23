from django.urls import path
from .views import init_profile, toggle_watchlist, get_me, update_profile

urlpatterns = [
    path('init-profile/', init_profile, name='init_profile'),
    path('watchlist/', toggle_watchlist, name='toggle_watchlist'),
    path('me/', get_me, name='get_me'),
    path('update-profile/', update_profile, name='update_profile'),
]
