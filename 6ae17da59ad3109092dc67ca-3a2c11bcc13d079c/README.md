# Pelagia ReefOS v2045.9
### Deep Marine Ecological Information System & Coral Reef Conservation Platform

Pelagia ReefOS is a mission-critical marine conservation operating system designed for marine park authorities, oceanographic research institutes, and coral restoration task forces. It complies with the **Global Coral Reef Monitoring Network (GCRMN)**, **NOAA Coral Reef Watch (CRW)**, and **UN CBD 30x30 Protected Area** scientific criteria.

---

## 🚀 Features

- **Executive Command Nexus**: Real-time MPA overview, bio-health indices, thermal alerts, live UTC chronometer, and bathymetry sounder.
- **Benthic Line-Intercept Transect Portal**: Standard surveys, rapid photo-quadrat wizard with automated Reef Health Index (RHI) computation, and GCRMN benthic coverage matrix.
- **Autonomous Quadrat Computer Vision HUD**: Interactive machine-vision quadrat inspection terminal with colonial bounding boxes and cover analysis.
- **Biodiversity & Indicator Organism Census**: Population tracking for Crown-of-Thorns (COTS), herbivorous grazers, bio-acoustic hydrophone spectrum monitor, and threat alerting.
- **Micro-Fragmentation & Nursery Array**: Track outplant cohorts, genetic lineages, substrate cementation methods, and 30-day, 90-day, and 1-year survivorship curves.
- **Oceanographic Buoy Telemetry**: Live SST, Degree Heating Weeks (DHW), pH, salinity, PAR solar radiation, dissolved oxygen, and acoustic soundings.
- **Tactical Geospatial Marine GIS Bridge**: Interactive navigational map with AUV glider flight paths, sonar ping acoustics, bathymetric overlays, and MPA boundary layers.
- **Audit & Export Suite**: Instant CSV and JSON export for national biodiversity reporting, plus one-click full project archive.
- **Full-Stack REST Backend & Express Architecture**: Built-in backend with `/api/health`, `/api/surveys`, `/api/sightings`, `/api/restorations`, `/api/stations`, and `/api/download-zip`.

---

## 🛠️ Quick Start

### Prerequisites
- Node.js (v18+ or v20+)
- npm / yarn / pnpm / bun

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

### 3. Build for Production
```bash
npm run build
```

### 4. Start Full-Stack Server
```bash
npm start
```
Runs `server.ts` with API endpoints and production static asset serving on port 3000.

---

## 🌐 Deployment

### Deploy to Vercel
1. Push this repository to GitHub.
2. Go to [vercel.com](https://vercel.com) and import the repository.
3. Vercel automatically detects the configuration in `vercel.json`:
   - Framework: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Click **Deploy**.

### Deploy to Render
1. Push this repository to GitHub.
2. In [render.com](https://render.com), create a new **Web Service** or **Static Site**.
3. Select your repository.
4. Render automatically detects `render.yaml`:
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
5. Click **Create Web Service**.

---

## 📁 Project Architecture

```
├── DEPLOYMENT.md          # Step-by-step Vercel & Render push guides
├── README.md              # Project documentation
├── vercel.json            # Vercel deployment & SPA routing configuration
├── render.yaml            # Render static site blueprint specification
├── package.json           # Scripts and dependencies
├── vite.config.ts         # Vite build configuration with Tailwind CSS v4
├── server.ts              # Express full-stack API backend
├── public/                # Static assets and downloadable project zip
└── src/
    ├── App.tsx            # Main application orchestrator & modal managers
    ├── main.tsx           # React entry point
    ├── index.css          # Tailwind CSS styles and cybernetic HUD themes
    ├── components/        # UI components & views
    │   ├── Header.tsx     # Command bridge ribbon & tactical controls
    │   ├── AgencyPortalLanding.tsx # Executive dashboard
    │   ├── SurveysView.tsx         # Benthic transects & AI Vision scanner
    │   ├── BiodiversityView.tsx    # Bio-registry & hydrophone spectrum
    │   ├── RestorationView.tsx     # Nursery raceways & cohort tracking
    │   ├── EcologicalMonitoringView.tsx # Station telemetry & DHW alerts
    │   ├── SpatialReefMap.tsx      # Tactical marine GIS & AUV flight path
    │   ├── RapidBenthicSurveyWizard.tsx # 50-point photo-quadrat wizard
    │   ├── ThermalStressSimulatorModal.tsx # Predictive bleaching engine
    │   ├── ReportExportModal.tsx   # Audit & export suite
    │   └── LoginPage.tsx           # Cybernetic terminal auth
    ├── data/              # Verified marine datasets & baselines
    ├── types/             # TypeScript interfaces for marine data models
    └── utils/             # Audio FX, CSV/JSON exporters, local/API storage
```

---

## 📄 License
MIT License. Created for global coral reef conservation and ocean stewardship.
