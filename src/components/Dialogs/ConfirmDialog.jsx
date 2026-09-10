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
import { DeleteOutlineRounded as DangerIcon } from '@mui/icons-material';
import { COINBASE_COLORS } from '../../constants/coinbaseTokens';

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'ยืนยันการดำเนินการ?',
  message = 'ข้อมูลจะไม่สามารถกู้คืนได้ คุณแน่ใจหรือไม่?',
  confirmText = 'ยืนยัน',
  confirmColor = 'error',
}) {
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
            bgcolor: confirmColor === 'error' ? 'rgba(207, 32, 47, 0.1)' : COINBASE_COLORS.surfaceStrong,
            color: confirmColor === 'error' ? COINBASE_COLORS.semanticDown : COINBASE_COLORS.ink,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <DangerIcon fontSize="small" />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
          {title}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ py: 2 }}>
        <DialogContentText sx={{ color: COINBASE_COLORS.body, fontSize: '0.95rem' }}>
          {message}
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, gap: 1.5 }}>
        <Button onClick={onClose} variant="outlined" sx={{ height: 44, flex: 1 }}>
          ยกเลิก
        </Button>
        <Button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          variant="contained"
          color={confirmColor}
          sx={{
            height: 44,
            flex: 1,
            ...(confirmColor === 'error'
              ? {
                  bgcolor: COINBASE_COLORS.semanticDown,
                  '&:hover': { bgcolor: '#B01825' },
                }
              : {}),
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
