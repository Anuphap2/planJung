import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  timeToMinutes,
  minutesToTime,
  isValidTimeRange,
  getDurationMinutes,
  formatTimeRange,
} from '../utils/timeUtils.js';

describe('timeUtils - Boundary & Value Analysis', () => {
  it('converts valid HH:mm time to minutes', () => {
    assert.strictEqual(timeToMinutes('00:00'), 0);
    assert.strictEqual(timeToMinutes('08:30'), 510);
    assert.strictEqual(timeToMinutes('12:00'), 720);
    assert.strictEqual(timeToMinutes('23:59'), 1439);
  });

  it('safely handles null, undefined, and malformed time strings', () => {
    assert.strictEqual(timeToMinutes(null), 0);
    assert.strictEqual(timeToMinutes(undefined), 0);
    assert.strictEqual(timeToMinutes(''), 0);
    assert.strictEqual(timeToMinutes('invalid'), 0);
    assert.strictEqual(timeToMinutes('12'), 0);
  });

  it('converts minutes to HH:mm string', () => {
    assert.strictEqual(minutesToTime(0), '00:00');
    assert.strictEqual(minutesToTime(510), '08:30');
    assert.strictEqual(minutesToTime(720), '12:00');
    assert.strictEqual(minutesToTime(null), '00:00');
    assert.strictEqual(minutesToTime(undefined), '00:00');
  });

  it('validates time ranges correctly', () => {
    assert.strictEqual(isValidTimeRange('09:00', '12:00'), true);
    assert.strictEqual(isValidTimeRange('12:00', '09:00'), false);
    assert.strictEqual(isValidTimeRange('10:00', '10:00'), false);
    assert.strictEqual(isValidTimeRange(null, '12:00'), false);
    assert.strictEqual(isValidTimeRange('09:00', null), false);
  });

  it('computes exact duration in minutes', () => {
    assert.strictEqual(getDurationMinutes('10:00', '12:00'), 120);
    assert.strictEqual(getDurationMinutes('09:00', '12:00'), 180);
    assert.strictEqual(getDurationMinutes('12:00', '09:00'), 0);
    assert.strictEqual(getDurationMinutes(null, '12:00'), 0);
  });

  it('formats time range cleanly', () => {
    assert.strictEqual(formatTimeRange('09:00', '12:00'), '09:00 - 12:00');
    assert.strictEqual(formatTimeRange(null, '12:00'), '');
  });
});
