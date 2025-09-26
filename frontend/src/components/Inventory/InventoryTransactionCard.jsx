// components/Inventory/InventoryTransactionCard.jsx
import React from 'react';

const InventoryTransactionCard = ({ transaction }) => {
  const getTransactionTypeConfig = (type) => {
    switch (type) {
      case 'purchase':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: (
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          ),
          label: 'Purchase',
          description: 'Stock Added'
        };
      case 'sale':
        return {
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: (
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          ),
          label: 'Sale',
          description: 'Stock Sold'
        };
      case 'adjustment':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: (
            <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          ),
          label: 'Adjustment',
          description: 'Stock Adjusted'
        };
      case 'transfer':
        return {
          color: 'bg-purple-100 text-purple-800 border-purple-200',
          icon: (
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          ),
          label: 'Transfer',
          description: 'Stock Transferred'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: (
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          ),
          label: 'Transaction',
          description: 'Stock Movement'
        };
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getQuantityDisplay = (type, quantity) => {
    const isPositive = type === 'purchase' || (type === 'adjustment' && quantity > 0);
    const isNegative = type === 'sale' || (type === 'adjustment' && quantity < 0);
    
    return {
      sign: isPositive ? '+' : isNegative ? '-' : '',
      color: isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-600',
      value: Math.abs(quantity)
    };
  };

  const typeConfig = getTransactionTypeConfig(transaction.transactionType);
  const quantityDisplay = getQuantityDisplay(transaction.transactionType, transaction.quantity);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        {/* Transaction Type & Item Info */}
        <div className="flex items-start space-x-4">
          <div className="p-2 bg-gray-50 rounded-lg">
            {typeConfig.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${typeConfig.color}`}>
                {typeConfig.label}
              </span>
              <span className="text-sm text-gray-500">
                {transaction.transactionNumber}
              </span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 truncate">
              {transaction.itemId?.itemName || 'Unknown Item'}
            </h3>
            <p className="text-sm text-gray-600">
              Code: {transaction.itemId?.itemCode || 'N/A'}
            </p>
          </div>
        </div>

        {/* Amount */}
        <div className="text-right">
          <p className="text-lg font-semibold text-gray-900">
            ₹{transaction.totalAmount?.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">
            Total Amount
          </p>
        </div>
      </div>

      {/* Transaction Details Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {/* Quantity */}
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            Quantity
          </p>
          <p className={`text-sm font-medium ${quantityDisplay.color}`}>
            {quantityDisplay.sign}{quantityDisplay.value}
          </p>
        </div>

        {/* Unit Cost */}
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            Unit Cost
          </p>
          <p className="text-sm text-gray-900">
            ₹{transaction.unitCost?.toFixed(2)}
          </p>
        </div>

        {/* Transaction Date */}
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            Date
          </p>
          <p className="text-sm text-gray-900">
            {formatDate(transaction.transactionDate)}
          </p>
        </div>

        {/* Reference */}
        {transaction.referenceNumber && (
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Reference
            </p>
            <p className="text-sm text-gray-900 font-mono">
              {transaction.referenceNumber}
            </p>
          </div>
        )}
      </div>

      {/* Supplier/Customer Info */}
      {transaction.supplierCustomer && (
        <div className="mb-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            {transaction.transactionType === 'purchase' ? 'Supplier' : 
             transaction.transactionType === 'sale' ? 'Customer' : 'Party'}
          </p>
          <p className="text-sm text-gray-900">
            {transaction.supplierCustomer}
          </p>
        </div>
      )}

      {/* Reason (for adjustments) */}
      {transaction.reason && transaction.transactionType === 'adjustment' && (
        <div className="mb-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            Reason
          </p>
          <p className="text-sm text-gray-700 bg-yellow-50 rounded-md p-3 border border-yellow-200">
            {transaction.reason}
          </p>
        </div>
      )}

      {/* Footer with Additional Info */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span>ID: {transaction._id?.slice(-8)}</span>
          {transaction.createdAt !== transaction.updatedAt && (
            <>
              <span>•</span>
              <span>Updated: {formatDate(transaction.updatedAt)}</span>
            </>
          )}
        </div>

        {/* Action Button */}
        <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors duration-200 flex items-center">
          View Details
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Stock Impact Indicator */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Stock Impact:</span>
          <span className={`font-medium ${quantityDisplay.color}`}>
            {quantityDisplay.sign}{quantityDisplay.value} units {typeConfig.description.toLowerCase()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default InventoryTransactionCard;