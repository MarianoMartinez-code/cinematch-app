import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Info } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

// --- Types ---
interface Movie {
  id: number;
  title: string;
  genre: string;
  genreIds: number[];
  year: string;
  img: string;
  description: string;
}


// --- Simplified Movie Data ---
// Ahora se cargan desde la API

// --- Components ---

const Navbar = ({ character, onProfileClick, onSwiperClick }: { character: any, onProfileClick: () => void, onSwiperClick: () => void }) => (
  <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-12 py-4 bg-linear-to-b from-black/80 to-transparent backdrop-blur-sm">
    <div className="flex items-center gap-12">
      <h1 className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-blue-500 to-cyan-400 cursor-pointer" onClick={() => window.location.reload()}>CineMatch</h1>
      <ul className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-400">
        <li className="text-white relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-blue-500 cursor-pointer" onClick={() => window.location.reload()}>Inicio</li>
        <li className="hover:text-white transition-colors cursor-pointer" onClick={onSwiperClick}>Swiper</li>
      </ul>
    </div>
    <div className="flex items-center gap-6">
      <div 
        className="w-10 h-10 rounded-full overflow-hidden border border-white/20 hover:border-blue-500 transition-colors cursor-pointer shadow-lg"
        onClick={onProfileClick}
      >
        <img src={character?.image || "/images/avatars/avatar_popcorn.png"} alt="Profile" className="w-full h-full object-cover" />
      </div>
    </div>
  </nav>
);

const MovieCard = ({ title, genre, year, img, tick, onClick }: Movie & { tick: number, onClick: () => void }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    onClick={onClick}
    className="flex-shrink-0 w-64 group cursor-pointer"
  >
    <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-3 border border-white/10 group-hover:border-blue-500/50 transition-colors">
      <img src={`${img}&v=${tick}`} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
      

      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <span className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold border border-white/30 transform translate-y-4 group-hover:translate-y-0 transition-transform">
          Más de cerca
        </span>
      </div>
    </div>
    <h4 className="font-bold text-white mb-0.5">{title}</h4>
    <p className="text-xs text-gray-500">{genre} • {year}</p>
  </motion.div>
);

const MovieRow = ({ title, movies, tick, onMovieClick }: { title: string, movies: Movie[], tick: number, onMovieClick: (movie: Movie) => void }) => (
  <section className="px-12 py-8">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-bold">{title}</h2>
        <span className="px-2 py-0.5 bg-blue-600 text-[10px] font-bold rounded uppercase tracking-wider">Hoy</span>
      </div>
      <button className="text-xs text-gray-500 hover:text-white transition-colors">Ver todo</button>
    </div>
    <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
      {movies.map((movie) => (
        <MovieCard 
          key={movie.id} 
          {...movie} 
          tick={tick} 
          onClick={() => onMovieClick(movie)}
        />
      ))}
    </div>
  </section>
);


