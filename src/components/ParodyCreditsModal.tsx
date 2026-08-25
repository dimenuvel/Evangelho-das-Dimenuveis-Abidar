import React, { useEffect, useRef, useState } from 'react';
import { soundEngine } from '../audio/soundEngine';

interface ParodyCreditsModalProps {
  onClose: () => void;
}

interface CreditSection {
  title?: string;
  role?: string;
  name?: string;
  isHeader?: boolean;
  isSubHeader?: boolean;
  isSpecial?: boolean;
}

const PARODY_CREDITS: CreditSection[] = [
  { title: "🌟 PARABÉNS! VOCÊ ATINGIU A ILUMINAÇÃO SUPREMA! 🌟", isHeader: true },
  { title: "NENHUM TAPETE FOI DANIFICADO DURANTE ESTA REVOLUÇÃO CÓSMICA", isSubHeader: true },
  { title: "--- O EVANGELHO DAS DIMENÚVEIS APRESENTA ---", isHeader: true },
  { title: "ABIDAR - THE COSMIC CARPET RIDE (1992-2026)", isSubHeader: true },

  { title: "=== DIRETORIA & VISÃO ESPIRITUAL ===", isHeader: true },
  { role: "DIRETOR GERAL DE SERENIDADE & PRESENÇA", name: "O Cara (The Dude)" },
  { role: "VICE-DIRETOR DE TAPETES E TAPETARIA", name: "Seu Tapete de Estimação" },
  { role: "PRODUTOR EXECUTIVO SEM PRESSA", name: "Monge Que Perdeu O Ônibus" },
  { role: "CHEFE DE PLANEJAMENTO RETRO 16-BITS", name: "Sega Genesis Esquecido no Sótão" },

  { title: "=== DEPARTAMENTO DE MANTRAS & ONDAS SONORAS ===", isHeader: true },
  { role: "COMPOSITOR DO SOM RETRO-ACÚSTICO", name: "Mestre dos 8-Bits Sem Sintetizador" },
  { role: "MAESTRO DE BEEP BEEP & BASS CÓSMICO", name: "DJ Beco Diagonais" },
  { role: "OPERADOR DE SINTETIZADOR E REMIX DE VENTO", name: "Vento da Madrugada" },
  { role: "CANTOR OFICIAL DO OM DE 432Hz", name: "O Vizinho Cantando no Chuveiro" },

  { title: "=== ENGENHARIA DE TAPETES E FÍSICA ASTRONOMICA ===", isHeader: true },
  { role: "ENGENHEIRO DE FIOS & TECELAGEM GRAVITACIONAL", name: "Vovó do Crochê Esotérico" },
  { role: "CIENTISTA DE AERODINÂMICA DE FRANJAS", name: "Prof. Dr. Franjoso de Souza" },
  { role: "TESTADOR DE RESISTÊNCIA A MANCHAS DE CHÁ", name: "Chá de Camomila v4.2" },
  { role: "EQUILIBRISTA DE TAPETES EM TEMPESTADES", name: "Zé da Curva Intergaláctica" },

  { title: "=== ARTE, PIXELS & DESIGN ILUMINADO ===", isHeader: true },
  { role: "PINTOR DE NEBULOSAS E POEIRA DE ESTRELAS", name: "Tarsila do Espaço" },
  { role: "DESENHISTA DE ASTEROIDES RECICLÁVEIS", name: "Pedreiro de Meteoros" },
  { role: "DESIGNER DE ROLAMENTO E ANIMAÇÕES 16-BIT", name: "Pixelman da Silva" },
  { role: "CONSULTOR DE CORES ROXAS E DOURADAS", name: "O Pôr do Sol de 1995" },

  { title: "=== COMITÊ DE FÍSICA ASTRONÔMICA E DESAGRADOS ===", isHeader: true },
  { role: "DERROTADO POR UNANIMIDADE", name: "Sir Isaac Newton (A Gravidade Não Vale Aqui)" },
  { role: "GERENTE DE VACUO & ESPAÇO VAZIO", name: "Ninguém em Particular" },
  { role: "FISCAL DE VELOCIDADE DA LUZ", name: "Guarda Rodoviário de Andrômeda" },

  { title: "=== ALIMENTAÇÃO, CATERING & SUPORTES ===", isHeader: true },
  { role: "FORNECEDOR OFICIAL DE PÃO DE QUEIJO CÓSMICO", name: "Dona Maria da Cantina Espacial" },
  { role: "ENTREGADOR DE CAFÉ EM HIPERESPAÇO", name: "Motoboy Quântico de Entrega Rápida" },
  { role: "ABASTECEDOR DE ÁGUA BENTA ESPIRITUAL", name: "Garrafão de 20 Litros da Firma" },

  { title: "=== QUALIDADE, BUG HUNTING & AMBIENTE ===", isHeader: true },
  { role: "DESTRUIDOR DE BUGS INTERGALÁCTICOS", name: "Dedetizador Astral 3000" },
  { role: "TESTADOR QUE DORMIU DURANTE O RIDE", name: "Zé do Sono Profundo" },
  { role: "AUDITORIA DE PAZ INTERIOR", name: "Monge Sem Celular" },

  { title: "=== NOMEAÇÕES DE PARÓDIA ARCADE (JAPAN DIVISION) ===", isHeader: true },
  { role: "SUPERVISOR OFICIAL DE CRÉDITOS", name: "TAKA MURA NA MAO" },
  { role: "DESIGNER DE DIFICULDADE CRUEL", name: "KAMO SAKU NA PEDRA" },
  { role: "CHEF DE EFETUAÇÃO DE HIGH SCORES", name: "SEGA DEMAIS DA CONTA" },
  { role: "PROGRAMADOR DE MATRIX RETRO", name: "AKIRA NA MESA" },
  { role: "COORDENADOR DE BUTTON MASHING", name: "KEN SHIROU SEM SOCO" },

  { title: "=== AGRADECIMENTOS ESPECIAIS & DEDICATÓRIAS ===", isHeader: true },
  { role: "AGRADECIMENTO #1", name: "Ao Tapete Que Nunca Encolheu Na Lavagem" },
  { role: "AGRADECIMENTO #2", name: "Ao Botão de Disparo Que Resistiu Aos Cliques" },
  { role: "AGRADECIMENTO #3", name: "Aos Asteroides Que Desviaram Por Gentileza" },
  { role: "AGRADECIMENTO #4", name: "A Você, Jogador(a), Por Manter A Presença!" },
  { role: "APOIO MORAL & MIAUS CÓSMICOS", name: "Miau-1000, O Gato Transcendente" },

  { title: "--- MENSAGEM FINAL DA TRANSMISSÃO ---", isSubHeader: true },
  { title: "NÃO TENTE DUPLICAR ESTAS MANOBRAS DE TAPETE EM CASA.", isSpecial: true },
  { title: "SE O SEU TAPETE COMECAR A FLUTUAR, AGRADEÇA E ABIDE.", isSpecial: true },

  { title: "🧘 MANTENHA A PRESENÇA 🧘", isHeader: true },
  { title: "VOCÊ NUNCA FOI A LUGAR NENHUM.", isSubHeader: true },
  { title: "ABIDE. ABIDE. ABIDE.", isHeader: true },
  { title: "© 1992-2026 EVANGELHO DIMENÚVEIS — TODOS OS DIREITOS RESERVADOS", isSubHeader: true },
];

