import React, { useState } from "react";
import { ForgotPassword } from "../../api/auth";
import toast from "react-hot-toast";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await ForgotPassword({ email });
      toast.success("Password reset link sent to your email");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error sending reset link");
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <button type="submit" className="bg-blue-600 text-white py-2 rounded">
          Send Reset Link
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
