import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit2, Trash2, Upload, Shield } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Modal } from '../../components/ui/Modal'
import { AdminMealForm } from '../../components/admin/AdminMealForm'
import { EmptyState } from '../../components/ui/EmptyState'
import { useMeals, useCreateMeal, useUpdateMeal, useDeleteMeal } from '../../hooks/useMeals'
import { useAppStore } from '../../stores/useAppStore'
import { isAdmin } from '../../services/supabase'
import { useNavigate } from 'react-router-dom'
import type { Meal } from '../../types/meal'

export const AdminPage = () => {
  const { user } = useAppStore()
  const navigate = useNavigate()
  const { data: meals, isLoading } = useMeals()
  const createMeal = useCreateMeal()
  const updateMeal = useUpdateMeal()
  const deleteMeal = useDeleteMeal()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null)
  const [importData, setImportData] = useState('')
  const [showImport, setShowImport] = useState(false)

  if (!user || !isAdmin(user.email)) {
    return (
      <div className="space-y-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
          Admin Panel
        </h1>
        <EmptyState
          icon={<Shield className="w-16 h-16" />}
          title="Access Denied"
          description="You don't have permission to access this page."
          action={<Button onClick={() => navigate('/')}>Go Home</Button>}
        />
      </div>
    )
  }

  const handleCreate = async (data: Omit<Meal, 'id'>) => {
    await createMeal.mutateAsync(data)
    setIsFormOpen(false)
  }

  const handleUpdate = async (data: Omit<Meal, 'id'>) => {
    if (!editingMeal) return
    await updateMeal.mutateAsync({ id: editingMeal.id, meal: data })
    setEditingMeal(null)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this meal?')) {
      await deleteMeal.mutateAsync(id)
      
    }
  }

  const handleImport = async () => {
    try {
      const mealsData = JSON.parse(importData)
      const mealsArray = Array.isArray(mealsData) ? mealsData : [mealsData]

      for (const meal of mealsArray) {
        await createMeal.mutateAsync({
          name: meal.name,
          description: meal.description,
          imageUrl: meal.imageUrl || meal.image_url,
          ingredients: meal.ingredients,
          instructions: meal.instructions,
          category: meal.category,
          preparationTime: meal.preparationTime || meal.preparation_time,
          difficulty: meal.difficulty,
        })
      }

      setImportData('')
      setShowImport(false)
      alert(`Successfully imported ${mealsArray.length} meal(s)`)
    } catch (error: any) {
      alert('Failed to import meals: ' + error.message)
    }
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100">
            Admin Panel
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
            Manage meals and content
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setShowImport(true)}>
            <Upload className="w-5 h-5 mr-2" />
            Import
          </Button>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="w-5 h-5 mr-2" />
            Add Meal
          </Button>
        </div>
      </motion.div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            All Meals ({meals?.length || 0})
          </h2>
        </div>

        {isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Loading meals...</p>
          </div>
        )}

        {!isLoading && meals && meals.length === 0 && (
          <EmptyState
            title="No meals yet"
            description="Start by adding your first meal or importing a dataset."
          />
        )}

        {!isLoading && meals && meals.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                    Image
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                    Name
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                    Category
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                    Ingredients
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {meals.map((meal) => (
                  <tr
                    key={meal.id}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="py-3 px-4">
                      <img
                        src={meal.imageUrl}
                        alt={meal.name}
                        className="w-16 h-16 object-cover rounded-xl"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {meal.name}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full text-sm font-medium">
                        {meal.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                      {meal.ingredients.length} items
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingMeal(meal)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(meal.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal
        isOpen={isFormOpen || !!editingMeal}
        onClose={() => {
          setIsFormOpen(false)
          setEditingMeal(null)
        }}
        title={editingMeal ? 'Edit Meal' : 'Create New Meal'}
        size="xl"
      >
        <AdminMealForm
          meal={editingMeal || undefined}
          onSubmit={editingMeal ? handleUpdate : handleCreate}
          onCancel={() => {
            setIsFormOpen(false)
            setEditingMeal(null)
          }}
        />
      </Modal>

      <Modal
        isOpen={showImport}
        onClose={() => setShowImport(false)}
        title="Import Meals"
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Paste JSON data for meals. Can be a single meal object or an array of meals.
          </p>
          <textarea
            value={importData}
            onChange={(e) => setImportData(e.target.value)}
            rows={12}
            placeholder='[{"name": "Meal Name", "description": "...", "imageUrl": "...", "ingredients": [...], "instructions": [...], "category": "lunch"}]'
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <div className="flex gap-3">
            <Button onClick={handleImport} disabled={!importData.trim()} fullWidth>
              Import
            </Button>
            <Button variant="ghost" onClick={() => setShowImport(false)} fullWidth>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
