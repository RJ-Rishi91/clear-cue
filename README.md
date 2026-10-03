# ClearCue 🦉

> **AI-Powered Insurance Communication Coach & Operational Training Platform**  
> *Built for US Insurance Agency Operations, Customer Support, Underwriting, and Claims Adjusters.*

ClearCue empowers insurance and financial services professionals to master the **7 Cs of Professional Communication** (Clarity, Conciseness, Concreteness, Correctness, Coherence, Completeness, Courtesy) and the **6 Golden Rules of Operational Messaging** through real-time heuristic NLP analysis, dynamic AI mock call simulations, syllable-level pronunciation coaching, and instructional practice rubrics.

---

## 🌟 Key Features

### 1. 🔍 Message Checker
- Real-time heuristic and semantic audit across all **7 Cs** and **6 Golden Rules**.
- Instant score calculation (0–100) with visual progress bars and grade badges (A, B, C, D).
- Deep granular breakdown:
  - **Sentence-level highlight auditing** with color-coded tags and click-to-explain tooltips.
  - **Identified weaknesses & strengths** with actionable operational explanations.
  - **Exemplar rewrite generator** tailored to audience (Insured, Carrier Underwriter, Adjuster, Agent) and channel (Email, Portal, SMS, CRM Note).
  - One-click copy and quick re-audit workflow.

### 2. 📞 AI Mock Call Simulator
- Interactive realistic scenarios (e.g., *Total Loss Settlement Dispute*, *Commercial Property Rate Increase*, *Workers Comp Certificate Urgency*, *Homeowners Water Damage Denial*).
- Dynamic AI caller persona that responds contextually to your spoken or typed statements.
- **Voice Input & Natural Speech Output**: Web Speech API integration with custom voice selection, auto-scroll transcript, and real-time audio wave visualization.
- **Comprehensive End-of-Call Audit**:
  - 7 Cs Radar/Bar evaluation.
  - 6 Golden Rules compliance matrix.
  - Call management & de-escalation tips.
  - Full dialogue transcript replay.

### 3. 🗣️ Pronunciation Coach
- Audio waveform visualizer with real-time pitch and volume tracking.
- Insurance terminology dictionary categorized by complexity (*Deductible*, *Subrogation*, *Endorsement*, *Indemnification*, *Exclusion*, *Coinsurance*, *Underwriting*, *Actuarial*).
- Syllable-by-syllable breakdowns (e.g. `de · duct · i · ble`, `sub · ro · ga · tion`).
- Phonetic pronunciation guides, speech synthesis playback, and Levenshtein phonetic distance scoring.
- Accuracy tracking linked to user progress.

### 4. ✍️ Email Drafter
- AI-assisted draft generator based on operational goal, recipient type, tone, and key points.
- Instant integration with the 7 Cs Checker to audit drafts before sending.

### 5. 📇 Flashcards & Concept Master
- Core insurance principles, state regulation terminology, and customer service techniques.
- Spaced repetition style rating (Easy, Medium, Hard) with mastery tracking.

### 6. 🎯 Practice Scenarios & Quizzes
- Pre-built real-world customer email and chat scenarios.
- Strict instructional rubric evaluation penalizing policy vagueness, defensive blame, or missing action items.

### 7. 📊 Progress & Audit Dashboard
- Real-time statistics: Total Messages Checked, Average 7 Cs Score, Mock Calls Completed, Pronunciation Accuracy, and Active Day Streak.
- Recent Message Analyses history table with detailed inspection modal and "Re-check" shortcut.
- Mock Call Performance Audit modal with full radar breakdown and caller dialogue.
- Data export & progress reset capabilities.

### 8. 🦉 Professor Cuckoo AI Companion
- Floating interactive mentor available across every view.
- Provides context-aware operational tips, roleplay prompts, and quick coaching.

---

## 🔒 Authentication & Dual-Engine Persistence

