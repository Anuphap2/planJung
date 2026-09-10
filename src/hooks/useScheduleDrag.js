import { useState, useEffect, useCallback } from 'react';
import { DAYS, START_HOUR, END_HOUR, PIXELS_PER_HOUR, ROW_HEIGHT } from '../constants/colors';
import { timeToMinutes, minutesToTime, getDurationMinutes } from '../utils/timeUtils';

/**
 * Custom Hook to handle schedule course dragging with grid snapping & collision detection.
 */
export const useScheduleDrag = ({ updateCourse, checkConflict, onAlert }) => {
  const [dragState, setDragState] = useState({
    isDragging: false,
    courseId: null,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    originalCourse: null,
  });

  const handleDragStart = useCallback((e, course) => {
    if (!course) return;
    e.stopPropagation();

    // Prevent text selection during drag
    if (e.preventDefault) {
      e.preventDefault();
    }

    setDragState({
      isDragging: true,
      courseId: course.id,
      startX: e.clientX,
      startY: e.clientY,
      currentX: e.clientX,
      currentY: e.clientY,
      originalCourse: course,
    });
  }, []);

  const handleDrop = useCallback(() => {
    const { startX, startY, currentX, currentY, originalCourse } = dragState;

    if (!originalCourse) {
      setDragState({
        isDragging: false,
        courseId: null,
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        originalCourse: null,
      });
      return;
    }

    const deltaX = currentX - startX;
    const deltaY = currentY - startY;

    // Only apply change if moved more than 4px
    if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
      // Calculate row (Day) change
      const rowChange = Math.round(deltaY / ROW_HEIGHT);
      const currentDayIdx = DAYS.indexOf(originalCourse.day);
      let newDayIdx = currentDayIdx !== -1 ? currentDayIdx + rowChange : 0;
      newDayIdx = Math.max(0, Math.min(DAYS.length - 1, newDayIdx));

      // Calculate time change (snap to 30 minutes)
      const minChange = Math.round((deltaX / PIXELS_PER_HOUR) * 60 / 30) * 30;
      const oldStart = timeToMinutes(originalCourse.startTime);
      const duration = getDurationMinutes(originalCourse.startTime, originalCourse.endTime);

      let newStart = oldStart + minChange;
      let newEnd = newStart + duration;

      const minDayMinutes = START_HOUR * 60;
      const maxDayMinutes = END_HOUR * 60;

      // Bound within schedule hours
      if (newStart < minDayMinutes) {
        newStart = minDayMinutes;
        newEnd = newStart + duration;
      }
      if (newEnd > maxDayMinutes) {
        newEnd = maxDayMinutes;
        newStart = Math.max(minDayMinutes, newEnd - duration);
      }

      const candidateCourse = {
        ...originalCourse,
        day: DAYS[newDayIdx],
        startTime: minutesToTime(newStart),
        endTime: minutesToTime(newEnd),
      };

      // Check conflict
      const conflict = checkConflict ? checkConflict(candidateCourse, originalCourse.id) : null;

      if (!conflict) {
        updateCourse(originalCourse.id, candidateCourse);
        if (onAlert) {
          onAlert({
            open: true,
            message: `ย้ายวิชา ${candidateCourse.code} เรียบร้อย`,
            severity: 'success',
          });
        }
      } else {
        if (onAlert) {
          onAlert({
            open: true,
            message: `ไม่สามารถย้ายได้: เวลาชนกับ ${conflict.code} (${conflict.name})`,
            severity: 'error',
          });
        }
      }
    }

    setDragState({
      isDragging: false,
      courseId: null,
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0,
      originalCourse: null,
    });
  }, [dragState, updateCourse, checkConflict, onAlert]);

  // Window listeners during active drag
  useEffect(() => {
    if (!dragState.isDragging) return;

    const handleMouseMove = (e) => {
      setDragState(prev => ({
        ...prev,
        currentX: e.clientX,
        currentY: e.clientY,
      }));
    };

    const handleMouseUp = () => {
      handleDrop();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragState.isDragging, handleDrop]);

  return {
    dragState,
    handleDragStart,
    isDraggingCourse: (id) => dragState.isDragging && dragState.courseId === id,
  };
};
