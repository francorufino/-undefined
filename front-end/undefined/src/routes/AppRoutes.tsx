import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Home from '../pages/Home/Home';
import Login from '../pages/Login/Login';
import Dashboard from '../pages/DashboardAdmin/DashboardAdmin';
import Navbar from '../components/Navbar';
import Users from '../pages/Users/Users';

export default function AppRoutes(){
  return (
    <BrowserRouter >
    <div className='outterContainer'>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/users" element={<Users />} />  {/* nova rota */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
    </BrowserRouter>
  )
}