import { useState } from 'react';
import axios from 'axios';

export const usePayment = () => {
  const [loading, setLoading] = useState(false);       // Creating order
  const [verifying, setVerifying] = useState(false);   // Verifying payment
  const [error, setError] = useState(null);

  // Clear previous errors
  const clearOrderError = () => setError(null);

  // Create Razorpay order on backend
  const createPayment = async (invoiceId) => {
    try {
      setLoading(true);
      clearOrderError();

      const response = await axios.post('/api/payments/create-order', {
        invoiceId,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        return { payload: response.data.data };
      } else {
        throw new Error(response.data.message || 'Failed to create order');
      }
    } catch (err) {
      console.error('Create payment error:', err);
      setError(err);
      return { payload: null };
    } finally {
      setLoading(false);
    }
  };

  // Verify payment on backend
  const verify = async ({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) => {
    try {
      setVerifying(true);
      const response = await axios.post('/api/payments/verify', {
        razorpay_order_id: razorpayOrderId,
        razorpay_payment_id: razorpayPaymentId,
        razorpay_signature: razorpaySignature,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        return { payload: response.data.data };
      } else {
        throw new Error(response.data.message || 'Payment verification failed');
      }
    } catch (err) {
      console.error('Verify payment error:', err);
      setError(err);
      return { payload: null };
    } finally {
      setVerifying(false);
    }
  };

  return {
    createPayment,
    verify,
    loading,
    verifying,
    error,
    clearOrderError,
  };
};
