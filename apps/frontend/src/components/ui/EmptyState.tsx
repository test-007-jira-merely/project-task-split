import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 flex items-center justify-center bg-surface border-2 border-dashed border-border rounded-full mb-4">
        <Icon className="w-8 h-8 text-text-tertiary" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-text-secondary max-w-md mb-6">{description}</p>
      {action}
    </div>
  );
}
