import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white flex flex-col justify-between">
      
      {/* 1. TOP NAVBAR */}
      <header className="w-full border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-white shadow-lg shadow-indigo-600/30">
              G
            </div>
            <span className="text-lg font-extrabold tracking-tight text-white">
              Game<span className="text-indigo-400">Vault</span>
            </span>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white cursor-pointer transition-colors">Sign In</button>
            <button onClick={() => navigate('/login', {state: {signup: false}})} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-600/20 cursor-pointer transition-all"> Get Started </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-20 pb-16 px-6 max-w-7xl mx-auto w-full flex flex-col items-center text-center z-10">
        
        {/* ML Tagline Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-8 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          Powered by Machine Learning Filtering
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl leading-[1.15] mb-6">
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Discover your next adventure.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base md:text-lg text-slate-400 max-w-2xl mb-10 leading-relaxed">
          GameVault uses predictive ML algorithms to analyze thousands of titles and recommend games tailored specifically to your taste.
        </p>

        {/* Primary Call to Action */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center max-w-md">
          <button
            onClick={() => navigate("/login")}
            className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-xl shadow-indigo-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            Sign In to Get Recommendations ➔
          </button>
        </div>

        {/* FLOATING GLASS PREVIEW CARDS */}
        <div className="mt-16 w-full max-w-5xl relative">
          <div className="absolute inset-0 bg-indigo-600/10 blur-3xl rounded-full -z-10" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-slate-900/40 border border-slate-800/80 rounded-3xl backdrop-blur-xl shadow-2xl">
            
            {/* Card 1 */}
            <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 text-left">
              <div className="h-32 rounded-xl bg-slate-900 overflow-hidden mb-3">
                <img 
                  src="https://media.rawg.io/media/games/618/618c47b6478b0936d5f46d29840391a3.jpg" 
                  alt="Witcher 3" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">98% Match</span>
              <h4 className="text-sm font-bold text-white mt-0.5">The Witcher 3: Wild Hunt</h4>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">Story-driven open world RPG based on your preference for dark fantasy.</p>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 text-left">
              <div className="h-32 rounded-xl bg-slate-900 overflow-hidden mb-3">
                <img 
                  src="https://media.rawg.io/media/games/b29/b294fdd866dcdb643e7ed374150b286d.jpg" 
                  alt="Elden Ring" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">95% Match</span>
              <h4 className="text-sm font-bold text-white mt-0.5">Elden Ring</h4>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">Challenging action RPG matching your exploration history.</p>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 text-left">
              <div className="h-32 rounded-xl bg-slate-900 overflow-hidden mb-3">
                <img 
                  src="https://media.rawg.io/media/games/26d/26d4437715bee60138dab4a7c4c59c9c.jpg" 
                  alt="Cyberpunk 2077" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">91% Match</span>
              <h4 className="text-sm font-bold text-white mt-0.5">Cyberpunk 2077</h4>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">Immersive sci-fi RPG recommended via collaborative vector similarity.</p>
            </div>

          </div>
        </div>
      </section>

      {/* 3. CORE FEATURES SECTION */}
      <section className="py-16 px-6 max-w-7xl mx-auto w-full border-t border-slate-800/60">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-6">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold text-base mb-4">
              01
            </div>
            <h3 className="text-base font-bold text-white mb-2">Smart Personalization</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our algorithm builds a unique preference profile so recommendations adapt continuously to your gaming style.
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-6">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold text-base mb-4">
              02
            </div>
            <h3 className="text-base font-bold text-white mb-2">Curated Game Library</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Explore thousands of games complete with system specs, media trailers, screenshots, and direct purchase links.
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-6">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold text-base mb-4">
              03
            </div>
            <h3 className="text-base font-bold text-white mb-2">Zero Fatigue Browsing</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              No endless scrolling through random storefront lists. Get straight to games you actually want to play.
            </p>
          </div>

        </div>
      </section>

      {/* 4. FOOTER */}
      <footer className="w-full border-t border-slate-800/60 py-8 px-6 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} GameVault ML Engine. Built for personalized discovery.</p>
      </footer>

    </div>
  );
}