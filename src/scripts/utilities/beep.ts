import { CONFIG } from '../core/config';

// ============================================================================
// Sound utilities (retro beep)
// ============================================================================

// Extend the Window interface to include retroBeep
declare global {
  interface Window {
    AudioContext: typeof AudioContext;
    webkitAudioContext: typeof AudioContext;
    
    /**
     * Plays a retro beep sound using the Web Audio API.
     * Made available globally for HTML onclick compatibility.
     */
    retroBeep: () => void;
  }
}

/**
 * Plays a retro beep sound using the Web Audio API.
 * 
 * @remarks
 * This function creates an audio context and plays a sine wave beep
 * with frequency, gain, and duration configured from CONFIG.AUDIO.
 * It handles audio context suspension and resumption automatically.
 * 
 * The function is exposed globally as window.retroBeep for use in HTML onclick handlers.
 * 
 * @example
 * ```html
 * <button onclick="retroBeep()">Beep</button>
 * ```
 * 
 * @throws Will log an error to the console if audio playback fails,
 *         but will not throw exceptions to the caller.
 */
export function retroBeep(): void {
  console.log('[Beep] retroBeep function called');

  try {
    // Get the appropriate AudioContext constructor (standard or webkit prefixed)
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    
    if (!AudioContextClass) {
      console.error('[Beep] Web Audio API not supported in this browser');
      return;
    }
    
    const audioCtx = new AudioContextClass();

    // Handle suspended audio context (autoplay policy)
    if (audioCtx.state === 'suspended') {
      console.log('[Beep] Audio context suspended, resuming...');
      audioCtx.resume()
        .then(() => {
          console.log('[Beep] Audio context resumed, playing beep');
          playBeep(audioCtx);
        })
        .catch((error) => {
          console.error('[Beep] Failed to resume audio context:', error);
        });
    } else {
      console.log('[Beep] Audio context ready, playing beep');
      playBeep(audioCtx);
    }
    
    console.log('[Beep] Beep played successfully');
  } catch (error) {
    console.error('[Beep] Error playing beep:', error);
  }
}

/**
 * Internal function to generate and play the beep sound.
 * 
 * @param audioCtx - The active AudioContext instance
 * 
 * @remarks
 * Creates an oscillator with a sine wave at the configured frequency,
 * applies gain, and schedules the beep duration.
 */
function playBeep(audioCtx: AudioContext): void {
  try {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    // Configure oscillator
    oscillator.type = 'sine';
    oscillator.frequency.value = CONFIG.AUDIO.BEEP_FREQUENCY;
    
    // Configure gain (volume)
    gainNode.gain.value = CONFIG.AUDIO.BEEP_GAIN;
    
    // Connect nodes: oscillator -> gain -> destination (speakers)
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    // Schedule playback
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + CONFIG.AUDIO.BEEP_DURATION);
    
    console.log(`[Beep] Playing: freq=${CONFIG.AUDIO.BEEP_FREQUENCY}Hz, duration=${CONFIG.AUDIO.BEEP_DURATION}s, gain=${CONFIG.AUDIO.BEEP_GAIN}`);
  } catch (error) {
    console.error('[Beep] Error in playBeep:', error);
    throw error; // Re-throw to be caught by the calling function
  }
}

// Expose globally for HTML onclick compatibility
window.retroBeep = retroBeep;