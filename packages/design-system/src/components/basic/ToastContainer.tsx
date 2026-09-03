import React from 'react';
import { Toast } from './Toast';
import useToastStore from '../../store/toastStore';

export interface ToastContainerProps {
  position?: 'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left' | 'bottom-center';
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ position = 'top-right' }) => {
  const { toasts, removeToast } = useToastStore();

  // Filter toasts by position if a specific position is provided
  const positionFilteredToasts = position 
    ? toasts.filter((toast) => toast.position === position)
    : toasts;

  return (
    <>
      {positionFilteredToasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          duration={toast.duration}
          position={toast.position}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </>
  );
};

export default ToastContainer;
