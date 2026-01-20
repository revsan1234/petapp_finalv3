import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  children: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({
  label,
  id,
  children,
  className = "",
  ...props
}) => {
  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className="block mb-2 text-sm font-semibold text-white/70 uppercase tracking-widest"
      >
        {label}
      </label>
      <select
        id={id}
        className={`bg-white/10 border border-white/30 text-[#333] text-lg font-medium rounded-xl focus:ring-4 focus:ring-white/20 focus:border-white/50 block w-full p-4 transition-all shadow-inner outline-none [&>option]:text-gray-800 ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  );
};
