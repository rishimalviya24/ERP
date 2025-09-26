// components/Payment/PaymentCard.jsx
import React from 'react';

const PaymentCard = ({ payment, onRefund, canRefund }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'refunded':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getMethodIcon = (method) => {
    switch (method) {
      case 'cash':
        return (
          <div className="p-2 bg-green-100 rounded-lg">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
        );
      case 'card':
        return (
          <div className="p-2 bg-blue-100 rounded-lg">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
        );
      case 'upi':
        return (
          <div className="p-2 bg-purple-100 rounded-lg">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
        );
      case 'stripe':
        return (
          <div className="p-2 bg-indigo-100 rounded-lg">
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
            </svg>
          </div>
        );
      case 'razorpay':
        return (
          <div className="p-2 bg-blue-100 rounded-lg">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="p-2 bg-gray-100 rounded-lg">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
        );
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

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        {/* Payment Method & Amount */}
        <div className="flex items-center space-x-4">
          {getMethodIcon(payment.method)}
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-semibold text-gray-900">
                ₹{payment.amount?.toLocaleString()}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(payment.status)}`}>
                {payment.status?.charAt(0).toUpperCase() + payment.status?.slice(1)}
              </span>
            </div>
            <p className="text-sm text-gray-600 capitalize">
              {payment.method} Payment
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {canRefund && (
            <button
              onClick={() => onRefund(payment._id)}
              className="inline-flex items-center px-3 py-1 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
              Refund
            </button>
          )}
          
          <button className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Payment Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Invoice Information */}
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Invoice</p>
          <p className="text-sm text-gray-900">
            {payment.invoiceId?.invoiceNumber || 'N/A'}
          </p>
        </div>

        {/* Transaction ID */}
        {payment.transactionId && (
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Transaction ID</p>
            <p className="text-sm text-gray-900 font-mono">
              {payment.transactionId}
            </p>
          </div>
        )}

        {/* Payment Date */}
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Payment Date</p>
          <p className="text-sm text-gray-900">
            {formatDate(payment.createdAt)}
          </p>
        </div>

        {/* Updated Date (if different from created) */}
        {payment.updatedAt !== payment.createdAt && (
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Last Updated</p>
            <p className="text-sm text-gray-900">
              {formatDate(payment.updatedAt)}
            </p>
          </div>
        )}
      </div>

      {/* Notes */}
      {payment.notes && (
        <div className="mb-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Notes</p>
          <p className="text-sm text-gray-700 bg-gray-50 rounded-md p-3">
            {payment.notes}
          </p>
        </div>
      )}

      {/* Invoice Details (if populated) */}
      {payment.invoiceId && typeof payment.invoiceId === 'object' && (
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Invoice Details</p>
              <div className="flex items-center space-x-4 text-sm">
                <span className="text-gray-900">
                  {payment.invoiceId.invoiceNumber}
                </span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-600">
                  Total: ₹{payment.invoiceId.amount?.toLocaleString()}
                </span>
                <span className="text-gray-500">•</span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  payment.invoiceId.status === 'paid' 
                    ? 'bg-green-100 text-green-800' 
                    : payment.invoiceId.status === 'partial'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {payment.invoiceId.status?.charAt(0).toUpperCase() + payment.invoiceId.status?.slice(1)}
                </span>
              </div>
            </div>

            <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors duration-200">
              View Invoice
            </button>
          </div>
        </div>
      )}

      {/* Payment Timeline for Refunded Payments */}
      {payment.status === 'refunded' && (
        <div className="border-t border-gray-200 pt-4 mt-4">
          <div className="flex items-center space-x-3 text-sm">
            <div className="flex items-center text-green-600">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Completed
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className="flex items-center text-blue-600">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
              Refunded
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentCard;