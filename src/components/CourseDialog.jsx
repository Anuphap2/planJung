import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Button,
    Box,
    IconButton,
    Tooltip,
    InputAdornment,
    Typography
} from '@mui/material';
import {
    Add as AddIcon,
    EditRounded as EditIcon,
    CloseRounded as CloseIcon,
    RoomRounded as RoomIcon
} from '@mui/icons-material';
import { PRESET_COLORS, DAYS, DAYS_TH, DAYS_COLORS } from '../constants/colors';

export default function CourseDialog({ open, handleClose, onSave, editingId, initialData, fullScreen }) {
    const [formData, setFormData] = useState(initialData || {
        code: '',
        name: '',
        day: 'Monday',
        startTime: '09:00',
        endTime: '12:00',
        room: '',
        colorIndex: 0,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth fullScreen={fullScreen}>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, pb: 1 }}>
                <Box sx={{ bgcolor: 'primary.light', color: 'white', p: 0.5, borderRadius: 2 }}>
                    {editingId ? <EditIcon /> : <AddIcon />}
                </Box>
                {editingId ? 'แก้ไขข้อมูลวิชา' : 'เพิ่มวิชาใหม่'}
                <IconButton onClick={handleClose} sx={{ ml: 'auto' }}><CloseIcon /></IconButton>
            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, py: 3 }}>
                    <TextField
                        label="รหัสวิชา" placeholder="CS101" fullWidth required autoFocus
                        value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                        InputProps={{ startAdornment: <InputAdornment position="start">🏷️</InputAdornment> }}
                    />
                    <TextField
                        label="ชื่อวิชา" placeholder="Introduction to Computer" fullWidth required
                        value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                    <TextField select label="วันเรียน" fullWidth value={formData.day} onChange={e => setFormData({ ...formData, day: e.target.value })}>
                        {DAYS.map((d, i) => (
                            <MenuItem key={d} value={d}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: DAYS_COLORS[i] }} /> {DAYS_TH[i]}
                                </Box>
                            </MenuItem>
                        ))}
                    </TextField>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField label="เริ่ม" type="time" fullWidth InputLabelProps={{ shrink: true }} inputProps={{ step: 1800 }} value={formData.startTime} onChange={e => setFormData({ ...formData, startTime: e.target.value })} />
                        <TextField label="ถึง" type="time" fullWidth InputLabelProps={{ shrink: true }} inputProps={{ step: 1800 }} value={formData.endTime} onChange={e => setFormData({ ...formData, endTime: e.target.value })} />
                    </Box>
                    <TextField
                        label="ห้อง / อาจารย์" fullWidth value={formData.room} onChange={e => setFormData({ ...formData, room: e.target.value })}
                        InputProps={{ startAdornment: <InputAdornment position="start"><RoomIcon fontSize="small" color="action" /></InputAdornment> }}
                    />
                    <Box>
                        <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>เลือกธีมสี</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                            {PRESET_COLORS.map((c, i) => (
                                <Tooltip title={c.name} key={i}>
                                    <Box
                                        onClick={() => setFormData({ ...formData, colorIndex: i })}
                                        sx={{
                                            width: 36, height: 36, borderRadius: '50%', bgcolor: c.bg, border: `2px solid ${c.border}`, cursor: 'pointer',
                                            transform: formData.colorIndex === i ? 'scale(1.1)' : 'scale(1)',
                                            boxShadow: formData.colorIndex === i ? `0 0 0 2px white, 0 0 0 4px ${c.border}` : 'none',
                                            transition: '0.2s'
                                        }}
                                    />
                                </Tooltip>
                            ))}
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={handleClose} color="inherit">ยกเลิก</Button>
                    <Button type="submit" variant="contained" size="large" sx={{ px: 4 }}>
                        {editingId ? 'บันทึกแก้ไข' : 'เพิ่มลงตาราง'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
