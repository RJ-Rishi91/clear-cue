# ClearCue — Deployment & Server Requirements Guide

> **Frontend:** GitHub Pages (Static SPA)  
> **Backend:** Render (Node.js Web Service)  
> **Database:** MongoDB Atlas (Free M0 Cluster)  
> **Total Cost:** $0.00 / Free Tier

---

## Architecture Diagram

```
                        ┌───────────────────────────────┐
                        │         USER BROWSER          │
                        └──────────┬────────┬───────────┘
                     Static Assets │        │ REST API + JWT
                     (HTML/CSS/JS) │        │ (CORS enabled)
                                   ▼        ▼
    ┌──────────────────────────┐  ┌──────────────────────────────┐
    │      GITHUB PAGES        │  │       RENDER BACKEND          │
    │ rj-rishi91.github.io/    │  │ clearcue-backend.onrender.com │
    │ clear-cue/               │  │                                │
    │ • index.html (SPA)       │  │ • Node.js 22 Express Server    │
    │ • assets/ (JS + CSS)     │  │ • Local NLP Heuristic Engine   │
    └──────────────────────────┘  │ • JWT Auth + bcrypt             │
                                   │ • Optional Gemini Free Tier     │
                                   └──────────────┬─────────────────┘
                                                   │
                                    Mongoose TLS   │  SQLite Fallback
                                                   ▼
                                   ┌──────────────────────────────┐
                                   │      MONGODB ATLAS CLOUD     │
                                   │  mongodb+srv://.../clearcue  │
                                   │  Free M0 Shared Cluster      │
                                   └──────────────────────────────┘
```

---

## Server Requirements

### Minimum Hardware (Render Free Tier)

| Resource        | Requirement                    |
| :-------------- | :----------------------------- |
| **CPU**         | Shared (Free tier)             |
| **RAM**         | 512 MB minimum                 |
| **Disk**        | Ephemeral (no persistent disk) |
| **Network**     | HTTPS with auto-TLS            |

### Runtime Requirements

| Requirement      | Value                         |
| :--------------- | :---------------------------- |
| **Node.js**      | v18+ (v22 recommended)        |
| **npm**          | v9+                           |
| **Build Command**| `npm install && npm run build` |
| **Start Command**| `npm start` (`node dist/server.cjs`) |
| **Port**         | `PORT` env var (default 3000, Render auto-assigns 10000) |
| **Health Check** | `GET /api/status` returns HTTP 200 |

### Environment Variables

| Variable         | Required | Description                                                   |
| :--------------- | :------: | :------------------------------------------------------------ |
| `NODE_ENV`       | ✅       | Set to `production` on Render                                 |
| `MONGODB_URI`    | ❌       | MongoDB Atlas connection string. If omitted, SQLite fallback  |
| `JWT_SECRET`     | ✅       | Signing key for JWT tokens. Render can auto-generate this     |
| `GEMINI_API_KEY` | ❌       | Optional. Google Gemini API key for enhanced AI. Local NLP engine works without it |
| `PORT`           | ❌       | Render sets this automatically. Default 3000 for local dev    |

### Database Options

| Mode               | Trigger                     | Storage                                 |
| :----------------- | :-------------------------- | :-------------------------------------- |
| **MongoDB Atlas**  | `MONGODB_URI` is set        | Cloud-hosted, persistent, scalable      |
| **SQLite Fallback**| `MONGODB_URI` is NOT set    | Local file `data/clearcue.db` (ephemeral on Render) |

> ⚠️ **Important:** On Render Free tier, the filesystem is ephemeral — SQLite data resets on each redeploy. For persistent production data, always use MongoDB Atlas.

---

## Step-by-Step Deployment

### Step 1: MongoDB Atlas Setup (Free)

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) → Sign in / Create free account.
2. **Create Deployment** → Select **M0 Free** (Shared) cluster.
3. **Security Setup:**
   - **Database Access:** Create user (e.g. `clearcue_admin` with a strong password).
   - **Network Access:** Add `0.0.0.0/0` (Allow from Anywhere) so Render can connect.
