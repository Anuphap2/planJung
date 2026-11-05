import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button,
  Box,
  IconButton,
  Tooltip,
  InputAdornment,
  Typography,
  Alert,
  Autocomplete,
  Chip
} from '@mui/material';
import {
  AddRounded as AddIcon,
  EditRounded as EditIcon,
  CloseRounded as CloseIcon,
  RoomRounded as RoomIcon,
  ScheduleRounded as ClockIcon,
  CheckRounded as CheckIcon,
  LibraryBooksRounded as LibraryIcon,
  TimerOutlined as TimerIcon
} from '@mui/icons-material';
import { PRESET_COLORS, DAYS, DAYS_TH, DAYS_COLORS } from '../../constants/colors';
import { COINBASE_COLORS } from '../../constants/coinbaseTokens';
import { timeToMinutes, getDurationMinutes } from '../../utils/timeUtils';
import { loadCourseLibrary } from '../../utils/scheduleStorage';

const COMMON_TIME_PRESETS = [
  { label: '09:00 - 12:00 (3 ชม.)', start: '09:00', end: '12:00' },
  { label: '10:00 - 12:00 (2 ชม.)', start: '10:00', end: '12:00' },
  { label: '13:00 - 16:00 (3 ชม.)', start: '13:00', end: '16:00' },
  { label: '13:00 - 15:00 (2 ชม.)', start: '13:00', end: '15:00' },
  { label: '09:00 - 11:00 (2 ชม.)', start: '09:00', end: '11:00' },
  { label: '08:30 - 11:30 (3 ชม.)', start: '08:30', end: '11:30' },
];

