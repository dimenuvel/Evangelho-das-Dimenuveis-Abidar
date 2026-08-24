import React from 'react';
import { HighScoreEntry } from '../game/highScoreManager';

interface Props {
  highScores: HighScoreEntry[];
  onClose: () => void;
}

export const LeaderboardModal: React.FC<Props> = ({ highScores, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-[60] p-4 font-mono">
      <div className="bg-[#0b051b] border-2 border-[#ffd700] rounded-sm max-w-lg w-full p-6 text-white shadow-[10px_10px_0_0_rgba(0,0,0,0.8)] relative">
        {/* Header Bar */}
        <div className="flex justify-between items-center mb-4 border-b-2 border-white/10 pb-3 gap-3">
          <h2 className="text-lg md:text-xl font-black text-[#ffd700] tracking-wider glow-gold flex-1 flex items-center gap-2">
            <span>🏆</span> TOP 10 RANKING / LEADERBOARD
          </h2>
          <button
            onClick={onClose}
            className="text-[#ffd700] hover:bg-[#ffd700] hover:text-black text-xs md:text-sm font-bold px-3 py-1.5 bg-black border-2 border-white/20 rounded-sm transition shadow-[3px_3px_0_0_rgba(0,0,0,0.5)] cursor-pointer shrink-0"
          >
            ✕ FECHAR
          </button>
        </div>

        {/* High Score Table */}
        <div className="overflow-x-auto max-h-[60vh] overflow-y-auto pr-1">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/20 text-cyan-400 uppercase tracking-wider text-[11px]">
                <th className="p-2 text-center w-10">POS</th>
                <th className="p-2">JOGADOR</th>
                <th className="p-2 text-right">PONTOS</th>
                <th className="p-2 text-center">MODO</th>
              </tr>
            </thead>
            <tbody>
              {(Array.isArray(highScores) ? highScores : []).map((entry, idx) => {
                const isTop1 = idx === 0;
                const isTop3 = idx < 3;
                return (
                  <tr
                    key={entry.id || idx}
                    className={`border-b border-white/5 hover:bg-white/5 transition ${
                      isTop1
                        ? 'bg-[#ffd700]/10 text-[#ffd700] font-bold'
                        : isTop3
                        ? 'text-yellow-200'
                        : 'text-gray-300'
                    }`}
                  >
                    <td className="p-2 text-center font-black">
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                    </td>
                    <td className="p-2 font-black tracking-wider uppercase">
                      {entry.name}
                    </td>
                    <td className="p-2 text-right font-mono font-black text-sm tracking-wider glow-gold">
                      {entry.score.toLocaleString()}
                    </td>
                    <td className="p-2 text-center text-[10px] opacity-80 uppercase tracking-widest font-bold">
                      {entry.mode || 'ARCADE'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="mt-5 text-center text-[11px] text-purple-300/80 tracking-widest">
          "A PRESENÇA NÃO PODE SER PERDIDA, APENAS REGISTRADA."
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 py-3 bg-[#ffd700] text-black font-black text-xs md:text-sm rounded-sm hover:bg-yellow-300 transition shadow-[4px_4px_0_0_rgba(0,0,0,0.6)] cursor-pointer tracking-widest uppercase border-2 border-black"
        >
          VOLTAR (BACK)
        </button>
      </div>
    </div>
  );
};
