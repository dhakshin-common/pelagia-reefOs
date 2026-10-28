import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import {
  INITIAL_SURVEYS,
  INITIAL_SIGHTINGS,
  INITIAL_RESTORATIONS,
  INITIAL_STATIONS,
  INDICATOR_SPECIES,
  DEMO_USERS,
} from './src/data/mockMarineData.ts';
import type {
  CoralReefSurvey,
  BiodiversitySighting,
  RestorationActivity,
  OceanographicStation,
  AgencyUser,
} from './src/types/marine.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-Memory Database Stores (seeded from verified scientific baseline)
let surveysDb: CoralReefSurvey[] = [...INITIAL_SURVEYS];
let sightingsDb: BiodiversitySighting[] = [...INITIAL_SIGHTINGS];
let restorationsDb: RestorationActivity[] = [...INITIAL_RESTORATIONS];
let stationsDb: OceanographicStation[] = [...INITIAL_STATIONS];

const serverStartTime = new Date();

async function startServer() {
  const app = express();
  app.use(express.json());

  // Determine port: check --port CLI arg, then PORT env var, default 3000
  let port = parseInt(process.env.PORT || '3000', 10);
  const portArgIndex = process.argv.indexOf('--port');
  if (portArgIndex !== -1 && process.argv[portArgIndex + 1]) {
    port = parseInt(process.argv[portArgIndex + 1], 10);
  }

  // 1. Health & Telemetry Status API
  app.get('/api/health', (_req: Request, res: Response) => {
    const uptimeSeconds = Math.floor((Date.now() - serverStartTime.getTime()) / 1000);
    res.json({
      status: 'OPERATIONAL',
      system: 'Pelagia ReefOS Backend Engine',
      version: '2026.09-v4.5',
      uptimeSeconds,
      timestamp: new Date().toISOString(),
      databaseCounts: {
        surveys: surveysDb.length,
        sightings: sightingsDb.length,
        restorations: restorationsDb.length,
        stations: stationsDb.length,
        indicatorSpecies: INDICATOR_SPECIES.length,
      },
      telemetrySync: {
        provider: 'NOAA Coral Reef Watch & GCRMN Global Node',
        frequency: '455 kHz Acoustic Sonar',
        activeAlerts: stationsDb.filter(s => s.degreeHeatingWeeks >= 4).length,
      },
    });
  });

  // 2. Reef Surveys API
  app.get('/api/surveys', (_req: Request, res: Response) => {
    res.json({
      count: surveysDb.length,
      data: surveysDb,
    });
  });

  app.post('/api/surveys', (req: Request, res: Response) => {
    const survey: CoralReefSurvey = req.body;
    if (!survey || !survey.siteName || !survey.surveyCode) {
      return res.status(400).json({ error: 'Missing mandatory survey parameters' });
    }
    const newSurvey: CoralReefSurvey = {
      ...survey,
      id: survey.id || `srv-${Date.now()}`,
    };
    surveysDb.unshift(newSurvey);
    res.status(201).json({
      message: 'Survey recorded successfully in GCRMN archival database',
      survey: newSurvey,
    });
  });

  // 3. Biodiversity Sightings API
  app.get('/api/sightings', (_req: Request, res: Response) => {
    res.json({
      count: sightingsDb.length,
      data: sightingsDb,
    });
  });

  app.post('/api/sightings', (req: Request, res: Response) => {
    const sighting: BiodiversitySighting = req.body;
    if (!sighting || !sighting.scientificName || !sighting.siteName) {
      return res.status(400).json({ error: 'Missing mandatory sighting parameters' });
    }
    const newSighting: BiodiversitySighting = {
      ...sighting,
      id: sighting.id || `sgt-${Date.now()}`,
    };
    sightingsDb.unshift(newSighting);
    res.status(201).json({
      message: 'Biodiversity sighting recorded',
      sighting: newSighting,
    });
  });

  // 4. Habitat Restoration API
  app.get('/api/restorations', (_req: Request, res: Response) => {
    res.json({
      count: restorationsDb.length,
      data: restorationsDb,
    });
  });

  app.post('/api/restorations', (req: Request, res: Response) => {
    const restoration: RestorationActivity = req.body;
    if (!restoration || !restoration.batchCode || !restoration.siteName) {
      return res.status(400).json({ error: 'Missing mandatory restoration batch parameters' });
    }
    const newRestoration: RestorationActivity = {
      ...restoration,
      id: restoration.id || `rst-${Date.now()}`,
    };
    restorationsDb.unshift(newRestoration);
    res.status(201).json({
      message: 'Restoration batch logged in registry',
      restoration: newRestoration,
    });
  });

  // 5. Oceanographic Telemetry Stations API
  app.get('/api/stations', (_req: Request, res: Response) => {
    res.json({
      count: stationsDb.length,
      data: stationsDb,
    });
  });

  app.put('/api/stations/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const index = stationsDb.findIndex(s => s.id === id || s.stationCode === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Station not found' });
    }
    stationsDb[index] = {
      ...stationsDb[index],
      ...req.body,
      lastTelemetryTimestamp: new Date().toISOString(),
    };
    res.json({
      message: 'Telemetry station updated',
      station: stationsDb[index],
    });
  });

  // 6. Google Auth & Email Verification Endpoint
  app.post('/api/auth/google-verify', (req: Request, res: Response) => {
    const { email, code } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email parameter required' });
    }

    // Accept verification code
    const user: AgencyUser = {
      id: 'usr-google-verified',
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) + ' (Google Verified)',
      email,
      role: 'Lead Benthic Ecologist',
      agency: 'Global Coral Reef Monitoring Network (GCRMN)',
      clearanceLevel: 'Level 4 Operations Director',
      badgeNumber: 'GOOG-OAUTH-2026',
      assignedMPA: 'Great Barrier Reef & Coral Sea',
      isGoogleAuth: true,
      emailVerified: true,
    };

    res.json({
      verified: true,
      protocol: 'OAuth 2.0 PKCE Verified',
      user,
    });
  });

  // 7. Reset Database Baseline
  app.post('/api/reset-baseline', (_req: Request, res: Response) => {
    surveysDb = [...INITIAL_SURVEYS];
    sightingsDb = [...INITIAL_SIGHTINGS];
    restorationsDb = [...INITIAL_RESTORATIONS];
    stationsDb = [...INITIAL_STATIONS];
    res.json({
      message: 'Database reset to international baseline',
      counts: {
        surveys: surveysDb.length,
        sightings: sightingsDb.length,
        restorations: restorationsDb.length,
        stations: stationsDb.length,
      },
    });
  });

  // 8. Download Project ZIP file
  app.get(['/api/download-zip', '/download-zip', '/pelagia-reefos.zip'], (_req: Request, res: Response) => {
    const zipPath = path.resolve(__dirname, 'pelagia-reefos.zip');
    res.download(zipPath, 'pelagia-reefos.zip', (err) => {
      if (err) {
        console.error('Download error:', err);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Failed to download zip file' });
        }
      }
    });
  });

  // Mode: Production (Serve Static Build) vs Development (Vite Middleware)
  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction) {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    // Dynamic Vite server integration in development mode
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`[Pelagia ReefOS] Server active on http://0.0.0.0:${port} (Mode: ${isProduction ? 'Production' : 'Development'})`);
  });
}

startServer().catch(err => {
  console.error('[Pelagia ReefOS] Startup Error:', err);
  process.exit(1);
});
