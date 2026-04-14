# Production Deployment Guide — Boat4You Frontend

This document describes how to deploy the Boat4You frontend application to the production server.

---

## Infrastructure Overview

The application is hosted across four virtual machines. The frontend runs on **VM1**.

| Component       | Details                                           |
| --------------- | ------------------------------------------------- |
| Server user     | `cusma1`                                          |
| App directory   | `/home/cusma1/nextapp`                            |
| App port        | `3001`                                            |
| Reverse proxy   | nginx (`/etc/nginx/conf.d/boat4you.conf`)         |
| systemd service | `nextapp` (`/etc/systemd/system/nextapp.service`) |

---

## Prerequisites

Ensure the following are available on the **build machine** before proceeding:

- **Node.js 24 LTS**
- **Yarn** (package manager)

---

## Step 1 — Create the `.env` File

In the root of the project, create a `.env` file and populate it with the production environment variable values. The required variables are:

```
NEXT_PUBLIC_WORDPRESS_API_URL=
NEXT_PUBLIC_BOAT_WS_GAID=
NEXT_PUBLIC_BOAT_WS_API_URL=
NEXT_PUBLIC_BASE_URL=
NODEMAILER_USERNAME=
NODEMAILER_PASSWORD=
```

> The actual values are provided separately. Do not commit this file to version control.

---

## Step 2 — Install Dependencies and Build

```bash
# Install all dependencies (respects yarn.lock)
yarn install --frozen-lockfile

# Build the application
yarn build
```

This produces a `.next` directory containing the compiled output.

---

## Step 3 — Package the Build Artifacts

Create a compressed archive of all files required to run the application:

```bash
tar -czf deploy.tar.gz \
  .next \
  public \
  src/posts \
  package.json \
  yarn.lock \
  next.config.js \
  next-env.d.ts \
  .env \
  node_modules
```

---

## Step 4 — Transfer the Archive to VM1

Copy the archive to the application directory on VM1

---

## Step 5 — Deploy on VM1

SSH into VM1 and run the following commands:

```bash
cd /home/cusma1/nextapp

# Stop the running service
sudo systemctl stop nextapp

# Remove old build artifacts
rm -rf .next node_modules public

# Extract the new build
tar -xzf deploy.tar.gz

# Remove the archive
rm deploy.tar.gz

# Start the service
sudo systemctl start nextapp
```

---

## Verifying the Deployment

Check that the service started successfully:

```bash
sudo systemctl status nextapp
```

To follow live application logs:

```bash
sudo journalctl -u nextapp -f
```

---

## systemd Service Reference

The service is defined at `/etc/systemd/system/nextapp.service`:

```ini
[Unit]
Description=Boat4you main FE app
After=syslog.target network.target

[Service]
Type=simple
User=cusma1
Group=cusma1
WorkingDirectory=/home/cusma1/nextapp

Environment=NODE_ENV=production
Environment=PORT=3001

ExecStart=/usr/bin/yarn start
Restart=always
RestartSec=5

NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=full

StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

If this file is ever modified, reload the systemd daemon before restarting the service:

```bash
sudo systemctl daemon-reload
sudo systemctl restart nextapp
```
