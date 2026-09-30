# 🎓 Student ERP System

> An enterprise-grade, full-stack Academic Management & Resource Planning platform engineered for modern educational institutions — featuring an AI copilot, dynamic QR attendance, campus events hub, universal global search, and a dedicated 12-screen mobile experience.

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React_19-61DAFB.svg?style=flat&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6.svg?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.13-3776AB.svg?style=flat&logo=python&logoColor=white)](https://www.python.org/)
[![Database](https://img.shields.io/badge/Database-PostgreSQL_%7C_MySQL-4169E1.svg?style=flat&logo=postgresql&logoColor=white)](https://supabase.com)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS_v4-06B6D4.svg?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/AI-Google_Gemini_Pro-8E75C2.svg?style=flat&logo=google&logoColor=white)](https://aistudio.google.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 1. Project Overview

**Student ERP** is an institution-wide academic resource planning system built to unify fragmented administrative workflows across universities, colleges, and schools. It connects students, faculty, department heads, and campus administrators into an integrated, real-time ecosystem.

The platform provides attendance tracking (via cryptographically signed dynamic QR codes or automated AI attendance), examination and grading ledgers, assignment lifecycle management, tuition fee billing, faculty substitution delegation, campus placement drives, campus events discovery, and institutional circulars.

Built with an asynchronous **FastAPI** backend and a reactive **React 19 + TypeScript** frontend, the system features a **Dual-Mode Responsive Architecture**: a powerful desktop command center for administrative workflows (`>= 1024px`) and an ergonomically optimized mobile app experience (`< 1024px`) across 12 dedicated student modules. It also embeds **Yuna AI**—a Google Gemini-powered conversational assistant that analyzes user context and renders interactive UI analytics widgets directly inside the chat.

---

## 2. Key Features & Modules

### 📱 Dedicated Student Mobile Experience (`< 1024px`)
Designed specifically for smartphones and tablets with touch-friendly touch targets, smooth slide transitions, and safe-area insets (`env(safe-area-inset-bottom)`):

1. **Academic Home & Hero Dashboard (`StudentHome.tsx`)**:
   * Gradient student enrollment hero banner with department and semester badges.
   * 2×2 quick metrics grid: Attendance %, Enrolled Subjects, Pending Tasks, and Current CGPA.
   * **Today's Schedule Card**: Shows current and upcoming classes with live `• Ongoing` pulsing badges and room numbers.
   * Quick-access action grid for instant one-tap navigation.

2. **Mobile Navigation Ecosystem (`MobileTopBar.tsx` & `MobileBottomNav.tsx`)**:
   * Sticky top bar with university branding, quick notification bell, and hamburger drawer trigger.
   * Slide-over navigation drawer displaying authenticated student profile details and 13 categorized operational modules.
   * Ergonomic fixed 4-tab bottom navigation (`Home`, `Timetable`, `Subjects`, `Notices`) with active indicator pills and iOS safe-area padding.

3. **Smart Attendance Ring (`MyAttendance.tsx`)**:
   * High-precision SVG circular attendance progress ring with percentage readout.
   * Mandatory 75% regulatory safety threshold indicators and present/absent analytics.
   * Subject-by-subject percentage breakdown cards with status chips.

4. **Subjects & Syllabus Explorer (`MySubjects.tsx`)**:
   * Semester selector chips (Sem 1 to Sem 8).
   * Detailed subject cards displaying course codes, credit weights, and assigned faculty instructors.
   * Syllabus modal view with lecture hours and curriculum breakdown.

5. **Interactive Schedule & Timetable (`MyTimetable.tsx`)**:
   * Mon–Fri day switcher pills with smooth day transitions.
   * Vertical schedule timeline highlighting ongoing lectures, upcoming classes, lab sessions, room numbers, and faculty details.

6. **Exams, Marks & CGPA Tracker (`MyResults.tsx`)**:
   * Cumulative CGPA performance card with trend arrows (`↑ 0.2` semester improvement).
   * Semester-by-semester SGPA progression charts.
   * Course-wise internal assessments and mid-term score breakdown (`28/30`).

7. **Assignments & Submission Hub (`MyAssignments.tsx`)**:
   * Status filter chips: `All`, `Ongoing`, `Submitted`, and `Overdue`.
   * Due date warnings, prompt attachments download, and mobile submission dialog for answers and notes.

8. **Grievance Redressal & Help Desk (`MyComplaints.tsx`)**:
   * Ticket creation form with categorized support types (`Academic`, `Hostel`, `Infrastructure`, `Examination`).
   * Real-time ticket status tracking (`Pending`, `In Progress`, `Resolved`) with reference tracking IDs.

9. **Campus Notices & Circulars (`MyNotices.tsx`)**:
   * Categorized notice pills (`All`, `Academic`, `Exam`, `Event`).
   * High-priority alert badges, relative post times, and full modal reader view.

10. **Digital Student ID Card (`MyIdCard.tsx`)**:
    * University-verified digital identity card with student photo, enrollment number, department, blood group, and academic year.
    * Dynamic SVG barcode and university security seal for library and campus verification.

11. **Fee Ledger & Payment Receipts (`MyFees.tsx`)**:
    * Tuition, exam, hostel, and laboratory fee breakdown.
    * Total paid vs. pending ledger card with instant simulated invoice/receipt PDF downloads.

12. **Student Profile (`MyProfile.tsx`)**:
    * Personal, contact, academic, and emergency details.
    * Direct quick-action shortcuts for ID card preview, password updates, and settings.

---

### 🔍 Universal Global Search Island (`GlobalSearchIsland.tsx`)
* Floating, keyboard-accessible (`Cmd + K` or `Ctrl + K`) global search island mounted across all application layouts (Student, Faculty, Admin, Placement).
* Instant fuzzy search across courses, subjects, assignments, events, administrative tools, and direct navigation links.
* Responsive design: transforms seamlessly from a desktop top bar island into a full mobile touch drawer.

---

### 🎪 Campus Events & Discovery Hub (`/dashboard/events`)
* **Live Campus Feed (`EventsList.tsx`)**: Real-time event cards with category filtering (`Tech`, `Cultural`, `Sports`, `Seminar`, `Workshop`).
* **Rich Event Details (`EventDetail.tsx`)**: Event banners, dates, venue coordinates, organizing committee details, eligibility guidelines, and external registration links.
* **Administrative Event Suite (`AdminEvents.tsx`, `EventForm.tsx`)**: University administrators can create, edit, publish, or archive campus-wide events with banner URLs and registration limits.

---

### 👩‍🏫 Faculty Command Center
* **Interactive Attendance Manager**:
  * Manual one-click attendance roll calls.
  * **Dynamic QR Code Attendance**: Generates cryptographically signed, short-lived (minute-level TTL) QR codes projected in classrooms.
  * **Automated AI Attendance**: Automated attendance verification pipelines.
* **Course & Student Hub**: View enrolled student cohorts by semester, section, and elective group.
* **Assignment Lifecycle Manager**: Publish assignments with deadline configurations, file attachments, and qualitative student submission grading.
* **Examination & Marks Ledger**: Internal, mid-semester, and final exam mark entry with bulk validation.
* **Faculty Substitution Dispatcher**: Assign and delegate lecture duties to available peer faculty members during leaves.

---

### 🏛️ Administrative & Institutional Governance Portal
* **Institutional Structure Management**: Manage departments, degree programs, subjects, semesters, sections, and classroom allocations.
* **Role-Based User Provisioning (RBAC)**: Secure account provisioning and credential management for Administrators, Faculty, and Students.
* **Fee Structure & Billing Engine (`FeeDashboard.tsx`, `FeeReports.tsx`)**: Configure fee heads, generate cohort-wide invoice batches, track payment collection metrics, and export audit reports.
* **Campus Broadcast Center (`NotifyFaculty.tsx`, `NotifyStudent.tsx`)**: Push targeted or institution-wide circulars and urgent alerts.
* **Campus Placement Management (`/placement-admin`)**: Post recruiting partner profiles, set minimum CGPA/backlog criteria, track student applications, and announce shortlist results.

---

### 🤖 Yuna AI Academic Copilot
* **Context-Aware Assistance**: Grounded LLM powered by Google Gemini that analyzes student context (schedule, grades, fees, attendance).
* **Dynamic Structured UI Widgets**: The model outputs structured JSON widget specifications (` ```widget `) parsed by the frontend to render interactive React components inside the conversation stream (attendance donuts, timetable cards, fee breakdowns).

---

## 3. Technology Stack

### Frontend Architecture
| Technology | Version | Purpose & Description |
| :--- | :--- | :--- |
| **React** | `19.x` | Modern declarative UI component architecture |
| **TypeScript** | `5.x` | Strict type safety, shared domain interfaces, and compile-time validation |
| **Vite** | `8.x` | High-performance build tool with instant Hot Module Replacement (HMR) |
| **Tailwind CSS** | `4.x` | Modern styling and design token engine |
| **Zustand** | `5.x` | Global lightweight reactive state management (auth, session, UI state) |
| **React Router** | `7.x` | Client-side routing, protected role-based guards, and layout wrappers |
| **Lucide React** | Latest | High-fidelity icon library for educational and navigation interfaces |
| **Framer Motion** | `12.x` | Dynamic page transitions, drawer slides, and micro-interactions |
| **Html5-Qrcode & React-QR**| `2.x` | Real-time in-browser camera scanning and dynamic QR code generation |
| **Recharts** | `3.x` | Academic analytics charts (attendance distributions, GPA trajectories) |
| **React Hook Form + Zod**| `7.x / 4.x` | High-performance form state management with strict schema validation |

### Backend Architecture
| Technology | Version | Purpose & Description |
| :--- | :--- | :--- |
| **FastAPI** | `>= 0.110` | High-throughput asynchronous RESTful API framework with OpenAPI documentation |
| **Python** | `3.13` | Asynchronous Python runtime |
| **SQLAlchemy** | `2.0.x` | Asynchronous ORM utilizing `asyncpg` (PostgreSQL) or `aiomysql` (MySQL) |
| **Alembic** | `1.13.x` | Declarative database migration versioning and schema migrations |
| **Pydantic** | `2.6.x` | Request payload validation, schema definitions, and response serialization |
| **PyJWT & Passlib** | `2.8.x / 1.7.x` | Stateless JWT token issuance (access/refresh rotation) and bcrypt hashing |
| **Google GenAI SDK** | `>= 0.2.0` | Google Gemini API integration for Yuna AI Copilot |
| **Uvicorn** | `>= 0.28` | High-concurrency ASGI web application server |

### Database Dialect Adapter
* **PostgreSQL (Supabase)**: Recommended production configuration with connection pooling (`asyncpg`).
* **MySQL 8.0+ / MariaDB**: Fully supported alternative running over `aiomysql`.
* **Automatic Dialect Adapter (`app/core/config.py`)**: Automatically detects database URI scheme (`postgres://`, `postgresql://`, or `mysql://`) and attaches the corresponding async driver (`postgresql+asyncpg://` or `mysql+aiomysql://`).

---

## 4. System Architecture

```mermaid
flowchart TB
    subgraph Client ["Client Layer (React 19 + TypeScript)"]
        direction TB
        DesktopUI["Desktop Command Center (>= 1024px)"]
        MobileUI["Mobile Experience (< 1024px - 12 Dedicated Screens)"]
        SearchIsland["Global Search Island (Cmd+K)"]
        Scanner["Html5-Qrcode Camera Scanner"]
        ChatbotUI["Yuna AI Copilot + Dynamic Widget Stream"]
        Store["Zustand Auth & Session State"]
    end

    subgraph Gateway ["Security & API Gateway (FastAPI)"]
        CORS["CORS Middleware"]
        AuthGuard["OAuth2 Bearer & JWT Token Verification"]
        RBAC["Role-Based Access Controller (Admin, Faculty, Student, Placement)"]
    end

    subgraph Services ["Core Domain Services"]
        AuthService["Auth & Session Manager"]
        StudentDash["Student Aggregator Service"]
        FacultyDash["Faculty Ledger & Substitution Service"]
        QRAttendance["Dynamic QR Attendance Engine (HMAC / TTL)"]
        AIAttendance["AI Attendance Processing Service"]
        EventsService["Campus Events Management"]
        FeeService["Billing & Invoicing Engine"]
        PlacementService["Placement & Drive Pipeline"]
        AIService["Yuna AI Contextual Engine (Gemini)"]
    end

    subgraph Persistence ["Persistence & External Services"]
        SQLA["SQLAlchemy 2.0 Async Session"]
        DB[(Supabase PostgreSQL / Cloud or Local MySQL)]
        GeminiAPI["Google Gemini LLM (gemini-3.5-flash)"]
        Alembic["Alembic Schema Migrations"]
    end

    Client -->|HTTPS REST API / JSON| Gateway
    Gateway --> Services
    Services --> SQLA
    SQLA --> DB
    AIService -->|Async API Calls| GeminiAPI
```

---

## 5. Directory Structure

```
StudentERP/
├── backend/                             # FastAPI Asynchronous Backend
│   ├── alembic/                         # Database migration versions
│   ├── app/
│   │   ├── api/v1/                      # Version 1 REST API routers
│   │   │   ├── auth.py                  # Authentication & token rotation
│   │   │   ├── student_dashboard.py     # Student dashboard aggregation
│   │   │   ├── faculty_dashboard.py     # Faculty ledger & course metrics
│   │   │   ├── qr_attendance.py         # Dynamic QR token generation & scan
│   │   │   ├── ai_attendance.py         # AI attendance processing
│   │   │   ├── events.py                # Campus events & registrations
│   │   │   ├── complaints.py            # Student grievance redressal
│   │   │   ├── notifications.py         # Notification broadcaster
│   │   │   ├── assignments.py           # Assignment creation & submission
│   │   │   ├── fees.py                  # Fee billing, invoices & ledger
│   │   │   ├── placements.py            # Recruitment drives & applications
│   │   │   ├── substitutes.py           # Faculty substitution workflow
│   │   │   ├── timetable.py             # Lecture schedules
│   │   │   ├── subjects.py              # Subject & syllabus management
│   │   │   ├── departments.py           # Institutional departments
│   │   │   └── chatbot.py               # Yuna AI prompt orchestration
│   │   ├── core/                        # Configuration, security, constants
│   │   ├── database/                    # Async DB engine & base models
│   │   ├── models/                      # SQLAlchemy ORM models
│   │   ├── schemas/                     # Pydantic validation schemas
│   │   └── services/                    # Business logic & AI pipelines
│   ├── tests/                           # Pytest test suite
│   ├── requirements.txt                 # Backend dependencies
│   ├── alembic.ini                      # Migration settings
│   └── seed.py                          # Database seed script
│
├── frontend/                            # React 19 + TypeScript SPA
│   ├── src/
│   │   ├── api/                         # Axios client & API endpoints
│   │   ├── components/                  # Reusable UI components
│   │   │   ├── mobile/                  # Mobile-dedicated components
│   │   │   │   ├── MobileTopBar.tsx     # Header bar with drawer trigger
│   │   │   │   └── MobileBottomNav.tsx  # Fixed 4-tab bottom navigation
│   │   │   ├── GlobalSearchIsland.tsx   # Universal Cmd+K search island
│   │   │   ├── ErrorBoundary.tsx        # React runtime error boundary
│   │   │   ├── ChatWidget.tsx           # Yuna AI floating copilot
│   │   │   └── Navbar.tsx               # Desktop navigation bar
│   │   ├── hooks/                       # Custom hooks (useIsMobile, useAuth)
│   │   ├── pages/                       # Application page views
│   │   │   ├── student/                 # 12-Screen Student Portal
│   │   │   │   ├── StudentHome.tsx      # Dashboard & Today's Schedule
│   │   │   │   ├── MyAttendance.tsx     # SVG Circular attendance tracker
│   │   │   │   ├── MySubjects.tsx       # Semester subject & syllabus view
│   │   │   │   ├── MyTimetable.tsx      # Interactive Mon-Fri timetable
│   │   │   │   ├── MyResults.tsx        # CGPA/SGPA & internal marks
│   │   │   │   ├── MyAssignments.tsx    # Assignment hub & submission
│   │   │   │   ├── MyComplaints.tsx     # Grievance redressal desk
│   │   │   │   ├── MyNotices.tsx        # Institutional circulars
│   │   │   │   ├── MyIdCard.tsx         # Digital verified ID card & barcode
│   │   │   │   ├── MyFees.tsx           # Fee ledger & receipt downloads
│   │   │   │   ├── MyProfile.tsx        # Student credentials & profile
│   │   │   │   └── PlacementCell.tsx    # Campus placement applications
│   │   │   ├── events/                  # Campus Events Hub
│   │   │   │   ├── EventsList.tsx       # Filterable event cards
│   │   │   │   └── EventDetail.tsx      # Event overview & registration
│   │   │   ├── faculty/                 # Faculty Portal (QR, marks, subs)
│   │   │   ├── admin/                   # Admin Portal (governance, fees)
│   │   │   ├── placement-admin/         # Placement Officer Portal
│   │   │   └── Login.tsx                # Multi-role authentication page
│   │   ├── store/                       # Zustand state stores
│   │   ├── types/                       # TypeScript interfaces
│   │   ├── App.tsx                      # Root router & layout guards
│   │   ├── index.css                    # Tailwind CSS v4 styling
│   │   └── main.tsx                     # React DOM entrypoint
│   ├── package.json                     # Frontend dependencies
│   └── vite.config.ts                   # Vite bundler configuration
│
└── README.md                            # Comprehensive project guide
```

---

## 6. Installation & Quickstart Guide

### Prerequisites
* **Node.js**: `v18.x` or `>= v20.x` ([Download Node.js](https://nodejs.org/))
* **Python**: `3.11+` (recommended: `Python 3.13`) ([Download Python](https://www.python.org/))
* **Database**: Free [Supabase](https://supabase.com) PostgreSQL project **OR** local MySQL / PostgreSQL server
* **Google Gemini API Key**: *(Optional, for Yuna AI)* Get from [Google AI Studio](https://aistudio.google.com/)

---

### Step 1: Clone Repository
```bash
git clone https://github.com/yashpatel609/StudentERP.git
cd StudentERP
```

---

### Step 2: Backend Setup

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment**:
   * **Windows (PowerShell)**:
     ```powershell
     python -m venv venv
     .\venv\Scripts\Activate.ps1
     ```
   * **macOS / Linux**:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure Environment Variables**:
   Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

   Configure `.env` with your database credentials:

   **Option A: Supabase PostgreSQL (Recommended)**
   ```ini
   DATABASE_URL=postgresql://postgres.[YOUR-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   DIRECT_URL=postgresql://postgres.[YOUR-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
   ```

   **Option B: Local / Cloud MySQL**
   ```ini
   DATABASE_URL=mysql://root:password@127.0.0.1:3306/student_erp
   DIRECT_URL=mysql://root:password@127.0.0.1:3306/student_erp
   ```

   **Core Security & AI Configuration**:
   ```ini
   PROJECT_NAME="Student ERP Backend"
   API_V1_STR="/api/v1"
   DEBUG=True

   SECRET_KEY=generate-a-secure-random-32-character-secret-key
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   REFRESH_TOKEN_EXPIRE_DAYS=7

   FIRST_SUPERUSER_EMAIL=admin@example.com
   FIRST_SUPERUSER_PASSWORD=admin

   GEMINI_API_KEY=your-gemini-api-key-here
   ```

5. **Run Database Schema Migrations**:
   ```bash
   alembic upgrade head
   ```

6. **Seed Initial Roles, Departments, and Admin Account**:
   ```bash
   python seed.py
   ```
   *(Creates default Admin account: `admin@example.com` / `admin`, alongside core academic departments).*

7. **Start the FastAPI Backend**:
   ```bash
   fastapi dev app/main.py
   # Or using uvicorn:
   uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
   ```
   * **API Root**: `http://127.0.0.1:8000`
   * **Interactive Swagger UI**: `http://127.0.0.1:8000/docs`
   * **ReDoc**: `http://127.0.0.1:8000/redoc`

---

### Step 3: Frontend Setup

1. **Open a new terminal and navigate to the frontend**:
   ```bash
   cd frontend
   ```

2. **Install Node dependencies**:
   ```bash
   npm install
   ```

3. **Verify API Configuration (`src/config.ts`)**:
   Ensure `API_BASE_URL` points to your backend instance:
   ```typescript
   export const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';
   ```

4. **Launch the Vite Development Server**:
   ```bash
   npm run dev
   ```
   * **Web App URL**: `http://localhost:5173`

---

## 7. Interactive Workflow Walkthrough

```
[Authentication Portal] ──> Select Role / Enter Credentials (Student / Faculty / Admin / Placement)
       │
       ├── 🧑‍🎓 Student:
       │     ├── Desktop / Mobile Dashboard ──> Today's Schedule (Live ongoing indicator)
       │     ├── Scan QR Attendance (In-browser camera) ──> Attendance Ring Analytics
       │     ├── Assignments Hub ──> View Prompt ──> Submit Solution
       │     ├── Academic Records ──> View Subjects, Syllabus, Timetable & CGPA
       │     ├── Campus Life ──> Browse Events, Institutional Notices & Digital ID Card
       │     └── Yuna AI ──> Ask questions & get interactive graphical UI widgets
       │
       ├── 👨‍🏫 Faculty:
       │     ├── Course Manager ──> Launch Dynamic QR Token on Classroom Projector
       │     ├── Manual & AI Attendance ──> Roll-call overrides & attendance reports
       │     ├── Assignment Lifecycle ──> Post assignments, evaluate submissions, give remarks
       │     ├── Internal Marks ──> Enter mid-term and semester scores
       │     └── Substitution ──> Delegate lectures to available peer instructors
       │
       ├── 🏛️ Institutional Admin:
       │     ├── Academic Governance ──> Departments, Courses, Subjects, Classrooms
       │     ├── Account Provisioning ──> Manage Faculty & Student accounts
       │     ├── Finance Engine ──> Fee billing batches, receipts & audit reports
       │     ├── Campus Broadcasts ──> Dispatch notices to students or faculty
       │     └── Events Moderation ──> Publish, edit, and manage campus events
       │
       └── 💼 Placement Officer:
             ├── Recruitment Drives ──> Create company postings & package (CTC) details
             ├── Eligibility Rules ──> Minimum CGPA & backlog screening
             └── Applicant Pipeline ──> Shortlist, schedule rounds, and record offers
```

---

## 8. API Endpoint Summary

FastAPI automatically serves interactive, runnable documentation at `http://127.0.0.1:8000/docs`. Major endpoint groups include:

| Tag | Route Prefix | Key Endpoints | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | `/api/v1/auth` | `POST /login`, `POST /register`, `POST /refresh` | JWT credential issuance, refresh token rotation |
| **Student** | `/api/v1/student-dash` | `GET /overview`, `GET /attendance`, `GET /fees` | High-level metrics, attendance logs, and fee ledger |
| **Faculty** | `/api/v1/faculty-dash` | `GET /overview`, `GET /classes`, `POST /marks` | Teaching schedule, marks entry, and student roll calls |
| **QR Attendance** | `/api/v1/qr` | `POST /generate`, `POST /scan` | Dynamic time-expiring HMAC token generation and validation |
| **AI Attendance** | `/api/v1/attendance/ai` | `POST /session`, `POST /verify` | Automated facial/device attendance workflows |
| **Events** | `/api/v1/events` | `GET /`, `GET /{id}`, `POST /`, `DELETE /{id}` | Campus events, venue coordination, and registrations |
| **Complaints** | `/api/v1/complaints` | `GET /`, `POST /`, `PATCH /{id}/status` | Student grievances, category filing, and status updates |
| **Assignments** | `/api/v1/assignments`| `GET /`, `POST /`, `POST /{id}/submit`, `POST /{id}/grade` | Assignment lifecycle and file submissions |
| **Fees** | `/api/v1/fees` | `GET /structures`, `POST /invoice`, `POST /pay` | Fee schedules, student invoices, and ledger receipts |
| **Placements** | `/api/v1/placements` | `GET /drives`, `POST /drives`, `POST /apply` | Job listings, eligibility matching, and applications |
| **Substitutes** | `/api/v1/substitutes` | `GET /available`, `POST /request`, `POST /respond`| Faculty lecture substitution delegation workflow |
| **Notifications**| `/api/v1/notifications`| `GET /`, `POST /broadcast`, `PATCH /{id}/read`| Push alerts, circular distribution, read receipts |
| **Yuna AI** | `/api/v1/chatbot` | `POST /chat` | Contextual Gemini academic queries & widget responses |

---

## 9. Engineering Design Decisions

1. **Dual-Mode Layout Architecture with Zero Regression**:
   * *Implementation*: Viewports are dynamically classified via `useIsMobile.ts`, listening to both `resize` events and `window.matchMedia('(max-width: 1023px)')`.
   * *Benefit*: Guarantees that mobile touch navigation (BottomNav, TopBar, slide drawer) displays exclusively below `1024px`, leaving the full desktop dashboard (`>= 1024px`) 100% intact with zero visual regressions.

2. **React Error Boundaries**:
   * *Implementation*: Root level `ErrorBoundary.tsx` wraps all router views with clear error diagnostics and recovery buttons.
   * *Benefit*: Prevents unexpected runtime exceptions from rendering blank white screens across the application.

3. **Dynamic Time-Expiring QR Code HMAC Tokens**:
   * *Implementation*: Faculty attendance sessions generate cryptographically signed tokens refreshed every 60 seconds with strict time-to-live validation.
   * *Benefit*: Eliminates remote attendance fraud (e.g. students screenshotting QR codes and forwarding them to absent classmates).

4. **Dual Database Dialect Support**:
   * *Implementation*: Pydantic validator dynamically routes connection strings to `asyncpg` (PostgreSQL/Supabase) or `aiomysql` (MySQL).
   * *Benefit*: Complete flexibility to run in cloud serverless environments or on-premise institutional SQL servers without code changes.

5. **Zustand Over Redux Toolkit**:
   * *Implementation*: Modular Zustand stores for authentication and session persistence.
   * *Benefit*: Drastically reduces boilerplate while preserving synchronous state access and minimal bundle overhead.

---

## 10. Verification & Quality Assurance

### Backend Testing Suite
```bash
cd backend
source venv/bin/activate    # Or .\venv\Scripts\Activate.ps1 on Windows
pytest -v -s
```

### Frontend Typecheck & Build
```bash
cd frontend
# Run strict TypeScript validation
npx tsc -b

# Validate production bundle compilation
npm run build
```

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for complete details.

---

## 👥 Contributors & Contact

