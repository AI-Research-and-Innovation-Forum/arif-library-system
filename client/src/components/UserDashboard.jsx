import React, { useState, useEffect } from 'react';
import { bookAPI, issueAPI } from '../services/api';
import Navbar from './Navbar';
import Footer from './Footer';
import UserBookRequests from './UserBookRequests';
import UserHistory from './UserHistory';

function UserDashboard() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    myRequests: 0,
    availableBooks: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        const userData = localStorage.getItem('user');
        if (userData) {
          const userObj = JSON.parse(userData);
          setUser(userObj);
        }

        const booksResponse = await bookAPI.getAllBooks();
        const totalBooks = booksResponse.data.length;
        const availableBooks = booksResponse.data.filter(book => book.copiesAvailable > 0).length;

        const myRequestsResponse = await issueAPI.getMyRequests();
        const myRequests = myRequestsResponse.data.length;
        
        setStats({
          totalBooks,
          myRequests,
          availableBooks,
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

  if (error) {
    return (
      <>
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
      </>
    );
  }

  const statsData = [
    { title: 'Total Books Available', value: stats.totalBooks.toString(), color: 'bg-blue-50 dark:bg-blue-900' },
    { title: 'My Book Requests', value: stats.myRequests.toString(), color: 'bg-green-50 dark:bg-green-900' },
    { title: 'Books Available to Request', value: stats.availableBooks.toString(), color: 'bg-amber-50 dark:bg-amber-900' },
  ];

  return (
    <>
      <Navbar />
      <div className="pt-28 p-6">
        <h1 className="text-3xl font-bold mb-6">My Dashboard</h1>
        
        {user && (
          <div className="mb-6">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Welcome, {user.name}!</h2>
                <p className="text-sm opacity-70">{user.email}</p>
                <div className="badge badge-secondary">User</div>
              </div>
            </div>
          </div>
        )}

        <div className="tabs tabs-boxed mb-6">
          <button
            className={`tab ${activeTab === 'overview' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`tab ${activeTab === 'requests' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            My Book Requests
          </button>
          <button
            className={`tab ${activeTab === 'history' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            History
          </button>
        </div>

        {activeTab === 'overview' ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {statsData.map((stat, index) => (
                <div key={index} className={`card ${stat.color} text-black dark:text-white shadow-xl`}>
                  <div className="card-body">
                    <h2 className="card-title">{stat.title}</h2>
                    <p className="text-4xl font-bold">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h2 className="card-title">My Account</h2>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <span className="badge badge-success">Active</span>
                      </div>
                      <div className="flex justify-between">
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
      <Footer />
    </>
  );
}

export default UserDashboard; 