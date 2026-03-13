import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { mealService } from '../services/mealService'
import type { Meal } from '../types/meal'

export const useMeals = () => {
  return useQuery({
    queryKey: ['meals'],
    queryFn: mealService.getAllMeals,
    staleTime: 1000 * 60 * 5,
  })
}

export const useMeal = (id: string) => {
  return useQuery({
    queryKey: ['meal', id],
    queryFn: () => mealService.getMealById(id),
    enabled: !!id,
  })
}

export const useCreateMeal = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (meal: Omit<Meal, 'id'>) => mealService.createMeal(meal),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] })
    },
  })
}

export const useUpdateMeal = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, meal }: { id: string; meal: Partial<Meal> }) =>
      mealService.updateMeal(id, meal),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] })
    },
  })
}

export const useDeleteMeal = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => mealService.deleteMeal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] })
    },
  })
}
