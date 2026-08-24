import React from 'react';
import { soundEngine } from '../audio/soundEngine';

interface Props {
  onClose: () => void;
}

export const HowToPlayModal: React.FC<Props> = ({ onClose }) => {
  const handleClose = () => {
    soundEngine.playUiClick();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-[#0b051b] border-2 border-[#ffd700] rounded-sm max-w-xl w-full p-6 text-white shadow-[10px_10px_0_0_rgba(0,0,0,0.8)] relative font-mono">
        {/* Header Bar with flex layout so close button never overlaps title or content */}
        <div className="flex justify-between items-center mb-4 border-b-2 border-white/10 pb-3 gap-3">
          <h2 className="text-lg md:text-xl font-black text-[#ffd700] tracking-wider glow-gold flex-1">
            📖 COMO JOGAR / HOW TO PLAY
          </h2>
          <button
            onClick={handleClose}
            className="text-[#ffd700] hover:bg-[#ffd700] hover:text-black text-xs md:text-sm font-bold px-3 py-1.5 bg-black border-2 border-white/20 rounded-sm transition shadow-[3px_3px_0_0_rgba(0,0,0,0.5)] cursor-pointer shrink-0"
          >
            ✕ FECHAR
          </button>
        </div>

        <div className="space-y-4 text-xs md:text-sm leading-relaxed max-h-[65vh] overflow-y-auto pr-2">
          {/* Controls */}
          <div className="bg-black/60 p-4 rounded-sm border-2 border-white/10 shadow-[4px_4px_0_0_rgba(0,0,0,0.5)]">
            <h3 className="text-cyan-400 font-bold mb-2 flex items-center gap-2 tracking-wider glow-cyan">
              <span>🎮</span> CONTROLES / CONTROLS
            </h3>
            <p className="text-purple-200 mb-1">
              <strong>Toque / Clique / Teclado:</strong> Toque ou clique em qualquer lugar da tela (ou segure qualquer tecla como <code className="bg-purple-950 px-1.5 py-0.5 rounded border border-cyan-500/40 text-[#ffd700]">W / Espaço / ↑</code>) para <strong>SUBIR</strong>.
            </p>
            <p className="text-purple-200 mb-1">
              <strong>Soltar:</strong> Solte a tela ou a tecla para <strong>CAIR</strong> sob a gravidade cósmica.
            </p>
            <p className="text-red-400 font-bold">
              ⚠️ ATENÇÃO: Se você cair fora da tela (pela borda inferior), o tapete cai no abismo e você perde!
            </p>
          </div>

          {/* Abide Mechanic */}
          <div className="bg-[#1e1005]/80 p-4 rounded-sm border-2 border-[#ffd700]/60 shadow-[4px_4px_0_0_rgba(0,0,0,0.5)]">
            <h3 className="text-[#ffd700] font-bold mb-1 flex items-center gap-2 tracking-wider glow-gold">
              <span>🧘</span> A MECÂNICA "ABIDE" / THE STILLNESS
            </h3>
            <p className="text-amber-100">
              Quando você para de se mover e mantém a posição estável por alguns segundos, o estado <strong className="text-[#ffd700]">"ABIDE"</strong> é ativado! Uma aura dourada envolve o tapete, você ganha <strong className="text-cyan-400">+1000 Pontos de Presença</strong> e recarrega sua energia Abidar.
            </p>
          </div>

          {/* Collectibles */}
          <div className="bg-black/60 p-4 rounded-sm border-2 border-white/10 shadow-[4px_4px_0_0_rgba(0,0,0,0.5)]">
            <h3 className="text-cyan-400 font-bold mb-2 tracking-wider glow-cyan">✨ COLETÁVEIS / COLLECTIBLES</h3>
            <ul className="space-y-2 text-purple-200">
              <li className="flex items-start gap-2">
                <span className="text-[#ffd700] font-bold">🎳 Pinos de Boliche:</span> +100 pontos. Coletar seguidamente aumenta o multiplicador de COMBO (x2, x3, x5)!
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#ffd700] font-bold">☕ Xícara de Café:</span> +50 pontos & recarrega energia Abidar. 3 cafés seguidos ativam <strong>Coffee Rush Time</strong>!
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#ffd700] font-bold">⭐ Estrela Dourada:</span> +200 pontos e bônus temporário.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#ffd700] font-bold">🔮 Orbes IEOUA:</span> Colete os 5 sons sagrados (I → E → O → U → A) para ativar <strong>THE SOUND OF THE SPIRAL</strong>!
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#ffd700] font-bold">🔥 Orbes Elementais:</span> Fogo (Escudo), Ar (Velocidade), Água (Lentidão), Terra (Ímã de ouro).
              </li>
            </ul>
          </div>

          {/* Obstacles & Energy */}
          <div className="bg-black/60 p-4 rounded-sm border-2 border-white/10 shadow-[4px_4px_0_0_rgba(0,0,0,0.5)]">
            <h3 className="text-cyan-400 font-bold mb-1 tracking-wider glow-cyan">⚡ ENERGIA ABIDAR & OBSTÁCULOS</h3>
            <p className="text-purple-200">
              Sua barra de energia diminui suavemente. Se chegar a zero, você entra no <em>Material Mode</em> (movimentos pesados). Desvie dos Voids, falsos clones e projetores para não perder vidas!
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={handleClose}
            className="w-full py-3 bg-[#ffd700] text-black font-black rounded-sm hover:bg-yellow-300 shadow-[6px_6px_0_0_rgba(0,0,0,0.6)] cursor-pointer transition text-sm tracking-widest uppercase border-2 border-black"
          >
            ENTENDI! BORA ABIDAR (START)
          </button>
        </div>
      </div>
    </div>
  );
};
