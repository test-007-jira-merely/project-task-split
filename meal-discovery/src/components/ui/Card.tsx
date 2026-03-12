import { CardProps } from '@/types/components';

export const Card = ({ children, className = '', onClick }: CardProps) => {
  const baseStyles = 'bg-card rounded-2xl shadow-lg border border-border p-6 transition-all duration-200';
  const interactiveStyles = onClick ? 'cursor-pointer hover:shadow-xl hover:scale-[1.02]' : '';

  return (
    <div className={`${baseStyles} ${interactiveStyles} ${className}`} onClick={onClick}>
      {children}
    </div>
  );
};