export const ParodyCreditsModal: React.FC<ParodyCreditsModalProps> = ({ onClose }) => {
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(2);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Play victory chime when component loads
  useEffect(() => {
    soundEngine.playSpiralActivationSound();
  }, []);

  // Background animated cosmic starfield
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const stars = Array.from({ length: 140 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.5 + 1,
      speed: Math.random() * 2 + 0.5,
      color: ['#ffd700', '#22d3ee', '#c084fc', '#ffffff', '#f43f5e'][Math.floor(Math.random() * 5)],
    }));

    let starAnim: number;
    const render = () => {
      ctx.fillStyle = '#050515';
      ctx.fillRect(0, 0, width, height);

      stars.forEach((s) => {
        s.y += s.speed * (isPaused ? 0.2 : speedMultiplier);
        if (s.y > height) {
          s.y = 0;
          s.x = Math.random() * width;
        }
        ctx.fillStyle = s.color;
        ctx.fillRect(Math.floor(s.x), Math.floor(s.y), s.size, s.size);
      });

      starAnim = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(starAnim);
    };
  }, [isPaused, speedMultiplier]);

  // Fast smooth auto-scrolling loop
  useEffect(() => {
    let lastTime = performance.now();

    const scrollLoop = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      if (scrollRef.current && !isPaused) {
        const baseSpeed = 75; // Fast arcade scroll speed
        scrollRef.current.scrollTop += baseSpeed * speedMultiplier * delta;

        // Loop automatically when reaching bottom
        if (
          scrollRef.current.scrollTop + scrollRef.current.clientHeight >=
          scrollRef.current.scrollHeight - 10
        ) {
          scrollRef.current.scrollTop = 0;
        }
      }

      animFrameRef.current = requestAnimationFrame(scrollLoop);
    };

    animFrameRef.current = requestAnimationFrame(scrollLoop);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isPaused, speedMultiplier]);

  const cycleSpeed = () => {
    soundEngine.playUiClick();
    setSpeedMultiplier((prev) => (prev === 1 ? 2 : prev === 2 ? 4 : prev === 4 ? 8 : 1));
  };

  const togglePause = () => {
    soundEngine.playUiClick();
    setIsPaused((prev) => !prev);
  };

  const handleAbidarExit = () => {
    soundEngine.playUiClick();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-[#050515] text-white font-mono select-none overflow-hidden">
      {/* Background Animated Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover z-0" />

      {/* CRT Scanlines Filter */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%)] bg-[length:100%_4px] pointer-events-none z-10 opacity-70" />

      {/* Top Controls Banner */}
      <div className="relative z-30 w-full max-w-2xl px-4 py-2.5 flex items-center justify-between bg-black/80 border-b border-[#ffd700]/40 backdrop-blur-md shrink-0 shadow-xl">
        <div className="flex items-center gap-2">
          <span className="text-[#ffd700] text-xs sm:text-sm font-black tracking-widest uppercase glow-gold">
            🎬 CRÉDITOS DO COSMOS
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={togglePause}
            className="px-2.5 py-1 bg-purple-950/90 hover:bg-purple-800 border border-purple-400 text-purple-200 text-xs font-bold rounded-sm transition cursor-pointer shadow-md"
          >
            {isPaused ? '▶ CONTINUAR' : '⏸️ PAUSAR'}
          </button>
          <button
            onClick={cycleSpeed}
            className="px-2.5 py-1 bg-cyan-950/90 hover:bg-cyan-800 border border-cyan-400 text-cyan-200 text-xs font-bold rounded-sm transition cursor-pointer shadow-md"
          >
            ⏩ VELOCIDADE: {speedMultiplier}X
          </button>
        </div>
      </div>

      {/* Fast Scrolling Credits Content */}
      <div
        ref={scrollRef}
        className="relative z-20 w-full max-w-2xl h-full overflow-y-auto px-4 py-10 flex flex-col items-center text-center space-y-6 scrollbar-none"
      >
        <div className="py-20 text-center space-y-3">
          <div className="text-5xl sm:text-6xl animate-bounce">🧘</div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#ffd700] tracking-widest glow-gold">
            VITÓRIA SUPREMA!
          </h1>
          <p className="text-cyan-300 text-xs sm:text-sm font-bold uppercase tracking-widest glow-cyan">
            O CARA ATINGIU O ESTADO DE ABIDAR TOTAL
          </p>
        </div>

        {PARODY_CREDITS.map((item, idx) => {
          if (item.isHeader) {
            return (
              <div key={idx} className="pt-8 pb-2 border-b-2 border-[#ffd700]/50 w-full max-w-md">
                <h2 className="text-sm sm:text-lg font-black text-[#ffd700] tracking-widest glow-gold uppercase">
                  {item.title}
                </h2>
              </div>
            );
          }

          if (item.isSubHeader) {
            return (
              <div key={idx} className="pt-2 pb-1">
                <h3 className="text-xs sm:text-sm font-bold text-cyan-300 tracking-wider uppercase glow-cyan">
                  {item.title}
                </h3>
              </div>
            );
          }

          if (item.isSpecial) {
            return (
              <div key={idx} className="px-4 py-2 bg-purple-950/50 border border-purple-400/40 rounded-sm max-w-md">
                <p className="text-xs sm:text-sm text-purple-200 font-bold italic">
                  {item.title}
                </p>
              </div>
            );
          }

          return (
            <div key={idx} className="flex flex-col items-center space-y-1 max-w-md">
              <span className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-widest font-bold">
                {item.role}
              </span>
              <span className="text-sm sm:text-base text-white font-black tracking-wide text-purple-100">
                {item.name}
              </span>
            </div>
          );
        })}

        {/* Ending Section Spacing */}
        <div className="py-24 text-center space-y-4">
          <div className="text-4xl">✨ 🕉️ ✨</div>
          <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">
            --- FIM DA TRANSMISSÃO ARCADE ---
          </p>
        </div>
      </div>

      {/* Prominent ABIDAR Exit Button */}
      <div className="relative z-30 w-full max-w-md px-4 py-3 bg-black/90 border-t-2 border-[#ffd700] backdrop-blur-md flex justify-center items-center shrink-0 shadow-2xl">
        <button
          onClick={handleAbidarExit}
          className="w-full py-3.5 bg-[#ffd700] hover:bg-yellow-300 text-black font-black text-base sm:text-lg rounded-sm transition shadow-[4px_4px_0_0_rgba(0,0,0,0.9)] cursor-pointer tracking-widest uppercase border-2 border-black flex items-center justify-center gap-2.5 glow-gold"
        >
          <span className="text-xl">🧘</span>
          <span>ABIDAR (VOLTAR AO INÍCIO)</span>
        </button>
      </div>
    </div>
  );
};

export default ParodyCreditsModal;