function Dashboard() {
  const [tick, setTick] = useState(0);
  
  // Estado de Perfil
  const [showProfile, setShowProfile] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: 'Usuario Premium',
    image: '/images/avatars/avatar_popcorn.png'
  });

  // Estado para las películas de la API
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);
  const [dynamicGenreMovies, setDynamicGenreMovies] = useState<Movie[]>([]);
  const [dynamicGenreTitle, setDynamicGenreTitle] = useState('Comedia');
  const [heroMovie, setHeroMovie] = useState<Movie | null>(null);
  const [profileLikedMovies, setProfileLikedMovies] = useState<Movie[]>([]);
  const [profileWatchlistMovies, setProfileWatchlistMovies] = useState<Movie[]>([]);

  // Mapeo de IDs de géneros de TMDB a nombres legibles
  const GENRE_MAP: Record<number, string> = {
    28: 'Acción', 12: 'Aventura', 16: 'Animación', 35: 'Comedia', 80: 'Crimen',
    99: 'Documental', 18: 'Drama', 10751: 'Familia', 14: 'Fantasía', 36: 'Historia',
    27: 'Terror', 10402: 'Música', 9648: 'Misterio', 10749: 'Romance', 878: 'Ciencia Ficción',
    10770: 'Película de TV', 53: 'Suspenso', 10752: 'Guerra', 37: 'Western'
  };

  const AVATARS = [
    '/images/avatars/avatar_popcorn.png',
    '/images/avatars/avatar_clapper.png',
    '/images/avatars/avatar_film.png',
    '/images/avatars/avatar_ticket.png',
    '/images/avatars/avatar_camera.png'
  ];

  // Estado para las interacciones con las películas
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [interactions, setInteractions] = useState<Record<number, { mylist: boolean, liked: boolean }>>({});

  const fetchMovies = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const mapMovie = (m: any): Movie => ({
        id: m.movie_id,
        title: m.title,
        genre: (m.genre_ids || []).map((id: number) => GENRE_MAP[id] || 'Género').join(' • '),
        genreIds: m.genre_ids || [],
        year: m.release_date ? m.release_date.split('-')[0] : '2024',
        img: m.poster_url,
        description: m.overview || 'Sin descripción disponible.'
      });

      let chosenGenreId: number | null = null;
      let chosenGenreTitle = 'Comedia';

      const savedOnboardingGenres = localStorage.getItem('onboardingGenres');
      if (savedOnboardingGenres) {
          try {
              const parsedGenres = JSON.parse(savedOnboardingGenres);
              if (Array.isArray(parsedGenres) && parsedGenres.length > 0) {
                  const randGenre = parsedGenres[Math.floor(Math.random() * parsedGenres.length)];
                  chosenGenreId = randGenre;
                  chosenGenreTitle = GENRE_MAP[randGenre] || 'Recomendados';
              }
          } catch (e) { console.error(e); }
      }

      // Obtenemos el perfil para recuperar la lista de películas guardadas
      try {
        const meRes = await fetch('http://localhost:8000/api/users/me/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (meRes.ok) {
          const meData = await meRes.json();
          setUserProfile({
            name: meData.email ? meData.email.split('@')[0] : 'Usuario Premium',
            image: meData.profile_image || '/images/avatars/avatar_popcorn.png'
          });
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
                  const likedMapped = details.results.map(mapMovie);
                  setProfileLikedMovies(likedMapped);
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
      } catch (e) { console.error(e); }

      const response = await fetch('http://localhost:8000/api/movies/next/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      const mappedMovies: Movie[] = data.results?.map(mapMovie) || [];

      // Distribuimos las películas en las secciones (simulación para este demo)
      setTrendingMovies(mappedMovies.slice(0, 5));
      setRecommendedMovies(mappedMovies.slice(5, 10));

      let dynamicMovies = mappedMovies;
      if (chosenGenreId) {
          dynamicMovies = mappedMovies.filter(m => m.genreIds.includes(chosenGenreId!));
      } else {
          dynamicMovies = mappedMovies.filter(m => m.genreIds.includes(35)); // Fallback a Comedia
      }
      
      if (dynamicMovies.length === 0) {
          dynamicMovies = mappedMovies.slice(10, 15);
      }

      setDynamicGenreTitle(chosenGenreTitle);
      setDynamicGenreMovies(dynamicMovies.slice(0, 5));
      if (dynamicMovies.length > 0) {
          setHeroMovie(dynamicMovies[Math.floor(Math.random() * dynamicMovies.length)]);
      } else if (mappedMovies.length > 0) {
          setHeroMovie(mappedMovies[Math.floor(Math.random() * mappedMovies.length)]);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const toggleInteraction = async (movieId: number, type: 'mylist' | 'liked') => {
    const isLikingOrAdding = !interactions[movieId]?.[type];

    setInteractions(prev => {
      const current = prev[movieId] || { mylist: false, liked: false };
      return {
        ...prev,
        [movieId]: {
          ...current,
          [type]: !current[type]
        }
      };
    });

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const movie = allMovies.find(m => m.id === movieId) || profileLikedMovies.find(m => m.id === movieId) || profileWatchlistMovies.find(m => m.id === movieId);

      if (type === 'liked') {
        if (isLikingOrAdding && movie) {
           setProfileLikedMovies(prev => [...prev, movie]);
        } else {
           setProfileLikedMovies(prev => prev.filter(m => m.id !== movieId));
        }
        await fetch('http://localhost:8000/api/movies/swipe/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            movie_id: movieId,
            direction: isLikingOrAdding ? 'like' : 'dislike',
            genre_ids: movie?.genreIds || []
          })
        });
      } else if (type === 'mylist') {
        if (isLikingOrAdding && movie) {
           setProfileWatchlistMovies(prev => [...prev, movie]);
        } else {
           setProfileWatchlistMovies(prev => prev.filter(m => m.id !== movieId));
        }
        await fetch('http://localhost:8000/api/users/watchlist/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            movie_id: movieId
          })
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateProfileImage = async (url: string) => {
    setUserProfile(prev => ({ ...prev, image: url }));
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      
      const response = await fetch('http://localhost:8000/api/users/update-profile/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ profile_image: url })
      });
      if (!response.ok) {
        console.error("Error al actualizar la imagen de perfil en el backend");
      }
    } catch (e) {
      console.error("Error de red al actualizar la imagen de perfil:", e);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    // Temporizador invisible de 3 minutos para asegurar que las imágenes se refresquen y rendericen correctamente
    const timer = setInterval(() => {
      setTick(prev => prev + 1);
    }, 180000);

    return () => clearInterval(timer);
  }, []);

  // Removido showHome logic
  const allMovies = [...trendingMovies, ...recommendedMovies, ...dynamicGenreMovies];

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background selection:bg-blue-500/30">
      <Navbar 
        character={userProfile}
        onProfileClick={() => setShowProfile(true)}
        onSwiperClick={() => navigate('/onboarding')}
      />

      {/* Hero Section */}
      {heroMovie ? (
        <section className="relative h-[90vh] flex items-end px-12 pb-24 overflow-hidden">
          {/* Hero Background */}
          <div className="absolute inset-0 z-0">
            <img
              src={heroMovie.img || "https://images.unsplash.com/photo-1614728263952-84ea256f9479?q=80&w=2000"}
              className="w-full h-full object-cover object-top opacity-60 ml-20"
              alt="Hero"
            />
            <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-transparent" />
            <div className="absolute inset-0 bg-linear-to-r from-background via-transparent to-transparent" />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2 py-0.5 bg-purple-600 text-[10px] font-bold rounded uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> EN VIVO
              </span>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">{dynamicGenreTitle || 'Película Destacada'}</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black mb-6 leading-none tracking-tighter uppercase line-clamp-2">
              {heroMovie.title}
            </h1>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed line-clamp-3">
              {heroMovie.description}
            </p>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSelectedMovie(heroMovie)}
                className="flex items-center gap-2 px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg backdrop-blur-md transition-colors border border-white/10"
              >
                <Info className="w-5 h-5" /> Más información
              </button>
            </div>
          </div>
        </section>
      ) : (
        <section className="relative h-[90vh] flex items-end px-12 pb-24 overflow-hidden bg-gray-900/40">
          <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-transparent" />
          <div className="relative z-10 max-w-2xl animate-pulse w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-20 h-6 bg-gray-800 rounded-full" />
              <div className="w-32 h-4 bg-gray-800 rounded-full" />
            </div>
            <div className="w-full h-24 bg-gray-800 rounded-xl mb-6" />
            <div className="w-3/4 h-6 bg-gray-800 rounded-full mb-3" />
            <div className="w-2/3 h-6 bg-gray-800 rounded-full mb-8" />
            <div className="w-48 h-12 bg-gray-800 rounded-lg" />
          </div>
        </section>
      )}

      {/* Trending Section */}
      {trendingMovies.length > 0 && (
        <MovieRow 
          title="Tendencias Ahora" 
          movies={trendingMovies} 
          tick={tick} 
          onMovieClick={setSelectedMovie}
        />
      )}

      {/* New Releases Section ... */}
      {/* ... (sin cambios aquí) ... */}

      {/* Recommended Section */}
      {recommendedMovies.length > 0 && (
        <MovieRow 
          title="Recomendados" 
          movies={recommendedMovies} 
          tick={tick} 
          onMovieClick={setSelectedMovie}
        />
      )}

      {/* Dynamic Genre Section */}
      {dynamicGenreMovies.length > 0 && (
        <MovieRow 
          title={dynamicGenreTitle} 
          movies={dynamicGenreMovies} 
          tick={tick} 
          onMovieClick={setSelectedMovie}
        />
      )}

      {/* Modal Perfil */}
      <AnimatePresence>
        {showProfile && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-2xl overflow-y-auto no-scrollbar"
          >
            <div className="max-w-7xl mx-auto px-12 py-20">
              <div className="flex items-center justify-between mb-16">
                <h2 className="text-6xl font-black tracking-tighter">MI PERFIL</h2>
                <button 
                  onClick={() => setShowProfile(false)}
                  className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
                >
                  ✕
                </button>
              </div>

              <div className="flex flex-col lg:flex-row gap-20 items-start">
                {/* Avatar Selector */}
                <div className="w-full lg:w-80 flex-shrink-0">
                  <div className="relative aspect-square rounded-3xl overflow-hidden mb-8 border-4 border-blue-500/30 shadow-[0_0_50px_rgba(59,130,246,0.2)]">
                    <img src={userProfile.image} alt="Profile" className="w-full h-full object-cover object-center" />
                  </div>
                  <h3 className="text-xl font-bold mb-6 text-gray-400">Cambiar Avatar</h3>
                  <div className="flex flex-wrap gap-4 mb-12">
                    {AVATARS.map((url, i) => (
                      <motion.button
                        key={i}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => updateProfileImage(url)}
                        className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all ${userProfile.image === url ? 'border-blue-500' : 'border-transparent opacity-50 hover:opacity-100'}`}
                      >
                        <img src={url} alt="Avatar option" className="w-full h-full object-cover object-center" />
                      </motion.button>
                    ))}
                  </div>
                  <button 
                    onClick={async () => { await supabase.auth.signOut(); window.location.href = '/login'; }} 
                    className="w-full py-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold rounded-2xl transition-all border border-red-500/20 hover:border-red-500/40 uppercase tracking-widest text-xs"
                  >
                    Cerrar sesión
                  </button>
                </div>

                {/* Gustos Section */}
                <div className="flex-1 w-full">
                  <div className="flex items-center gap-4 mb-12">
                    <div className="h-px flex-1 bg-white/10" />
                    <span className="text-blue-500 font-black tracking-[0.5em] uppercase text-xs">Gustos Personalizados</span>
                    <div className="h-px flex-1 bg-white/10" />
                  </div>

                  <div className="space-y-16">
                    {/* Fila Me Gustó */}
                    <div>
                      <div className="flex items-center gap-3 mb-8">
                        <div className="w-2 h-8 bg-green-500 rounded-full" />
                        <h3 className="text-2xl font-black tracking-tight">PELÍCULAS QUE ME GUSTARON</h3>
                      </div>
                      {profileLikedMovies.length > 0 ? (
                        <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
                          {profileLikedMovies.map(movie => (
                            <MovieCard 
                              key={movie.id} 
                              {...movie} 
                              tick={tick} 
                              onClick={() => {
                                setSelectedMovie(movie);
                                // No cerramos el perfil para que pueda volver
                              }} 
                            />
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-600 italic">Aún no has marcado ninguna película con "Me Gustó".</p>
                      )}
                    </div>

                    {/* Fila Mi Lista */}
                    <div>
                      <div className="flex items-center gap-3 mb-8">
                        <div className="w-2 h-8 bg-blue-500 rounded-full" />
                        <h3 className="text-2xl font-black tracking-tight">EN MI LISTA</h3>
                      </div>
                      {profileWatchlistMovies.length > 0 ? (
                        <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
                          {profileWatchlistMovies.map(movie => (
                            <MovieCard 
                              key={movie.id} 
                              {...movie} 
                              tick={tick} 
                              onClick={() => setSelectedMovie(movie)} 
                            />
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-600 italic">Tu lista está vacía actualmente.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal 'Más de cerca' */}
      <AnimatePresence mode='wait'>
        {selectedMovie && (
          <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="relative w-full max-w-5xl bg-zinc-900 rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row shadow-2xl border border-white/5"
            >
              {/* Botón de Cerrar (ahora en la derecha) */}
              <button 
                onClick={() => setSelectedMovie(null)}
                className="absolute top-6 right-6 w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-all border border-white/10 z-50"
              >
                ✕
              </button>

              {/* Imagen */}
              <div className="relative w-full md:w-5/12 aspect-[2/3] md:aspect-auto">
                <img src={selectedMovie.img} className="w-full h-full object-cover" alt={selectedMovie.title} />
              </div>

              {/* Contenido */}
              <div className="p-8 md:p-16 flex-1 flex flex-col justify-center bg-linear-to-br from-zinc-900 to-black">
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-px w-8 bg-blue-500" />
                  <span className="text-blue-500 text-[10px] font-black uppercase tracking-[0.4em]">Detalles de película</span>
                </div>
                
                <h2 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter leading-[0.9] text-white">
                  {selectedMovie.title}
                </h2>

                <div className="flex items-center gap-4 text-[10px] text-gray-500 font-black mb-8 uppercase tracking-widest bg-white/5 w-fit px-4 py-2 rounded-full border border-white/5">
                  <span className="text-blue-400">{selectedMovie.genre}</span>
                  <span className="w-1 h-1 bg-gray-700 rounded-full" />
                  <span>{selectedMovie.year}</span>
                </div>

                <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-12 max-w-xl">
                  {selectedMovie.description}
                </p>

                {/* Botones de Acción */}
                <div className="flex flex-wrap gap-4">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleInteraction(selectedMovie.id, 'mylist')}
                    className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border ${
                      interactions[selectedMovie.id]?.mylist 
                      ? 'bg-blue-600 text-white border-blue-400 shadow-[0_0_20px_rgba(37,99,235,0.4)]' 
                      : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {interactions[selectedMovie.id]?.mylist ? '✓ En mi lista' : '+ Mi lista'}
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleInteraction(selectedMovie.id, 'liked')}
                    className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border ${
                      interactions[selectedMovie.id]?.liked 
                      ? 'bg-green-600 text-white border-green-400 shadow-[0_0_20px_rgba(22,163,74,0.4)]' 
                      : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {interactions[selectedMovie.id]?.liked ? '❤ Me gustó' : '♡ Me gustó'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="px-12 py-12 bg-black/40 border-t border-white/5 flex flex-col items-center justify-center gap-6">
        <div className="text-center text-sm text-gray-500 tracking-[0.2em] uppercase">
          Fundadores: <span className="text-white font-bold">Josue Guarimata F.</span> y <span className="text-white font-bold">Mariano</span>
        </div>
        <div className="text-center text-xs text-gray-600 italic max-w-lg">
          "Quicumque hoc legit, stultus est."
          <br />
          <span className="font-bold text-gray-500 mt-2 block">— jimmy neutron 7600a.c</span>
        </div>
      </footer>

      {/* Global Background Glow */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none -z-10" />
    </div>
  );
}

export default Dashboard;
