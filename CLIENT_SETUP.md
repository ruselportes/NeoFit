# NeoFit Admin Dashboard - Client Setup Guide

## One-Time Setup (5 minutes)

### Step 1: Install Docker Desktop
1. Go to **https://www.docker.com/products/docker-desktop/**
2. Click **"Download for Windows"**
3. Run the installer and follow the prompts (Next → Next → Finish)
4. **Restart your computer** after installation

### Step 2: Configure Docker to Start Automatically
1. Open **Docker Desktop** once after restart
2. Click the **⚙ Settings** gear icon (top-right)
3. Under **General**, enable **"Start Docker Desktop when you sign in to Windows"**
4. Click **Apply & Restart**

> This ensures Docker runs in the background every time you turn on your laptop.

### Step 3: Create the Desktop Shortcut
1. Open the `neofit-admin` folder
2. Right-click **`CREATE_SHORTCUT.ps1`** → **"Run with PowerShell"**
3. A **"NeoFit Dashboard"** icon will appear on your Desktop!

---

## Daily Use

### Starting NeoFit
1. **Double-click the "NeoFit Dashboard" icon** on your Desktop
2. Wait ~30 seconds (first time may take 1-2 minutes)
3. Your browser will open automatically

### Stopping NeoFit
1. Double-click **`STOP.bat`** in the neofit-admin folder

---

## Login Credentials

| Role  | Email               | Password   |
|-------|---------------------|------------|
| Admin | admin@neofit.com    | password   |
| Staff | staff@neofit.com    | password   |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Docker is not installed" | Install Docker Desktop (Step 1 above) |
| Script says "Still waiting..." | Docker is starting up — just wait |
| Page won't load | Wait 30 seconds, then refresh your browser |
| Everything is slow on first run | Normal! Docker downloads images the first time (~2-5 min) |
