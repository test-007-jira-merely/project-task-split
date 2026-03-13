import { AnimatedContainer } from '@/components/ui/AnimatedContainer';

export function HomePage() {
  return (
    <AnimatedContainer>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        Home
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        Meal generator will be implemented in the next subtask
      </p>
    </AnimatedContainer>
  );
}
