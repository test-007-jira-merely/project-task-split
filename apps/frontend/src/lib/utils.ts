import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export function getDifficultyLabel(difficulty: number): string {
  const labels = ['Very Easy', 'Easy', 'Medium', 'Hard', 'Expert'];
  return labels[difficulty - 1] || 'Medium';
}

export function getDifficultyColor(difficulty: number): string {
  const colors = [
    'text-green-600 dark:text-green-400',
    'text-lime-600 dark:text-lime-400',
    'text-yellow-600 dark:text-yellow-400',
    'text-orange-600 dark:text-orange-400',
    'text-red-600 dark:text-red-400',
  ];
  return colors[difficulty - 1] || colors[2];
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    breakfast: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300',
    lunch: 'bg-green-500/10 text-green-700 dark:text-green-300',
    dinner: 'bg-blue-500/10 text-blue-700 dark:text-blue-300',
    snack: 'bg-purple-500/10 text-purple-700 dark:text-purple-300',
  };
  return colors[category] || colors.lunch;
}
