import { CONFIG } from '../core/config';
import tutorialSequences from '../../data/tutorial.json';

// ------------------------------------------------------------------
// CONSTANTS AND CONFIGURATION (from CONFIG)
// ------------------------------------------------------------------
const HOME_PATH = CONFIG.TERMINAL.HOME_PATH;
const MIN_TYPING_DELAY = CONFIG.TERMINAL.MIN_TYPING_DELAY;
const MAX_TYPING_DELAY = CONFIG.TERMINAL.MAX_TYPING_DELAY;
const POST_COMMAND_DELAY = CONFIG.TERMINAL.POST_COMMAND_DELAY;
const POST_SEQUENCE_DELAY = CONFIG.TERMINAL.POST_SEQUENCE_DELAY;
const MAX_LINES = CONFIG.TERMINAL.MAX_LINES;
const CLEANUP_INTERVAL = CONFIG.TERMINAL.CLEANUP_INTERVAL;
const SCROLL_INTERVAL = CONFIG.TERMINAL.SCROLL_INTERVAL;
const TRANSITION_MESSAGES = CONFIG.TERMINAL.TRANSITION_MESSAGES;

// ------------------------------------------------------------------
// TYPES
// ------------------------------------------------------------------

/**
 * Represents a single step in a tutorial sequence.
 */
interface TutorialStep {
  /** The username displayed in the prompt */
  user: string;
  /** The command to be typed and executed */
  command: string;
  /** The output displayed after command execution */
  output: string;
}

/**
 * A sequence of tutorial steps.
 */
type TutorialSequence = TutorialStep[];

// ------------------------------------------------------------------
// TUTORIAL SEQUENCES (imported from JSON)
// ------------------------------------------------------------------

/** Array of tutorial sequences loaded from the JSON file */
const TUTORIAL_SEQUENCES: TutorialSequence[] = tutorialSequences;

// ------------------------------------------------------------------
// INTERNAL STATE
// ------------------------------------------------------------------

/** Reference to the terminal body DOM element */
let terminalBody: HTMLElement | null = null;

/** Current working directory path */
let currentPath: string = HOME_PATH;

/** Whether the tutorial is currently active */
let tutorialActive: boolean = false;

/** Index of the current sequence in TUTORIAL_SEQUENCES */
let sequenceIndex: number = 0;

/** Index of the current step within the current sequence */
let stepIndex: number = 0;

/** Whether typing animation is currently in progress */
let typingActive: boolean = false;

/** Interval ID for terminal cleanup operations */
let cleanupInterval: number | undefined;

/** Interval ID for keeping the terminal scrolled to bottom */
let scrollInterval: number | undefined;

/** Timeout ID for pending step execution */
let pendingTimeout: number | undefined;

// ------------------------------------------------------------------
// PRIVATE FUNCTIONS
// ------------------------------------------------------------------

/**
 * Prints text to the terminal body.
 *
 * @param text - The text to print (defaults to empty string)
 * @param className - Optional CSS class to apply to the text
 *
 * @remarks
 * This function appends text to the terminal and automatically scrolls to the bottom.
 * If terminalBody is not available, logs an error and exits.
 */
function print(text: string = '', className: string = ''): void {
  if (!terminalBody) {
    console.error('[TerminalTutorial] print: terminalBody is not available');
    return;
  }

  if (className) {
    terminalBody.innerHTML += `<span class="${className}">${text}</span>\n`;
  } else {
    terminalBody.innerHTML += text + '\n';
  }

  terminalBody.scrollTop = terminalBody.scrollHeight;
}

/**
 * Types a line character by character with a randomized delay.
 *
 * @param line - The line of text to type
 * @param callback - Function to call when typing is complete
 *
 * @remarks
 * Typing speed varies between MIN_TYPING_DELAY and MAX_TYPING_DELAY.
 * If tutorial becomes inactive during typing, the operation is aborted.
 */
