import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  children: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({ label, id, children, ...props }) => {
  return (
    <div className="w-full">
      <label htmlFor={id} className="block mb-2 text-lg font-medium text-[var(--text-main)] opacity-90">{label}</label>
      <select
        id={id}
        className="bg-white/10 border border-white/30 text-[var(--text-main)] text-lg rounded-lg focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] block w-full p-2.5 transition-colors [&>option]:text-[#666666]"
        {...props}
      >
        {children}
      </select>
    </div>
  );
};