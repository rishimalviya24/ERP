// components/Inventory/InventoryItemCard.jsx
import React from 'react';

const InventoryItemCard = ({ item, onEdit, onDelete, canEdit, canDelete }) => {
  const getStockStatus = () => {
    if (item.currentStock === 0) {
      return {
        status: 'out-of-stock',
        color: 'bg-red-100 text-red-800 border-red-200',
        label: 'Out of Stock',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        )
      };
    } else if (item.currentStock <= item.minimumStockLevel) {
      return {
        status: 'low-stock',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        label: 'Low Stock',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        )
      };
    } else {
      return {
        status: 'in-stock',
        color: 'bg-green-100 text-green-800 border-green-200',
        label: 'In Stock',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      };
    }
  };

  const stockStatus = getStockStatus();
  const profitMargin = ((item.sellingPrice - item.unitCost) / item.unitCost * 100).toFixed(1);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border-2 hover:shadow-md transition-all duration-200 ${
      !item.isActive ? 'opacity-75 border-gray-200' : 
      stockStatus.status === 'out-of-stock' ? 'border-red-200' :
      stockStatus.status === 'low-stock' ? 'border-yellow-200' :
      'border-gray-200 hover:border-indigo-200'
    }`}>
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-lg font-medium text-gray-900 truncate">
                {item.itemName}
              </h3>
              {!item.isActive && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  Inactive
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-1">
              Code: <span className="font-mono font-medium">{item.itemCode}</span>
            </p>
            {item.category && (
              <p className="text-sm text-gray-500">
                Category: {item.category}
              </p>
            )}
          </div>

          {/* Actions Dropdown */}
          {(canEdit || canDelete) && (
            <div className="relative">
              <button className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
              {/* Dropdown menu would be implemented with state management */}
            </div>
          )}
        </div>

        {/* Stock Status */}
        <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${stockStatus.color} mb-4`}>
          {stockStatus.icon}
          <span className="ml-1">{stockStatus.label}</span>
        </div>
      </div>

      {/* Stock Information */}
      <div className="px-6 pb-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Current Stock
            </p>
            <p className={`text-xl font-semibold ${
              stockStatus.status === 'out-of-stock' ? 'text-red-600' :
              stockStatus.status === 'low-stock' ? 'text-yellow-600' :
              'text-green-600'
            }`}>
              {item.currentStock}
              {item.unitOfMeasure && (
                <span className="text-sm text-gray-500 font-normal ml-1">
                  {item.unitOfMeasure}
                </span>
              )}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Min Level
            </p>
            <p className="text-xl font-semibold text-gray-900">
              {item.minimumStockLevel}
              {item.unitOfMeasure && (
                <span className="text-sm text-gray-500 font-normal ml-1">
                  {item.unitOfMeasure}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Stock Level Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Stock Level</span>
            <span>{((item.currentStock / (item.minimumStockLevel * 2)) * 100).toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                stockStatus.status === 'out-of-stock' ? 'bg-red-500' :
                stockStatus.status === 'low-stock' ? 'bg-yellow-500' :
                'bg-green-500'
              }`}
              style={{ 
                width: `${Math.min(100, (item.currentStock / (item.minimumStockLevel * 2)) * 100)}%` 
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Pricing Information */}
      <div className="px-6 pb-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Unit Cost
            </p>
            <p className="text-sm font-semibold text-gray-900">
              ₹{item.unitCost?.toFixed(2)}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Selling Price
            </p>
            <p className="text-sm font-semibold text-gray-900">
              ₹{item.sellingPrice?.toFixed(2)}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Margin
            </p>
            <p className={`text-sm font-semibold ${
              profitMargin >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {profitMargin}%
            </p>
          </div>
        </div>
      </div>

      {/* Description */}
      {item.description && (
        <div className="px-6 pb-4">
          <p className="text-sm text-gray-600 bg-gray-50 rounded-md p-3">
            {item.description}
          </p>
        </div>
      )}

      {/* Supplier Information */}
      {item.supplierInfo?.name && (
        <div className="px-6 pb-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            Supplier
          </p>
          <div className="text-sm text-gray-900">
            <p className="font-medium">{item.supplierInfo.name}</p>
            {item.supplierInfo.contact && (
              <p className="text-gray-600">{item.supplierInfo.contact}</p>
            )}
          </div>
        </div>
      )}

      {/* Location */}
      {item.location && (
        <div className="px-6 pb-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            Location
          </p>
          <p className="text-sm text-gray-900 flex items-center">
            <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {item.location}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 rounded-b-lg border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            Added: {formatDate(item.createdAt)}
          </div>
          
          <div className="flex items-center space-x-2">
            {canEdit && (
              <button
                onClick={() => onEdit(item)}
                className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
            )}

            {canDelete && (
              <button
                onClick={() => onDelete(item._id)}
                className="inline-flex items-center px-3 py-1 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryItemCard;