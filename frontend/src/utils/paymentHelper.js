// utils/paymentHelpers.js
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
};

export const getPaymentStatusColor = (status) => {
  const colors = {
    created: 'bg-gray-100 text-gray-800',
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    refunded: 'bg-blue-100 text-blue-800',
    partially_refunded: 'bg-orange-100 text-orange-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

export const validatePaymentAmount = (amount) => {
  return amount && amount > 0 && amount <= 1000000; // Max 10 lakh
};
