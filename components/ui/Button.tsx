
import React from 'react';

// Base classes for layout and custom button styles. Styling is defined in index.html.
const baseClasses = "w-full sm:w-auto btn";

// A simplified props type that allows for both button and anchor attributes.
type ButtonProps = {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  href?: string;
  // This allows all other valid HTML attributes for either an `<a>` or `<button>`
  [x: string]: any; 
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  className,
  href,
  ...props
}) => {
  const variantClass = variant === 'primary' ? 'btn-primary' : 'btn-secondary';
  const combinedClassName = `${baseClasses} ${variantClass} ${className || ''}`.trim();

  if (href) {
    // Render a link if href is provided
    return (
      <a href={href} className={combinedClassName} {...props}>
        {children}
      </a>
    );
  }

  // Render a button by default
  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
};