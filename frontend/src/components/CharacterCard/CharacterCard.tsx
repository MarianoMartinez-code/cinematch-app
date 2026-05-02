// Importamos hooks y librerías necesarias
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './CharacterCard.css';

// Definimos la interfaz solo con los atributos solicitados: genero e imagen
interface CharacterCardProps {
  image: string;
  genre: string;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ image, genre }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <motion.div 
      className="character-card"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -10, transition: { duration: 0.3 } }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Contenedor de la imagen */}
      <div className="card-image-container">
        <AnimatePresence>
          {!loaded && !error && (
            <motion.div 
              key="skeleton"
              className="image-skeleton"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          )}
        </AnimatePresence>
        
        <img 
          src={error ? 'https://images.unsplash.com/photo-1594322436404-5a0526db4d13?q=80&w=300' : image} 
          alt="Personaje" 
          className={`character-image ${loaded ? 'loaded' : 'loading'}`}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
        
        {/* Atributo Género mostrado como una etiqueta sobre la imagen */}
        <div className="genre-badge">{genre}</div>
      </div>
      
      {/* Eliminamos el resto del contenido (nombre, descripción, etc.) según lo solicitado */}
    </motion.div>
  );
};

export default CharacterCard;
