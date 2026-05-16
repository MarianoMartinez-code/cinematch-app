from django.db import models

class UserProfile(models.Model):
    # ID: Usamos UUID porque es el formato que usa Supabase para identificar usuarios únicos.
    id = models.UUIDField(primary_key=True, editable=False)
    
    # Email: Para identificar al usuario (obligatorio que sea único).
    email = models.EmailField(unique=True)
    
    # genre_scores: Aquí guardaremos un diccionario de puntos.
    # Ejemplo: {"Acción": 12.0, "Terror": -5.0}
    genre_scores = models.JSONField(default=dict) 
    
    # watchlist: Guardaremos una lista de IDs de películas añadidas a "Mi Lista"
    watchlist = models.JSONField(default=list) 

    # liked_movies: Guardaremos una lista de IDs de películas a las que el usuario dio "Me Gustó"
    liked_movies = models.JSONField(default=list)

    def __str__(self):
        return self.email