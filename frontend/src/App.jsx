import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddTest from "./pages/AddTest";
import AllTests from "./pages/AllTests";
import Reports from "./pages/Reports";
import Patients from "./pages/Patients";
import Users from "./pages/Users";
import NotFound from "./pages/NotFound";

import BottomNav from "./components/BottomNav";
import Header from "./components/Header";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <div className="content">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-test" element={<AddTest />} />
          <Route path="/tests" element={<AllTests />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/users" element={<Users />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <BottomNav />
    </BrowserRouter>
  );
}
