# Expense Tracker

A modern, personal expense tracking web application built with React, TypeScript, Node.js, Express, and MongoDB Atlas. Track daily spending in Zambian Kwacha (ZMW) with a beautiful, mobile-first dashboard.

## Features

- **Single-password authentication** with JWT
- **Dashboard** with summary cards (Today, This Week, This Month, All Time)
- **Charts** — monthly trend (line), categories (pie), weekly spending (bar)
- **Expense CRUD** with search, filters, sorting, and pagination
- **Dynamic Theme Engine** — 15 premium themes with auto-rotation (60s default), smooth color interpolation, and manual selection
- **Design system** powered by CSS variables — all colors derive from theme tokens, never hardcoded
- **Premium animated background** — particle network, floating shapes, mesh gradients, waves, glassmorphism, finance icons
- **Framer Motion micro-interactions** — animated counters, hover lift, magnetic buttons, page transitions, scroll reveals
- **Mobile-first** responsive design (320px+)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite |
| Styling | Tailwind CSS v4, CSS Variables |
| State | Zustand |
| Charts | Recharts |
| Icons | Lucide React |
| Backend | Node.js, Express 5 |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT + bcrypt |

## Project Structure

```
Expense_Tracker/
├── client/          # React frontend
│   └── src/
│       ├── components/   # Shared UI & layout
│       ├── features/     # Auth, Dashboard, Expenses
│       ├── hooks/        # Custom React hooks
│       ├── lib/          # API, utilities, constants
│       └── store/        # Zustand stores
├── server/          # Express backend
│   └── src/
│       ├── controllers/
│       ├── models/
│       ├── routes/
│       ├── middleware/
│       └── utils/
└── README.md
```

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB Atlas](https://www.mongodb.com/atlas) account with a cluster

## Setup

### 1. MongoDB Atlas

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a database user with read/write access
3. Whitelist your IP address (or `0.0.0.0/0` for development)
4. Copy your connection string

### 2. Backend

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/expense_tracker?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this
ADMIN_PASSWORD=your-secure-password
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

```bash
npm install
npm run dev
```

The server starts on `http://localhost:5000`. On first launch, an admin account is created using `ADMIN_PASSWORD`.

### 3. Frontend

```bash
cd client
npm install
npm run dev
```

The app opens at `http://localhost:5173`.

### 4. Login

Navigate to the login page and enter the password you set in `ADMIN_PASSWORD`.

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login with password |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/verify` | Verify JWT token |

### Expenses

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/expenses` | List expenses (with filters) |
| GET | `/api/expenses/stats` | Dashboard statistics |
| POST | `/api/expenses` | Create expense |
| PUT | `/api/expenses/:id` | Update expense |
| DELETE | `/api/expenses/:id` | Delete expense |

## Expense Categories

Food, Transport, Airtime, Internet, Utilities, Shopping, Entertainment, Health, Education, Other

## Currency

All amounts are displayed in Zambian Kwacha (ZMW), formatted as `K150.00`.

## Production Build

```bash
# Backend
cd server
npm run build
npm start

# Frontend
cd client
npm run build
npm run preview
```

Set `NODE_ENV=production` and use a strong `JWT_SECRET` and `ADMIN_PASSWORD` in production.

## Dynamic Theme Engine

The app includes 15 premium themes (Ocean Blue, Royal Purple, Emerald, Sunset Orange, Crimson, Cyberpunk, Sapphire, Gold, Teal, Lavender, Arctic Frost, Rose Quartz, Midnight Jade, Volcanic, Aurora).

- **Auto rotation** cycles themes every 60 seconds by default
- **Theme settings** (palette icon in header) — toggle auto-rotation, adjust speed (30s–5min), manually pick a theme, or return to auto mode
- **Smooth transitions** — colors interpolate over ~1.4s with no flashing
- **Reactive background** — particles, blobs, and glow effects adapt to the active theme

### Adding or Editing Themes

Themes are defined in `client/src/lib/themes.ts`. Each theme provides RGB tokens for `--primary`, `--accent`, `--glow-color`, `--particle-color`, `--blob-*`, and more. Components never hardcode colors — they use `rgb(var(--token))` throughout.

## License

Personal use project.
