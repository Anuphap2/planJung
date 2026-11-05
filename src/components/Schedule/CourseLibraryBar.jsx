import React, { useState } from 'react';
import { Box, Paper, Typography, Button, Chip, Tooltip, IconButton, Collapse } from '@mui/material';
import {
  LibraryBooksRounded as LibraryIcon,
  AddRounded as AddIcon,
  AutoAwesomeRounded as DemoIcon,
  KeyboardArrowDownRounded as ExpandIcon,
  KeyboardArrowUpRounded as CollapseIcon,
  ScheduleRounded as ClockIcon
} from '@mui/icons-material';
import { COINBASE_COLORS, COINBASE_TYPOGRAPHY } from '../../constants/coinbaseTokens';
import { PRESET_COLORS, DAY_SHORT_TH_MAP } from '../../constants/colors';

export default function CourseLibraryBar({
  courses = [],
  onOpenAdd,
  onDuplicate,
  onLoadSample,
}) {
  const [expanded, setExpanded] = useState(true);

  // Group current schedule by distinct course code
  const uniqueCourseGroups = React.useMemo(() => {
    if (!Array.isArray(courses) || courses.length === 0) return [];

    const map = new Map();
    courses.forEach(c => {
      if (!c || !c.code) return;
      const key = c.code.trim().toUpperCase();
      if (!map.has(key)) {
        map.set(key, {
          code: key,
          name: c.name,
          room: c.room,
          colorIndex: c.colorIndex,
          items: [c],
        });
      } else {
        const group = map.get(key);
        group.items.push(c);
      }
    });

    return Array.from(map.values());
  }, [courses]);

  if (courses.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          mb: 3,
          p: 2.5,
          borderRadius: '18px',
          border: `1px dashed ${COINBASE_COLORS.hairline}`,
          bgcolor: COINBASE_COLORS.canvas,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '12px',
              bgcolor: 'rgba(0, 82, 255, 0.08)',
              color: COINBASE_COLORS.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <DemoIcon sx={{ fontSize: 24 }} />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: COINBASE_COLORS.ink }}>
              ยังไม่มีวิชาเรียนในตาราง
            </Typography>
            <Typography variant="caption" sx={{ color: COINBASE_COLORS.muted }}>
              เริ่มต้นสร้างวิชาเรียนของคุณ หรือคลิกโหลดตัวอย่างตารางเรียนเพื่อทดสอบระบบได้ทันที
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, width: { xs: '100%', sm: 'auto' } }}>
          <Button
            variant="outlined"
            onClick={onLoadSample}
            startIcon={<DemoIcon sx={{ fontSize: 18 }} />}
            sx={{
              flex: { xs: 1, sm: 'none' },
              height: 40,
              fontSize: '0.85rem',
            }}
          >
            โหลดตัวอย่างตาราง
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={onOpenAdd}
            startIcon={<AddIcon sx={{ fontSize: 18 }} />}
            sx={{
              flex: { xs: 1, sm: 'none' },
              height: 40,
              fontSize: '0.85rem',
            }}
          >
            เพิ่มวิชาแรก
          </Button>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        mb: 3,
        borderRadius: '18px',
        border: `1px solid ${COINBASE_COLORS.hairline}`,
        bgcolor: COINBASE_COLORS.canvas,
        overflow: 'hidden',
        transition: 'all 0.2s ease',
      }}
    >
      {/* Header Row */}
      <Box
        sx={{
          px: 2.5,
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: expanded ? `1px solid ${COINBASE_COLORS.hairlineSoft}` : 'none',
          bgcolor: 'rgba(250, 250, 251, 0.7)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <LibraryIcon sx={{ fontSize: 18, color: COINBASE_COLORS.primary }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: COINBASE_COLORS.ink }}>
            คลังวิชาเรียนในตาราง
          </Typography>
          <Chip
            label={`${uniqueCourseGroups.length} วิชา (${courses.length} คาบ)`}
            size="small"
            sx={{
              height: 22,
              fontSize: '0.7rem',
              fontWeight: 700,
              bgcolor: COINBASE_COLORS.surfaceStrong,
              color: COINBASE_COLORS.body,
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            size="small"
            variant="text"
            onClick={onOpenAdd}
            startIcon={<AddIcon sx={{ fontSize: 16 }} />}
            sx={{ fontSize: '0.8rem', color: COINBASE_COLORS.primary, fontWeight: 600 }}
          >
            เพิ่มวิชาใหม่
          </Button>

          <IconButton
            size="small"
            onClick={() => setExpanded(!expanded)}
            sx={{ color: COINBASE_COLORS.muted }}
          >
            {expanded ? <CollapseIcon fontSize="small" /> : <ExpandIcon fontSize="small" />}
          </IconButton>
        </Box>
      </Box>

      {/* Expanded Course Cards List */}
      <Collapse in={expanded}>
        <Box
          sx={{
            p: 2,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1.5,
            bgcolor: COINBASE_COLORS.canvas,
          }}
        >
          {uniqueCourseGroups.map((group) => {
            const themeIdx = typeof group.colorIndex === 'number' ? group.colorIndex : 0;
            const theme = PRESET_COLORS[themeIdx] || PRESET_COLORS[0];

            return (
              <Box
                key={group.code}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  p: 1.25,
                  borderRadius: '12px',
                  bgcolor: theme.bg,
                  border: `1px solid ${theme.border}`,
                  borderLeft: `4px solid ${theme.accent || theme.badgeBg}`,
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    borderColor: theme.accent || theme.badgeBg,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  },
                }}
              >
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        fontFamily: COINBASE_TYPOGRAPHY.fontFamilyMono,
                        fontWeight: 700,
                        fontSize: '0.78rem',
                        color: theme.accent || theme.text,
                      }}
                    >
                      {group.code}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        fontSize: '0.82rem',
                        color: theme.text,
                        maxWidth: 200,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {group.name}
                    </Typography>
                  </Box>

                  {/* Badges for active sessions */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                    <ClockIcon sx={{ fontSize: 12, color: theme.text, opacity: 0.7 }} />
                    <Typography variant="caption" sx={{ fontSize: '0.7rem', color: theme.text, opacity: 0.85 }}>
                      {group.items.map((item) => {
                        const dayTh = DAY_SHORT_TH_MAP[item.day] || item.day;
                        return `${dayTh} ${item.startTime}-${item.endTime}`;
                      }).join(' | ')}
                    </Typography>
                  </Box>
                </Box>

                {/* Quick Add Another Day Button */}
                <Tooltip title="เพิ่มอีกวันสำหรับวิชานี้ (เช่น เลกเชอร์ + แล็บ)" arrow placement="top">
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => onDuplicate(group.items[0])}
                    startIcon={<AddIcon sx={{ fontSize: 14 }} />}
                    sx={{
                      height: 30,
                      px: 1.25,
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      borderRadius: '8px',
                      bgcolor: 'rgba(255, 255, 255, 0.95)',
                      color: theme.text,
                      border: `1px solid ${theme.border}`,
                      boxShadow: 'none',
                      whiteSpace: 'nowrap',
                      '&:hover': {
                        bgcolor: theme.accent || COINBASE_COLORS.primary,
                        color: '#FFFFFF',
                        borderColor: theme.accent || COINBASE_COLORS.primary,
                      },
                    }}
                  >
                    + เพิ่มอีกวัน
                  </Button>
                </Tooltip>
              </Box>
            );
          })}
        </Box>
      </Collapse>
    </Paper>
  );
}
