from django.http import JsonResponse
from .services import TMDBService
from users.models import UserProfile

def get_next_movies(request):
    # 1. Obtenemos el user_id que el Middleware extrajo del token JWT
    user_id = getattr(request, 'user_id', None)
    
    top_genres = []
    
    if user_id:
        try:
            # 2. Buscamos el perfil en tu tabla de Supabase
            profile = UserProfile.objects.get(id=user_id)
            scores = profile.genre_scores 
            
            # 3. Filtramos los 3 géneros con mejor puntuación positiva
            positive_scores = {k: v for k, v in scores.items() if v > 0}
            top_genres = sorted(positive_scores, key=positive_scores.get, reverse=True)[:3]
        except UserProfile.DoesNotExist:
            pass

    # 4. Usamos el servicio para traer las películas
    tmdb = TMDBService()
    movies = tmdb.get_movies_by_genres(genre_ids=top_genres)

    return JsonResponse({"results": movies})