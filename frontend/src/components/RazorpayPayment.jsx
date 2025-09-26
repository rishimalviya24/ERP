// src/components/RazorpayPayment.jsx
import React from "react";
import axios from "axios";

const RazorpayPayment = () => {
  const loadRazorpay = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const displayRazorpay = async () => {
    const res = await loadRazorpay("https://checkout.razorpay.com/v1/checkout.js");

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    try {
      // Create order from your backend
      const response = await axios.post("/create/orderId");
      const data = response.data;

      const options = {
        key: "rzp_test_cAa3gCF0eP8i4R", // Replace with your Razorpay key
        amount: data.amount,
        currency: data.currency,
        name: "Laxmi chit fund",
        description: "Test Transaction",
        image: "https://example.com/your_logo",
        order_id: data.id,
        handler: async function (response) {
          try {
            await axios.post("/api/payment/verify", {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });
            alert("Payment verified successfully");
          } catch (error) {
            console.error(error);
            alert("Payment verification failed");
          }
        },
        prefill: {
          name: "Gaurav Kumar",
          email: "gaurav.kumar@example.com",
          contact: "8989898989",
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on("payment.failed", function (response) {
        alert("Payment Failed");
        alert("Error Code: " + response.error.code);
        alert("Description: " + response.error.description);
        alert("Source: " + response.error.source);
        alert("Step: " + response.error.step);
        alert("Reason: " + response.error.reason);
        alert("Order ID: " + response.error.metadata.order_id);
        alert("Payment ID: " + response.error.metadata.payment_id);
      });

      rzp1.open();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Razorpay Integration</h1>
      <p>Welcome to Razorpay Integration with React</p>
      <button
        onClick={displayRazorpay}
        style={{
          background: "#3399cc",
          color: "#fff",
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        Pay with Razorpay
      </button>
    </div>
  );
};

export default RazorpayPayment;
