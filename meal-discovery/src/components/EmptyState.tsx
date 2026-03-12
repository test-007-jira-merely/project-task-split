import { EmptyStateProps } from '@/types/components';
import { Button } from './ui/Button';

export const EmptyState = ({ title, description, action, icon }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {icon && <div className="text-gray-400 dark:text-gray-600 mb-4">{icon}</div>}
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-center mb-6">{description}</p>
      {action && (
        <Button onClick={action.onClick}>{action.label}</Button>
      )}
    </div>
  );
};
