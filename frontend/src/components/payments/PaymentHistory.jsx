  // // pages/payments/PaymentHistoryPage.jsx
  // import React, { useState, useEffect } from 'react';
  // import { Plus, CreditCard, Filter, Download } from 'lucide-react';
  // import { paymentApi } from '../../api/paymentApi'; // your axios instance wrapper
  // import PaymentPage from '../../pages/payments/PaymentsPage';

  // const PaymentHistoryPage = () => {
  //   const [showCreateModal, setShowCreateModal] = useState(false);
  //   const [selectedInvoice, setSelectedInvoice] = useState(null);
  //   const [formData, setFormData] = useState({
  //     student: '',
  //     course: '',
  //     amount: '',
  //     description: ''
  //   });
  //   const [paymentHistory, setPaymentHistory] = useState([]);

  //   // Fetch payments
  //   const fetchPaymentHistory = async () => {
  //     try {
  //       const res = await paymentApi.getPaymentHistory()
  //       setPaymentHistory(res.data);
  //     } catch (err) {
  //       console.error('Failed to fetch payments:', err);
  //     }
  //   };

  //   useEffect(() => {
  //     fetchPaymentHistory();
  //   }, []);

  //   const handleInputChange = (field, value) => {
  //     setFormData(prev => ({ ...prev, [field]: value }));
  //   };

  //   const handleSubmit = (e) => {
  //     e.preventDefault();

  //     // Create a "fake invoice" object for Razorpay modal
  //     setSelectedInvoice({
  //       invoiceNumber: `INV-${Math.floor(Math.random() * 10000)}`,
  //       studentName: formData.student,
  //       studentEmail: `${formData.student.replace(/\s+/g, '').toLowerCase()}@example.com`,
  //       studentPhone: '9999999999',
  //       subtotal: parseFloat(formData.amount),
  //       taxAmount: 0,
  //       discountAmount: 0,
  //       totalAmount: parseFloat(formData.amount),
  //       description: formData.description,
  //       course: formData.course
  //     });

  //     setShowCreateModal(false);
  //   };

  //   return (
  //     <div className="min-h-screen bg-gray-50">
  //       {/* Header */}
  //       <div className="bg-white shadow-sm border-b">
  //         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  //           <div className="flex justify-between items-center py-6">
  //             <div>
  //               <h1 className="text-2xl font-bold text-gray-900">Payment History</h1>
  //               <p className="text-gray-600 mt-1">Manage all student payments and transactions</p>
  //             </div>
  //             <div className="flex gap-3">
  //               <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
  //                 <Filter className="w-4 h-4 mr-2" /> Filter
  //               </button>
  //               <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
  //                 <Download className="w-4 h-4 mr-2" /> Export
  //               </button>
  //               <button
  //                 onClick={() => setShowCreateModal(true)}
  //                 className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
  //               >
  //                 <Plus className="w-4 h-4 mr-2" /> Create Payment
  //               </button>
  //             </div>
  //           </div>
  //         </div>
  //       </div>

  //       {/* Quick Actions */}
  //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
  //         <div className="bg-white rounded-lg shadow-sm p-6 border">
  //           <div className="flex items-center">
  //             <div className="p-3 bg-blue-100 rounded-lg">
  //               <CreditCard className="w-6 h-6 text-blue-600" />
  //             </div>
  //             <div className="ml-4">
  //               <h3 className="text-lg font-semibold text-gray-900">Quick Payment</h3>
  //               <p className="text-gray-600 text-sm">Process student fee payments</p>
  //             </div>
  //           </div>
  //           <button
  //             onClick={() => setShowCreateModal(true)}
  //             className="mt-4 w-full bg-blue-50 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
  //           >
  //             Start Payment →
  //           </button>
  //         </div>

  //         <div className="bg-white rounded-lg shadow-sm p-6 border">
  //           <div className="flex items-center">
  //             <div className="p-3 bg-green-100 rounded-lg">
  //               <div className="w-6 h-6 bg-green-600 rounded text-white flex items-center justify-center text-xs font-bold">₹</div>
  //             </div>
  //             <div className="ml-4">
  //               <h3 className="text-lg font-semibold text-gray-900">Bulk Payments</h3>
  //               <p className="text-gray-600 text-sm">Process multiple payments</p>
  //             </div>
  //           </div>
  //           <button className="mt-4 w-full bg-green-50 text-green-600 py-2 px-4 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium">
  //             Upload CSV →
  //           </button>
  //         </div>

  //         <div className="bg-white rounded-lg shadow-sm p-6 border">
  //           <div className="flex items-center">
  //             <div className="p-3 bg-purple-100 rounded-lg">
  //               <div className="w-6 h-6 bg-purple-600 rounded text-white flex items-center justify-center text-xs font-bold">📊</div>
  //             </div>
  //             <div className="ml-4">
  //               <h3 className="text-lg font-semibold text-gray-900">Payment Stats</h3>
  //               <p className="text-gray-600 text-sm">View payment analytics</p>
  //             </div>
  //           </div>
  //           <button className="mt-4 w-full bg-purple-50 text-purple-600 py-2 px-4 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium">
  //             View Reports →
  //           </button>
  //         </div>
  //       </div>

  //       {/* Payment History Table */}
  //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
  //         <div className="bg-white rounded-lg shadow-sm border">
  //           <div className="px-6 py-4 border-b border-gray-200">
  //             <h2 className="text-lg font-semibold text-gray-900">Recent Payments</h2>
  //           </div>
  //           <div className="overflow-x-auto">
  //             <table className="w-full">
  //               <thead className="bg-gray-50">
  //                 <tr>
  //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
  //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
  //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
  //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
  //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
  //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
  //                 </tr>
  //               </thead>
  //               <tbody>
  //                 {paymentHistory.length > 0 ? (
  //                   paymentHistory.map((p) => (
  //                     <tr key={p._id}>
  //                       <td className="px-6 py-3">{p.invoiceNumber}</td>
  //                       <td className="px-6 py-3">₹{p.totalAmount}</td>
  //                       <td className="px-6 py-3">{p.status}</td>
  //                       <td className="px-6 py-3">{p.method}</td>
  //                       <td className="px-6 py-3">{new Date(p.date).toLocaleDateString()}</td>
  //                       <td className="px-6 py-3">{p.transactionId || '-'}</td>
  //                     </tr>
  //                   ))
  //                 ) : (
  //                   <tr>
  //                     <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
  //                       No payment history found
  //                     </td>
  //                   </tr>
  //                 )}
  //               </tbody>
  //             </table>
  //           </div>
  //         </div>
  //       </div>

  //       {/* Create Payment Form Modal */}
  //       {showCreateModal && (
  //         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
  //           <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto p-6">
  //             <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Payment</h3>
  //             <div className="space-y-4">
  //               <div>
  //                 <label className="block text-sm font-medium text-gray-700">Student</label>
  //                 <input
  //                   type="text"
  //                   value={formData.student}
  //                   onChange={(e) => handleInputChange('student', e.target.value)}
  //                   placeholder="John Doe"
  //                   className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
  //                 />
  //               </div>
  //               <div>
  //                 <label className="block text-sm font-medium text-gray-700">Course (Optional)</label>
  //                 <input
  //                   type="text"
  //                   value={formData.course}
  //                   onChange={(e) => handleInputChange('course', e.target.value)}
  //                   placeholder="React Development"
  //                   className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
  //                 />
  //               </div>
  //               <div>
  //                 <label className="block text-sm font-medium text-gray-700">Amount</label>
  //                 <input
  //                   type="number"
  //                   value={formData.amount}
  //                   onChange={(e) => handleInputChange('amount', e.target.value)}
  //                   placeholder="0.00"
  //                   className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
  //                 />
  //               </div>
  //               <div>
  //                 <label className="block text-sm font-medium text-gray-700">Description</label>
  //                 <input
  //                   type="text"
  //                   value={formData.description}
  //                   onChange={(e) => handleInputChange('description', e.target.value)}
  //                   placeholder="Course fee, Admission fee"
  //                   className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
  //                 />
  //               </div>

  //               <div className="flex gap-3 pt-4">
  //                 <button
  //                   onClick={handleSubmit}
  //                   disabled={!formData.student || !formData.amount || !formData.description}
  //                   className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
  //                 >
  //                   Proceed to Payment
  //                 </button>
  //                 <button
  //                   onClick={() => setShowCreateModal(false)}
  //                   className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
  //                 >
  //                   Cancel
  //                 </button>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       )}

  //       {/* Razorpay Payment Modal */}
  //       {selectedInvoice && (
  //         <PaymentPage
  //           invoice={selectedInvoice}
  //           onSuccess={() => {
  //             alert('Payment Successful!');
  //             setSelectedInvoice(null);
  //             fetchPaymentHistory();
  //           }}
  //           onCancel={() => setSelectedInvoice(null)}
  //         />
  //       )}
  //     </div>
  //   );
  // };

  // export default PaymentHistoryPage;


  // pages/payments/PaymentHistoryPage.jsx
