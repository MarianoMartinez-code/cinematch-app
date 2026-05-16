from django.http import JsonResponse
from .services import TMDBService
from users.models import UserProfile
import json
from django.views.decorators.csrf import csrf_exempt


def get_onboarding_movies(request):
    tmdb = TMDBService()
    movies = tmdb.get_popular_movies()
    return JsonResponse({"results": movies})

def get_movies_details(request):
    ids_str = request.GET.get('ids', '')
    if not ids_str:
        return JsonResponse({"results": []})
        
    ids = ids_str.split(',')
    tmdb = TMDBService()
    movies = []
    
    for m_id in ids:
        m_id = m_id.strip()
        if m_id:
            movie = tmdb.get_movie(m_id)
            if movie:
                movies.append(movie)
                
    return JsonResponse({"results": movies})

def get_next_movies(request):
    user_id = getattr(request, 'user_id', None)
    movies = []
    
    if user_id:
        try:
            profile = UserProfile.objects.get(id=user_id)
            liked_movies = profile.liked_movies
            watchlist = profile.watchlist
            
            tmdb = TMDBService()
            
            if liked_movies:
                # Tomar las últimas 2 películas gustadas para recomendaciones variadas
                recent_likes = liked_movies[-2:]
                
                for m_id in recent_likes:
                    recs = tmdb.get_movie_recommendations(m_id)
                    movies.extend(recs)
                
                # Eliminar duplicados si hay cruce de recomendaciones
                seen = set()
                unique_movies = []
                for m in movies:
                    if m['movie_id'] not in seen:
                        seen.add(m['movie_id'])
                        unique_movies.append(m)
                
                # Excluir las que el usuario ya le dio like o están en su watchlist
                movies = [m for m in unique_movies if m['movie_id'] not in liked_movies and m['movie_id'] not in watchlist]
                
            # Si aún no hay películas (o no le ha dado like a nada), damos populares
            if not movies:
                movies = tmdb.get_popular_movies()
                
        except UserProfile.DoesNotExist:
            movies = TMDBService().get_popular_movies()
    else:
        movies = TMDBService().get_popular_movies()

    # Devolvemos un máximo de 20 películas
    return JsonResponse({"results": movies[:20]})


@csrf_exempt
def handle_movie_swipe(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        movie_id = data.get('movie_id')
        direction = data.get('direction') # 'like' o 'dislike'
        genre_ids = data.get('genre_ids', [])
        
        user_id = getattr(request, 'user_id', None)
        
        if not user_id:
            return JsonResponse({"error": "No autorizado"}, status=401)

        profile, created = UserProfile.objects.get_or_create(id=user_id)
        
        # 1. Guardar la película en liked_movies
        if direction == 'like':
            liked_list = profile.liked_movies or []
            if movie_id not in liked_list:
                liked_list.append(movie_id)
                profile.liked_movies = liked_list
        
        # 2. Lógica de pesos para analítica opcional
        scores = profile.genre_scores or {}
        adjustment = 1.0 if direction == 'like' else -0.5

        for g_id in genre_ids:
            g_id_str = str(g_id)
            current_val = scores.get(g_id_str, 0.0)
            scores[g_id_str] = max(0.0, current_val + adjustment)

        profile.genre_scores = scores
        profile.save()

        return JsonResponse({"status": "success"})

    return JsonResponse({"error": "Método no permitido"}, status=405)