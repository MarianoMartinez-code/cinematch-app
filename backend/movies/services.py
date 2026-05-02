import httpx
import os
import random

class TMDBService:
    def __init__(self):
        # Lee el token que guardaste en el archivo .env
        self.api_token = os.getenv("TMDB_API_TOKEN")
        self.base_url = "https://api.themoviedb.org/3"
        self.headers = {
            "Authorization": f"Bearer {self.api_token}",
            "accept": "application/json"
        }

    def get_movies_by_genres(self, genre_ids=None):
        """
        Consulta películas a TMDB. 
        Si genre_ids tiene datos (ej: [28, 12]), filtrará por esos géneros.
        Retorna una lista de películas limpia para el Frontend.
        """
        params = {
            "include_adult": "false",
            "language": "es-ES",
            "page": random.randint(1, 5), 
            "sort_by": "popularity.desc"
        }
        
        if genre_ids:
            # TMDB espera los IDs de los géneros separados por comas
            params["with_genres"] = ",".join(map(str, genre_ids))

        with httpx.Client() as client:
            response = client.get(f"{self.base_url}/discover/movie", params=params, headers=self.headers)
            
            if response.status_code == 200:
                raw_results = response.json().get('results', [])
                clean_movies = []
                for movie in raw_results:
                    if movie.get('poster_path'):
                        clean_movies.append({
                            "movie_id": movie.get("id"),
                            "title": movie.get("title"),
                            "overview": movie.get("overview"),
                            # URL completa para el gradiente dinámico y visualización
                            "poster_url": f"https://image.tmdb.org/t/p/w500{movie.get('poster_path')}",
                            # Lista de IDs necesaria para el endpoint /swipe/
                            "genre_ids": movie.get("genre_ids"), 
                            "release_date": movie.get("release_date"),
                            "vote_average": movie.get("vote_average"),
                        })
                return clean_movies
                
            return []