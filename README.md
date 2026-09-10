# 📅 PlanJung (แพลนจัง) - Class Schedule Planner

<p align="center">
  <img src="public/icon.png" alt="PlanJung Logo" width="100" />
</p>

<p align="center">
  <strong>เว็บแอปพลิเคชันจัดตารางเรียนและวางแผนลงทะเบียนเรียนออนไลน์</strong><br>
  ออกแบบใหม่ด้วย <strong>Coinbase Design System</strong> สะอาดตา เรียบหรู ใช้งานง่าย พร้อมระบบตรวจสอบเวลาเรียนชนกันและแชร์ตารางเรียนให้เพื่อน
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-7.2-646CFF?style=flat-square&logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/MUI-7.3-007FFF?style=flat-square&logo=mui" alt="MUI" />
  <img src="https://img.shields.io/badge/Design_System-Coinbase-0052FF?style=flat-square" alt="Coinbase Design" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License" />
</p>

---

## ✨ ฟีเจอร์หลัก (Key Features)

- **🎨 Re-designed with Coinbase Design System (`DESIGN.md`)**:
  - ใช้โทนสีหลัก **Coinbase Blue (`#0052ff`)** สำหรับ Call-to-Action และจุดเน้นสำคัญ
  - พื้นหลังแบบ Pure White Canvas (`#ffffff`) พร้อมเส้นแบ่ง Hairline (`#dee1e6`) สไตล์ Quiet Financial Institutional
  - รูปทรงปุ่มแบบ **Pill Geometry (`100px`)**, การ์ดขอบมน **`24px`**, และกล่องกรอกข้อมูล **`12px`**
  - ตัวเลขเวลาและข้อมูลสถิติแสดงผลด้วย Monospace font เพื่อความเป็นระเบียบและอ่านง่าย
- **📊 Schedule Statistics Overview**: การ์ดแดชบอร์ดสรุปสถิติตารางเรียนอัตโนมัติ (จำนวนวิชาที่ลงทะเบียน, ชั่วโมงเรียนรวมต่อสัปดาห์, วันที่มีเรียน, ช่วงเวลาเรียนประจำวัน)
- **🖱️ Smooth Drag & Drop**: สามารถคลิกลากบล็อกวิชาเพื่อเปลี่ยนวันเรียนหรือเลื่อนเวลาเรียนได้ทันที (สแนปทีละ 30 นาที)
- **⚠️ Smart Conflict Detection**: ระบบป้องกันและแจ้งเตือนเวลาเรียนชนกันอย่างแม่นยำ ไม่ให้วิชาซ้อนทับกัน
- **🔗 Instant Schedule Sharing**: แชร์ตารางเรียนให้เพื่อนได้ง่ายๆ ด้วยการสร้าง URL ที่เข้ารหัสข้อมูลวิชาแบบ Unicode-safe Base64 (รองรับภาษาไทย)
- **💾 LocalStorage Auto-Sync**: บันทึกข้อมูลวิชาลงในเบราว์เซอร์อัตโนมัติ เปิดกลับมาเมื่อไหร่ข้อมูลก็ยังอยู่ครบ
- **📱 Fully Responsive**: ออกแบบรองรับการใช้งานทุกขนาดหน้าจอ ทั้ง Desktop, Tablet, และ Mobile

---

## 🛠️ โครงสร้างโฟลเดอร์ (Architecture & Folder Structure)

โครงการนี้ถูกจัดระเบียบใหม่ตามหลักการ React Best Practices และแยกความรับผิดชอบของแต่ละส่วนอย่างชัดเจน:

```text
planJung/
├── public/
│   └── icon.png                  # ไอคอนแอปพลิเคชัน
├── src/
│   ├── assets/                   # ไฟล์ Asset อื่นๆ
│   ├── constants/
│   │   ├── coinbaseTokens.js     # Design Tokens จาก Coinbase (สี, รัศมีมน, ฟอนต์)
│   │   └── colors.js             # การตั้งค่ากริดเวลา, วัน, และชุดสีการ์ดวิชา
│   ├── utils/
│   │   ├── timeUtils.js          # ฟังก์ชันจัดการเวลาและการคำนวณระยะเวลา (พร้อม Check Null/Type)
│   │   ├── conflictUtils.js      # ฟังก์ชันตรวจสอบและแจ้งเตือนตารางเรียนชนกัน
│   │   └── scheduleStorage.js    # ฟังก์ชัน LocalStorage และการ Encode/Decode ข้อมูลแชร์
│   ├── hooks/
│   │   ├── useSchedule.js        # Custom Hook จัดการ State ของวิชา สถิติ และการเพิ่ม/ลบ/แก้ไข
│   │   └── useScheduleDrag.js    # Custom Hook ควบคุมระบบลากวาง (Drag & Drop) และ Snap เวลา
│   ├── theme/
│   │   └── theme.js              # ธีม Material-UI ที่ผสานกับ Coinbase Design System
│   ├── components/
│   │   ├── Navbar/
│   │   │   └── Navbar.jsx        # แถบเมนูด้านบน สไตล์ Coinbase พร้อมปุ่ม Action แบบ Pill
│   │   ├── Schedule/
│   │   │   ├── ScheduleStats.jsx # การ์ดสถิติภาพรวมตารางเรียน
│   │   │   ├── ScheduleGrid.jsx  # กริดตารางเรียนหลักพร้อมระบบเลื่อนและเส้นแสดงเวลาปัจจุบัน
│   │   │   ├── TimeHeader.jsx    # แถบหัวเวลาแบบ Monospace
│   │   │   ├── DayRow.jsx        # แถวแสดงรายวันพร้อมจุดสีระบุวัน
│   │   │   └── CourseCard.jsx    # การ์ดแสดงวิชาเรียนพร้อมปุ่มแก้ไข/ลบ และ Room Pill
│   │   └── Dialogs/
│   │       ├── CourseDialog.jsx  # ป๊อปอัปฟอร์มเพิ่ม/แก้ไขวิชาเรียนพร้อมการตรวจสอบความถูกต้อง
│   │       ├── ShareDialog.jsx   # ป๊อปอัปสำหรับคัดลอกลิงก์แชร์ตารางเรียน
│   │       ├── ConflictDialog.jsx# ป๊อปอัปแจ้งเตือนเวลาเรียนซ้อนทับ
│   │       └── ConfirmDialog.jsx # ป๊อปอัปยืนยันการลบหรือล้างข้อมูล
│   ├── App.jsx                   # Root Component ขนาดกะทัดรัด ทำหน้าที่เชื่อม Hook กับ UI
│   ├── App.css                   # สไตล์ Utility เพิ่มเติม
│   ├── index.css                 # สไตล์พื้นฐาน ฟอนต์ Inter/Kanit และ Custom Scrollbar
│   └── main.jsx                  # จุดเริ่มต้น React DOM Render
├── DESIGN.md                     # เอกสาร Coinbase Design System Spec จาก npx getdesign
├── package.json
└── vite.config.js
```

