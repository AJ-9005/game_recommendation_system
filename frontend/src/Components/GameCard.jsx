import { useNavigate } from "react-router-dom";

export default function GameCard({ game }) {
  const navigate = useNavigate()
  return (
    <div
      onClick={() => navigate("/gameinfo")}
      className="group relative bg-slate-900 border border-slate-800 hover:border-indigo-500 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-1 shadow-md hover:shadow-indigo-500/10 flex flex-col"
    >
      {/* Cover Poster */}
      <div className="w-full h-40 overflow-hidden bg-slate-950">
        <img src={game.image} alt={game.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      </div>

      {/* Metadata */}
      <div className="p-3 flex flex-col justify-between flex-1">
        <h4 className="text-xs font-semibold text-slate-100 truncate mb-2">
          {game.title}
        </h4>

        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-amber-400">
            ⭐ {game.rating}
          </span>

          <span className="text-[10px] font-semibold text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
            Details ➔
          </span>
        </div>
      </div>
    </div>
  );
}