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
} from '@mui/icons-material';

import { theme } from './theme/theme';
import { COINBASE_COLORS } from './constants/coinbaseTokens';
import { DAYS, DAY_INDEX_MAP } from './constants/colors';
import { useSchedule } from './hooks/useSchedule';
import { useScheduleDrag } from './hooks/useScheduleDrag';
import { encodeScheduleForShare } from './utils/scheduleStorage';

import Navbar from './components/Navbar/Navbar';
import ScheduleStats from './components/Schedule/ScheduleStats';
import CourseLibraryBar from './components/Schedule/CourseLibraryBar';
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
    loadSampleSchedule,
    checkCourseConflict,
  } = useSchedule();

  // --- Dialog States ---
  const [openForm, setOpenForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [duplicateInitialData, setDuplicateInitialData] = useState(null);
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
    setDuplicateInitialData(null);
    setOpenForm(true);
  };

  const handleOpenEdit = (course) => {
    if (!course) return;
    setEditingCourse(course);
    setDuplicateInitialData(null);
    setOpenForm(true);
  };

  const handleDuplicateCourse = (course) => {
    if (!course) return;
    // Suggest the next available or logical day
    const currentDayIdx = DAY_INDEX_MAP[course.day] ?? 0;
    const nextDayIdx = (currentDayIdx + 2) % DAYS.length; // e.g., Mon -> Wed
    const suggestedDay = DAYS[nextDayIdx] || 'Wednesday';

    setEditingCourse(null);
    setDuplicateInitialData({
      code: course.code,
      name: course.name,
      room: course.room || '',
      colorIndex: typeof course.colorIndex === 'number' ? course.colorIndex : 0,
      day: suggestedDay,
      startTime: course.startTime || '09:00',
      endTime: course.endTime || '12:00',
    });
    setOpenForm(true);
    showToast(`คัดลอกข้อมูลวิชา ${course.code} แล้ว เลือกวันและเวลาเพื่อบันทึก`, 'info');
  };

  const handleSaveCourse = (formData, { addAnother = false } = {}) => {
    if (!formData) return false;

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
        return false;
      }
      showToast(`แก้ไขข้อมูลวิชา ${formData.code} เรียบร้อย`, 'success');
      setOpenForm(false);
      return true;
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
        return false;
      }

      if (addAnother) {
        showToast(`บันทึกวิชา ${formData.code} แล้ว สามารถเลือกวันและเวลาเพื่อเพิ่มคาบถัดไปได้ทันที`, 'success');
      } else {
        showToast(`เพิ่มวิชา ${formData.code} ลงตารางเรียบร้อย`, 'success');
        setOpenForm(false);
      }
      return true;
    }
  };

  const handleDeleteCourse = (course) => {
    if (!course || !course.id) return;
    if (window.confirm(`ต้องการลบวิชา "${course.code} ${course.name}" (${course.day} ${course.startTime}-${course.endTime}) หรือไม่?`)) {
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

  const handleLoadSample = () => {
    loadSampleSchedule();
    showToast('โหลดตัวอย่างตารางเรียนสำเร็จ พร้อมใช้งานแล้ว', 'success');
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
          onLoadSample={handleLoadSample}
        />

        {/* Main Content */}
        <Container maxWidth="xl" sx={{ mt: { xs: 2.5, md: 3.5 } }}>
          {/* Institutional Metric Tiles */}
          <ScheduleStats stats={stats} />

          {/* Course Library Bar (Quick subject groups & duplicate session) */}
          <CourseLibraryBar
            courses={courses}
            onOpenAdd={handleOpenAdd}
            onDuplicate={handleDuplicateCourse}
            onLoadSample={handleLoadSample}
          />

          {/* Core Schedule Timetable Grid */}
          <ScheduleGrid
            courses={courses}
            onEdit={handleOpenEdit}
            onDuplicate={handleDuplicateCourse}
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
                <ShareIcon sx={{ fontSize: 20 }} />
              </Fab>
            </Tooltip>

            <Tooltip title="เพิ่มวิชาเรียนใหม่" placement="left">
              <Fab
                color="primary"
                onClick={handleOpenAdd}
                sx={{
                  bgcolor: COINBASE_COLORS.primary,
                  boxShadow: '0 6px 16px rgba(0, 82, 255, 0.35)',
                  '&:hover': { bgcolor: COINBASE_COLORS.primaryActive },
                }}
              >
                <AddIcon sx={{ fontSize: 24 }} />
              </Fab>
            </Tooltip>
          </Box>
        )}

        {/* Dialogs */}
        <CourseDialog
          key={openForm ? `dialog_${editingCourse?.id || duplicateInitialData?.code || 'new'}` : 'closed'}
          open={openForm}
          handleClose={() => setOpenForm(false)}
          onSave={handleSaveCourse}
          editingId={editingCourse?.id || null}
          initialData={editingCourse || duplicateInitialData || null}
          fullScreen={isMobile}
          existingCourses={courses}
        />

        <ShareDialog
          open={openShare}
          onClose={() => setOpenShare(false)}
          shareUrl={shareUrl}
        />

        <ConflictDialog
          open={conflictDialog.open}
          onClose={() => setConflictDialog({ open: false, message: '' })}
          message={conflictDialog.message}
        />

        <ConfirmDialog
          open={openConfirmReset}
          onClose={() => setOpenConfirmReset(false)}
          onConfirm={handleConfirmReset}
          title="ต้องการล้างตารางเรียนทั้งหมดหรือไม่?"
          message="ข้อมูลวิชาเรียนทั้งหมดในตารางของคุณจะถูกลบออกจากเครื่องทันที และไม่สามารถย้อนกลับได้"
          confirmText="ล้างตารางทั้งหมด"
          confirmColor="error"
        />

        {/* Toast Notification */}
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
              borderRadius: '12px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
              fontWeight: 600,
              fontSize: '0.88rem',
            }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}
