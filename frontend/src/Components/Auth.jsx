import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchAPI } from '../services/helper';

export default function Auth({ setUser }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(location?.state?.signup ? false : true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  const endpoint = isLogin ? '/auth/login' : '/auth/signup';

  try {
    let bodyData;
    let headers = {};

    if (isLogin) {
      // Pass URLSearchParams converted to string
      bodyData = new URLSearchParams({
        username: username,
        password: password,
      }).toString();
      
      headers['Content-Type'] = 'application/x-www-form-urlencoded';
    } else {
      bodyData = JSON.stringify({
        username: username,
        email: email,
        password: password,
      }).toString();
      headers['Content-Type'] = 'application/json';
    }

    const data = await fetchAPI(endpoint, {
      method: 'POST',
      headers,
      body: bodyData,
    });

    if (isLogin) {
      const token = data.access_token;
      if (token) {
        const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
        document.cookie = `token=${token}; path=/; expires=${expires}; SameSite=Lax`;
      }
      navigate('/dashboard');
      localStorage.setItem('user', JSON.stringify({email: data.email, library: data.library}))
    } else {
      setIsLogin(true);
      setError('Account created successfully! Please sign in.');
    }
  } catch (err) {
    let message = 'An unexpected error occurred.';
    if (typeof err === 'string') {
      message = err;
    } else if (err?.detail) {
      message = Array.isArray(err.detail)
        ? err.detail.map((d) => d.msg).join(', ')
        : err.detail;
    } else if (err?.message) {
      message = typeof err.message === 'object' ? JSON.stringify(err.message) : err.message;
    }
    setError(message);
  } finally {
    setLoading(false);
  }
};

  const isSuccessMessage = error.includes('successfully');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-indigo-400 tracking-tight mb-2">
            🎮 GameVault
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            {isLogin 
              ? 'Sign in to access your personalized recommendation engine' 
              : 'Create an account to start tracking your game wishlist'}
          </p>
        </div>

        {/* Error / Success Alert */}
        {error && (
          <div 
            className={`p-3 rounded-lg text-sm mb-6 border transition-all break-words ${
              isSuccessMessage 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
            }`}
          >
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Username Field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. gamer123"
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:border-indigo-500 outline-none transition-all placeholder:text-slate-600"
            />
          </div>

          {/* Email Field (Register Only) */}
          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:border-indigo-500 outline-none transition-all placeholder:text-slate-600"
              />
            </div>
          )}

          {/* Password Field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:border-indigo-500 outline-none transition-all placeholder:text-slate-600"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        {/* Toggle Login / Register */}
        <div className="mt-8 text-center border-t border-slate-800 pt-6">
          <p className="text-sm text-slate-400">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-2 ml-1 cursor-pointer transition-colors"
            >
              {isLogin ? 'Register now' : 'Sign in'}
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}