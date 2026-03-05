// Placeholder Button component - will be implemented in Subtask 1
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: string;
  size?: string;
  loading?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, disabled, type = 'button', className = '' }) => {
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`px-4 py-2 rounded ${className}`}>
      {children}
    </button>
  );
};

export default Button;
