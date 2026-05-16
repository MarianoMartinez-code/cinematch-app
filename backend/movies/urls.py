from django.urls import path
from .views import get_next_movies, handle_movie_swipe, get_onboarding_movies, get_movies_details

urlpatterns = [
    path('next/', get_next_movies, name='next_movies'),
    path('swipe/', handle_movie_swipe, name='swipe_movie'),
    path('onboarding/', get_onboarding_movies, name='onboarding_movies'),
    path('details/', get_movies_details, name='movies_details'),
]