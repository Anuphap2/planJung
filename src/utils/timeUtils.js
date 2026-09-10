/**
 * Time utility functions with comprehensive null, undefined, and type safety checks.
 */

/**
 * Converts HH:mm string to minutes from start of day (00:00).
 * Returns 0 if timeStr is null, undefined, or invalid.
 * @param {string|null|undefined} timeStr
 * @returns {number}
 */
export const timeToMinutes = (timeStr) => {
  if (typeof timeStr !== 'string' || !timeStr.trim()) {
    return 0;
  }

  const parts = timeStr.trim().split(':');
  if (parts.length < 2) {
    return 0;
  }

  const hours = Number(parts[0]);
  const minutes = Number(parts[1]);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return 0;
  }

  const safeHours = Math.max(0, Math.min(23, hours));
  const safeMinutes = Math.max(0, Math.min(59, minutes));

  return safeHours * 60 + safeMinutes;
};

/**
 * Converts total minutes from start of day to HH:mm string.
 * @param {number|null|undefined} totalMinutes
 * @returns {string}
 */
export const minutesToTime = (totalMinutes) => {
  if (totalMinutes === null || totalMinutes === undefined || Number.isNaN(totalMinutes)) {
    return '00:00';
  }

  const clamped = Math.max(0, Math.min(1439, Math.round(totalMinutes)));
  const hours = Math.floor(clamped / 60);
  const minutes = clamped % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

/**
 * Checks whether startTime is strictly before endTime.
 * @param {string|null|undefined} startTime
 * @param {string|null|undefined} endTime
 * @returns {boolean}
 */
export const isValidTimeRange = (startTime, endTime) => {
  if (!startTime || !endTime) return false;
  return timeToMinutes(startTime) < timeToMinutes(endTime);
};

/**
 * Calculates duration between two HH:mm strings in minutes.
 * @param {string|null|undefined} startTime
 * @param {string|null|undefined} endTime
 * @returns {number}
 */
export const getDurationMinutes = (startTime, endTime) => {
  if (!startTime || !endTime) return 0;
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);
  return Math.max(0, end - start);
};

/**
 * Formats a time range cleanly, e.g. "09:00 - 12:00"
 * @param {string|null|undefined} startTime
 * @param {string|null|undefined} endTime
 * @returns {string}
 */
export const formatTimeRange = (startTime, endTime) => {
  if (!startTime || !endTime) return '';
  return `${startTime} - ${endTime}`;
};
