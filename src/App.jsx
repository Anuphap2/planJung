import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  IconButton,
  AppBar,
  Toolbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  ThemeProvider,
  CssBaseline,
  Fab,
  Snackbar,
  Alert,
  Zoom,
  useMediaQuery,
  useTheme,
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction
} from '@mui/material';
import {
  Add as AddIcon,
  CalendarMonthRounded as CalendarIcon,
  AccessTimeRounded as TimeIcon,
  RestartAltRounded as ResetIcon,
  ShareRounded as ShareIcon,
  ContentCopyRounded as CopyIcon,
  WarningRounded as WarningIcon,
  MenuRounded as MenuIcon,
  CloseRounded as CloseIcon
} from '@mui/icons-material';

import { theme } from './theme/theme';
import { DAYS, DAYS_TH, DAYS_COLORS, START_HOUR, END_HOUR, PIXELS_PER_HOUR, HEADER_WIDTH, ROW_HEIGHT } from './constants/colors';
import { timeToMinutes, minutesToTime } from './utils/timeUtils';
import CourseDialog from './components/CourseDialog';
import CourseItem from './components/CourseItem';
import TimeHeader from './components/TimeHeader';

export default function App() {
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));

  // --- State ---
  const [courses, setCourses] = useState(() => {
    try {
      const saved = localStorage.getItem('mySchedule');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });


  const [editingId, setEditingId] = useState(null);
  const [initialDialogData, setInitialDialogData] = useState(null);

  // UI State
  const [openForm, setOpenForm] = useState(false);
  const [openShare, setOpenShare] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  // Alert State
  const [alertInfo, setAlertInfo] = useState({ open: false, message: '', severity: 'info' });
  const [conflictDialog, setConflictDialog] = useState({ open: false, message: '' });

  // Drag State
  const [dragState, setDragState] = useState({
    isDragging: false, courseId: null, startX: 0, startY: 0, currentX: 0, currentY: 0, originalCourse: null
  });

  // --- SEO Implementation ---
  useEffect(() => {
    document.title = "PlanJung (แพลนจัง) - เว็บจัดตารางเรียน";

    const metaTags = [
      { name: 'description', content: 'PlanJung (แพลนจัง) เว็บไซต์จัดตารางเรียนออนไลน์ฟรี ใช้งานง่าย สไตล์น่ารัก (Pastel) ช่วยวางแผนลงทะเบียนเรียน ออกแบบตารางสอนมหาวิทยาลัย พร้อมระบบเช็คเวลาเรียนชนกัน รองรับการแชร์ให้เพื่อน' },
      { name: 'keywords', content: 'PlanJung, แพลนจัง, จัดตารางเรียน, ตารางเรียนออนไลน์, ตารางสอน, Class Schedule, Planner, มหาวิทยาลัย, ลงทะเบียนเรียน, แจกตารางเรียนฟรี' },
      { name: 'author', content: 'PlanJung' },
      { property: 'og:title', content: 'PlanJung (แพลนจัง) - จัดตารางเรียนออนไลน์ฟรี' },
      { property: 'og:description', content: 'มาวางแผนการเรียนแบบน่ารักๆ กันเถอะ! ใช้งานง่าย ฟรี ไม่ต้องสมัครสมาชิก' },
      { property: 'og:type', content: 'website' },
    ];

    metaTags.forEach(tagData => {
      let tag;
      if (tagData.name) {
        tag = document.querySelector(`meta[name="${tagData.name}"]`);
      } else if (tagData.property) {
        tag = document.querySelector(`meta[property="${tagData.property}"]`);
      }

      if (!tag) {
        tag = document.createElement('meta');
        document.head.appendChild(tag);
      }

      Object.keys(tagData).forEach(key => {
        tag.setAttribute(key, tagData[key]);
      });
    });
  }, []);

  // --- Load/Save & Share Logic ---
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedData = params.get('schedule');

    if (sharedData) {
      try {
        const decoded = JSON.parse(atob(sharedData));
        if (window.confirm('พบตารางเรียนที่ถูกแชร์มา! ต้องการโหลดแทนที่ตารางเดิมไหมครับ?')) {
          setCourses(decoded);
          window.history.replaceState({}, document.title, window.location.pathname);
          setAlertInfo({ open: true, message: 'โหลดตารางเรียนจากเพื่อนเรียบร้อย! 🎉', severity: 'success' });
          return;
        }
      } catch {
        setAlertInfo({ open: true, message: 'ลิงก์แชร์ไม่ถูกต้อง 😢', severity: 'error' });
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('mySchedule', JSON.stringify(courses));
  }, [courses]);

  const checkConflict = (newCourse, excludeId = null) => {
    if (!newCourse || !newCourse.startTime || !newCourse.endTime) return null;
    const nStart = timeToMinutes(newCourse.startTime);
    const nEnd = timeToMinutes(newCourse.endTime);
    for (let c of courses) {
      if (excludeId && c.id === excludeId) continue;
      if (c.day === newCourse.day) {
        const cStart = timeToMinutes(c.startTime);
        const cEnd = timeToMinutes(c.endTime);
        if (nStart < cEnd && nEnd > cStart) return c;
      }
    }
    return null;
  };

  // --- Handlers (Hoisted for useEffect) ---
  const handleDrop = () => {
    const { startX, startY, currentX, currentY, originalCourse } = dragState;
    if (!originalCourse) return;

    const deltaX = currentX - startX;
    const deltaY = currentY - startY;

    const rowChange = Math.round(deltaY / ROW_HEIGHT);
    let newDayIdx = DAYS.indexOf(originalCourse.day) + rowChange;
    if (newDayIdx < 0) newDayIdx = 0; if (newDayIdx > 6) newDayIdx = 6;

    const minChange = Math.round((deltaX / PIXELS_PER_HOUR) * 60 / 30) * 30;
    const oldStart = timeToMinutes(originalCourse.startTime);
    const duration = timeToMinutes(originalCourse.endTime) - oldStart;

    let newStart = oldStart + minChange;
    let newEnd = newStart + duration;

    const minDay = START_HOUR * 60; const maxDay = END_HOUR * 60;
    if (newStart < minDay) { newStart = minDay; newEnd = newStart + duration; }
    if (newEnd > maxDay) { newEnd = maxDay; newStart = newEnd - duration; }

    const newCourse = { ...originalCourse, day: DAYS[newDayIdx], startTime: minutesToTime(newStart), endTime: minutesToTime(newEnd) };
    const conflict = checkConflict(newCourse, originalCourse.id);

    if (!conflict) {
      setCourses(prev => prev.map(c => c.id === originalCourse.id ? newCourse : c));
    } else {
      setAlertInfo({ open: true, message: `วางไม่ได้! ชนกับ ${conflict.code}`, severity: 'error' });
    }
    setDragState({ isDragging: false, courseId: null, startX: 0, startY: 0, currentX: 0, currentY: 0, originalCourse: null });
  };

  // --- Drag Logic ---
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!dragState.isDragging) return;
      setDragState(prev => ({ ...prev, currentX: e.clientX, currentY: e.clientY }));
    };
    const handleMouseUp = () => {
      if (!dragState.isDragging) return;
      handleDrop();
    };
    if (dragState.isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragState]);



  // --- Handlers ---
  const handleEditClick = (course) => {
    setInitialDialogData({
      code: course.code,
      name: course.name,
      day: course.day,
      startTime: course.startTime,
      endTime: course.endTime,
      room: course.room || '',
      colorIndex: course.colorIndex || 0,
    });
    setEditingId(course.id);
    setOpenForm(true);
  };

  const handleOpenAddForm = () => {
    setInitialDialogData(null);
    setEditingId(null);
    setOpenForm(true);
  };

  const handleSave = (formData) => {
    if (timeToMinutes(formData.startTime) >= timeToMinutes(formData.endTime)) {
      setAlertInfo({ open: true, message: 'เวลาเลิกเรียน ต้องมากกว่า เวลาเริ่มเรียนนะ 🥺', severity: 'warning' });
      return;
    }

    const conflict = checkConflict(formData, editingId);

    if (conflict) {
      setConflictDialog({ open: true, message: `เวลาเรียนชนกับวิชา "${conflict.code} ${conflict.name}" เต็มๆ เลยครับ!` });
      return;
    }

    if (editingId) {
      setCourses(courses.map(c => c.id === editingId ? { ...formData, id: editingId } : c));
      setAlertInfo({ open: true, message: 'แก้ไขข้อมูลเรียบร้อย! ✨', severity: 'success' });
    } else {
      setCourses([...courses, { ...formData, id: crypto.randomUUID() }]);
      setAlertInfo({ open: true, message: 'เพิ่มวิชาเรียบร้อย! ✨', severity: 'success' });
    }

    setOpenForm(false);
  };

  const handleShare = () => {
    const json = JSON.stringify(courses);
    const encoded = btoa(json);
    const url = `${window.location.origin}${window.location.pathname}?schedule=${encoded}`;
    setShareUrl(url);
    setOpenShare(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setAlertInfo({ open: true, message: 'คัดลอกลิงก์แล้ว! ส่งให้เพื่อนได้เลย', severity: 'success' });
    setOpenShare(false);
  };



  const handleDragStart = (e, course) => {
    e.stopPropagation();
    setDragState({
      isDragging: true, courseId: course.id, startX: e.clientX, startY: e.clientY, currentX: e.clientX, currentY: e.clientY, originalCourse: course
    });
  };

  const handleDelete = (id) => {
    setCourses(courses.filter(c => c.id !== id));
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;700&display=swap');
        ::-webkit-scrollbar { height: 8px; width: 8px; }
        ::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 4px; }
        ::-webkit-scrollbar-thumb { background: #cfd8dc; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #b0bec5; }
      `}</style>

      <Box sx={{ minHeight: '100vh', pb: 12, bgcolor: '#FDFBF7', backgroundImage: 'radial-gradient(circle at 10% 20%, rgb(253, 251, 247) 0%, rgb(240, 244, 255) 90%)' }}>

        {/* --- Navbar --- */}
        <AppBar position="sticky" color="transparent" elevation={0} sx={{ backdropFilter: 'blur(20px)', bgcolor: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{
                bgcolor: 'white',
                p: 0.8,
                borderRadius: '16px',
                display: 'flex',
                boxShadow: '0 4px 12px rgba(124, 77, 255, 0.2)',
                border: '1px solid rgba(124, 77, 255, 0.1)'
              }}>
                <img src="icon.png" alt="PlanJung Icon" style={{ width: '64px', height: '64px', objectFit: 'contain' }} />
              </Box>
              <Box>
                <Typography variant="h1" sx={{ color: 'primary.main', lineHeight: 1, fontSize: { xs: '1.25rem', md: '1.5rem' } }}>PlanJung</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: { xs: 'none', sm: 'block' } }}>วางแผนการเรียนของเราให้ดีเตรียมตัวกับทุกเทอม</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<ShareIcon />}
                onClick={handleShare}
                sx={{
                  borderRadius: 50,
                  px: 2,
                  borderColor: 'secondary.main',
                  color: 'secondary.main',
                  display: { xs: 'none', md: 'flex' }
                }}
              >
                แชร์ตาราง
              </Button>
              <IconButton color="error" onClick={() => setOpenConfirm(true)} sx={{ border: '1px solid', borderColor: 'error.main', display: { xs: 'none', md: 'flex' } }}>
                <ResetIcon />
              </IconButton>
              <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAddForm} sx={{ borderRadius: 50, px: 3, display: { xs: 'none', md: 'flex' } }}>
                เพิ่มวิชา
              </Button>
            </Box>
          </Toolbar>
        </AppBar>

        {/* --- Main Content (Full Width Schedule) --- */}
        <Container maxWidth="xl" sx={{ mt: { xs: 2, md: 4 } }}>
          <Paper sx={{ overflow: 'hidden', border: '1px solid #E0E0E0', bgcolor: 'white', position: 'relative', borderRadius: 2 }}>
            <Box sx={{ overflowX: 'auto', position: 'relative', pb: 2 }}>
              <Box sx={{ minWidth: HEADER_WIDTH + (END_HOUR - START_HOUR + 1) * PIXELS_PER_HOUR }}>

                {/* Header Time */}
                <Box sx={{ height: 50, display: 'flex', borderBottom: '1px solid #F0F0F0', position: 'sticky', top: 0, zIndex: 10, bgcolor: 'rgba(255,255,255,0.98)' }}>
                  <Box sx={{ width: HEADER_WIDTH, borderRight: '1px solid #F0F0F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <TimeIcon color="disabled" />
                  </Box>
                  <Box sx={{ flexGrow: 1, position: 'relative' }}><TimeHeader /></Box>
                </Box>

                {/* Days Rows */}
                {DAYS.map((day, idx) => (
                  <Box key={day} sx={{ height: ROW_HEIGHT, display: 'flex', borderBottom: '1px solid #FAFAFA', position: 'relative', '&:hover': { bgcolor: '#FAFAFA' }, transition: 'background 0.2s' }}>
                    <Box sx={{ width: HEADER_WIDTH, borderRight: '1px solid #F0F0F0', bgcolor: 'white', position: 'sticky', left: 0, zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: DAYS_COLORS[idx] }}>{DAYS_TH[idx]}</Typography>
                      <Typography variant="caption" sx={{ color: '#CFD8DC', fontWeight: 600 }}>{day.substring(0, 3)}</Typography>
                    </Box>
                    <Box sx={{ flexGrow: 1, position: 'relative' }}>
                      {Array.from({ length: END_HOUR - START_HOUR }).map((_, h) => (
                        <Box key={h} sx={{ position: 'absolute', left: h * PIXELS_PER_HOUR, top: 0, bottom: 0, width: 1, bgcolor: '#F5F5F5' }} />
                      ))}
                      {courses.filter(c => c.day === day).map((course) => (
                        <CourseItem
                          key={course.id}
                          course={course}
                          onEdit={handleEditClick}
                          onDelete={handleDelete}
                          onDragStart={handleDragStart}
                          isDragging={dragState.isDragging && dragState.courseId === course.id}
                          dragStyle={{
                            left: ((timeToMinutes(course.startTime) - START_HOUR * 60) / 60) * PIXELS_PER_HOUR + (dragState.currentX - dragState.startX),
                            top: 12 + (dragState.currentY - dragState.startY)
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                ))}

              </Box>
            </Box>
          </Paper>
          <Typography variant="caption" align="center" sx={{ display: 'block', mt: 2, color: 'text.secondary' }}>
            Tip: ลากวิชาเพื่อย้ายเวลาได้เลย • กดปุ่มแก้ไขเพื่อเปลี่ยนรายละเอียด
          </Typography>
        </Container>

        {/* --- Floating Action Button (Mobile Menu) --- */}
        <Zoom in={true} style={{ transitionDelay: '300ms' }}>
          <Box sx={{ position: 'fixed', bottom: 32, right: 32, display: { md: 'none' }, zIndex: 100 }}>
            <SpeedDial
              ariaLabel="Mobile Menu"
              icon={<SpeedDialIcon icon={<MenuIcon />} openIcon={<CloseIcon />} />}
              sx={{
                '& .MuiFab-primary': {
                  width: 56, height: 56,

                  boxShadow: '0 8px 32px rgba(124, 77, 255, 0.4)'
                }
              }}
            >
              <SpeedDialAction
                icon={<AddIcon />}
                tooltipTitle="เพิ่มวิชา"
                tooltipOpen
                onClick={handleOpenAddForm}

              />
              <SpeedDialAction
                icon={<ShareIcon />}
                tooltipTitle="แชร์ตาราง"
                tooltipOpen
                onClick={handleShare}

              />
              <SpeedDialAction
                icon={<ResetIcon />}
                tooltipTitle="ล้างข้อมูล"
                tooltipOpen
                onClick={() => setOpenConfirm(true)}

              />
            </SpeedDial>
          </Box>
        </Zoom>

        {/* --- Dialog: Add/Edit Course Form --- */}
        <CourseDialog
          key={openForm ? (editingId || 'add') : 'closed'}
          open={openForm}
          handleClose={() => setOpenForm(false)}
          onSave={handleSave}
          editingId={editingId}
          initialData={initialDialogData}
          fullScreen={isMobile}
        />

        {/* --- Dialog: Share --- */}
        <Dialog open={openShare} onClose={() => setOpenShare(false)} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ textAlign: 'center' }}>แชร์ตารางเรียน 🔗</DialogTitle>
          <DialogContent>
            <Box sx={{ bgcolor: '#F5F5F5', p: 2, borderRadius: 2, mb: 2, wordBreak: 'break-all', fontFamily: 'monospace', fontSize: '0.85rem', maxHeight: 150, overflowY: 'auto' }}>
              {shareUrl}
            </Box>
            <Button fullWidth variant="contained" startIcon={<CopyIcon />} onClick={handleCopyLink} size="large">
              คัดลอกลิงก์
            </Button>
          </DialogContent>
        </Dialog>

        {/* --- Dialog: Conflict Warning --- */}
        <Dialog open={conflictDialog.open} onClose={() => setConflictDialog({ ...conflictDialog, open: false })}>
          <DialogTitle sx={{ color: 'error.main', display: 'flex', alignItems: 'center', gap: 1 }}>
            <WarningIcon /> ตารางเรียนชนกัน!
          </DialogTitle>
          <DialogContent>
            <DialogContentText>{conflictDialog.message}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConflictDialog({ ...conflictDialog, open: false })} variant="contained" color="error">ตกลง</Button>
          </DialogActions>
        </Dialog>

        {/* --- Dialog: Confirm Reset --- */}
        <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
          <DialogTitle>ล้างข้อมูลทั้งหมด?</DialogTitle>
          <DialogContent><DialogContentText>ข้อมูลจะหายไปถาวรเลยนะครับ แน่ใจนะ?</DialogContentText></DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenConfirm(false)}>ยกเลิก</Button>
            <Button onClick={() => { setCourses([]); setOpenConfirm(false); setAlertInfo({ open: true, message: 'ล้างตารางเรียบร้อย', severity: 'info' }) }} color="error">ล้างข้อมูล</Button>
          </DialogActions>
        </Dialog>

        {/* --- Snackbar (Toast Notifications) --- */}
        <Snackbar
          open={alertInfo.open}
          autoHideDuration={4000}
          onClose={() => setAlertInfo({ ...alertInfo, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={() => setAlertInfo({ ...alertInfo, open: false })} severity={alertInfo.severity} variant="filled" sx={{ width: '100%', borderRadius: 3 }}>
            {alertInfo.message}
          </Alert>
        </Snackbar>

      </Box>
    </ThemeProvider>
  );
}