import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import AdminDashboard from './AdminDashboard';
import BookManagement from './BookManagement';
import RequestManagement from './RequestManagement';
import UserManagement from './UserManagement';

function Admin() {
  return (
    <AdminLayout>
      <Routes>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="books" element={<BookManagement />} />
        <Route path="requests" element={<RequestManagement />} />
        <Route path="users" element={<UserManagement />} />
      </Routes>
    </AdminLayout>
  );
}

export default Admin; 