// components/EmptyState.jsx
import React from 'react';

const EmptyState = ({ 
  title, 
  description, 
  action,
  icon,
  variant = 'default',
  size = 'medium',
  className = ''
}) => {
  // Size configurations
  const sizeConfigs = {
    small: {
      container: 'py-8',
      icon: 'h-16 w-16',
      title: 'text-lg',
      description: 'text-sm',
      button: 'px-3 py-2 text-sm'
    },
    medium: {
      container: 'py-12',
      icon: 'h-24 w-24',
      title: 'text-xl',
      description: 'text-base',
      button: 'px-4 py-2 text-sm'
    },
    large: {
      container: 'py-16',
      icon: 'h-32 w-32',
      title: 'text-2xl',
      description: 'text-lg',
      button: 'px-6 py-3 text-base'
    }
  };

  // Variant configurations
  const variantConfigs = {
    default: {
      bg: 'bg-gray-50',
      iconColor: 'text-gray-400',
      titleColor: 'text-gray-900',
      descColor: 'text-gray-500'
    },
    error: {
      bg: 'bg-red-50',
      iconColor: 'text-red-400',
      titleColor: 'text-red-900',
      descColor: 'text-red-600'
    },
    search: {
      bg: 'bg-blue-50',
      iconColor: 'text-blue-400',
      titleColor: 'text-blue-900',
      descColor: 'text-blue-600'
    },
    success: {
      bg: 'bg-green-50',
      iconColor: 'text-green-400',
      titleColor: 'text-green-900',
      descColor: 'text-green-600'
    }
  };

  const config = sizeConfigs[size];
  const variantConfig = variantConfigs[variant];

  // Default icons based on context
  const getDefaultIcon = () => {
    switch (variant) {
      case 'error':
        return (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'search':
        return (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        );
      case 'success':
        return (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
    }
  };

  return (
    <div className={`text-center ${config.container} ${className}`}>
      {/* Background decoration */}
      <div className={`mx-auto rounded-full ${variantConfig.bg} p-8 mb-6 inline-block`}>
        <div className={`mx-auto ${config.icon} ${variantConfig.iconColor}`}>
          {icon || getDefaultIcon()}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto">
        <h3 className={`font-semibold ${variantConfig.titleColor} ${config.title} mb-2`}>
          {title}
        </h3>
        
        {description && (
          <p className={`${variantConfig.descColor} ${config.description} mb-6 leading-relaxed`}>
            {description}
          </p>
        )}

        {/* Action button */}
        {action && (
          <button
            onClick={action.onClick}
            className={`inline-flex items-center ${config.button} border border-transparent rounded-md shadow-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200`}
          >
            {action.icon && (
              <span className="mr-2">
                {action.icon}
              </span>
            )}
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
};

// Specific Empty State Components for common use cases

// No Data Found
export const NoDataFound = ({ 
  entityName = 'items',
  action,
  size = 'medium',
  className = ''
}) => {
  return (
    <EmptyState
      title={`No ${entityName} found`}
      description={`You haven't created any ${entityName} yet. Get started by creating your first ${entityName.slice(0, -1)}.`}
      action={action}
      size={size}
      className={className}
      icon={
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      }
    />
  );
};

// Search Results Empty
export const NoSearchResults = ({ 
  searchTerm,
  onClearSearch,
  size = 'medium',
  className = ''
}) => {
  return (
    <EmptyState
      title="No results found"
      description={
        searchTerm 
          ? `We couldn't find any results for "${searchTerm}". Try adjusting your search terms or filters.`
          : "Try adjusting your search terms or filters to find what you're looking for."
      }
      variant="search"
      size={size}
      className={className}
      action={onClearSearch ? {
        label: 'Clear Search',
        onClick: onClearSearch,
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )
      } : null}
      icon={
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      }
    />
  );
};

// Error State
export const ErrorState = ({ 
  title = "Something went wrong",
  description = "We're having trouble loading this content. Please try again.",
  onRetry,
  size = 'medium',
  className = ''
}) => {
  return (
    <EmptyState
      title={title}
      description={description}
      variant="error"
      size={size}
      className={className}
      action={onRetry ? {
        label: 'Try Again',
        onClick: onRetry,
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        )
      } : null}
      icon={
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      }
    />
  );
};

// Coming Soon State
export const ComingSoon = ({ 
  title = "Coming Soon",
  description = "This feature is under development and will be available soon.",
  size = 'medium',
  className = ''
}) => {
  return (
    <EmptyState
      title={title}
      description={description}
      size={size}
      className={className}
      icon={
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      }
    />
  );
};

export default EmptyState;