import React from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import { START_HOUR, END_HOUR, PIXELS_PER_HOUR } from '../../constants/colors';
import { COINBASE_COLORS, COINBASE_TYPOGRAPHY } from '../../constants/coinbaseTokens';

export default function TimeHeader() {
  const totalSlots = END_HOUR - START_HOUR; // 12 intervals: 8-9, 9-10, ..., 19-20
  const hourTicks = Array.from({ length: totalSlots + 1 }, (_, i) => START_HOUR + i);

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        userSelect: 'none',
      }}
    >
      {/* 1. Top Tier: Period Intervals (คาบเรียน / พักเที่ยง) */}
      <Box sx={{ position: 'relative', height: 24, width: '100%' }}>
        {Array.from({ length: totalSlots }).map((_, i) => {
          const startH = START_HOUR + i;
          const endH = startH + 1;
          const periodNum = i + 1;
          const isLunch = startH === 12;
          const leftPos = i * PIXELS_PER_HOUR;

          return (
            <Tooltip
              key={`slot-${startH}`}
              title={`คาบที่ ${periodNum}: ${startH.toString().padStart(2, '0')}:00 - ${endH.toString().padStart(2, '0')}:00`}
              arrow
              placement="top"
            >
              <Box
                sx={{
                  position: 'absolute',
                  left: leftPos,
                  width: PIXELS_PER_HOUR,
                  top: 0,
                  height: 22,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRight: `1px dashed ${COINBASE_COLORS.hairlineSoft}`,
                  bgcolor: isLunch ? 'rgba(245, 158, 11, 0.08)' : 'transparent',
                  cursor: 'default',
                  transition: 'background-color 0.15s ease',
                  '&:hover': {
                    bgcolor: isLunch ? 'rgba(245, 158, 11, 0.16)' : 'rgba(0, 82, 255, 0.04)',
                  },
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: '0.68rem',
                    fontWeight: isLunch ? 700 : 500,
                    color: isLunch ? '#D97706' : COINBASE_COLORS.muted,
                    lineHeight: 1,
                    letterSpacing: '-0.2px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {isLunch ? 'พักเที่ยง (12-13)' : `คาบ ${periodNum}`}
                </Typography>
              </Box>
            </Tooltip>
          );
        })}
      </Box>

      {/* 2. Bottom Tier: Exact Hour Ticks (Centered on Grid Lines) */}
      <Box sx={{ position: 'relative', height: 26, width: '100%' }}>
        {hourTicks.map((hour) => {
          const isFirst = hour === START_HOUR;
          const leftPos = (hour - START_HOUR) * PIXELS_PER_HOUR;

          return (
            <Box
              key={`tick-${hour}`}
              sx={{
                position: 'absolute',
                left: leftPos,
                bottom: 2,
                transform: isFirst ? 'translateX(2px)' : 'translateX(-50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: isFirst ? 'flex-start' : 'center',
                zIndex: 10,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontFamily: COINBASE_TYPOGRAPHY.fontFamilyMono,
                  fontWeight: 600,
                  fontSize: '0.72rem',
                  color: hour === 12 ? '#B45309' : COINBASE_COLORS.body,
                  bgcolor: hour === 12 ? '#FEF3C7' : COINBASE_COLORS.surfaceStrong,
                  px: 0.75,
                  py: 0.2,
                  borderRadius: '6px',
                  border: `1px solid ${hour === 12 ? '#FDE68A' : COINBASE_COLORS.hairline}`,
                  lineHeight: 1,
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
                  whiteSpace: 'nowrap',
                }}
              >
                {hour.toString().padStart(2, '0')}:00
              </Typography>

              {/* Indicator tick notch aligned with the vertical grid line */}
              <Box
                sx={{
                  width: 2,
                  height: 4,
                  bgcolor: hour === 12 ? '#F59E0B' : COINBASE_COLORS.mutedSoft,
                  mt: 0.25,
                  borderRadius: '1px',
                  alignSelf: isFirst ? 'flex-start' : 'center',
                  ml: isFirst ? '2px' : 0,
                }}
              />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
