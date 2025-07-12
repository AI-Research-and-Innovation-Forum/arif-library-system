import React, { useState, useEffect } from 'react';
import { bookAPI, issueAPI } from '../services/api';
import Navbar from './Navbar';
import Footer from './Footer';
import UserBookRequests from './UserBookRequests';
import UserHistory from './UserHistory';

function UserDashboard() {
  const [stats, setStats] = useState({
    myRequests: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check if dark mode is enabled
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const isDark = document.documentElement.classList.contains('dark') || darkModeQuery.matches;
    setIsDarkMode(isDark);

    const handleDarkModeChange = (e) => {
      setIsDarkMode(e.matches);
    };

    darkModeQuery.addEventListener('change', handleDarkModeChange);
    return () => darkModeQuery.removeEventListener('change', handleDarkModeChange);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        const userData = localStorage.getItem('user');
        if (userData) {
          const userObj = JSON.parse(userData);
          setUser(userObj);
        }

        const myRequestsResponse = await issueAPI.getMyRequests();
        const myRequests = myRequestsResponse.data.length;
        
        setStats({
          myRequests,
        });
      } catch (err) {
        if (err.response?.status === 401) {
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

  const getTabStyle = (isActive) => ({
    color: isActive 
      ? (isDarkMode ? 'rgb(255, 255, 255) !important' : 'rgb(0, 0, 0) !important')
      : (isDarkMode ? 'rgba(255, 255, 255, 0.7) !important' : 'rgba(0, 0, 0, 0.7) !important')
  });

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex justify-center items-center h-64 pt-28">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="space-y-4 pt-28 p-6">
          <h1 className="text-3xl font-bold mb-6">My Dashboard</h1>
          <div className="alert alert-warning">
            <span>{error}</span>
          </div>
          {user && (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Welcome, {user.name}!</h2>
                <p>You can browse books and manage your account.</p>
              </div>
            </div>
          )}
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 pt-28">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6 text-black dark:text-white">My Dashboard</h1>
          
          <div className="tabs tabs-boxed mb-6 bg-amber-100 dark:bg-slate-800">
            <button
              className={`tab ${activeTab === 'overview' ? 'tab-active bg-white dark:bg-slate-700' : ''}`}
              style={getTabStyle(activeTab === 'overview')}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`tab ${activeTab === 'requests' ? 'tab-active bg-white dark:bg-slate-700' : ''}`}
              style={getTabStyle(activeTab === 'requests')}
              onClick={() => setActiveTab('requests')}
            >
              My Book Requests
            </button>
            <button
              className={`tab ${activeTab === 'history' ? 'tab-active bg-white dark:bg-slate-700' : ''}`}
              style={getTabStyle(activeTab === 'history')}
              onClick={() => setActiveTab('history')}
            >
              History
            </button>
          </div>

          {activeTab === 'overview' ? (
            <>
              {user && (
                <div className="mb-6">
                  <div className="card bg-amber-100 dark:bg-slate-800 shadow-xl border border-gray-200 dark:border-gray-700">
                    <div className="card-body">
                      <h2 className="card-title text-black dark:text-white">Welcome, {user.name}!</h2>
                      <p className="text-sm opacity-70 text-black dark:text-white">{user.email}</p>
                      <div className="badge badge-secondary">User</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="card bg-amber-100 dark:bg-slate-800 shadow-xl border border-gray-200 dark:border-gray-700">
                    <div className="card-body">
                      <h2 className="card-title text-black dark:text-white">My Account</h2>
                      <div className="space-y-2">
                        <div className="flex justify-between text-black dark:text-white">
                          <span>Status:</span>
                          <span className="badge badge-success">Active</span>
                        </div>
                        <div className="flex justify-between text-black dark:text-white">
                          <span>Book Requests:</span>
                          <span className="badge badge-info">{stats.myRequests}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <div className="alert alert-info">
                  <span>
                    <strong>How it works:</strong> Browse our collection and request books. Admins will review and approve your requests. Once approved, you can collect your books directly from the library.
                  </span>
                </div>
              </div>
            </>
          ) : activeTab === 'requests' ? (
            <UserBookRequests />
          ) : (
            <UserHistory />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default UserDashboard; 