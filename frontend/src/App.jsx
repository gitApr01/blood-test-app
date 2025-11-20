import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddTest from "./pages/AddTest";
import AllTests from "./pages/AllTests";
import EditTest from "./pages/EditTest";
import Patients from "./pages/Patients";
import Users from "./pages/Users";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
        <Route path="/add" element={<ProtectedRoute><AddTest/></ProtectedRoute>} />
        <Route path="/tests" element={<ProtectedRoute><AllTests/></ProtectedRoute>} />
        <Route path="/edit/:id" element={<ProtectedRoute><EditTest/></ProtectedRoute>} />
        <Route path="/patients" element={<ProtectedRoute><Patients/></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute><Users/></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><Reports/></ProtectedRoute>} />
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </BrowserRouter>
  );
}
