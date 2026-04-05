# 🚦 STAMS – Smart Traffic Analysis & Management System

A full-stack MERN project frontend — a modern, dark-themed traffic authority web platform.

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.jsx          ← Sticky nav with role-aware links & user avatar
│   ├── PageWrapper.jsx     ← Layout wrapper for all protected pages
│   └── StatCard.jsx        ← Reusable animated KPI card
│
├── pages/
│   ├── Login.jsx           ← Role-based login with demo quick-fill
│   ├── Dashboard.jsx       ← Admin/Officer command center with charts
│   ├── ViolationEntry.jsx  ← Form to record violations + searchable table
│   ├── Analytics.jsx       ← Multi-chart analytics dashboard
│   ├── CitizenPortal.jsx   ← Vehicle lookup + fine payment
│   └── AdminPanel.jsx      ← Officer management, zones, settings
│
├── services/
│   └── api.js              ← Axios instance + all API endpoint functions
│
├── utils/
│   ├── AuthContext.jsx     ← React Context for auth state + ProtectedRoute
│   └── mockData.js         ← Demo data for all pages (replace with API)
│
├── App.js                  ← Router + route guards
└── index.js                ← React entry point
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 16
- npm or yarn

### Installation

```bash
# 1. Navigate into the project
cd smart-traffic-analysis-system

# 2. Install dependencies
npm install

# 3. Start development server
npm start
```

App will run at **http://localhost:3000**

---

## 🔑 Demo Login Credentials

| Role    | Email                  | Password    |
|---------|------------------------|-------------|
| Admin   | admin@traffic.gov      | admin123    |
| Officer | officer@traffic.gov    | officer123  |
| Citizen | citizen@traffic.gov    | citizen123  |

> Use the **Quick Demo Access** buttons on the login page to auto-fill credentials.

---

## 🗺️ Page Routes

| Route         | Access         | Description                        |
|---------------|----------------|------------------------------------|
| `/login`      | Public         | Role-based login                   |
| `/dashboard`  | Admin, Officer | Stats + charts command center      |
| `/violations` | Admin, Officer | Enter & manage violations          |
| `/analytics`  | Admin, Officer | Congestion, frequency, zone charts |
| `/citizen`    | All roles      | Vehicle lookup + fine payment      |
| `/admin`      | Admin only     | Officers, zones, system settings   |

---

## 🔌 Connecting to Your Node.js Backend

### 1. Set your API URL

Create a `.env` file in the project root:
```
REACT_APP_API_URL=http://localhost:5000/api
```

### 2. Replace mock data with API calls

In each page, look for the commented-out API calls:
```js
// --- Real API call ---
// const res = await violationsAPI.create(form);
```
Uncomment these lines and remove the mock `setTimeout` blocks below them.

### 3. Expected API Endpoints

```
POST   /api/auth/login                    → { user, token }
GET    /api/violations                    → [ ...violations ]
POST   /api/violations                    → created violation
GET    /api/violations/vehicle/:plate     → vehicle violations
GET    /api/analytics/dashboard           → stats object
GET    /api/analytics/daily               → daily data array
GET    /api/analytics/monthly             → monthly data array
GET    /api/analytics/congestion          → congestion array
GET    /api/analytics/accident-zones      → zones array
GET    /api/citizen/lookup/:vehicleNumber → { owner, violations }
POST   /api/citizen/pay/:violationId      → payment confirmation
```

---

## 📦 Dependencies

| Package            | Purpose                            |
|--------------------|------------------------------------|
| react-router-dom   | Client-side routing                |
| axios              | HTTP API client                    |
| chart.js           | Chart rendering engine             |
| react-chartjs-2    | Chart.js React wrapper             |
| bootstrap          | Responsive CSS framework           |
| bootstrap-icons    | Icon library                       |

---

## 🎨 Design System

- **Color scheme**: Dark (`#0d1117` base), amber/gold accent (`#f59e0b`)
- **Typography**: System UI stack + Georgia serif for headings
- **Charts**: Bar, Line, Doughnut, Radar via Chart.js
- **Responsive**: Bootstrap 5 grid — works on mobile, tablet, desktop

---

## 🏗️ Backend (MERN) — What to Build Next

```
server/
├── models/
│   ├── User.js
│   ├── Violation.js
│   └── Vehicle.js
├── routes/
│   ├── auth.js
│   ├── violations.js
│   ├── analytics.js
│   └── citizen.js
├── middleware/
│   └── authMiddleware.js   ← JWT verification
└── server.js               ← Express + MongoDB connection
```

---

## ✅ Features Checklist

- [x] Role-based login (Admin / Officer / Citizen)
- [x] Protected routes with redirect
- [x] Admin dashboard with 6 KPI cards
- [x] Bar, Line, Doughnut charts (Chart.js)
- [x] Violation entry form with auto-fine lookup
- [x] Searchable violations table
- [x] Analytics: congestion, frequency, radar, trend
- [x] Accident-prone zone risk scores
- [x] Citizen portal: vehicle search + pay fines
- [x] Admin panel: officers, zones, toggleable settings
- [x] Responsive layout (mobile → desktop)
- [x] Axios service file with all API endpoints
- [x] JWT token handling (interceptors)

---
