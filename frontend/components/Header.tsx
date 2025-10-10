
import React from 'react';
import { LogoIcon } from './icons/LogoIcon';

interface HeaderProps {
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, onLogin, onLogout }) => {
  return (
    <header className="bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50 border-b border-slate-700/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <LogoIcon className="h-8 w-8 text-emerald-400" />
            <span className="text-2xl font-bold tracking-tight text-white">PlayPal</span>
          </div>
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <div className="flex items-center space-x-3">
                    <span className="hidden sm:inline font-medium text-slate-300">Welcome!</span>
                    <img className="h-9 w-9 rounded-full ring-2 ring-slate-600" src="https://picsum.photos/100/100" alt="User Avatar" />
                </div>
                <button
                  onClick={onLogout}
                  className="px-4 py-2 text-sm font-semibold text-white bg-slate-700 hover:bg-slate-600 rounded-md transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onLogin}
                  className="text-sm font-semibold text-slate-300 hover:text-white transition-colors duration-200"
                >
                  Log In
                </button>
                <button
                  onClick={onLogin}
                  className="px-4 py-2 text-sm font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-md transition-colors duration-200"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