function typeLine(line: string, callback: () => void): void {
  if (!terminalBody || !tutorialActive) {
    console.log('[TerminalTutorial] typeLine: aborted - terminal unavailable or tutorial inactive');
    if (callback) setTimeout(callback, 0);
    return;
  }

  let i = 0;
  typingActive = true;

  const interval = setInterval(
    () => {
      if (!tutorialActive) {
        console.log('[TerminalTutorial] typeLine: typing interrupted - tutorial deactivated');
        clearInterval(interval);
        typingActive = false;
        return;
      }

      terminalBody!.innerHTML += line[i];
      terminalBody!.scrollTop = terminalBody!.scrollHeight;
      i++;

      if (i >= line.length) {
        clearInterval(interval);
        terminalBody!.innerHTML += '\n';
        typingActive = false;
        console.log(`[TerminalTutorial] typeLine: completed typing "${line}"`);
        if (callback) callback();
      }
    },
    Math.random() * (MAX_TYPING_DELAY - MIN_TYPING_DELAY) + MIN_TYPING_DELAY
  );
}

/**
 * Executes the current tutorial step.
 *
 * @remarks
 * This function displays the prompt, types the command, shows the output,
 * and advances to the next step or sequence as appropriate.
 * If tutorial becomes inactive, execution is aborted.
 */
function runStep(): void {
  if (!tutorialActive || !terminalBody) {
    console.log('[TerminalTutorial] runStep: aborted - tutorial inactive or terminal unavailable');
    return;
  }

  const sequence = TUTORIAL_SEQUENCES[sequenceIndex];
  const step = sequence[stepIndex];
  const relativePath = currentPath.replace(HOME_PATH, '~');
  const prompt = `${step.user}@Debian:${relativePath}$ `;

  console.log(
    `[TerminalTutorial] runStep: executing sequence ${sequenceIndex + 1}/${TUTORIAL_SEQUENCES.length}, step ${stepIndex + 1}/${sequence.length}`
  );
  console.log(`[TerminalTutorial] runStep: command "${step.command}"`);

  typeLine(prompt + step.command, () => {
    if (!tutorialActive) {
      console.log('[TerminalTutorial] runStep: callback aborted - tutorial inactive');
      return;
    }

    setTimeout(() => {
      if (!tutorialActive) {
        console.log('[TerminalTutorial] runStep: delayed execution aborted - tutorial inactive');
        return;
      }

      print(step.output, 'tip');
      stepIndex++;

      if (stepIndex >= sequence.length) {
        const randomMsg =
          TRANSITION_MESSAGES[Math.floor(Math.random() * TRANSITION_MESSAGES.length)];
        print('\n' + randomMsg + '\n', 'transition');

        sequenceIndex = (sequenceIndex + 1) % TUTORIAL_SEQUENCES.length;
        stepIndex = 0;

        console.log(
          `[TerminalTutorial] runStep: sequence complete, advancing to sequence ${sequenceIndex + 1}`
        );
        pendingTimeout = setTimeout(runStep, POST_SEQUENCE_DELAY);
      } else {
        console.log(
          `[TerminalTutorial] runStep: step complete, advancing to next step in sequence`
        );
        pendingTimeout = setTimeout(runStep, POST_COMMAND_DELAY);
      }
    }, POST_COMMAND_DELAY);
  });
}

/**
 * Cleans up the terminal by removing excess lines.
 *
 * @remarks
 * This function truncates the terminal content when it exceeds MAX_LINES,
 * keeping only the most recent lines.
 */
function cleanupTerminal(): void {
  if (!terminalBody) {
    console.warn('[TerminalTutorial] cleanupTerminal: terminalBody not available');
    return;
  }

  const lines = terminalBody.innerHTML.split('\n');
  if (lines.length > MAX_LINES) {
    terminalBody.innerHTML = lines.slice(-MAX_LINES).join('\n');
    console.log(`[TerminalTutorial] cleanupTerminal: truncated to ${MAX_LINES} lines`);
  }
}

/**
 * Ensures the terminal remains scrolled to the bottom.
 */
function keepScrollBottom(): void {
  if (terminalBody) {
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }
}

// ------------------------------------------------------------------
// PUBLIC API
// ------------------------------------------------------------------

/**
 * Terminal Tutorial module for displaying interactive command-line tutorials.
 *
 * @remarks
 * This module provides functionality to display animated terminal tutorials
 * with typing effects, command execution simulation, and automatic scrolling.
 * It supports multiple tutorial sequences and transitions between them.
 */
