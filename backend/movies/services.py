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
                return response.json().get('results', [])
            return []