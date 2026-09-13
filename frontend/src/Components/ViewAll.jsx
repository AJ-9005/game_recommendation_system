import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameCard from "./GameCard";

const generateMockGames = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: `Game Title ${i + 1}`,
    rating: (3.5 + (i % 15) * 0.1).toFixed(1),
    image: `https://picsum.photos/seed/${i + 100}/400/225`,
  }));
};

export default function ViewAll({ categoryTitle = "Recommended Games", onBack, onSelectGame }) {
  const navigate = useNavigate()
  const PAGE_SIZE = 30;
  
  // Total dataset (In production/ML backend, this will be your paginated API response)
  const [allGames] = useState(() => generateMockGames(120)); 
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const displayedGames = allGames.slice(0, visibleCount);
  const hasMore = visibleCount < allGames.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Header & Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-slate-800/80 pb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl border border-slate-800 transition-all cursor-pointer"
            >
              ← Back
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                {categoryTitle}
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Showing {displayedGames.length} of {allGames.length} games
              </p>
            </div>
          </div>
        </div>

        {/* 5-Column Responsive Game Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {displayedGames.map((game) => (
            <GameCard key={game.id} game={game} onSelectGame={onSelectGame} />
          ))}
        </div>

        {/* Load More Action Button */}
        {hasMore && (
          <div className="mt-12 flex justify-center">
            <button onClick={handleLoadMore} className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"> + Load More </button>
          </div>
        )}

      </div>
    </div>
  );
}