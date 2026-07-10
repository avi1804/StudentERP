# Student ERP System

A complete full-stack Student Enterprise Resource Planning (ERP) system featuring role-based access control (Admin, Faculty, Student), attendance tracking, marks management, notices, and more.

## Tech Stack

### Frontend
*   **Framework**: React 19 + TypeScript
*   **Build Tool**: Vite
*   **Styling**: Tailwind CSS & shadcn/ui
*   **State Management**: Zustand
*   **Form Handling**: React Hook Form + Zod (Validation)
*   **API Client**: Axios
*   **Authentication**: JWT (JSON Web Tokens) decoded securely via `jwt-decode`

### Backend
*   **Language**: Python 3.13
*   **Framework**: FastAPI
*   **Server**: Uvicorn
*   **Authentication**: JWT Access & Refresh Tokens (OAuth2 Password Bearer)
*   **Password Hashing**: bcrypt (Passlib)

### Database
*   **Database Engine**: PostgreSQL (hosted on Supabase)
*   **ORM**: SQLAlchemy 2.0 (Asyncpg)
*   **Migrations**: Alembic

---

## Startup Instructions

Follow these instructions to run the project locally on any PC.

### 1. Database Setup
The backend is already configured to connect to a Supabase PostgreSQL instance. Ensure you have the `backend/.env` file containing the `DATABASE_URL` and `DIRECT_URL`. 
*(Note: If your friend is setting up a fresh database, they must run migrations from the backend directory using: `alembic upgrade head`)*

### 2. Running the Backend
Open a new terminal and run the following commands:

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Create a virtual environment (First time only)
python -m venv venv

# 3. Activate the virtual environment
# On Windows:
.\venv\Scripts\Activate
# On Mac/Linux:
source venv/bin/activate

# 4. Install dependencies (First time only)
pip install -r requirements.txt

# 5. Start the FastAPI development server
fastapi dev app/main.py
# (The API will run at http://127.0.0.1:8000)
# (Swagger Docs available at http://127.0.0.1:8000/docs)
```

### 3. Running the Frontend
Open a **second** terminal and run the following commands:

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install dependencies (First time only)
npm install

# 3. Start the React Vite development server
npm run dev
# (The Web App will run at http://localhost:5173)
```

### 4. Logging In
Once both servers are running:
1. Open your browser and go to `http://localhost:5173`
2. You can create a new student account by signing up.
3. To access the Admin Portal, go to the Admin Login page and use the credentials configured in your backend `.env` file (e.g., `admin@example.com` / `admin`).
