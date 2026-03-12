// Placeholder Card component - will be implemented in Subtask 1
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return <div className={`rounded p-4 ${className}`}>{children}</div>;
};

export default Card;
