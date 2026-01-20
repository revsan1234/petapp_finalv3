import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  id,
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
      <input
        id={id}
        className={`bg-white/10 border border-white/30 text-[#333] text-lg font-medium rounded-xl focus:ring-4 focus:ring-white/20 focus:border-white/50 block w-full p-4 placeholder-[#333]/40 transition-all shadow-inner outline-none ${className}`}
        {...props}
      />
    </div>
  );
};
