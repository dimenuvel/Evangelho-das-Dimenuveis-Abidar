import React, { useState } from 'react';
import { MainMenu } from './components/MainMenu';
import { GameCanvas } from './components/GameCanvas';
import { HowToPlayModal } from './components/HowToPlayModal';
import { OptionsMenu } from './components/OptionsMenu';
import { LeaderboardModal } from './components/LeaderboardModal';
import ParodyCreditsModal from './components/ParodyCreditsModal';
import { GameSettings } from './game/types';
import { getHighScores } from './game/highScoreManager';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'menu' | 'game'>('menu');
  const [selectedStage, setSelectedStage] = useState<number>(0);
  const [isInfiniteMode, setIsInfiniteMode] = useState<boolean>(false);

  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);
  const [showCredits, setShowCredits] = useState<boolean>(false);

  const [highScore, setHighScore] = useState<number>(() => {
    try {
      const top = getHighScores()[0];
      return top ? top.score : parseInt(localStorage.getItem('abidar_highscore') || '0', 10);
    } catch {
      return 0;
    }
  });

  const [settings, setSettings] = useState<GameSettings>(() => {
    try {
      const saved = localStorage.getItem('abidar_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.difficulty) parsed.difficulty = 'normal';
        return parsed;
      }
    } catch {
      // ignore
    }
    return {
      soundEnabled: true,
      musicVolume: 0.5,
      sfxVolume: 0.7,
      scanlinesEnabled: true,
      touchControlMode: 'drag',
      difficulty: 'normal'
    };
  });

  const handleStartGame = (stageIdx: number = 0) => {
    setSelectedStage(stageIdx);
    setIsInfiniteMode(false);
    setCurrentScreen('game');
  };

  const handleStartInfiniteGame = () => {
    setSelectedStage(0);
    setIsInfiniteMode(true);
    setCurrentScreen('game');
  };

  const handleReturnToMenu = () => {
    // Refresh high score from top leaderboard entry
    try {
      const top = getHighScores()[0];
      const saved = top ? top.score : parseInt(localStorage.getItem('abidar_highscore') || '0', 10);
      setHighScore(saved);
    } catch {
      // ignore
    }
    setCurrentScreen('menu');
  };

  return (
    <div className="w-screen h-screen bg-[#0d071c] overflow-hidden relative">
      {/* Global 16-Bit CRT Scanlines Overlay */}
      {settings.scanlinesEnabled && <div className="bg-scanline" />}

      {currentScreen === 'menu' && (
        <MainMenu
          onStartGame={handleStartGame}
          onStartInfiniteGame={handleStartInfiniteGame}
          onOpenHowToPlay={() => setShowHowToPlay(true)}
          onOpenOptions={() => setShowOptions(true)}
          onOpenLeaderboard={() => setShowLeaderboard(true)}
          onOpenCredits={() => setShowCredits(true)}
          highScore={highScore}
        />
      )}

      {currentScreen === 'game' && (
        <GameCanvas
          stageIndex={selectedStage}
          isInfiniteMode={isInfiniteMode}
          settings={settings}
          onReturnToMenu={handleReturnToMenu}
          onUpdateSettings={setSettings}
        />
      )}

      {showHowToPlay && (
        <HowToPlayModal onClose={() => setShowHowToPlay(false)} />
      )}

      {showOptions && (
        <OptionsMenu
          settings={settings}
          onUpdateSettings={(newSet) => {
            setSettings(newSet);
            try {
              localStorage.setItem('abidar_settings', JSON.stringify(newSet));
            } catch {
              // ignore
            }
          }}
          onClose={() => setShowOptions(false)}
        />
      )}

      {showLeaderboard && (
        <LeaderboardModal
          highScores={getHighScores()}
          onClose={() => setShowLeaderboard(false)}
        />
      )}

      {showCredits && (
        <ParodyCreditsModal onClose={() => setShowCredits(false)} />
      )}
    </div>
  );
}
