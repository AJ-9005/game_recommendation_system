import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAPI } from '../services/helper';

export default function Navbar({ onGameAdded, onLogout }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Debounced search logic querying backend /games/search
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const data = await fetchAPI(`/games/search?q=${encodeURIComponent(query)}`);
        setResults(data || []);
        setIsOpen(true);
      } catch (err) {
        console.error('Search query failed:', err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddAndClose = (rawgId) => {
    onGameAdded(rawgId);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 h-16 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl h-full mx-auto px-6 flex items-center justify-between gap-6">
        
        {/* Brand Logo */}
        <div 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 cursor-pointer group shrink-0"
        >
          <span className="text-xl">🎮</span>
          <h1 className="text-lg font-extrabold text-indigo-400 group-hover:text-indigo-300 tracking-tight transition-colors">
            GameVault
          </h1>
        </div>

        {/* INLINE SEARCH BAR WITH DROPDOWN */}
        <div className="relative flex-1 max-w-md" ref={dropdownRef}>
          <div className="relative">
            <input
              type="text"
              placeholder="Search games to add..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => query.trim().length >= 2 && setIsOpen(true)}
              className="w-full py-1.5 pl-9 pr-4 rounded-xl bg-slate-900 border border-slate-800 focus:border-indigo-500 text-slate-200 text-xs outline-none transition-all placeholder-slate-500"
            />
            <span className="absolute left-3 top-2 text-slate-500 text-xs">
              🔍
            </span>
          </div>

          {/* Search Results Floating Overlay */}
          {isOpen && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden max-h-80 overflow-y-auto z-50 flex flex-col divide-y divide-slate-800/60">
              {loading && (
                <p className="text-xs text-slate-500 p-3 text-center">Searching database...</p>
              )}

              {!loading && results.length === 0 && (
                <p className="text-xs text-slate-500 p-3 text-center">No games found for "{query}"</p>
              )}

              {!loading && results.map((game) => (
                <div
                  key={game.rawg_id || game.id}
                  className="flex items-center justify-between p-2.5 hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={game.background_image || game.image}
                      alt={game.title}
                      className="w-8 h-8 object-cover rounded-lg"
                    />
                    <div>
                      <p className="text-xs font-semibold text-slate-200 line-clamp-1">{game.title}</p>
                      <p className="text-[10px] text-slate-500">⭐ {game.rating || 'N/A'}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddAndClose(game.rawg_id || game.id)}
                    className="px-2.5 py-1 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs font-semibold rounded-md transition-colors cursor-pointer shrink-0"
                  >
                    + Add
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-medium rounded-xl transition-all cursor-pointer shrink-0"
        >
          Logout
        </button>

      </div>
    </header>
  );
}