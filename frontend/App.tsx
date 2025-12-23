
import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import LoginPage from './components/LoginPage';

const App: React.FC = () => {
  // Initialize from localStorage to persist login state across sessions
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('playpal:isLoggedIn');
      return stored === 'true';
    } catch {
      return false;
    }
  });
  const [userEmail, setUserEmail] = useState<string | null>(() => {
    try {
      return localStorage.getItem('playpal:userEmail');
    } catch {
      return null;
    }
  });
  const [showLoginPage, setShowLoginPage] = useState(false);

  const handleLoginClick = useCallback(() => {
    setShowLoginPage(true);
  }, []);

  const handleLoginSuccess = useCallback((email: string) => {
    setIsLoggedIn(true);
    setShowLoginPage(false);
    setUserEmail(email);
    try {
      localStorage.setItem('playpal:isLoggedIn', 'true');
      localStorage.setItem('playpal:userEmail', email);
    } catch {
      // ignore storage errors
    }
  }, []);

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
    setUserEmail(null);
    try {
      localStorage.setItem('playpal:isLoggedIn', 'false');
      localStorage.removeItem('playpal:userEmail');
    } catch {
      // ignore storage errors
    }
  }, []);

  // Keep state in sync if another tab changes it
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'playpal:isLoggedIn' && e.storageArea === localStorage) {
        setIsLoggedIn(e.newValue === 'true');
      }
      if (e.key === 'playpal:userEmail' && e.storageArea === localStorage) {
        setUserEmail(e.newValue);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  if (showLoginPage) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <Header isLoggedIn={isLoggedIn} onLogin={handleLoginClick} onLogout={handleLogout} />
      <main>
        {isLoggedIn ? <Dashboard userEmail={userEmail} /> : <LandingPage onLogin={handleLoginClick} />}
      </main>
    </div>
  );
};

export default App;


