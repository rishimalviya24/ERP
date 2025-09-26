// src/utils/format.js

// Format number to INR currency
export const formatCurrency = (amount) => {
  if (!amount) return '₹0.00';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(amount / 100); // Razorpay amount is in paise
};

// Map status -> Tailwind color classes
export const getPaymentStatusColor = (status) => {
  switch (status) {
    case 'success':
    case 'paid':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'failed':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
