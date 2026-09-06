import { useCallback, useRef, useState } from 'react';

/**
 * useAIGhost
 * ──────────
 * Simulates an AI opponent in the arena with:
 *  - Realistic decision delays (2–5s based on difficulty)
 *  - Configurable accuracy (Easy 60%, Medium 80%, Hard 92%)
 *  - Live "thinking" status for UI feedback
 *  - Score tracking across rounds
 */

const DIFFICULTY_CONFIG = {
  easy:   { accuracy: 0.60, minDelay: 3000, maxDelay: 5000 },
  medium: { accuracy: 0.80, minDelay: 2000, maxDelay: 4500 },
  hard:   { accuracy: 0.92, minDelay: 1500, maxDelay: 3500 },
};

export function useAIGhost({ difficulty = 'medium' } = {}) {
  const [ghostAnswer, setGhostAnswer]   = useState(null);   // index of selected option
  const [ghostStatus, setGhostStatus]   = useState('idle'); // idle | thinking | answered
  const [ghostScore,  setGhostScore]    = useState(0);
  const timeoutRef = useRef(null);

  const config = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.medium;

  /**
   * startThinking — call at the start of each question
   * @param {number} correctIndex    - index of correct option
   * @param {number} optionsCount    - total options available (default 4)
   * @param {number} questionTimeMs  - time limit for the question in ms (default 15000)
   */
  const startThinking = useCallback(
    (correctIndex, optionsCount = 4, questionTimeMs = 15000) => {
      setGhostStatus('thinking');
      setGhostAnswer(null);

      // Random delay within difficulty band, but never exceeding question timer
      const rawDelay = config.minDelay + Math.random() * (config.maxDelay - config.minDelay);
      const delay    = Math.min(rawDelay, questionTimeMs - 500);

      timeoutRef.current = setTimeout(() => {
        let answer;
        if (Math.random() < config.accuracy) {
          // Correct answer
          answer = correctIndex;
        } else {
          // Pick a wrong option randomly
          const wrongOptions = Array.from({ length: optionsCount }, (_, i) => i)
            .filter(i => i !== correctIndex);
          answer = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
        }

        setGhostAnswer(answer);
        setGhostStatus('answered');

        // Award XP if ghost got it right
        if (answer === correctIndex) {
          setGhostScore(prev => prev + 10);
        }
      }, delay);
    },
    [config]
  );

  /**
   * resetRound — call before each new question
   */
  const resetRound = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setGhostAnswer(null);
    setGhostStatus('idle');
  }, []);

  /**
   * resetMatch — call when starting a new match
   */
  const resetMatch = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setGhostAnswer(null);
    setGhostStatus('idle');
    setGhostScore(0);
  }, []);

  return {
    ghostAnswer,
    ghostStatus,   // 'idle' | 'thinking' | 'answered'
    ghostScore,
    startThinking,
    resetRound,
    resetMatch,
    isThinking: ghostStatus === 'thinking',
    hasAnswered: ghostStatus === 'answered',
  };
}
