import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  loadScheduleFromStorage,
  saveScheduleToStorage,
  decodeScheduleFromShare
} from '../utils/scheduleStorage';
import { findConflictingCourse, validateCourseData } from '../utils/conflictUtils';
import { getDurationMinutes, timeToMinutes } from '../utils/timeUtils';

/**
 * Primary Custom Hook for Schedule Management.
 * Provides a clean, simplified, and robust API with strict null and error checks.
 */
export const useSchedule = () => {
  // Initialize state directly from shared URL or localStorage
  const [courses, setCourses] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const sharedData = params.get('schedule');
        if (sharedData) {
          const decoded = decodeScheduleFromShare(sharedData);
          if (decoded && decoded.length > 0) {
            return decoded;
          }
        }
      }
      return loadScheduleFromStorage();
    } catch {
      return [];
    }
  });

  // Clean share parameter from URL after initialization if needed
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        if (params.has('schedule')) {
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    } catch (error) {
      console.error('Failed to clear URL schedule parameter:', error);
    }
  }, []);

  // Sync to local storage whenever courses change
  useEffect(() => {
    saveScheduleToStorage(courses);
  }, [courses]);

  /**
   * Add a new course.
   * Checks validation and conflicts.
   * @param {object} courseData
   * @returns {{ success: boolean, error?: string, conflict?: object, course?: object }}
   */
  const addCourse = useCallback((courseData) => {
    const validation = validateCourseData(courseData);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    const conflict = findConflictingCourse(courseData, courses);
    if (conflict) {
      return { success: false, conflict, error: `เวลาเรียนชนกับวิชา ${conflict.code} ${conflict.name}` };
    }

    const newId = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `course_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const newCourse = {
      ...courseData,
      id: newId,
      colorIndex: typeof courseData.colorIndex === 'number' ? courseData.colorIndex : 0,
      room: courseData.room || '',
    };

    setCourses(prev => [...prev, newCourse]);
    return { success: true, course: newCourse };
  }, [courses]);

  /**
   * Update an existing course.
   * @param {string} id
   * @param {object} updatedData
   * @returns {{ success: boolean, error?: string, conflict?: object }}
   */
  const updateCourse = useCallback((id, updatedData) => {
    if (!id) {
      return { success: false, error: 'ไม่พบรหัสวิชาที่ต้องการแก้ไข' };
    }

    const validation = validateCourseData(updatedData);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    const conflict = findConflictingCourse(updatedData, courses, id);
    if (conflict) {
      return { success: false, conflict, error: `เวลาเรียนชนกับวิชา ${conflict.code} ${conflict.name}` };
    }

    setCourses(prev => prev.map(c => (c.id === id ? { ...updatedData, id } : c)));
    return { success: true };
  }, [courses]);

  /**
   * Delete a course by ID.
   * @param {string} id
   * @returns {{ success: boolean }}
   */
  const deleteCourse = useCallback((id) => {
    if (!id) return { success: false };
    setCourses(prev => prev.filter(c => c && c.id !== id));
    return { success: true };
  }, []);

  /**
   * Clear all courses safely.
   */
  const clearSchedule = useCallback(() => {
    setCourses([]);
    saveScheduleToStorage([]);
    return { success: true };
  }, []);

  /**
   * Replace courses directly (e.g. from imported template or share link).
   * @param {Array<object>} newCourses
   */
  const setAllCourses = useCallback((newCourses) => {
    if (!Array.isArray(newCourses)) return;
    const valid = newCourses.filter(c => c && typeof c === 'object' && c.id && c.day);
    setCourses(valid);
  }, []);

  /**
   * Check conflict for external consumers (like drag-and-drop preview).
   */
  const checkCourseConflict = useCallback((courseData, excludeId = null) => {
    return findConflictingCourse(courseData, courses, excludeId);
  }, [courses]);

  /**
   * Computed Schedule Statistics.
   * Pure calculation with safe null/undefined handling.
   */
  const stats = useMemo(() => {
    if (!Array.isArray(courses) || courses.length === 0) {
      return {
        totalCourses: 0,
        totalMinutes: 0,
        totalHoursFormatted: '0 ชม.',
        activeDaysCount: 0,
        earliestTime: '-',
        latestTime: '-',
      };
    }

    let totalMinutes = 0;
    const activeDays = new Set();
    let minMinutes = 24 * 60;
    let maxMinutes = 0;

    courses.forEach(c => {
      if (!c) return;
      if (c.day) activeDays.add(c.day);

      const duration = getDurationMinutes(c.startTime, c.endTime);
      totalMinutes += duration;

      const sMin = timeToMinutes(c.startTime);
      const eMin = timeToMinutes(c.endTime);

      if (sMin < minMinutes) minMinutes = sMin;
      if (eMin > maxMinutes) maxMinutes = eMin;
    });

    const hours = (totalMinutes / 60).toFixed(1).replace('.0', '');

    return {
      totalCourses: courses.length,
      totalMinutes,
      totalHoursFormatted: `${hours} ชม.`,
      activeDaysCount: activeDays.size,
      earliestTime: minMinutes < 24 * 60 ? courses.find(c => timeToMinutes(c?.startTime) === minMinutes)?.startTime || '-' : '-',
      latestTime: maxMinutes > 0 ? courses.find(c => timeToMinutes(c?.endTime) === maxMinutes)?.endTime || '-' : '-',
    };
  }, [courses]);

  return {
    courses,
    stats,
    addCourse,
    updateCourse,
    deleteCourse,
    clearSchedule,
    setAllCourses,
    checkCourseConflict,
  };
};
