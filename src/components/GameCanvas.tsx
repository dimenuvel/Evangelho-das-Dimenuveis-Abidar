import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { GameEngine, STAGES } from '../game/gameEngine';
import { GameSettings } from '../game/types';
import { soundEngine } from '../audio/soundEngine';
import { NameEntryModal } from './NameEntryModal';
import { LeaderboardModal } from './LeaderboardModal';
import { getHighScores, isHighScore, HighScoreEntry } from '../game/highScoreManager';
import ParodyCreditsModal from './ParodyCreditsModal';

interface Props {
  stageIndex: number;
  isInfiniteMode?: boolean;
  settings: GameSettings;
  onReturnToMenu: () => void;
  onUpdateSettings: (newSettings: GameSettings) => void;
}

export const GameCanvas: React.FC<Props> = ({
  stageIndex,
  isInfiniteMode = false,
  settings,
  onReturnToMenu,
  onUpdateSettings
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<GameEngine | null>(null);

  const [isPaused, setIsPaused] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isStageClear, setIsStageClear] = useState(false);
  const [isVictory, setIsVictory] = useState(false);

  const [score, setScore] = useState(0);
  const [presencePoints, setPresencePoints] = useState(0);
  const [pinsCount, setPinsCount] = useState(0);
  const [coffeesCount, setCoffeesCount] = useState(0);
  const [isAbiding, setIsAbiding] = useState(false);

  const [showNameEntry, setShowNameEntry] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showCredits, setShowCredits] = useState(false);
  const [highScoresList, setHighScoresList] = useState<HighScoreEntry[]>(getHighScores);
  const [hasPromptedName, setHasPromptedName] = useState(false);

  const hasFiredConfettiRef = useRef(false);

  const triggerConfettiThreeTimes = () => {
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    setTimeout(() => {
      confetti({ particleCount: 60, spread: 80, origin: { y: 0.5 } });
    }, 250);
    setTimeout(() => {
      confetti({ particleCount: 100, spread: 90, origin: { y: 0.6 } });
    }, 500);
  };

  // Initialize Game Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    hasFiredConfettiRef.current = false;
    const engine = new GameEngine(canvas);
    engineRef.current = engine;
    engine.settings = settings;

    engine.startNewGame(stageIndex, isInfiniteMode);

    // Sync state loop to React
    const syncInterval = setInterval(() => {
      if (engine) {
        setIsPaused(engine.isPaused);
        setIsGameOver(engine.isGameOver);
        setIsStageClear(engine.isStageClear);
        setIsVictory(engine.isVictory);

        if (engine.player) {
          setScore(engine.player.score);
          setPresencePoints(engine.player.presencePoints);
          setPinsCount(engine.player.pinsCollected);
          setCoffeesCount(engine.player.coffeesDrunk);
          setIsAbiding(engine.player.isAbiding);
        }

        if ((engine.isStageClear || engine.isVictory) && !hasFiredConfettiRef.current) {
          hasFiredConfettiRef.current = true;
          triggerConfettiThreeTimes();
        }
      }
    }, 200);

    return () => {
      clearInterval(syncInterval);
      engine.destroy();
    };
  }, [stageIndex, isInfiniteMode]);

  const handleOpenLeaderboardOrNameEntry = () => {
    soundEngine.playUiClick();
    if (!hasPromptedName && score > 0 && isHighScore(score)) {
      setShowNameEntry(true);
    } else {
      setShowLeaderboard(true);
    }
  };

  // Keyboard Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const engine = engineRef.current;
      if (!engine) return;

      if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        const nextPaused = !engine.isPaused;
        engine.setPaused(nextPaused);
        setIsPaused(nextPaused);
      } else if (!e.repeat) {
        // Any key press lifts player
        engine.setInputLift(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const engine = engineRef.current;
      if (!engine) return;

      if (e.key !== 'Escape' && e.key !== 'p' && e.key !== 'P') {
        engine.setInputLift(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Touch & Pointer Handlers for tap-to-rise / release-to-fall
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) return;
    if (isPaused || isGameOver || isStageClear || isVictory) return;
    if (engineRef.current) {
      engineRef.current.setInputLift(true);
    }
  };

  const handlePointerUp = () => {
    if (engineRef.current) {
      engineRef.current.setInputLift(false);
    }
  };

  const handleRestart = () => {
    soundEngine.playUiClick();
    hasFiredConfettiRef.current = false;
    setHasPromptedName(false);
    setShowNameEntry(false);
    setShowLeaderboard(false);
    setIsPaused(false);
    setIsGameOver(false);
    setIsStageClear(false);
    setIsVictory(false);
    if (engineRef.current) {
      engineRef.current.startNewGame(stageIndex, isInfiniteMode);
    }
  };

  const handleNextStage = () => {
    soundEngine.playUiClick();
    hasFiredConfettiRef.current = false;
    if (engineRef.current) {
      engineRef.current.nextStage();
    }
  };

  const handleTogglePause = () => {
    soundEngine.playUiClick();
    if (engineRef.current) {
      const nextP = !engineRef.current.isPaused;
      engineRef.current.setPaused(nextP);
      setIsPaused(nextP);
    }
  };

  return (
    <div
      className="relative w-full h-screen bg-black overflow-hidden flex flex-col items-center justify-center select-none font-mono cursor-pointer touch-none"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* Game Canvas Container */}
      <div className="relative w-full max-w-[100vw] max-h-[100vh] aspect-video flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={800}
          height={450}
          className="w-full h-full object-contain bg-[#0a0518] rounded-lg shadow-2xl"
          style={{ imageRendering: 'pixelated' }}
        />

        {/* On-screen Pause & Controls Bar */}
        <div className="absolute top-1.5 right-1.5 sm:top-3 sm:right-3 z-30 flex items-center gap-2">
          <button
            onClick={handleTogglePause}
            className="px-2 py-1 sm:px-3 sm:py-1.5 bg-black/85 border-2 border-white/20 hover:bg-[#ffd700] hover:text-black text-[#ffd700] font-black rounded-sm text-[10px] sm:text-xs cursor-pointer shadow-[3px_3px_0_0_rgba(0,0,0,0.6)] transition whitespace-nowrap"
            title="Pausar o jogo"
          >
            {isPaused ? '▶ CONTINUAR' : '⏸ PAUSAR'}
          </button>
        </div>

        {/* On-Screen Dedicated ABIDE Button */}
        {!isPaused && !isGameOver && !isStageClear && !isVictory && (
          <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 z-40 pointer-events-auto">
            <button
              onPointerDown={(e) => {
                e.stopPropagation();
                e.preventDefault();
                if (engineRef.current) engineRef.current.setHovering(true);
              }}
              onPointerUp={(e) => {
                e.stopPropagation();
                e.preventDefault();
                if (engineRef.current) engineRef.current.setHovering(false);
              }}
              onPointerLeave={(e) => {
                e.stopPropagation();
                e.preventDefault();
                if (engineRef.current) engineRef.current.setHovering(false);
              }}
              onTouchStart={(e) => {
                e.stopPropagation();
                e.preventDefault();
                if (engineRef.current) engineRef.current.setHovering(true);
              }}
              onTouchEnd={(e) => {
                e.stopPropagation();
                e.preventDefault();
                if (engineRef.current) engineRef.current.setHovering(false);
              }}
              className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-sm border-2 font-black text-xs sm:text-xs tracking-wider shadow-[3px_3px_0_0_rgba(0,0,0,0.8)] transition active:scale-95 flex items-center gap-1 select-none cursor-pointer ${
                isAbiding
                  ? 'bg-[#ffd700] text-black border-yellow-300 animate-pulse glow-gold shadow-[0_0_15px_rgba(255,215,0,0.9)]'
                  : 'bg-black/85 text-[#ffd700] border-[#ffd700] hover:bg-[#ffd700] hover:text-black backdrop-blur-md'
              }`}
              title="Pairar e meditar para acumular Presença"
            >
              <span>🧘</span>
              <span>Abidar</span>
            </button>
          </div>
        )}
      </div>

      {/* --- PAUSE MODAL --- */}
      {isPaused && !isGameOver && !isStageClear && !isVictory && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-2 sm:p-4 font-mono">
          <div className="bg-[#0b051b] border-2 border-[#ffd700] rounded-sm max-w-sm w-full p-3.5 sm:p-5 text-white shadow-[10px_10px_0_0_rgba(0,0,0,0.8)] text-center space-y-2.5 sm:space-y-3 max-h-[92vh] overflow-y-auto scrollbar-none">
            <h2 className="text-lg sm:text-2xl font-black text-[#ffd700] tracking-widest glow-gold">⏸ JOGO PAUSADO</h2>
            <p className="text-cyan-300 text-[11px] sm:text-xs tracking-wider glow-cyan">Respire fundo. Apenas abide.</p>

            <div className="space-y-2 pt-1">
              <button
                onClick={handleTogglePause}
                className="w-full py-2.5 bg-[#ffd700] text-black font-black rounded-sm hover:bg-yellow-300 transition shadow-[4px_4px_0_0_rgba(0,0,0,0.6)] cursor-pointer tracking-wider border-2 border-black text-xs sm:text-sm"
              >
                ▶ CONTINUAR (RESUME)
              </button>
              <button
                onClick={handleRestart}
                className="w-full py-2 bg-black/80 border-2 border-white/20 text-cyan-300 font-bold rounded-sm hover:bg-gray-900 transition cursor-pointer text-xs shadow-[4px_4px_0_0_rgba(0,0,0,0.5)]"
              >
                🔄 REINICIAR FASE
              </button>
              <button
                onClick={onReturnToMenu}
                className="w-full py-2 bg-gray-900 text-gray-400 border border-white/10 font-bold rounded-sm hover:bg-gray-800 transition cursor-pointer text-xs shadow-[4px_4px_0_0_rgba(0,0,0,0.5)]"
              >
                🏠 MENU PRINCIPAL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- STAGE CLEAR MODAL --- */}
      {isStageClear && !isVictory && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-2 sm:p-4 font-mono">
          <div className="bg-[#0b051b] border-2 border-[#ffd700] rounded-sm max-w-md w-full p-3.5 sm:p-5 text-white shadow-[10px_10px_0_0_rgba(0,0,0,0.8)] text-center space-y-2.5 sm:space-y-3 max-h-[92vh] overflow-y-auto scrollbar-none">
            <div className="text-2xl sm:text-3xl">✨🌌✨</div>
            <h2 className="text-lg sm:text-2xl font-black text-[#ffd700] tracking-widest uppercase glow-gold">
              FASE CONCLUÍDA!
            </h2>
            <p className="text-purple-200 text-[11px] sm:text-xs">
              Você manteve a presença e atravessou {STAGES[stageIndex].title}.
            </p>

            <div className="bg-black/60 p-2.5 sm:p-3.5 rounded-sm border-2 border-white/10 text-left space-y-1.5 text-xs shadow-[4px_4px_0_0_rgba(0,0,0,0.5)]">
              <div className="flex justify-between">
                <span className="text-white/60">PONTUAÇÃO:</span>
                <span className="text-[#ffd700] font-black glow-gold">{score}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">PONTOS DE PRESENÇA:</span>
                <span className="text-cyan-400 font-black glow-cyan">{presencePoints}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">PINOS COLETADOS:</span>
                <span className="text-[#ffd700] font-bold">{pinsCount}</span>
              </div>
            </div>

            <button
              onClick={handleNextStage}
              className="w-full py-2.5 sm:py-3 bg-[#ffd700] text-black font-black text-xs sm:text-sm rounded-sm hover:bg-yellow-300 transition cursor-pointer uppercase shadow-[6px_6px_0_0_rgba(0,0,0,0.6)] border-2 border-black tracking-widest"
            >
              PRÓXIMA FASE (NEXT STAGE) ▶
            </button>
          </div>
        </div>
      )}

      {/* --- GAME OVER MODAL --- */}
      {isGameOver && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-2 sm:p-4 font-mono">
          <div className="bg-[#1c0512] border-2 border-red-500 rounded-sm max-w-md w-full p-3.5 sm:p-5 text-white shadow-[10px_10px_0_0_rgba(0,0,0,0.8)] text-center space-y-2.5 sm:space-y-3 max-h-[92vh] overflow-y-auto scrollbar-none">
            <div className="text-2xl sm:text-3xl">🧘‍♂️💀</div>
            <h2 className="text-lg sm:text-2xl font-black text-red-500 tracking-widest uppercase glow-red">
              SUA ENERGIA SE DISSIPOU
            </h2>
            <p className="text-purple-200 text-[11px] sm:text-xs">
              Não faz mal. O universo é paciente. Tente novamente e mantenha o Abide.
            </p>

            {score > 0 && isHighScore(score) && !hasPromptedName && (
              <div className="bg-yellow-500/20 border-2 border-[#ffd700] p-2 rounded-sm text-[#ffd700] text-[11px] sm:text-xs font-bold animate-pulse text-center glow-gold">
                🎉 PARABÉNS! NOVO RECORDE NO TOP 10!
              </div>
            )}

            <div className="bg-black/60 p-2.5 sm:p-3.5 rounded-sm border-2 border-white/10 text-left space-y-1.5 text-xs shadow-[4px_4px_0_0_rgba(0,0,0,0.5)]">
              <div className="flex justify-between">
                <span className="text-white/60">PONTOS FINAIS:</span>
                <span className="text-[#ffd700] font-black glow-gold">{score}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">PRESENÇA:</span>
                <span className="text-cyan-400 font-black glow-cyan">{presencePoints}</span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <button
                onClick={handleRestart}
                className="w-full py-2.5 sm:py-3 bg-red-600 text-white font-black text-xs sm:text-sm rounded-sm hover:bg-red-500 transition cursor-pointer uppercase shadow-[6px_6px_0_0_rgba(0,0,0,0.6)] border-2 border-black tracking-widest"
              >
                🔄 TENTAR NOVAMENTE (RETRY)
              </button>
              <button
                onClick={handleOpenLeaderboardOrNameEntry}
                className="w-full py-2 bg-black border-2 border-[#ffd700] text-[#ffd700] font-black text-[11px] sm:text-xs rounded-sm hover:bg-[#ffd700] hover:text-black transition cursor-pointer tracking-widest shadow-[4px_4px_0_0_rgba(0,0,0,0.5)]"
              >
                {isHighScore(score) && !hasPromptedName ? '🏆 REGISTRAR RECORDE NO TOP 10' : '🏆 VER TOP 10 RANKING'}
              </button>
              <button
                onClick={onReturnToMenu}
                className="w-full py-1.5 bg-gray-900 text-gray-400 border border-white/10 font-bold rounded-sm hover:bg-gray-800 transition cursor-pointer text-xs shadow-[4px_4px_0_0_rgba(0,0,0,0.5)]"
              >
                🏠 MENU PRINCIPAL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- VICTORY / FINAL VOID ENTRY ENDING --- */}
      {isVictory && (
        <div className="fixed inset-0 bg-[#050515] flex items-center justify-center z-50 p-2 sm:p-4 text-center font-mono">
          <div className="max-w-xl w-full bg-black/85 border-2 border-[#ffd700] rounded-sm p-4 sm:p-6 text-white shadow-[12px_12px_0_0_rgba(0,0,0,0.8)] space-y-3 sm:space-y-4 relative z-10 max-h-[92vh] overflow-y-auto scrollbar-none">
            <div className="text-3xl sm:text-4xl animate-bounce">🧘‍♂️🌌✨</div>

            <h1 className="text-2xl sm:text-4xl font-black text-[#ffd700] tracking-widest glow-gold uppercase">
              ENTREU NO VAZIO!
            </h1>

            <p className="text-xs sm:text-sm font-bold text-cyan-300 tracking-wider glow-cyan">
              O Cara absorveu a energia dos power-ups e adentrou o Vazio Primordial em paz absoluta.
            </p>

            <p className="text-[11px] sm:text-xs text-purple-300 italic">
              "YOU WERE NEVER GOING ANYWHERE. ABIDE."
            </p>

            {score > 0 && isHighScore(score) && !hasPromptedName && (
              <div className="bg-yellow-500/20 border-2 border-[#ffd700] p-2 rounded-sm text-[#ffd700] text-[11px] sm:text-xs font-bold animate-pulse text-center glow-gold">
                🎉 PARABÉNS! NOVO RECORDE NO TOP 10!
              </div>
            )}

            <div className="bg-black/80 p-3 sm:p-4 rounded-sm border-2 border-white/10 text-left space-y-1.5 text-xs shadow-[4px_4px_0_0_rgba(0,0,0,0.5)]">
              <div className="flex justify-between">
                <span className="text-white/60">PONTUAÇÃO TOTAL:</span>
                <span className="text-[#ffd700] font-black glow-gold">{score}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">PONTOS DE PRESENÇA TOTAL:</span>
                <span className="text-cyan-400 font-black glow-cyan">{presencePoints}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">CAFÉS CONSUMIDOS:</span>
                <span className="text-[#ffd700] font-bold">{coffeesCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">PINOS COLETADOS:</span>
                <span className="text-[#ffd700] font-bold">{pinsCount}</span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <button
                onClick={() => {
                  soundEngine.playUiClick();
                  setShowCredits(true);
                }}
                className="w-full py-3 bg-[#ffd700] text-black font-black text-xs sm:text-sm rounded-sm hover:bg-yellow-300 transition cursor-pointer uppercase shadow-[6px_6px_0_0_rgba(0,0,0,0.6)] border-2 border-black tracking-widest glow-gold animate-pulse flex items-center justify-center gap-2"
              >
                <span>🎬</span>
                <span>VER CRÉDITOS DO COSMOS (ROLL CREDITS)</span>
              </button>
              <button
                onClick={handleOpenLeaderboardOrNameEntry}
                className="w-full py-2 bg-black border-2 border-[#ffd700] text-[#ffd700] font-black text-xs rounded-sm hover:bg-[#ffd700] hover:text-black transition cursor-pointer tracking-widest shadow-[4px_4px_0_0_rgba(0,0,0,0.5)]"
              >
                {isHighScore(score) && !hasPromptedName ? '🏆 REGISTRAR RECORDE NO TOP 10' : '🏆 VER TOP 10 RANKING'}
              </button>
              <button
                onClick={onReturnToMenu}
                className="w-full py-1.5 bg-purple-950 text-purple-200 border border-purple-400 font-bold text-xs rounded-sm hover:bg-purple-900 transition cursor-pointer uppercase tracking-widest"
              >
                🏠 VOLTAR AO INÍCIO (MAIN MENU)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- PARODY CREDITS MODAL --- */}
      {showCredits && (
        <ParodyCreditsModal
          onClose={() => {
            setShowCredits(false);
            onReturnToMenu();
          }}
        />
      )}

      {/* --- NAME ENTRY MODAL --- */}
      {showNameEntry && (
        <NameEntryModal
          score={score}
          presencePoints={presencePoints}
          mode={isInfiniteMode ? 'INFINITE' : `STAGE ${stageIndex + 1}`}
          onSaved={(updatedScores) => {
            setHighScoresList(updatedScores);
            setHasPromptedName(true);
            setShowNameEntry(false);
            setShowLeaderboard(true);
          }}
          onSkip={() => {
            setHasPromptedName(true);
            setShowNameEntry(false);
            setShowLeaderboard(true);
          }}
        />
      )}

      {/* --- LEADERBOARD MODAL --- */}
      {showLeaderboard && (
        <LeaderboardModal
          highScores={highScoresList}
          onClose={() => setShowLeaderboard(false)}
        />
      )}
    </div>
  );
};
