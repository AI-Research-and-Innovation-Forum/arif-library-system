import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import AdminDashboard from './AdminDashboard';
import BookManagement from './BookManagement';
import RequestManagement from './RequestManagement';
import UserManagement from './UserManagement';
import QuestionPaperManagement from './QuestionPaperManagement';
import QuestionPaperRequestManagement from './QuestionPaperRequestManagement';
import NotFound from '../components/NotFound';

function Admin() {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="books" element={<BookManagement />} />
        <Route path="question-papers" element={<QuestionPaperManagement />} />
        <Route path="question-paper-requests" element={<QuestionPaperRequestManagement />} />
        <Route path="requests" element={<RequestManagement />} />
        <Route path="users" element={<UserManagement />} />
        {/* Catch-all route for invalid admin routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AdminLayout>
  );
}

export default Admin; 