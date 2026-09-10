import React, { useState } from 'react';
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
  Alert
} from '@mui/material';
import {
  AddRounded as AddIcon,
  EditRounded as EditIcon,
  CloseRounded as CloseIcon,
  RoomRounded as RoomIcon,
  ScheduleRounded as ClockIcon,
  CheckRounded as CheckIcon
} from '@mui/icons-material';
import { PRESET_COLORS, DAYS, DAYS_TH, DAYS_COLORS } from '../../constants/colors';
import { COINBASE_COLORS } from '../../constants/coinbaseTokens';
import { timeToMinutes } from '../../utils/timeUtils';

export default function CourseDialog({
  open,
  handleClose,
  onSave,
  editingId = null,
  initialData = null,
  fullScreen = false,
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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.code.trim()) {
      setFormError('กรุณากรอกรหัสวิชา');
      return;
    }
    if (!formData.name.trim()) {
      setFormError('กรุณากรอกชื่อวิชา');
      return;
    }
    if (timeToMinutes(formData.startTime) >= timeToMinutes(formData.endTime)) {
      setFormError('เวลาเลิกเรียนต้องมากกว่าเวลาเริ่มเรียน');
      return;
    }

    setFormError('');
    onSave(formData);
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
              width: 36,
              height: 36,
              borderRadius: '100px',
              bgcolor: COINBASE_COLORS.primary,
              color: COINBASE_COLORS.onPrimary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {editingId ? <EditIcon fontSize="small" /> : <AddIcon fontSize="small" />}
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem', color: COINBASE_COLORS.ink, lineHeight: 1.2 }}>
              {editingId ? 'แก้ไขวิชาเรียน' : 'เพิ่มวิชาเรียนใหม่'}
            </Typography>
            <Typography variant="caption" sx={{ color: COINBASE_COLORS.muted }}>
              {editingId ? 'อัปเดตรายละเอียดและเวลาเรียน' : 'กรอกรายละเอียดเพื่อบันทึกลงตาราง'}
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

      <form onSubmit={handleSubmit}>
        <DialogContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2.25,
            px: { xs: 2, sm: 3 },
            py: 2,
          }}
        >
          {formError && (
            <Alert severity="error" sx={{ borderRadius: '12px' }}>
              {formError}
            </Alert>
          )}

          {/* Code & Name */}
          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <TextField
              label="รหัสวิชา"
              placeholder="e.g. CS101, 2301108"
              required
              autoFocus
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              sx={{ flex: { sm: 1 } }}
            />
            <TextField
              label="ชื่อวิชา"
              placeholder="e.g. Intro to Computer Systems"
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
                    {DAYS_TH[i]} ({d})
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </TextField>

          {/* Times */}
          <Box sx={{ display: 'flex', gap: 2 }}>
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

          {/* Room / Lecturer */}
          <TextField
            label="ห้องเรียน / ผู้สอน (ไม่บังคับ)"
            placeholder="e.g. ห้อง 402, อาคารวิศวะ"
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
            justifyContent: 'flex-end',
            gap: 1.5,
          }}
        >
          <Button onClick={handleClose} variant="outlined" sx={{ height: 44, px: 3 }}>
            ยกเลิก
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ height: 44, px: 4 }}
          >
            {editingId ? 'บันทึกการแก้ไข' : 'เพิ่มลงตาราง'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
