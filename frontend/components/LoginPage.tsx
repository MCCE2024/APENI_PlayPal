import React, { useState } from 'react';

interface LoginPageProps {
  onLoginSuccess: (email: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Login attempt:', { email, password });
    // In a real app, you would send these credentials to an authentication API
    // and only call onLoginSuccess if the login is successful.
    onLoginSuccess(email);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex justify-center items-center">
      <div className="bg-slate-800/50 p-8 rounded-lg shadow-lg border border-slate-700 w-full max-w-md text-center">
        <h2 className="text-3xl font-bold text-white mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 rounded-md bg-slate-700 border border-slate-600 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 rounded-md bg-slate-700 border border-slate-600 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            className="w-full p-3 rounded-md bg-emerald-600 text-white font-semibold hover:bg-emerald-500 transition-colors duration-200"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;


