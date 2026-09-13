import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function GameInfo({ onAddToWishlist }) {
  const navigate = useNavigate()
  // Sample Witcher 3 data tailored to your exact fields
  const [game] = useState({
    id: 3328,
    name: 'The Witcher 3: Wild Hunt',
    released: '2015-05-18',
    background_image: 'https://media.rawg.io/media/games/618/618c47b6478b0936d5f46d29840391a3.jpg',
    description: `The Witcher: Wild Hunt is a story-driven open world role-playing game set in a visually stunning fantasy universe. You play as Geralt of Rivia, a professional monster hunter tasked with finding the child of prophecy in a vast world rich with merchant cities, pirate islands, and dangerous mountain passes.`,
    developers: ['CD PROJEKT RED'],
    publishers: ['CD PROJEKT RED'],
    genres: ['Action', 'RPG'],
    platforms: ['PC', 'PlayStation 5', 'Xbox Series X/S', 'Nintendo Switch'],
    steam_url: 'https://store.steampowered.com/app/292030/The_Witcher_3_Wild_Hunt/',
    rating: 4.66,
    // Featured video/trailer from RAWG /movies endpoint
    trailer: {
      name: 'Official Gameplay Trailer',
      preview: 'https://media.rawg.io/media/screenshots/1ac/1ac19f174f39eec35ad7442ad110a34d.jpg',
      src: 'https://media.rawg.io/media/stories-full/123/123456.mp4' // Raw MP4
    },
    // Media screenshots
    screenshots: [
      'https://media.rawg.io/media/screenshots/1ac/1ac19f174f39eec35ad7442ad110a34d.jpg',
      'https://media.rawg.io/media/screenshots/6a0/6a08a1614cb20f3970bba15e3f31481c.jpg',
      'https://media.rawg.io/media/screenshots/c12/c1209e9ee35168e8334a1792476b70f0.jpg'
    ]
  });

  const [similarGames] = useState([
    {
      id: 5286,
      name: 'The Elder Scrolls V: Skyrim',
      rating: 4.42,
      background_image: 'https://media.rawg.io/media/games/7cf/7cfc92f861d994defd90d9031cf3328e.jpg',
      genres: ['RPG', 'Action']
    },
    {
      id: 41494,
      name: 'Cyberpunk 2077',
      rating: 4.15,
      background_image: 'https://media.rawg.io/media/games/26d/26d4437715bee60138dab4a7c4c59c9c.jpg',
      genres: ['Action', 'RPG']
    },
    {
      id: 58175,
      name: 'God of War',
      rating: 4.58,
      background_image: 'https://media.rawg.io/media/games/4be/4be6e1809073db13a357b4986def590e.jpg',
      genres: ['Action', 'Adventure']
    },
    {
      id: 326243,
      name: 'Elden Ring',
      rating: 4.64,
      background_image: 'https://media.rawg.io/media/games/b29/b294fdd866dcdb643e7ed374150b286d.jpg',
      genres: ['Action', 'RPG']
    },
    {
      id: 28,
      name: 'Red Dead Redemption 2',
      rating: 4.59,
      background_image: 'https://media.rawg.io/media/games/511/5118211907166037a342417242d54483.jpg',
      genres: ['Action', 'Adventure']
    }
  ]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      
      {/* 1. HERO HEADER */}
      <div className="relative w-full h-[380px] bg-slate-900 overflow-hidden">
        <img
          src={game.background_image}
          alt={game.name}
          className="w-full h-full object-cover opacity-35 blur-xs scale-105"
        />
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
            {game.genres.map((genre, idx) => (
              <span key={idx} className="px-3 py-1 bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-semibold rounded-lg backdrop-blur-md">
                {genre}
              </span>
            ))}
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-2">
            {game.name}
          </h1>
          <p className="text-sm text-slate-400">⭐ {game.rating} / 5 Rating</p>
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
              {game.description}
            </p>
          </section>

          {/* Featured Trailer (If Available) */}
          {game.trailer && (
            <section className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 shadow-xl">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Trailer</h2>
              <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                <video
                  controls
                  poster={game.trailer.preview}
                  className="w-full h-full object-cover"
                >
                  <source src={game.trailer.src} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </section>
          )}

          {/* Photos / Screenshots Stream */}
          <section className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 shadow-xl">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Screenshots</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {game.screenshots.map((src, idx) => (
                <div key={idx} className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                  <img
                    src={src}
                    alt={`${game.name} Screenshot ${idx + 1}`}
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* RIGHT COLUMN: CORE METADATA & ACTIONS */}
        <aside className="flex flex-col gap-6">
          <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 shadow-xl flex flex-col gap-6 sticky top-6">
            
            {/* Primary Action Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => onAddToWishlist(game)}
                className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/25 transition-all cursor-pointer text-center"
              >
                + Add to Vault
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
              {/* Release Date */}
              <div>
                <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Release Date</span>
                <p className="text-sm text-slate-200 font-medium">{game.released}</p>
              </div>

              {/* Platforms */}
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

              {/* Developer */}
              <div>
                <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Developer</span>
                <p className="text-sm text-slate-200 font-medium">{game.developers.join(', ')}</p>
              </div>

              {/* Publisher */}
              <div>
                <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Publisher</span>
                <p className="text-sm text-slate-200 font-medium">{game.publishers.join(', ')}</p>
              </div>
            </div>

          </div>
        </aside>

      </div>
      <div className="max-w-7xl mx-auto px-6 border-t border-slate-800/80 pt-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">More games like this</h2>
            <p className="text-xs text-slate-400 mt-1">Hand-picked recommendations based on genre and playstyle</p>
          </div>
        </div>

        {/* Scrollable Container with Custom Styled Scrollbar */}
        <div className="flex gap-5 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          {similarGames.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectGame && onSelectGame(item.id)}
              className="flex-none w-64 bg-slate-900 border border-slate-800/80 rounded-2xl overflow-hidden shadow-lg hover:border-indigo-500/50 hover:shadow-indigo-500/10 transition-all cursor-pointer group snap-start"
            >
              <div className="relative h-36 w-full overflow-hidden bg-slate-950">
                <img
                  src={item.background_image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 px-2 py-0.5 bg-slate-950/80 border border-slate-800 rounded-md text-[11px] font-bold text-amber-400 backdrop-blur-md">
                  ⭐ {item.rating}
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-sm font-bold text-slate-100 group-hover:text-indigo-400 transition-colors line-clamp-1 mb-2">
                  {item.name}
                </h3>
                <div className="flex flex-wrap gap-1">
                  {item.genres.map((g, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 bg-slate-950 text-slate-400 border border-slate-800 rounded-md">
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}