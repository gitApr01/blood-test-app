import React from "react";
import { Navigate } from "react-router-dom";
import { getUser } from "../auth";
export default function ProtectedRoute({ children }){
  const u = getUser();
  if(!u) return <Navigate to="/" replace />;
  return children;
}
