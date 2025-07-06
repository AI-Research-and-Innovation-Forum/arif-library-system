import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';

function RequestManagement() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected, returned
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllRequests();
      setRequests(response.data.data);
    } catch (err) {
      setError('Failed to fetch requests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      await adminAPI.approveRequest(requestId);
      showSuccessMessage('Request approved successfully!');
      fetchRequests();
    } catch (err) {
      showErrorMessage(err.response?.data?.message || 'Failed to approve request');
    }
  };

  const handleReject = async () => {
    if (!selectedRequest) return;
    
    try {
      await adminAPI.rejectRequest(selectedRequest._id, rejectionReason);
      setShowRejectModal(false);
      setSelectedRequest(null);
      setRejectionReason('');
      showSuccessMessage('Request rejected successfully!');
      fetchRequests();
    } catch (err) {
      showErrorMessage(err.response?.data?.message || 'Failed to reject request');
    }
  };

  const handleReturn = async (requestId) => {
    try {
      await adminAPI.returnRequest(requestId);
      showSuccessMessage('Book returned successfully!');
      fetchRequests();
    } catch (err) {
      showErrorMessage(err.response?.data?.message || 'Failed to return book');
    }
  };

  const handleDelete = async () => {
    if (!requestToDelete) return;
    
    try {
      await adminAPI.deleteRequest(requestToDelete._id);
      setShowDeleteModal(false);
      setRequestToDelete(null);
      showSuccessMessage('Request deleted successfully!');
      fetchRequests();
    } catch (err) {
      showErrorMessage(err.response?.data?.message || 'Failed to delete request');
    }
  };

  const openRejectModal = (request) => {
    setSelectedRequest(request);
    setRejectionReason('');
    setShowRejectModal(true);
  };

  const openDeleteModal = (request) => {
    setRequestToDelete(request);
    setShowDeleteModal(true);
  };

  const showSuccessMessage = (message) => {
    const successMessage = document.createElement('div');
    successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white dark:text-white px-6 py-3 rounded-lg shadow-lg z-50';
    successMessage.textContent = message;
    document.body.appendChild(successMessage);
    
    setTimeout(() => {
      document.body.removeChild(successMessage);
    }, 3000);
  };

  const showErrorMessage = (message) => {
    const errorMessage = document.createElement('div');
    errorMessage.className = 'fixed top-4 right-4 bg-red-500 text-white dark:text-white px-6 py-3 rounded-lg shadow-lg z-50';
    errorMessage.textContent = message;
    document.body.appendChild(errorMessage);
    
    setTimeout(() => {
      document.body.removeChild(errorMessage);
    }, 5000);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      requested: { color: 'badge-warning', text: 'Pending' },
      approved: { color: 'badge-success', text: 'Approved' },
      rejected: { color: 'badge-error', text: 'Rejected' },
      issued: { color: 'badge-info', text: 'Issued' },
      returned: { color: 'badge-info', text: 'Returned' },
      overdue: { color: 'badge-error', text: 'Overdue' }
    };
    
    const config = statusConfig[status] || { color: 'badge-neutral', text: status };
    return <span className={`badge ${config.color}`}>{config.text}</span>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredRequests = requests.filter(request => {
    if (filter === 'all') return true;
    return request.status === filter;
  });

  const getStats = () => {
    const stats = {
      total: requests.length,
      pending: requests.filter(r => r.status === 'requested').length,
      approved: requests.filter(r => r.status === 'approved').length,
      rejected: requests.filter(r => r.status === 'rejected').length,
      issued: requests.filter(r => r.status === 'issued').length,
      returned: requests.filter(r => r.status === 'returned').length
    };
    return stats;
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Request Management</h1>
      </div>

      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      {/* Filter */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="select select-bordered bg-white dark:bg-slate-800 text-black dark:text-white border-gray-300 dark:border-gray-600"
          >
            <option value="all">All Requests</option>
            <option value="requested">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="issued">Issued</option>
            <option value="returned">Returned</option>
          </select>
        </div>
        <div className="text-sm text-gray-500">
          Showing {filteredRequests.length} of {requests.length} requests
        </div>
      </div>

      {/* Requests Table */}
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead className="hidden md:table-header-group">
            <tr>
              <th>User</th>
              <th>Book</th>
              <th>Request Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((request) => (
              <>
                {/* Card for small screens */}
                <tr key={request._id + '-card'} className="block md:hidden mb-4">
                  <td colSpan={5} className="p-0">
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 flex gap-3">
                      <div className="w-16 h-24 rounded bg-white dark:bg-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                        {request.book.image ? (
                          <img
                            src={`http://localhost:8080${request.book.image}`}
                            alt={request.book.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xs text-gray-500">No Image</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-black dark:text-white text-base mb-1">{request.book.title}</div>
                        <div className="text-sm text-gray-700 dark:text-gray-300 mb-1">by {request.book.author}</div>
                        <div className="text-xs text-gray-500 mb-1">{request.user.name} ({request.user.email})</div>
                        <div className="text-xs text-black dark:text-white mb-1"><span className="font-semibold">Requested:</span> {formatDate(request.issueDate)}</div>
                        {request.dueDate && (
                          <div className="text-xs text-black dark:text-white mb-1"><span className="font-semibold">Due Date:</span> {formatDate(request.dueDate)}</div>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          {getStatusBadge(request.status)}
                          {request.status === 'returned' && (
                            <span className="text-xs text-green-600 flex items-center gap-1"><input type="checkbox" checked readOnly className="checkbox checkbox-xs checkbox-success" />Book returned</span>
                          )}
                        </div>
                        {request.rejectionReason && (
                          <div className="text-xs mt-1 opacity-70 text-red-500">
                            Reason: {request.rejectionReason}
                          </div>
                        )}
                        <div className="flex flex-wrap gap-2 mt-3">
                          {request.status === 'requested' && (
                            <>
                              <button
                                onClick={() => handleApprove(request._id)}
                                className="btn btn-success btn-xs"
                                disabled={request.book.copiesAvailable <= 0}
                                title={request.book.copiesAvailable <= 0 ? 'No copies available' : 'Approve request'}
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => openRejectModal(request)}
                                className="btn btn-error btn-xs"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {request.status === 'approved' && (
                            <button
                              onClick={() => handleReturn(request._id)}
                              className="btn btn-info btn-xs"
                            >
                              Mark Returned
                            </button>
                          )}
                          <button
                            onClick={() => openDeleteModal(request)}
                            className="btn btn-outline btn-error btn-xs"
                            title="Delete request"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
                {/* Table row for medium and up */}
                <tr key={request._id} className="hidden md:table-row bg-white dark:bg-slate-800">
                  <td>
                    <div>
                      <div className="font-semibold">{request.user.name}</div>
                      <div className="text-sm opacity-70">{request.user.email}</div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-16 rounded bg-white dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                        {request.book.image ? (
                          <img
                            src={`http://localhost:8080${request.book.image}`}
                            alt={request.book.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xs text-gray-500">No Image</span>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-black dark:text-white">{request.book.title}</div>
                        <div className="text-sm text-black dark:text-white">by {request.book.author}</div>
                        <div className="text-xs text-black dark:text-white">Copies: {request.book.copiesAvailable}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="text-sm">
                      <div>{formatDate(request.issueDate)}</div>
                      {request.approvedAt && (
                        <div className="text-xs opacity-70">Approved: {formatDate(request.approvedAt)}</div>
                      )}
                      {request.rejectedAt && (
                        <div className="text-xs opacity-70">Rejected: {formatDate(request.rejectedAt)}</div>
                      )}
                      {request.returnDate && (
                        <div className="text-xs opacity-70">Returned: {formatDate(request.returnDate)}</div>
                      )}
                    </div>
                  </td>
                  <td>
                    {getStatusBadge(request.status)}
                    {request.rejectionReason && (
                      <div className="text-xs mt-1 opacity-70">
                        Reason: {request.rejectionReason}
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-2">
                      {request.status === 'requested' && (
                        <>
                          <button
                            onClick={() => handleApprove(request._id)}
                            className="btn btn-success btn-xs"
                            disabled={request.book.copiesAvailable <= 0}
                            title={request.book.copiesAvailable <= 0 ? 'No copies available' : 'Approve request'}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => openRejectModal(request)}
                            className="btn btn-error btn-xs"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {request.status === 'approved' && (
                        <button
                          onClick={() => handleReturn(request._id)}
                          className="btn btn-info btn-xs"
                        >
                          Mark Returned
                        </button>
                      )}
                      <button
                        onClick={() => openDeleteModal(request)}
                        className="btn btn-outline btn-error btn-xs"
                        title="Delete request"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              </>
            ))}
          </tbody>
        </table>
      </div>

      {filteredRequests.length === 0 && !loading && (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold mb-2">No requests found</h3>
          <p className="text-gray-600 dark:text-gray-300">
            {filter === 'all' ? 'No book requests have been made yet.' : `No ${filter} requests found.`}
          </p>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedRequest && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Reject Request</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-20 rounded bg-white dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                  {selectedRequest.book.image ? (
                    <img
                      src={`http://localhost:8080${selectedRequest.book.image}`}
                      alt={selectedRequest.book.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-gray-500">No Image</span>
                  )}
                </div>
                <div>
                  <h4 className="font-semibold">{selectedRequest.book.title}</h4>
                  <p className="text-sm opacity-70">by {selectedRequest.book.author}</p>
                  <p className="text-xs opacity-60">Requested by: {selectedRequest.user.name}</p>
                </div>
              </div>
              
              <div>
                <label className="label">
                  <span className="label-text">Rejection Reason (Optional)</span>
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="textarea textarea-bordered w-full"
                  placeholder="Enter reason for rejection..."
                  rows="3"
                />
              </div>
            </div>
            
            <div className="modal-action">
              <button 
                className="btn btn-ghost" 
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedRequest(null);
                  setRejectionReason('');
                }}
              >
                Cancel
              </button>
              <button 
                className="btn btn-error" 
                onClick={handleReject}
              >
                Reject Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && requestToDelete && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Delete Request</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-20 rounded bg-white dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                  {requestToDelete.book.image ? (
                    <img
                      src={`http://localhost:8080${requestToDelete.book.image}`}
                      alt={requestToDelete.book.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-gray-500">No Image</span>
                  )}
                </div>
                <div>
                  <h4 className="font-semibold">{requestToDelete.book.title}</h4>
                  <p className="text-sm opacity-70">by {requestToDelete.book.author}</p>
                  <p className="text-xs opacity-60">Requested by: {requestToDelete.user.name}</p>
                  <p className="text-xs opacity-60">Status: {requestToDelete.status}</p>
                </div>
              </div>
              
              <div className="bg-red-50 dark:bg-red-900 p-3 rounded-lg">
                <p className="text-sm font-semibold text-red-800 dark:text-red-200">
                  ⚠️ Warning: This action cannot be undone!
                </p>
                <ul className="text-xs mt-1 space-y-1 text-red-700 dark:text-red-300">
                  <li>• The request will be permanently deleted</li>
                  <li>• If the request was approved and not returned, the book copy will be restored</li>
                  <li>• All associated data will be lost</li>
                </ul>
              </div>
              
              <p className="text-sm">
                Are you sure you want to delete this request for <strong>"{requestToDelete.book.title}"</strong>?
              </p>
            </div>
            
            <div className="modal-action">
              <button 
                className="btn btn-ghost" 
                onClick={() => {
                  setShowDeleteModal(false);
                  setRequestToDelete(null);
                }}
              >
                Cancel
              </button>
              <button 
                className="btn btn-error" 
                onClick={handleDelete}
              >
                Delete Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RequestManagement; 