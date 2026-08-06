# Student ERP System - Brain Document (A to Z)

## 1. Project Overview
The **Student ERP System** is a comprehensive full-stack application designed to manage enterprise resources for an educational institution. It provides role-based access control (RBAC) and handles everything from student enrollments and fee management to academic tracking and placements.

## 2. Tech Stack

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS & shadcn/ui components
- **State Management**: Zustand
- **Form Handling & Validation**: React Hook Form + Zod
- **API Client**: Axios
- **Authentication**: JWT (handled securely via `jwt-decode`)

### Backend
- **Framework**: FastAPI (Python 3.13)
- **Server**: Uvicorn
- **Database**: PostgreSQL (Hosted on Supabase)
- **ORM & Migrations**: SQLAlchemy 2.0 (Asyncpg) + Alembic
- **Authentication**: OAuth2 with JWT Access & Refresh Tokens
- **Password Hashing**: bcrypt (via Passlib)

## 3. System Architecture
The project follows a standard decoupled Client-Server architecture:
- **Frontend App (`/frontend`)**: A Single Page Application (SPA) providing specialized portals for different user roles.
- **Backend API (`/backend`)**: A RESTful API built with FastAPI that processes business logic, manages the database, and serves data to the frontend.

## 4. Key Entities & Database Models
The system is built around several core entities (as seen in `backend/app/models`):
- **Users**: Core authentication and profile management (Admin, Faculty, Student, Placement Admin).
- **Academic Structure**:
  - `Department`: Groups courses and faculties.
  - `Course`: Academic programs.
  - `Subject` & `SubjectAssignment`: Subjects taught in courses and mapped to faculties.
- **Academic Tracking**:
  - `Attendance` & `QRAttendance`: Tracking student presence (including QR-based attendance).
  - `Marks`: Storing and managing student grades/marks.
  - `Assignment`: Managing student coursework.
  - `Timetable`: Managing class schedules.
- **Administration & Finance**:
  - `Fee`: Tracking fee payments and dues.
  - `System`: System-wide configuration.
- **Campus Life & Careers**:
  - `Event`: Managing college events.
  - `Communication`: Notices and messages.
  - `Placement`: Managing campus recruitment, job postings, and student applications.

## 5. Role-Based Portals (Frontend Structure)
The frontend (`frontend/src/pages`) is categorized into specific portals based on the user's role:
- **Login Portal**: Centralized authentication (`Login.tsx`).
- **Student Portal (`/student`)**: Access to ID Card, attendance, marks, assignments, fees, placements, and timetable.
- **Faculty Portal (`/faculty`)**: Tools to manage attendance, assignments, marks, and view timetable.
- **Admin Portal (`/admin`)**: High-level management of departments, users, courses, subjects, fees, and overall system configuration.
- **Placement Admin Portal (`/placement-admin`)**: Specialized dashboard for managing placement drives and student career opportunities.
- **Events Portal (`/events`)**: General access to campus events.

## 6. Development & Startup Workflow
### Backend Setup
1. Database is hosted on Supabase (PostgreSQL). Environment variables (`DATABASE_URL`, `DIRECT_URL`) are required in `backend/.env`.
2. Migrations are managed via Alembic (`alembic upgrade head`).
3. Virtual environment is required for dependency management (`pip install -r requirements.txt`).
4. Server runs via `fastapi dev app/main.py` on `http://127.0.0.1:8000`. API docs at `/docs`.

### Frontend Setup
1. Dependencies installed via `npm install`.
2. Development server runs via `npm run dev` on `http://localhost:5173`.

## 7. Authentication Flow
- User logs in via the frontend.
- Backend validates credentials and issues a JWT Access Token and Refresh Token.
- Frontend stores the token (typically in local storage or secure cookie) and decodes it (using `jwt-decode`) to determine the user's role and state.
- Axios interceptors attach the token to subsequent API requests.
- Role-based guards on the frontend restrict access to specific routes (e.g., a Student cannot access the Admin portal).
