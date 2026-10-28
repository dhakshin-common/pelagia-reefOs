import {
  CoralReefSurvey,
  BiodiversitySighting,
  RestorationActivity,
  OceanographicStation,
  IndicatorSpecies,
  AgencyUser,
} from '../types/marine';
import {
  INITIAL_SURVEYS,
  INITIAL_SIGHTINGS,
  INITIAL_RESTORATIONS,
  INITIAL_STATIONS,
  INDICATOR_SPECIES,
  DEMO_USERS,
} from '../data/mockMarineData';

const STORAGE_KEYS = {
  SURVEYS: 'pelagia_reef_surveys_v1',
  SIGHTINGS: 'pelagia_biodiversity_sightings_v1',
  RESTORATIONS: 'pelagia_restoration_activities_v1',
  STATIONS: 'pelagia_ocean_stations_v1',
  SPECIES: 'pelagia_indicator_species_v1',
  AUTH_USER: 'pelagia_auth_user_v1',
};

export function loadStoredAuthUser(): AgencyUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(DEMO_USERS[0]));
      return DEMO_USERS[0];
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load auth user', err);
    return DEMO_USERS[0];
  }
}

export function saveStoredAuthUser(user: AgencyUser | null): void {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    }
  } catch (err) {
    console.error('Failed to save auth user', err);
  }
}

export function loadStoredSurveys(): CoralReefSurvey[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SURVEYS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SURVEYS, JSON.stringify(INITIAL_SURVEYS));
      return INITIAL_SURVEYS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load surveys from storage', err);
    return INITIAL_SURVEYS;
  }
}

export function saveStoredSurveys(surveys: CoralReefSurvey[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SURVEYS, JSON.stringify(surveys));
    // Background sync to backend API if reachable
    fetch('/api/surveys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(surveys[0]),
    }).catch(() => {
      // offline safe
    });
  } catch (err) {
    console.error('Failed to save surveys to storage', err);
  }
}

export function loadStoredSightings(): BiodiversitySighting[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SIGHTINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SIGHTINGS, JSON.stringify(INITIAL_SIGHTINGS));
      return INITIAL_SIGHTINGS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load sightings', err);
    return INITIAL_SIGHTINGS;
  }
}

export function saveStoredSightings(sightings: BiodiversitySighting[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SIGHTINGS, JSON.stringify(sightings));
    fetch('/api/sightings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sightings[0]),
    }).catch(() => {
      // offline safe
    });
  } catch (err) {
    console.error('Failed to save sightings', err);
  }
}

export function loadStoredRestorations(): RestorationActivity[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RESTORATIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.RESTORATIONS, JSON.stringify(INITIAL_RESTORATIONS));
      return INITIAL_RESTORATIONS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load restorations', err);
    return INITIAL_RESTORATIONS;
  }
}

export function saveStoredRestorations(restorations: RestorationActivity[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.RESTORATIONS, JSON.stringify(restorations));
    fetch('/api/restorations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(restorations[0]),
    }).catch(() => {
      // offline safe
    });
  } catch (err) {
    console.error('Failed to save restorations', err);
  }
}

export function loadStoredStations(): OceanographicStation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STATIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.STATIONS, JSON.stringify(INITIAL_STATIONS));
      return INITIAL_STATIONS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load stations', err);
    return INITIAL_STATIONS;
  }
}

export function saveStoredStations(stations: OceanographicStation[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.STATIONS, JSON.stringify(stations));
  } catch (err) {
    console.error('Failed to save stations', err);
  }
}

export function loadStoredSpecies(): IndicatorSpecies[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SPECIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SPECIES, JSON.stringify(INDICATOR_SPECIES));
      return INDICATOR_SPECIES;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load species', err);
    return INDICATOR_SPECIES;
  }
}

export function resetAllStorageData(): void {
  localStorage.setItem(STORAGE_KEYS.SURVEYS, JSON.stringify(INITIAL_SURVEYS));
  localStorage.setItem(STORAGE_KEYS.SIGHTINGS, JSON.stringify(INITIAL_SIGHTINGS));
  localStorage.setItem(STORAGE_KEYS.RESTORATIONS, JSON.stringify(INITIAL_RESTORATIONS));
  localStorage.setItem(STORAGE_KEYS.STATIONS, JSON.stringify(INITIAL_STATIONS));
  localStorage.setItem(STORAGE_KEYS.SPECIES, JSON.stringify(INDICATOR_SPECIES));

  fetch('/api/reset-baseline', { method: 'POST' }).catch(() => {
    // offline safe
  });
}
