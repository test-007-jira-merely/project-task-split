import { motion } from 'framer-motion';
import { Eye, ChefHat, Star } from 'lucide-react';
import type { Dish } from '@meal-platform/shared';

interface HistoryEntry {
  id: string;
  dish: Dish;
  action: 'viewed' | 'cooked' | 'rated';
  timestamp: Date;
  rating?: number;
}

interface HistoryTimelineProps {
  entries: HistoryEntry[];
  onViewDish?: (dish: Dish) => void;
}

export function HistoryTimeline({ entries, onViewDish }: HistoryTimelineProps) {
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'viewed':
        return Eye;
      case 'cooked':
        return ChefHat;
      case 'rated':
        return Star;
      default:
        return Eye;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'viewed':
        return 'text-blue-500';
      case 'cooked':
        return 'text-green-500';
      case 'rated':
        return 'text-yellow-500';
      default:
        return 'text-muted';
    }
  };

  return (
    <div className="space-y-6">
      {entries.map((entry, index) => {
        const Icon = getActionIcon(entry.action);
        const color = getActionColor(entry.action);

        return (
          <motion.div
            key={entry.id}
            className="flex gap-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {/* Timeline indicator */}
            <div className="flex flex-col items-center">
              <div className={`p-2 rounded-full bg-card-bg border-2 border-current ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              {index < entries.length - 1 && (
                <div className="w-0.5 h-full bg-border mt-2" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pb-8">
              <div className="card cursor-pointer" onClick={() => onViewDish?.(entry.dish)}>
                <div className="flex items-start gap-4">
                  <img
                    src={entry.dish.imageUrl}
                    alt={entry.dish.name}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{entry.dish.name}</h4>
                    <p className="text-sm text-muted capitalize">
                      {entry.action} • {new Date(entry.timestamp).toLocaleDateString()}
                    </p>
                    {entry.rating && (
                      <div className="flex items-center gap-1 mt-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < entry.rating! ? 'fill-yellow-500 text-yellow-500' : 'text-muted'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
