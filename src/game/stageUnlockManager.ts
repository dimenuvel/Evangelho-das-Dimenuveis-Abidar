/**
 * Stage Unlock Manager for Abidar
 * Manages unlocked story stages stored in localStorage.
 * Initially, only Stage 1 (index 0) is unlocked.
 * Beating Stage N unlocks Stage N+1.
 */

const UNLOCKED_STAGES_KEY = 'abidar_unlocked_stages';

/**
 * Returns the count of unlocked stages (1 to 5).
 * 1 means only Stage 1 (index 0) is unlocked.
 * 2 means Stage 1 and Stage 2 are unlocked, etc.
 */
export function getUnlockedStageCount(): number {
  try {
    const saved = localStorage.getItem(UNLOCKED_STAGES_KEY);
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed >= 1) {
        return Math.min(Math.max(parsed, 1), 5);
      }
    }
  } catch {
    // fallback
  }
  return 1; // Default: Only Stage 1 unlocked
}

/**
 * Unlocks the next stage after a stage is cleared.
 * @param clearedStageIndex 0-based index of the stage that was cleared.
 */
export function unlockNextStage(clearedStageIndex: number): number {
  try {
    const currentCount = getUnlockedStageCount();
    const newCount = Math.max(currentCount, clearedStageIndex + 2);
    const clamped = Math.min(newCount, 5);
    localStorage.setItem(UNLOCKED_STAGES_KEY, clamped.toString());
    return clamped;
  } catch {
    return getUnlockedStageCount();
  }
}

/**
 * Unlocks all 5 stages in the game.
 */
export function unlockAllStages(): number {
  try {
    localStorage.setItem(UNLOCKED_STAGES_KEY, '5');
    return 5;
  } catch {
    return getUnlockedStageCount();
  }
}

/**
 * Checks if a 0-based stage index is unlocked.
 */
export function isStageUnlocked(stageIndex: number): boolean {
  return stageIndex < getUnlockedStageCount();
}
