from django.http import JsonResponse
from .services import TMDBService
from users.models import UserProfile
import json
from django.views.decorators.csrf import csrf_exempt


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


@csrf_exempt # Solo si no estás usando DRF; si usas APIView no es necesario
def handle_movie_swipe(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        movie_id = data.get('movie_id')
        direction = data.get('direction') # 'like' o 'dislike'
        genre_ids = data.get('genre_ids', [])
        
        user_id = getattr(request, 'user_id', None)
        
        if not user_id:
            return JsonResponse({"error": "No autorizado"}, status=401)

        # 1. Obtener o crear el perfil (usando 'id' como en tu get_next_movies)
        profile, created = UserProfile.objects.get_or_create(id=user_id)
        
        # 2. Lógica de pesos (+1 / -0.5)
        scores = profile.genre_scores or {}
        adjustment = 1.0 if direction == 'like' else -0.5

        for g_id in genre_ids:
            g_id_str = str(g_id)
            current_val = scores.get(g_id_str, 0.0)
            # Actualizamos y aseguramos que no sea negativo
            scores[g_id_str] = max(0.0, current_val + adjustment)

        # 3. Guardar cambios
        profile.genre_scores = scores
        profile.save()

        return JsonResponse({
            "status": "success",
            "new_scores": scores
        })

    return JsonResponse({"error": "Método no permitido"}, status=405)