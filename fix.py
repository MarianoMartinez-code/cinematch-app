import sys
path = 'frontend/src/pages/Dashboard.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    '  const [isLoading, setIsLoading] = useState(true);',
    '  const [isLoading, setIsLoading] = useState(true);\n  const [profileLikedMovies, setProfileLikedMovies] = useState<Movie[]>([]);\n  const [profileWatchlistMovies, setProfileWatchlistMovies] = useState<Movie[]>([]);'
)

# the mapMovie logic
fetchMoviesOld = '''      // Obtenemos el perfil para recuperar la lista de películas guardadas
      try {
        const meRes = await fetch('http://localhost:8000/api/users/me/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (meRes.ok) {
          const meData = await meRes.json();
          const newInteractions: Record<number, { mylist: boolean, liked: boolean }> = {};
          meData.watchlist?.forEach((id: number) => {
            newInteractions[id] = { mylist: true, liked: false };
          });
          meData.liked_movies?.forEach((id: number) => {
            if (newInteractions[id]) {
                newInteractions[id].liked = true;
            } else {
                newInteractions[id] = { mylist: false, liked: true };
            }
          });
          setInteractions(newInteractions);
        }
      } catch (e) { console.error(e); }'''

fetchMoviesNew = '''      const mapMovie = (m: any): Movie => ({
        id: m.movie_id,
        title: m.title,
        genre: (m.genre_ids || []).map((id: number) => GENRE_MAP[id] || 'Género').join(' • '),
        genreIds: m.genre_ids || [],
        year: m.release_date ? m.release_date.split('-')[0] : '2024',
        img: m.poster_url,
        description: m.overview || 'Sin descripción disponible.'
      });

      // Obtenemos el perfil para recuperar la lista de películas guardadas
      try {
        const meRes = await fetch('http://localhost:8000/api/users/me/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (meRes.ok) {
          const meData = await meRes.json();
          const newInteractions: Record<number, { mylist: boolean, liked: boolean }> = {};
          meData.watchlist?.forEach((id: number) => {
            newInteractions[id] = { mylist: true, liked: false };
          });
          meData.liked_movies?.forEach((id: number) => {
            if (newInteractions[id]) {
                newInteractions[id].liked = true;
            } else {
                newInteractions[id] = { mylist: false, liked: true };
            }
          });
          setInteractions(newInteractions);

          const likedIds = meData.liked_movies || [];
          const watchlistIds = meData.watchlist || [];
          
          if (likedIds.length > 0) {
              const res = await fetch(`http://localhost:8000/api/movies/details/?ids=${likedIds.join(',')}`, { headers: { 'Authorization': `Bearer ${token}` } });
              if (res.ok) {
                  const details = await res.json();
                  setProfileLikedMovies(details.results.map(mapMovie));
              }
          }
          if (watchlistIds.length > 0) {
              const res = await fetch(`http://localhost:8000/api/movies/details/?ids=${watchlistIds.join(',')}`, { headers: { 'Authorization': `Bearer ${token}` } });
              if (res.ok) {
                  const details = await res.json();
                  setProfileWatchlistMovies(details.results.map(mapMovie));
              }
          }
        }
      } catch (e) { console.error(e); }'''

content = content.replace(fetchMoviesOld, fetchMoviesNew)

content = content.replace(
    '''      const mappedMovies: Movie[] = data.results?.map((m: any) => ({
        id: m.movie_id,
        title: m.title,
        genre: m.genre_ids.map((id: number) => GENRE_MAP[id] || 'Género').join(' • '),
        genreIds: m.genre_ids,
        year: m.release_date ? m.release_date.split('-')[0] : '2024',
        img: m.poster_url,
        description: m.overview || 'Sin descripción disponible.'
      })) || [];''',
    '''      const mappedMovies: Movie[] = data.results?.map(mapMovie) || [];'''
)

content = content.replace(
    "      const movie = allMovies.find(m => m.id === movieId);",
    "      const movie = allMovies.find(m => m.id === movieId) || profileLikedMovies.find(m => m.id === movieId) || profileWatchlistMovies.find(m => m.id === movieId);"
)

content = content.replace(
    '''      if (type === 'liked') {
        await fetch('http://localhost:8000/api/movies/swipe/', {''',
    '''      if (type === 'liked') {
        if (isLikingOrAdding && movie) {
           setProfileLikedMovies(prev => [...prev, movie]);
        } else {
           setProfileLikedMovies(prev => prev.filter(m => m.id !== movieId));
        }
        await fetch('http://localhost:8000/api/movies/swipe/', {'''
)

content = content.replace(
    '''      } else if (type === 'mylist') {
        await fetch('http://localhost:8000/api/users/watchlist/', {''',
    '''      } else if (type === 'mylist') {
        if (isLikingOrAdding && movie) {
           setProfileWatchlistMovies(prev => [...prev, movie]);
        } else {
           setProfileWatchlistMovies(prev => prev.filter(m => m.id !== movieId));
        }
        await fetch('http://localhost:8000/api/users/watchlist/', {'''
)

content = content.replace(
    '{likedMovies.map(movie => (',
    '{profileLikedMovies.map(movie => ('
)

content = content.replace(
    '{likedMovies.length > 0 ? (',
    '{profileLikedMovies.length > 0 ? ('
)

content = content.replace(
    '{myListMovies.map(movie => (',
    '{profileWatchlistMovies.map(movie => ('
)

content = content.replace(
    '{myListMovies.length > 0 ? (',
    '{profileWatchlistMovies.length > 0 ? ('
)

with open(path, 'w', encoding='utf-8', newline='') as f:
    f.write(content)

print('Success')
