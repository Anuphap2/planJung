import React from 'react';
import { Box, Typography } from '@mui/material';
import { START_HOUR, END_HOUR, PIXELS_PER_HOUR } from '../../constants/colors';
import { COINBASE_COLORS, COINBASE_TYPOGRAPHY } from '../../constants/coinbaseTokens';

export default function TimeHeader() {
  const times = [];

  for (let hour = START_HOUR; hour <= END_HOUR; hour++) {
    times.push(
      <Box
        key={hour}
        sx={{
          position: 'absolute',
          left: (hour - START_HOUR) * PIXELS_PER_HOUR,
          top: 0,
          width: PIXELS_PER_HOUR,
          height: '100%',
          borderLeft: `1px dashed ${COINBASE_COLORS.hairline}`,
          pl: 1,
          pt: 1,
          display: 'flex',
          alignItems: 'flex-start',
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontFamily: COINBASE_TYPOGRAPHY.fontFamilyMono,
            fontWeight: 600,
            fontSize: '0.75rem',
            color: COINBASE_COLORS.body,
            bgcolor: COINBASE_COLORS.surfaceStrong,
            px: 0.75,
            py: 0.25,
            borderRadius: '6px',
            lineHeight: 1,
          }}
        >
          {hour.toString().padStart(2, '0')}:00
        </Typography>
      </Box>
    );
  }

  return <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>{times}</Box>;
}
