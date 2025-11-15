import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import AllTests from "./pages/AllTests";
import AddTest from "./pages/AddTest";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/add" element={<AddTest />} />
        <Route path="/tests" element={<AllTests />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
