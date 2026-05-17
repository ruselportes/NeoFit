# Neofit Fitness Gym - Admin Dashboard 🏋️‍♂️

A premium, modern administration dashboard built for **Neofit Fitness Gym**. This web application is designed to help gym owners and staff easily manage members, track attendance, and handle gym operations in a sleek, dark-themed interface.

## 🚀 Features

*   **Analytics Dashboard**: Get a high-level overview of active members, daily check-ins, and revenue.
*   **Member Management**: View, add, and manage member profiles and subscription statuses (Active, Expiring Soon, Expired).
*   **Attendance Tracking**: Monitor live check-ins. Designed to integrate with biometric fingerprint scanners or manual ID entry.
*   **Gym Settings**: Manage public announcements and update gym contact information.

## 💻 Tech Stack

*   **Frontend**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/) + TypeScript
*   **Styling**: Pure Vanilla CSS featuring a custom premium design system (Glassmorphism, CSS Variables, smooth micro-animations).
*   **Typography**: [Outfit](https://fonts.google.com/specimen/Outfit) via Google Fonts.

## 🛠️ Getting Started

Follow these steps to run the dashboard locally on your machine.

### Prerequisites
*   [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Navigate to the project directory:**
   ```bash
   cd neofit-admin
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **View the App:** Open your browser and navigate to `http://localhost:5173/`.

### Running with Docker

If you prefer to run the application using Docker, ensure Docker and Docker Compose are installed on your system.

1. **Build and start the container:**
   ```bash
   docker compose up --build
   ```

2. **View the App:** Open your browser and navigate to `http://localhost:5173/`.
   
*Note: The Docker setup is configured for development with volume mounting. Any code changes you make locally will automatically hot-reload in the container!*

## 🔌 Proposed Hardware Integration (Biometrics)

The *Attendance* module is designed to integrate with an external fingerprint scanner (e.g., the AS608 Optical Fingerprint Sensor). 
Future backend development will support:
*   **IoT Approach**: An ESP32 microcontroller reading the AS608 sensor and sending check-in data directly to the web server via WiFi.
*   **Wired Approach**: The sensor connected to the front-desk PC via a USB-to-TTL adapter, with a local background service communicating with the web dashboard.
