import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Meal {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  ingredients: string[];
  instructions: string[];
  isFavorite: boolean;
}

interface MealDetailsModalProps {
  meal: Meal | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
}

const MealDetailsModal: React.FC<MealDetailsModalProps> = ({
  meal,
  isOpen,
  onClose,
  onToggleFavorite,
}) => {
  if (!meal) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={meal.image}
                  alt={meal.name}
                  className="w-full h-full object-cover"
                />

                {/* Close button */}
                <button
                  className="absolute top-4 right-4 p-2 bg-white/90 rounded-full shadow-md hover:bg-white transition-colors"
                  onClick={onClose}
                >
                  <svg
                    className="w-6 h-6 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                {/* Favorite button */}
                <button
                  className="absolute top-4 left-4 p-2 bg-white/90 rounded-full shadow-md hover:bg-white transition-colors"
                  onClick={() => onToggleFavorite(meal.id)}
                >
                  <svg
                    className={`w-6 h-6 ${
                      meal.isFavorite ? 'fill-red-500 text-red-500' : 'fill-none text-gray-600'
                    }`}
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
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-16rem)] p-6">
                {/* Meal Details */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <h2 className="text-3xl font-bold text-gray-900">{meal.name}</h2>
                    <span className="px-4 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full">
                      {meal.category}
                    </span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{meal.description}</p>
                </div>

                {/* Ingredients */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Ingredients</h3>
                  <ul className="space-y-2">
                    {meal.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-block w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Instructions */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Instructions</h3>
                  <ol className="space-y-3">
                    {meal.instructions.map((instruction, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-primary-600 text-white rounded-full font-semibold mr-3 flex-shrink-0 text-sm">
                          {index + 1}
                        </span>
                        <span className="text-gray-700 pt-1">{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MealDetailsModal;
