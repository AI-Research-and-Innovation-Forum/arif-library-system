import React, { useState, useEffect } from 'react';
import { issueAPI } from '../services/api';

const UserBookRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await issueAPI.getMyRequests();
      setRequests(response.data);
    } catch (err) {
      console.error('Error fetching requests:', err);
      setError('Failed to fetch your book requests');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      requested: { text: 'Pending Approval', color: 'badge-warning' },
      approved: { text: 'Approved', color: 'badge-success' },
      rejected: { text: 'Rejected', color: 'badge-error' },
      issued: { text: 'Issued', color: 'badge-info' },
      returned: { text: 'Returned', color: 'badge-neutral' },
      overdue: { text: 'Overdue', color: 'badge-error' }
    };
    
    const config = statusConfig[status] || { text: status, color: 'badge-neutral' };
    return <div className={`badge ${config.color}`}>{config.text}</div>;
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Book Requests</h2>
        <button
          onClick={fetchRequests}
          className="btn btn-sm btn-outline"
        >
          Refresh
        </button>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold mb-2">No book requests yet</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Start by requesting a book from our collection!
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {requests.map((request) => (
            <div
              key={request._id}
              className="card bg-white dark:bg-gray-800 shadow-lg"
            >
              <div className="card-body">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start space-x-4">
                    {request.book.image ? (
                      <img
                        src={`http://localhost:8080${request.book.image}`}
                        alt={request.book.title}
                        className="w-16 h-20 object-cover rounded"
                      />
                    ) : (
                      <div className="w-16 h-20 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                        <span className="text-xs text-gray-500">No Image</span>
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{request.book.title}</h3>
                      <p className="text-sm opacity-70">by {request.book.author}</p>
                      <p className="text-xs opacity-60">{request.book.category}</p>
                      
                      <div className="mt-2 space-y-1">
                        <p className="text-xs">
                          <strong>Requested:</strong> {formatDate(request.issueDate)}
                        </p>
                        <p className="text-xs">
                          <strong>Due Date:</strong> {formatDate(request.dueDate)}
                        </p>
                        {request.physicalHandling.issued && (
                          <p className="text-xs">
                            <strong>Issued:</strong> {formatDate(request.physicalHandling.issuedAt)}
                          </p>
                        )}
                        {request.physicalHandling.returned && (
                          <p className="text-xs">
                            <strong>Returned:</strong> {formatDate(request.physicalHandling.returnedAt)}
                          </p>
                        )}
                        {request.fine > 0 && (
                          <p className="text-xs text-red-600 dark:text-red-400">
                            <strong>Fine:</strong> ₹{request.fine}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2">
                    {getStatusBadge(request.status)}
                    
                    {/* Status-specific messages */}
                    {request.status === 'requested' && (
                      <div className="text-center">
                        <p className="text-xs text-yellow-600 dark:text-yellow-400 mb-1">
                          ⏳ Waiting for approval
                        </p>
                        <p className="text-xs opacity-70">
                          Admin will review your request
                        </p>
                      </div>
                    )}
                    
                    {request.status === 'approved' && !request.physicalHandling.issued && (
                      <div className="text-center">
                        <p className="text-xs text-green-600 dark:text-green-400 mb-1">
                          ✅ Ready to collect
                        </p>
                        <p className="text-xs opacity-70">
                          Contact librarian to collect
                        </p>
                      </div>
                    )}
                    
                    {request.status === 'issued' && !request.physicalHandling.returned && (
                      <div className="text-center">
                        <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">
                          📖 Currently borrowed
                        </p>
                        <p className="text-xs opacity-70">
                          Return to librarian
                        </p>
                      </div>
                    )}
                    
                    {request.status === 'returned' && (
                      <div className="text-center">
                        <p className="text-xs text-green-600 dark:text-green-400">
                          ✅ Book returned
                        </p>
                      </div>
                    )}
                    
                    {request.rejectionReason && (
                      <div className="text-xs text-red-600 dark:text-red-400 max-w-xs">
                        <strong>Reason:</strong> {request.rejectionReason}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserBookRequests; 