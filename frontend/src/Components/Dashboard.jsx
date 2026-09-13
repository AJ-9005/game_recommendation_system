import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GameCard from './GameCard';

export default function Dashboard({ onLogout, myGames, becauseYouPlayed, becauseYouLikeGenre }) {
  const navigate = useNavigate()
  // --- STATE MANAGEMENT ---
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(5);

  // --- RESPONSIVE CARD DISPLAY CALCULATION ---
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setVisibleCount(2);       // Mobile
      else if (width < 1024) setVisibleCount(3);  // Tablet
      else if (width < 1400) setVisibleCount(4);  // Desktop
      else setVisibleCount(5);                    // Wide Screen
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      
      {/* --- TOP BAR --- */}
      <header className="flex justify-between items-center pb-5 border-b border-slate-800 mb-8 max-w-7xl mx-auto">
        <h1 className="text-2xl font-extrabold text-indigo-400 tracking-tight">
          🎮 GameVault
        </h1>

        <div className="flex items-center gap-4">
          {/* Add Game Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2 cursor-pointer"
          >
            <span className="text-lg leading-none">+</span> Add Game
          </button>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 text-sm rounded-xl transition-all cursor-pointer"
          >
            Logout
          </button>
        </div>
      </header>

      {/* --- MAIN DASHBOARD ROWS --- */}
      <main className="flex flex-col gap-10 max-w-7xl mx-auto">
        
        {/* ROW 1: MY GAMES */}
        <DashboardRow
          title="My Library"
          subtitle={`${myGames.length} Saved Titles`}
          games={myGames.slice(0, visibleCount)}
          onViewAll={() => navigate('/viewall')}
        />

        {/* ROW 2: BECAUSE YOU PLAYED X */}
        <DashboardRow
          title="Because You Played The Witcher 3"
          subtitle="Single-item vector similarity matches"
          games={becauseYouPlayed.slice(0, visibleCount)}
          onViewAll={() => navigate('/viewall')}
        />

        {/* ROW 3: BECAUSE YOU ARE INTO X GENRE */}
        <DashboardRow
          title="Because You Like City Builders & Strategy"
          subtitle="Multi-item aggregated taste vector"
          games={becauseYouLikeGenre.slice(0, visibleCount)}
          onViewAll={() => navigate('/viewall')}
        />

      </main>

      {/* --- ADD GAME SEARCH MODAL --- */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex justify-center items-start pt-20 z-50 p-4">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-100">Search RAWG Database</h3>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-xl cursor-pointer"
              >
                ✕
              </button>
            </div>

            <input
              type="text"
              autoFocus
              placeholder="Type a game title (e.g. GTA, Portal, Skyrim)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-slate-200 text-sm outline-none transition-all placeholder-slate-600"
            />

            <p className="text-xs text-slate-500 mt-3">
              Type at least 3 characters to query RAWG API...
            </p>
          </div>
        </div>
      )}

    </div>
  );
}

// --- ROW REUSABLE COMPONENT ---
function DashboardRow({ title, subtitle, games, onViewAll }) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight">
            {title}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {subtitle}
          </p>
        </div>

        <button
          onClick={onViewAll}
          className="text-indigo-400 hover:text-indigo-300 text-xs font-semibold cursor-pointer transition-colors"
        >
          View All →
        </button>
      </div>

      {/* CARD GRID ROW */}
      <div 
        className="grid gap-4"
        style={{ gridTemplateColumns: `repeat(${games.length}, minmax(0, 1fr))` }}
      >
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </section>
  );
}