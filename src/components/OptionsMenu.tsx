import React, { useState } from 'react';
import { GameSettings, DifficultySetting } from '../game/types';
import { soundEngine } from '../audio/soundEngine';
import { unlockAllStages } from '../game/stageUnlockManager';

interface Props {
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onClose: () => void;
}

interface PopupModalInfo {
  title: string;
  message: string;
  isError?: boolean;
}

const CHEAT_DEFINITIONS: Record<
  string,
  {
    name: string;
    icon: string;
    title: string;
    message: string;
    onActivate?: () => void;
  }
> = {
  ABRACADABRA: {
    name: 'ABRACADABRA',
    icon: '🔓',
    title: '🔓 TRAPAÇA ATIVADA: ABRACADABRA',
    message: 'Todas as 5 fases foram desbloqueadas com sucesso! Você pode jogar qualquer fase no Menu Principal. (All stages unlocked!)',
    onActivate: () => unlockAllStages()
  },
  IAMTHEMONAD: {
    name: 'IAMTHEMONAD',
    icon: '👑',
    title: '👑 TRAPAÇA ATIVADA: IAMTHEMONAD',
    message: 'MODO DEUS / INVENCIBILIDADE ATIVADO! Abidar não sofrerá dano de obstáculos e rebaterá do abismo sem perder vidas! (God Mode Active!)'
  },
  MOTHERGAIA: {
    name: 'MOTHERGAIA',
    icon: '🌿',
    title: '🌿 TRAPAÇA ATIVADA: MOTHERGAIA',
    message: 'PODER DA TERRA PERMANENTE! Abidar possui imã magnético infinito de colecionáveis e aura de Terra. (Permanent Earth Magnet Active!)'
  },
  IHEARTYOU: {
    name: 'IHEARTYOU',
    icon: '❤️',
    title: '❤️ TRAPAÇA ATIVADA: IHEARTYOU',
    message: 'CORAÇÃO DE EMERGÊNCIA! Sempre que Abidar estiver com apenas 1 vida restante, um Coração Colecionável surgirá na tela! (Emergency Heart Spawn Active!)'
  }
};

