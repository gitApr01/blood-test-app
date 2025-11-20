import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import AllTests from './pages/AllTests'
import AddTest from './pages/AddTest'
import EditTest from './pages/EditTest'
import Patients from './pages/Patients'
import Reports from './pages/Reports'
import Users from './pages/Users'
import NotFound from './pages/NotFound'
import { getUser } from './auth'
import Header from './components/Header'
import BottomNav from './components/BottomNav'

function Protected({ children }) {
  const user = getUser()
  if(!user) return <Navigate to="/login" replace />
  return children
}

export default function App(){
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Protected><Dashboard/></Protected>} />
        <Route path="/tests" element={<Protected><AllTests/></Protected>} />
        <Route path="/tests/add" element={<Protected><AddTest/></Protected>} />
        <Route path="/tests/edit/:id" element={<Protected><EditTest/></Protected>} />
        <Route path="/patients" element={<Protected><Patients/></Protected>} />
        <Route path="/reports" element={<Protected><Reports/></Protected>} />
        <Route path="/users" element={<Protected><Users/></Protected>} />
        <Route path="*" element={<NotFound/>} />
      </Routes>
      <BottomNav />
    </div>
  )
}
