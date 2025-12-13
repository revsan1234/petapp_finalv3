import React from 'react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void; // Made optional
  title: string;
  children: React.ReactNode;
  confirmText?: string; // Optional confirm button text
  cancelText?: string; // Optional cancel button text
}

export const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  children,
  confirmText = "Confirm",
  cancelText = "Cancel"
}) => {
  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 animate-fade-in"
        onClick={onClose}
        aria-modal="true"
        role="dialog"
    >
      <div 
        className="bg-gradient-to-b from-white/70 to-white/40 backdrop-blur-xl rounded-2xl shadow-2xl p-6 text-[#666666] w-full max-w-md mx-auto border border-white/40"
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{title}</h2>
          <button onClick={onClose} className="opacity-50 hover:opacity-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="mb-6 opacity-90 text-sm">
          {children}
        </div>
        <div className="flex justify-end gap-4">
          {onConfirm ? (
            <>
              <Button onClick={onClose} variant="secondary">
                {cancelText}
              </Button>
              <Button onClick={onConfirm} variant="primary">
                {confirmText}
              </Button>
            </>
          ) : (
            <Button onClick={onClose} variant="primary">
              Close
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};