import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllUsersWithIssues();
      setUsers(response.data.data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = async (userId) => {
    try {
      const response = await adminAPI.getUserWithIssues(userId);
      setSelectedUser(response.data);
      setShowUserDetails(true);
    } catch (err) {
      console.error('Error fetching user details:', err);
      setError('Failed to fetch user details. Please try again.');
    }
  };

  const closeUserDetails = () => {
    setSelectedUser(null);
    setShowUserDetails(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold mb-6">User Management</h1>
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-black dark:text-white">User Management</h1>
        <div className="flex gap-4 items-center">
          <div className="stats shadow bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700">
            <div className="stat">
              <div className="stat-title text-black dark:text-white">Total Users</div>
              <div className="stat-value text-primary">{users.length}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card bg-white dark:bg-slate-800 shadow-xl border border-gray-200 dark:border-gray-700">
        <div className="card-body">
          <h2 className="card-title text-black dark:text-white">Active Users</h2>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-slate-700">
                  <th className="text-black dark:text-white">Name</th>
                  <th className="text-black dark:text-white">Email</th>
                  <th className="text-black dark:text-white">Role</th>
                  <th className="text-black dark:text-white">Active Books</th>
                  <th className="text-black dark:text-white">Joined</th>
                  <th className="text-black dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className={`bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 border-b border-gray-200 dark:border-gray-700 ${
                    user.currentBooks && user.currentBooks.some(book => book.status === 'overdue') 
                      ? 'border-l-4 border-l-red-500' 
                      : ''
                  }`}>
                    <td className="font-medium text-black dark:text-white">
                      <div className="flex items-center gap-2">
                        {user.name}
                        {user.currentBooks && user.currentBooks.some(book => book.status === 'overdue') && (
                          <span className="badge badge-error badge-xs">Overdue</span>
                        )}
                      </div>
                    </td>
                    <td className="text-black dark:text-white">{user.email}</td>
                    <td>
                      <span className={`badge ${user.role === 'admin' ? 'badge-primary' : 'badge-secondary'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-1">
                        <span className="badge badge-info">{user.activeIssues}</span>
                        {user.currentBooks && user.currentBooks.some(book => book.status === 'overdue') && (
                          <span className="badge badge-error badge-xs">
                            {user.currentBooks.filter(book => book.status === 'overdue').length} overdue
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="text-black dark:text-white">{formatDate(user.createdAt)}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline"
                        onClick={() => handleUserClick(user._id)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      {showUserDetails && selectedUser && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-5xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-black dark:text-white">User Details</h3>
              <button
                className="btn btn-sm btn-circle btn-ghost"
                onClick={closeUserDetails}
              >
                ✕
              </button>
            </div>

            {/* User Info */}
            <div className="card bg-white dark:bg-slate-700 mb-4 border border-gray-200 dark:border-gray-600">
              <div className="card-body">
                <h4 className="card-title text-black dark:text-white">{selectedUser.user.name}</h4>
                <p className="text-sm opacity-70 text-black dark:text-white">{selectedUser.user.email}</p>
                <div className="flex gap-2">
                  <span className={`badge ${selectedUser.user.role === 'admin' ? 'badge-primary' : 'badge-secondary'}`}>
                    {selectedUser.user.role}
                  </span>
                  <span className="badge badge-info">Member since {formatDate(selectedUser.user.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* User's Book History */}
            <div className="card bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700">
              <div className="card-body">
                <h4 className="card-title text-black dark:text-white">Book History ({selectedUser.issues.total} total)</h4>
                <div className="overflow-x-auto">
                  <table className="table w-full">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-slate-700">
                        <th className="text-black dark:text-white">Book Title</th>
                        <th className="text-black dark:text-white">Author</th>
                        <th className="text-black dark:text-white">ISBN</th>
                        <th className="text-black dark:text-white">Issued Date</th>
                        <th className="text-black dark:text-white">Returned Date</th>
                        <th className="text-black dark:text-white">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedUser.issues.data.map((issue) => (
                        <tr key={issue._id} className="bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 border-b border-gray-200 dark:border-gray-700">
                          <td className="font-medium text-black dark:text-white">{issue.book.title}</td>
                          <td className="text-black dark:text-white">{issue.book.author}</td>
                          <td className="text-black dark:text-white">{issue.book.isbn}</td>
                          <td className="text-black dark:text-white">{formatDate(issue.issueDate)}</td>
                          <td>
                            {issue.returnDate ? formatDate(issue.returnDate) : '-'}
                          </td>
                          <td>
                            <span className={`badge ${
                              issue.status === 'returned' ? 'badge-success' : 
                              issue.status === 'approved' ? 'badge-info' :
                              issue.status === 'rejected' ? 'badge-error' :
                              issue.status === 'overdue' ? 'badge-warning' :
                              issue.status === 'issued' ? 'badge-primary' :
                              'badge-secondary'
                            }`}>
                              {issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="modal-action">
              <button className="btn" onClick={closeUserDetails}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Current Active Books Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-white dark:bg-blue-900 text-black dark:text-white shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="card-body">
            <h2 className="card-title text-black dark:text-white">Total Active Books</h2>
            <p className="text-4xl font-bold text-black dark:text-white">
              {users.reduce((total, user) => total + user.activeIssues, 0)}
            </p>
          </div>
        </div>
        <div className="card bg-white dark:bg-green-900 text-black dark:text-white shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="card-body">
            <h2 className="card-title text-black dark:text-white">Users with Active Books</h2>
            <p className="text-4xl font-bold text-black dark:text-white">
              {users.filter(user => user.activeIssues > 0).length}
            </p>
          </div>
        </div>
        <div className="card bg-white dark:bg-amber-900 text-black dark:text-white shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="card-body">
            <h2 className="card-title text-black dark:text-white">Average Books per User</h2>
            <p className="text-4xl font-bold text-black dark:text-white">
              {users.length > 0 ? (users.reduce((total, user) => total + user.activeIssues, 0) / users.length).toFixed(1) : 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserManagement; 