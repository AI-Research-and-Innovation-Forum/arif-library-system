import React, { useState, useEffect } from 'react';
import { adminAPI, issueAPI } from '../services/api';

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalCopiesAvailable: 0,
    currentlyIssued: 0,
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
    returnedBooks: 0,
    overdueRequests: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        const userData = localStorage.getItem('user');
        if (userData) {
          const userObj = JSON.parse(userData);
          setUser(userObj);
        }

        const statsResponse = await adminAPI.getDashboardStats();
        const dashboardStats = statsResponse.data.stats;
        
        const requestStatsResponse = await issueAPI.getRequestStats();
        const requestStats = requestStatsResponse.data;
        
        setStats({
          ...dashboardStats,
          totalRequests: requestStats.totalRequests || 0,
          pendingRequests: requestStats.statusBreakdown?.find(s => s._id === 'requested')?.count || 0,
          approvedRequests: requestStats.statusBreakdown?.find(s => s._id === 'approved')?.count || 0,
          rejectedRequests: requestStats.statusBreakdown?.find(s => s._id === 'rejected')?.count || 0,
          currentlyIssued: requestStats.statusBreakdown?.find(s => s._id === 'issued')?.count || 0,
          returnedBooks: requestStats.statusBreakdown?.find(s => s._id === 'returned')?.count || 0,
          overdueRequests: requestStats.overdueRequests || 0,
        });
      } catch (err) {
        if (err.response?.status === 403) {
          setError('Access denied. Admin privileges required for full dashboard.');
        } else if (err.response?.status === 401) {
          setError('Please login to view dashboard.');
        } else {
          setError('Failed to fetch dashboard statistics. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <div className="alert alert-warning">
          <span>{error}</span>
        </div>
        {user && (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Welcome, {user.name}!</h2>
              <p>You can manage books, users, and system settings.</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  const statsData = [
    { title: 'Total Books', value: stats.totalBooks.toString(), color: 'bg-white', icon: '📚' },
    { title: 'Available Copies', value: stats.totalCopiesAvailable.toString(), color: 'bg-white', icon: '📖' },
    { title: 'Currently Issued', value: stats.currentlyIssued.toString(), color: 'bg-white', icon: '📚' },
    { title: 'Total Requests', value: stats.totalRequests.toString(), color: 'bg-white', icon: '📋' },
    { title: 'Pending Approval', value: stats.pendingRequests.toString(), color: 'bg-white', icon: '⏳' },
    { title: 'Overdue Books', value: stats.overdueRequests.toString(), color: 'bg-white', icon: '⚠️' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900">
      <h1 className="text-3xl font-bold mb-6 text-black dark:text-white">Admin Dashboard</h1>
      
      {user && (
        <div className="mb-6">
          <div className="card bg-white dark:bg-slate-800 shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="card-body">
              <h2 className="card-title text-black dark:text-white">Welcome, {user.name}!</h2>
              <p className="text-sm opacity-70 text-black dark:text-white">{user.email}</p>
              <div className="badge badge-primary text-white">Administrator</div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statsData.map((stat, index) => (
          <div key={index} className={`card bg-white dark:bg-slate-800 text-black dark:text-white shadow-xl border border-gray-200 dark:border-gray-700`}>
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="card-title text-lg text-black dark:text-white">{stat.title}</h2>
                  <p className="text-3xl font-bold text-black dark:text-white">{stat.value}</p>
                </div>
                <div className="text-4xl">{stat.icon}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-white dark:bg-slate-800 shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="card-body">
            <h2 className="card-title text-black dark:text-white">System Status</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-black dark:text-white">Database:</span>
                <span className="badge badge-success text-white">Connected</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black dark:text-white">API Status:</span>
                <span className="badge badge-success text-white">Online</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black dark:text-white">Book Management:</span>
                <span className="badge badge-success text-white">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black dark:text-white">Pending Requests:</span>
                <span className="badge badge-warning text-black dark:text-white">{stats.pendingRequests}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="alert alert-info text-black dark:text-white">
          <span>
            <strong>Library Management System:</strong> Manage books, users, and requests efficiently. Approve book requests and track library activities from this central dashboard.
          </span>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard; 