import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function GameInfo({ handleAddGame}) {
  const navigate = useNavigate();
  const location = useLocation();
  const userData = localStorage.getItem('user')
  const user = JSON.parse(userData)
  const library = user?.library

  // 1. Extract game passed from navigation state
  const game = location.state?.game;
  const rawgId = game?.rawg_id;
  if (!rawgId) return;

  const [similarGames, setSimilarGames] = useState([]);
  const [loadingRecs, setLoadingRecs] = useState(false);

  // 2. Fetch recommendations dynamically from backend when game changes
  useEffect(() => {
    if (!game?.rawg_id) return;

    const fetchRecommendations = async () => {
      setLoadingRecs(true);
      try {
        // Adjust endpoint URL & parameters to match your FastAPI router
        const response = await fetch(
          `http://127.0.0.1:8000/recommendations/content/${rawgId}`
        );
        if (response.ok) {
          const data = await response.json();
          // Adjust property name based on FastAPI return payload (e.g. data.recommendations or data)
          setSimilarGames(Array.isArray(data) ? data : data.recommendations || []);
        }
      } catch (err) {
        console.error('Failed to fetch recommendations:', err);
      } finally {
        setLoadingRecs(false);
      }
    };

    fetchRecommendations();
  }, [game?.rawg_id, game?.name]);

  // Fallback state if user visits /gameinfo directly without navigation state
  if (!game) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center gap-4">
        <p className="text-slate-400">No game selected.</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-500"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  // Check if current game is in user library
  const inVault = library.some((item) => 
    typeof item === 'number' || typeof item === 'string' 
      ? Number(item) === game.rawg_id 
      : item.rawg_id === game.rawg_id
  );

  const handleVaultToggle = () => {
    if (inVault) {
      if (onRemoveFromWishlist) onRemoveFromWishlist(game.id);
    } else {
      if (onAddToWishlist) onAddToWishlist(game);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      
      {/* 1. HERO HEADER */}
      <div className="relative w-full h-[380px] bg-slate-900 overflow-hidden">
        {game.background_image && (
          <img
            src={game.background_image}
            className="w-full h-full object-cover opacity-35 blur-xs scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

        {/* Floating Top Controls */}
        <div className="absolute top-6 left-6 right-6 max-w-7xl mx-auto flex justify-between items-center z-10">
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 bg-slate-900/80 hover:bg-slate-800 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700/60 backdrop-blur-md cursor-pointer transition-all"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Hero Game Title & Genres */}
        <div className="absolute bottom-8 left-0 right-0 max-w-7xl mx-auto px-6 z-10">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {game.genres?.map((genre, idx) => (
              <span key={idx} className="px-3 py-1 bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-semibold rounded-lg backdrop-blur-md">
                {genre}
              </span>
            ))}
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-2">
            {game.title}
          </h1>
          {game.rating && <p className="text-sm text-slate-400">⭐ {game.rating} / 5 Rating</p>}
        </div>
      </div>

      {/* 2. MAIN SINGLE SCROLL CONTAINER */}
      <div className="max-w-7xl mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: ABOUT, TRAILER & PHOTOS */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Overview */}
          <section className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 shadow-xl">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">About</h2>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {game.summary || 'No description available for this game.'}
            </p>
          </section>

          {/* Featured Trailer */}
          {game.trailer?.src && (
            <section className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 shadow-xl">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Trailer</h2>
              <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                <video
                  controls
                  poster={game.trailer.preview}
                  className="w-full h-full object-cover"
                >
                  <source src={game.trailer.src} type="video/mp4" />
                </video>
              </div>
            </section>
          )}

          {/* Screenshots Stream */}
          {game.screenshots?.length > 0 && (
            <section className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 shadow-xl">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Screenshots</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {game.screenshots.map((src, idx) => (
                  <div key={idx} className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                    <img
                      src={typeof src === 'string' ? src : src.image}
                      alt={`${game.name} Screenshot ${idx + 1}`}
                      className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>

        {/* RIGHT COLUMN: CORE METADATA & ACTIONS */}
        <aside className="flex flex-col gap-6">
          <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 shadow-xl flex flex-col gap-6 sticky top-6">
            
            {/* Primary Action Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={inVault ? (() => handleAddGame(rawgId)):(console.log("Game Removed!"))}
                className={`w-full py-3.5 px-4 font-semibold text-sm rounded-xl shadow-lg transition-all cursor-pointer text-center flex items-center justify-center gap-2 ${
                  inVault
                    ? 'bg-emerald-600 hover:bg-rose-600 text-white shadow-emerald-600/20 hover:shadow-rose-600/20 group'
                    : 'bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white shadow-indigo-600/25'
                }`}
              >
                {inVault ? (
                  <>
                    <span className="group-hover:hidden">✓ In Vault</span>
                    <span className="hidden group-hover:inline">✕ Remove from Vault</span>
                  </>
                ) : (
                  '+ Add to Vault'
                )}
              </button>

              {game.steam_url && (
                <a
                  href={game.steam_url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm rounded-xl border border-slate-700/60 transition-all text-center flex items-center justify-center gap-2"
                >
                  Buy on Steam ↗
                </a>
              )}
            </div>

            <div className="border-t border-slate-800/80 pt-6 flex flex-col gap-4">
              {game.released && (
                <div>
                  <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Release Date</span>
                  <p className="text-sm text-slate-200 font-medium">{game.released}</p>
                </div>
              )}

              {game.platforms?.length > 0 && (
                <div>
                  <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Platforms</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {game.platforms.map((platform, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-md">
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {game.developers?.length > 0 && (
                <div>
                  <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Developer</span>
                  <p className="text-sm text-slate-200 font-medium">
                    {Array.isArray(game.developers) ? game.developers.join(', ') : game.developers}
                  </p>
                </div>
              )}

              {game.publishers?.length > 0 && (
                <div>
                  <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Publisher</span>
                  <p className="text-sm text-slate-200 font-medium">
                    {Array.isArray(game.publishers) ? game.publishers.join(', ') : game.publishers}
                  </p>
                </div>
              )}
            </div>

          </div>
        </aside>

      </div>

      {/* DYNAMIC RECOMMENDATIONS FROM BACKEND */}
      <div className="max-w-7xl mx-auto px-6 border-t border-slate-800/80 pt-10 mt-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">More games like this</h2>
            <p className="text-xs text-slate-400 mt-1">
              Powered by your FastAPI recommendation engine
            </p>
          </div>
        </div>

        {loadingRecs ? (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex-none w-64 h-52 bg-slate-900/60 rounded-2xl animate-pulse border border-slate-800" />
            ))}
          </div>
        ) : similarGames.length > 0 ? (
          <div className="flex gap-5 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
            {similarGames.map((item) => (
              <div
                key={item.rawg_id}
                onClick={() => {
                  if (onSelectGame) {
                    onSelectGame(item.rawg_id);
                  } else {
                    navigate('/gameinfo', { state: { game: item } });
                  }
                }}
                className="flex-none w-64 bg-slate-900 border border-slate-800/80 rounded-2xl overflow-hidden shadow-lg hover:border-indigo-500/50 hover:shadow-indigo-500/10 transition-all cursor-pointer group snap-start"
              >
                <div className="relative h-36 w-full overflow-hidden bg-slate-950">
                  <img
                    src={item.background_image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {item.rating && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 bg-slate-950/80 border border-slate-800 rounded-md text-[11px] font-bold text-amber-400 backdrop-blur-md">
                      ⭐ {item.rating}
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="text-sm font-bold text-slate-100 group-hover:text-indigo-400 transition-colors line-clamp-1 mb-2">
                    {item.title}
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {item.genres?.map((g, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 bg-slate-950 text-slate-400 border border-slate-800 rounded-md">
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic">No similar games found.</p>
        )}
      </div>

    </div>
  );
}