import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-[var(--card-bg)] backdrop-blur-xl rounded-[2.5rem] shadow-lg p-6 sm:p-8 text-[var(--text-main)] border border-white/30 transition-all duration-300 ${className}`}>
      {children}
    </div>
  );
};