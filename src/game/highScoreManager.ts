/**
 * High Score Manager for Abidar - The Cosmic Carpet Ride
 * Stores and manages top 10 scores with player names in localStorage.
 */

export interface HighScoreEntry {
  id: string;
  name: string;
  score: number;
  presencePoints: number;
  mode: string; // e.g. "INFINITE", "STAGE 5", "STAGE 1"
  date: string;
}

const STORAGE_KEY = 'abidar_top10_highscores';

const DEFAULT_SCORES: HighScoreEntry[] = [
  { id: '1', name: 'THE DUDE', score: 25000, presencePoints: 18000, mode: 'INFINITE', date: '2026-08-24' },
  { id: '2', name: 'DIMENUOUS', score: 18500, presencePoints: 15200, mode: 'INFINITE', date: '2026-08-24' },
  { id: '3', name: 'BOWLER_99', score: 14200, presencePoints: 9800, mode: 'STAGE 5', date: '2026-08-24' },
  { id: '4', name: 'SPIRAL_ZEN', score: 11800, presencePoints: 8400, mode: 'STAGE 4', date: '2026-08-24' },
  { id: '5', name: 'COFFEE_GUY', score: 9500, presencePoints: 6200, mode: 'STAGE 3', date: '2026-08-24' },
  { id: '6', name: 'CARPET_RIDER', score: 7800, presencePoints: 5100, mode: 'INFINITE', date: '2026-08-24' },
  { id: '7', name: 'VOID_WALKER', score: 6400, presencePoints: 4200, mode: 'STAGE 2', date: '2026-08-24' },
  { id: '8', name: 'IEOUA_MASTR', score: 5100, presencePoints: 3800, mode: 'STAGE 2', date: '2026-08-24' },
  { id: '9', name: 'ABIDAR_INIT', score: 3900, presencePoints: 2500, mode: 'STAGE 1', date: '2026-08-24' },
  { id: '10', name: 'NOVICE_ZEN', score: 2200, presencePoints: 1100, mode: 'STAGE 1', date: '2026-08-24' }
];

export function getHighScores(): HighScoreEntry[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SCORES));
      return DEFAULT_SCORES;
    }
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.sort((a, b) => b.score - a.score).slice(0, 10);
    }
  } catch {
    // fallback
  }
  return DEFAULT_SCORES;
}

export function isHighScore(score: number): boolean {
  if (score <= 0) return false;
  const current = getHighScores();
  if (current.length < 10) return true;
  return score > current[current.length - 1].score;
}

export function saveHighScore(entry: {
  name: string;
  score: number;
  presencePoints: number;
  mode: string;
}): HighScoreEntry[] {
  const current = getHighScores();
  const dateStr = new Date().toISOString().split('T')[0];
  const newEntry: HighScoreEntry = {
    id: Date.now().toString() + Math.random().toString(36).substring(2, 5),
    name: (entry.name || 'THE DUDE').trim().toUpperCase().substring(0, 12) || 'THE DUDE',
    score: entry.score,
    presencePoints: entry.presencePoints,
    mode: entry.mode,
    date: dateStr
  };

  const updated = [...current, newEntry]
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    // Also update legacy single high score key if needed
    if (updated.length > 0) {
      localStorage.setItem('abidar_highscore', updated[0].score.toString());
    }
  } catch {
    // ignore
  }

  return updated;
}