export default function CourseDialog({
  open,
  handleClose,
  onSave,
  editingId = null,
  initialData = null,
  fullScreen = false,
  existingCourses = [],
}) {
  const [formData, setFormData] = useState(() => ({
    code: initialData?.code || '',
    name: initialData?.name || '',
    day: initialData?.day || 'Monday',
    startTime: initialData?.startTime || '09:00',
    endTime: initialData?.endTime || '12:00',
    room: initialData?.room || '',
    colorIndex: typeof initialData?.colorIndex === 'number' ? initialData.colorIndex : 0,
  }));

  const [formError, setFormError] = useState('');

  // Course library loaded lazily once per dialog instance
  const [courseLibrary] = useState(() => loadCourseLibrary());

  // Combine saved course library with any existing courses in current schedule
  const uniqueCourseTemplates = useMemo(() => {
    const map = new Map();

    // First add from current schedule
    existingCourses.forEach(c => {
      if (c && c.code && c.name) {
        const key = c.code.trim().toUpperCase();
        if (!map.has(key)) {
          map.set(key, {
            code: key,
            name: c.name.trim(),
            room: c.room || '',
            colorIndex: typeof c.colorIndex === 'number' ? c.colorIndex : 0,
            startTime: c.startTime || '09:00',
            endTime: c.endTime || '12:00',
            source: 'schedule',
          });
        }
      }
    });

    // Then add from stored library
    courseLibrary.forEach(item => {
      if (item && item.code && item.name) {
        const key = item.code.trim().toUpperCase();
        if (!map.has(key)) {
          map.set(key, {
            code: key,
            name: item.name.trim(),
            room: item.room || '',
            colorIndex: typeof item.colorIndex === 'number' ? item.colorIndex : 0,
            startTime: item.startTime || '09:00',
            endTime: item.endTime || '12:00',
            source: 'library',
          });
        }
      }
    });

    return Array.from(map.values());
  }, [existingCourses, courseLibrary]);

  // Select a template from library
  const handleSelectTemplate = (template) => {
    if (!template) return;
    setFormData(prev => ({
      ...prev,
      code: template.code || prev.code,
      name: template.name || prev.name,
      room: template.room || prev.room,
      colorIndex: typeof template.colorIndex === 'number' ? template.colorIndex : prev.colorIndex,
      startTime: template.startTime || prev.startTime,
      endTime: template.endTime || prev.endTime,
    }));
    setFormError('');
  };

  // Calculate live duration
  const durationMin = getDurationMinutes(formData.startTime, formData.endTime);
  const durationHours = Math.floor(durationMin / 60);
  const durationRemainderMin = durationMin % 60;
  const isTimeValid = timeToMinutes(formData.startTime) < timeToMinutes(formData.endTime);

  const handleSubmit = (e, { addAnother = false } = {}) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    // Validation
    if (!formData.code.trim()) {
      setFormError('กรุณากรอกรหัสวิชา');
      return;
    }
    if (!formData.name.trim()) {
      setFormError('กรุณากรอกชื่อวิชา');
      return;
    }
    if (!isTimeValid) {
      setFormError('เวลาเลิกเรียนต้องมากกว่าเวลาเริ่มเรียน');
      return;
    }

    setFormError('');

    const success = onSave(formData, { addAnother });

    if (success && addAnother) {
      // Advance day to next day in cycle, keeping subject details intact
      const currentDayIdx = DAYS.indexOf(formData.day);
      const nextDayIdx = (currentDayIdx + 2) % DAYS.length; // e.g. Mon -> Wed
      setFormData(prev => ({
        ...prev,
        day: DAYS[nextDayIdx],
      }));
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      fullScreen={fullScreen}
      PaperProps={{
        sx: {
          borderRadius: fullScreen ? 0 : '24px',
          border: fullScreen ? 'none' : `1px solid ${COINBASE_COLORS.hairline}`,
          p: { xs: 1, sm: 2 },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 1.5,
          pt: 2,
          px: { xs: 2, sm: 3 },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: '100px',
              bgcolor: COINBASE_COLORS.primary,
              color: COINBASE_COLORS.onPrimary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0, 82, 255, 0.25)',
            }}
          >
            {editingId ? <EditIcon fontSize="small" /> : <AddIcon fontSize="small" />}
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem', color: COINBASE_COLORS.ink, lineHeight: 1.2 }}>
              {editingId ? 'แก้ไขข้อมูลวิชาเรียน' : initialData?.code ? 'ทำซ้ำวิชา / เพิ่มคาบเรียนใหม่' : 'เพิ่มวิชาเรียนใหม่'}
            </Typography>
            <Typography variant="caption" sx={{ color: COINBASE_COLORS.muted }}>
              {editingId
                ? 'อัปเดตรายละเอียดและช่วงเวลาเรียน'
                : 'เลือกจากคลังวิชาเดิม หรือกรอกรายละเอียดใหม่ลงตาราง'}
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={handleClose}
          sx={{
            color: COINBASE_COLORS.muted,
            border: `1px solid ${COINBASE_COLORS.hairline}`,
            borderRadius: '100px',
            p: 0.75,
            '&:hover': { color: COINBASE_COLORS.ink },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <form onSubmit={(e) => handleSubmit(e, { addAnother: false })}>
        <DialogContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2.25,
            px: { xs: 2, sm: 3 },
            py: 1.5,
          }}
        >
          {formError && (
            <Alert severity="error" sx={{ borderRadius: '12px' }}>
              {formError}
            </Alert>
          )}

          {/* Quick Autocomplete from Existing / Saved Courses */}
          {!editingId && uniqueCourseTemplates.length > 0 && (
            <Box sx={{ bgcolor: COINBASE_COLORS.surfaceSoft, p: 1.5, borderRadius: '14px', border: `1px solid ${COINBASE_COLORS.hairline}` }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <LibraryIcon sx={{ fontSize: 16, color: COINBASE_COLORS.primary }} />
                <Typography variant="caption" sx={{ fontWeight: 600, color: COINBASE_COLORS.ink }}>
                  เลือกจากคลังวิชาที่เคยบันทึกไว้ (เติมข้อมูลอัตโนมัติ):
                </Typography>
              </Box>

              <Autocomplete
                size="small"
                options={uniqueCourseTemplates}
                getOptionLabel={(option) => `${option.code} - ${option.name}`}
                onChange={(_, value) => handleSelectTemplate(value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="พิมพ์ค้นหารหัสหรือชื่อวิชาในคลัง..."
                    sx={{ bgcolor: COINBASE_COLORS.canvas, borderRadius: '8px' }}
                  />
                )}
              />

              {/* Quick Pills for Top Templates */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mt: 1 }}>
                {uniqueCourseTemplates.slice(0, 4).map((tpl) => (
                  <Chip
                    key={tpl.code}
                    label={`${tpl.code} ${tpl.name.split(' ')[0]}`}
                    size="small"
                    onClick={() => handleSelectTemplate(tpl)}
                    sx={{
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      bgcolor: COINBASE_COLORS.canvas,
                      border: `1px solid ${COINBASE_COLORS.hairline}`,
                      cursor: 'pointer',
                      '&:hover': {
                        borderColor: COINBASE_COLORS.primary,
                        color: COINBASE_COLORS.primary,
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Code & Name */}
          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <TextField
              label="รหัสวิชา"
              placeholder="e.g. 10301361, CS101"
              required
              autoFocus={!editingId}
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              sx={{ flex: { sm: 1 } }}
            />
            <TextField
              label="ชื่อวิชา"
              placeholder="e.g. อินเทอร์เน็ตในทุกสิ่ง (IoT)"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              sx={{ flex: { sm: 2 } }}
            />
          </Box>

          {/* Day Selector */}
          <TextField
            select
            label="วันเรียน"
            fullWidth
            value={formData.day}
            onChange={(e) => setFormData({ ...formData, day: e.target.value })}
          >
            {DAYS.map((d, i) => (
              <MenuItem key={d} value={d}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: DAYS_COLORS[i] }} />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    วัน{DAYS_TH[i]} ({d})
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </TextField>

          {/* Times with Quick Presets */}
          <Box>
            <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
              <TextField
                label="เวลาเริ่มเรียน"
                type="time"
                fullWidth
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 1800 }}
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ClockIcon fontSize="small" sx={{ color: COINBASE_COLORS.muted }} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="เวลาเลิกเรียน"
                type="time"
                fullWidth
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 1800 }}
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ClockIcon fontSize="small" sx={{ color: COINBASE_COLORS.muted }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Quick Time Presets */}
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.75, mt: 1 }}>
              <Typography variant="caption" sx={{ color: COINBASE_COLORS.muted, fontWeight: 500, mr: 0.5 }}>
                ช่วงเวลายอดนิยม:
              </Typography>
              {COMMON_TIME_PRESETS.map((p) => {
                const isActive = formData.startTime === p.start && formData.endTime === p.end;
                return (
                  <Chip
                    key={p.label}
                    label={p.label}
                    size="small"
                    onClick={() => setFormData({ ...formData, startTime: p.start, endTime: p.end })}
                    sx={{
                      fontSize: '0.7rem',
                      fontWeight: isActive ? 700 : 500,
                      bgcolor: isActive ? COINBASE_COLORS.primary : COINBASE_COLORS.surfaceStrong,
                      color: isActive ? COINBASE_COLORS.onPrimary : COINBASE_COLORS.body,
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: isActive ? COINBASE_COLORS.primaryActive : '#E2E5E9',
                      },
                    }}
                  />
                );
              })}
            </Box>

            {/* Live Duration Indicator */}
            {isTimeValid && durationMin > 0 && (
              <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <TimerIcon sx={{ fontSize: 15, color: COINBASE_COLORS.semanticUp }} />
                <Typography variant="caption" sx={{ fontWeight: 600, color: COINBASE_COLORS.body }}>
                  ระยะเวลาเรียน:{' '}
                  <span style={{ color: COINBASE_COLORS.ink }}>
                    {durationHours > 0 ? `${durationHours} ชั่วโมง ` : ''}
                    {durationRemainderMin > 0 ? `${durationRemainderMin} นาที` : ''}
                  </span>{' '}
                  (ตั้งแต่ {formData.startTime} ถึง {formData.endTime} น.)
                </Typography>
              </Box>
            )}
          </Box>

          {/* Room / Lecturer */}
          <TextField
            label="ห้องเรียน / ผู้สอน (ไม่บังคับ)"
            placeholder="e.g. ห้อง 402, อาคาร 3 ชั้น 5"
            fullWidth
            value={formData.room}
            onChange={(e) => setFormData({ ...formData, room: e.target.value })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <RoomIcon fontSize="small" sx={{ color: COINBASE_COLORS.muted }} />
                </InputAdornment>
              ),
            }}
          />

          {/* Color Palette Picker */}
          <Box sx={{ mt: 0.5 }}>
            <Typography variant="subtitle2" sx={{ mb: 1.25, color: COINBASE_COLORS.body, fontWeight: 600 }}>
              เลือกโทนสีการ์ด
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
              {PRESET_COLORS.map((c, i) => {
                const isSelected = formData.colorIndex === i;
                return (
                  <Tooltip title={c.name} key={i}>
                    <Box
                      onClick={() => setFormData({ ...formData, colorIndex: i })}
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '100px',
                        bgcolor: c.bg,
                        border: `2px solid ${isSelected ? c.badgeBg : c.border}`,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                        boxShadow: isSelected
                          ? `0 0 0 2px ${COINBASE_COLORS.canvas}, 0 0 0 4px ${c.badgeBg}`
                          : 'none',
                        transition: 'all 0.15s ease',
                        '&:hover': {
                          transform: 'scale(1.08)',
                        },
                      }}
                    >
                      {isSelected && <CheckIcon sx={{ fontSize: 18, color: c.badgeBg }} />}
                    </Box>
                  </Tooltip>
                );
              })}
            </Box>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            p: { xs: 2, sm: 3 },
            borderTop: `1px solid ${COINBASE_COLORS.hairlineSoft}`,
            justifyContent: 'space-between',
            gap: 1.5,
          }}
        >
          <Button onClick={handleClose} variant="outlined" sx={{ height: 44, px: 2.5 }}>
            ยกเลิก
          </Button>

          <Box sx={{ display: 'flex', gap: 1.25 }}>
            {!editingId && (
              <Button
                type="button"
                variant="outlined"
                color="primary"
                onClick={(e) => handleSubmit(e, { addAnother: true })}
                sx={{
                  height: 44,
                  px: 2.5,
                  fontWeight: 600,
                  bgcolor: COINBASE_COLORS.surfaceSoft,
                }}
              >
                บันทึก & เพิ่มอีกวัน
              </Button>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ height: 44, px: 3.5, fontWeight: 600 }}
            >
              {editingId ? 'บันทึกการแก้ไข' : 'เพิ่มลงตาราง'}
            </Button>
          </Box>
        </DialogActions>
      </form>
    </Dialog>
  );
}
