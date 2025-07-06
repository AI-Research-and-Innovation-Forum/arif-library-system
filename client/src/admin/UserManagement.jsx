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
        <h1 className="text-3xl font-bold">User Management</h1>
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Total Users</div>
            <div className="stat-value text-primary">{users.length}</div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Active Users</h2>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Active Books</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-base-200 cursor-pointer">
                    <td className="font-medium">{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`badge ${user.role === 'admin' ? 'badge-primary' : 'badge-secondary'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-info">{user.activeIssues}</span>
                    </td>
                    <td>{formatDate(user.createdAt)}</td>
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
          <div className="modal-box w-11/12 max-w-5xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">User Details</h3>
              <button
                className="btn btn-sm btn-circle btn-ghost"
                onClick={closeUserDetails}
              >
                ✕
              </button>
            </div>

            {/* User Info */}
            <div className="card bg-base-200 mb-4">
              <div className="card-body">
                <h4 className="card-title">{selectedUser.user.name}</h4>
                <p className="text-sm opacity-70">{selectedUser.user.email}</p>
                <div className="flex gap-2">
                  <span className={`badge ${selectedUser.user.role === 'admin' ? 'badge-primary' : 'badge-secondary'}`}>
                    {selectedUser.user.role}
                  </span>
                  <span className="badge badge-info">Member since {formatDate(selectedUser.user.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* User's Book History */}
            <div className="card bg-base-100">
              <div className="card-body">
                <h4 className="card-title">Book History ({selectedUser.issues.total} total)</h4>
                <div className="overflow-x-auto">
                  <table className="table table-zebra w-full">
                    <thead>
                      <tr>
                        <th>Book Title</th>
                        <th>Author</th>
                        <th>ISBN</th>
                        <th>Issued Date</th>
                        <th>Returned Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedUser.issues.data.map((issue) => (
                        <tr key={issue._id}>
                          <td className="font-medium">{issue.book.title}</td>
                          <td>{issue.book.author}</td>
                          <td>{issue.book.isbn}</td>
                          <td>{formatDate(issue.issuedAt)}</td>
                          <td>
                            {issue.returned ? formatDate(issue.returnedAt) : '-'}
                          </td>
                          <td>
                            <span className={`badge ${issue.returned ? 'badge-success' : 'badge-warning'}`}>
                              {issue.returned ? 'Returned' : 'Active'}
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
        <div className="card bg-blue-50 dark:bg-blue-900 text-black dark:text-white shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Total Active Books</h2>
            <p className="text-4xl font-bold">
              {users.reduce((total, user) => total + user.activeIssues, 0)}
            </p>
          </div>
        </div>
        <div className="card bg-green-50 dark:bg-green-900 text-black dark:text-white shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Users with Active Books</h2>
            <p className="text-4xl font-bold">
              {users.filter(user => user.activeIssues > 0).length}
            </p>
          </div>
        </div>
        <div className="card bg-amber-50 dark:bg-amber-900 text-black dark:text-white shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Average Books per User</h2>
            <p className="text-4xl font-bold">
              {users.length > 0 ? (users.reduce((total, user) => total + user.activeIssues, 0) / users.length).toFixed(1) : 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserManagement; 