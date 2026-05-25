# 🎓 Academia — Student Management System

A full-stack Student Management System built with **Node.js**, **Express.js**, and **TypeScript** on the backend, with a clean HTML/CSS/JS frontend. Features a RESTful API with proper architecture, validation, error handling, and a responsive UI.

---

## 📁 Project Structure

```
student-management-system/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── app.config.ts          # Centralised app configuration
│   │   ├── controllers/
│   │   │   └── student.controller.ts  # HTTP layer — parses req, formats res
│   │   ├── services/
│   │   │   └── student.service.ts     # Business logic layer
│   │   ├── routes/
│   │   │   └── student.routes.ts      # Route → Controller mappings
│   │   ├── models/
│   │   │   └── student.model.ts       # In-memory data store (swap for DB here)
│   │   ├── middlewares/
│   │   │   ├── error.middleware.ts    # Centralised error handler
│   │   │   └── logger.middleware.ts   # Request logger
│   │   ├── interfaces/
│   │   │   ├── student.interface.ts   # Student entity & DTO types
│   │   │   └── api-response.interface.ts
│   │   ├── utils/
│   │   │   ├── app-error.ts           # Custom error class with statusCode
│   │   │   ├── response.helper.ts     # Consistent response factories
│   │   │   └── validation.helper.ts   # Pure validation functions
│   │   ├── app.ts                     # Express app setup (no server.listen)
│   │   └── server.ts                  # Entry point — starts HTTP server
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── index.html      # Student Registration page
    ├── dashboard.html  # Student Dashboard
    ├── styles.css      # Shared styles (refined academic aesthetic)
    ├── api.js          # Shared API client (fetch wrapper)
    ├── register.js     # Registration page logic
    └── dashboard.js    # Dashboard logic (CRUD, search, pagination)
```

---

## 🚀 Setup & Running

### Prerequisites
- **Node.js** v18 or higher
- **npm** v9 or higher

### 1. Install backend dependencies

```bash
cd student-management-system/backend
npm install
```

### 2. Start the backend (development mode with hot-reload)

```bash
npm run dev
```

The API server starts on **http://localhost:5000**

You should see:

```
🎓 Student Management API
─────────────────────────────────────────
🚀  Server running on http://localhost:5000
📡  API base: http://localhost:5000/api/v1
❤️   Health:  http://localhost:5000/health
🌍  Mode:     development
─────────────────────────────────────────
```

### 3. Open the frontend

**Option A — Direct file open (simplest)**
Open `frontend/index.html` in your browser (double-click or drag into browser).

**Option B — Live Server (VS Code)**
Install the *Live Server* extension, right-click `index.html` → *Open with Live Server*.
This runs on `http://127.0.0.1:5500` which is already in the CORS allowlist.

**Option C — Any static server**
```bash
cd frontend
npx serve .
# or: python3 -m http.server 3000
```

---

## 🔌 REST API Reference

### Base URL
```
http://localhost:5000/api/v1
```

### Health Check
```
GET /health
```

### Endpoints

| Method | Path                     | Description           |
|--------|--------------------------|-----------------------|
| GET    | `/students`              | List all students     |
| POST   | `/students`              | Create a student      |
| GET    | `/students/:id`          | Get student by ID     |
| PUT    | `/students/:id`          | Update a student      |
| DELETE | `/students/:id`          | Delete a student      |

### Query Parameters (GET /students)

| Param    | Type   | Description                        |
|----------|--------|------------------------------------|
| `page`   | number | Page number (default: 1)           |
| `limit`  | number | Items per page (default: 10)       |
| `search` | string | Search first name, last name, email|
| `status` | string | Filter by status                   |
| `course` | string | Filter by course (partial match)   |

### Request / Response Examples

**Create Student**
```http
POST /api/v1/students
Content-Type: application/json

{
  "firstName": "Aanya",
  "lastName": "Sharma",
  "email": "aanya@example.com",
  "phone": "+91-9876543210",
  "course": "Computer Science",
  "enrollmentYear": 2023,
  "grade": "A",
  "status": "active"
}
```

**Success Response (201)**
```json
{
  "success": true,
  "message": "Student created successfully",
  "data": {
    "id": "uuid-here",
    "firstName": "Aanya",
    ...
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Validation Error Response (422)**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Invalid email format" },
    { "field": "grade", "message": "Grade must be one of: A+, A, A-..." }
  ]
}
```

**Not Found Response (404)**
```json
{
  "success": false,
  "message": "Student with id \"xyz\" not found"
}
```

### Valid Field Values

| Field           | Valid values                                          |
|-----------------|-------------------------------------------------------|
| `status`        | `active`, `inactive`, `graduated`, `suspended`        |
| `grade`         | `A+`, `A`, `A-`, `B+`, `B`, `B-`, `C+`, `C`, `C-`, `D`, `F` |
| `enrollmentYear`| 1900 – current year + 1                               |

---

## 🏗 Architecture

### Route → Controller → Service

```
HTTP Request
    │
    ▼
routes/student.routes.ts       ← Maps path + verb to controller function
    │
    ▼
controllers/student.controller.ts  ← Parses request, validates input, calls service
    │
    ▼
services/student.service.ts    ← Business logic (duplicate checks, etc.)
    │
    ▼
models/student.model.ts        ← Data access (in-memory; swap for DB here)
    │
    ▼
HTTP Response (via response.helper.ts)
```

### Error Flow

```
Any layer throws AppError(message, statusCode)
    │
    ▼
middlewares/error.middleware.ts  ← Catches all errors, sends consistent JSON
```

### Key Design Decisions

1. **In-memory storage** — No database required to run the project. Replace the functions in `student.model.ts` with Prisma/TypeORM calls and nothing else changes.
2. **Custom AppError class** — Carries `statusCode` so the error middleware can set the correct HTTP status without branching logic.
3. **Validation in utils** — Pure functions with no Express dependency = easy to unit test.
4. **Response helpers** — `sendSuccess()` / `sendError()` ensure the envelope shape never drifts across endpoints.
5. **API versioning** — All routes live under `/api/v1/` so future breaking changes can be introduced as `/api/v2/` without affecting existing clients.

---

## 📦 Build for Production

```bash
cd backend
npm run build       # compiles TypeScript → dist/
npm start           # runs dist/server.js
```

---

## 🧩 Extending the Project

### Add a real database
1. Install Prisma: `npm install prisma @prisma/client`
2. Replace the functions in `src/models/student.model.ts` with Prisma queries
3. The rest of the codebase is unaffected

### Add authentication
1. Add `jsonwebtoken` + `bcryptjs`
2. Create `src/middlewares/auth.middleware.ts`
3. Apply it to protected routes in `student.routes.ts`

### Add environment variables
1. Install `dotenv`: `npm install dotenv`
2. Create `.env` file
3. Import in `src/server.ts`: `import 'dotenv/config'`
