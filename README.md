# Neofit Fitness Gym - Admin Dashboard 🏋️‍♂️

A premium, modern administration dashboard built for **Neofit Fitness Gym**. This full-stack application is designed to help gym owners and staff easily manage members, track attendance, and handle gym operations in a sleek, dark-themed interface.

## 🚀 Features

*   **Analytics Dashboard**: Get a high-level overview of active members, daily check-ins, and revenue.
*   **Member Management**: View, add, and manage member profiles and subscription statuses (Active, Expiring Soon, Expired).
*   **Attendance Tracking**: Monitor live check-ins. Designed to integrate with biometric fingerprint scanners or manual ID entry.
*   **Gym Settings**: Manage public announcements and update gym contact information.

## 💻 Tech Stack

*   **Frontend**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/) + TypeScript
*   **Backend**: [Laravel](https://laravel.com/) (PHP)
*   **Database**: MySQL
*   **Reverse Proxy**: Nginx
*   **Containerization**: Docker + Docker Compose
*   **Styling**: Pure Vanilla CSS featuring a custom premium design system (Glassmorphism, CSS Variables, smooth micro-animations).
*   **Typography**: [Outfit](https://fonts.google.com/specimen/Outfit) via Google Fonts.

## 🛠️ Getting Started

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

3. **Access the Application:**
   *   Open your browser and navigate to **`http://localhost:8080`**.
   *   Nginx will automatically handle routing your frontend requests and API calls (to `/api`).

### Database Access
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
