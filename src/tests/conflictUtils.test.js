import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validateCourseData, findConflictingCourse } from '../utils/conflictUtils.js';

describe('conflictUtils - Course Validation & Overlap Detection', () => {
  it('validates complete course data successfully', () => {
    const course = {
      code: '10301361',
      name: 'อินเทอร์เน็ตในทุกสิ่ง',
      day: 'Monday',
      startTime: '10:00',
      endTime: '12:00',
    };
    const res = validateCourseData(course);
    assert.strictEqual(res.isValid, true);
    assert.strictEqual(res.error, null);
  });

  it('rejects course with missing code or name', () => {
    assert.strictEqual(validateCourseData({ name: 'Test', day: 'Monday', startTime: '09:00', endTime: '10:00' }).isValid, false);
    assert.strictEqual(validateCourseData({ code: 'CS101', day: 'Monday', startTime: '09:00', endTime: '10:00' }).isValid, false);
    assert.strictEqual(validateCourseData(null).isValid, false);
  });

  it('rejects course with invalid time interval (start >= end)', () => {
    const res = validateCourseData({
      code: 'CS101',
      name: 'Intro CS',
      day: 'Monday',
      startTime: '12:00',
      endTime: '10:00',
    });
    assert.strictEqual(res.isValid, false);
    assert.match(res.error, /เวลาเลิกเรียนต้องมากกว่า/);
  });

  it('detects overlapping courses on the same day', () => {
    const existingCourses = [
      {
        id: 'c1',
        code: '10301361',
        name: 'IoT',
        day: 'Monday',
        startTime: '10:00',
        endTime: '12:00',
      },
    ];

    // Completely inside existing interval (10:30 - 11:30)
    const insideCourse = {
      code: 'CS102',
      name: 'OOP',
      day: 'Monday',
      startTime: '10:30',
      endTime: '11:30',
    };
    assert.notStrictEqual(findConflictingCourse(insideCourse, existingCourses), null);

    // Overlapping start (09:00 - 11:00)
    const overlapStart = {
      code: 'CS103',
      name: 'Data',
      day: 'Monday',
      startTime: '09:00',
      endTime: '11:00',
    };
    assert.notStrictEqual(findConflictingCourse(overlapStart, existingCourses), null);
  });

  it('allows adjacent courses touching boundaries without conflict', () => {
    const existingCourses = [
      {
        id: 'c1',
        code: '10301361',
        name: 'IoT',
        day: 'Monday',
        startTime: '10:00',
        endTime: '12:00',
      },
    ];

    // Ends exactly when existing starts (08:00 - 10:00) -> NO conflict
    const beforeCourse = {
      code: 'GEN101',
      name: 'English',
      day: 'Monday',
      startTime: '08:00',
      endTime: '10:00',
    };
    assert.strictEqual(findConflictingCourse(beforeCourse, existingCourses), null);

    // Starts exactly when existing ends (12:00 - 14:00) -> NO conflict
    const afterCourse = {
      code: 'MATH101',
      name: 'Calculus',
      day: 'Monday',
      startTime: '12:00',
      endTime: '14:00',
    };
    assert.strictEqual(findConflictingCourse(afterCourse, existingCourses), null);
  });

  it('allows same time on different days', () => {
    const existingCourses = [
      {
        id: 'c1',
        code: '10301361',
        name: 'IoT',
        day: 'Monday',
        startTime: '10:00',
        endTime: '12:00',
      },
    ];

    const tuesdayCourse = {
      code: '10301347',
      name: 'DevOps',
      day: 'Tuesday',
      startTime: '10:00',
      endTime: '12:00',
    };
    assert.strictEqual(findConflictingCourse(tuesdayCourse, existingCourses), null);
  });

  it('ignores self ID when editing an existing course', () => {
    const existingCourses = [
      {
        id: 'c1',
        code: '10301361',
        name: 'IoT',
        day: 'Monday',
        startTime: '10:00',
        endTime: '12:00',
      },
    ];

    const updatedC1 = {
      code: '10301361',
      name: 'IoT Updated',
      day: 'Monday',
      startTime: '10:00',
      endTime: '12:00',
    };
    assert.strictEqual(findConflictingCourse(updatedC1, existingCourses, 'c1'), null);
  });
});
