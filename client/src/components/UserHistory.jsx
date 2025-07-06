import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userAPI } from '../services/api';
import Navbar from './Navbar';
import Footer from './Footer';

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

  const getStats = () => {
    const historyArray = history || [];
    const stats = {
      total: historyArray.length,
      pending: historyArray.filter(h => h.status === 'requested').length,
      approved: historyArray.filter(h => h.status === 'approved').length,
      rejected: historyArray.filter(h => h.status === 'rejected').length,
      issued: historyArray.filter(h => h.status === 'issued').length,
      returned: historyArray.filter(h => h.status === 'returned').length
    };
    return stats;
  };

  const stats = getStats();

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-64 pt-28">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="pt-28 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">My Borrowing History</h1>
            <Link to="/dashboard" className="btn btn-outline btn-sm">
              ← Back to Dashboard
            </Link>
          </div>

          {error && (
            <div className="alert alert-error mb-6">
              <span>{error}</span>
            </div>
          )}

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
            <div className="card bg-blue-50 dark:bg-blue-900 text-black dark:text-white shadow-xl">
              <div className="card-body text-center">
                <h3 className="card-title justify-center text-sm">Total Requests</h3>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
            <div className="card bg-yellow-50 dark:bg-yellow-900 text-black dark:text-white shadow-xl">
              <div className="card-body text-center">
                <h3 className="card-title justify-center text-sm">Pending</h3>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
            </div>
            <div className="card bg-green-50 dark:bg-green-900 text-black dark:text-white shadow-xl">
              <div className="card-body text-center">
                <h3 className="card-title justify-center text-sm">Approved</h3>
                <p className="text-2xl font-bold">{stats.approved}</p>
              </div>
            </div>
            <div className="card bg-red-50 dark:bg-red-900 text-black dark:text-white shadow-xl">
              <div className="card-body text-center">
                <h3 className="card-title justify-center text-sm">Rejected</h3>
                <p className="text-2xl font-bold">{stats.rejected}</p>
              </div>
            </div>
            <div className="card bg-cyan-50 dark:bg-cyan-900 text-black dark:text-white shadow-xl">
              <div className="card-body text-center">
                <h3 className="card-title justify-center text-sm">Issued</h3>
                <p className="text-2xl font-bold">{stats.issued}</p>
              </div>
            </div>
            <div className="card bg-purple-50 dark:bg-purple-900 text-black dark:text-white shadow-xl">
              <div className="card-body text-center">
                <h3 className="card-title justify-center text-sm">Returned</h3>
                <p className="text-2xl font-bold">{stats.returned}</p>
              </div>
            </div>
          </div>

          {/* Filter */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="select select-bordered"
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
              Showing {filteredHistory.length} of {history.length} requests
            </div>
          </div>

          {/* History Table */}
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Book</th>
                  <th>Request Date</th>
                  <th>Status</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <div className="flex items-center space-x-3">
                        {item.book.image ? (
                          <img
                            src={`http://localhost:8080${item.book.image}`}
                            alt={item.book.title}
                            className="w-12 h-16 object-cover rounded"
                          />
                        ) : (
                          <div className="w-12 h-16 bg-gray-200 rounded flex items-center justify-center">
                            <span className="text-xs text-gray-500">No Image</span>
                          </div>
                        )}
                        <div>
                          <div className="font-semibold">{item.book.title}</div>
                          <div className="text-sm opacity-70">by {item.book.author}</div>
                          <div className="text-xs opacity-60">{item.book.category || 'General'}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="text-sm">
                        <div>{formatDate(item.issueDate)}</div>
                        {item.approvedAt && (
                          <div className="text-xs opacity-70">Approved: {formatDate(item.approvedAt)}</div>
                        )}
                        {item.rejectedAt && (
                          <div className="text-xs opacity-70">Rejected: {formatDate(item.rejectedAt)}</div>
                        )}
                        {item.returnDate && (
                          <div className="text-xs opacity-70">Returned: {formatDate(item.returnDate)}</div>
                        )}
                      </div>
                    </td>
                    <td>
                      {getStatusBadge(item.status)}
                      {item.rejectionReason && (
                        <div className="text-xs mt-1 opacity-70">
                          Reason: {item.rejectionReason}
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="text-xs space-y-1">
                        {item.status === 'requested' && (
                          <div className="text-yellow-600 dark:text-yellow-400">
                            ⏳ Waiting for admin approval
                          </div>
                        )}
                        {item.status === 'approved' && (
                          <div className="text-green-600 dark:text-green-400">
                            ✅ Book approved and borrowed
                          </div>
                        )}
                        {item.status === 'rejected' && (
                          <div className="text-red-600 dark:text-red-400">
                            ❌ Request was rejected
                          </div>
                        )}
                        {item.status === 'issued' && (
                          <div className="text-blue-600 dark:text-blue-400">
                            📚 Book has been issued
                          </div>
                        )}
                        {item.status === 'returned' && (
                          <div className="text-blue-600 dark:text-blue-400">
                            📚 Book has been returned
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredHistory.length === 0 && !loading && (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold mb-2">No history found</h3>
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
      <Footer />
    </>
  );
}

export default UserHistory; 