ClearCue features a complete authentication and dual-persistence architecture:
- **JWT Authentication:** Secure user registration, login, session persistence, and logout with bcrypt password hashing.
- **Dual-Engine Architecture:**
  - **MongoDB Atlas Cloud:** Connected automatically when `MONGODB_URI` is provided in environment variables.
  - **SQLite Local Database:** Seamless local embedded fallback (`data/clearcue.db`) requiring **zero cloud configuration**.
  - All user profiles, checked messages, mock call audits, and pronunciation records automatically synchronize.

---

## 💡 $0 Cost / No Paid AI Tool Requirement

ClearCue was designed to be **100% operational with $0 in paid software or APIs**:
- Built-in **local heuristic NLP engine** evaluates all 7 Cs and 6 Golden Rules accurately without calling external APIs.
- Phonetic dictionary and syllable analysis run entirely in-browser and local Node.js runtime.
- **Optional Gemini API:** ClearCue seamlessly leverages Google's free-tier Gemini API when `GEMINI_API_KEY` is provided, while automatically falling back to the local engines if the key is omitted or rate limits are reached.

---

## 🚀 Quickstart: Local Development

### Prerequisites
- Node.js v18+ (Node v20 or v22 recommended)
- npm or bun

### 1. Clone & Install
```bash
git clone <repo-url>
cd "Clear Cue"
npm install
```

### 2. Configure Environment (Optional)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(ClearCue runs out of the box with zero environment variables using local SQLite and local NLP!)*

### 3. Launch the Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🌐 Production Deployment

ClearCue is pre-configured for modern split deployment:

| Component | Platform | Configuration |
| :--- | :--- | :--- |
| **Frontend** | **GitHub Pages** | Static SPA built via GitHub Actions (`.github/workflows/deploy-pages.yml`) |
| **Backend** | **Render** | Node.js Express service configured via [`render.yaml`](render.yaml) |
| **Database** | **MongoDB Atlas** | Free M0 Cluster URI configured in Render environment variables |

👉 See [**DEPLOYMENT.md**](DEPLOYMENT.md) for the complete step-by-step setup guide.

---

## 📁 Project Structure

```
├── .github/workflows/
│   └── deploy-pages.yml        # GitHub Pages automated CI/CD build & deploy
├── data/
│   └── clearcue.db             # Local SQLite database (auto-generated fallback)
├── dist/                       # Compiled production client & server bundles
├── src/
│   ├── components/
│   │   ├── AuthModal.tsx       # Login & Signup modal with password toggles
│   │   ├── CheckMessageView.tsx# Message Checker with 7 Cs and 6 Golden Rules
│   │   ├── DraftEmailView.tsx  # Email Drafter with tone & objective controls
│   │   ├── FlashcardsView.tsx  # Interactive flashcards & concept mastery
│   │   ├── FloatingCuckooCoach.tsx # Professor Cuckoo floating AI companion
│   │   ├── MockCallView.tsx    # Audio/visual AI voice mock call simulator
│   │   ├── MrCuckoo.tsx        # Professor Cuckoo mascot component
│   │   ├── Navbar.tsx          # Main navigation with auth & profile triggers
│   │   ├── PracticeView.tsx    # Instructional scenario exercises
│   │   ├── ProgressView.tsx    # Bento analytics, recent history & audit modals
│   │   ├── PronunciationView.tsx # Phonetic & syllable speech coach
│   │   └── UserProfileModal.tsx# Profile inspector & database engine badge
│   ├── utils/
│   │   └── api.ts              # Universal client API wrapper with JWT auth
│   ├── App.tsx                 # Root application controller & navigation state
│   ├── index.css               # Tailwind v4 utility and animation styles
│   ├── main.tsx                # React 19 entrypoint
│   └── types.ts                # TypeScript domain models and interfaces
├── auth.ts                     # JWT authentication middleware & bcrypt utilities
├── db.ts                       # SQLite embedded storage engine
├── mongo.ts                    # MongoDB Atlas Mongoose models & connection
├── server.ts                   # Express server, local NLP heuristic engine & API routes
├── DEPLOYMENT.md               # GitHub Pages + Render + Atlas deployment guide
├── render.yaml                 # Render Blueprint deployment specification
├── vite.config.ts              # Vite bundler configuration
└── package.json                # Project dependencies and build scripts
```

---

## 📄 License
MIT License. Built for insurance operations training and professional development.
