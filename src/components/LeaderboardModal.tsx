import React from 'react';
import { HighScoreEntry } from '../game/highScoreManager';

interface Props {
  highScores: HighScoreEntry[];
  onClose: () => void;
}

export const LeaderboardModal: React.FC<Props> = ({ highScores, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-[60] p-2 sm:p-4 font-mono">
      <div className="bg-[#0b051b] border-2 border-[#ffd700] rounded-sm max-w-lg w-full p-3 sm:p-5 text-white shadow-[10px_10px_0_0_rgba(0,0,0,0.8)] relative max-h-[92vh] flex flex-col">
        {/* Header Bar */}
        <div className="flex justify-between items-center mb-2 border-b-2 border-white/10 pb-2 gap-2 shrink-0">
          <h2 className="text-base sm:text-lg font-black text-[#ffd700] tracking-wider glow-gold flex-1 flex items-center gap-1.5">
            <span>🏆</span> TOP 10 RANKING / LEADERBOARD
          </h2>
          <button
            onClick={onClose}
            className="text-[#ffd700] hover:bg-[#ffd700] hover:text-black text-xs font-bold px-2.5 py-1 bg-black border-2 border-white/20 rounded-sm transition shadow-[3px_3px_0_0_rgba(0,0,0,0.5)] cursor-pointer shrink-0"
          >
            ✕ FECHAR
          </button>
        </div>

        {/* High Score Table */}
        <div className="overflow-x-auto flex-1 overflow-y-auto pr-1 scrollbar-none min-h-0">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/20 text-cyan-400 uppercase tracking-wider text-[10px] sm:text-[11px]">
                <th className="p-1.5 text-center w-8 sm:w-10">POS</th>
                <th className="p-1.5">JOGADOR</th>
                <th className="p-1.5 text-right">PONTOS</th>
                <th className="p-1.5 text-center">MODO</th>
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
                    <td className="p-1.5 text-center font-black text-xs">
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                    </td>
                    <td className="p-1.5 font-black tracking-wider uppercase text-xs">
                      {entry.name}
                    </td>
                    <td className="p-1.5 text-right font-mono font-black text-xs sm:text-sm tracking-wider glow-gold">
                      {entry.score.toLocaleString()}
                    </td>
                    <td className="p-1.5 text-center text-[9px] sm:text-[10px] opacity-80 uppercase tracking-widest font-bold">
                      {entry.mode || 'ARCADE'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer info & button */}
        <div className="mt-2 text-center shrink-0 space-y-1.5 pt-1">
          <p className="text-[10px] text-purple-300/80 tracking-widest hidden sm:block">
            "A PRESENÇA NÃO PODE SER PERDIDA, APENAS REGISTRADA."
          </p>
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-[#ffd700] text-black font-black text-xs sm:text-sm rounded-sm hover:bg-yellow-300 transition shadow-[4px_4px_0_0_rgba(0,0,0,0.6)] cursor-pointer tracking-widest uppercase border-2 border-black"
          >
            VOLTAR (BACK)
          </button>
        </div>
      </div>
    </div>
  );
};
