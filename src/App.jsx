import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header.jsx'
import BottomNav from './components/BottomNav.jsx'
import Dashboard from './pages/Dashboard.jsx'
import AllTests from './pages/AllTests.jsx'
import AddTest from './pages/AddTest.jsx'
import Reports from './pages/Reports.jsx'
import Patients from './pages/Patients.jsx'
import Users from './pages/Users.jsx'
import Login from './pages/Login.jsx'
import EditTest from './pages/EditTest.jsx'
import NotFound from './pages/NotFound.jsx'
import { getUser } from './auth.js'

function Protected({children}){
  const user = getUser()
  if(!user) return <Navigate to="/login" replace />
  return children
}

export default function App(){
  return (
    <div className="app-root">
      <Header />
      <main className="container">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/dashboard" element={<Protected><Dashboard/></Protected>} />
          <Route path="/tests" element={<Protected><AllTests/></Protected>} />
          <Route path="/add-test" element={<Protected><AddTest/></Protected>} />
          <Route path="/edit/:id" element={<Protected><EditTest/></Protected>} />
          <Route path="/reports" element={<Protected><Reports/></Protected>} />
          <Route path="/patients" element={<Protected><Patients/></Protected>} />
          <Route path="/users" element={<Protected><Users/></Protected>} />
          <Route path="*" element={<NotFound/>} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  )
}
