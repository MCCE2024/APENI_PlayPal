
import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  // Initialize from localStorage to persist login state across sessions
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('playpal:isLoggedIn');
      return stored === 'true';
    } catch (_) {
      return false;
    }
  });

  const handleLogin = useCallback(() => {
    setIsLoggedIn(true);
    try {
      localStorage.setItem('playpal:isLoggedIn', 'true');
    } catch (_) {
      // ignore storage errors
    }
  }, []);

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
    try {
      localStorage.setItem('playpal:isLoggedIn', 'false');
    } catch (_) {
      // ignore storage errors
    }
  }, []);

  // Keep state in sync if another tab changes it
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'playpal:isLoggedIn' && e.storageArea === localStorage) {
        setIsLoggedIn(e.newValue === 'true');
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <Header isLoggedIn={isLoggedIn} onLogin={handleLogin} onLogout={handleLogout} />
      <main>
        {isLoggedIn ? <Dashboard /> : <LandingPage onLogin={handleLogin} />}
      </main>
    </div>
  );
};

export default App;
