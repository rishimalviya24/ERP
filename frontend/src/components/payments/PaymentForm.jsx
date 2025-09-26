import React, { useState } from 'react';
import { usePayment } from '../../hooks/usePayment';

const PaymentForm = ({ onClose }) => {
  const { createPayment, loading, error } = usePayment();
  const [formData, setFormData] = useState({
    invoiceId: '',
    amount: 0,
    method: 'cash',
    transactionId: '',
    notes: '',
  });
  
  // Mock invoices for demo
  const [invoices] = useState([
    { _id: '507f1f77bcf86cd799439011', invoiceNumber: 'INV-001', amount: 5000, status: 'pending' },
    { _id: '507f1f77bcf86cd799439012', invoiceNumber: 'INV-002', amount: 3500, status: 'partial' },
    { _id: '507f1f77bcf86cd799439013', invoiceNumber: 'INV-003', amount: 7500, status: 'pending' },
  ]);

  const selectedInvoice = invoices.find(inv => inv._id === formData.invoiceId);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));

    // Auto-fill amount when invoice is selected
    if (name === 'invoiceId' && value) {
      const invoice = invoices.find(inv => inv._id === value);
      if (invoice) {
        setFormData(prev => ({
          ...prev,
          amount: invoice.amount
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPayment(formData);
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
      // Error is handled by the hook
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Record Payment</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Invoice Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Invoice *
              </label>
              <select
                name="invoiceId"
                value={formData.invoiceId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Choose an invoice...</option>
                {invoices.map(invoice => (
                  <option key={invoice._id} value={invoice._id}>
                    {invoice.invoiceNumber} - ₹{invoice.amount} ({invoice.status})
                  </option>
                ))}
              </select>
            </div>

            {/* Payment Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Amount *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">₹</span>
                </div>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  min="0.01"
                  step="0.01"
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Method *
              </label>
              <select
                name="method"
                value={formData.method}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="upi">UPI</option>
                <option value="stripe">Stripe</option>
                <option value="razorpay">Razorpay</option>
              </select>
            </div>

            {/* Transaction ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transaction ID
              </label>
              <input
                type="text"
                name="transactionId"
                value={formData.transactionId}
                onChange={handleChange}
                placeholder="Enter transaction/reference ID"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.invoiceId || formData.amount <= 0}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Recording...' : 'Record Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;