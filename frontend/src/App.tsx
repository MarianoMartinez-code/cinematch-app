import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Search,
  Bell,
  Play,
  Info,
  Globe
} from 'lucide-react';
import CharacterSelection from './components/CharacterSelection';

// --- Types ---
interface Movie {
  id: number;
  title: string;
  genre: string;
  year: string;
  img: string;
  description: string;
}


// --- Simplified Movie Data ---
const TRENDING_MOVIES: Movie[] = [
  { id: 1, title: 'Más allá del vacío', genre: 'Sci-Fi • Suspenso', year: '2024', img: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=400', description: 'Un viaje épico a través de las fronteras de la realidad donde el tiempo se dobla y el espacio se desvanece.' },
  { id: 2, title: 'Vals de Sombras', genre: 'Noir • Misterio', year: '2024', img: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=400', description: 'En las profundidades de una ciudad eterna, un detective privado persigue un fantasma que no quiere ser encontrado.' },
  { id: 3, title: 'Etéreo', genre: 'Fantasía • Drama', year: '2023', img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400', description: 'Una joven descubre que sus sueños tienen el poder de cambiar el mundo físico, pero a un precio devastador.' },
  { id: 4, title: 'Reyes del Asfalto', genre: 'Acción • Deporte', year: '2024', img: 'https://images.unsplash.com/photo-1542362567-b05500288cd5?q=80&w=400', description: 'La competencia por la gloria nunca ha sido tan peligrosa como en las calles nocturnas de Tokio.' },
  { id: 5, title: 'Horizonte de Neón', genre: 'Sci-Fi • Cyberpunk', year: '2024', img: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=400', description: 'En el año 2099, la tecnología es la nueva religión y la rebelión es el único pecado imperdonable.' },
];


const RECOMMENDED_MOVIES: Movie[] = [
  { id: 6, title: 'Código Fractal', genre: 'Misterio • Sci-Fi', year: '2024', img: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=400', description: 'Un matemático descubre un patrón en el caos que predice el fin de la civilización.' },
  { id: 7, title: 'Oasis Urbano', genre: 'Documental • Arte', year: '2023', img: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?q=80&w=400', description: 'Naturaleza reclamando su espacio en las megaciudades.' },
  { id: 8, title: 'Último Susurro', genre: 'Terror • Drama', year: '2024', img: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=400', description: 'El silencio es el único aliado contra una entidad invisible.' },
  { id: 9, title: 'Velocidad de Escape', genre: 'Acción • Sci-Fi', year: '2024', img: 'https://images.unsplash.com/photo-1614728263952-84ea256f9479?q=80&w=400', description: 'Un piloto renegado debe cruzar el cinturón de asteroides.' },
];

const COMEDY_MOVIES: Movie[] = [
  { id: 10, title: 'Puto el que lo lea', genre: 'Comedia', year: '2024', img: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=400', description: 'Aventuras literarias extremas.' },
  { id: 11, title: '¿Cuántos son 3? Dímelos', genre: 'Comedia', year: '2024', img: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=400', description: 'Matemáticas y fiesta no se llevan bien.' },
  { id: 12, title: 'Menos 2, dímelos', genre: 'Comedia', year: '2024', img: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?q=80&w=400', description: 'La secuela negativa.' },
  { id: 13, title: 'Di 5', genre: 'Comedia', year: '2024', img: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?q=80&w=400', description: 'El reality de los números.' },
];

// --- Components ---

const Navbar = ({ character, searchQuery, setSearchQuery, onProfileClick }: { character: any, searchQuery: string, setSearchQuery: (val: string) => void, onProfileClick: () => void }) => (
  <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-12 py-4 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
    <div className="flex items-center gap-12">
      <h1 className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400 cursor-pointer" onClick={() => window.location.reload()}>CineMatch</h1>
      <ul className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-400">
        <li className="text-white relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-blue-500 cursor-pointer">Inicio</li>
        <li className="hover:text-white transition-colors cursor-pointer">Series</li>
        <li className="hover:text-white transition-colors cursor-pointer">Películas</li>
        <li className="hover:text-white transition-colors cursor-pointer">Lo más nuevo</li>
        <li onClick={onProfileClick} className="hover:text-white transition-colors cursor-pointer">Mi perfil</li>
      </ul>
    </div>
    <div className="flex items-center gap-6">
      <div className="relative group flex items-center">
        <Search className="absolute left-3 w-4 h-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
        <input 
          type="text"
          placeholder="Buscar películas..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-1.5 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all w-40 focus:w-64"
        />
      </div>
      <Bell className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white transition-colors" />
      <div 
        onClick={onProfileClick}
        className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-400 to-cyan-500 flex items-center justify-center overflow-hidden cursor-pointer border-2 border-white/20 hover:scale-110 transition-transform shadow-lg shadow-blue-500/20"
      >
        <img src={character.image} alt="User" className="w-full h-full object-cover object-center" />
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
      

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
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


function App() {
  const [tick, setTick] = useState(0);
  const [showHome, setShowHome] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Estado de Perfil
  const [showProfile, setShowProfile] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: 'Usuario Premium',
    image: 'https://images.7tv.app/01GK9P0Z5G00085G5Z1YV7C0Y8/2x.webp'
  });

  const AVATARS = [
    'https://images.7tv.app/01GK9P0Z5G00085G5Z1YV7C0Y8/2x.webp', // Messi Pelado
    'https://i.imgflip.com/4/33i4r0.jpg', // Red Bird
    'https://i.pinimg.com/originals/1b/83/8a/1b838a3c8708c8f0e06093557e034e34.jpg', // Puppy
    'https://pbs.twimg.com/media/E_9Rz_rXIAEkG6B.jpg', // Hola Tonotos
    'https://pbs.twimg.com/media/E8N9-u7X0AAb8_v.jpg' // Gato Baboso
  ];

  // Estado para las interacciones con las películas
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [interactions, setInteractions] = useState<Record<number, { mylist: boolean, liked: boolean }>>({});

  const toggleInteraction = (movieId: number, type: 'mylist' | 'liked') => {
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
  };

  useEffect(() => {
    // Temporizador invisible de 3 minutos para asegurar que las imágenes se refresquen y rendericen correctamente
    const timer = setInterval(() => {
      setTick(prev => prev + 1);
    }, 180000);

    return () => clearInterval(timer);
  }, []);

  const handleOnboardingComplete = () => {
    setShowHome(true);
  };

  if (!showHome) {
    return <CharacterSelection onComplete={handleOnboardingComplete} />;
  }

  const filteredTrending = TRENDING_MOVIES.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredRecommended = RECOMMENDED_MOVIES.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredComedy = COMEDY_MOVIES.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const allMovies = [...TRENDING_MOVIES, ...RECOMMENDED_MOVIES, ...COMEDY_MOVIES];
  const likedMovies = allMovies.filter(m => interactions[m.id]?.liked);
  const myListMovies = allMovies.filter(m => interactions[m.id]?.mylist);

  return (
    <div className="min-h-screen bg-background selection:bg-blue-500/30">
      <Navbar 
        character={userProfile} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        onProfileClick={() => setShowProfile(true)} 
      />

      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-end px-12 pb-24 overflow-hidden">
        {/* Hero Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1614728263952-84ea256f9479?q=80&w=2000"
            className="w-full h-full object-cover object-top opacity-60 ml-20"
            alt="Hero"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-2 py-0.5 bg-purple-600 text-[10px] font-bold rounded uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> EN VIVO
            </span>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Serie Original</span>
          </div>
          <h1 className="text-8xl font-black mb-6 leading-none tracking-tighter">
            NEON<br />HORIZON
          </h1>
          <p className="text-gray-400 text-lg mb-8 leading-relaxed">
            En un mundo donde los recuerdos se pueden canjear como moneda, un corredor callejero descubre un secreto que podría colapsar el más allá digital.
          </p>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-8 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors">
              <Play className="w-5 h-5 fill-current" /> Tendencias Hoy
            </button>
            <button className="flex items-center gap-2 px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg backdrop-blur-md transition-colors border border-white/10">
              <Info className="w-5 h-5" /> Más información
            </button>
          </div>
        </div>
      </section>

      {/* Trending Section */}
      {filteredTrending.length > 0 && (
        <MovieRow 
          title="Tendencias Ahora" 
          movies={filteredTrending} 
          tick={tick} 
          onMovieClick={setSelectedMovie}
        />
      )}

      {/* New Releases Section ... */}
      {/* ... (sin cambios aquí) ... */}

      {/* Recommended Section */}
      {filteredRecommended.length > 0 && (
        <MovieRow 
          title="Recomendados" 
          movies={filteredRecommended} 
          tick={tick} 
          onMovieClick={setSelectedMovie}
        />
      )}

      {/* Comedy Section */}
      {filteredComedy.length > 0 && (
        <MovieRow 
          title="Comedia" 
          movies={filteredComedy} 
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
                  <div className="flex flex-wrap gap-4">
                    {AVATARS.map((url, i) => (
                      <motion.button
                        key={i}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setUserProfile(prev => ({ ...prev, image: url }))}
                        className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all ${userProfile.image === url ? 'border-blue-500' : 'border-transparent opacity-50 hover:opacity-100'}`}
                      >
                        <img src={url} alt="Avatar option" className="w-full h-full object-cover object-center" />
                      </motion.button>
                    ))}
                  </div>
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
                      {likedMovies.length > 0 ? (
                        <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
                          {likedMovies.map(movie => (
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
                      {myListMovies.length > 0 ? (
                        <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
                          {myListMovies.map(movie => (
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
              {/* Imagen y Close */}
              <div className="relative w-full md:w-5/12 aspect-[2/3] md:aspect-auto">
                <img src={selectedMovie.img} className="w-full h-full object-cover" alt={selectedMovie.title} />
                <button 
                  onClick={() => setSelectedMovie(null)}
                  className="absolute top-6 left-6 w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-all border border-white/10"
                >
                  ✕
                </button>
              </div>

              {/* Contenido */}
              <div className="p-8 md:p-16 flex-1 flex flex-col justify-center bg-gradient-to-br from-zinc-900 to-black">
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

      {filteredTrending.length === 0 && filteredRecommended.length === 0 && filteredComedy.length === 0 && searchQuery && (
        <div className="px-12 py-20 text-center">
          <h3 className="text-2xl font-bold text-gray-500">No se encontraron resultados para "{searchQuery}"</h3>
          <p className="text-gray-600 mt-2">Intenta con otros términos o géneros.</p>
        </div>
      )}


      {/* Footer */}
      <footer className="px-12 py-20 bg-black/40 border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div>
            <h1 className="text-xl font-black tracking-tighter text-blue-500 mb-6 uppercase">CineMatch</h1>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              La experiencia cinematográfica definitiva, redefinida para la era moderna. Fotograma a fotograma, entregamos excelencia.
            </p>
          </div>
          <div>
            <h5 className="font-bold mb-6 text-sm">Explorar</h5>
            <ul className="flex flex-col gap-4 text-sm text-gray-500">
              <li className="hover:text-white transition-colors cursor-pointer">Originales</li>
              <li className="hover:text-white transition-colors cursor-pointer">Películas</li>
              <li className="hover:text-white transition-colors cursor-pointer">Series</li>
              <li className="hover:text-white transition-colors cursor-pointer">TV en Vivo</li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-6 text-sm">Ayuda</h5>
            <ul className="flex flex-col gap-4 text-sm text-gray-500">
              <li className="hover:text-white transition-colors cursor-pointer">Cuenta</li>
              <li className="hover:text-white transition-colors cursor-pointer">Centro de Soporte</li>
              <li className="hover:text-white transition-colors cursor-pointer">Política de Privacidad</li>
              <li className="hover:text-white transition-colors cursor-pointer">Pref. de Cookies</li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-6 text-sm">Social</h5>
            <div className="flex gap-4">
              <div className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors cursor-pointer">
                <Globe className="w-4 h-4 text-gray-400" />
              </div>
              <div className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors cursor-pointer">
                <Globe className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
        <div className="text-center text-[10px] text-gray-700 font-bold tracking-[0.3em] uppercase">
          © 2024 CINEMATCH PREMIUM STREAMING PLATFORM. TODOS LOS DERECHOS RESERVADOS.
        </div>
      </footer>

      {/* Global Background Glow */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none -z-10" />
    </div>
  );
}

export default App;
