// src/scripts/core/audiomanager.ts
import { CONFIG } from './config';
import { logger } from '../utilities/logger';

export interface IAudioManager {
  beep(frequency?: number, duration?: number): void;
  click(): void;
  error(): void;
  success(): void;
  windowOpen(): void;
  windowClose(): void;
  setVolume(volume: number): void;
  playMelody(notes: Array<{ freq: number; duration: number; type?: OscillatorType; delay?: number }>): Promise<void>;
  playStartupChime(): void;
  playThemeMelody(): void;
}

declare global {
  interface Window {
    AudioManager: IAudioManager;
    retroBeep: () => void;
  }
}

/**
 * Retrô Audio Manager for Debian CDE simulation.
 * Manages classic system sounds using the Web Audio API.
 *
 * FIX: AudioContext is now lazily created on the FIRST user gesture,
 * which is required by modern browser autoplay policies.
 */
export const AudioManager = (() => {
  let audioCtx: AudioContext | null = null;
  let masterGain: GainNode | null = null;

  function init(): void {
    if (audioCtx) return;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) {
        logger.warn('[AudioManager] Web Audio API not supported');
        return;
      }

      audioCtx = new AudioContextClass();
      masterGain = audioCtx.createGain();
      masterGain.connect(audioCtx.destination);
      masterGain.gain.value = CONFIG.AUDIO.BEEP_GAIN;

      logger.log('[AudioManager] Audio system initialized');
    } catch (err) {
      logger.error('[AudioManager] Initialization failed:', err);
    }
  }

  async function ensureContext(): Promise<boolean> {
    // Context does not exist yet — cannot create without user gesture
    if (!audioCtx) return false;

    if (audioCtx.state === 'suspended') {
      try {
        await audioCtx.resume();
      } catch (e) {
        return false;
      }
    }
    return audioCtx.state === 'running';
  }

  // ── Lazy unlock: AudioContext is created on the very first user interaction ──
  if (typeof window !== 'undefined') {
    const removeListeners = () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };

    function unlock() {
      if (!audioCtx) {
        // Create context INSIDE user gesture — browser allows this
        init();
      }
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume()
          .then(() => {
            logger.log('[AudioManager] AudioContext unlocked via user gesture');
            removeListeners();
          })
          .catch(() => {});
      } else if (audioCtx && audioCtx.state === 'running') {
        removeListeners();
      }
    }

    window.addEventListener('pointerdown', unlock);
    window.addEventListener('keydown', unlock);
  }

  function playTone(freq: number, duration: number, type: OscillatorType = 'sine', volume: number = 1.0): void {
    if (!audioCtx || audioCtx.state !== 'running') {
      ensureContext();
      return;
    }

    if (!masterGain) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gain.gain.setValueAtTime(volume, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  }

  const manager: IAudioManager = {
    beep(frequency?: number, duration?: number): void {
      const freq = frequency || CONFIG.AUDIO.BEEP_FREQUENCY;
      const dur = duration || CONFIG.AUDIO.BEEP_DURATION;
      playTone(freq, dur, 'square', 0.5);
    },

    click(): void {
      playTone(1200, 0.05, 'sine', 0.3);
    },

    error(): void {
      this.playMelody([
        { freq: 200, duration: 0.1, type: 'square', delay: 0 },
        { freq: 150, duration: 0.2, type: 'square', delay: 120 }
      ]);
    },

    success(): void {
      this.playMelody([
        { freq: 600, duration: 0.1, type: 'sine', delay: 0 },
        { freq: 800, duration: 0.15, type: 'sine', delay: 100 }
      ]);
    },

    windowOpen(): void {
      this.playMelody([
        { freq: 440, duration: 0.1, type: 'sine', delay: 0 },
        { freq: 880, duration: 0.05, type: 'sine', delay: 50 }
      ]);
    },

    windowClose(): void {
      this.playMelody([
        { freq: 880, duration: 0.05, type: 'sine', delay: 0 },
        { freq: 440, duration: 0.1, type: 'sine', delay: 50 }
      ]);
    },

    setVolume(volume: number): void {
      if (masterGain) {
        masterGain.gain.setValueAtTime(volume, audioCtx?.currentTime || 0);
        logger.log(`[AudioManager] Volume set to: ${volume}`);
      }
    },

    async playMelody(notes): Promise<void> {
      for (const note of notes) {
        if (note.delay) {
          await new Promise(resolve => setTimeout(resolve, note.delay));
        }
        playTone(note.freq, note.duration, note.type || 'sine', 0.4);
      }
    },

    playStartupChime(): void {
      this.playMelody([
        { freq: 392.00, duration: 0.15, type: 'sine' },          // G4
        { freq: 523.25, duration: 0.15, type: 'sine', delay: 50 }, // C5
        { freq: 659.25, duration: 0.3,  type: 'sine', delay: 50 }, // E5
      ]);
    },

    playThemeMelody(): void {
      this.playMelody([
        { freq: 261.63, duration: 0.1, type: 'square' },              // C4
        { freq: 329.63, duration: 0.1, type: 'square', delay: 100 },  // E4
        { freq: 392.00, duration: 0.1, type: 'square', delay: 100 },  // G4
        { freq: 523.25, duration: 0.2, type: 'square', delay: 100 },  // C5
        { freq: 392.00, duration: 0.1, type: 'square', delay: 200 },  // G4
        { freq: 523.25, duration: 0.4, type: 'square', delay: 100 },  // C5
      ]);
    }
  };

  return manager;
})();

// Global Exposure
if (typeof window !== 'undefined') {
  window.AudioManager = AudioManager;
}
