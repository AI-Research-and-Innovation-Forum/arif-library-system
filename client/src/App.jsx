import React from 'react'
import Home from './home/Home'
import { Route, Routes } from 'react-router-dom'
import Books from './books/Books'
import Signup from './components/Signup'
import Admin from './admin/Admin'
import UserDashboard from './components/UserDashboard'
import UserHistory from './components/UserHistory'
import NotFound from './components/NotFound'
import QuestionPapers from './questionPapers/QuestionPapers'

function App() {
  return (
    <>
      <div className='bg-white text-black dark:bg-slate-900 dark:text-white transition-colors duration-300'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<Books />} />
          <Route path="/question-papers" element={<QuestionPapers />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/dashboard/history" element={<UserHistory />} />
          <Route path="/admin/*" element={<Admin />} />
          {/* Catch-all route for 404 errors */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
}

export default App