4. Click **Connect** → **Drivers (Node.js)** → Copy connection string:
   ```
   mongodb+srv://clearcue_admin:<password>@cluster0.xxxxx.mongodb.net/clearcue?retryWrites=true&w=majority
   ```
   Replace `<password>` with your DB user password.

---

### Step 2: Deploy Backend to Render

#### Option A: Blueprint (Recommended — One-Click)

1. Go to [render.com](https://render.com) → Sign in.
2. Click **New +** → **Blueprint**.
3. Connect your GitHub repository `RJ-Rishi91/clear-cue`.
4. Render detects `render.yaml` and auto-configures the service.
5. Fill in the prompted secret values:
   - `MONGODB_URI` → Your Atlas connection string from Step 1
   - `GEMINI_API_KEY` → (Optional) Your Google AI Studio API key
6. Click **Apply** → Render builds and deploys automatically.

#### Option B: Manual Web Service

1. Go to [render.com](https://render.com) → **New +** → **Web Service**.
2. Connect GitHub repo: `RJ-Rishi91/clear-cue`.
3. Configure:

   | Setting          | Value                          |
   | :--------------- | :----------------------------- |
   | **Name**         | `clearcue-backend`             |
   | **Region**       | Oregon (or nearest)            |
   | **Branch**       | `master`                       |
   | **Runtime**      | Node                           |
   | **Build Command**| `npm install && npm run build` |
   | **Start Command**| `npm start`                    |
   | **Instance Type**| Free                           |

4. **Environment Variables** → Add:

   | Key              | Value                                              |
   | :--------------- | :------------------------------------------------- |
   | `NODE_ENV`       | `production`                                       |
   | `NODE_VERSION`   | `22`                                               |
   | `MONGODB_URI`    | `mongodb+srv://clearcue_admin:...` (from Step 1)   |
   | `JWT_SECRET`     | Click **Generate** (or run `openssl rand -hex 32`) |
   | `GEMINI_API_KEY` | *(Optional)* Your Google AI Studio key             |

5. Click **Deploy Web Service**.
6. **Verify:** Visit `https://clearcue-backend.onrender.com/api/status`:
   ```json
   {
     "status": "online",
     "service": "ClearCue Backend",
     "database": "MongoDB Atlas",
     "mongoConnected": true,
     "environment": "production"
   }
   ```

> 💡 **Render Free Tier:** Services spin down after 15 min of inactivity and cold-start on next request (~30-50s). Upgrade to Starter ($7/mo) for always-on.

---

### Step 3: Deploy Frontend to GitHub Pages

1. **Custom Domain (`clear-cue-onerishi.in`):**
   - The repository includes [`CNAME`](file:///home/rushal/Desktop/Clear%20Cue/CNAME) and [`public/CNAME`](file:///home/rushal/Desktop/Clear%20Cue/public/CNAME) configured for:
     ```
     clear-cue-onerishi.in
     ```
   - In your DNS provider (e.g. Cloudflare / GoDaddy / Namecheap):
     - Add a **CNAME** record:
       - **Host / Name:** `@` or `clear-cue` (depending on subdomain vs root)
       - **Target / Value:** `rj-rishi91.github.io`
   - In your GitHub repo **Settings** → **Pages**:
     - **Source:** Select **GitHub Actions**
     - **Custom domain:** `clear-cue-onerishi.in` (Check **Enforce HTTPS**)

2. **Configure Render Backend URL:**
   - **Option A (GitHub Actions Secret):**
     - In GitHub repo **Settings** → **Secrets and variables** → **Actions**:
     - Click **New repository secret**
     - **Name:** `VITE_API_URL`
     - **Value:** Your Render backend URL, e.g. `https://clearcue-backend.onrender.com`
   - **Option B (Zero-Rebuild In-App Config):**
     - Open the live frontend on `clear-cue-onerishi.in`
     - Click your profile / avatar → **Account Settings** → **Cloud Deployment Architecture**
     - Click **Change Render URL**, enter your Render backend address, and click **Connect**!
     - It connects immediately and saves to `localStorage` without rebuilding!

3. **Push to deploy:**
   - Pushing to `master` automatically triggers `.github/workflows/deploy-pages.yml`
   - The site builds and publishes with full SPA 404 routing support to `https://clear-cue-onerishi.in/`!

---

## Scalability Notes

### Current Architecture (Free Tier)

```
  1 Render Instance (512 MB) ──→ 1 MongoDB Atlas M0 (512 MB Storage, Shared)
```

- Supports **~50-100 concurrent users** comfortably.
- Local NLP engine runs in-process (zero external API calls for scoring).
- JWT auth is stateless — no session store needed.

### Scaling Up (When Needed)

| Bottleneck        | Solution                                                     | Cost        |
| :---------------- | :----------------------------------------------------------- | :---------- |
| **Cold starts**   | Render Starter plan (always-on)                              | $7/mo       |
| **More users**    | Render Standard plan (1 GB RAM, dedicated CPU)               | $25/mo      |
| **Database size** | MongoDB Atlas M2/M5 (2-5 GB storage, dedicated)              | $9-25/mo    |
| **Horizontal**    | Render auto-scaling (multiple instances + load balancer)      | $25+/mo     |
| **AI quality**    | Add `GEMINI_API_KEY` for enhanced Gemini-powered evaluations  | Free tier   |

### Production Hardening Checklist

- [ ] Set `MONGODB_URI` to Atlas (don't rely on SQLite in production)
- [ ] Generate a strong `JWT_SECRET` (min 32 characters)
- [ ] Enable Render health checks (`/api/status`)
- [ ] Configure Atlas IP whitelist (or keep `0.0.0.0/0` for Render)
- [ ] Add custom domain (optional) in both Render and GitHub Pages settings
- [ ] Enable Render auto-deploy on push
- [ ] Monitor via Render dashboard metrics

---

## Local Development

```bash
# Clone
git clone https://github.com/RJ-Rishi91/clear-cue.git
cd clear-cue

# Install
npm install

# (Optional) Configure .env
cp .env.example .env
# Edit .env with your MONGODB_URI, JWT_SECRET, GEMINI_API_KEY

# Run (works with zero config — uses SQLite + local NLP)
npm run dev

# Open http://localhost:3000
```

---

## Build & Test Commands

| Command             | Description                                        |
| :------------------ | :------------------------------------------------- |
| `npm run dev`       | Start development server with Vite HMR             |
| `npm run build`     | Build frontend (Vite) + backend (esbuild) for prod |
| `npm start`         | Run production server from `dist/server.cjs`       |
| `npm run lint`      | TypeScript type-check (`tsc --noEmit`)             |
| `npm run clean`     | Remove `dist/` build artifacts                     |

---

## File Structure

```
clear-cue/
├── .github/workflows/
│   └── deploy-pages.yml      # GitHub Pages CI/CD (auto-deploys on push)
├── data/
│   └── clearcue.db            # SQLite fallback DB (gitignored, auto-created)
├── dist/                      # Production build output (gitignored)
├── src/                       # React 19 frontend source
│   ├── components/            # All UI views (Message Checker, Mock Call, etc.)
│   ├── utils/api.ts           # API client with JWT auth headers
│   ├── App.tsx                # Root component
│   └── types.ts               # TypeScript interfaces
├── auth.ts                    # JWT middleware + bcrypt
├── db.ts                      # SQLite schema + queries
├── mongo.ts                   # Mongoose models + Atlas connection
├── server.ts                  # Express server + NLP engine + all API routes
├── render.yaml                # Render Blueprint deployment spec
├── DEPLOYMENT.md              # This file
├── vite.config.ts             # Vite bundler config
└── package.json               # Dependencies + scripts + engines
```
