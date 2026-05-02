import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './CharacterCard.css';

interface CharacterCardProps {
  name: string;
  image: string;
  genre: string;
  description: string;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ name, image, genre, description }) => {
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
          alt={name} 
          className={`character-image ${loaded ? 'loaded' : 'loading'}`}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
        <div className="genre-badge">{genre}</div>
      </div>
      
      <div className="card-content">
        <div className="card-header">
          <h3 className="character-name">{name}</h3>
        </div>
        
        <div className="card-body">
          <p className="character-description">{description}</p>
        </div>
        
        <div className="card-footer">
          <button className="view-details-btn">View Details</button>
        </div>
      </div>
    </motion.div>
  );
};

export default CharacterCard;
