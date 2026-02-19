/* ------------------------------------------------------------------
       System clock (24h format)
    ------------------------------------------------------------------ */

/**
 * Updates the clock element with the current time.
 * 
 * @remarks
 * Retrieves the current system time and formats it as HH:MM (24-hour format).
 * The time is displayed in the element with ID 'clock'.
 * If the clock element is not found, the function exits silently.
 * 
 * @example
 * ```typescript
 * updateClock(); // Updates the clock display immediately
 * ```
 */
function updateClock(): void {
  const clockEl = document.getElementById('clock');
  if (!clockEl) {
    console.warn('[Clock] updateClock: clock element not found');
    return;
  }

  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  
  clockEl.textContent = `${hours}:${minutes}`;
  
  console.log(`[Clock] updateClock: time updated to ${hours}:${minutes}`);
}

/**
 * Initializes the system clock.
 * 
 * @remarks
 * Sets up the clock by performing an initial update and then
 * establishing an interval to update the clock every second.
 * This function should be called once when the application starts.
 * 
 * @example
 * ```typescript
 * initClock(); // Starts the clock updates
 * ```
 */
function initClock(): void {
  console.log('[Clock] initClock: initializing system clock');
  
  updateClock();
  
  // Set up interval for periodic updates (every 1000ms = 1 second)
  setInterval(() => {
    updateClock();
  }, 1000);
  
  console.log('[Clock] initClock: clock fully initialized, updates scheduled every second');
}

// Export functions
export { updateClock, initClock };