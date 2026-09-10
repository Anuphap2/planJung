/**
 * Safe LocalStorage and URL Sharing Utilities.
 * Fully handles Unicode characters (such as Thai strings) and guards against null/corrupted data.
 */

const STORAGE_KEY = 'planjung_schedule';
const LEGACY_STORAGE_KEY = 'mySchedule';

/**
 * Loads schedule from localStorage safely.
 * Checks null, parse errors, and migrates legacy key if present.
 * @returns {Array<object>}
 */
export const loadScheduleFromStorage = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!data) return [];

    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) return [];

    // Filter out invalid or null items
    return parsed.filter(item => item && typeof item === 'object' && item.id && item.day);
  } catch (error) {
    console.error('Error loading schedule from localStorage:', error);
    return [];
  }
};

/**
 * Saves schedule to localStorage safely.
 * @param {Array<object>|null|undefined} courses
 * @returns {boolean}
 */
export const saveScheduleToStorage = (courses) => {
  try {
    if (!Array.isArray(courses)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      return true;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
    return true;
  } catch (error) {
    console.error('Error saving schedule to localStorage:', error);
    return false;
  }
};

/**
 * Encodes courses array into a safe Base64 string for URL sharing.
 * Safely supports Unicode characters (Thai language).
 * @param {Array<object>} courses
 * @returns {string}
 */
export const encodeScheduleForShare = (courses) => {
  try {
    if (!Array.isArray(courses) || courses.length === 0) {
      return '';
    }

    const cleanCourses = courses.filter(c => c && typeof c === 'object');
    const jsonStr = JSON.stringify(cleanCourses);

    // Unicode safe Base64 encode
    const utf8Bytes = encodeURIComponent(jsonStr).replace(/%([0-9A-F]{2})/g, (_, p1) => {
      return String.fromCharCode(parseInt(p1, 16));
    });

    return btoa(utf8Bytes);
  } catch (error) {
    console.error('Error encoding schedule for share:', error);
    return '';
  }
};

/**
 * Decodes a Base64 share string back into a courses array.
 * Safely supports Unicode characters and checks for corruption.
 * @param {string|null|undefined} encodedStr
 * @returns {Array<object>|null} Decoded courses or null if invalid
 */
export const decodeScheduleFromShare = (encodedStr) => {
  if (!encodedStr || typeof encodedStr !== 'string') {
    return null;
  }

  try {
    const rawBytes = atob(encodedStr);
    const jsonStr = decodeURIComponent(
      Array.prototype.map.call(rawBytes, (c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join('')
    );

    const parsed = JSON.parse(jsonStr);
    if (!Array.isArray(parsed)) {
      return null;
    }

    return parsed.filter(item => item && typeof item === 'object' && item.day && item.startTime);
  } catch (error) {
    console.error('Error decoding shared schedule:', error);
    return null;
  }
};