import React, { useState, useEffect } from 'react';
import { Plus, CreditCard, Filter, Download, CheckCircle, AlertCircle } from 'lucide-react';
import { paymentApi } from '../../api/paymentApi'; // your axios instance wrapper
import PaymentPage from '../../pages/payments/PaymentsPage';

const PaymentHistoryPage = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    student: '',
    course: '',
    amount: '',
    description: ''
  });
  const [paymentHistory, setPaymentHistory] = useState([]);

  // Fetch payments
  const fetchPaymentHistory = async () => {
    try {
      setIsLoading(true);
      const res = await paymentApi.getPaymentHistory()
      setPaymentHistory(res.data);
    } catch (err) {
      console.error('Failed to fetch payments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create a "fake invoice" object for Razorpay modal
    setSelectedInvoice({
      _id: `temp-${Date.now()}`, // Add temporary ID
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
    // Clear selected invoice
    setSelectedInvoice(null);
    
    // Clear form
    setFormData({
      student: '',
      course: '',
      amount: '',
      description: ''
    });
    
    // Show success message
    setShowSuccessAlert(true);
    setTimeout(() => setShowSuccessAlert(false), 5000);
    
    // Refresh payment history
    fetchPaymentHistory();
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

      {/* Quick Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            {isLoading && (
              <div className="flex items-center text-sm text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent mr-2"></div>
                Loading...
              </div>
            )}
          </div>
          
          {/* Mobile-friendly table */}
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
                {paymentHistory.length > 0 ? (
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
                ) : (
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

      {/* Razorpay Payment Modal */}
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
