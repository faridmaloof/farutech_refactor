import React, { useState, useEffect, useCallback } from 'react';

export interface PushNotificationProps {
  title: string;
  message: string;
  icon?: string;
  badge?: string;
  timestamp?: Date;
  onClick?: () => void;
  onClose?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const PushNotification: React.FC<PushNotificationProps> = ({
  title,
  message,
  icon,
  badge,
  timestamp = new Date(),
  onClick,
  onClose,
  action,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const enterTimer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(enterTimer);
  }, []);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      if (onClose) onClose();
    }, 300);
  }, [onClose]);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div
      role="alert"
      className={`flex items-start p-4 mb-3 bg-white border border-gray-200 rounded-lg shadow-lg max-w-sm cursor-pointer hover:shadow-xl transition-all duration-300 transform ${
        isVisible && !isExiting ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'
      } ${isExiting ? 'opacity-0 translate-x-full' : ''}`}
      onClick={onClick}
    >
      {icon && (
        <img src={icon} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
      )}
      {!icon && (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-lg">{title.charAt(0).toUpperCase()}</span>
        </div>
      )}
      
      <div className="ml-3 flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900 truncate">{title}</h3>
          {badge !== undefined && badge > '0' && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              {parseInt(badge) > 99 ? '99+' : badge}
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-gray-600 line-clamp-2">{message}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-gray-400">{formatTime(timestamp)}</span>
          {action && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                action.onClick();
              }}
              className="text-xs font-medium text-blue-600 hover:text-blue-800 focus:outline-none"
            >
              {action.label}
            </button>
          )}
        </div>
      </div>
      
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleClose();
        }}
        className="ml-4 -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8 text-gray-400 hover:bg-gray-100 focus:ring-2 focus:ring-gray-300 transition-colors"
        aria-label="Close"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
};

export default PushNotification;
