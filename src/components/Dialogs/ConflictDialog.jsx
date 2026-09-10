import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Typography
} from '@mui/material';
import { WarningAmberRounded as WarningIcon } from '@mui/icons-material';
import { COINBASE_COLORS } from '../../constants/coinbaseTokens';

export default function ConflictDialog({ open, onClose, conflictInfo }) {
  const message = typeof conflictInfo === 'string'
    ? conflictInfo
    : conflictInfo?.message || 'เวลาเรียนซ้อนทับกับวิชาอื่นในตาราง';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '24px',
          border: `1px solid ${COINBASE_COLORS.hairline}`,
          p: 2,
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.25, pb: 1 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: '100px',
            bgcolor: 'rgba(207, 32, 47, 0.1)',
            color: COINBASE_COLORS.semanticDown,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <WarningIcon fontSize="small" />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem', color: COINBASE_COLORS.semanticDown }}>
          ตารางเวลาเรียนชนกัน!
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ py: 2 }}>
        <DialogContentText sx={{ color: COINBASE_COLORS.body, fontSize: '0.95rem' }}>
          {message}
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          fullWidth
          variant="contained"
          onClick={onClose}
          sx={{
            height: 44,
            bgcolor: COINBASE_COLORS.semanticDown,
            '&:hover': { bgcolor: '#B01825' },
          }}
        >
          ตกลง
        </Button>
      </DialogActions>
    </Dialog>
  );
}
