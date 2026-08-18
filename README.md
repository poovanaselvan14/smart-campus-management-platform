# NEXCAMPUS — The Operating System for Your Campus 🎓

[![Build Status](https://img.shields.io/badge/Build-Passing-emerald)](https://github.com/poovanaselvan/smart-campus-management-platform)
[![License](https://img.shields.io/badge/License-MIT-indigo)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-FullStack_SaaS-blue)](https://github.com/poovanaselvan/smart-campus-management-platform)
[![API Health](https://img.shields.io/badge/API-Healthy-brightgreen)](https://nexcampus-backend.onrender.com/api/health)

**NEXCAMPUS** is a production-ready, full-stack Smart Campus Management Platform designed to centralize student, faculty, coordinator, and administrator activities into one intelligent SaaS web application. It eliminates fragmented notice boards, spreadsheets, and messaging groups by unifying attendance tracking, coursework grading, QR event entry passes, placement drives, campus clubs, and administrative audit trails into a single high-performance platform.

---

## 🌟 Key Features & Role Capabilities

### 🎓 Student Persona
* **Intelligent Dashboard**: Personalized morning overview greeting, attendance health percentage with trend indicators (`86.4% ↑ 2.4%`), and upcoming lecture timetable.
* **Smart Attendance Advisor**: Dynamic subject breakdown and goal advice engine (*"Attend next 2 classes to reach 80%"*).
* **Task Management Board**: View deadlines, submit solution files (PDF/ZIP) or GitHub repository links with automated late submission detection (`isLate`).
* **QR Event Passes**: Download unique QR code tickets for campus hackathons and workshops.
* **Placement Portal**: Auto-enforced GPA eligibility checks (`StudentProfile.gpa >= eligibilityGpa`), resume uploads, and real-time application pipeline tracking.

### 👨‍🏫 Faculty Persona
* **Interactive Attendance Roster**: Select course/section, mark student present/absent/late with individual toggles or *"Mark All Present"*, and commit bulk records transaction-safely to PostgreSQL.
* **Assignment Manager**: Publish assignments with description, deadlines, max marks, and attachment specs.
* **Grading Stack**: Inspect student GitHub repos, view solution files, assign numeric marks and feedback comments, and automatically dispatch notifications to students.

### 🎪 Coordinator Persona
* **Event Capacity Orchestrator**: Publish campus events with seat capacity bars (`184 / 300 registered`).
* **Venue Ticket Scanner**: Real-time QR Code Pass Scanner validator verifying ticket codes (`TICKET-XXXX-XXXX`) and updating status to `CHECKED_IN`.
* **Clubs & Announcements**: Manage campus societies, member rosters, and targeted broadcast announcements.

### 🛡️ Administrator Persona
* **Institution Analytics**: High-density KPI metrics (`12,842 Students`, `482 Faculty`, `87.4% Attendance`, `74% Placement Rate`) and Recharts performance console.
* **User Management Directory**: Search, filter, edit roles (`STUDENT`, `FACULTY`, `COORDINATOR`, `ADMIN`), and manage account statuses.
* **Audit Trail Stream**: Security activity log tracking sensitive actions (`USER_CREATED`, `ROLE_CHANGED`, `ATTENDANCE_CREATED`, `GRADE_UPDATED`, `EVENT_CREATED`).

---

## 🛠️ Technology Stack

* **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons, Framer Motion, Recharts, QRCode.react.
* **Backend**: Node.js, Express.js (REST API Architecture), TypeScript, Zod, Helmet, CORS, Rate Limiters.
* **Database & ORM**: PostgreSQL / SQLite, Prisma ORM (Normalized Relational Schema).
* **Security & Auth**: JWT (JSON Web Tokens) in HttpOnly Cookies & Bearer headers, Bcrypt password hashing, Server-Side Role-Based Access Control (RBAC).

---

## 🏗️ Architecture

```text
               ┌─────────────────────────────────────────┐
               │          NEXCAMPUS Web Client           │
               │     React 18 + Vite + TypeScript        │
               └────────────────────┬────────────────────┘
                                    │ HTTPS REST API
                                    ▼
               ┌─────────────────────────────────────────┐
               │        Express REST API Backend         │
               │   Auth, Validation, RBAC, Audit Engine  │
               └──────────┬───────────────────┬──────────┘
                          │                   │
                Prisma DB │                   │ Notifications
                          ▼                   ▼
               ┌────────────────────┐  ┌────────────────────┐
               │  PostgreSQL /      │  │ Notification &     │
               │  SQLite Database   │  │ Audit Log Service  │
               └────────────────────┘  └────────────────────┘
```

---

## 🔑 Demo Credentials

Test the live platform instantly using pre-configured persona credentials:

| Persona | Email | Password | Core Highlights |
| :--- | :--- | :--- | :--- |
| **Student** | `student@demo.com` | `Password123!` | Attendance health, GitHub assignment submission, QR event pass, placement drive eligibility |
| **Faculty** | `faculty@demo.com` | `Password123!` | Interactive roster attendance taking, assignment publisher, grading stack |
| **Coordinator** | `coordinator@demo.com` | `Password123!` | Event seat capacity manager, venue QR ticket code scanner validator (`TICKET-HACK-STU042`) |
| **Admin** | `admin@demo.com` | `Password123!` | User directory role manager, Recharts analytics, security audit log stream |

---

## 🚀 Local Installation & Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/poovanaselvan/smart-campus-management-platform.git
   cd smart-campus-management-platform
   ```

2. **Install Dependencies**:
   ```bash
   # Install Server Dependencies
   cd server
   npm install

   # Install Client Dependencies
   cd ../client
   npm install
   ```

3. **Configure Environment Variables**:
   Create `.env` in `server/`:
   ```env
   PORT=5000
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="super-secret-jwt-key-campus-2026"
   CORS_ORIGIN="http://localhost:5173"
   NODE_ENV="development"
   ```

4. **Initialize Database & Seed Data**:
   ```bash
   cd server
   npx prisma db push
   npm run db:seed
   ```

5. **Launch Local Servers**:
   ```bash
   # Terminal 1: Backend Server (Port 5000)
   cd server
   npm run dev

   # Terminal 2: Frontend App (Port 5173)
   cd client
   npm run dev
   ```

---

## 📜 API Documentation

OpenAPI / Swagger UI documentation is available at:
* **Local**: [http://localhost:5000/api/docs](http://localhost:5000/api/docs)
* **Production**: `https://nexcampus-backend.onrender.com/api/docs`

---

## 🔐 Security Architecture

* **Role-Based Access Control (RBAC)**: Strict `requireRole(...)` middleware guards backend routes; unauthorized student requests return HTTP 403 Forbidden.
* **Transaction Safety**: Financial & capacity-sensitive updates (e.g. event registration, attendance session saving) execute inside Prisma `$transaction` blocks.
* **Audit Trail**: Real-time logging of administrative events into `ActivityLog` table with IP address tracking.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
