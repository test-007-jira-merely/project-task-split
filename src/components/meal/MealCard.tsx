import React from 'react';
import { motion } from 'framer-motion';
import MatchIndicator from './MatchIndicator';

interface MealCardProps {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  ingredientCount: number;
  matchPercentage: number;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onClick: (id: string) => void;
}

const MealCard: React.FC<MealCardProps> = ({
  id,
  name,
  category,
  description,
  image,
  ingredientCount,
  matchPercentage,
  isFavorite,
  onToggleFavorite,
  onClick,
}) => {
  return (
    <motion.div
      className="group bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer"
      whileHover={{ y: -4 }}
      onClick={() => onClick(id)}
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Favorite button - top-left */}
        <button
          className="absolute top-3 left-3 p-2 bg-white/90 rounded-full shadow-md hover:bg-white transition-colors z-10"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(id);
          }}
        >
          <svg
            className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'fill-none text-gray-600'}`}
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
        </button>

        {/* Match indicator - top-right */}
        <div className="absolute top-3 right-3">
          <MatchIndicator percentage={matchPercentage} size="sm" />
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-lg font-semibold text-gray-900 flex-1">{name}</h3>
          <span className="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
            {category}
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>

        <div className="flex items-center text-sm text-gray-500">
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          {ingredientCount} ingredients
        </div>
      </div>
    </motion.div>
  );
};

export default MealCard;
