import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import UserProfile

@csrf_exempt
def init_profile(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        movie_ids = data.get('movie_ids', [])
        user_id = getattr(request, 'user_id', None)
        user_email = getattr(request, 'user_email', '')
        
        if not user_id:
            return JsonResponse({"error": "No autorizado"}, status=401)
            
        profile, created = UserProfile.objects.get_or_create(id=user_id, defaults={'email': user_email})
        
        profile.liked_movies = movie_ids
        
        # Si el correo se actualizó o cambió
        if profile.email == '' and user_email:
            profile.email = user_email
            
        profile.save()
        return JsonResponse({"status": "success", "liked_movies": movie_ids})
    
    return JsonResponse({"error": "Método no permitido"}, status=405)

@csrf_exempt
def toggle_watchlist(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        movie_id = data.get('movie_id')
        user_id = getattr(request, 'user_id', None)
        user_email = getattr(request, 'user_email', '')
        
        if not user_id:
            return JsonResponse({"error": "No autorizado"}, status=401)
            
        profile, created = UserProfile.objects.get_or_create(id=user_id, defaults={'email': user_email})
        
        watchlist = profile.watchlist or []
        
        if movie_id in watchlist:
            watchlist.remove(movie_id)
        else:
            watchlist.append(movie_id)
            
        profile.watchlist = watchlist
        profile.save()
        
        return JsonResponse({"status": "success", "watchlist": watchlist})
        
    return JsonResponse({"error": "Método no permitido"}, status=405)

def get_me(request):
    if request.method == 'GET':
        user_id = getattr(request, 'user_id', None)
        if not user_id:
            return JsonResponse({"error": "No autorizado"}, status=401)
            
        try:
            profile = UserProfile.objects.get(id=user_id)
            return JsonResponse({
                "watchlist": profile.watchlist or [],
                "genre_scores": profile.genre_scores or {},
                "liked_movies": profile.liked_movies or []
            })
        except UserProfile.DoesNotExist:
            return JsonResponse({"watchlist": [], "genre_scores": {}, "liked_movies": []})
            
    return JsonResponse({"error": "Método no permitido"}, status=405)
