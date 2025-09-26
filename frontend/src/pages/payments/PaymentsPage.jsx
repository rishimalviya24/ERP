import React, { useState, useEffect } from 'react';
import { Plus, CreditCard, Filter, Download, CheckCircle, AlertCircle, Loader, RefreshCw } from 'lucide-react';

// Mock API functions to simulate your paymentApi
const mockPaymentApi = {
  getPaymentHistory: async () => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data - replace with your actual API call
    return {
      data: [
        {
          _id: '1',
          invoiceNumber: 'INV-2024-001',
          studentName: 'John Doe',
          amount: 15000,
          totalAmount: 15000,
          status: 'completed',
          method: 'Razorpay',
          paymentMethod: 'Credit Card',
          date: new Date('2024-01-15'),
          transactionId: 'rzp_1234567890',
          course: 'React Development'
        },
        {
          _id: '2',
          invoiceNumber: 'INV-2024-002',
          studentName: 'Jane Smith',
          amount: 12000,
          totalAmount: 12000,
          status: 'pending',
          method: 'Razorpay',
          paymentMethod: 'UPI',
          date: new Date('2024-01-14'),
          transactionId: 'rzp_0987654321',
          course: 'Node.js Backend'
        }
      ]
    };
  }
};

// Payment Page Component (simplified version)
const PaymentPage = ({ invoice, onSuccess, onCancel }) => {
  const [step, setStep] = useState("create");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePayment = async () => {
    setLoading(true);
    setStep("processing");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStep("verifying");
      
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStep("success");
    } catch (err) {
      setError(err);
      setStep("error");
    } finally {
      setLoading(false);
    }
  };

  const CreateStep = () => (
    <div className="bg-white rounded-lg p-6 shadow">
      <h2 className="text-lg font-semibold mb-4">Confirm Payment</h2>
      <p>
        Invoice <span className="font-medium">#{invoice.invoiceNumber}</span> —{" "}
        <span className="font-semibold">₹{invoice.totalAmount}</span>
      </p>
      <div className="flex gap-3 mt-6">
        <button
          disabled={loading}
          onClick={handlePayment}
          className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 border rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );

  const ProcessingStep = () => (
    <div className="bg-white p-6 rounded-lg text-center">
      <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
      <p>Processing your payment...</p>
    </div>
  );

  const VerifyingStep = () => (
    <div className="bg-white p-6 rounded-lg text-center">
      <div className="w-8 h-8 mx-auto mb-4 text-2xl">🔍</div>
      <p>Verifying payment with bank...</p>
    </div>
  );

  const SuccessStep = () => (
    <div className="bg-white p-6 rounded-lg text-center">
      <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
      <p className="text-lg font-semibold text-green-800">Payment Successful!</p>
      <button
        onClick={() => onSuccess({ paymentId: 'mock_payment_' + Date.now() })}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
      >
        OK
      </button>
    </div>
  );

  const ErrorStep = () => (
    <div className="bg-white p-6 rounded-lg text-center">
      <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
      <p className="font-semibold text-red-800">Payment Failed</p>
      <p className="text-sm text-gray-600 mt-1">
        {error?.message || "Unknown error"}
      </p>
      <button
        onClick={onCancel}
        className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
      >
        Close
      </button>
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case "create": return <CreateStep />;
      case "processing": return <ProcessingStep />;
      case "verifying": return <VerifyingStep />;
      case "success": return <SuccessStep />;
      case "error": return <ErrorStep />;
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="max-w-lg w-full">{renderStep()}</div>
    </div>
  );
};

