import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Navbar from '../components/navbar';
import Footer from '../components/Footer';

function AdminLayout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-amber-50 text-black dark:bg-slate-800 dark:text-white p-4 pt-28 transform ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:fixed`}
        >
          <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
          <nav>
            <ul>
              <li><NavLink to="dashboard" className="block py-2 px-4 rounded hover:bg-pink-500 hover:text-white" onClick={() => setSidebarOpen(false)}>Dashboard</NavLink></li>
              <li><NavLink to="books" className="block py-2 px-4 rounded hover:bg-pink-500 hover:text-white" onClick={() => setSidebarOpen(false)}>Book Management</NavLink></li>
              <li><NavLink to="requests" className="block py-2 px-4 rounded hover:bg-pink-500 hover:text-white" onClick={() => setSidebarOpen(false)}>Request Management</NavLink></li>
              <li><NavLink to="users" className="block py-2 px-4 rounded hover:bg-pink-500 hover:text-white" onClick={() => setSidebarOpen(false)}>User Management</NavLink></li>
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
        <main className="flex-1 p-6 pt-28 overflow-y-auto lg:ml-64">
          {/* Hamburger button */}
          <button
            className="lg:hidden p-2 mb-4 rounded-md bg-amber-50 text-black dark:bg-slate-800 dark:text-white"
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