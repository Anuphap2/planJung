import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  ThemeProvider,
  CssBaseline,
  Snackbar,
  Alert,
  Fab,
  Tooltip,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  AddRounded as AddIcon,
  ShareRounded as ShareIcon,
  RestartAltRounded as ResetIcon
} from '@mui/icons-material';

import { theme } from './theme/theme';
import { COINBASE_COLORS } from './constants/coinbaseTokens';
import { useSchedule } from './hooks/useSchedule';
import { useScheduleDrag } from './hooks/useScheduleDrag';
import { encodeScheduleForShare } from './utils/scheduleStorage';

import Navbar from './components/Navbar/Navbar';
import ScheduleStats from './components/Schedule/ScheduleStats';
import ScheduleGrid from './components/Schedule/ScheduleGrid';
import CourseDialog from './components/Dialogs/CourseDialog';
import ShareDialog from './components/Dialogs/ShareDialog';
import ConflictDialog from './components/Dialogs/ConflictDialog';
import ConfirmDialog from './components/Dialogs/ConfirmDialog';

export default function App() {
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));

  // --- Schedule Custom Hook ---
  const {
    courses,
    stats,
    addCourse,
    updateCourse,
    deleteCourse,
    clearSchedule,
    checkCourseConflict,
  } = useSchedule();

  // --- Dialog States ---
  const [openForm, setOpenForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [openShare, setOpenShare] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [openConfirmReset, setOpenConfirmReset] = useState(false);
  const [conflictDialog, setConflictDialog] = useState({ open: false, message: '' });

  // --- Feedback Toast Notification ---
  const [toast, setToast] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  const showToast = useCallback((message, severity = 'info') => {
    if (!message) return;
    setToast({ open: true, message, severity });
  }, []);

  const handleCloseToast = useCallback(() => {
    setToast(prev => ({ ...prev, open: false }));
  }, []);

  // --- Drag & Drop Hook ---
  const { dragState, handleDragStart } = useScheduleDrag({
    updateCourse,
    checkConflict: checkCourseConflict,
    onAlert: ({ message, severity }) => showToast(message, severity),
  });

  // --- SEO & Page Meta Setup ---
  useEffect(() => {
    document.title = 'PlanJung (แพลนจัง) - เว็บจัดตารางเรียนสไตล์ Minimal';

    const metaTags = [
      {
        name: 'description',
        content: 'PlanJung (แพลนจัง) เว็บไซต์จัดตารางเรียนออนไลน์ฟรี สไตล์ Coinbase Minimalist สะอาดตา ใช้งานง่าย รองรับการลากวาง (Drag & Drop) และแชร์ตารางให้เพื่อนได้ทันที',
      },
      {
        name: 'keywords',
        content: 'PlanJung, แพลนจัง, จัดตารางเรียน, ตารางสอน, Schedule Planner, มหาวิทยาลัย, ลงทะเบียนเรียน, Coinbase Design',
      },
      { property: 'og:title', content: 'PlanJung (แพลนจัง) - จัดตารางเรียนออนไลน์ฟรี' },
      { property: 'og:description', content: 'วางแผนการเรียนอย่างมีระบบ สไตล์คลีน สะอาดตา ใช้งานง่าย ไม่ต้องติดตั้งโปรแกรม' },
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

  // --- Handlers ---
  const handleOpenAdd = () => {
    setEditingCourse(null);
    setOpenForm(true);
  };

  const handleOpenEdit = (course) => {
    if (!course) return;
    setEditingCourse(course);
    setOpenForm(true);
  };

  const handleSaveCourse = (formData) => {
    if (!formData) return;

    if (editingCourse && editingCourse.id) {
      const result = updateCourse(editingCourse.id, formData);
      if (!result.success) {
        if (result.conflict) {
          setConflictDialog({
            open: true,
            message: `เวลาเรียนซ้อนทับกับวิชา "${result.conflict.code} ${result.conflict.name}" ในวันเดียวกัน`,
          });
        } else {
          showToast(result.error || 'ไม่สามารถแก้ไขวิชาได้', 'error');
        }
        return;
      }
      showToast(`แก้ไขข้อมูลวิชา ${formData.code} เรียบร้อย`, 'success');
    } else {
      const result = addCourse(formData);
      if (!result.success) {
        if (result.conflict) {
          setConflictDialog({
            open: true,
            message: `เวลาเรียนซ้อนทับกับวิชา "${result.conflict.code} ${result.conflict.name}" ในวันเดียวกัน`,
          });
        } else {
          showToast(result.error || 'ไม่สามารถเพิ่มวิชาได้', 'error');
        }
        return;
      }
      showToast(`เพิ่มวิชา ${formData.code} ลงตารางเรียบร้อย`, 'success');
    }

    setOpenForm(false);
  };

  const handleDeleteCourse = (course) => {
    if (!course || !course.id) return;
    if (window.confirm(`ต้องการลบวิชา "${course.code} ${course.name}" หรือไม่?`)) {
      deleteCourse(course.id);
      showToast(`ลบวิชา ${course.code} เรียบร้อย`, 'info');
    }
  };

  const handleOpenShare = () => {
    try {
      const encoded = encodeScheduleForShare(courses);
      const url = encoded
        ? `${window.location.origin}${window.location.pathname}?schedule=${encoded}`
        : `${window.location.origin}${window.location.pathname}`;
      setShareUrl(url);
      setOpenShare(true);
    } catch (error) {
      console.error('Failed to generate share link:', error);
      showToast('ไม่สามารถสร้างลิงก์แชร์ได้ในขณะนี้', 'error');
    }
  };

  const handleConfirmReset = () => {
    clearSchedule();
    showToast('ล้างตารางเรียนทั้งหมดเรียบร้อยแล้ว', 'info');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box
        sx={{
          minHeight: '100vh',
          pb: { xs: 12, md: 8 },
          bgcolor: '#FAFAFB',
        }}
      >
        {/* Top Navbar */}
        <Navbar
          stats={stats}
          onOpenAdd={handleOpenAdd}
          onOpenShare={handleOpenShare}
          onOpenReset={() => setOpenConfirmReset(true)}
        />

        {/* Main Content */}
        <Container maxWidth="xl" sx={{ mt: { xs: 2.5, md: 4 } }}>
          {/* Institutional Metric Tiles */}
          <ScheduleStats stats={stats} />

          {/* Core Schedule Timetable */}
          <ScheduleGrid
            courses={courses}
            onEdit={handleOpenEdit}
            onDelete={handleDeleteCourse}
            onDragStart={handleDragStart}
            dragState={dragState}
          />
        </Container>

        {/* Floating Action Buttons for Mobile */}
        {isMobile && (
          <Box
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
              zIndex: 100,
            }}
          >
            <Tooltip title="แชร์ตาราง" placement="left">
              <Fab
                size="medium"
                onClick={handleOpenShare}
                sx={{
                  bgcolor: COINBASE_COLORS.canvas,
                  color: COINBASE_COLORS.ink,
                  border: `1px solid ${COINBASE_COLORS.hairline}`,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  '&:hover': { bgcolor: COINBASE_COLORS.surfaceSoft },
                }}
              >
                <ShareIcon fontSize="small" />
              </Fab>
            </Tooltip>

            <Tooltip title="เพิ่มวิชา" placement="left">
              <Fab
                color="primary"
                onClick={handleOpenAdd}
                sx={{
                  width: 56,
                  height: 56,
                  boxShadow: '0 8px 24px rgba(0, 82, 255, 0.35)',
                }}
              >
                <AddIcon />
              </Fab>
            </Tooltip>
          </Box>
        )}

        {/* Dialog: Add / Edit Course */}
        <CourseDialog
          key={openForm ? (editingCourse?.id || 'add') : 'closed'}
          open={openForm}
          handleClose={() => setOpenForm(false)}
          onSave={handleSaveCourse}
          editingId={editingCourse ? editingCourse.id : null}
          initialData={editingCourse}
          fullScreen={isMobile}
        />

        {/* Dialog: Share Schedule */}
        <ShareDialog
          open={openShare}
          onClose={() => setOpenShare(false)}
          shareUrl={shareUrl}
        />

        {/* Dialog: Conflict Warning */}
        <ConflictDialog
          open={conflictDialog.open}
          onClose={() => setConflictDialog({ open: false, message: '' })}
          conflictInfo={conflictDialog.message}
        />

        {/* Dialog: Reset Confirmation */}
        <ConfirmDialog
          open={openConfirmReset}
          onClose={() => setOpenConfirmReset(false)}
          onConfirm={handleConfirmReset}
          title="ล้างตารางเรียนทั้งหมด?"
          message="ข้อมูลวิชาทั้งหมดที่บันทึกไว้ในเบราว์เซอร์จะถูกลบออกถาวร คุณแน่ใจหรือไม่ที่จะล้างตาราง?"
          confirmText="ล้างข้อมูลทั้งหมด"
          confirmColor="error"
        />

        {/* Snackbar Toast */}
        <Snackbar
          open={toast.open}
          autoHideDuration={3500}
          onClose={handleCloseToast}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseToast}
            severity={toast.severity}
            variant="filled"
            sx={{
              borderRadius: '100px',
              px: 3,
              py: 1,
              fontWeight: 500,
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
              border: `1px solid rgba(255, 255, 255, 0.2)`,
            }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}