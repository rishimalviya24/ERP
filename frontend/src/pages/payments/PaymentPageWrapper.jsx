// src/pages/payments/PaymentPageWrapper.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PaymentPage from "./PaymentsPage"; // tumhara PaymentPage

const PaymentPageWrapper = () => {
  const { invoiceId } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await fetch(`/api/invoices/${invoiceId}`);
        const data = await response.json();
        setInvoice(data.invoice);
      } catch (error) {
        console.error("Error fetching invoice:", error);
      } finally {
        setLoading(false);
      }
    };

    if (invoiceId) {
      fetchInvoice();
    }
  }, [invoiceId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Invoice not found</p>
      </div>
    );
  }

  return (
    <PaymentPage
      invoice={invoice}
      onSuccess={(paymentData) => {
        console.log("Payment successful:", paymentData);
        window.location.href = "/invoices";
      }}
      onCancel={() => {
        window.location.href = "/invoices";
      }}
    />
  );
};

export default PaymentPageWrapper;
