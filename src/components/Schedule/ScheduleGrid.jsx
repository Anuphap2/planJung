import React, { useState, useEffect } from 'react';
import { Paper, Box } from '@mui/material';
import { AccessTimeRounded as TimeIcon } from '@mui/icons-material';
import { DAYS, START_HOUR, END_HOUR, PIXELS_PER_HOUR, HEADER_WIDTH } from '../../constants/colors';
import { COINBASE_COLORS } from '../../constants/coinbaseTokens';
import TimeHeader from './TimeHeader';
import DayRow from './DayRow';

export default function ScheduleGrid({
  courses = [],
  onEdit,
  onDelete,
  onDragStart,
  dragState,
}) {
  const totalGridWidth = HEADER_WIDTH + (END_HOUR - START_HOUR + 1) * PIXELS_PER_HOUR;

  // Real-time Current Time Line Indicator
  const [currentMinutes, setCurrentMinutes] = useState(() => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentMinutes(now.getHours() * 60 + now.getMinutes());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const minDayMinutes = START_HOUR * 60;
  const maxDayMinutes = END_HOUR * 60;
  const isWithinSchedule = currentMinutes >= minDayMinutes && currentMinutes <= maxDayMinutes;
  const currentTimeLeft = isWithinSchedule
    ? HEADER_WIDTH + ((currentMinutes - minDayMinutes) / 60) * PIXELS_PER_HOUR
    : null;

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: '20px',
        border: `1px solid ${COINBASE_COLORS.hairline}`,
        bgcolor: COINBASE_COLORS.canvas,
        overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04)',
      }}
    >
      <Box
        sx={{
          overflowX: 'auto',
          position: 'relative',
          pb: 1,
          '&::-webkit-scrollbar': { height: 8 },
          '&::-webkit-scrollbar-track': { bgcolor: COINBASE_COLORS.surfaceSoft },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: '#CED4DA',
            borderRadius: '100px',
            '&:hover': { bgcolor: '#ADB5BD' },
          },
        }}
      >
        <Box sx={{ minWidth: totalGridWidth, position: 'relative' }}>
          {/* Header Row (Time Tracker) */}
          <Box
            sx={{
              height: 48,
              display: 'flex',
              borderBottom: `1px solid ${COINBASE_COLORS.hairline}`,
              position: 'sticky',
              top: 0,
              zIndex: 30,
              bgcolor: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(8px)',
            }}
          >
            {/* Top-Left Corner Box */}
            <Box
              sx={{
                width: HEADER_WIDTH,
                minWidth: HEADER_WIDTH,
                borderRight: `1px solid ${COINBASE_COLORS.hairline}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: COINBASE_COLORS.canvas,
                position: 'sticky',
                left: 0,
                zIndex: 35,
              }}
            >
              <TimeIcon sx={{ fontSize: 18, color: COINBASE_COLORS.muted }} />
            </Box>

            {/* Time Ticks */}
            <Box sx={{ flexGrow: 1, position: 'relative' }}>
              <TimeHeader />
            </Box>
          </Box>

          {/* Days Rows */}
          {DAYS.map((day, idx) => (
            <DayRow
              key={day}
              day={day}
              dayIndex={idx}
              courses={courses}
              onEdit={onEdit}
              onDelete={onDelete}
              onDragStart={onDragStart}
              dragState={dragState}
            />
          ))}

          {/* Current Time Indicator Vertical Line (If active today) */}
          {isWithinSchedule && currentTimeLeft !== null && (
            <Box
              sx={{
                position: 'absolute',
                left: currentTimeLeft,
                top: 0,
                bottom: 0,
                width: '2px',
                bgcolor: COINBASE_COLORS.semanticDown,
                zIndex: 25,
                pointerEvents: 'none',
                opacity: 0.65,
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: -4,
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  bgcolor: COINBASE_COLORS.semanticDown,
                },
              }}
            />
          )}
        </Box>
      </Box>
    </Paper>
  );
}
