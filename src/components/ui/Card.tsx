import { CardProps } from '../../types/ui.interface';

export const Card = ({ children, className = '', onClick, hoverable = false }: CardProps) => {
  const baseClasses = 'bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300';
  const hoverClasses = hoverable ? 'hover:shadow-xl hover:scale-[1.02] cursor-pointer' : '';

  return (
    <div
      onClick={onClick}
      className={`${baseClasses} ${hoverClasses} ${className}`}
    >
      {children}
    </div>
  );
};
