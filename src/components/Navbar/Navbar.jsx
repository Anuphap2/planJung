import React from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Chip
} from '@mui/material';
import {
  AddRounded as AddIcon,
  ShareRounded as ShareIcon,
  RestartAltRounded as ResetIcon,
  ScheduleRounded as ClockIcon
} from '@mui/icons-material';
import { COINBASE_COLORS } from '../../constants/coinbaseTokens';

export default function Navbar({
  stats,
  onOpenAdd,
  onOpenShare,
  onOpenReset,
}) {
  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{
        height: 64,
        bgcolor: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${COINBASE_COLORS.hairline}`,
        zIndex: 1100,
        justifyContent: 'center',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 4 } }}>
        {/* Brand & Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '12px',
              bgcolor: COINBASE_COLORS.canvas,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1px solid ${COINBASE_COLORS.hairline}`,
              boxShadow: '0 2px 8px rgba(0, 82, 255, 0.08)',
              p: 0.5,
              overflow: 'hidden',
            }}
          >
            <img
              src="/icon.png"
              alt="PlanJung"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </Box>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '1.15rem', md: '1.3rem' },
                  fontWeight: 600,
                  color: COINBASE_COLORS.ink,
                  lineHeight: 1.1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                PlanJung
              </Typography>
              <Chip
                label="Coinbase Edition"
                size="small"
                sx={{
                  height: 20,
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  bgcolor: COINBASE_COLORS.surfaceStrong,
                  color: COINBASE_COLORS.primary,
                  display: { xs: 'none', sm: 'inline-flex' },
                }}
              />
            </Box>
            <Typography
              variant="caption"
              sx={{
                color: COINBASE_COLORS.muted,
                display: { xs: 'none', sm: 'block' },
                lineHeight: 1,
              }}
            >
              เว็บจัดตารางเรียน วางแผนลงทะเบียนออนไลน์
            </Typography>
          </Box>
        </Box>

        {/* Quick Header Stats (Tablet/Desktop) */}
        {stats && stats.totalCourses > 0 && (
          <Box
            sx={{
              display: { xs: 'none', lg: 'flex' },
              alignItems: 'center',
              gap: 2,
              px: 2,
              py: 0.5,
              bgcolor: COINBASE_COLORS.surfaceSoft,
              borderRadius: '100px',
              border: `1px solid ${COINBASE_COLORS.hairline}`,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <ClockIcon sx={{ fontSize: 16, color: COINBASE_COLORS.primary }} />
              <Typography variant="caption" sx={{ fontWeight: 600, color: COINBASE_COLORS.ink }}>
                {stats.totalCourses} วิชา ({stats.totalHoursFormatted})
              </Typography>
            </Box>
          </Box>
        )}

        {/* Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<ShareIcon sx={{ fontSize: 18 }} />}
            onClick={onOpenShare}
            sx={{
              height: 40,
              fontSize: '0.85rem',
              display: { xs: 'none', sm: 'inline-flex' },
            }}
          >
            แชร์ตาราง
          </Button>

          <Tooltip title="ล้างตารางทั้งหมด">
            <IconButton
              onClick={onOpenReset}
              sx={{
                width: 40,
                height: 40,
                color: COINBASE_COLORS.body,
                border: `1px solid ${COINBASE_COLORS.hairline}`,
                borderRadius: '100px',
                '&:hover': {
                  color: COINBASE_COLORS.semanticDown,
                  borderColor: COINBASE_COLORS.semanticDown,
                  bgcolor: 'rgba(207, 32, 47, 0.04)',
                },
              }}
            >
              <ResetIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={onOpenAdd}
            sx={{
              height: 40,
              px: { xs: 2, sm: 2.5 },
              fontSize: '0.85rem',
            }}
          >
            เพิ่มวิชา
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
