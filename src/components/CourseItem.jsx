import React from 'react';
import { Paper, Box, Typography, IconButton } from '@mui/material';
import { EditRounded as EditIcon, DeleteRounded as DeleteIcon, RoomRounded as RoomIcon } from '@mui/icons-material';
import { PRESET_COLORS, PIXELS_PER_HOUR, START_HOUR, ROW_HEIGHT } from '../constants/colors';
import { timeToMinutes } from '../utils/timeUtils';

export default function CourseItem({ course, onEdit, onDelete, onDragStart, isDragging, dragStyle }) {
    const start = timeToMinutes(course.startTime);
    const end = timeToMinutes(course.endTime);
    const left = ((start - START_HOUR * 60) / 60) * PIXELS_PER_HOUR;
    const width = ((end - start) / 60) * PIXELS_PER_HOUR;
    const theme = PRESET_COLORS[course.colorIndex || 0];

    let style = { left, top: 12, width, height: ROW_HEIGHT - 24, zIndex: 1 };

    if (isDragging) {
        style = { ...style, ...dragStyle, zIndex: 1000 };
    }

    return (
        <Paper
            elevation={isDragging ? 12 : 0}
            onMouseDown={(e) => onDragStart(e, course)}
            sx={{
                position: 'absolute', ...style,
                bgcolor: theme.bg, color: theme.text, border: `2px solid ${theme.border}`,
                borderRadius: 4, p: 1.5,
                cursor: isDragging ? 'grabbing' : 'grab',
                transition: isDragging ? 'none' : 'transform 0.2s, box-shadow 0.2s',
                display: 'flex', flexDirection: 'column',
                justifyContent: 'space-between',
                userSelect: 'none', overflow: 'hidden',
                '&:hover': { transform: isDragging ? 'none' : 'scale(1.02) translateY(-2px)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, lineHeight: 1.2, fontSize: '0.9rem' }}>
                    {course.code}
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5, mt: -0.5, mr: -0.5 }}>
                    <IconButton
                        size="small"
                        onClick={(e) => { e.stopPropagation(); onEdit(course); }}
                        sx={{ p: 0.25, color: theme.text, opacity: 0.6, '&:hover': { opacity: 1, bgcolor: 'rgba(255,255,255,0.5)' } }}
                    >
                        <EditIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                    <IconButton
                        size="small"
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => { e.stopPropagation(); if (window.confirm('ลบวิชานี้?')) onDelete(course.id); }}
                        sx={{ p: 0.25, color: theme.text, opacity: 0.6, '&:hover': { opacity: 1, bgcolor: 'rgba(255,255,255,0.5)' } }}
                    >
                        <DeleteIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                </Box>
            </Box>

            <Typography
                variant="caption"
                sx={{
                    fontWeight: 500,
                    lineHeight: 1.3,
                    my: 0.5,
                    flexGrow: 1,
                    display: '-webkit-box',
                    overflow: 'hidden',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 2,
                    whiteSpace: 'normal',
                    wordBreak: 'break-word'
                }}
            >
                {course.name}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 'auto', opacity: 0.9 }}>
                {course.room && <RoomIcon sx={{ fontSize: 12 }} />}
                <Typography variant="caption" sx={{ fontSize: '0.75rem', fontWeight: 700 }}>
                    {course.room ? `${course.room} • ` : ''}{course.startTime}-{course.endTime}
                </Typography>
            </Box>
        </Paper>
    );
}
