import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  ShareRounded as ShareIcon,
  ContentCopyRounded as CopyIcon,
  CloseRounded as CloseIcon,
  CheckRounded as CheckIcon
} from '@mui/icons-material';
import { COINBASE_COLORS, COINBASE_TYPOGRAPHY } from '../../constants/coinbaseTokens';

export default function ShareDialog({ open, onClose, shareUrl }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!shareUrl) return;
    try {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy share url:', err);
    }
  };

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
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '100px',
              bgcolor: COINBASE_COLORS.surfaceStrong,
              color: COINBASE_COLORS.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ShareIcon fontSize="small" />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
            แชร์ตารางเรียน
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ py: 2 }}>
        <Typography variant="body2" sx={{ color: COINBASE_COLORS.body, mb: 2 }}>
          ส่งลิงก์นี้ให้เพื่อนเพื่อเปิดดูตารางเรียนของคุณได้ทันที ข้อมูลวิชาทั้งหมดจะถูกเข้ารหัสลงในลิงก์อย่างปลอดภัย
        </Typography>

        <Box
          sx={{
            bgcolor: COINBASE_COLORS.surfaceSoft,
            border: `1px solid ${COINBASE_COLORS.hairline}`,
            borderRadius: '12px',
            p: 1.75,
            fontFamily: COINBASE_TYPOGRAPHY.fontFamilyMono,
            fontSize: '0.8rem',
            color: COINBASE_COLORS.ink,
            wordBreak: 'break-all',
            maxHeight: 120,
            overflowY: 'auto',
            userSelect: 'all',
          }}
        >
          {shareUrl || 'กำลังสร้างลิงก์...'}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleCopy}
          startIcon={copied ? <CheckIcon /> : <CopyIcon />}
          sx={{ height: 44 }}
        >
          {copied ? 'คัดลอกลิงก์สำเร็จแล้ว!' : 'คัดลอกลิงก์'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
