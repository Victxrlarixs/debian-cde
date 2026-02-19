/* ------------------------------------------------------------------
       System clock (24h format) - Optimized version
    ------------------------------------------------------------------ */

// Store interval ID to be able to clear it if needed
let clockInterval: number | null = null;
let lastTimeString: string = '';

/**
 * Updates the clock element with the current time.
 * Only updates if the time has actually changed.
 *
 * @remarks
 * Retrieves the current system time and formats it as HH:MM (24-hour format).
 * The time is displayed in the element with ID 'clock'.
 * If the clock element is not found, the function exits silently.
 *
 * @example
 * ```typescript
 * updateClock(); // Updates the clock display if time changed
 * ```
 */
function updateClock(): void {
  const clockEl = document.getElementById('clock');
  if (!clockEl) {
    // Solo loggear una vez para no spam
    if (!(window as any)._clockWarningLogged) {
      console.warn('[Clock] updateClock: clock element not found');
      (window as any)._clockWarningLogged = true;
    }
    return;
  }

  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const timeString = `${hours}:${minutes}`;

  // Solo actualizar DOM si el tiempo cambió
  if (timeString !== lastTimeString) {
    clockEl.textContent = timeString;
    lastTimeString = timeString;
    console.log(`[Clock] updateClock: time updated to ${timeString}`);
  }
}

/**
 * Initializes the system clock with performance optimizations.
 *
 * @remarks
 * Sets up the clock by performing an initial update and then
 * establishing an interval to update the clock every second.
 * Includes cleanup function to properly dispose when not needed.
 * Only updates DOM when the time actually changes.
 *
 * @example
 * ```typescript
 * initClock(); // Starts the clock updates
 * ```
 */
function initClock(): void {
  console.log('[Clock] initClock: initializing system clock');

  // Clear any existing interval first (prevents duplicates)
  if (clockInterval !== null) {
    clearInterval(clockInterval);
    console.log('[Clock] initClock: cleared previous interval');
  }

  // Initial update
  updateClock();

  // Use requestAnimationFrame for better performance when tab is inactive
  // Fallback to setInterval for browsers that don't support it well
  if (typeof requestAnimationFrame === 'function') {
    let lastUpdate = Date.now();

    function tick() {
      const now = Date.now();
      // Update every second, but don't hammer the CPU
      if (now - lastUpdate >= 1000) {
        updateClock();
        lastUpdate = now;
      }
      clockInterval = requestAnimationFrame(tick) as any;
    }

    clockInterval = requestAnimationFrame(tick) as any;
  } else {
    // Fallback to setInterval for older browsers
    clockInterval = setInterval(() => {
      updateClock();
    }, 1000) as any;
  }

  // Add cleanup function to window for proper disposal
  (window as any).cleanupClock = () => {
    if (clockInterval !== null) {
      if (typeof clockInterval === 'number') {
        cancelAnimationFrame(clockInterval);
      } else {
        clearInterval(clockInterval);
      }
      clockInterval = null;
      console.log('[Clock] cleanupClock: clock interval cleared');
    }
  };

  console.log('[Clock] initClock: clock fully initialized with performance optimizations');
}

/**
 * Cleans up clock resources.
 * Call this when the application is shutting down or clock is no longer needed.
 */
function cleanupClock(): void {
  if (clockInterval !== null) {
    if (typeof clockInterval === 'number') {
      cancelAnimationFrame(clockInterval);
    } else {
      clearInterval(clockInterval);
    }
    clockInterval = null;
    console.log('[Clock] cleanupClock: clock resources cleaned up');
  }
}

// Export functions
export { updateClock, initClock, cleanupClock };
