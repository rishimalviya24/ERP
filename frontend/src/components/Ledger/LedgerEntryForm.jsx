// components/Ledger/LedgerEntryForm.jsx
import React, { useState, useEffect } from 'react';
import { useLedger } from '../../hooks/useLedger';

const LedgerEntryForm = ({ entry, onClose }) => {
  const { createLedgerEntry, updateLedgerEntry, loading } = useLedger();

  const [formData, setFormData] = useState({
    date: '',
    reference: '',
    description: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (entry) {
      setFormData({
        date: entry.date ? new Date(entry.date).toISOString().split('T')[0] : '',
        reference: entry.reference || '',
        description: entry.description || ''
      });
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        reference: '',
        description: ''
      });
    }
  }, [entry]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.reference.trim()) newErrors.reference = 'Reference is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (entry) {
        await updateLedgerEntry(entry._id, formData);
      } else {
        await createLedgerEntry(formData);
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
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="bg-white">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          {entry ? 'Edit Ledger Entry' : 'Create New Ledger Entry'}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="px-6 py-4 space-y-6">
        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date *
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.date ? 'border-red-300' : 'border-gray-300'
            }`}
            required
          />
          {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
        </div>

        {/* Reference */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reference *
          </label>
          <input
            type="text"
            name="reference"
            value={formData.reference}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.reference ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter reference number or code"
            required
          />
          {errors.reference && <p className="mt-1 text-sm text-red-600">{errors.reference}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter transaction description..."
          />
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
          {loading ? 'Saving...' : (entry ? 'Update Entry' : 'Create Entry')}
        </button>
      </div>
    </div>
  );
};

export default LedgerEntryForm;