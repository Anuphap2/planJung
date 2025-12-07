import React from 'react';
import { Box, Typography } from '@mui/material';
import { START_HOUR, END_HOUR, PIXELS_PER_HOUR } from '../constants/colors';

export default function TimeHeader() {
    const times = [];
    for (let i = START_HOUR; i <= END_HOUR; i++) {
        times.push(
            <Box key={i} sx={{ position: 'absolute', left: (i - START_HOUR) * PIXELS_PER_HOUR, top: 0, width: PIXELS_PER_HOUR, height: '100%', borderLeft: '2px dashed #ECEFF1', pl: 1 }}>
                <Typography variant="caption" sx={{ color: '#B0BEC5', fontWeight: 600, bgcolor: '#FAFAFA', px: 0.5, borderRadius: 1 }}>
                    {i.toString().padStart(2, '0')}:00
                </Typography>
            </Box>
        );
    }
    return <>{times}</>;
}
