// pages/LedgerPage.jsx
import React, { useState, useEffect } from 'react';
import { useLedger } from '../../hooks/useLedger';
import { useSelector } from 'react-redux';
import LedgerEntryForm from '../../components/Ledger/LedgerEntryForm';
import LedgerLineForm from '../../components/Ledger/LedgerLineForm';
import Modal from '../../components/Enrollment/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

const LedgerPage = () => {
  const { 
    entries, 
    currentEntry, 
    lines, 
    loading, 
    error, 
    fetchAllEntries, 
    fetchEntryById,
    deleteLedgerEntry,
    deleteLedgerLine,
    clearCurrentEntryData
  } = useLedger();
  
  const { user } = useSelector(state => state.auth);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'entry' or 'line'
  const [editingItem, setEditingItem] = useState(null);
  const [selectedEntryId, setSelectedEntryId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (entries.length === 0) {
      fetchAllEntries();
    }
  }, [entries.length, fetchAllEntries]);

  // Clear selected entry when component unmounts or entries change
  useEffect(() => {
    return () => {
      if (currentEntry) {
        clearCurrentEntryData();
      }
    };
  }, []);

  const handleCreateEntry = () => {
    setEditingItem(null);
    setModalType('entry');
    setShowModal(true);
  };

  const handleEditEntry = (entry) => {
    setEditingItem(entry);
    setModalType('entry');
    setShowModal(true);
  };

  const handleDeleteEntry = async (id) => {
    if (window.confirm('Are you sure you want to delete this ledger entry and all its lines?')) {
      try {
        await deleteLedgerEntry(id);
        if (selectedEntryId === id) {
          setSelectedEntryId(null);
        }
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const handleViewEntry = async (entryId) => {
    if (selectedEntryId === entryId) {
      // If already selected, close it
      setSelectedEntryId(null);
      clearCurrentEntryData();
    } else {
      // Select and fetch entry details
      setSelectedEntryId(entryId);
      await fetchEntryById(entryId);
    }
  };

  const handleCreateLine = () => {
    if (!selectedEntryId) return;
    setEditingItem(null);
    setModalType('line');
    setShowModal(true);
  };

  const handleEditLine = (line) => {
    setEditingItem(line);
    setModalType('line');
    setShowModal(true);
  };

  const handleDeleteLine = async (id) => {
    if (window.confirm('Are you sure you want to delete this ledger line?')) {
      try {
        await deleteLedgerLine(id);
      } catch (error) {
        console.error('Delete line failed:', error);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalType('');
    setEditingItem(null);
  };

  const filteredEntries = entries.filter(entry => 
    entry.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    return `₹${amount?.toFixed(2) || '0.00'}`;
  };

  const canManageLedger = user && ['admin', 'accountant'].includes(user.role);

  if (loading && entries.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Ledger</h1>
              <p className="mt-2 text-sm text-gray-600">Manage accounting ledger entries and lines</p>
            </div>
            {canManageLedger && (
              <button
                onClick={handleCreateEntry}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Entry
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by reference or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Ledger Entries */}
        {filteredEntries.length === 0 ? (
          <EmptyState 
            title="No ledger entries found"
            description={searchTerm ? "Try adjusting your search criteria" : "Get started by creating your first ledger entry"}
            action={canManageLedger && !searchTerm ? { label: "Create Entry", onClick: handleCreateEntry } : null}
          />
        ) : (
          <div className="space-y-4">
            {filteredEntries.map((entry) => (
              <div key={entry._id} className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
                {/* Entry Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleViewEntry(entry._id)}
                        className="flex items-center space-x-2 text-left"
                      >
                        <svg 
                          className={`w-5 h-5 text-gray-400 transition-transform ${selectedEntryId === entry._id ? 'transform rotate-90' : ''}`} 
                          fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{entry.reference}</h3>
                          <p className="text-sm text-gray-500">{formatDate(entry.date)}</p>
                        </div>
                      </button>
                      {entry.description && (
                        <p className="text-sm text-gray-600">{entry.description}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Debit: {formatCurrency(entry.total_debit)}</div>
                        <div className="text-sm text-gray-500">Credit: {formatCurrency(entry.total_credit)}</div>
                      </div>
                      
                      {canManageLedger && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditEntry(entry)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Edit Entry"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          {user?.role === 'admin' && (
                            <button
                              onClick={() => handleDeleteEntry(entry._id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete Entry"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Entry Lines (Expandable) */}
                {selectedEntryId === entry._id && (
                  <div className="px-6 py-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-medium text-gray-700">Ledger Lines</h4>
                      {canManageLedger && (
                        <button
                          onClick={handleCreateLine}
                          className="text-sm text-indigo-600 hover:text-indigo-900"
                        >
                          + Add Line
                        </button>
                      )}
                    </div>
                    
                    {lines.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-4">No lines added yet</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2">Account</th>
                              <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider py-2">Debit</th>
                              <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider py-2">Credit</th>
                              {canManageLedger && (
                                <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider py-2">Actions</th>
                              )}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {lines.map((line) => (
                              <tr key={line._id}>
                                <td className="py-2 text-sm text-gray-900">{line.account}</td>
                                <td className="py-2 text-sm text-gray-900 text-right">
                                  {line.debit > 0 ? formatCurrency(line.debit) : '-'}
                                </td>
                                <td className="py-2 text-sm text-gray-900 text-right">
                                  {line.credit > 0 ? formatCurrency(line.credit) : '-'}
                                </td>
                                {canManageLedger && (
                                  <td className="py-2 text-right">
                                    <div className="flex justify-end space-x-2">
                                      <button
                                        onClick={() => handleEditLine(line)}
                                        className="text-indigo-600 hover:text-indigo-900 text-sm"
                                        title="Edit Line"
                                      >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                      </button>
                                      {user?.role === 'admin' && (
                                        <button
                                          onClick={() => handleDeleteLine(line._id)}
                                          className="text-red-600 hover:text-red-900 text-sm"
                                          title="Delete Line"
                                        >
                                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                          </svg>
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <Modal onClose={handleCloseModal}>
          {modalType === 'entry' ? (
            <LedgerEntryForm
              entry={editingItem}
              onClose={handleCloseModal}
            />
          ) : (
            <LedgerLineForm
              line={editingItem}
              entryId={selectedEntryId}
              onClose={handleCloseModal}
            />
          )}
        </Modal>
      )}
    </div>
  );
};

export default LedgerPage;