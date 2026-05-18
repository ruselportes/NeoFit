# Neofit Fitness Gym - Admin Dashboard 🏋️‍♂️

A premium, modern administration dashboard built for **Neofit Fitness Gym**. This full-stack application is designed to help gym owners and staff easily manage members, track attendance, and handle gym operations in a sleek, customizable interface with support for both dark and light modes.

## 🚀 Features

*   **Secure Admin Login**: Protected routes using Laravel Sanctum with token-based authentication and a show/hide password toggle.
*   **Analytics Dashboard**: Get a high-level overview of active members, daily check-ins, and revenue.
*   **Member Management**: View, add, and manage member profiles and subscription statuses with support for specific gym rates.
*   **Attendance Tracking**: Monitor live check-ins. Designed to integrate with biometric fingerprint scanners or manual ID entry.
*   **Gym Rates**: A dedicated view to check current pricing for memberships and walk-ins based on categories.
*   **Gym Settings**: Manage public announcements and update gym contact information (admin only).
*   **Theme Toggle**: Easily switch between **Dark Mode** and **Light Mode** at the click of a button!
*   **One-Click Launch**: Desktop shortcut with custom icon — just double-click to start the entire system.

## 💻 Tech Stack

*   **Frontend**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/) + TypeScript
*   **Backend**: [Laravel](https://laravel.com/) (PHP) + Sanctum
*   **Database**: MySQL
*   **Reverse Proxy**: Nginx
*   **Containerization**: Docker + Docker Compose
*   **Styling**: Pure Vanilla CSS featuring a custom premium design system (Glassmorphism, CSS Variables, smooth micro-animations).
*   **Typography**: [Outfit](https://fonts.google.com/specimen/Outfit) via Google Fonts.

## 📁 Project Structure

```
neofit-admin/
├── backend/               # Laravel API (PHP)
├── nginx/                 # Nginx reverse proxy config
├── public/                # Static assets (favicon, icons)
├── src/
│   ├── assets/            # Images and SVGs
│   ├── views/             # React view components
│   │   ├── LoginView.tsx
│   │   ├── DashboardView.tsx
│   │   ├── MembersView.tsx
│   │   ├── AttendanceView.tsx
│   │   ├── RatesView.tsx
│   │   └── SettingsView.tsx
│   ├── App.tsx            # Main app with routing and sidebar
│   ├── api.ts             # API request helpers
│   ├── types.ts           # TypeScript type definitions
│   ├── index.css          # Design system and global styles
│   └── main.tsx           # React entry point
├── docker-compose.yml     # Full-stack container orchestration
├── Dockerfile             # Frontend container config
├── START.bat              # One-click launcher (Windows)
├── STOP.bat               # One-click shutdown (Windows)
├── CREATE_SHORTCUT.ps1    # Desktop shortcut installer
├── CLIENT_SETUP.md        # End-user setup guide
├── neofit.ico             # Custom desktop shortcut icon
└── README.md
```

## 🛠️ Getting Started (Developer)

The easiest way to run the entire stack is using Docker.

### Prerequisites
*   [Docker](https://www.docker.com/) and Docker Compose installed on your machine.

### Running with Docker

1. **Navigate to the project directory:**
   ```bash
   cd neofit-admin
   ```

2. **Build and start the containers:**
   ```bash
   docker compose up -d --build
   ```
   This command will start 4 containers:
   *   **neofit-nginx**: Reverse proxy listening on `http://localhost:8080`.
   *   **neofit-dashboard**: React frontend development server.
   *   **neofit-api**: Laravel backend API.
   *   **neofit-db**: MySQL database.

3. **Initialize the Database:**
   Since we use an entrypoint script, migrations run automatically. However, to seed the database and create the admin user, run:
   ```bash
   docker compose exec api php artisan migrate:fresh --seed
   ```
   *(If the container is stopped due to initial setup errors, use `docker compose run --rm --entrypoint /bin/sh api -c "php artisan migrate:fresh --seed"` instead).*

4. **Access the Application:**
   *   Open your browser and navigate to **`http://localhost:8080`**.
   *   Log in with the default credentials:
       *   **Email**: `admin@neofit.com`
       *   **Password**: `password`

## 🖥️ Client Deployment (Non-Technical Users)

For deploying to the gym's front-desk PC, we provide a simple one-click workflow. See **[CLIENT_SETUP.md](CLIENT_SETUP.md)** for the full guide.

### Quick Overview

| File | Purpose |
|------|---------|
| `START.bat` | Launches Docker, builds containers, seeds the DB, and opens the browser — all in one double-click. |
| `STOP.bat` | Shuts down all running NeoFit containers. |
| `CREATE_SHORTCUT.ps1` | Creates a **"NeoFit Dashboard"** shortcut on the Desktop with a custom icon. |
| `neofit.ico` | Custom NeoFit logo icon for the desktop shortcut. |
| `CLIENT_SETUP.md` | Step-by-step setup guide written for non-technical users. |

### Default Login Credentials

| Role  | Email               | Password   |
|-------|---------------------|------------|
| Admin | admin@neofit.com    | password   |
| Staff | staff@neofit.com    | password   |

## 🗄️ Database Access

The MySQL database is exposed on port `3307` on your host machine to avoid conflicts with any local MySQL installations.
*   **Host**: `localhost`
*   **Port**: `3307`
*   **Database**: `neofit`
*   **Username**: `neofit`
*   **Password**: `neofit`

## 🔌 Proposed Hardware Integration (Biometrics)

The *Attendance* module is designed to integrate with an external fingerprint scanner (e.g., the AS608 Optical Fingerprint Sensor). 
Future backend development will support:
*   **IoT Approach**: An ESP32 microcontroller reading the AS608 sensor and sending check-in data directly to the web server via WiFi.
*   **Wired Approach**: The sensor connected to the front-desk PC via a USB-to-TTL adapter, with a local background service communicating with the web dashboard.
