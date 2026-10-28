export type SurveyMethod = 'Line Intercept Transect (LIT)' | 'Point Intercept Transect (PIT)' | 'Photo-Quadrat (GCRMN)' | 'Manta Tow Survey';

export type BleachingSeverity = 'Category 0 (None <1%)' | 'Category 1 (Mild 1-10%)' | 'Category 2 (Moderate 10-50%)' | 'Category 3 (Severe 50-80%)' | 'Category 4 (Catastrophic >80%)';

export type CoralDisease = 'None Detected' | 'Stony Coral Tissue Loss Disease (SCTLD)' | 'Black Band Disease (BBD)' | 'White Syndrome' | 'Yellow Band Disease' | 'Skeletal Eroding Band';

export type MPAZone = 'Sanctuary (No-Take Core)' | 'Conservation Zone' | 'Habitat Restoration Area' | 'Sustainable Use Buffer';

export interface BenthicComposition {
  hardCoralCover: number;     // % e.g. 38.5%
  softCoralCover: number;     // % e.g. 14.2%
  macroalgaeCover: number;    // % e.g. 11.4% (high macroalgae indicates degradation)
  crustoseCorallineAlgae: number; // % CCA (vital for larval settlement)
  turfAlgaeCover: number;     // %
  abioticSubstrate: number;   // % sand, rubble, rock
}

export interface CoralReefSurvey {
  id: string;
  surveyCode: string;
  siteName: string;
  mpaZone: MPAZone;
  region: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  surveyDate: string;
  surveyLeader: string;
  teamMembers: string[];
  method: SurveyMethod;
  transectLengthMeters: number;
  depthRangeMeters: {
    min: number;
    max: number;
  };
  waterTempCelsius: number;
  underwaterVisibilityMeters: number;
  benthicComposition: BenthicComposition;
  bleachedCoralPercentage: number;
  bleachingSeverity: BleachingSeverity;
  dominantCoralGenera: string[];
  diseaseDetected: CoralDisease;
  reefHealthIndex: number; // 1.0 to 5.0 (Global Coral Reef standard)
  photoUrl?: string;
  notes: string;
  validationStatus: 'Validated' | 'Under Review' | 'Field Draft';
}

export type IUCNStatus = 'Critically Endangered (CR)' | 'Endangered (EN)' | 'Vulnerable (VU)' | 'Near Threatened (NT)' | 'Least Concern (LC)';

export type TrophicGuild = 'Primary Producer' | 'Herbivore / Grazer' | 'Corallivore' | 'Invertivore' | 'Apex Predator' | 'Filter Feeder';

export interface IndicatorSpecies {
  id: string;
  scientificName: string;
  commonName: string;
  taxa: 'Scleractinia (Hard Coral)' | 'Teleostei (Reef Fish)' | 'Echinodermata' | 'Mollusca' | 'Elasmobranchii (Sharks/Rays)' | 'Reptilia';
  trophicGuild: TrophicGuild;
  iucnStatus: IUCNStatus;
  indicatorRole: string; // e.g., 'Algal control grazer', 'Calcification baseline', 'COTS bio-pest'
  idealDensity: string;  // e.g., '>15 indiv / 100m²'
}

export interface BiodiversitySighting {
  id: string;
  date: string;
  siteName: string;
  speciesId: string;
  scientificName: string;
  commonName: string;
  taxa: string;
  count: number;
  densityPer100m2: number;
  lifeStage: 'Juvenile' | 'Sub-Adult' | 'Adult' | 'Mixed';
  depthMeters: number;
  sizeEstimateCm: number;
  observer: string;
  notes: string;
}

export type AttachmentTechnique = 'Marine Epoxy & Plugs' | 'Coral Clips on Reef Stars' | 'Cable Ties on Rebar' | 'Substrate Cement' | 'Direct Outplant Pin';

export interface RestorationActivity {
  id: string;
  batchCode: string;
  siteName: string;
  nurseryOrigin: string;
  coralSpecies: string[];
  outplantDate: string;
  technique: AttachmentTechnique;
  fragmentsOutplanted: number;
  restoredAreaM2: number;
  leadRestorationBiologist: string;
  survivalRate30d: number;  // %
  survivalRate90d: number;  // %
  survivalRate1Year: number; // %
  currentExtensionRateMmMonth: number;
  status: 'Active Monitoring' | 'Stabilized / Thriving' | 'Maintenance Required' | 'Compromised';
  maintenanceHistory: {
    date: string;
    action: string;
    technician: string;
  }[];
  notes: string;
}

export type ThermalAlertLevel = 'No Stress' | 'Watch' | 'Warning' | 'Alert Level 1' | 'Alert Level 2';

export type AgencyRole =
  | 'Lead Benthic Ecologist'
  | 'Restoration Operations Director'
  | 'MPA Chief Ranger'
  | 'Field Research Diver';

export interface AgencyUser {
  id: string;
  name: string;
  email: string;
  role: AgencyRole;
  agency: string;
  clearanceLevel: 'Level 2 Field Diver' | 'Level 3 Scientific Specialist' | 'Level 4 Operations Director' | 'Level 5 Sanctuary Administrator';
  badgeNumber: string;
  avatarUrl?: string;
  assignedMPA: string;
  isGoogleAuth?: boolean;
  emailVerified: boolean;
}

export interface OceanographicStation {
  id: string;
  stationCode: string;
  name: string;
  region: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  depthMeters: number;
  status: 'Nominal' | 'Sensor Calibrating' | 'Telemetry Degraded';
  lastTelemetryTimestamp: string;
  seaSurfaceTemperatureC: number;
  climatologicalBaselineC: number;
  temperatureAnomalyC: number;
  degreeHeatingWeeks: number; // DHW °C-weeks
  thermalAlert: ThermalAlertLevel;
  dissolvedOxygenMgL: number; // mg/L
  phLevel: number;            // 7.8 - 8.3
  salinityPsu: number;        // PSU
  turbidityNtu: number;       // NTU
  parSolarIrradiance: number; // µmol photons/m²/s
  history: {
    timestamp: string;
    temperature: number;
    dhw: number;
    ph: number;
  }[];
}
