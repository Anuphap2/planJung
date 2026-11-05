/**
 * Safe LocalStorage and URL Sharing Utilities.
 * Fully handles Unicode characters (such as Thai strings) and guards against null/corrupted data.
 */

const STORAGE_KEY = 'planjung_schedule';
const LEGACY_STORAGE_KEY = 'mySchedule';
const COURSE_LIBRARY_KEY = 'planjung_course_library';

/**
 * Standard starter course templates for quick addition
 */
export const DEFAULT_COURSE_TEMPLATES = [
  {
    code: '10301361',
    name: 'อินเทอร์เน็ตในทุกสิ่ง (Internet of Things)',
    room: 'Lab 402',
    colorIndex: 0,
    startTime: '10:00',
    endTime: '12:00',
  },
  {
    code: '10301347',
    name: 'วิศวกรรมการพัฒนาปฏิบัติการบนคลาวด์ (Cloud DevOps)',
    room: 'อาคาร 3 ชั้น 5',
    colorIndex: 2,
    startTime: '09:00',
    endTime: '12:00',
  },
  {
    code: 'GEN101',
    name: 'ภาษาอังกฤษเพื่อการสื่อสาร (English Communication)',
    room: 'อาคารเรียนรวม 1',
    colorIndex: 1,
    startTime: '09:00',
    endTime: '12:00',
  },
  {
    code: 'MATH101',
    name: 'แคลคูลัสสำหรับวิศวกรรม (Calculus I)',
    room: 'ห้อง 201',
    colorIndex: 4,
    startTime: '13:00',
    endTime: '16:00',
  },
  {
    code: 'CS102',
    name: 'การเขียนโปรแกรมเชิงวัตถุ (OOP & Data Structures)',
    room: 'Lab Com 1',
    colorIndex: 5,
    startTime: '13:00',
    endTime: '16:00',
  },
];

/**
 * Sample complete timetable for quick preview / demo
 */
export const SAMPLE_SCHEDULE = [
  {
    id: 'sample-1',
    code: '10301361',
    name: 'อินเทอร์เน็ตในทุกสิ่ง (บรรยาย)',
    day: 'Monday',
    startTime: '10:00',
    endTime: '12:00',
    room: 'ห้อง 402',
    colorIndex: 0,
  },
  {
    id: 'sample-2',
    code: '10301347',
    name: 'วิศวกรรมการพัฒนาปฏิบัติการบนคลาวด์',
    day: 'Tuesday',
    startTime: '09:00',
    endTime: '12:00',
    room: 'อาคาร 3 ชั้น 5',
    colorIndex: 2,
  },
  {
    id: 'sample-3',
    code: '10301361',
    name: 'อินเทอร์เน็ตในทุกสิ่ง (ปฏิบัติการ Lab)',
    day: 'Wednesday',
    startTime: '13:00',
    endTime: '16:00',
    room: 'Lab IoT ชั้น 4',
    colorIndex: 0,
  },
  {
    id: 'sample-4',
    code: 'GEN101',
    name: 'ภาษาอังกฤษเพื่อการสื่อสาร',
    day: 'Thursday',
    startTime: '09:00',
    endTime: '12:00',
    room: 'อาคารเรียนรวม 1',
    colorIndex: 1,
  },
  {
    id: 'sample-5',
    code: 'MATH101',
    name: 'แคลคูลัสสำหรับวิศวกรรม',
    day: 'Friday',
    startTime: '13:00',
    endTime: '15:00',
    room: 'ห้อง 201',
    colorIndex: 4,
  },
];

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
 * Loads saved course library / templates from localStorage.
 * @returns {Array<object>}
 */
export const loadCourseLibrary = () => {
  try {
    const data = localStorage.getItem(COURSE_LIBRARY_KEY);
    if (!data) return DEFAULT_COURSE_TEMPLATES;
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_COURSE_TEMPLATES;
  } catch {
    return DEFAULT_COURSE_TEMPLATES;
  }
};

/**
 * Saves course library to localStorage safely.
 * @param {Array<object>} library
 */
export const saveCourseLibrary = (library) => {
  try {
    if (Array.isArray(library)) {
      localStorage.setItem(COURSE_LIBRARY_KEY, JSON.stringify(library));
      return true;
    }
  } catch (e) {
    console.error('Error saving course library:', e);
  }
  return false;
};

/**
 * Upserts a course definition into the persistent course library.
 * Keeps library updated with the user's latest courses.
 * @param {object} course
 */
export const upsertCourseLibrary = (course) => {
  if (!course || !course.code || !course.name) return;
  try {
    const current = loadCourseLibrary();
    const cleanCode = course.code.trim().toUpperCase();
    const existingIndex = current.findIndex(
      item => item.code.trim().toUpperCase() === cleanCode
    );

    const updatedItem = {
      code: cleanCode,
      name: course.name.trim(),
      room: course.room ? course.room.trim() : '',
      colorIndex: typeof course.colorIndex === 'number' ? course.colorIndex : 0,
      startTime: course.startTime || '09:00',
      endTime: course.endTime || '12:00',
    };

    let nextLibrary;
    if (existingIndex >= 0) {
      nextLibrary = [...current];
      nextLibrary[existingIndex] = updatedItem;
    } else {
      nextLibrary = [updatedItem, ...current];
    }

    saveCourseLibrary(nextLibrary.slice(0, 50)); // cap at 50 courses
  } catch (err) {
    console.error('Error upserting to course library:', err);
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
