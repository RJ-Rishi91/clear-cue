# ClearCue Deployment Guide: GitHub Pages + Render + MongoDB Atlas

This guide walks you through deploying **ClearCue** to production with:
- **Frontend:** Hosted on **GitHub Pages** (Static SPA)
- **Backend:** Hosted on **Render** (Node.js/Express Web Service)
- **Database:** Hosted on **MongoDB Atlas** (Free M0 Cluster)
- **Cost:** **$0.00 / Free Tier** across all services (with built-in local heuristic AI engines requiring no paid tools)

---

## Architecture Overview

```
                      +---------------------------------------+
                      |             USER BROWSER              |
                      +---------------------------------------+
                                     |         |
                     Static Assets   |         | REST / JWT API
                  (HTML, CSS, JS)    |         | (with CORS enabled)
                                     v         v
+---------------------------------------+   +---------------------------------------+
|             GITHUB PAGES              |   |            RENDER BACKEND             |
|   https://<username>.github.io/<repo> |   |   https://<service-name>.onrender.com |
+---------------------------------------+   +---------------------------------------+
                                                               |
                                            Mongoose (TLS)    | Automatic Fallback
                                            Connection String | to Local SQLite Store
                                                               v
                                            +---------------------------------------+
                                            |          MONGODB ATLAS CLOUD          |
                                            |       mongodb+srv://.../clearcue      |
                                            +---------------------------------------+
```

---

## Step 1: Set up MongoDB Atlas (Database)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas) and sign in or create a free account.
2. Click **Create a Deployment** and select the **M0 Free Cluster** (Shared).
3. Under **Security Quickstart**:
   - **Database Access:** Create a database user (e.g. username `clearcue_admin`, create a strong password).
   - **Network Access:** Add IP Address `0.0.0.0/0` (Allow Access from Anywhere) so Render's cloud servers can connect to your cluster.
4. Click **Connect** -> **Drivers** (Node.js).
5. Copy your connection string. It will look like:
   ```
   mongodb+srv://clearcue_admin:<password>@cluster0.abcde.mongodb.net/clearcue?retryWrites=true&w=majority
   ```
   *(Replace `<password>` with your database user password, and set database name to `clearcue`)*.

---

## Step 2: Deploy Backend to Render

1. Go to [Render.com](https://render.com) and sign in.
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository containing the ClearCue code.
4. Configure the Web Service settings:
   - **Name:** `clearcue-backend` (or your chosen name)
   - **Region:** Any close to you (e.g., Oregon, Frankfurt, Singapore)
   - **Branch:** `main` (or `master`)
   - **Root Directory:** *(leave blank)*
   - **Runtime:** `Node`
   - **Build Command:**
     ```bash
     npm install && npm run build
     ```
   - **Start Command:**
     ```bash
     npm start
     ```
   - **Instance Type:** `Free`
5. Under **Environment Variables**, add:
   | Key | Value | Description |
   | :--- | :--- | :--- |
   | `NODE_ENV` | `production` | Production mode |
   | `MONGODB_URI` | *Your Atlas connection string from Step 1* | MongoDB Atlas Cloud URI |
   | `JWT_SECRET` | *A secure random string (e.g., generate with `openssl rand -hex 32`)* | Used for JWT signing |
   | `GEMINI_API_KEY` | *(Optional)* | Optional free tier key. Local AI engine works at $0 without it! |
6. Click **Deploy Web Service**.
7. Once deployed, Render will provide a public URL:
   ```
   https://clearcue-backend.onrender.com
   ```
   Verify it by visiting `https://clearcue-backend.onrender.com/api/status` in your browser. You will see:
   ```json
   {
     "status": "online",
     "service": "ClearCue Backend",
     "database": "MongoDB Atlas",
     "mongoConnected": true
   }
   ```

---

## Step 3: Deploy Frontend to GitHub Pages

1. Push your project to your GitHub repository.
2. In your GitHub repository:
   - Go to **Settings** -> **Secrets and variables** -> **Actions**.
   - Click **New repository secret**.
   - Name: `VITE_API_URL`
   - Secret Value: *Your Render backend URL from Step 2*, e.g.:
     ```
     https://clearcue-backend.onrender.com
     ```
3. Enable GitHub Pages:
   - Go to **Settings** -> **Pages**.
   - Under **Build and deployment** -> **Source**, select **GitHub Actions**.
4. The included workflow `.github/workflows/deploy-pages.yml` will automatically build the client SPA with your `VITE_API_URL` and deploy it to GitHub Pages.
5. Your frontend will be live at:
   ```
   https://<your-username>.github.io/<repo-name>/
   ```

---

## Step 4: Verify the Live System

1. Visit your GitHub Pages URL in your browser.
2. Click **Sign Up** in the navigation bar.
3. Fill in your details (e.g. Name: `Sarah Jenkins`, Role: `Insurance Operations Specialist`).
4. Note that the modal shows `Database Engine: MongoDB Atlas Cloud` with a pulsing green indicator.
5. Click **Complete Registration**:
   - The user account is saved to MongoDB Atlas.
   - A JWT Bearer token is issued and stored in your browser session.
   - Your avatar badge appears in the top navigation bar.
6. Test a message check or AI Mock Call — your scores and session histories will persist directly to MongoDB Atlas!
7. Click the user badge -> **Log Out** to confirm session termination.

---

## Local Development vs. Production Summary

| Feature | Local Development | Production |
| :--- | :--- | :--- |
| **Frontend URL** | `http://localhost:3000` | `https://<user>.github.io/<repo>/` |
| **Backend URL** | `http://localhost:3000/api` | `https://<service>.onrender.com/api` |
| **Database** | SQLite fallback (`data/clearcue.db`) or local Mongo | MongoDB Atlas Cloud (`MONGODB_URI`) |
| **Authentication** | JWT (`clearcue_auth_token` in localStorage) | JWT (`clearcue_auth_token` in localStorage) |
| **CORS** | Configured for `*` with credentials | Configured for `*` with credentials |
| **Cost** | **$0.00** | **$0.00 (All Free Tiers)** |
