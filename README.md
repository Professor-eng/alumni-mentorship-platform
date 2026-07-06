# 🎓 Alumni Bridge – Alumni Mentorship Platform

A full-stack platform that connects students with alumni mentors for guidance, networking, and career support. Students can discover mentors, book mentorship sessions, participate in community discussions, and track their activities from a centralized dashboard.

## 🚀 Live Demo

- **Frontend:** https://alumni-mentorship-platform-eight.vercel.app
- **Backend API Docs:** https://alumni-mentorship-platform-42au.onrender.com/docs

---

## ✨ Features

### Mentor Profiles
- Browse mentors by:
  - Name
  - Domain
  - Experience
  - Bio
  - Availability
- Discover mentors that match your interests.

### Booking Requests
- Request mentorship sessions with alumni.
- Mentors can:
  - Accept requests
  - Decline requests
  - Update booking status

### Open Discussion Forum
- Ask questions and start discussions.
- Share advice and experiences.
- Participate through comments and replies.

### Dashboard
A centralized dashboard to:
- View mentor profiles
- Manage booking requests
- Track forum activity

### Interest Matching
Students can select areas they need help with, and the platform ranks mentors based on how well they match those interests.

---

## 🛠 Tech Stack

### Backend
- FastAPI
- SQLAlchemy
- PostgreSQL
- Alembic
- Docker

### Frontend
- React
- Vite
- CSS

### Deployment
- Frontend: Vercel
- Backend: Render
- Database: Neon PostgreSQL

---


## Project Structure

```text
alumni-mentorship-platform/
├── backend/
│   ├── alembic/
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   ├── database.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
└── docker-compose.yml
```

---

## ⚙️ Running Locally

### Clone the repository

```bash
git clone https://github.com/Professor-eng/alumni-mentorship-platform.git
cd alumni-mentorship-platform
```

---

## Run with Docker

```bash
docker compose up --build
```

Backend:

```text
http://localhost:8000
```

API Docs:

```text
http://localhost:8000/docs
```

---

## Run Frontend Separately

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## Database Migrations

Create a migration:

```bash
alembic revision --autogenerate -m "message"
```

Apply migrations:

```bash
alembic upgrade head
```

---

## Environment Variables

### Backend

```env
DATABASE_URL=postgresql://postgres:password@db:5432/alumni_db
```

For local development outside Docker:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/alumni_db
```

### Frontend

```env
VITE_API_URL=http://localhost:8000
```

Production:

```env
VITE_API_URL=https://alumni-mentorship-platform-42au.onrender.com
```

---

## API Documentation

Swagger UI:

https://alumni-mentorship-platform-42au.onrender.com/docs

---

## Highlights

- Built a full-stack application using **FastAPI** and **React**.
- Designed REST APIs with **SQLAlchemy** and **PostgreSQL**.
- Implemented mentor discovery, booking workflows, and discussion forums.
- Containerized the application using **Docker**.
- Deployed a production-ready application using **Render**, **Vercel**, and **Neon**.
- Integrated frontend and backend services with environment-based configuration.



## 📄 License

This project is licensed under the MIT License.