export const TerminalTutorial = {
  /**
   * Starts the terminal tutorial in the specified container.
   *
   * @param containerId - ID of the container element where the tutorial will be displayed
   *                     (defaults to 'terminalBody')
   *
   * @remarks
   * If a tutorial is already active, this function does nothing.
   * Initializes intervals for cleanup and scrolling, then begins the first step.
   */
  start(containerId: string = 'terminalBody'): void {
    if (tutorialActive) {
      console.log('[TerminalTutorial] start: tutorial already active, ignoring request');
      return;
    }

    console.log('[TerminalTutorial] start: initializing terminal tutorial');
    terminalBody = document.getElementById(containerId);

    if (!terminalBody) {
      console.error(
        `[TerminalTutorial] start: container element with id "${containerId}" not found`
      );
      return;
    }

    currentPath = HOME_PATH;
    tutorialActive = true;
    sequenceIndex = 0;
    stepIndex = 0;
    typingActive = false;

    // Clear any previous intervals
    if (cleanupInterval) {
      clearInterval(cleanupInterval);
      cleanupInterval = undefined;
    }
    if (scrollInterval) {
      clearInterval(scrollInterval);
      scrollInterval = undefined;
    }
    if (pendingTimeout) {
      clearTimeout(pendingTimeout);
      pendingTimeout = undefined;
    }

    cleanupInterval = setInterval(cleanupTerminal, CLEANUP_INTERVAL);
    scrollInterval = setInterval(keepScrollBottom, SCROLL_INTERVAL);

    print('Linux Man References');
    console.log('[TerminalTutorial] start: tutorial initialized, starting first step in 1 second');

    pendingTimeout = setTimeout(runStep, 1000);
  },

  /**
   * Stops the currently active terminal tutorial.
   *
   * @remarks
   * This function clears all intervals and timeouts, and resets the tutorial state.
   * It does not clear the terminal content.
   */
  stop(): void {
    console.log('[TerminalTutorial] stop: stopping tutorial');
    tutorialActive = false;

    if (cleanupInterval) {
      clearInterval(cleanupInterval);
      cleanupInterval = undefined;
    }
    if (scrollInterval) {
      clearInterval(scrollInterval);
      scrollInterval = undefined;
    }
    if (pendingTimeout) {
      clearTimeout(pendingTimeout);
      pendingTimeout = undefined;
    }

    console.log('[TerminalTutorial] stop: tutorial stopped successfully');
  },
};

// ------------------------------------------------------------------
// Global functions for opening/closing the terminal from HTML
// ------------------------------------------------------------------

declare global {
  interface Window {
    /**
     * Opens the terminal window and starts the tutorial.
     */
    openTerminal: () => void;

    /**
     * Closes the terminal window and stops the tutorial.
     */
    closeTerminal: () => void;

    /**
     * Brings a window to the front (if available).
     */
    focusWindow?: (id: string) => void;
  }
}

/**
 * Global function to open the terminal.
 *
 * @remarks
 * If the terminal is hidden, it is displayed and the tutorial starts.
 * If already visible, it is brought to the front using focusWindow.
 */
window.openTerminal = function openTerminal(): void {
  console.log('[TerminalTutorial] openTerminal: opening terminal window');
  const terminal = document.getElementById('terminal');

  if (!terminal) {
    console.error('[TerminalTutorial] openTerminal: terminal element not found');
    return;
  }

  // If the window is hidden, show it and start the tutorial
  if (terminal.style.display === 'none' || !terminal.style.display) {
    console.log(
      '[TerminalTutorial] openTerminal: terminal was hidden, displaying and starting tutorial'
    );
    terminal.style.display = 'block';
    TerminalTutorial.start();
  } else {
    // If already visible, bring it to the front
    console.log('[TerminalTutorial] openTerminal: terminal already visible, bringing to front');
    if (window.focusWindow) {
      window.focusWindow('terminal');
    } else {
      console.warn('[TerminalTutorial] openTerminal: focusWindow not available');
    }
  }
};

/**
 * Global function to close the terminal.
 *
 * @remarks
 * Hides the terminal element and stops the tutorial.
 */
window.closeTerminal = function closeTerminal(): void {
  console.log('[TerminalTutorial] closeTerminal: closing terminal window');
  const terminal = document.getElementById('terminal');

  if (terminal) {
    terminal.style.display = 'none';
    TerminalTutorial.stop();
    console.log('[TerminalTutorial] closeTerminal: terminal closed');
  } else {
    console.error('[TerminalTutorial] closeTerminal: terminal element not found');
  }
};
