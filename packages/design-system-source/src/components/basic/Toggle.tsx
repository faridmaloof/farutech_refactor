import React, { useCallback } from 'react';

export interface ToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'success' | 'danger' | 'warning';
}

export const Toggle: React.FC<ToggleProps> = ({
  enabled,
  onChange,
  label,
  description,
  disabled = false,
  size = 'md',
  color = 'primary',
}) => {
  const handleToggle = useCallback(() => {
    if (!disabled) {
      onChange(!enabled);
    }
  }, [disabled, enabled, onChange]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    }
  };

  const sizeClasses = {
    sm: 'h-4 w-7',
    md: 'h-5 w-9',
    lg: 'h-6 w-11',
  };

  const knobSizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const colorClasses = {
    primary: enabled ? 'bg-blue-600' : 'bg-gray-200',
    success: enabled ? 'bg-green-600' : 'bg-gray-200',
    danger: enabled ? 'bg-red-600' : 'bg-gray-200',
    warning: enabled ? 'bg-yellow-600' : 'bg-gray-200',
  };

  return (
    <div className="flex items-center">
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={label}
        disabled={disabled}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className={`
          relative inline-flex flex-shrink-0 border-2 border-transparent rounded-full 
          cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none 
          focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          ${sizeClasses[size]}
          ${colorClasses[color]}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <span
          className={`
            pointer-events-none inline-block rounded-full bg-white shadow transform 
            ring-0 transition ease-in-out duration-200
            ${knobSizeClasses[size]}
            ${enabled ? 'translate-x-full' : 'translate-x-0'}
          `}
          style={{
            transform: enabled 
              ? `translateX(${size === 'sm' ? '1.25rem' : size === 'md' ? '1.5rem' : '1.75rem'})` 
              : 'translateX(0)',
          }}
        />
      </button>
      {(label || description) && (
        <div className="ml-3">
          {label && (
            <span className={`text-sm font-medium ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>
              {label}
            </span>
          )}
          {description && (
            <p className={`text-sm ${disabled ? 'text-gray-400' : 'text-gray-500'}`}>
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Toggle;
