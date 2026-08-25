import React, { useEffect, useRef, useState } from 'react';
import { pixelRenderer } from '../game/pixelArtRenderer';
import { STAGES } from '../game/gameEngine';
import { soundEngine } from '../audio/soundEngine';
import { isStageUnlocked } from '../game/stageUnlockManager';

interface Props {
  onStartGame: (stageIndex: number) => void;
  onStartInfiniteGame: () => void;
  onOpenHowToPlay: () => void;
  onOpenOptions: () => void;
  onOpenLeaderboard: () => void;
  onOpenCredits?: () => void;
  highScore: number;
}

export const MainMenu: React.FC<Props> = ({
  onStartGame,
  onStartInfiniteGame,
  onOpenHowToPlay,
  onOpenOptions,
  onOpenLeaderboard,
  onOpenCredits,
  highScore
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [showStageSelect, setShowStageSelect] = useState(false);
  const [isScreensaver, setIsScreensaver] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;
    ctx.imageSmoothingEnabled = false;

    let animationFrame: number;
    let gameTime = 0;

    const renderBg = () => {
      gameTime += 0.016;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Render Stage 1 background for main menu
      pixelRenderer.drawSpaceBackground(ctx, canvas.width, canvas.height, STAGES[0], gameTime);

      // Floating Title Planets
      pixelRenderer.drawParallaxPlanets(
        ctx,
        [
          {
            x: canvas.width * 0.8,
            y: canvas.height * 0.3,
            radius: 50,
            type: 'spiral_galaxy',
            colorMain: '#8b12ab',
            colorAccent: '#00e5ff',
            hasRing: false,
            speed: 0
          },
          {
            x: canvas.width * 0.2,
            y: canvas.height * 0.75,
            radius: 55,
            type: 'temple_island',
            colorMain: '#ffd700',
            colorAccent: '#00e5ff',
            hasRing: false,
            speed: 0
          }
        ],
        gameTime
      );

      // Render a preview of The Dude on Carpet floating softly with flowy trail velocity
      const previewVy = Math.cos(gameTime * 2.5) * 75;
      pixelRenderer.drawPlayer(
        ctx,
        {
          x: canvas.width * 0.5,
          y: canvas.height * 0.62 + Math.sin(gameTime * 2.5) * 15,
          targetY: canvas.height * 0.62,
          vy: previewVy,
          width: 70,
          height: 40,
          lives: 3,
          maxLives: 3,
          abidarEnergy: 100,
          score: 0,
          combo: 1,
          comboTimer: 0,
          stillTime: 3.0,
          isAbiding: true, // Golden aura floating!
          activePowerUp: null,
          powerUpTimer: 0,
          shieldActive: false,
          magnetActive: false,
          speedBoostActive: false,
          timeSlowActive: false,
          ieouaProgress: ['I', 'E', 'O', 'U', 'A'],
          spiralModeTime: 0,
          pinsCollected: 0,
          coffeesDrunk: 0,
          totalAbideSeconds: 10,
          presencePoints: 5000,
          invulnerableTime: 0,
          isMaterialMode: false
        },
        gameTime
      );

      animationFrame = requestAnimationFrame(renderBg);
    };

    renderBg();

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  // 15 Seconds Inactivity Timer for Screensaver
  useEffect(() => {
    const resetTimer = () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);

      setIsScreensaver((prev) => {
        if (prev) return false;
        return false;
      });

      timerRef.current = window.setTimeout(() => {
        setIsScreensaver(true);
      }, 15000);
    };

    resetTimer();

    const activityEvents = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'pointerdown'];
    activityEvents.forEach((evt) => window.addEventListener(evt, resetTimer, { passive: true }));

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      activityEvents.forEach((evt) => window.removeEventListener(evt, resetTimer));
    };
  }, []);

  const handleContainerClick = () => {
    if (isScreensaver) {
      setIsScreensaver(false);
    }
  };

  const handlePlayClick = () => {
    soundEngine.playUiClick();
    onStartGame(0);
  };

  const handleStageClick = (idx: number) => {
    if (!isStageUnlocked(idx)) return;
    soundEngine.playUiClick();
    onStartGame(idx);
  };

  return (
    <div 
      onClick={handleContainerClick}
      className="relative w-full h-screen overflow-y-auto bg-[#050515] flex flex-col items-center justify-between p-2 sm:p-4 select-none font-mono text-white scrollbar-none"
    >
      {/* Background Canvas */}
      <canvas
        ref={canvasRef}
        width={800}
        height={450}
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Radial Void overlay (Soft center glow, no dark shadow over top/bottom) */}
      <div className={`absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,#1e003d_0%,transparent_60%)] transition-opacity duration-1000 z-10 pointer-events-none ${isScreensaver ? 'opacity-10' : 'opacity-25'}`} />

      {/* Screensaver Prompt Indicator when active */}
      {isScreensaver && (
        <div className="absolute bottom-8 z-30 animate-pulse text-center bg-black/70 backdrop-blur-sm px-6 py-2.5 rounded-full border border-[#ffd700]/50 shadow-md pointer-events-none">
          <p className="text-[#ffd700] text-xs md:text-sm font-bold tracking-widest glow-gold uppercase">
            ✨ TOQUE EM QUALQUER LUGAR PARA RETORNAR ✨
          </p>
        </div>
      )}

      {/* Main Menu UI Container (Hidden during screensaver mode) */}
      <div className={`relative z-20 w-full min-h-full flex flex-col justify-between items-center transition-all duration-700 ${isScreensaver ? 'opacity-0 pointer-events-none scale-95' : 'opacity-100 pointer-events-auto scale-100'}`}>
        {/* Top Header & High Score */}
        <header className="w-full max-w-3xl flex justify-end items-center bg-black/40 border border-white/10 rounded-sm px-2.5 py-1 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-1.5 bg-black/60 px-2 py-0.5 border border-[#ffd700]/50 rounded-sm">
            <span className="text-[9px] sm:text-[10px] text-white/70 uppercase tracking-wider font-bold whitespace-nowrap">RECORDE / HIGH SCORE:</span>
            <span className="text-[#ffd700] text-xs sm:text-sm font-black tracking-wider glow-gold">
              {highScore.toString().padStart(6, '0')}
            </span>
          </div>
        </header>

        {/* Main Title Banner */}
        <div className="text-center my-auto flex flex-col items-center max-w-md w-full px-2 py-1.5">
          <div className="bg-black/75 border-2 border-[#ffd700] rounded-sm p-2.5 sm:p-4 backdrop-blur-md w-full shadow-lg">
            <div className="text-cyan-400 text-[9px] sm:text-[10px] font-bold tracking-[0.15em] sm:tracking-[0.2em] uppercase mb-0.5 glow-cyan whitespace-nowrap">
              — THE COSMIC CARPET RIDE —
            </div>
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-900/90 border-2 border-[#ffd700] rounded-sm flex items-center justify-center text-base sm:text-xl shrink-0">
                🧘
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-[#ffd700] tracking-widest glow-gold">
                ABIDAR
              </h1>
            </div>
            <p className="text-purple-200 text-[10px] sm:text-xs leading-tight mb-2 max-w-xs sm:max-w-sm mx-auto">
              Navegue com O Cara em seu tapete voador pelas galáxias místicas. Mantenha a presença. Abide.
            </p>

            {!showStageSelect ? (
              <div className="mt-1.5 space-y-1.5 w-full max-w-xs sm:max-w-sm mx-auto">
                <button
                  onClick={handlePlayClick}
                  className="w-full py-2 sm:py-2.5 bg-[#ffd700] text-black font-black text-xs sm:text-sm rounded-sm hover:bg-yellow-300 transition shadow-[3px_3px_0_0_rgba(0,0,0,0.7)] cursor-pointer tracking-wider uppercase border-2 border-black"
                >
                  ▶ JOGAR MODO FASES (STORY)
                </button>

                <button
                  onClick={() => {
                    soundEngine.playUiClick();
                    onStartInfiniteGame();
                  }}
                  className="w-full py-2 sm:py-2.5 bg-cyan-400 text-black font-black text-xs sm:text-sm rounded-sm hover:bg-cyan-300 transition shadow-[3px_3px_0_0_rgba(0,0,0,0.7)] cursor-pointer tracking-wider uppercase border-2 border-black glow-cyan"
                >
                  ♾️ MODO INFINITO (ENDLESS)
                </button>

                <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                  <button
                    onClick={() => {
                      soundEngine.playUiClick();
                      onOpenLeaderboard();
                    }}
                    className="py-1.5 bg-black/50 hover:bg-[#ffd700] hover:text-black text-[#ffd700] border border-[#ffd700]/60 font-black text-[10px] sm:text-[11px] rounded-sm transition cursor-pointer tracking-wider"
                  >
                    🏆 RANKING TOP 10
                  </button>
                  <button
                    onClick={() => {
                      soundEngine.playUiClick();
                      setShowStageSelect(true);
                    }}
                    className="py-1.5 bg-purple-950/60 hover:bg-purple-900 text-purple-200 border border-purple-500/50 font-bold text-[10px] sm:text-[11px] rounded-sm transition cursor-pointer tracking-wider"
                  >
                    🌌 SELECIONAR FASE
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-1 pt-0.5">
                  <button
                    onClick={() => {
                      soundEngine.playUiClick();
                      onOpenHowToPlay();
                    }}
                    className="py-1 bg-black/50 hover:bg-gray-900 text-cyan-300 border border-cyan-500/40 font-bold text-[10px] sm:text-[11px] rounded-sm transition cursor-pointer"
                  >
                    📖 AJUDA
                  </button>
                  <button
                    onClick={() => {
                      soundEngine.playUiClick();
                      onOpenOptions();
                    }}
                    className="py-1 bg-black/50 hover:bg-gray-900 text-cyan-300 border border-cyan-500/40 font-bold text-[10px] sm:text-[11px] rounded-sm transition cursor-pointer"
                  >
                    ⚙️ OPÇÕES
                  </button>
                  <button
                    onClick={() => {
                      soundEngine.playUiClick();
                      if (onOpenCredits) onOpenCredits();
                    }}
                    className="py-1 bg-purple-950/80 hover:bg-purple-900 text-[#ffd700] border border-[#ffd700]/50 font-bold text-[10px] sm:text-[11px] rounded-sm transition cursor-pointer"
                  >
                    🎬 CRÉDITOS
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-1 space-y-1.5 w-full max-w-sm mx-auto">
                <h3 className="text-cyan-400 font-bold text-[10px] sm:text-[11px] uppercase tracking-[0.2em] mb-1 glow-cyan">
                  ESCOLHA SUA FASE:
                </h3>
                <div className="max-h-[45vh] overflow-y-auto space-y-1 pr-1 scrollbar-none">
                  {STAGES.map((st, idx) => {
                    const unlocked = isStageUnlocked(idx);
                    return (
                      <button
                        key={st.id}
                        disabled={!unlocked}
                        onClick={() => handleStageClick(idx)}
                        className={`w-full p-1.5 border rounded-sm text-left transition flex justify-between items-center group ${
                          unlocked
                            ? 'bg-black/80 hover:bg-[#ffd700] hover:text-black border-white/20 cursor-pointer'
                            : 'bg-black/40 border-white/10 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <div>
                          <div className={`font-black text-xs ${unlocked ? 'group-hover:text-black text-white' : 'text-gray-400'}`}>
                            {st.title}
                          </div>
                          <div className={`text-[9px] ${unlocked ? 'text-purple-300 group-hover:text-black/80' : 'text-gray-500 font-semibold'}`}>
                            {unlocked ? st.subtitle : `🔒 BLOQUEADA — CONCLUA FASE ${idx}`}
                          </div>
                        </div>
                        <span className={`font-bold text-xs ${unlocked ? 'text-[#ffd700] group-hover:text-black' : 'text-gray-500'}`}>
                          {unlocked ? '▶' : '🔒'}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => {
                    soundEngine.playUiClick();
                    setShowStageSelect(false);
                  }}
                  className="w-full py-1 bg-gray-900 hover:bg-gray-800 text-[#ffd700] border border-white/10 text-xs font-bold rounded-sm mt-1 cursor-pointer"
                >
                  ← VOLTAR
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer message - Raised above all shadows with distinct backdrop */}
        <footer className="relative z-40 text-center flex flex-col items-center gap-0.5 shrink-0 py-1 px-3 bg-black/70 border border-[#ffd700]/30 rounded-sm backdrop-blur-md shadow-xl my-0.5">
          <p className="text-[#ffd700] text-[9px] sm:text-xs font-black tracking-[0.08em] sm:tracking-[0.15em] glow-gold leading-tight">
            "MANTENHA A PRESENÇA — VOCÊ NUNCA FOI A LUGAR NENHUM"
          </p>
          <div className="flex items-center justify-center gap-2 text-[9px] text-white/80 font-mono tracking-wider leading-tight">
            <span>© Evangelho das Dimenúveis</span>
            <span>•</span>
            <a
              href="mailto:samuel.tiem@proton.me?subject=Abidar%20-%20The%20Cosmic%20Carpet%20Ride"
              className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition font-bold cursor-pointer glow-cyan"
            >
              Contato
            </a>
            <span>•</span>
            <span className="text-[#ffd700] font-bold">v1.1</span>
          </div>
        </footer>
      </div>
    </div>
  );
};
