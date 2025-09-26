// components/Inventory/InventoryTransactionForm.jsx
import React, { useState, useEffect } from 'react';
import { useInventoryTransaction } from '../../hooks/useInventoryTransaction';
import { useInventoryItem } from '../../hooks/useInventoryItem';

const InventoryTransactionForm = ({ onClose }) => {
  const { createInventoryTransaction, loading } = useInventoryTransaction();
  const { inventoryItems, fetchAllInventoryItems } = useInventoryItem();
  const [formData, setFormData] = useState({
    transactionNumber: '',
    itemId: '',
    transactionType: 'purchase',
    quantity: 0,
    unitCost: 0,
    transactionDate: new Date().toISOString().split('T')[0],
    referenceNumber: '',
    supplierCustomer: '',
    reason: '',
  });

  useEffect(() => {
    if (inventoryItems.length === 0) {
      fetchAllInventoryItems();
    }
    // Generate transaction number
    const transactionNumber = `TXN-${Date.now()}`;
    setFormData(prev => ({ ...prev, transactionNumber }));
  }, []);

  const selectedItem = inventoryItems.find(item => item._id === formData.itemId);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));

    // Auto-fill unit cost when item is selected
    if (name === 'itemId' && value) {
      const item = inventoryItems.find(item => item._id === value);
      if (item) {
        setFormData(prev => ({
          ...prev,
          unitCost: item.unitCost
        }));
      }
    }
  };

  const totalAmount = formData.quantity * formData.unitCost;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createInventoryTransaction({
        ...formData,
        totalAmount
      });
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const getTransactionTypeColor = (type) => {
    switch (type) {
      case 'purchase': return 'text-green-600';
      case 'sale': return 'text-blue-600';
      case 'adjustment': return 'text-yellow-600';
      case 'transfer': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Create New Transaction
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Transaction Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transaction Number
                </label>
                <input
                  type="text"
                  name="transactionNumber"
                  value={formData.transactionNumber}
                  onChange={handleChange}
                  required
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transaction Date
                </label>
                <input
                  type="date"
                  name="transactionDate"
                  value={formData.transactionDate}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Item Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Item *
              </label>
              <select
                name="itemId"
                value={formData.itemId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Choose an item...</option>
                {inventoryItems.map(item => (
                  <option key={item._id} value={item._id}>
                    {item.itemCode} - {item.itemName} (Current Stock: {item.currentStock})
                  </option>
                ))}
              </select>
            </div>

            {/* Transaction Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transaction Type *
              </label>
              <select
                name="transactionType"
                value={formData.transactionType}
                onChange={handleChange}
                required
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${getTransactionTypeColor(formData.transactionType)}`}
              >
                <option value="purchase">Purchase (+)</option>
                <option value="sale">Sale (-)</option>
                <option value="adjustment">Adjustment (+/-)</option>
                <option value="transfer">Transfer</option>
              </select>
            </div>

            {/* Quantity and Cost */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity *
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  min="0.01"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                />
                {selectedItem && (
                  <p className="text-xs text-gray-500 mt-1">
                    Unit: {selectedItem.unitOfMeasure}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit Cost *
                </label>
                <input
                  type="number"
                  name="unitCost"
                  value={formData.unitCost}
                  onChange={handleChange}
                  required
                  min="0.01"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Amount
                </label>
                <input
                  type="text"
                  value={`₹${totalAmount.toFixed(2)}`}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 font-medium"
                />
              </div>
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reference Number
                </label>
                <input
                  type="text"
                  name="referenceNumber"
                  value={formData.referenceNumber}
                  onChange={handleChange}
                  placeholder="Invoice/PO Number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {formData.transactionType === 'purchase' ? 'Supplier' : 
                   formData.transactionType === 'sale' ? 'Customer' : 'Party'}
                </label>
                <input
                  type="text"
                  name="supplierCustomer"
                  value={formData.supplierCustomer}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Reason (for adjustments) */}
            {formData.transactionType === 'adjustment' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for Adjustment
                </label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Explain the reason for stock adjustment..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            )}

            {/* Stock Impact Preview */}
            {selectedItem && formData.quantity > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Stock Impact Preview</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Current Stock</p>
                    <p className="font-medium">{selectedItem.currentStock}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">
                      {formData.transactionType === 'purchase' ? 'After Purchase' :
                       formData.transactionType === 'sale' ? 'After Sale' :
                       formData.transactionType === 'adjustment' ? 'After Adjustment' :
                       'After Transfer'}
                    </p>
                    <p className={`font-medium ${
                      formData.transactionType === 'purchase' ? 'text-green-600' :
                      formData.transactionType === 'sale' ? 'text-blue-600' :
                      'text-yellow-600'
                    }`}>
                      {formData.transactionType === 'purchase' 
                        ? selectedItem.currentStock + formData.quantity
                        : formData.transactionType === 'sale'
                        ? selectedItem.currentStock - formData.quantity
                        : selectedItem.currentStock + formData.quantity
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Min Level</p>
                    <p className="font-medium">{selectedItem.minimumStockLevel}</p>
                  </div>
                </div>
                
                {/* Low Stock Warning */}
                {formData.transactionType === 'sale' && 
                 (selectedItem.currentStock - formData.quantity) < selectedItem.minimumStockLevel && (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <div className="flex">
                      <svg className="h-5 w-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          Warning: This transaction will bring stock below minimum level!
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.itemId}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? 'Creating...' : 'Create Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InventoryTransactionForm;