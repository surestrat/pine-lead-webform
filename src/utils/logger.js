/**
 * Simple logging utility with different log levels
 * and the ability to enable/disable logging in production
 */
const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

// Set minimum log level based on environment
// In production, only show warnings and errors by default
const DEFAULT_MIN_LEVEL = import.meta.env.PROD ? LOG_LEVELS.WARN : LOG_LEVELS.DEBUG;

// Allow override with local storage setting
const getSavedLogLevel = () => {
  try {
    return parseInt(localStorage.getItem('appLogLevel'), 10);
  } catch (e) {
    return null;
  }
};

class Logger {
  constructor() {
    this.minLevel = getSavedLogLevel() ?? DEFAULT_MIN_LEVEL;
    this.enabled = true;
  }

  /**
   * Enable or disable all logging
   * @param {boolean} isEnabled Whether logging should be enabled
   */
  setEnabled(isEnabled) {
    this.enabled = Boolean(isEnabled);
    return this;
  }

  /**
   * Set the minimum log level
   * @param {number} level Minimum log level (0=DEBUG, 1=INFO, 2=WARN, 3=ERROR)
   */
  setLevel(level) {
    this.minLevel = level;
    try {
      localStorage.setItem('appLogLevel', level.toString());
    } catch (e) {
      // Ignore storage errors
    }
    return this;
  }

  /**
   * Log a debug message (level 0)
   * @param {string} message Message to log
   * @param {any} data Additional data to log
   */
  debug(message, data) {
    this._log(LOG_LEVELS.DEBUG, message, data, 'debug', '#6b7280');
  }

  /**
   * Log an info message (level 1)
   * @param {string} message Message to log
   * @param {any} data Additional data to log
   */
  info(message, data) {
    this._log(LOG_LEVELS.INFO, message, data, 'info', '#2563eb');
  }

  /**
   * Log a warning message (level 2)
   * @param {string} message Message to log
   * @param {any} data Additional data to log
   */
  warn(message, data) {
    this._log(LOG_LEVELS.WARN, message, data, 'warn', '#d97706');
  }

  /**
   * Log an error message (level 3)
   * @param {string} message Message to log
   * @param {any} data Additional data to log
   */
  error(message, data) {
    this._log(LOG_LEVELS.ERROR, message, data, 'error', '#dc2626');
  }

  /**
   * Generic log method - alias for info
   */
  log(message, data) {
    this.info(message, data);
  }

  /**
   * Internal logging method
   */
  _log(level, message, data, method, color) {
    if (!this.enabled || level < this.minLevel) return;

    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    const prefix = `%c[${timestamp}]`;
    
    if (data !== undefined) {
      console[method](
        `${prefix} ${message}`, 
        `color: ${color}; font-weight: bold;`,
        data
      );
    } else {
      console[method](
        `${prefix} ${message}`,
        `color: ${color}; font-weight: bold;`
      );
    }
  }
}

// Create and export a singleton instance
export const logger = new Logger();

// Add window debug helper in development
if (!import.meta.env.PROD) {
  window.logger = logger;
}

export default logger;
