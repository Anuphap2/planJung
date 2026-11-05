import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  encodeScheduleForShare,
  decodeScheduleFromShare,
  DEFAULT_COURSE_TEMPLATES,
  SAMPLE_SCHEDULE
} from '../utils/scheduleStorage.js';

describe('scheduleStorage - Unicode Encoding & Data Resilience', () => {
  it('correctly encodes and decodes Unicode Thai course data', () => {
    const original = [
      {
        id: 'c1',
        code: '10301361',
        name: 'อินเทอร์เน็ตในทุกสิ่ง (IoT)',
        day: 'Monday',
        startTime: '10:00',
        endTime: '12:00',
        room: 'ห้อง 402 อาคารเรียนรวม',
        colorIndex: 0,
      },
      {
        id: 'c2',
        code: '10301347',
        name: 'วิศวกรรมการพัฒนาปฏิบัติการบนคลาวด์',
        day: 'Tuesday',
        startTime: '09:00',
        endTime: '12:00',
        room: 'ชั้น 5',
        colorIndex: 2,
      },
    ];

    const encoded = encodeScheduleForShare(original);
    assert.strictEqual(typeof encoded, 'string');
    assert.ok(encoded.length > 0);

    const decoded = decodeScheduleFromShare(encoded);
    assert.strictEqual(decoded.length, 2);
    assert.strictEqual(decoded[0].code, '10301361');
    assert.strictEqual(decoded[0].name, 'อินเทอร์เน็ตในทุกสิ่ง (IoT)');
    assert.strictEqual(decoded[0].room, 'ห้อง 402 อาคารเรียนรวม');
    assert.strictEqual(decoded[1].code, '10301347');
    assert.strictEqual(decoded[1].name, 'วิศวกรรมการพัฒนาปฏิบัติการบนคลาวด์');
  });

  it('safely handles empty arrays and non-array inputs for share encoding', () => {
    assert.strictEqual(encodeScheduleForShare([]), '');
    assert.strictEqual(encodeScheduleForShare(null), '');
    assert.strictEqual(encodeScheduleForShare(undefined), '');
  });

  it('safely handles corrupted or invalid share strings', () => {
    assert.strictEqual(decodeScheduleFromShare(''), null);
    assert.strictEqual(decodeScheduleFromShare(null), null);
    assert.strictEqual(decodeScheduleFromShare('not_valid_base64!@#$'), null);
    assert.strictEqual(decodeScheduleFromShare(btoa('plain text not json')), null);
  });

  it('verifies default starter templates and sample schedule validity', () => {
    assert.ok(Array.isArray(DEFAULT_COURSE_TEMPLATES));
    assert.ok(DEFAULT_COURSE_TEMPLATES.length > 0);
    DEFAULT_COURSE_TEMPLATES.forEach(tpl => {
      assert.ok(tpl.code);
      assert.ok(tpl.name);
    });

    assert.ok(Array.isArray(SAMPLE_SCHEDULE));
    assert.ok(SAMPLE_SCHEDULE.length > 0);
    SAMPLE_SCHEDULE.forEach(item => {
      assert.ok(item.id);
      assert.ok(item.code);
      assert.ok(item.day);
      assert.ok(item.startTime);
      assert.ok(item.endTime);
    });
  });
});
