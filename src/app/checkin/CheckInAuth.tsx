"use client";

import { useState, useEffect } from "react";
import CheckInLogin from "../components/CheckInLogin";
import CheckInClient from "./CheckInClient";
import { Player } from "./page";

interface CheckInAuthProps {
  initialPlayers: Player[];
}

export default function CheckInAuth({ initialPlayers }: CheckInAuthProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    // Check if user is already authenticated
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/checkin/auth');
      const data = await response.json();
      setIsAuthenticated(data.authenticated);
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
    }
  };

  const handleLogin = async (password: string) => {
    try {
      const response = await fetch('/api/checkin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success) {
        setIsAuthenticated(true);
        setError("");
      } else {
        setError(data.error || "Invalid password");
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError("Login failed. Please try again.");
    }
  };

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <CheckInLogin onLogin={handleLogin} error={error} />;
  }

  // Show check-in interface if authenticated
  return <CheckInClient initialPlayers={initialPlayers} onLogout={() => setIsAuthenticated(false)} />;
}
