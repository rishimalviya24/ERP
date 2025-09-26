// components/Ledger/LedgerLineForm.jsx
import React, { useState, useEffect } from 'react';
import { useLedger } from '../../hooks/useLedger';

const ACCOUNT_OPTIONS = [
  'Cash',
  'Accounts Receivable',
  'Accounts Payable',
  'Revenue',
  'Expenses',
  'Assets',
  'Liabilities',
  'Equipment',
  'Inventory',
  'Course Fees',
  'Salaries',
  'Rent',
  'Utilities',
  'Marketing',
  'Office Supplies'
];

const LedgerLineForm = ({ line, entryId, onClose }) => {
  const { createLedgerLine, updateLedgerLine, loading } = useLedger();

  const [formData, setFormData] = useState({
    ledger_entry: entryId || '',
    account: '',
    debit: 0,
    credit: 0
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (line) {
      setFormData({
        ledger_entry: line.ledger_entry || entryId || '',
        account: line.account || '',
        debit: line.debit || 0,
        credit: line.credit || 0
      });
    } else {
      setFormData({
        ledger_entry: entryId || '',
        account: '',
        debit: 0,
        credit: 0
      });
    }
  }, [line, entryId]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.account.trim()) newErrors.account = 'Account is required';
    if (formData.debit === 0 && formData.credit === 0) {
      newErrors.amount = 'Either debit or credit amount must be greater than 0';
    }
    if (formData.debit > 0 && formData.credit > 0) {
      newErrors.amount = 'A line cannot have both debit and credit amounts';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (line) {
        await updateLedgerLine(line._id, formData);
      } else {
        await createLedgerLine(formData);
      }
      onClose();
    } catch (error) {
      console.error('Form submission failed:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'debit' || name === 'credit' ? parseFloat(value) || 0 : value
    }));
    // Clear error when user starts typing
    if (errors[name] || errors.amount) {
      setErrors(prev => ({ ...prev, [name]: '', amount: '' }));
    }
  };

  const handleDebitChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setFormData(prev => ({
      ...prev,
      debit: value,
      credit: value > 0 ? 0 : prev.credit // Clear credit if debit is entered
    }));
    if (errors.amount) {
      setErrors(prev => ({ ...prev, amount: '' }));
    }
  };

  const handleCreditChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setFormData(prev => ({
      ...prev,
      credit: value,
      debit: value > 0 ? 0 : prev.debit // Clear debit if credit is entered
    }));
    if (errors.amount) {
      setErrors(prev => ({ ...prev, amount: '' }));
    }
  };

  return (
    <div className="bg-white">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          {line ? 'Edit Ledger Line' : 'Add New Ledger Line'}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="px-6 py-4 space-y-6">
        {/* Account */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Account *
          </label>
          <select
            name="account"
            value={formData.account}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.account ? 'border-red-300' : 'border-gray-300'
            }`}
            required
          >
            <option value="">Select an account</option>
            {ACCOUNT_OPTIONS.map(account => (
              <option key={account} value={account}>{account}</option>
            ))}
          </select>
          {errors.account && <p className="mt-1 text-sm text-red-600">{errors.account}</p>}
        </div>

        {/* Amount Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount *
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Debit</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.debit || ''}
                onChange={handleDebitChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Credit</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.credit || ''}
                onChange={handleCreditChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="0.00"
              />
            </div>
          </div>
          {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount}</p>}
          <p className="mt-1 text-xs text-gray-500">
            Enter amount in either debit or credit column, not both.
          </p>
        </div>
      </form>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={loading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Saving...' : (line ? 'Update Line' : 'Add Line')}
        </button>
      </div>
    </div>
  );
};

export default LedgerLineForm;