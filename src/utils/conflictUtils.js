import { timeToMinutes } from './timeUtils';

/**
 * Validates course input fields.
 * Checks for missing, null, or invalid fields.
 * @param {object|null|undefined} courseData
 * @returns {{ isValid: boolean, error: string | null }}
 */
export const validateCourseData = (courseData) => {
  if (!courseData || typeof courseData !== 'object') {
    return { isValid: false, error: 'ข้อมูลวิชาต้องไม่เป็นค่าว่าง' };
  }

  const { code, name, day, startTime, endTime } = courseData;

  if (!code || typeof code !== 'string' || !code.trim()) {
    return { isValid: false, error: 'กรุณากรอกรหัสวิชา' };
  }

  if (!name || typeof name !== 'string' || !name.trim()) {
    return { isValid: false, error: 'กรุณากรอกชื่อวิชา' };
  }

  if (!day || typeof day !== 'string' || !day.trim()) {
    return { isValid: false, error: 'กรุณาระบุวันเรียน' };
  }

  if (!startTime || typeof startTime !== 'string' || !startTime.trim()) {
    return { isValid: false, error: 'กรุณาระบุเวลาเริ่มเรียน' };
  }

  if (!endTime || typeof endTime !== 'string' || !endTime.trim()) {
    return { isValid: false, error: 'กรุณาระบุเวลาเลิกเรียน' };
  }

  const startMin = timeToMinutes(startTime);
  const endMin = timeToMinutes(endTime);

  if (startMin >= endMin) {
    return { isValid: false, error: 'เวลาเลิกเรียนต้องมากกว่าเวลาเริ่มเรียน' };
  }

  return { isValid: true, error: null };
};

/**
 * Checks if a course conflicts with any course in the existing courses list.
 * Safely handles null, undefined, and malformed entries.
 *
 * @param {object|null|undefined} newCourse - The course to check
 * @param {Array<object>|null|undefined} existingCourses - The list of current courses
 * @param {string|null|undefined} excludeId - Course ID to ignore (e.g. while editing)
 * @returns {object|null} The conflicting course or null
 */
export const findConflictingCourse = (newCourse, existingCourses, excludeId = null) => {
  if (!newCourse || typeof newCourse !== 'object') {
    return null;
  }

  if (!Array.isArray(existingCourses) || existingCourses.length === 0) {
    return null;
  }

  const { day, startTime, endTime } = newCourse;
  if (!day || !startTime || !endTime) {
    return null;
  }

  const nStart = timeToMinutes(startTime);
  const nEnd = timeToMinutes(endTime);

  for (const course of existingCourses) {
    // Null & type check each course in list
    if (!course || typeof course !== 'object') continue;

    // Skip the current course being edited
    if (excludeId && course.id === excludeId) continue;

    // Check same day
    if (course.day === day) {
      const cStart = timeToMinutes(course.startTime);
      const cEnd = timeToMinutes(course.endTime);

      // Interval overlap condition: (StartA < EndB) and (EndA > StartB)
      if (nStart < cEnd && nEnd > cStart) {
        return course;
      }
    }
  }

  return null;
};
