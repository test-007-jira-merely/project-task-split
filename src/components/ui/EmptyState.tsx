// Placeholder EmptyState component - will be implemented in Subtask 1
import React from 'react';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description }) => {
  return (
    <div className="text-center py-12">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold">{title}</h3>
      {description && <p className="text-muted-foreground mt-2">{description}</p>}
    </div>
  );
};

export default EmptyState;
