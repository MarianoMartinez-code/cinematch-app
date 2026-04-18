import { motion } from 'framer-motion';
import { 
  Search, 
  Bell, 
  Play, 
  Info, 
  User, 
  Globe
} from 'lucide-react';

// --- Simplified Movie Data ---
const TRENDING_MOVIES = [
  { id: 1, title: 'Más allá del vacío', genre: 'Sci-Fi • Suspenso', year: '2024', img: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=400' },
  { id: 2, title: 'Vals de Sombras', genre: 'Noir • Misterio', year: '2024', img: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=400' },
  { id: 3, title: 'Etéreo', genre: 'Fantasía • Drama', year: '2023', img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400' },
  { id: 4, title: 'Reyes del Asfalto', genre: 'Acción • Deporte', year: '2024', img: 'https://images.unsplash.com/photo-1542362567-b05500288cd5?q=80&w=400' },
  { id: 5, title: 'Horizonte de Neón', genre: 'Sci-Fi • Cyberpunk', year: '2024', img: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=400' },
];

const MY_LIST = [
  { id: 1, title: 'Arquitectura del Silencio', progress: 65, duration: '24:12 / 45:00', img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=200' },
  { id: 2, title: 'Estallido Sónico', progress: 85, duration: '40:02 / 52:40', img: 'https://images.unsplash.com/photo-1514525253361-bee8718a74a2?q=80&w=200' },
  { id: 3, title: 'Alma de Datos', progress: 30, duration: '14:20 / 48:00', img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=200' },
];

const RECOMMENDED_MOVIES = [
  { id: 6, title: 'Código Fractal', genre: 'Misterio • Sci-Fi', year: '2024', img: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=400' },
  { id: 7, title: 'Oasis Urbano', genre: 'Documental • Arte', year: '2023', img: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?q=80&w=400' },
  { id: 8, title: 'Último Susurro', genre: 'Terror • Drama', year: '2024', img: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=400' },
  { id: 9, title: 'Velocidad de Escape', genre: 'Acción • Sci-Fi', year: '2024', img: 'https://images.unsplash.com/photo-1614728263952-84ea256f9479?q=80&w=400' },
];

// --- Components ---

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-12 py-4 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
    <div className="flex items-center gap-12">
      <h1 className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">CineMatch</h1>
      <ul className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-400">
        <li className="text-white relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-blue-500 cursor-pointer">Inicio</li>
        <li className="hover:text-white transition-colors cursor-pointer">Series</li>
        <li className="hover:text-white transition-colors cursor-pointer">Películas</li>
        <li className="hover:text-white transition-colors cursor-pointer">Lo más nuevo</li>
        <li className="hover:text-white transition-colors cursor-pointer">Mi lista</li>
      </ul>
    </div>
    <div className="flex items-center gap-6">
      <Search className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white transition-colors" />
      <Bell className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white transition-colors" />
      <div className="w-8 h-8 rounded bg-gradient-to-tr from-orange-400 to-red-500 flex items-center justify-center overflow-hidden cursor-pointer">
        <User className="w-5 h-5 text-white" />
      </div>
    </div>
  </nav>
);

const MovieCard = ({ title, genre, year, img }: any) => (
  <motion.div 
    whileHover={{ scale: 1.05 }}
    className="flex-shrink-0 w-64 group cursor-pointer"
  >
    <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-3 border border-white/10 group-hover:border-blue-500/50 transition-colors">
      <img src={img} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
    <h4 className="font-bold text-white mb-0.5">{title}</h4>
    <p className="text-xs text-gray-500">{genre} • {year}</p>
  </motion.div>
);

const MovieRow = ({ title, movies }: any) => (
  <section className="px-12 py-8">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-bold">{title}</h2>
        <span className="px-2 py-0.5 bg-blue-600 text-[10px] font-bold rounded uppercase tracking-wider">Hoy</span>
      </div>
      <button className="text-xs text-gray-500 hover:text-white transition-colors">Ver todo</button>
    </div>
    <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
      {movies.map((movie: any) => <MovieCard key={movie.id} {...movie} />)}
    </div>
  </section>
);

const ProgressCard = ({ title, progress, duration, img }: any) => (
  <div className="flex-1 min-w-[300px] bg-white/5 border border-white/10 rounded-xl p-4 flex gap-4 hover:bg-white/10 transition-colors cursor-pointer">
    <div className="w-20 h-12 rounded-md overflow-hidden bg-gray-800 flex-shrink-0">
      <img src={img} alt={title} className="w-full h-full object-cover" />
    </div>
    <div className="flex-1">
      <h4 className="text-sm font-bold mb-2 truncate">{title}</h4>
      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-1">
        <div className="h-full bg-blue-500" style={{ width: `${progress}%` }} />
      </div>
      <p className="text-[10px] text-gray-500">{duration}</p>
    </div>
  </div>
);

function App() {
  return (
    <div className="min-h-screen bg-background selection:bg-blue-500/30">
      <Navbar />

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
      <MovieRow title="Tendencias Ahora" movies={TRENDING_MOVIES} />

      {/* New Releases Section (Featured Layout) */}
      <section className="px-12 py-8">
        <h2 className="text-xl font-bold mb-6">Nuevos Lanzamientos</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="relative aspect-video rounded-3xl overflow-hidden group cursor-pointer border border-white/5">
            <img src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1200" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Cyberpunk Redux" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-12 flex flex-col justify-end">
              <span className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-2">Streaming Ahora</span>
              <h3 className="text-4xl font-black mb-4">CYBERPUNK REDUX</h3>
              <button className="flex items-center gap-3 text-sm font-bold group-hover:text-blue-400 transition-colors">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </div>
                Ver estreno de temporada
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-8">
            <div className="relative h-1/2 rounded-3xl overflow-hidden group cursor-pointer bg-white/5 border border-white/5">
              <img src="https://images.unsplash.com/photo-1549399542-7e3f8b79c3d9?q=80&w=800" className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" alt="The Path Untold" />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                <h3 className="text-2xl font-bold mb-1">El Camino No Contado</h3>
                <p className="text-xs text-gray-400">Un viaje cinematográfico a lo salvaje</p>
              </div>
            </div>
            <div className="flex gap-8 h-1/2">
              <div className="relative flex-1 rounded-3xl overflow-hidden group cursor-pointer bg-white/5 border border-white/5">
                 <img src="https://images.unsplash.com/photo-1542281286-9e0a16bb7366?q=80&w=600" className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" alt="Liquid Sound" />
                 <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                  <h4 className="text-lg font-bold">Sonido Líquido</h4>
                  <span className="text-[10px] text-green-400 font-bold uppercase mt-1">Nueva Serie</span>
                 </div>
              </div>
              <div className="relative flex-1 rounded-3xl overflow-hidden group cursor-pointer bg-white/5 border border-white/5">
                 <img src="https://images.unsplash.com/photo-1493238792000-8113da705763?q=80&w=600" className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" alt="Prism" />
                 <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                  <h4 className="text-lg font-bold">Prisma</h4>
                  <span className="text-[10px] text-red-500 font-bold uppercase mt-1">Tendencia</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Section */}
      <MovieRow title="Recomendados" movies={RECOMMENDED_MOVIES} />

      {/* My List Section */}
      <section className="px-12 py-8 mb-20">
        <h2 className="text-xl font-bold mb-6">Mi Lista</h2>
        <div className="flex flex-wrap gap-6">
          {MY_LIST.map(item => <ProgressCard key={item.id} {...item} />)}
        </div>
      </section>

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
