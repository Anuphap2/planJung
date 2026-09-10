import React from 'react';
import { Paper, Box, Typography, IconButton, Chip } from '@mui/material';
import {
  EditRounded as EditIcon,
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
  const left = Math.max(0, ((start - START_HOUR * 60) / 60) * PIXELS_PER_HOUR);
  const width = Math.max(80, ((end - start) / 60) * PIXELS_PER_HOUR - 4);

  const themeIdx = typeof course.colorIndex === 'number' && course.colorIndex >= 0 && course.colorIndex < PRESET_COLORS.length
    ? course.colorIndex
    : 0;
  const colorTheme = PRESET_COLORS[themeIdx] || PRESET_COLORS[0];

  let calculatedStyle = {
    left,
    top: 8,
    width,
    height: ROW_HEIGHT - 16,
    zIndex: 1,
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
        border: `1.5px solid ${colorTheme.border}`,
        borderRadius: '16px',
        p: 1.25,
        cursor: isDragging ? 'grabbing' : 'grab',
        transition: isDragging ? 'none' : 'transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        userSelect: 'none',
        overflow: 'hidden',
        boxShadow: isDragging ? COINBASE_SHADOWS.dragging : COINBASE_SHADOWS.card,
        '&:hover': {
          transform: isDragging ? 'none' : 'translateY(-2px)',
          boxShadow: isDragging ? COINBASE_SHADOWS.dragging : COINBASE_SHADOWS.cardHover,
          borderColor: colorTheme.badgeBg,
        },
      }}
    >
      {/* Top Header: Code & Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 0.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, overflow: 'hidden' }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              fontSize: '0.85rem',
              lineHeight: 1.1,
              letterSpacing: '-0.2px',
              color: colorTheme.text,
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
            }}
          >
            {course.code || 'วิชา'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, mt: -0.5, mr: -0.5 }}>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              if (onEdit) onEdit(course);
            }}
            sx={{
              p: 0.5,
              color: colorTheme.text,
              bgcolor: 'rgba(255, 255, 255, 0.7)',
              borderRadius: '8px',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.95)' },
            }}
          >
            <EditIcon sx={{ fontSize: 14 }} />
          </IconButton>
          <IconButton
            size="small"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              if (onDelete) onDelete(course);
            }}
            sx={{
              p: 0.5,
              color: colorTheme.text,
              bgcolor: 'rgba(255, 255, 255, 0.7)',
              borderRadius: '8px',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.95)',
                color: COINBASE_COLORS.semanticDown,
              },
            }}
          >
            <DeleteIcon sx={{ fontSize: 14 }} />
          </IconButton>
        </Box>
      </Box>

      {/* Middle: Course Name */}
      <Typography
        variant="body2"
        sx={{
          fontWeight: 500,
          fontSize: '0.78rem',
          lineHeight: 1.3,
          color: colorTheme.text,
          my: 0.5,
          flexGrow: 1,
          display: '-webkit-box',
          overflow: 'hidden',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 2,
          wordBreak: 'break-word',
        }}
      >
        {course.name || '-'}
      </Typography>

      {/* Bottom Footer: Room badge & Monospace Time badge */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 0.5, mt: 'auto' }}>
        {course.room ? (
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.25,
              bgcolor: 'rgba(255, 255, 255, 0.8)',
              px: 0.75,
              py: 0.25,
              borderRadius: '100px',
              maxWidth: '50%',
            }}
          >
            <RoomIcon sx={{ fontSize: 11, color: colorTheme.text }} />
            <Typography
              variant="caption"
              sx={{
                fontSize: '0.68rem',
                fontWeight: 600,
                color: colorTheme.text,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {course.room}
            </Typography>
          </Box>
        ) : <Box />}

        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            bgcolor: 'rgba(255, 255, 255, 0.85)',
            px: 0.75,
            py: 0.25,
            borderRadius: '100px',
            border: `1px solid ${colorTheme.border}`,
          }}
        >
          <ClockIcon sx={{ fontSize: 11, color: colorTheme.text }} />
          <Typography
            variant="caption"
            sx={{
              fontFamily: COINBASE_TYPOGRAPHY.fontFamilyMono,
              fontSize: '0.68rem',
              fontWeight: 600,
              color: colorTheme.text,
            }}
          >
            {course.startTime}-{course.endTime}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}
