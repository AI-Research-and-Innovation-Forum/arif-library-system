import React from 'react'
import Home from './home/Home'
import { Route, Routes } from 'react-router-dom'
import Courses from './courses/Courses'
import Signup from './components/Signup'
import Login from './components/Login'
import Admin from './admin/Admin'

function App() {
  return (
    <>
      <div className='bg-white text-black dark:bg-slate-900 dark:text-white transition-colors duration-300'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/course" element={<Courses />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/*" element={<Admin />} />
        </Routes>
      </div>
    </>
  );
}

export default App