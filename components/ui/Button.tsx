import React from "react";
import { useLanguage } from "../../contexts/LanguageContext";

type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "surprise";
  href?: string;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: (e: React.MouseEvent) => void;
  target?: string;
  rel?: string;
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  className = "",
  href,
  disabled,
  ...props
}) => {
  const baseStyles =
    "glass-button rounded-full font-semibold px-8 py-4 flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed text-white uppercase tracking-wide";

  const variantStyles = {
    primary: "border-white/50 text-white shadow-lg",
    secondary: "bg-white/10 border-white/20",
    surprise: "bg-[#AA336A]/30 border-[#AA336A]/50 text-white font-bold",
  };

  const combinedClassName =
    `${baseStyles} ${variantStyles[variant]} ${className}`.trim();

  if (href) {
    return (
      <a href={href} className={combinedClassName} {...(props as any)}>
        {children}
      </a>
    );
  }

  return (
    <button className={combinedClassName} disabled={disabled} {...props}>
      {children}
    </button>
  );
};

export const BackToHomeButton: React.FC<{ onClick: () => void }> = ({
  onClick,
}) => {
  const { t } = useLanguage();
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="flex items-center gap-2 text-white hover:bg-white/30 transition-all bg-white/10 px-6 py-2.5 rounded-full backdrop-blur-md font-semibold uppercase tracking-widest text-xs w-fit shadow-md border border-white/30 active:scale-95"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2.5}
        stroke="currentColor"
        className="w-4 h-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 19.5 8.25 12l7.5-7.5"
        />
      </svg>
      {t.common.back_home}
    </button>
  );
};
