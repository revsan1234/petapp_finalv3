
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input: React.FC<InputProps> = ({ label, id, ...props }) => {
  return (
    <div className="w-full">
      <label htmlFor={id} className="block mb-2 text-lg font-medium text-[var(--text-main)] opacity-90">{label}</label>
      <input
        id={id}
        className="bg-white/10 border border-white/30 text-[var(--text-main)] text-lg rounded-lg focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] block w-full p-3 placeholder-[var(--text-main)]/50 placeholder:text-lg transition-colors"
        {...props}
      />
    </div>
  );
};
