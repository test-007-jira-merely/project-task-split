import { useState, useMemo } from 'react';
import { Edit2, Trash2, Search } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import type { Meal } from '@/types';

interface AdminMealTableProps {
  meals: Meal[];
  isLoading: boolean;
  onEdit: (meal: Meal) => void;
  onDelete: (id: string) => void;
}

export default function AdminMealTable({ meals, isLoading, onEdit, onDelete }: AdminMealTableProps) {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const filteredMeals = useMemo(() => {
    if (!search.trim()) return meals;

    const searchLower = search.toLowerCase();
    return meals.filter(
      (meal) =>
        meal.name.toLowerCase().includes(searchLower) ||
        meal.category.toLowerCase().includes(searchLower) ||
        meal.ingredients.some((ing) => ing.toLowerCase().includes(searchLower))
    );
  }, [meals, search]);

  const totalPages = Math.ceil(filteredMeals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMeals = filteredMeals.slice(startIndex, startIndex + itemsPerPage);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <LoadingSkeleton variant="table" />
        <LoadingSkeleton variant="table" />
        <LoadingSkeleton variant="table" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search meals..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Category</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Ingredients</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Difficulty</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-card">
            {paginatedMeals.map((meal) => (
              <tr key={meal.id} className="hover:bg-muted/50 transition-colors">
                <td className="px-4 py-3 text-sm font-medium text-foreground">{meal.name}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground capitalize">{meal.category}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {meal.ingredients.length} items
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground capitalize">
                  {meal.difficulty || 'N/A'}
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(meal)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to delete "${meal.name}"?`)) {
                        onDelete(meal.id);
                      }
                    }}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredMeals.length)} of{' '}
            {filteredMeals.length} meals
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
