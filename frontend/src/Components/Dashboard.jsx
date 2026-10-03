import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GameCard from './GameCard';
import { fetchAPI } from '../services/helper';

export default function Dashboard() {
  const navigate = useNavigate();
  // --- STATE MANAGEMENT ---
  const [loading, setLoading] = useState(false);
  const [myGames, setMyGames] = useState([]);
  const [becauseYouPlayed, setBecauseYouPlayed] = useState([]);
  const [becauseYouLikeGenre, setBecauseYouLikeGenre] = useState([]);
  const [anchorGame, setAnchorGame] = useState('');
  const [targetGenres, setTargetGenres] = useState([]);

  // --- SEARCH MODAL STATE ---
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [addingId, setAddingId] = useState(null);

  const [visibleCount, setVisibleCount] = useState(5);

  async function fetchDashboardData() {
    try {
      setLoading(true);
      const data = await fetchAPI('/dashboard/get_all_rows');
      setMyGames(data?.row1?.games || []);
      setBecauseYouPlayed(data?.row2?.games || []);
      setBecauseYouLikeGenre(data?.row3?.games || []);
      setAnchorGame(data?.row2?.anchor_game || '');
      setTargetGenres(data?.row3?.genres || []);
    } catch (error) {
      console.error('Failed to fetch dashboard rows:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // --- DEBOUNCED GAME SEARCH EFFECT ---
  useEffect(() => {
    if (searchQuery.trim().length < 3) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsSearching(true);
        const data = await fetchAPI(`/games/search?query=${encodeURIComponent(searchQuery)}`);
        setSearchResults(data || []);
      } catch (err) {
        console.error('Failed to search games:', err);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // --- HANDLE ADD GAME TO LIBRARY ---
  async function handleAddGame(rawgId) {
    try {
      setAddingId(rawgId);
      await fetchAPI(`/users/interactions/${rawgId}`, { method: 'POST' });
      // Refresh dashboard data instantly to display updated library and new recommendation rows
      await fetchDashboardData();
      setIsSearchOpen(false);
      setSearchQuery('');
      setSearchResults([]);
    } catch (err) {
      console.error('Failed to add game:', err);
    } finally {
      setAddingId(null);
    }
  }

  // --- RESPONSIVE CARD DISPLAY CALCULATION ---
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setVisibleCount(2);        // Mobile
      else if (width < 1024) setVisibleCount(3);  // Tablet
      else if (width < 1400) setVisibleCount(4);  // Desktop
      else setVisibleCount(5);                    // Wide Screen
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900 text-white">
        <p className="text-xl animate-pulse">Loading GameVault...</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      
      {/* --- TOP BAR ---
      <header className="flex justify-between items-center pb-5 border-b border-slate-800 mb-8 max-w-7xl mx-auto">
        <h1 className="text-2xl font-extrabold text-indigo-400 tracking-tight">
          🎮 GameVault
        </h1>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2 cursor-pointer"
          >
            <span className="text-lg leading-none">+</span> Add Game
          </button>

          <button
            onClick={onLogout}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 text-sm rounded-xl transition-all cursor-pointer"
          >
            Logout
          </button>
        </div>
      </header> */}

      {/* --- MAIN DASHBOARD ROWS --- */}
      <main className="flex flex-col gap-10 max-w-7xl mx-auto">
        
        {/* ROW 1: MY GAMES */}
        <DashboardRow
          title="My Library"
          subtitle={`${myGames.length} Saved Titles`}
          games={myGames.slice(0, visibleCount)}
          onViewAll={() => navigate('/viewall')}
          emptyMessage="Your library is empty. Click '+ Add Game' above to start adding titles!"
        />

        {/* ROW 2: BECAUSE YOU PLAYED X */}
        <DashboardRow
          title={anchorGame ? `Because You Played ${anchorGame}` : "Because You Played"}
          subtitle="Single-item vector similarity matches"
          games={becauseYouPlayed.slice(0, visibleCount)}
          onViewAll={() => navigate('/viewall')}
          emptyMessage="Please add more games to library to view recommendations."
        />

        {/* ROW 3: BECAUSE YOU ARE INTO X GENRE */}
        <DashboardRow
          title={
            targetGenres.length > 0
              ? `Because You Like ${targetGenres.slice(0, 2).join(' & ')}`
              : "Genre Recommendations"
          }
          subtitle="Multi-item aggregated taste vector"
          games={becauseYouLikeGenre.slice(0, visibleCount)}
          onViewAll={() => navigate('/viewall')}
          emptyMessage="Please add more games to library to view genre matches."
        />

      </main>

      {/* --- ADD GAME SEARCH MODAL --- */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex justify-center items-start pt-20 z-50 p-4">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-100">Search RAWG Database</h3>
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery('');
                  setSearchResults([]);
                }}
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

            {/* SEARCH RESULTS LIST */}
            <div className="mt-4 max-h-80 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {isSearching && (
                <p className="text-xs text-indigo-400 animate-pulse py-2">Searching titles...</p>
              )}

              {!isSearching && searchQuery.length >= 3 && searchResults.length === 0 && (
                <p className="text-xs text-slate-500 py-2">No matching games found.</p>
              )}

              {searchResults.map((game) => {
                const isAlreadyInLibrary = myGames.some(
                  (mg) => String(mg.rawg_id || mg.id) === String(game.rawg_id || game.id)
                );

                return (
                  <div
                    key={game.rawg_id || game.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      {(game.background_image || game.image) && (
                        <img
                          src={game.background_image || game.image}
                          alt={game.title || game.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      )}
                      <div>
                        <h4 className="text-sm font-semibold text-slate-100 leading-snug">
                          {game.title || game.name}
                        </h4>
                        <p className="text-xs text-slate-500">
                          Rating: {game.rating || 'N/A'}
                        </p>
                      </div>
                    </div>

                    <button
                      disabled={isAlreadyInLibrary || addingId === (game.rawg_id || game.id)}
                      onClick={() => handleAddGame(game.rawg_id || game.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        isAlreadyInLibrary
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer shadow-md shadow-indigo-600/20'
                      }`}
                    >
                      {addingId === (game.rawg_id || game.id)
                        ? 'Adding...'
                        : isAlreadyInLibrary
                        ? 'In Library'
                        : '+ Add'}
                    </button>
                  </div>
                );
              })}
            </div>

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
function DashboardRow({ title, subtitle, games, onViewAll, emptyMessage }) {
  const hasgames = games && games.length > 0;
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

        {hasgames && (
          <button
            onClick={onViewAll}
            className="text-indigo-400 hover:text-indigo-300 text-xs font-semibold cursor-pointer transition-colors"
          >
            View All →
          </button>
        )}
      </div>

      {/* CARD GRID ROW */}
      {hasgames ? (
        <div 
          className="grid gap-4"
          style={{ gridTemplateColumns: `repeat(${games.length}, minmax(0, 1fr))` }}
        >
          {games.map((game) => (
            <GameCard key={game.rawg_id || game.id || game._id} game={game} />
          ))}
        </div>
      ) : (
        <div className="w-full py-8 px-6 rounded-2xl border border-dashed border-slate-800/80 bg-slate-900/20 text-center">
          <p className="text-sm text-slate-400 font-medium">
            {emptyMessage || "Please add more games to library to view"}
          </p>
        </div>
      )}
    </section>
  );
}