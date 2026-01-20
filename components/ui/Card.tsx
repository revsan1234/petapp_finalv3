import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <div
      className={`glass-panel rounded-[2rem] p-8 sm:p-10 text-white transition-all duration-300 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
