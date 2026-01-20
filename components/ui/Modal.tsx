import React from "react";
import { Button } from "./Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  children: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex justify-center items-center p-4 animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-white rounded-[3rem] shadow-2xl p-8 sm:p-12 text-[#333] w-full max-w-2xl mx-auto border-4 border-white/20 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-black uppercase tracking-tight text-[#AA336A]">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-3 bg-black/5 hover:bg-black/10 rounded-full transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="mb-10">{children}</div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          {onConfirm ? (
            <>
              <Button
                onClick={onClose}
                variant="secondary"
                className="w-full !py-4"
              >
                {cancelText}
              </Button>
              <Button
                onClick={onConfirm}
                variant="surprise"
                className="w-full !py-4"
              >
                {confirmText}
              </Button>
            </>
          ) : (
            <Button
              onClick={onClose}
              variant="primary"
              className="w-full !py-4"
            >
              Close
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
