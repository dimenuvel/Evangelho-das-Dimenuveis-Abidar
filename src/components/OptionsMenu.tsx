import React from 'react';
import { GameSettings } from '../game/types';
import { soundEngine } from '../audio/soundEngine';

interface Props {
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onClose: () => void;
}

export const OptionsMenu: React.FC<Props> = ({ settings, onUpdateSettings, onClose }) => {
  const handleSoundToggle = () => {
    soundEngine.playUiClick();
    const updated = { ...settings, soundEnabled: !settings.soundEnabled };
    soundEngine.setMuted(!updated.soundEnabled);
    onUpdateSettings(updated);
  };

  const handleMusicVol = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    const updated = { ...settings, musicVolume: val };
    soundEngine.setMusicVolume(val);
    onUpdateSettings(updated);
  };

  const handleSfxVol = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    const updated = { ...settings, sfxVolume: val };
    soundEngine.setSfxVolume(val);
    onUpdateSettings(updated);
  };

  const handleScanlineToggle = () => {
    soundEngine.playUiClick();
    const updated = { ...settings, scanlinesEnabled: !settings.scanlinesEnabled };
    onUpdateSettings(updated);
  };

  const handleClose = () => {
    soundEngine.playUiClick();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-[#0b051b] border-2 border-[#ffd700] rounded-sm max-w-md w-full p-6 text-white shadow-[10px_10px_0_0_rgba(0,0,0,0.8)] relative font-mono">
        {/* Header Bar with flex layout so close button never overlaps title or content */}
        <div className="flex justify-between items-center mb-6 border-b-2 border-white/10 pb-3 gap-3">
          <h2 className="text-lg md:text-xl font-black text-[#ffd700] tracking-wider glow-gold flex-1">
            ⚙️ OPÇÕES / OPTIONS
          </h2>
          <button
            onClick={handleClose}
            className="text-[#ffd700] hover:bg-[#ffd700] hover:text-black text-xs md:text-sm font-bold px-3 py-1.5 bg-black border-2 border-white/20 rounded-sm transition shadow-[3px_3px_0_0_rgba(0,0,0,0.5)] cursor-pointer shrink-0"
          >
            ✕ FECHAR
          </button>
        </div>

        <div className="space-y-4">
          {/* Audio Master Toggle */}
          <div className="flex items-center justify-between bg-black/60 p-4 rounded-sm border-2 border-white/10 shadow-[4px_4px_0_0_rgba(0,0,0,0.5)]">
            <span className="font-bold text-cyan-400 text-xs md:text-sm tracking-wider glow-cyan">🔊 ÁUDIO / SOUND:</span>
            <button
              onClick={handleSoundToggle}
              className={`px-4 py-1.5 rounded-sm font-bold transition text-xs shadow-[3px_3px_0_0_rgba(0,0,0,0.5)] border-2 ${
                settings.soundEnabled
                  ? 'bg-[#ffd700] text-black border-black hover:bg-yellow-300'
                  : 'bg-gray-800 text-gray-400 border-white/10 hover:bg-gray-700'
              }`}
            >
              {settings.soundEnabled ? 'LIGADO (ON)' : 'MUTADO (MUTED)'}
            </button>
          </div>

          {/* Music Volume */}
          <div className="bg-black/60 p-4 rounded-sm border-2 border-white/10 shadow-[4px_4px_0_0_rgba(0,0,0,0.5)] space-y-2">
            <div className="flex justify-between text-xs font-bold text-purple-200 tracking-wider">
              <span>🎵 MÚSICA DEF / MUSIC VOLUME:</span>
              <span className="text-[#ffd700] glow-gold">{Math.round(settings.musicVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.musicVolume}
              onChange={handleMusicVol}
              className="w-full accent-[#ffd700] cursor-pointer"
            />
          </div>

          {/* SFX Volume */}
          <div className="bg-black/60 p-4 rounded-sm border-2 border-white/10 shadow-[4px_4px_0_0_rgba(0,0,0,0.5)] space-y-2">
            <div className="flex justify-between text-xs font-bold text-purple-200 tracking-wider">
              <span>🔔 EFEITOS SFX / SFX VOLUME:</span>
              <span className="text-[#ffd700] glow-gold">{Math.round(settings.sfxVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.sfxVolume}
              onChange={handleSfxVol}
              className="w-full accent-[#ffd700] cursor-pointer"
            />
          </div>

          {/* CRT Scanlines Filter */}
          <div className="flex items-center justify-between bg-black/60 p-4 rounded-sm border-2 border-white/10 shadow-[4px_4px_0_0_rgba(0,0,0,0.5)]">
            <span className="font-bold text-cyan-400 text-xs md:text-sm tracking-wider glow-cyan">📺 CRT SCANLINES (16-BIT):</span>
            <button
              onClick={handleScanlineToggle}
              className={`px-4 py-1.5 rounded-sm font-bold transition text-xs shadow-[3px_3px_0_0_rgba(0,0,0,0.5)] border-2 ${
                settings.scanlinesEnabled
                  ? 'bg-[#ffd700] text-black border-black hover:bg-yellow-300'
                  : 'bg-gray-800 text-gray-400 border-white/10 hover:bg-gray-700'
              }`}
            >
              {settings.scanlinesEnabled ? 'ATIVADO' : 'DESATIVADO'}
            </button>
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={handleClose}
            className="w-full py-3 bg-[#ffd700] text-black font-black rounded-sm hover:bg-yellow-300 shadow-[6px_6px_0_0_rgba(0,0,0,0.6)] cursor-pointer transition text-sm tracking-widest uppercase border-2 border-black"
          >
            SALVAR E FECHAR (SAVE)
          </button>
        </div>
      </div>
    </div>
  );
};
