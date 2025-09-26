// components/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = ({ 
  size = 'large', 
  color = 'indigo', 
  fullScreen = true, 
  text = 'Loading...',
  className = '' 
}) => {
  // Size configurations
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12',
    xlarge: 'h-16 w-16'
  };

  // Color configurations
  const colorClasses = {
    indigo: 'text-indigo-600',
    blue: 'text-blue-600',
    green: 'text-green-600',
    red: 'text-red-600',
    yellow: 'text-yellow-600',
    purple: 'text-purple-600',
    pink: 'text-pink-600',
    gray: 'text-gray-600'
  };

  // Text size based on spinner size
  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
    xlarge: 'text-xl'
  };

  const spinnerClass = `${sizeClasses[size]} ${colorClasses[color]}`;
  const textClass = `mt-4 ${textSizeClasses[size]} text-gray-600 font-medium`;

  // Full screen loading
  if (fullScreen) {
    return (
      <div className={`min-h-screen bg-gray-50 flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="relative">
            {/* Main spinner */}
            <svg
              className={`animate-spin ${spinnerClass} mx-auto`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            
            {/* Pulse ring effect */}
            <div className={`absolute inset-0 rounded-full animate-ping opacity-20 ${colorClasses[color].replace('text-', 'bg-')}`}></div>
          </div>
          
          {text && <p className={textClass}>{text}</p>}
          
          {/* Optional dots animation */}
          <div className="flex justify-center mt-2 space-x-1">
            <div className={`w-2 h-2 rounded-full ${colorClasses[color].replace('text-', 'bg-')} animate-bounce`} style={{ animationDelay: '0ms' }}></div>
            <div className={`w-2 h-2 rounded-full ${colorClasses[color].replace('text-', 'bg-')} animate-bounce`} style={{ animationDelay: '150ms' }}></div>
            <div className={`w-2 h-2 rounded-full ${colorClasses[color].replace('text-', 'bg-')} animate-bounce`} style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  // Inline loading spinner
  return (
    <div className={`flex items-center justify-center p-4 ${className}`}>
      <div className="text-center">
        <div className="relative">
          <svg
            className={`animate-spin ${spinnerClass} mx-auto`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          
          {/* Subtle pulse ring */}
          <div className={`absolute inset-0 rounded-full animate-pulse opacity-10 ${colorClasses[color].replace('text-', 'bg-')}`}></div>
        </div>
        
        {text && <p className={textClass}>{text}</p>}
      </div>
    </div>
  );
};

// Button Loading Spinner (for inline use in buttons)
export const ButtonSpinner = ({ 
  size = 'small', 
  color = 'white',
  className = ''
}) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-5 w-5'
  };

  const colorClasses = {
    white: 'text-white',
    indigo: 'text-indigo-600',
    blue: 'text-blue-600',
    gray: 'text-gray-600'
  };

  return (
    <svg
      className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
};

// Skeleton Loading Component for cards/content
export const SkeletonLoader = ({ 
  lines = 3, 
  className = '',
  showAvatar = false 
}) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        {showAvatar && (
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
            <div className="ml-3">
              <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        )}
        
        <div className="space-y-3">
          <div className="h-6 bg-gray-300 rounded w-3/4"></div>
          {Array.from({ length: lines }).map((_, index) => (
            <div
              key={index}
              className={`h-4 bg-gray-200 rounded ${
                index === lines - 1 ? 'w-1/2' : 'w-full'
              }`}
            ></div>
          ))}
        </div>
        
        <div className="mt-6 flex justify-between items-center">
          <div className="h-8 bg-gray-200 rounded w-20"></div>
          <div className="flex space-x-2">
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;