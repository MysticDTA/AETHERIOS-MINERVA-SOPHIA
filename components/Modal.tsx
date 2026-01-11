
import React, { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const handleFocusTrap = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || !modalRef.current) return;
      
      const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) { // Shift+Tab
        if (document.activeElement === firstElement) {
          lastElement.focus();
          event.preventDefault();
        }
      } else { // Tab
        if (document.activeElement === lastElement) {
          firstElement.focus();
          event.preventDefault();
        }
      }
    };
    
    if (isOpen) {
        window.addEventListener('keydown', handleEsc);
        window.addEventListener('keydown', handleFocusTrap);
        closeButtonRef.current?.focus();
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
      window.removeEventListener('keydown', handleFocusTrap);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[3500] p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        ref={modalRef}
        className="bg-[#050505] border border-white/10 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.8)] w-full max-w-2xl max-h-[90vh] flex flex-col relative overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="absolute top-0 right-0 p-4">
             <button
                ref={closeButtonRef}
                onClick={onClose}
                className="text-slate-500 hover:text-white transition-colors"
            >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        <div className="p-6 flex-grow overflow-y-auto scrollbar-thin">
            {children}
        </div>
      </div>
    </div>
  );
};
