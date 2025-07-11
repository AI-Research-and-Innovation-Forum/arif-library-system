import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userAPI } from '../services/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://arif-library-system.onrender.com";

function UserHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [filter, setFilter] = useState('all'); // all, issued, approved, rejected, returned

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      
      // Get user data from localStorage
      const userData = localStorage.getItem('user');
      if (userData) {
        const userObj = JSON.parse(userData);
        setUser(userObj);
      }

      // Fetch user's book history
      const response = await userAPI.getMyIssuedBooks();
      // The API returns { success: true, count: number, data: array }
      setHistory(response.data.data || []);
    } catch (err) {
      console.error('Error fetching history:', err);
      setError('Failed to fetch your borrowing history. Please try again.');
    } finally {
      setLoading(false);
    }
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

  const filteredHistory = (history || []).filter(item => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  if (loading) {
    return (
        <div className="flex justify-center items-center h-64">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
    );
  }

  return (
    <>
      <div className="pt-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-black dark:text-white">My Borrowing History</h1>
          </div>

          {error && (
            <div className="alert alert-error mb-6">
              <span>{error}</span>
            </div>
          )}

          {/* Filter */}
          <div className="flex justify-between items-center mb-6 p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-800">
            <div className="flex space-x-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="select select-sm select-bordered text-black dark:text-white bg-white dark:bg-slate-700 border-gray-300 dark:border-gray-600"
              >
                <option value="all" className="text-black dark:text-white">All Requests</option>
                <option value="requested" className="text-black dark:text-white">Pending</option>
                <option value="approved" className="text-black dark:text-white">Approved</option>
                <option value="rejected" className="text-black dark:text-white">Rejected</option>
                <option value="issued" className="text-black dark:text-white">Issued</option>
                <option value="returned" className="text-black dark:text-white">Returned</option>
              </select>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing {filteredHistory.length} of {history.length} requests
            </div>
          </div>

          {/* History Cards */}
          <div className="grid gap-4">
            {filteredHistory.map((item) => (
              <div
                key={item._id}
                className="card bg-white dark:bg-slate-800 shadow-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="card-body p-4 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start space-x-4">
                      {item.book.image ? (
                        <img
                          src={item.book.image}
                          alt={item.book.title}
                          className="w-16 h-20 object-cover rounded"
                        />
                      ) : (
                        <div className="w-16 h-24 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center flex-shrink-0">
                          <span className="text-xs text-gray-500 dark:text-gray-400">No Image</span>
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-black dark:text-white">{item.book.title}</h3>
                        <p className="text-sm opacity-70 text-black dark:text-white">by {item.book.author}</p>
                        
                        <div className="mt-2 space-y-1 text-xs text-black dark:text-white">
                          <p>
                            <strong>Requested:</strong> {formatDate(item.issueDate)}
                          </p>
                          {item.returnDate ? (
                            <p>
                              <strong>Returned:</strong> {formatDate(item.returnDate)}
                            </p>
                          ) : item.dueDate ? (
                            <p>
                              <strong>Due Date:</strong> {formatDate(item.dueDate)}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-start md:items-end space-y-2 self-start md:self-center">
                      {getStatusBadge(item.status)}
                      
                      <div className="text-center">
                        {item.status === 'returned' && (
                          <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                            Book returned
                          </p>
                        )}
                        {item.rejectionReason && (
                          <div className="text-xs text-red-600 dark:text-red-400 max-w-xs text-left md:text-right">
                            <strong>Reason:</strong> {item.rejectionReason}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredHistory.length === 0 && !loading && (
            <div className="text-center py-8 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-800">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold mb-2 text-black dark:text-white">No history found</h3>
              <p className="text-gray-600 dark:text-gray-300">
                {filter === 'all' ? 'You haven\'t made any book requests yet.' : `No ${filter} requests found.`}
              </p>
              <div className="mt-4">
                <Link to="/books" className="btn btn-primary">
                  Browse Books
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default UserHistory; 