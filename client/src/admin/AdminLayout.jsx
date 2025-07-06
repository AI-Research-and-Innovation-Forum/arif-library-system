import React, { useState, useEffect } from 'react';
import { NavLink, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function AdminLayout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is admin
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setIsAdmin(user.role === 'admin');
    }
    setLoading(false);
  }, []);

  // Show loading while checking admin status
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  // Redirect non-admin users
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p className="text-lg mb-6">You don't have permission to access the admin panel.</p>
          <NavLink to="/" className="btn btn-primary">Go to Home</NavLink>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen bg-white dark:bg-slate-900">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-white text-black dark:bg-slate-800 dark:text-white p-4 pt-28 transform ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:fixed shadow-lg`}
        >
          <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">Admin Panel</h1>
          <nav>
            <ul>
              <li><NavLink to="/admin/dashboard" className="block py-2 px-4 rounded hover:bg-pink-500 hover:text-white text-black dark:text-white" onClick={() => setSidebarOpen(false)}>Dashboard</NavLink></li>
              <li><NavLink to="/admin/books" className="block py-2 px-4 rounded hover:bg-pink-500 hover:text-white text-black dark:text-white" onClick={() => setSidebarOpen(false)}>Book Management</NavLink></li>
              <li><NavLink to="/admin/question-papers" className="block py-2 px-4 rounded hover:bg-pink-500 hover:text-white text-black dark:text-white" onClick={() => setSidebarOpen(false)}>Question Papers</NavLink></li>
              <li><NavLink to="/admin/question-paper-requests" className="block py-2 px-4 rounded hover:bg-pink-500 hover:text-white text-black dark:text-white" onClick={() => setSidebarOpen(false)}>Question Paper Requests</NavLink></li>
              <li><NavLink to="/admin/requests" className="block py-2 px-4 rounded hover:bg-pink-500 hover:text-white text-black dark:text-white" onClick={() => setSidebarOpen(false)}>Request Management</NavLink></li>
              <li><NavLink to="/admin/users" className="block py-2 px-4 rounded hover:bg-pink-500 hover:text-white text-black dark:text-white" onClick={() => setSidebarOpen(false)}>User Management</NavLink></li>
            </ul>
          </nav>
        </aside>

        {/* Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 pt-28 overflow-y-auto lg:ml-64 bg-white dark:bg-slate-900">
          {/* Hamburger button */}
          <button
            className="lg:hidden p-2 mb-4 rounded-md bg-white text-black dark:bg-slate-800 dark:text-white shadow-md"
            onClick={() => setSidebarOpen(!isSidebarOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
          
          {children}
        </main>
      </div>
      <Footer />
    </>
  );
}

export default AdminLayout; 