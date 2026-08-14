# 🎓 Student ERP System

> An enterprise-grade, full-stack Academic Management & Resource Planning platform engineered for modern educational institutions.

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React_19-61DAFB.svg?style=flat&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6.svg?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.13-3776AB.svg?style=flat&logo=python&logoColor=white)](https://www.python.org/)
[![Database](https://img.shields.io/badge/Database-PostgreSQL_%7C_MySQL-4169E1.svg?style=flat&logo=postgresql&logoColor=white)](https://supabase.com)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS_v4-06B6D4.svg?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 1. Project Overview

Student ERP is a full-stack enterprise resource planning platform engineered to streamline and automate fragmented academic administrative operations across higher education institutions. It unifies student records, dynamic QR attendance tracking, marks and examination evaluations, fee ledger management, faculty substitution delegation, and campus placement drives into a single role-based application.

Powered by an asynchronous **FastAPI** backend and a reactive **React 19 + TypeScript** client, the platform also embeds **Yuna AI**—a Google Gemini-backed conversational copilot capable of interpreting student queries and rendering interactive graphical analytics widgets.

---

## 2. Features

### 👨‍🎓 Student Portal
* **Academic Dashboard**: Real-time summary of attendance percentages, registered subjects, pending assignments, upcoming campus events, and CGPA trends.
* **Smart Attendance Tracker**: Subject-wise attendance analytics with visual safety thresholds (<75% low attendance alerts) and history logs.
* **Dynamic QR Scanner**: In-browser camera scanning to instantly mark lecture attendance with cryptographically signed, short-lived tokens.
* **Assignment Hub**: Browse active assignments, download prompt attachments, submit solutions, and review grades with faculty feedback.
* **Fee Management**: Detailed breakdown of tuition, lab, library, and examination fees, payment receipt generation, and transaction status logs.
* **Digital ID Card**: Dynamically generated institutional ID card complete with student details, barcode, and downloadable canvas badge.
* **Exam Results & Reports**: Semester-wise marks ledger, grade card generation, and GPA performance trajectory charts.
* **Placement Cell**: Browse eligible on-campus recruitment drives, submit job applications, track interview stages, and manage offer letters.
* **Grievance Redressal**: File complaints across academic, administrative, or hostel categories with status tracking.

### 👩‍🏫 Faculty Portal
* **Course & Subject Hub**: Manage enrolled students across semesters, sections, and departments.
* **Interactive Attendance Manager**: Manual one-click roll-call marking and dynamic live QR code generation for automated classroom check-ins.
* **Assignment Lifecycle Manager**: Create assignments with deadlines and attachments, track student submissions, and grade submissions with qualitative remarks.
* **Marks & Evaluation Ledger**: Internal, mid-semester, and end-semester grading system with bulk data entry capabilities.
* **Faculty Substitution Dispatcher**: Request and assign lecture substitution to peer faculty members when on leave.
* **Attendance Reports**: Exportable attendance audit reports by date range and subject.

### 🏛️ Administrative & Placement Cell Portal
* **Institutional Governance**: Manage departments, courses, subjects, semesters, and timetable scheduling.
* **Role-Based Access Control (RBAC)**: Secure user onboarding and credential provisioning for Admins, Faculty, Placement Officers, and Students.
* **Fee Structure & Billing Engine**: Configure fee heads, generate invoices for student cohorts, and reconcile payment records.
* **Campus Placement Management**: Post company profiles, configure minimum CGPA/backlog eligibility criteria, shortlist candidates, and publish results.
* **Campus Notices & Announcements**: Target institutional circulars by role, department, or campus-wide audience.

### 🤖 Yuna AI Academic Assistant
* **Context-Aware Assistance**: Grounded conversational AI powered by Google Gemini that analyzes student context (schedule, grades, fees, attendance).
* **Dynamic Widget Rendering**: Directly returns structured UI widget payloads inside chat for instant visualizations (e.g., attendance donut charts, timetable cards).

---

## 3. Tech Stack

### Frontend
| Technology | Version | Purpose & Role |
| :--- | :--- | :--- |
| **React** | `19.x` | Core UI component architecture and declarative rendering engine |
| **TypeScript** | `6.x` | Strict static typing, type safety, and interface contracts across components |
| **Vite** | `8.x` | Next-generation frontend build tooling and instantaneous Hot Module Replacement (HMR) |
| **Tailwind CSS** | `4.x` | Modern utility-first CSS framework for custom responsive design tokens |
| **Zustand** | `5.x` | Lightweight, boilerplate-free global state store for authentication and user sessions |
| **React Router** | `7.x` | Client-side routing, protected navigation guards, and nested layouts |
| **React Hook Form + Zod** | `7.x / 4.x` | Schema-driven form state management and runtime input validation |
| **Framer Motion & GSAP** | `12.x / 3.x` | Smooth page transitions, UI micro-interactions, and visual dashboard animations |
| **Recharts** | `3.x` | Composable charting library for academic performance and attendance analytics |
| **Html5-Qrcode & React-QR** | `2.x` | Client-side QR code camera scanning and QR generator for attendance verification |

### Backend
| Technology | Version | Purpose & Role |
| :--- | :--- | :--- |
| **FastAPI** | `>= 0.110` | High-performance asynchronous RESTful API framework with automatic OpenAPI documentation |
| **Python** | `3.13` | Modern asynchronous Python runtime |
| **SQLAlchemy** | `2.0.x` | Async Object Relational Mapper (ORM) using `asyncpg` / `aiomysql` for database interaction |
| **Alembic** | `1.13.x` | Database migration management and declarative schema version control |
| **Pydantic** | `2.6.x` | High-throughput data validation, serialization, and settings parsing |
| **PyJWT & Passlib** | `2.8.x / 1.7.x` | Stateless JWT access/refresh token generation and bcrypt password hashing |
| **Google GenAI SDK** | `>= 0.2.0` | Google Gemini API integration for Yuna AI Copilot |
| **Uvicorn** | `>= 0.28` | Lightning-fast ASGI web server |

### Database & Storage Architecture
* **PostgreSQL (Supabase)**: *Primary recommended engine*—cloud-hosted PostgreSQL with async pooling (`asyncpg`).
* **MySQL**: *Fully supported alternative*—compatible with MySQL 8.0+ / MariaDB using asynchronous `aiomysql`.
* **Automatic Dialect Adapter**: The backend configuration validator (`app/core/config.py`) automatically detects whether `DATABASE_URL` is PostgreSQL (`postgres://` / `postgresql://`) or MySQL (`mysql://`) and attaches the appropriate async driver (`postgresql+asyncpg://` or `mysql+aiomysql://`).

---

## 4. Architecture

```mermaid
flowchart TB
    subgraph Client ["Client Layer (React 19 + TypeScript)"]
        UI["Tailwind CSS + shadcn UI"]
        Store["Zustand Auth & Session Store"]
        Scanner["Html5-Qrcode Camera Scanner"]
        ChatbotUI["Yuna AI Chat Widget & Dynamic Widgets"]
    end

    subgraph Gateway ["API & Security Gateway (FastAPI)"]
        CORS["CORS Middleware"]
        AuthGuard["OAuth2 Bearer / JWT Token Verifier"]
        RBAC["Role-Based Access Controller (Admin / Faculty / Student)"]
    end

    subgraph Services ["Application & Domain Services"]
        AuthService["Auth & Token Manager"]
        StudentDashService["Student Dashboard Aggregator"]
        FacultyDashService["Faculty Ledger & Substitution Service"]
        QRAttendanceService["QR Attendance Engine (HMAC / Expiry)"]
        FeeService["Fee Invoicing & Collection Engine"]
        PlacementService["Placement & Job Application Pipeline"]
        AIService["Yuna AI Service (Prompt Engine + Gemini API)"]
    end

    subgraph Persistence ["Persistence & External Services"]
        SQLA["SQLAlchemy 2.0 Async Session"]
        Alembic["Alembic Migrations"]
        DB[(PostgreSQL / Supabase OR MySQL)]
        GeminiAPI["Google Gemini LLM (gemini-3.5-flash)"]
        SMTP["SMTP Mail Server"]
    end

    Client -->|HTTPS / JSON REST API| Gateway
    Gateway --> Services
    Services --> SQLA
    SQLA --> DB
    AIService -->|Async API Call| GeminiAPI
    AuthService -.-> SMTP
```

---

## 5. Project Structure

```
StudentERP/
├── backend/                        # FastAPI Asynchronous Backend
│   ├── alembic/                    # Database migration scripts & versions
│   ├── app/
│   │   ├── api/                    # API Route definitions
│   │   │   └── v1/                 # Version 1 endpoints (auth, students, fees, qr, etc.)
│   │   ├── core/                   # Global configuration (settings, security, constants)
│   │   ├── crud/                   # Low-level Database CRUD repositories
│   │   ├── database/               # Async engine, sessionmaker, and Base declarative model
│   │   ├── dependencies/           # FastAPI dependency injection (DB sessions, current_user)
│   │   ├── models/                 # SQLAlchemy ORM Database models
│   │   ├── schemas/                # Pydantic schemas for request validation & response serialization
│   │   ├── services/               # Business logic (AI service, dashboard aggregation)
│   │   └── utils/                  # Helper utilities (QR encoders, password hasher)
│   ├── tests/                      # Automated test suite (pytest + httpx)
│   ├── .env.example                # Backend environment template
│   ├── alembic.ini                 # Alembic configuration file
│   ├── requirements.txt            # Python dependencies (asyncpg, aiomysql, fastapi, etc.)
│   └── seed.py                     # Initial database seeding script
│
├── frontend/                       # React 19 + TypeScript SPA
│   ├── src/
│   │   ├── api/                    # Axios client instances & API request handlers
│   │   ├── assets/                 # Static images, icons, and illustrations
│   │   ├── components/             # Reusable UI components (Modals, Navbars, ChatWidget, Cards)
│   │   ├── hooks/                  # Custom React hooks (useAuth, useAttendance)
│   │   ├── pages/                  # Page route views
│   │   │   ├── admin/              # Admin dashboard, fee configuration, analytics
│   │   │   ├── faculty/            # Attendance marking, assignments, substitution, marks entry
│   │   │   ├── student/            # Student home, assignments, fees, ID card, timetable, results
│   │   │   ├── placement-admin/    # Recruitment drives, applications, shortlists
│   │   │   └── Login.tsx           # Multi-role authentication entrypoint
│   │   ├── store/                  # Zustand global stores (authStore)
│   │   ├── types/                  # TypeScript interface declarations
│   │   ├── App.tsx                 # Root router configuration
│   │   ├── index.css               # Design tokens & Tailwind theme definitions
│   │   └── main.tsx                # React DOM entry point
│   ├── package.json                # Frontend dependencies & npm scripts
│   └── vite.config.ts              # Vite bundler configuration
│
├── docker-compose.yml              # Container orchestration setup
└── README.md                       # Documentation
```

---

## 6. Installation & Setup

Follow these step-by-step instructions to run the project on any computer (Windows, macOS, or Linux).

### Prerequisites
* **Node.js**: `v18.x` or `>= v20.x` ([Download Node.js](https://nodejs.org/))
* **npm**: `v9.x` or higher
* **Python**: `3.11+` (recommended: `Python 3.13`) ([Download Python](https://www.python.org/))
* **Database**: Free [Supabase](https://supabase.com) PostgreSQL project **OR** a local MySQL / PostgreSQL server
* **Google Gemini API Key**: *(Optional, for Yuna AI)* Get from [Google AI Studio](https://aistudio.google.com/)

---

### Step 1: Clone the Repository
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
   Create a `.env` file by copying `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Open `.env` and configure your database and keys:

   #### 🔹 Option A: Using Supabase PostgreSQL (Recommended)
   Get your connection string from **Supabase Dashboard -> Settings -> Database -> Connection string (URI)**:
   ```ini
   DATABASE_URL=postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   DIRECT_URL=postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
   ```

   #### 🔹 Option B: Using Local / Cloud MySQL
   ```ini
   DATABASE_URL=mysql://root:password@127.0.0.1:3306/student_erp
   DIRECT_URL=mysql://root:password@127.0.0.1:3306/student_erp
   ```

   #### 🔹 Other Settings in `.env`:
   ```ini
   PROJECT_NAME="Student ERP Backend"
   API_V1_STR="/api/v1"
   DEBUG=True

   # Security
   SECRET_KEY=replace-with-a-random-32-character-secret-key
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   REFRESH_TOKEN_EXPIRE_DAYS=7

   # Super Admin Credentials (used for initial seed)
   FIRST_SUPERUSER_EMAIL=admin@example.com
   FIRST_SUPERUSER_PASSWORD=admin

   # Gemini API Key (for Yuna AI Assistant)
   GEMINI_API_KEY=your-gemini-api-key-here
   ```

5. **Run Database Schema Migrations**:
   ```bash
   alembic upgrade head
   ```

6. **Seed Initial Roles, Admin User, and Departments**:
   ```bash
   python seed.py
   ```
   *(This creates the default Admin account: `admin@example.com` / `admin`, along with core departments and roles).*

7. **Start the Backend API Server**:
   ```bash
   fastapi dev app/main.py
   # Or using uvicorn:
   uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
   ```
   * **API Base**: `http://127.0.0.1:8000`
   * **Interactive Swagger UI**: `http://127.0.0.1:8000/docs`
   * **ReDoc**: `http://127.0.0.1:8000/redoc`

---

### Step 3: Frontend Setup

1. **Open a new terminal and navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install Node dependencies**:
   ```bash
   npm install
   ```

3. **Verify API Configuration (`src/config.ts`)**:
   Ensure `API_BASE_URL` matches your local backend URL:
   ```typescript
   export const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';
   ```

4. **Start the React Vite Development Server**:
   ```bash
   npm run dev
   ```
   * **Web App URL**: `http://localhost:5173`

---

## 7. Usage & Workflow Guide

```
[Login Screen] ──> Choose Role / Enter Credentials (Student / Faculty / Admin)
      │
      ├── 🧑‍🎓 Student: View Dashboard ─> Scan QR Attendance ─> Pay Fees ─> Submit Assignment ─> Chat with Yuna AI
      ├── 👨‍🏫 Faculty: Launch Attendance ─> Display Dynamic QR ─> Grade Assignments ─> Assign Substitute
      └── 🏛️ Admin: Manage Departments ─> Publish Notices ─> Audit Fee Collections ─> Post Placement Drives
```

1. **Admin Initial Setup**:
   * Open `http://localhost:5173/login`.
   * Sign in using the seed credentials: `admin@example.com` / `admin`.
   * Create Departments, Courses, Subjects, and register Faculty and Student accounts.
2. **Faculty Classroom Flow**:
   * Sign in with faculty credentials.
   * Go to **Attendance Manager** -> Select Subject and Section -> Click **Launch Dynamic QR Code**.
   * Display the live QR code on the lecture projector.
   * Take manual roll call or submit an internal exam mark sheet via **Marks Manager**.
3. **Student Daily Flow**:
   * Sign in with student credentials.
   * Open **My Attendance** -> Click **Scan QR** and point device camera at the classroom projector screen. Attendance is marked instantly.
   * Check assignment deadlines in **My Assignments**, upload solutions, or download digital fees receipts in **My Fees**.
   * Click the bottom-right floating badge to open **Yuna AI** and query attendance statistics or upcoming timetable in natural language.

---

## 8. Screenshots & Demo Highlights

| Student Academic Dashboard | Dynamic QR Code Scanner |
| :---: | :---: |
| *Visual attendance trends, recent notices, schedule overview, and GPA tracker* | *Encrypted live-refreshing QR code verification for fraud-proof attendance* |

| Faculty Grading Ledger | Yuna AI Copilot & Widgets |
| :---: | :---: |
| *Comprehensive submission evaluation, remarks dispatch, and marks entry* | *Natural language academic queries with interactive UI widget responses* |

---

## 9. API Documentation

FastAPI automatically generates interactive documentation accessible at `http://127.0.0.1:8000/docs`. Key core endpoints are summarized below:

### Authentication
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/v1/auth/login` | Authenticate user with OAuth2 form data; returns JWT access & refresh tokens | ❌ No |
| `POST` | `/api/v1/auth/register` | Register new student or faculty account | ❌ No |
| `POST` | `/api/v1/auth/refresh` | Exchange valid refresh token for a new access token | ❌ No |

### Student Operations
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/v1/student-dash/overview` | Fetch complete student dashboard metrics, upcoming classes, and alerts | 🔒 Student |
| `GET` | `/api/v1/student-dash/attendance` | Retrieve subject-wise attendance percentages and daily presence records | 🔒 Student |
| `GET` | `/api/v1/student-dash/fees` | Get fee ledger, pending balance, and payment history | 🔒 Student |

### QR Attendance System
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/v1/qr/generate` | Generate a cryptographically signed, short-lived QR token for a lecture session | 🔒 Faculty |
| `POST` | `/api/v1/qr/scan` | Submit scanned QR token payload to verify and record student presence | 🔒 Student |

### Assignments & Academics
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/v1/assignments/` | List all assignments filtered by enrolled courses and subjects | 🔒 Authenticated |
| `POST` | `/api/v1/assignments/` | Create a new assignment with deadline and attachment metadata | 🔒 Faculty / Admin |
| `POST` | `/api/v1/assignments/{id}/submit` | Submit student assignment response | 🔒 Student |

### AI Assistant
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/v1/chatbot/chat` | Query Yuna AI with student context and retrieve answer + optional widget payload | 🔒 Authenticated |

---

## 10. Engineering Decisions & Trade-offs

1. **Dual Database Dialect Support (Supabase PostgreSQL + MySQL)**:
   * *Decision*: Designed the database layer to dynamically adapt to PostgreSQL (via `asyncpg`) or MySQL (via `aiomysql`) through Pydantic field validators in `app/core/config.py`.
   * *Trade-off*: Requires keeping models and queries compatible across both SQL dialects, but allows maximum deployment flexibility (cloud Supabase vs on-prem MySQL).

2. **Asynchronous Architecture with FastAPI & SQLAlchemy 2.0**:
   * *Decision*: Replaced traditional synchronous WSGI patterns (e.g., Flask/Django) with fully async event-loop handling using FastAPI and asynchronous DB drivers.
   * *Trade-off*: Higher codebase discipline for `async/await` flows, but achieves orders-of-magnitude higher concurrency during morning attendance scanning spikes.

3. **Stateless JWT Tokens with Refresh Rotation**:
   * *Decision*: Implemented short-lived (30-minute) JWT Access Tokens paired with longer-lived (7-day) Refresh Tokens rather than server-side stateful sessions.
   * *Trade-off*: Eliminates shared server memory or centralized session store overhead (e.g., Redis), enabling trivial horizontal backend scaling across container replicas.

4. **Client-Side State via Zustand over Redux**:
   * *Decision*: Selected Zustand for global authentication and user session persistence.
   * *Trade-off*: Reduced boilerplate code by >80% compared to Redux Toolkit while maintaining reactivity and tiny bundle footprint.

5. **Dynamic Time-Expiring QR Tokens for Attendance**:
   * *Decision*: Attendance QR codes generate ephemeral session tokens with minute-level TTLs instead of static URLs.
   * *Trade-off*: Requires students to scan live in the classroom to prevent remote attendance spoofing via forwarded screenshots.

6. **Grounded AI Prompting with Custom Structured Widget Syntax**:
   * *Decision*: Injected user academic context into system prompts and enforced structured ` ```widget ` JSON schemas in Gemini responses.
   * *Trade-off*: Enables the frontend to parse responses and render real interactive React cards directly inside the conversation stream rather than plain text blocks.

---

## 11. Testing

The backend includes an automated test suite powered by `pytest` and `pytest-asyncio` using `httpx.AsyncClient` against an in-memory test database schema (`aiosqlite`).

### Running Backend Tests
```bash
# Navigate to backend
cd backend

# Activate virtual environment
.\venv\Scripts\Activate.ps1   # Windows
source venv/bin/activate      # Linux/Mac

# Run all test suites
pytest

# Run tests with detailed output
pytest -v -s
```

### Running Frontend Linter & Type Checks
```bash
# Navigate to frontend
cd frontend

# Run TypeScript type check
npx tsc -b

# Run ESLint validation
npm run lint
```

---

## 12. Limitations & Future Improvements

### Current Limitations
* **Payment Gateway Mocking**: Fee collection currently tracks transactions and generates invoice receipts through internal ledger simulation rather than an integrated payment gateway (e.g., Stripe/Razorpay).
* **Storage Provider**: File attachments for assignments and notices are currently referenced via direct payload links rather than an S3/Cloud Storage presigned URL pipeline.
* **Push Notifications**: System updates (notices, low attendance warnings) rely on in-app queries rather than WebSockets or Firebase Cloud Messaging.

### Roadmap & Future Improvements
* [ ] **Payment Gateway Integration**: Direct Stripe and Razorpay checkout for real-time tuition fee payments and automated webhook reconciliation.
* [ ] **AWS S3 / Cloudflare R2 File Storage**: Cloud storage upload pipeline for student assignment submissions and faculty materials.
* [ ] **Real-Time Push Notifications**: WebSocket integration for instant alerts on grade publications, lecture cancellations, and substitute notifications.
* [ ] **Biometric & Geofenced QR Attendance**: Device GPS perimeter validation during QR code scans to ensure physical presence inside lecture halls.
* [ ] **Mobile App**: Cross-platform mobile release using React Native / Capacitor.

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for more details.

---

## 👥 Contributors & Contact

* **Lead Developer / Author**: [Yash Patel](https://github.com/yashpatel609)
* **Repository**: [https://github.com/yashpatel609/StudentERP](https://github.com/yashpatel609/StudentERP)
