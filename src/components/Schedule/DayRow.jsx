import React from 'react';
import { Box, Typography } from '@mui/material';
import { START_HOUR, END_HOUR, PIXELS_PER_HOUR, HEADER_WIDTH, ROW_HEIGHT, DAYS_COLORS, DAYS_TH } from '../../constants/colors';
import { COINBASE_COLORS } from '../../constants/coinbaseTokens';
import CourseCard from './CourseCard';
import { timeToMinutes } from '../../utils/timeUtils';

export default function DayRow({
  day,
  dayIndex,
  courses = [],
  onEdit,
  onDelete,
  onDragStart,
  dragState,
}) {
  const dayColor = DAYS_COLORS[dayIndex] || COINBASE_COLORS.primary;
  const dayNameTh = DAYS_TH[dayIndex] || day;
  const dayShortEn = day ? day.substring(0, 3) : '';

  const dayCourses = Array.isArray(courses) ? courses.filter(c => c && c.day === day) : [];

  return (
    <Box
      sx={{
        height: ROW_HEIGHT,
        display: 'flex',
        borderBottom: `1px solid ${COINBASE_COLORS.hairlineSoft}`,
        position: 'relative',
        '&:hover': {
          bgcolor: 'rgba(0, 82, 255, 0.015)',
        },
        transition: 'background-color 0.15s ease',
      }}
    >
      {/* Sticky Day Label Column */}
      <Box
        sx={{
          width: HEADER_WIDTH,
          minWidth: HEADER_WIDTH,
          borderRight: `1px solid ${COINBASE_COLORS.hairline}`,
          bgcolor: COINBASE_COLORS.canvas,
          position: 'sticky',
          left: 0,
          zIndex: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0.25,
          userSelect: 'none',
          boxShadow: '2px 0 6px rgba(0, 0, 0, 0.02)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '100px',
              bgcolor: dayColor,
            }}
          />
          <Typography
            variant="body2"
            sx={{
              fontWeight: 700,
              fontSize: '0.88rem',
              color: COINBASE_COLORS.ink,
            }}
          >
            {dayNameTh}
          </Typography>
        </Box>
        <Typography
          variant="caption"
          sx={{
            color: COINBASE_COLORS.muted,
            fontWeight: 600,
            fontSize: '0.72rem',
            letterSpacing: '0.5px',
          }}
        >
          {dayShortEn}
        </Typography>
      </Box>

      {/* Grid Canvas & Courses */}
      <Box sx={{ flexGrow: 1, position: 'relative' }}>
        {/* Hour Vertical Grid Lines */}
        {Array.from({ length: END_HOUR - START_HOUR + 1 }).map((_, h) => (
          <Box
            key={h}
            sx={{
              position: 'absolute',
              left: h * PIXELS_PER_HOUR,
              top: 0,
              bottom: 0,
              width: 1,
              bgcolor: COINBASE_COLORS.hairlineSoft,
            }}
          />
        ))}

        {/* Courses for this day */}
        {dayCourses.map((course) => {
          if (!course || !course.id) return null;
          const isItemDragging = dragState?.isDragging && dragState?.courseId === course.id;

          return (
            <CourseCard
              key={course.id}
              course={course}
              onEdit={onEdit}
              onDelete={onDelete}
              onDragStart={onDragStart}
              isDragging={isItemDragging}
              dragStyle={
                isItemDragging
                  ? {
                      left:
                        ((timeToMinutes(course.startTime) - START_HOUR * 60) / 60) * PIXELS_PER_HOUR +
                        (dragState.currentX - dragState.startX),
                      top: 8 + (dragState.currentY - dragState.startY),
                    }
                  : null
              }
            />
          );
        })}
      </Box>
    </Box>
  );
}
