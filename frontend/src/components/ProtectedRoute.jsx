import React from 'react'
import { Navigate } from 'react-router-dom'
import { getAuthUser } from '../auth.js'
export default function ProtectedRoute({children}){ const u = getAuthUser(); if(!u) return <Navigate to="/login" replace />; return children }
