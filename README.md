# 🚢 Maritime Cyber Range — Quiz App

## Project Structure
```
quiz-app/
├── backend/          ← Express + MongoDB API
│   ├── models/       ← User.js, Quiz.js
│   ├── routes/       ← auth.js, quiz.js, scores.js
│   ├── middleware/   ← auth.js (JWT)
│   ├── .env          ← MongoDB URI & secrets
│   ├── server.js     ← Main server
│   └── seed.js       ← Import old questions
└── frontend/         ← React + Vite + Tailwind
    └── src/
        ├── context/  ← AuthContext (global login state)
        ├── pages/    ← Home, Login, SignUp, Quiz, AdminPanel, Navbar
        └── index.css ← Full maritime theme
```

---

## ⚡ Setup — Step by Step

### 1. Backend

```bash
cd backend
npm install
node seed.js        # ← Import the 10 original questions into MongoDB
npm run dev         # ← Starts server on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev         # ← Starts on http://localhost:5173
```

---

## 🔐 Admin Account Kaise Banayein

Signup page pe "Have an admin code?" click karein aur code daalo:

```
ADMIN123
```

Yahi code `.env` file mein `ADMIN_CODE` mein diya hai — aap change kar sakte hain.

---

## ✨ Features

### User Features
- ✅ Signup / Login (JWT auth)
- ✅ Quiz khelein (MongoDB se questions)
- ✅ Score automatically save hota hai profile mein
- ✅ Har quiz ke baad result + percentage dikhta hai

### Admin Features
- ✅ Dashboard: total users, questions, attempts, avg score
- ✅ **Users tab**: sab users ki list, best score, last played, remove button
- ✅ **Quiz tab**: sab questions ki list
  - ➕ Naya question add karein
  - ✏️ Existing question edit karein
  - 🗑️ Question delete karein

---

## 🌐 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/signup | — | Register |
| POST | /api/auth/login | — | Login |
| GET | /api/quiz | User | Get all questions |
| POST | /api/quiz | Admin | Add question |
| PUT | /api/quiz/:id | Admin | Edit question |
| DELETE | /api/quiz/:id | Admin | Delete question |
| POST | /api/scores/submit | User | Save score |
| GET | /api/scores/my | User | My scores |
| GET | /api/scores/all | Admin | All users + scores |
| DELETE | /api/scores/user/:id | Admin | Delete user |

---

## 🎨 UI Theme
- Font: Orbitron (headings) + Inter (body)
- Color: Navy blue ocean theme with cyan glow
- Style: Glassmorphism cards, animated backgrounds
"# Quiz-App-" 
