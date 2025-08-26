'use client';

import { useState, useEffect } from 'react';
import { AdminLogin } from '../components/AdminLogin';
import { AdminDashboard } from '../components/AdminDashboard';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if admin is already authenticated
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      // Verify token with backend
      fetch('/api/admin/verify', {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.valid) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('adminToken');
        }
        setIsLoading(false);
      })
      .catch(() => {
        localStorage.removeItem('adminToken');
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleLogin = (token: string) => {
    localStorage.setItem('adminToken', token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {!isAuthenticated ? (
        <AdminLogin onLogin={handleLogin} />
      ) : (
        <AdminDashboard onLogout={handleLogout} />
      )}
    </div>
  );
}
