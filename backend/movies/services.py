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
            "page": 1, 
            "sort_by": "popularity.desc"
        }
        
        if genre_ids:
            # TMDB espera los IDs de los géneros separados por el carácter pipe (|) para significar 'OR'
            params["with_genres"] = "|".join(map(str, genre_ids))

        with httpx.Client() as client:
            response = client.get(f"{self.base_url}/discover/movie", params=params, headers=self.headers)
            
            if response.status_code == 200:
                raw_results = response.json().get('results', [])
                return self._clean_movies(raw_results)
                
            return []

    def get_popular_movies(self):
        """Obtiene películas populares para el onboarding"""
        params = {
            "language": "es-ES",
            "page": 1
        }
        with httpx.Client() as client:
            response = client.get(f"{self.base_url}/movie/popular", params=params, headers=self.headers)
            if response.status_code == 200:
                return self._clean_movies(response.json().get('results', []))
            return []

    def get_movie_recommendations(self, movie_id):
        """Obtiene recomendaciones basadas en una película específica"""
        params = {
            "language": "es-ES",
            "page": 1
        }
        with httpx.Client() as client:
            response = client.get(f"{self.base_url}/movie/{movie_id}/recommendations", params=params, headers=self.headers)
            if response.status_code == 200:
                return self._clean_movies(response.json().get('results', []))
            return []

    def get_movie(self, movie_id):
        """Obtiene los detalles de una película específica"""
        params = {
            "language": "es-ES"
        }
        with httpx.Client() as client:
            response = client.get(f"{self.base_url}/movie/{movie_id}", params=params, headers=self.headers)
            if response.status_code == 200:
                movie = response.json()
                if movie.get('poster_path'):
                    return {
                        "movie_id": movie.get("id"),
                        "title": movie.get("title"),
                        "overview": movie.get("overview"),
                        "poster_url": f"https://image.tmdb.org/t/p/w500{movie.get('poster_path')}",
                        "genre_ids": [g.get('id') for g in movie.get("genres", [])], 
                        "release_date": movie.get("release_date"),
                        "vote_average": movie.get("vote_average"),
                    }
            return None

    def _clean_movies(self, raw_results):
        clean_movies = []
        for movie in raw_results:
            if movie.get('poster_path'):
                clean_movies.append({
                    "movie_id": movie.get("id"),
                    "title": movie.get("title"),
                    "overview": movie.get("overview"),
                    "poster_url": f"https://image.tmdb.org/t/p/w500{movie.get('poster_path')}",
                    "genre_ids": movie.get("genre_ids"), 
                    "release_date": movie.get("release_date"),
                    "vote_average": movie.get("vote_average"),
                })
        return clean_movies