import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import CharacterCard from './CharacterCard/CharacterCard';

interface Movie {
  movie_id: number;
  title: string;
  poster_url: string;
  genre_ids?: number[];
}

interface OnboardingProps {
  onComplete?: (likes: number[]) => void;
}

const CharacterSelection: React.FC<OnboardingProps> = ({ onComplete }) => {
  const navigate = useNavigate();
  const [items, setItems] = useState<Movie[]>([]);
  const [likes, setLikes] = useState<number[]>([]);
  const [likedGenres, setLikedGenres] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastDirection, setLastDirection] = useState<'left' | 'right' | null>(null);

  useEffect(() => {
    const fetchOnboardingMovies = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const res = await fetch('http://localhost:8000/api/movies/onboarding/', {
           headers: { 'Authorization': `Bearer ${session?.access_token}` }
        });
        if (res.ok) {
           const data = await res.json();
           // Invertimos el array porque el SwipeCard saca el último elemento (el de más arriba visualmente)
           setItems((data.results || []).slice(0, 10).reverse()); 
        }
      } catch (e) {
        console.error("Error fetching onboarding movies", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOnboardingMovies();
  }, []);

  const handleSwipe = (id: number, direction: 'left' | 'right') => {
    const swipedItem = items.find(i => i.movie_id === id);
    if (!swipedItem) return;

    setLastDirection(direction);

    setTimeout(() => {
      if (direction === 'left') {
        setLikes(prev => [...prev, swipedItem.movie_id]);
        if (swipedItem.genre_ids) {
            setLikedGenres(prev => [...prev, ...swipedItem.genre_ids!]);
        }
      }

      setItems(prev => {
        const newItems = prev.filter(i => i.movie_id !== id);
        if (newItems.length === 0) {
          setFinished(true);
        }
        return newItems;
      });
    }, 50);
  };

  const handleAction = (direction: 'left' | 'right') => {
    if (items.length > 0 && !finished) {
        handleSwipe(items[items.length - 1].movie_id, direction);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'arrowright' || key === 'd') {
        handleAction('right');
      } else if (key === 'arrowleft' || key === 'a') {
        handleAction('left');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items, finished]);

  if (finished) {
    return (
      <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-8 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md">
          <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(59,130,246,0.5)]">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-4xl font-black mb-4 tracking-tighter uppercase">¡Perfil Configurado!</h2>
          <p className="text-gray-500 mb-12 italic text-sm">Has dado Me Gusta a {likes.length} películas.</p>
          <button onClick={async () => {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;
            try {
              await fetch('http://localhost:8000/api/users/init-profile/', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ movie_ids: likes })
              });
            } catch (e) {
              console.error(e);
            }
            if (onComplete) onComplete(likes);
            localStorage.setItem('onboardingGenres', JSON.stringify(likedGenres));
            localStorage.removeItem('isNewUser');
            navigate('/home');
          }} className="w-full py-4 bg-white text-black font-black rounded-2xl hover:bg-blue-400 hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-xl">
            ENTRAR A CINEMATCH
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-8 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="relative z-10 text-center mb-12">
        <h1 className="text-4xl font-black tracking-tighter mb-2 text-white uppercase">Elige qué te gusta</h1>
        <p className="text-gray-500 text-[10px] tracking-widest uppercase font-bold">
            Usa los <span className="text-blue-500">Botones</span> o las teclas <span className="text-blue-500">A/D o Flechas</span>
        </p>
      </div>

      <div className="relative w-full max-w-[320px] aspect-[4/5] flex items-center justify-center">
        {isLoading ? (
            <div className="text-white">Cargando películas populares...</div>
        ) : (
            <AnimatePresence mode='popLayout'>
            {items.map((item, index) => (
                <SwipeCard 
                key={item.movie_id} 
                item={item} 
                index={index}
                direction={lastDirection}
                />
            ))}
            </AnimatePresence>
        )}
      </div>

      {/* Controles Interactivos (Botones y Teclas) */}
      <div className="mt-16 flex gap-12 z-10">
        <div className="flex flex-col items-center gap-3">
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleAction('left')}
                className="w-16 h-16 rounded-full border-2 border-blue-500/30 flex items-center justify-center text-blue-500 text-2xl font-black bg-blue-500/5 hover:bg-blue-500/20 transition-colors shadow-lg shadow-blue-500/10"
            >
                A
            </motion.button>
            <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Me gusta</span>
        </div>
        
        <div className="flex flex-col items-center gap-3">
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleAction('right')}
                className="w-16 h-16 rounded-full border-2 border-red-500/30 flex items-center justify-center text-red-500 text-2xl font-black bg-red-500/5 hover:bg-red-500/20 transition-colors shadow-lg shadow-red-500/10"
            >
                D
            </motion.button>
            <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Pasar</span>
        </div>
      </div>
    </div>
  );
};

const SwipeCard = ({ item, index, direction }: { item: Movie, index: number, direction: 'left' | 'right' | null }) => {
  return (
    <motion.div
      style={{ position: 'absolute', zIndex: index }}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ 
        x: direction === 'left' ? -600 : 600, 
        rotate: direction === 'left' ? -45 : 45,
        opacity: 0, 
        transition: { duration: 0.5, ease: "circIn" } 
      }}
    >
      <CharacterCard image={item.poster_url} genre={item.title} />
    </motion.div>
  );
};

export default CharacterSelection;
