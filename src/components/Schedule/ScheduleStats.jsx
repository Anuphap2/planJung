import React from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';
import {
  MenuBookRounded as CoursesIcon,
  TimerRounded as TimeIcon,
  CalendarTodayRounded as DayIcon,
  TimelineRounded as SpanIcon,
  TouchAppRounded as DragIcon
} from '@mui/icons-material';
import { COINBASE_COLORS, COINBASE_TYPOGRAPHY } from '../../constants/coinbaseTokens';

export default function ScheduleStats({ stats }) {
  if (!stats) return null;

  const statItems = [
    {
      label: 'วิชาที่ลงทะเบียน',
      value: `${stats.totalCourses} วิชา`,
      sub: stats.totalCourses > 0 ? 'บันทึกพร้อมใช้งาน' : 'ยังไม่มีวิชา',
      icon: <CoursesIcon sx={{ fontSize: 20, color: COINBASE_COLORS.primary }} />,
      color: COINBASE_COLORS.primary,
    },
    {
      label: 'ชั่วโมงเรียนต่อสัปดาห์',
      value: stats.totalHoursFormatted,
      sub: stats.totalMinutes > 0 ? `${stats.totalMinutes} นาทีโดยประมาณ` : '0 นาที',
      icon: <TimeIcon sx={{ fontSize: 20, color: COINBASE_COLORS.semanticUp }} />,
      color: COINBASE_COLORS.semanticUp,
    },
    {
      label: 'วันที่มีเรียน',
      value: `${stats.activeDaysCount} วัน`,
      sub: 'จากทั้งหมด 7 วัน',
      icon: <DayIcon sx={{ fontSize: 20, color: '#7C3AED' }} />,
      color: '#7C3AED',
    },
    {
      label: 'ช่วงเวลาเรียนประจำวัน',
      value: stats.earliestTime !== '-' ? `${stats.earliestTime} - ${stats.latestTime}` : 'ไม่มีเวลาเรียน',
      sub: stats.earliestTime !== '-' ? 'เริ่มเช้าสุด - เลิกช้าสุด' : 'ตารางว่าง',
      icon: <SpanIcon sx={{ fontSize: 20, color: COINBASE_COLORS.body }} />,
      color: COINBASE_COLORS.body,
    },
  ];

  return (
    <Box sx={{ mb: 3 }}>
      {/* Stats Cards Row */}
      <Grid container spacing={2}>
        {statItems.map((item, index) => (
          <Grid item xs={6} md={3} key={index}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, md: 2.5 },
                borderRadius: '18px',
                border: `1px solid ${COINBASE_COLORS.hairline}`,
                bgcolor: COINBASE_COLORS.canvas,
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: '#CCD1D9',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="caption" sx={{ color: COINBASE_COLORS.muted, fontWeight: 500 }}>
                  {item.label}
                </Typography>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '100px',
                    bgcolor: COINBASE_COLORS.surfaceStrong,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </Box>
              </Box>

              <Typography
                variant="h2"
                sx={{
                  fontFamily: COINBASE_TYPOGRAPHY.fontFamilyMono,
                  fontSize: { xs: '1.25rem', md: '1.45rem' },
                  fontWeight: 600,
                  color: COINBASE_COLORS.ink,
                  letterSpacing: '-0.5px',
                  mb: 0.5,
                }}
              >
                {item.value}
              </Typography>

              <Typography variant="caption" sx={{ color: COINBASE_COLORS.muted, display: 'block' }}>
                {item.sub}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Tip Banner */}
      <Box
        sx={{
          mt: 2,
          px: 2,
          py: 1,
          borderRadius: '12px',
          bgcolor: COINBASE_COLORS.surfaceSoft,
          border: `1px solid ${COINBASE_COLORS.hairlineSoft}`,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <DragIcon sx={{ fontSize: 18, color: COINBASE_COLORS.primary }} />
        <Typography variant="caption" sx={{ color: COINBASE_COLORS.body, fontWeight: 500 }}>
          <strong>เคล็ดลับ:</strong> สามารถคลิกลาก (Drag & Drop) บล็อกวิชาเพื่อย้ายวันหรือขยับเวลาเรียนได้ทันที และกดปุ่มดินสอบนการ์ดเพื่อแก้ไขรายละเอียด
        </Typography>
      </Box>
    </Box>
  );
}
