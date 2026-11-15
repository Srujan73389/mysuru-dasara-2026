# MYSURU DASARA 2026
## ಮೈಸೂರು ದಸರಾ ೨೦೨೬
### Digital Heritage & Immersive Festival Platform

A production-quality, full-stack web application transforming the Mysuru Dasara festival into an immersive digital experience.

---

## 🏛️ Features

- **17 Interactive Pages** — Palace, Jamboo Savari, Cultural Museum, Events, Map, and more
- **3D Environments** — WebGL-powered Mysore Palace, Chamundi Hills, Bannimantap
- **AI Guide "Kiran"** — Multilingual conversational guide (Kannada + English) powered by Gemini
- **Smart Festival Planner** — Personalised itinerary generator
- **Interactive Map** — Leaflet-based festival venue & landmark map
- **Heritage Passport** — Gamified achievement and quiz system
- **Photo Studio** — Canvas-based festival photo composer
- **PWA** — Installable with offline support

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 8, TypeScript |
| 3D | Three.js 0.187, React Three Fiber, Drei |
| Styling | Tailwind CSS 4, Framer Motion |
| State | Zustand 5, React Query 5 |
| Backend | Django 6, Django REST Framework |
| Database | SQLite (dev) / PostgreSQL (prod) |
| AI | Google Gemini API (backend-proxied) |
| Maps | Leaflet.js |

---

## 🚀 Quick Start

### Prerequisites
- Node.js >= 20
- Python >= 3.11
- npm >= 9

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
Frontend runs at: http://localhost:5173

### Backend Setup
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

python manage.py migrate
python manage.py seed_data
python manage.py createsuperuser
python manage.py runserver
```
Backend runs at: http://localhost:8000
Admin panel: http://localhost:8000/admin/

---

## 📁 Project Structure

```
mysuru-dasara-2026/
  frontend/          # React + Vite frontend
  backend/           # Django backend
  docs/              # Documentation
  scripts/           # Utility scripts
  .env.example       # Environment variables template
  README.md
```

---

## 🔑 Environment Variables

### Backend (`backend/.env`)
```
DJANGO_SECRET_KEY=your-secret-key
DEBUG=True
GEMINI_API_KEY=your-gemini-api-key
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

### Frontend (`frontend/.env`)
```
VITE_API_BASE_URL=http://localhost:8000
```

> ⚠️ **Never expose GEMINI_API_KEY on the frontend.** All AI calls go through the Django backend.

---

## 📄 Pages

| Route | Page |
|-------|------|
| `/` | Home / Landing |
| `/explore` | 3D Digital Mysuru City |
| `/palace` | Virtual Mysore Palace |
| `/chamundi` | Chamundi Hills Experience |
| `/jamboo-savari` | Jamboo Savari Simulator |
| `/torchlight-parade` | Torchlight Parade & Drone Show |
| `/cultural-museum` | Karnataka Cultural Museum |
| `/events` | Event Discovery |
| `/planner` | Smart Festival Planner |
| `/map` | Interactive Map |
| `/ai-guide` | AI Guide — Kiran |
| `/food-exhibition` | Food & Exhibition |
| `/visitor-services` | Visitor Services Dashboard |
| `/heritage-passport` | Heritage Passport & Quiz |
| `/gallery` | Photo Studio |
| `/profile` | User Profile |
| `/admin` | Admin Dashboard |

---

## 🎨 Design System

**Colors:**
- Royal Purple: `#4A1259`
- Gold: `#D4A017`
- Midnight Blue: `#0A0F2C`
- Cream: `#FFF8E7`

---

## ⚠️ Disclaimer

This is an independent digital heritage platform created for educational and cultural purposes.
This is NOT an official Government of Karnataka or Mysuru Dasara Committee website.
Event schedules, timings and venue details should be verified with official sources.
AI responses are generated and may not reflect official positions.

---

## 📜 License

MIT License — Educational and cultural use.
