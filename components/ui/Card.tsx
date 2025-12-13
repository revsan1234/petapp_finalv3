import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-[var(--card-bg)] backdrop-blur-md rounded-2xl shadow-lg p-6 text-[var(--text-main)] border border-white/20 transition-colors duration-300 ${className}`}>
      {children}
    </div>
  );
};