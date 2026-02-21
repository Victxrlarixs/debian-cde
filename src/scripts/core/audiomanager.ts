// src/scripts/core/audiomanager.ts
import { CONFIG } from './config';
import { logger } from '../utilities/logger';

export interface IAudioManager {
  beep(): void;
  click(): void;
  error(): void;
  success(): void;
  windowOpen(): void;
  windowClose(): void;
  setVolume(volume: number): void;
}

declare global {
  interface Window {
    AudioManager: IAudioManager;
  }
}

/**
 * Retrô Audio Manager for Debian CDE simulation.
 * Manages classic system sounds using the Web Audio API.
 */
export const AudioManager = (() => {
  let audioCtx: AudioContext | null = null;
  let masterGain: GainNode | null = null;

  /**
   * Initializes the audio context and master gain node.
   * Due to autoplay policies, this is typically called after a user gesture.
   */
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
      
      // Initial volume from CONFIG
      masterGain.gain.value = CONFIG.AUDIO.BEEP_GAIN;
      
      logger.log('[AudioManager] Audio system initialized');
    } catch (err) {
      logger.error('[AudioManager] Initialization failed:', err);
    }
  }

  /**
   * Ensures the audio context is running.
   */
  async function ensureContext(): Promise<boolean> {
    if (!audioCtx) init();
    if (!audioCtx) return false;

    if (audioCtx.state === 'suspended') {
      await audioCtx.resume();
    }
    return true;
  }

  /**
   * Plays a simple tone.
   */
  async function playTone(freq: number, duration: number, type: OscillatorType = 'sine', volume: number = 1.0): Promise<void> {
    if (!(await ensureContext()) || !audioCtx || !masterGain) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    // Apply specific volume relative to master gain
    gain.gain.setValueAtTime(volume, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  }

  return {
    /**
     * Classic system beep.
     */
    beep(): void {
      playTone(CONFIG.AUDIO.BEEP_FREQUENCY, CONFIG.AUDIO.BEEP_DURATION, 'square', 0.5);
    },

    /**
     * Short sharp click for UI interactions.
     */
    click(): void {
      playTone(1200, 0.05, 'sine', 0.3);
    },

    /**
     * Error/Warning sound (double beep low pitch).
     */
    error(): void {
      playTone(200, 0.1, 'square', 0.4);
      setTimeout(() => playTone(150, 0.2, 'square', 0.4), 120);
    },

    /**
     * Success sound (rising pitch).
     */
    success(): void {
      playTone(600, 0.1, 'sine', 0.4);
      setTimeout(() => playTone(800, 0.15, 'sine', 0.4), 100);
    },

    /**
     * Window "pop" sound.
     */
    windowOpen(): void {
      playTone(440, 0.1, 'sine', 0.2);
      setTimeout(() => playTone(880, 0.05, 'sine', 0.2), 50);
    },

    /**
     * Window "close" sound.
     */
    windowClose(): void {
      playTone(880, 0.05, 'sine', 0.2);
      setTimeout(() => playTone(440, 0.1, 'sine', 0.2), 50);
    },

    /**
     * Update global volume.
     * @param volume 0.0 to 1.0
     */
    setVolume(volume: number): void {
      if (masterGain) {
        masterGain.gain.setValueAtTime(volume, audioCtx?.currentTime || 0);
        logger.log(`[AudioManager] Volume set to: ${volume}`);
      }
    }
  };
})();

// Global Exposure
if (typeof window !== 'undefined') {
  (window as any).AudioManager = AudioManager;
  // Backward compatibility
  (window as any).retroBeep = () => AudioManager.beep();
}