export const OptionsMenu: React.FC<Props> = ({ settings, onUpdateSettings, onClose }) => {
  const currentDiff: DifficultySetting = settings.difficulty || 'normal';
  const activeCheats = settings.activeCheats || [];

  const [cheatInput, setCheatInput] = useState('');
  const [popupModal, setPopupModal] = useState<PopupModalInfo | null>(null);

  const handleDifficultyChange = (diff: DifficultySetting) => {
    soundEngine.playUiClick();
    const updated = { ...settings, difficulty: diff };
    onUpdateSettings(updated);
  };

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

  const handleCheatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = cheatInput.trim().toUpperCase();
    if (!cleanCode) return;

    const cheatDef = CHEAT_DEFINITIONS[cleanCode];

    if (!cheatDef) {
      soundEngine.playHitSound();
      setPopupModal({
        title: '❌ CÓDIGO INVÁLIDO / INVALID CODE',
        message: `O código "${cleanCode}" é inválido ou não existe.`,
        isError: true
      });
      return;
    }

    if (activeCheats.includes(cleanCode)) {
      soundEngine.playUiClick();
      setPopupModal({
        title: '⚠️ CÓDIGO JÁ ATIVADO / ALREADY ACTIVE',
        message: `A trapaça "${cleanCode}" já está ativa no seu jogo!`,
        isError: false
      });
      return;
    }

    // Execute special action if needed (e.g. unlock all stages)
    if (cheatDef.onActivate) {
      cheatDef.onActivate();
    }

    soundEngine.playSpiralActivationSound();

    const updatedCheats = [...activeCheats, cleanCode];
    const updatedSettings = { ...settings, activeCheats: updatedCheats };
    onUpdateSettings(updatedSettings);

    setCheatInput('');
    setPopupModal({
      title: cheatDef.title,
      message: cheatDef.message,
      isError: false
    });
  };

  const handleRemoveCheat = (codeToRemove: string) => {
    soundEngine.playUiClick();
    const updatedCheats = activeCheats.filter((c) => c !== codeToRemove);
    onUpdateSettings({ ...settings, activeCheats: updatedCheats });
  };

  const handleClose = () => {
    soundEngine.playUiClick();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
      <div className="bg-[#0b051b] border-2 border-[#ffd700] rounded-sm max-w-md w-full p-3 sm:p-5 text-white shadow-[10px_10px_0_0_rgba(0,0,0,0.8)] relative font-mono max-h-[92vh] flex flex-col">
        {/* Header Bar */}
        <div className="flex justify-between items-center mb-3 border-b-2 border-white/10 pb-2 gap-2 shrink-0">
          <h2 className="text-base sm:text-lg font-black text-[#ffd700] tracking-wider glow-gold flex-1">
            ⚙️ OPÇÕES / OPTIONS
          </h2>
          <button
            onClick={handleClose}
            className="text-[#ffd700] hover:bg-[#ffd700] hover:text-black text-xs font-bold px-2.5 py-1 bg-black border-2 border-white/20 rounded-sm transition shadow-[3px_3px_0_0_rgba(0,0,0,0.5)] cursor-pointer shrink-0"
          >
            ✕ FECHAR
          </button>
        </div>

        <div className="space-y-3 overflow-y-auto flex-1 pr-1 scrollbar-none">
          {/* Cheat Code Insertion Field */}
          <div className="bg-gradient-to-r from-purple-950/80 to-indigo-950/80 p-3 rounded-sm border-2 border-[#ffd700]/50 shadow-[4px_4px_0_0_rgba(0,0,0,0.5)] space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-black text-[#ffd700] tracking-wider glow-gold flex items-center gap-1">
                👾 TRAPAÇAS / CHEAT CODES:
              </span>
              <span className="text-[10px] text-cyan-300 font-bold">INSIRA E CONFIRME</span>
            </div>

            <form onSubmit={handleCheatSubmit} className="flex gap-1.5">
              <input
                type="text"
                value={cheatInput}
                onChange={(e) => setCheatInput(e.target.value.toUpperCase())}
                placeholder="DIGITE O CÓDIGO / ENTER CODE..."
                className="flex-1 bg-black/80 border-2 border-white/20 focus:border-[#ffd700] text-xs font-black tracking-widest text-cyan-300 px-2.5 py-1.5 rounded-sm outline-none placeholder:text-gray-600 placeholder:font-normal placeholder:tracking-normal"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-[#ffd700] text-black font-black text-xs rounded-sm hover:bg-yellow-300 transition shadow-[2px_2px_0_0_rgba(0,0,0,0.5)] border border-black cursor-pointer uppercase shrink-0"
              >
                ATIVAR
              </button>
            </form>

            {/* List Active Cheats if any */}
            {activeCheats.length > 0 && (
              <div className="pt-1.5 border-t border-white/10 space-y-1">
                <div className="text-[10px] text-gray-400 font-bold tracking-wider">TRAPAÇAS ATIVAS:</div>
                <div className="flex flex-wrap gap-1.5">
                  {activeCheats.map((code) => {
                    const def = CHEAT_DEFINITIONS[code];
                    return (
                      <span
                        key={code}
                        className="inline-flex items-center gap-1 bg-purple-900/90 text-[#ffd700] border border-[#ffd700]/60 px-2 py-0.5 rounded-sm text-[10px] font-bold shadow-[1px_1px_0_0_rgba(0,0,0,0.5)]"
                      >
                        <span>{def?.icon || '⚡'} {code}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveCheat(code)}
                          title="Desativar trapaça"
                          className="hover:text-red-400 text-gray-400 font-black ml-1 cursor-pointer"
                        >
                          ✕
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Difficulty Setting */}
          <div className="bg-black/60 p-2.5 sm:p-3 rounded-sm border-2 border-white/10 shadow-[4px_4px_0_0_rgba(0,0,0,0.5)] space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-cyan-400 tracking-wider glow-cyan">❤️ DIFICULDADE / DIFFICULTY:</span>
              <span className="text-[#ffd700] font-black glow-gold uppercase">
                {currentDiff === 'easy' ? 'FÁCIL (5 ❤️)' : currentDiff === 'hard' ? 'DIFÍCIL (2 ❤️)' : 'NORMAL (3 ❤️)'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => handleDifficultyChange('easy')}
                className={`py-1.5 px-1 rounded-sm font-bold text-[11px] transition shadow-[2px_2px_0_0_rgba(0,0,0,0.5)] border-2 cursor-pointer ${
                  currentDiff === 'easy'
                    ? 'bg-green-500 text-black border-black font-black'
                    : 'bg-gray-800 text-gray-300 border-white/10 hover:bg-gray-700'
                }`}
              >
                <div>FÁCIL</div>
                <div className="text-[10px] opacity-80">5 Corações</div>
              </button>
              <button
                type="button"
                onClick={() => handleDifficultyChange('normal')}
                className={`py-1.5 px-1 rounded-sm font-bold text-[11px] transition shadow-[2px_2px_0_0_rgba(0,0,0,0.5)] border-2 cursor-pointer ${
                  currentDiff === 'normal'
                    ? 'bg-[#ffd700] text-black border-black font-black'
                    : 'bg-gray-800 text-gray-300 border-white/10 hover:bg-gray-700'
                }`}
              >
                <div>NORMAL</div>
                <div className="text-[10px] opacity-80">3 Corações</div>
              </button>
              <button
                type="button"
                onClick={() => handleDifficultyChange('hard')}
                className={`py-1.5 px-1 rounded-sm font-bold text-[11px] transition shadow-[2px_2px_0_0_rgba(0,0,0,0.5)] border-2 cursor-pointer ${
                  currentDiff === 'hard'
                    ? 'bg-red-500 text-black border-black font-black'
                    : 'bg-gray-800 text-gray-300 border-white/10 hover:bg-gray-700'
                }`}
              >
                <div>DIFÍCIL</div>
                <div className="text-[10px] opacity-80">2 Corações</div>
              </button>
            </div>
          </div>

          {/* Audio Master Toggle */}
          <div className="flex items-center justify-between bg-black/60 p-2.5 sm:p-3 rounded-sm border-2 border-white/10 shadow-[4px_4px_0_0_rgba(0,0,0,0.5)]">
            <span className="font-bold text-cyan-400 text-xs tracking-wider glow-cyan">🔊 ÁUDIO / SOUND:</span>
            <button
              onClick={handleSoundToggle}
              className={`px-3 py-1 rounded-sm font-bold transition text-xs shadow-[3px_3px_0_0_rgba(0,0,0,0.5)] border-2 cursor-pointer ${
                settings.soundEnabled
                  ? 'bg-[#ffd700] text-black border-black hover:bg-yellow-300'
                  : 'bg-gray-800 text-gray-400 border-white/10 hover:bg-gray-700'
              }`}
            >
              {settings.soundEnabled ? 'LIGADO (ON)' : 'MUTADO'}
            </button>
          </div>

          {/* Music Volume */}
          <div className="bg-black/60 p-2.5 sm:p-3 rounded-sm border-2 border-white/10 shadow-[4px_4px_0_0_rgba(0,0,0,0.5)] space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-purple-200 tracking-wider">
              <span>🎵 MÚSICA / MUSIC:</span>
              <span className="text-[#ffd700] glow-gold">{Math.round(settings.musicVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.musicVolume}
              onChange={handleMusicVol}
              className="w-full accent-[#ffd700] cursor-pointer h-2"
            />
          </div>

          {/* SFX Volume */}
          <div className="bg-black/60 p-2.5 sm:p-3 rounded-sm border-2 border-white/10 shadow-[4px_4px_0_0_rgba(0,0,0,0.5)] space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-purple-200 tracking-wider">
              <span>🔔 EFEITOS / SFX:</span>
              <span className="text-[#ffd700] glow-gold">{Math.round(settings.sfxVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.sfxVolume}
              onChange={handleSfxVol}
              className="w-full accent-[#ffd700] cursor-pointer h-2"
            />
          </div>

          {/* CRT Scanlines Filter */}
          <div className="flex items-center justify-between bg-black/60 p-2.5 sm:p-3 rounded-sm border-2 border-white/10 shadow-[4px_4px_0_0_rgba(0,0,0,0.5)]">
            <span className="font-bold text-cyan-400 text-xs tracking-wider glow-cyan">📺 CRT SCANLINES:</span>
            <button
              onClick={handleScanlineToggle}
              className={`px-3 py-1 rounded-sm font-bold transition text-xs shadow-[3px_3px_0_0_rgba(0,0,0,0.5)] border-2 cursor-pointer ${
                settings.scanlinesEnabled
                  ? 'bg-[#ffd700] text-black border-black hover:bg-yellow-300'
                  : 'bg-gray-800 text-gray-400 border-white/10 hover:bg-gray-700'
              }`}
            >
              {settings.scanlinesEnabled ? 'ATIVADO' : 'DESATIVADO'}
            </button>
          </div>
        </div>

        <div className="mt-3 pt-1 shrink-0">
          <button
            onClick={handleClose}
            className="w-full py-2.5 bg-[#ffd700] text-black font-black rounded-sm hover:bg-yellow-300 shadow-[4px_4px_0_0_rgba(0,0,0,0.6)] cursor-pointer transition text-xs sm:text-sm tracking-widest uppercase border-2 border-black"
          >
            SALVAR E FECHAR (SAVE)
          </button>
        </div>
      </div>

      {/* Pop-up Modal when Cheat Code is inserted & confirmed */}
      {popupModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-[70] p-4">
          <div className="bg-[#190833] border-4 border-[#ffd700] p-4 sm:p-6 rounded-sm max-w-sm w-full shadow-[12px_12px_0_0_rgba(0,0,0,0.9)] text-center space-y-4 font-mono">
            <div
              className={`text-sm sm:text-base font-black uppercase border-b-2 border-white/20 pb-2 ${
                popupModal.isError ? 'text-red-400 glow-red' : 'text-[#ffd700] glow-gold'
              }`}
            >
              {popupModal.title}
            </div>

            <p className="text-xs sm:text-sm text-cyan-100 leading-relaxed font-semibold">
              {popupModal.message}
            </p>

            <button
              onClick={() => {
                soundEngine.playUiClick();
                setPopupModal(null);
              }}
              className="px-6 py-2 bg-[#ffd700] text-black font-black text-xs uppercase rounded-sm border-2 border-black hover:bg-yellow-300 transition cursor-pointer shadow-[3px_3px_0_0_rgba(0,0,0,0.5)]"
            >
              ENTENDIDO (OK)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
