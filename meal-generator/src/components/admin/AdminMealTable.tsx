import { useState } from 'react';
import { Edit, Trash2, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { Meal } from '@/types';

interface AdminMealTableProps {
  meals: Meal[];
  onEdit: (meal: Meal) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export function AdminMealTable({ meals, onEdit, onDelete, isLoading }: AdminMealTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredMeals = meals.filter(meal => {
    const matchesSearch = meal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         meal.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || meal.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search meals..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">All Categories</option>
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="snack">Snack</option>
        </select>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-card border-b border-border">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold">Image</th>
                <th className="text-left px-6 py-4 text-sm font-semibold">Name</th>
                <th className="text-left px-6 py-4 text-sm font-semibold">Category</th>
                <th className="text-left px-6 py-4 text-sm font-semibold">Ingredients</th>
                <th className="text-left px-6 py-4 text-sm font-semibold">Difficulty</th>
                <th className="text-right px-6 py-4 text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMeals.map((meal, index) => (
                <motion.tr
                  key={meal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="border-b border-border hover:bg-card/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <img
                      src={meal.imageUrl}
                      alt={meal.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium">{meal.name}</div>
                    <div className="text-sm text-foreground/60 line-clamp-1">
                      {meal.description}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full text-sm capitalize">
                      {meal.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground/60">
                    {meal.ingredients.length} items
                  </td>
                  <td className="px-6 py-4">
                    {meal.difficulty && (
                      <span className="capitalize text-sm">{meal.difficulty}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(meal)}
                        className="p-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(meal.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredMeals.length === 0 && (
          <div className="text-center py-12 text-foreground/60">
            {searchQuery || categoryFilter !== 'all'
              ? 'No meals match your filters'
              : 'No meals yet'}
          </div>
        )}
      </div>
    </div>
  );
}
