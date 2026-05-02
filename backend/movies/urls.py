from django.urls import path
from . import views

urlpatterns = [
    path('next/', views.get_next_movies),
    path('swipe/', views.handle_movie_swipe),
]