// Main Payment History Component
const PaymentHistoryPage = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  
  const [formData, setFormData] = useState({
    student: '',
    course: '',
    amount: '',
    description: ''
  });
  const [paymentHistory, setPaymentHistory] = useState([]);

  // Enhanced fetch function with error handling
  const fetchPaymentHistory = async (showLoader = true) => {
    try {
      if (showLoader) {
        setIsLoading(true);
      }
      setError(null);
      
      // Replace this with your actual API call
      // const res = await paymentApi.getPaymentHistory();
      const res = await mockPaymentApi.getPaymentHistory();
      
      setPaymentHistory(res.data);
      setRetryCount(0); // Reset retry count on success
    } catch (err) {
      console.error('Failed to fetch payments:', err);
      
      // Handle different error types
      if (err.response) {
        switch (err.response.status) {
          case 403:
            setError({
              type: 'auth',
              message: 'Access denied. Please check your authentication.',
              details: 'You may need to log in again or contact your administrator.'
            });
            break;
          case 401:
            setError({
              type: 'auth',
              message: 'Authentication required.',
              details: 'Please log in to view payment history.'
            });
            break;
          case 500:
            setError({
              type: 'server',
              message: 'Server error occurred.',
              details: 'Please try again later or contact support.'
            });
            break;
          default:
            setError({
              type: 'unknown',
              message: `Request failed with status ${err.response.status}`,
              details: err.response.data?.message || 'Please try again.'
            });
        }
      } else if (err.request) {
        setError({
          type: 'network',
          message: 'Network error occurred.',
          details: 'Please check your internet connection and try again.'
        });
      } else {
        setError({
          type: 'unknown',
          message: 'An unexpected error occurred.',
          details: err.message || 'Please try again.'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    fetchPaymentHistory();
  };

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setSelectedInvoice({
      _id: `temp-${Date.now()}`,
      invoiceNumber: `INV-${Math.floor(Math.random() * 10000)}`,
      studentName: formData.student,
      studentEmail: `${formData.student.replace(/\s+/g, '').toLowerCase()}@example.com`,
      studentPhone: '9999999999',
      subtotal: parseFloat(formData.amount),
      taxAmount: 0,
      discountAmount: 0,
      totalAmount: parseFloat(formData.amount),
      description: formData.description,
      course: formData.course
    });

    setShowCreateModal(false);
  };

  const handlePaymentSuccess = (paymentResult) => {
    setSelectedInvoice(null);
    setFormData({ student: '', course: '', amount: '', description: '' });
    setShowSuccessAlert(true);
    setTimeout(() => setShowSuccessAlert(false), 5000);
    
    // Add new payment to history optimistically
    const newPayment = {
      _id: Date.now().toString(),
      invoiceNumber: selectedInvoice?.invoiceNumber,
      studentName: formData.student,
      amount: formData.amount,
      totalAmount: formData.amount,
      status: 'completed',
      method: 'Razorpay',
      date: new Date(),
      transactionId: paymentResult.paymentId,
      course: formData.course
    };
    
    setPaymentHistory(prev => [newPayment, ...prev]);
    
    // Refresh from server
    setTimeout(() => fetchPaymentHistory(false), 2000);
  };

  const handlePaymentCancel = () => {
    setSelectedInvoice(null);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'completed': { bg: 'bg-green-100', text: 'text-green-800', label: 'Completed' },
      'pending': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      'failed': { bg: 'bg-red-100', text: 'text-red-800', label: 'Failed' },
      'processing': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Processing' }
    };
    
    const config = statusConfig[status?.toLowerCase()] || statusConfig['pending'];
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  // Error Display Component
  const ErrorDisplay = () => {
    if (!error) return null;

    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
        <div className="flex items-start">
          <AlertCircle className="w-6 h-6 text-red-600 mr-3 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-lg font-medium text-red-800 mb-2">{error.message}</h3>
            <p className="text-sm text-red-700 mb-4">{error.details}</p>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleRetry}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Retrying...' : 'Retry'}
              </button>
              
              {retryCount > 0 && (
                <span className="inline-flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm">
                  Attempt {retryCount + 1}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Alert */}
      {showSuccessAlert && (
        <div className="fixed top-4 right-4 z-50 max-w-md w-full">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-green-800">Payment Successful!</p>
                <p className="text-xs text-green-600 mt-1">Payment history has been updated</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Payment History</h1>
              <p className="text-gray-600 mt-1">Manage all student payments and transactions</p>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4 mr-2" /> Filter
              </button>
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4 mr-2" /> Export
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm"
              >
                <Plus className="w-4 h-4 mr-2" /> Create Payment
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Display */}
        <ErrorDisplay />

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Quick Payment</h3>
                <p className="text-gray-600 text-sm">Process student fee payments</p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 w-full bg-blue-50 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
            >
              Start Payment →
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <div className="w-6 h-6 bg-green-600 rounded text-white flex items-center justify-center text-xs font-bold">₹</div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Bulk Payments</h3>
                <p className="text-gray-600 text-sm">Process multiple payments</p>
              </div>
            </div>
            <button className="mt-4 w-full bg-green-50 text-green-600 py-2 px-4 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium">
              Upload CSV →
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <div className="w-6 h-6 bg-purple-600 rounded text-white flex items-center justify-center text-xs font-bold">📊</div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Payment Stats</h3>
                <p className="text-gray-600 text-sm">View payment analytics</p>
              </div>
            </div>
            <button className="mt-4 w-full bg-purple-50 text-purple-600 py-2 px-4 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium">
              View Reports →
            </button>
          </div>
        </div>

        {/* Payment History Table */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Payments</h2>
            <div className="flex items-center gap-3">
              {isLoading && (
                <div className="flex items-center text-sm text-gray-500">
                  <Loader className="animate-spin h-4 w-4 mr-2" />
                  Loading...
                </div>
              )}
              <button
                onClick={() => fetchPaymentHistory()}
                disabled={isLoading}
                className="inline-flex items-center px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {!error && paymentHistory.length > 0 ? (
                  paymentHistory.map((payment, index) => (
                    <tr key={payment._id || index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {payment.invoiceNumber || '-'}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {payment.studentName || payment.student || '-'}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        ₹{payment.totalAmount || payment.amount || 0}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(payment.status)}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.method || payment.paymentMethod || 'Razorpay'}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.date ? new Date(payment.date).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                        {payment.transactionId || payment.razorpayPaymentId || '-'}
                      </td>
                    </tr>
                  ))
                ) : !error && paymentHistory.length === 0 && !isLoading ? (
                  <tr>
                    <td colSpan="7" className="px-4 sm:px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <CreditCard className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No payment history found</h3>
                        <p className="text-gray-500 mb-4">Get started by creating your first payment</p>
                        <button
                          onClick={() => setShowCreateModal(true)}
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Create First Payment
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="7" className="px-4 sm:px-6 py-12 text-center">
                      <div className="text-gray-500">
                        Unable to load payment history. Please check the error message above.
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan="7" className="px-4 sm:px-6 py-12 text-center">
                      <Loader className="w-8 h-8 animate-spin mx-auto text-gray-400" />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Payment Form Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Create Payment</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.student}
                    onChange={(e) => handleInputChange('student', e.target.value)}
                    placeholder="John Doe"
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course (Optional)</label>
                  <input
                    type="text"
                    value={formData.course}
                    onChange={(e) => handleInputChange('course', e.target.value)}
                    placeholder="React Development"
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">₹</span>
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => handleInputChange('amount', e.target.value)}
                      placeholder="0.00"
                      min="1"
                      step="0.01"
                      className="w-full border border-gray-300 pl-8 pr-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Course fee, Admission fee, etc."
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={!formData.student || !formData.amount || !formData.description}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    Proceed to Payment
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {selectedInvoice && (
        <PaymentPage
          invoice={selectedInvoice}
          onSuccess={handlePaymentSuccess}
          onCancel={handlePaymentCancel}
        />
      )}
    </div>
  );
};

export default PaymentHistoryPage;