---

## 🧩 การใช้งาน Custom Hooks & Helper Functions

### 1. `useSchedule()`
Hook จัดการตารางเรียนหลัก ออกแบบให้เรียกใช้ง่ายและปลอดภัยต่อ Error/Null:
```javascript
import { useSchedule } from './hooks/useSchedule';

const {
  courses,              // รายการวิชาทั้งหมด (Array)
  stats,                // ข้อมูลสถิติ { totalCourses, totalHoursFormatted, activeDaysCount, ... }
  addCourse,            // (courseData) => { success: boolean, error?: string, conflict?: object }
  updateCourse,         // (id, courseData) => { success: boolean, error?: string }
  deleteCourse,         // (id) => { success: boolean }
  clearSchedule,        // () => { success: boolean }
  checkCourseConflict,  // (courseData, excludeId) => conflictingCourse | null
} = useSchedule();
```

### 2. `useScheduleDrag({ updateCourse, checkConflict, onAlert })`
Hook จัดการการคลิกลากการ์ดวิชาบนกริด พร้อมคำนวณการเลื่อนเวลาและเปลี่ยนวันอัตโนมัติ:
```javascript
const { dragState, handleDragStart } = useScheduleDrag({
  updateCourse,
  checkConflict: checkCourseConflict,
  onAlert: ({ message, severity }) => showToast(message, severity),
});
```

### 3. ตรวจสอบ Error และ Null (Null & Error Safety)
ฟังก์ชันทั้งหมดใน `src/utils/` และ `src/hooks/` ถูกออกแบบให้มี:
- การตรวจเช็ค `null`, `undefined`, ค่าว่าง, และประเภทข้อมูล (Type checking) ก่อนประมวลผลทุกครั้ง
- ระบบดักจับข้อผิดพลาด `try/catch` ในการอ่านเขียน LocalStorage และการถอดรหัส URL เพื่อไม่ให้แอปพลิเคชันหยุดทำงานเมื่อพบข้อมูลผิดพลาด
- การ Validate ข้อมูลเวลา เช่น เวลาเริ่มต้องมาก่อนเวลาสิ้นสุดเสมอ

---

## 🚀 การติดตั้งและเปิดใช้งานในเครื่อง (Getting Started)

### ความต้องการของระบบ (Prerequisites)
- [Node.js](https://nodejs.org/) (เวอร์ชัน 18 ขึ้นไป)
- [npm](https://www.npmjs.com/)

### ขั้นตอนการติดตั้ง

1. **Clone repository:**
   ```bash
   git clone https://github.com/Anuphap2/planJung.git
   cd planJung
   ```

2. **ติดตั้ง Dependencies:**
   ```bash
   npm install
   ```

3. **เปิด Dev Server:**
   ```bash
   npm run dev
   ```
   เปิดเบราว์เซอร์ไปที่ `http://localhost:5173/`

4. **ตรวจสอบโค้ด (Lint) และสร้าง Production Build:**
   ```bash
   # ตรวจสอบ Lint
   npm run lint

   # สร้าง Build สำหรับขึ้น Production
   npm run build
   ```

---

## 🎨 การปรับใช้ Design Token จาก Coinbase

หากต้องการปรับแต่งหรือศึกษาแนวทางการออกแบบ สามารถดูรายละเอียดข้อกำหนดเต็มได้ที่ [`DESIGN.md`](./DESIGN.md) ซึ่งดาวน์โหลดผ่านคำสั่ง:
```bash
npx getdesign@latest add coinbase
```
และถูกนำไปแปลงเป็น JavaScript Tokens ที่ [`src/constants/coinbaseTokens.js`](./src/constants/coinbaseTokens.js) เพื่อนำไปใช้งานกับ Material-UI อย่างกลมกลืน

---

## 📄 ใบอนุญาต (License)

โปรเจกต์นี้เผยแพร่ภายใต้สัญญาอนุญาต [MIT License](LICENSE)
