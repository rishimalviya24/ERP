// components/Invoices/InvoiceForm.jsx
import React, { useState, useEffect } from 'react';
import { useInvoice } from '../../hooks/useInvoice';
import { useSelector } from 'react-redux';

const InvoiceForm = ({ invoice, onClose }) => {
  const { createInvoice, updateInvoice, loading } = useInvoice();
  const { user } = useSelector(state => state.auth);
  const { students } = useSelector(state => state.student);
  const { courses } = useSelector(state => state.course);

  const [formData, setFormData] = useState({
    studentId: '',
    courseId: '',
    amount: '',
    status: 'unpaid',
    dueDate: '',
    notes: '',
    items: [{ description: '', quantity: 1, unitPrice: 0 }]
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (invoice) {
      setFormData({
        studentId: invoice.studentId?._id || '',
        courseId: invoice.courseId?._id || '',
        amount: invoice.amount || '',
        status: invoice.status || 'unpaid',
        dueDate: invoice.dueDate ? new Date(invoice.dueDate).toISOString().split('T')[0] : '',
        notes: invoice.notes || '',
        items: invoice.items || [{ description: '', quantity: 1, unitPrice: 0 }]
      });
    }
  }, [invoice]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.studentId) newErrors.studentId = 'Student is required';
    if (!formData.courseId) newErrors.courseId = 'Course is required';
    if (!formData.amount || formData.amount <= 0) newErrors.amount = 'Amount must be greater than 0';
    if (!formData.dueDate) newErrors.dueDate = 'Due date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (invoice) {
        await updateInvoice(invoice._id, formData);
      } else {
        await createInvoice(formData);
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

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, unitPrice: 0 }]
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };

  const calculateTotal = () => {
    return formData.items.reduce((total, item) => {
      return total + (item.quantity * item.unitPrice);
    }, 0);
  };

  useEffect(() => {
    const total = calculateTotal();
    setFormData(prev => ({ ...prev, amount: total }));
  }, [formData.items]);

  return (
    <div className="bg-white">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          {invoice ? 'Edit Invoice' : 'Create New Invoice'}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="px-6 py-4 space-y-6 max-h-96 overflow-y-auto">
        {/* Student Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Student *
          </label>
          <select
            name="studentId"
            value={formData.studentId}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.studentId ? 'border-red-300' : 'border-gray-300'
            }`}
            required
          >
            <option value="">Select a student</option>
            {students?.map(student => (
              <option key={student._id} value={student._id}>
                {student.firstName} {student.lastName} - {student.email}
              </option>
            ))}
          </select>
          {errors.studentId && <p className="mt-1 text-sm text-red-600">{errors.studentId}</p>}
        </div>

        {/* Course Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course *
          </label>
          <select
            name="courseId"
            value={formData.courseId}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.courseId ? 'border-red-300' : 'border-gray-300'
            }`}
            required
          >
            <option value="">Select a course</option>
            {courses?.map(course => (
              <option key={course._id} value={course._id}>
                {course.title} - ₹{course.price}
              </option>
            ))}
          </select>
          {errors.courseId && <p className="mt-1 text-sm text-red-600">{errors.courseId}</p>}
        </div>

        {/* Invoice Items */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Invoice Items
            </label>
            <button
              type="button"
              onClick={addItem}
              className="text-sm text-indigo-600 hover:text-indigo-900"
            >
              + Add Item
            </button>
          </div>
          
          {formData.items.map((item, index) => (
            <div key={index} className="grid grid-cols-4 gap-2 mb-2">
              <input
                type="text"
                placeholder="Description"
                value={item.description}
                onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                className="px-2 py-1 border border-gray-300 rounded text-sm"
              />
              <input
                type="number"
                placeholder="Qty"
                min="1"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                className="px-2 py-1 border border-gray-300 rounded text-sm"
              />
              <input
                type="number"
                placeholder="Price"
                min="0"
                step="0.01"
                value={item.unitPrice}
                onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                className="px-2 py-1 border border-gray-300 rounded text-sm"
              />
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">
                  ₹{(item.quantity * item.unitPrice).toFixed(2)}
                </span>
                {formData.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          ))}
          
          <div className="text-right mt-2">
            <span className="text-sm font-medium text-gray-700">
              Total: ₹{calculateTotal().toFixed(2)}
            </span>
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="unpaid">Unpaid</option>
            <option value="partial">Partial</option>
            <option value="paid">Paid</option>
          </select>
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Due Date *
          </label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.dueDate ? 'border-red-300' : 'border-gray-300'
            }`}
            required
          />
          {errors.dueDate && <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>}
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Additional notes..."
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
          {loading ? 'Saving...' : (invoice ? 'Update Invoice' : 'Create Invoice')}
        </button>
      </div>
    </div>
  );
};

export default InvoiceForm;