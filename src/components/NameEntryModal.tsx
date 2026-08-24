import React, { useState } from 'react';
import { saveHighScore, HighScoreEntry } from '../game/highScoreManager';

interface Props {
  score: number;
  presencePoints: number;
  mode: string;
  onSaved: (updatedHighScores: HighScoreEntry[]) => void;
  onSkip: () => void;
}

export const NameEntryModal: React.FC<Props> = ({
  score,
  presencePoints,
  mode,
  onSaved,
  onSkip
}) => {
  const [name, setName] = useState(() => {
    try {
      return localStorage.getItem('abidar_last_player_name') || 'THE DUDE';
    } catch {
      return 'THE DUDE';
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim().toUpperCase().substring(0, 12) || 'THE DUDE';
    try {
      localStorage.setItem('abidar_last_player_name', cleanName);
    } catch {
      // ignore
    }
    const updated = saveHighScore({
      name: cleanName,
      score,
      presencePoints,
      mode
    });
    onSaved(updated);
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[60] p-4 font-mono">
      <div className="bg-[#0b051b] border-2 border-[#ffd700] rounded-sm max-w-md w-full p-6 text-white shadow-[12px_12px_0_0_rgba(0,0,0,0.8)] relative text-center space-y-4">
        <div className="text-3xl animate-bounce">🏆✨</div>

        <h2 className="text-xl md:text-2xl font-black text-[#ffd700] tracking-widest uppercase glow-gold">
          NOVO RECORDE NO TOP 10!
        </h2>

        <p className="text-xs text-cyan-300 tracking-wider glow-cyan">
          Digite seu nome / iniciais para eternizar sua jornada no cosmos:
        </p>

        <div className="bg-black/60 p-4 rounded-sm border-2 border-white/10 text-left space-y-1.5 text-xs shadow-[4px_4px_0_0_rgba(0,0,0,0.5)]">
          <div className="flex justify-between">
            <span className="text-white/60">PONTUAÇÃO:</span>
            <span className="text-[#ffd700] font-black glow-gold text-sm">{score.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">PRESENÇA:</span>
            <span className="text-cyan-400 font-bold">{presencePoints.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">MODO:</span>
            <span className="text-white font-bold uppercase">{mode}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <label className="block text-[11px] text-purple-300 uppercase font-bold tracking-widest mb-1">
              NOME / INITIALS (MÁX 12):
            </label>
            <input
              type="text"
              maxLength={12}
              value={name}
              onChange={(e) => setName(e.target.value.toUpperCase())}
              placeholder="THE DUDE"
              autoFocus
              className="w-full bg-black border-2 border-[#ffd700] text-[#ffd700] text-center text-lg md:text-xl font-black py-2.5 rounded-sm tracking-widest focus:outline-none focus:ring-2 focus:ring-cyan-400 uppercase glow-gold"
            />
          </div>

          <div className="space-y-2">
            <button
              type="submit"
              className="w-full py-3 bg-[#ffd700] text-black font-black text-xs md:text-sm rounded-sm hover:bg-yellow-300 transition shadow-[4px_4px_0_0_rgba(0,0,0,0.6)] cursor-pointer tracking-widest uppercase border-2 border-black"
            >
              💾 SALVAR NO RANKING (SAVE)
            </button>
            <button
              type="button"
              onClick={onSkip}
              className="w-full py-2 bg-gray-900 text-gray-400 border border-white/10 font-bold text-xs rounded-sm hover:bg-gray-800 transition cursor-pointer"
            >
              PULAR (SKIP)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
