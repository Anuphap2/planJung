import React from 'react';
import { Paper, Box, Typography, IconButton, Tooltip } from '@mui/material';
import {
  EditRounded as EditIcon,
  ContentCopyRounded as CopyIcon,
  DeleteOutlineRounded as DeleteIcon,
  RoomRounded as RoomIcon,
  AccessTimeRounded as ClockIcon
} from '@mui/icons-material';
import { PRESET_COLORS, PIXELS_PER_HOUR, START_HOUR, ROW_HEIGHT } from '../../constants/colors';
import { COINBASE_COLORS, COINBASE_SHADOWS, COINBASE_TYPOGRAPHY } from '../../constants/coinbaseTokens';
import { timeToMinutes } from '../../utils/timeUtils';

export default function CourseCard({
  course,
  onEdit,
  onDuplicate,
  onDelete,
  onDragStart,
  isDragging = false,
  dragStyle = null,
}) {
  if (!course || typeof course !== 'object') {
    return null;
  }

  const start = timeToMinutes(course.startTime);
  const end = timeToMinutes(course.endTime);
  const left = Math.max(0, ((start - START_HOUR * 60) / 60) * PIXELS_PER_HOUR + 1);
  const rawWidth = Math.max(0, ((end - start) / 60) * PIXELS_PER_HOUR);
  // Leaves 2px breathing gap on the boundary line so adjacent courses remain distinct
  const width = Math.max(64, rawWidth - 2);

  const themeIdx = typeof course.colorIndex === 'number' && course.colorIndex >= 0 && course.colorIndex < PRESET_COLORS.length
    ? course.colorIndex
    : 0;
  const colorTheme = PRESET_COLORS[themeIdx] || PRESET_COLORS[0];

  let calculatedStyle = {
    left,
    top: 6,
    width,
    height: ROW_HEIGHT - 12,
    zIndex: 2,
  };

  if (isDragging && dragStyle) {
    calculatedStyle = {
      ...calculatedStyle,
      ...dragStyle,
      zIndex: 1000,
    };
  }

  return (
    <Paper
      elevation={isDragging ? 8 : 0}
      onMouseDown={(e) => onDragStart && onDragStart(e, course)}
      sx={{
        position: 'absolute',
        ...calculatedStyle,
        bgcolor: colorTheme.bg,
        color: colorTheme.text,
        border: `1px solid ${colorTheme.border}`,
        borderLeft: `4px solid ${colorTheme.accent || colorTheme.badgeBg}`,
        borderRadius: '14px',
        p: 1.2,
        cursor: isDragging ? 'grabbing' : 'grab',
        transition: isDragging ? 'none' : 'transform 0.16s ease, box-shadow 0.16s ease, border-color 0.16s ease',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        userSelect: 'none',
        overflow: 'hidden',
        boxSizing: 'border-box',
        boxShadow: isDragging ? COINBASE_SHADOWS.dragging : COINBASE_SHADOWS.card,
        '&:hover': {
          transform: isDragging ? 'none' : 'translateY(-2px)',
          boxShadow: isDragging ? COINBASE_SHADOWS.dragging : COINBASE_SHADOWS.cardHover,
          borderColor: colorTheme.badgeBg,
          zIndex: 5,
        },
      }}
    >
      {/* Top Header: Code & Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 0.5 }}>
        {/* Course Code Chip */}
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            bgcolor: 'rgba(255, 255, 255, 0.85)',
            border: `1px solid ${colorTheme.border}`,
            borderRadius: '6px',
            px: 0.85,
            py: 0.15,
            boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
            maxWidth: '65%',
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontFamily: COINBASE_TYPOGRAPHY.fontFamilyMono,
              fontWeight: 700,
              fontSize: '0.76rem',
              lineHeight: 1.2,
              letterSpacing: '-0.3px',
              color: colorTheme.accent || colorTheme.text,
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
            }}
          >
            {course.code || 'วิชา'}
          </Typography>
        </Box>

        {/* Action Icon Buttons */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.25,
            bgcolor: 'rgba(255, 255, 255, 0.85)',
            borderRadius: '8px',
            p: 0.25,
            border: `1px solid ${colorTheme.border}`,
          }}
        >
          <Tooltip title="แก้ไขข้อมูลวิชา" arrow placement="top">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                if (onEdit) onEdit(course);
              }}
              sx={{
                p: 0.35,
                color: colorTheme.text,
                borderRadius: '6px',
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.05)', color: COINBASE_COLORS.ink },
              }}
            >
              <EditIcon sx={{ fontSize: 13 }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="ทำซ้ำวิชานี้ (คัดลอกไปยังวันอื่น)" arrow placement="top">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                if (onDuplicate) onDuplicate(course);
              }}
              sx={{
                p: 0.35,
                color: colorTheme.text,
                borderRadius: '6px',
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.05)', color: COINBASE_COLORS.primary },
              }}
            >
              <CopyIcon sx={{ fontSize: 13 }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="ลบวิชา" arrow placement="top">
            <IconButton
              size="small"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                if (onDelete) onDelete(course);
              }}
              sx={{
                p: 0.35,
                color: colorTheme.text,
                borderRadius: '6px',
                '&:hover': {
                  bgcolor: 'rgba(207, 32, 47, 0.1)',
                  color: COINBASE_COLORS.semanticDown,
                },
              }}
            >
              <DeleteIcon sx={{ fontSize: 13 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Middle: Course Name */}
      <Typography
        variant="body2"
        sx={{
          fontWeight: 600,
          fontSize: '0.8rem',
          lineHeight: 1.25,
          color: colorTheme.text,
          my: 0.4,
          flexGrow: 1,
          display: '-webkit-box',
          overflow: 'hidden',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 2,
          wordBreak: 'break-word',
        }}
        title={course.name}
      >
        {course.name || '-'}
      </Typography>

      {/* Bottom Footer: Room & Time Badge */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 0.5, mt: 'auto' }}>
        {/* Room / Location */}
        {course.room ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.25,
              overflow: 'hidden',
              maxWidth: '50%',
            }}
          >
            <RoomIcon sx={{ fontSize: 12, opacity: 0.8, color: colorTheme.text, flexShrink: 0 }} />
            <Typography
              variant="caption"
              sx={{
                fontSize: '0.68rem',
                fontWeight: 500,
                color: colorTheme.text,
                opacity: 0.85,
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
              }}
            >
              {course.room}
            </Typography>
          </Box>
        ) : (
          <Box />
        )}

        {/* Time Badge (Stretches cleanly with clock icon) */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.4,
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            border: `1px solid ${colorTheme.border}`,
            px: 0.65,
            py: 0.15,
            borderRadius: '6px',
            ml: 'auto',
          }}
        >
          <ClockIcon sx={{ fontSize: 11, color: colorTheme.text }} />
          <Typography
            variant="caption"
            sx={{
              fontFamily: COINBASE_TYPOGRAPHY.fontFamilyMono,
              fontWeight: 700,
              fontSize: '0.67rem',
              color: colorTheme.text,
              whiteSpace: 'nowrap',
              lineHeight: 1.1,
            }}
          >
            {course.startTime}-{course.endTime}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}
