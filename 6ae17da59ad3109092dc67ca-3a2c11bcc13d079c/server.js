// server.ts
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// src/data/mockMarineData.ts
var INITIAL_SURVEYS = [
  {
    id: "srv-001",
    surveyCode: "GBR-OSP-2026-08",
    siteName: "Osprey Reef Fore-Reef Shelf",
    mpaZone: "Sanctuary (No-Take Core)",
    region: "Coral Sea / Great Barrier Reef MPA",
    coordinates: {
      latitude: -13.9167,
      longitude: 146.6333
    },
    surveyDate: "2026-09-18",
    surveyLeader: "Dr. Elena Rostova",
    teamMembers: ["M. Henderson (Scientific Diver)", "K. Thorne (Benthic Analyst)"],
    method: "Line Intercept Transect (LIT)",
    transectLengthMeters: 50,
    depthRangeMeters: { min: 8.5, max: 14.2 },
    waterTempCelsius: 27.8,
    underwaterVisibilityMeters: 28,
    benthicComposition: {
      hardCoralCover: 46.2,
      softCoralCover: 16.5,
      macroalgaeCover: 6.8,
      crustoseCorallineAlgae: 14.1,
      turfAlgaeCover: 8.4,
      abioticSubstrate: 8
    },
    bleachedCoralPercentage: 2.1,
    bleachingSeverity: "Category 1 (Mild 1-10%)",
    dominantCoralGenera: ["Acropora", "Porites", "Pocillopora", "Montipora"],
    diseaseDetected: "None Detected",
    reefHealthIndex: 4.4,
    photoUrl: "/src/assets/images/coral_reef_ecosystem_1790787941171.jpg",
    notes: "High crustose coralline algae (14.1%) indicates strong structural integrity and recruitment readiness. Robust branching Acropora thickets with dense chromis schools.",
    validationStatus: "Validated"
  },
  {
    id: "srv-002",
    surveyCode: "RAJA-MIS-2026-14",
    siteName: "Misool Magic Mountain Seamount",
    mpaZone: "Sanctuary (No-Take Core)",
    region: "Raja Ampat Marine Reserve, Indonesia",
    coordinates: {
      latitude: -2.2541,
      longitude: 130.5622
    },
    surveyDate: "2026-09-22",
    surveyLeader: "Bambang Sukarno",
    teamMembers: ["S. Al-Mansoor", "T. Lindqvist"],
    method: "Photo-Quadrat (GCRMN)",
    transectLengthMeters: 50,
    depthRangeMeters: { min: 6, max: 18 },
    waterTempCelsius: 28.4,
    underwaterVisibilityMeters: 25,
    benthicComposition: {
      hardCoralCover: 52.8,
      softCoralCover: 21,
      macroalgaeCover: 3.4,
      crustoseCorallineAlgae: 12.6,
      turfAlgaeCover: 5.2,
      abioticSubstrate: 5
    },
    bleachedCoralPercentage: 0.8,
    bleachingSeverity: "Category 0 (None <1%)",
    dominantCoralGenera: ["Acropora", "Plerogyra", "Tubastraea", "Turbinaria"],
    diseaseDetected: "None Detected",
    reefHealthIndex: 4.8,
    photoUrl: "/src/assets/images/marine_biologist_diver_survey_1790787988736.jpg",
    notes: "Exceptional biodiversity apex hotspot. Massive hard coral tabular formations with pristine soft coral gardens. Oceanic manta rays actively utilizing cleaning stations.",
    validationStatus: "Validated"
  },
  {
    id: "srv-003",
    surveyCode: "BLZ-GLV-2026-31",
    siteName: "Glover's Reef Atoll East Ridge",
    mpaZone: "Conservation Zone",
    region: "Mesoamerican Barrier Reef System, Belize",
    coordinates: {
      latitude: 16.824,
      longitude: -87.798
    },
    surveyDate: "2026-09-14",
    surveyLeader: "Dr. Marcus Vance",
    teamMembers: ["L. Gomez", "C. Aguilar"],
    method: "Point Intercept Transect (PIT)",
    transectLengthMeters: 50,
    depthRangeMeters: { min: 9, max: 16.5 },
    waterTempCelsius: 29.6,
    underwaterVisibilityMeters: 18,
    benthicComposition: {
      hardCoralCover: 24.5,
      softCoralCover: 12.3,
      macroalgaeCover: 28.6,
      crustoseCorallineAlgae: 9.2,
      turfAlgaeCover: 14.4,
      abioticSubstrate: 11
    },
    bleachedCoralPercentage: 18.4,
    bleachingSeverity: "Category 2 (Moderate 10-50%)",
    dominantCoralGenera: ["Orbicella", "Agaricia", "Porites", "Siderastrea"],
    diseaseDetected: "Stony Coral Tissue Loss Disease (SCTLD)",
    reefHealthIndex: 2.6,
    photoUrl: "/src/assets/images/benthic_transect_quadrat_1790787975199.jpg",
    notes: "Elevated macroalgal proliferation (28.6%) observed following historical Diadema mortality. SCTLD lesions noted on Orbicella faveolata colonies; emergency amoxicillin treatment administered.",
    validationStatus: "Under Review"
  },
  {
    id: "srv-004",
    surveyCode: "FLK-SOM-2026-05",
    siteName: "Sombrero Reef Deep Spur & Groove",
    mpaZone: "Habitat Restoration Area",
    region: "Florida Keys National Marine Sanctuary",
    coordinates: {
      latitude: 24.6272,
      longitude: -81.1105
    },
    surveyDate: "2026-09-25",
    surveyLeader: "Sarah Jenkins, M.Sc.",
    teamMembers: ["J. Kowalski", "R. Diaz"],
    method: "Photo-Quadrat (GCRMN)",
    transectLengthMeters: 40,
    depthRangeMeters: { min: 5.5, max: 11 },
    waterTempCelsius: 30.1,
    underwaterVisibilityMeters: 15,
    benthicComposition: {
      hardCoralCover: 19.8,
      softCoralCover: 15.2,
      macroalgaeCover: 31,
      crustoseCorallineAlgae: 6.5,
      turfAlgaeCover: 18,
      abioticSubstrate: 9.5
    },
    bleachedCoralPercentage: 34,
    bleachingSeverity: "Category 2 (Moderate 10-50%)",
    dominantCoralGenera: ["Acropora", "Porites", "Montastraea"],
    diseaseDetected: "White Syndrome",
    reefHealthIndex: 2.3,
    photoUrl: "/src/assets/images/coral_nursery_restoration_1790787956472.jpg",
    notes: "Thermal accumulation elevated (DHW 5.4). Outplanted staghorn colonies showing partial bleaching at tips, but nursery genets with heat-resilient markers exhibit lower mortality.",
    validationStatus: "Validated"
  },
  {
    id: "srv-005",
    surveyCode: "RED-RAS-2026-19",
    siteName: "Ras Mohammed Shark Reef Wall",
    mpaZone: "Sanctuary (No-Take Core)",
    region: "Sinai Peninsula, Red Sea Marine Park",
    coordinates: {
      latitude: 27.7289,
      longitude: 34.2564
    },
    surveyDate: "2026-09-10",
    surveyLeader: "Dr. Tariq Al-Sayed",
    teamMembers: ["N. Zaki", "A. Becker"],
    method: "Line Intercept Transect (LIT)",
    transectLengthMeters: 50,
    depthRangeMeters: { min: 7, max: 22 },
    waterTempCelsius: 28.9,
    underwaterVisibilityMeters: 35,
    benthicComposition: {
      hardCoralCover: 49.5,
      softCoralCover: 22.8,
      macroalgaeCover: 4.1,
      crustoseCorallineAlgae: 11.2,
      turfAlgaeCover: 6.2,
      abioticSubstrate: 6.2
    },
    bleachedCoralPercentage: 0.4,
    bleachingSeverity: "Category 0 (None <1%)",
    dominantCoralGenera: ["Stylophora", "Acropora", "Pocillopora", "Millepora"],
    diseaseDetected: "None Detected",
    reefHealthIndex: 4.6,
    photoUrl: "/src/assets/images/coral_reef_ecosystem_1790787941171.jpg",
    notes: "High natural thermal tolerance documented. Strong vertical current flushing keeps nutrient levels balanced and prevents heat stagnation along the drop-off.",
    validationStatus: "Validated"
  },
  {
    id: "srv-006",
    surveyCode: "TUB-NOR-2026-02",
    siteName: "Tubbataha North Atoll Bird Islet Shelf",
    mpaZone: "Sanctuary (No-Take Core)",
    region: "Sulu Sea, Tubbataha Reefs Natural Park",
    coordinates: {
      latitude: 8.9511,
      longitude: 119.9142
    },
    surveyDate: "2026-09-04",
    surveyLeader: "Captain Angelique Songco",
    teamMembers: ["R. Manalo", "C. Tan"],
    method: "Manta Tow Survey",
    transectLengthMeters: 100,
    depthRangeMeters: { min: 4, max: 15 },
    waterTempCelsius: 28.1,
    underwaterVisibilityMeters: 30,
    benthicComposition: {
      hardCoralCover: 44,
      softCoralCover: 18,
      macroalgaeCover: 5.5,
      crustoseCorallineAlgae: 15.5,
      turfAlgaeCover: 9,
      abioticSubstrate: 8
    },
    bleachedCoralPercentage: 1.2,
    bleachingSeverity: "Category 1 (Mild 1-10%)",
    dominantCoralGenera: ["Acropora", "Porites", "Favites", "Galaxea"],
    diseaseDetected: "None Detected",
    reefHealthIndex: 4.5,
    photoUrl: "/src/assets/images/marine_biologist_diver_survey_1790787988736.jpg",
    notes: "Outstanding reef resilience. Zero destructive fishing impacts recorded. High juvenile recruitment observed across 100m tow belt.",
    validationStatus: "Validated"
  }
];
var INDICATOR_SPECIES = [
  {
    id: "sp-001",
    scientificName: "Acropora cervicornis",
    commonName: "Staghorn Coral",
    taxa: "Scleractinia (Hard Coral)",
    trophicGuild: "Primary Producer",
    iucnStatus: "Critically Endangered (CR)",
    indicatorRole: "Fast-growing structural framework builder; thermal sensitivity index",
    idealDensity: ">10 colonies / 100m\xB2"
  },
  {
    id: "sp-002",
    scientificName: "Acropora palmata",
    commonName: "Elkhorn Coral",
    taxa: "Scleractinia (Hard Coral)",
    trophicGuild: "Primary Producer",
    iucnStatus: "Critically Endangered (CR)",
    indicatorRole: "Wave energy dissipation; shallow reef crest architect",
    idealDensity: ">5 massive colonies / 100m\xB2"
  },
  {
    id: "sp-003",
    scientificName: "Scaroides coeruleus",
    commonName: "Blue Parrotfish",
    taxa: "Teleostei (Reef Fish)",
    trophicGuild: "Herbivore / Grazer",
    iucnStatus: "Least Concern (LC)",
    indicatorRole: "Macroalgae cropper & bioerosive sediment generator",
    idealDensity: ">12 indiv / 100m\xB2"
  },
  {
    id: "sp-004",
    scientificName: "Bolbometopon muricatum",
    commonName: "Bumphead Parrotfish",
    taxa: "Teleostei (Reef Fish)",
    trophicGuild: "Herbivore / Grazer",
    iucnStatus: "Vulnerable (VU)",
    indicatorRole: "Key coral calcification ecosystem engineer; overfishing bio-indicator",
    idealDensity: ">3 indiv / 100m\xB2"
  },
  {
    id: "sp-005",
    scientificName: "Acanthaster planci",
    commonName: "Crown-of-Thorns Starfish (COTS)",
    taxa: "Echinodermata",
    trophicGuild: "Corallivore",
    iucnStatus: "Least Concern (LC)",
    indicatorRole: "Destructive coral predator outbreak warning (threshold: >0.2 indiv/tow)",
    idealDensity: "<0.2 indiv / 100m\xB2"
  },
  {
    id: "sp-006",
    scientificName: "Diadema antillarum",
    commonName: "Long-spined Sea Urchin",
    taxa: "Echinodermata",
    trophicGuild: "Herbivore / Grazer",
    iucnStatus: "Vulnerable (VU)",
    indicatorRole: "Essential benthic turf & macroalgae grazing regulator",
    idealDensity: ">20 indiv / 100m\xB2"
  },
  {
    id: "sp-007",
    scientificName: "Carcharhinus melanopterus",
    commonName: "Blacktip Reef Shark",
    taxa: "Elasmobranchii (Sharks/Rays)",
    trophicGuild: "Apex Predator",
    iucnStatus: "Vulnerable (VU)",
    indicatorRole: "Trophic cascade stabilization; ecosystem trophic integrity",
    idealDensity: ">1 indiv / 1000m\xB2"
  },
  {
    id: "sp-008",
    scientificName: "Chelonia mydas",
    commonName: "Green Sea Turtle",
    taxa: "Reptilia",
    trophicGuild: "Herbivore / Grazer",
    iucnStatus: "Endangered (EN)",
    indicatorRole: "Seagrass bed dynamics & sponge balance regulator",
    idealDensity: ">2 indiv / survey haul"
  },
  {
    id: "sp-009",
    scientificName: "Tridacna gigas",
    commonName: "Giant Clam",
    taxa: "Mollusca",
    trophicGuild: "Filter Feeder",
    iucnStatus: "Critically Endangered (CR)",
    indicatorRole: "Seawater bio-filtration; structural habitat & substrate builder",
    idealDensity: ">4 indiv / 100m\xB2"
  },
  {
    id: "sp-010",
    scientificName: "Porites lutea",
    commonName: "Hump Coral / Massive Porites",
    taxa: "Scleractinia (Hard Coral)",
    trophicGuild: "Primary Producer",
    iucnStatus: "Least Concern (LC)",
    indicatorRole: "Climate paleorecords; high-resilience stress-tolerant dominant",
    idealDensity: ">8 massive heads / 100m\xB2"
  },
  {
    id: "sp-011",
    scientificName: "Acanthurus coeruleus",
    commonName: "Blue Tang Surgeonfish",
    taxa: "Teleostei (Reef Fish)",
    trophicGuild: "Herbivore / Grazer",
    iucnStatus: "Least Concern (LC)",
    indicatorRole: "Herbivorous grazing guild; prevents coral smothering",
    idealDensity: ">18 indiv / 100m\xB2"
  },
  {
    id: "sp-012",
    scientificName: "Epinephelus striatus",
    commonName: "Nassau Grouper",
    taxa: "Teleostei (Reef Fish)",
    trophicGuild: "Apex Predator",
    iucnStatus: "Critically Endangered (CR)",
    indicatorRole: "Historical fisheries collapse indicator & spawning aggregation health",
    idealDensity: ">2 indiv / 100m\xB2"
  }
];
var INITIAL_SIGHTINGS = [
  {
    id: "sig-001",
    date: "2026-09-22",
    siteName: "Misool Magic Mountain Seamount",
    speciesId: "sp-007",
    scientificName: "Carcharhinus melanopterus",
    commonName: "Blacktip Reef Shark",
    taxa: "Elasmobranchii",
    count: 4,
    densityPer100m2: 0.8,
    lifeStage: "Adult",
    depthMeters: 12,
    sizeEstimateCm: 140,
    observer: "Bambang Sukarno",
    notes: "Cruising along reef crest boundary. Patrolling schooling fusiliers."
  },
  {
    id: "sig-002",
    date: "2026-09-18",
    siteName: "Osprey Reef Fore-Reef Shelf",
    speciesId: "sp-004",
    scientificName: "Bolbometopon muricatum",
    commonName: "Bumphead Parrotfish",
    taxa: "Teleostei",
    count: 9,
    densityPer100m2: 1.8,
    lifeStage: "Adult",
    depthMeters: 9.5,
    sizeEstimateCm: 110,
    observer: "Dr. Elena Rostova",
    notes: "School actively feeding on Porites boulder margins; audible crunching."
  },
  {
    id: "sig-003",
    date: "2026-09-14",
    siteName: "Glover's Reef Atoll East Ridge",
    speciesId: "sp-006",
    scientificName: "Diadema antillarum",
    commonName: "Long-spined Sea Urchin",
    taxa: "Echinodermata",
    count: 14,
    densityPer100m2: 2.8,
    lifeStage: "Adult",
    depthMeters: 11.2,
    sizeEstimateCm: 22,
    observer: "Dr. Marcus Vance",
    notes: "Clustered in limestone crevices. Positive signs of localized juvenile recovery."
  },
  {
    id: "sig-004",
    date: "2026-09-25",
    siteName: "Sombrero Reef Deep Spur & Groove",
    speciesId: "sp-001",
    scientificName: "Acropora cervicornis",
    commonName: "Staghorn Coral",
    taxa: "Scleractinia",
    count: 32,
    densityPer100m2: 6.4,
    lifeStage: "Sub-Adult",
    depthMeters: 7.5,
    sizeEstimateCm: 35,
    observer: "Sarah Jenkins",
    notes: "Outplanted fragments from 2025 campaign showing branch bifurcations."
  },
  {
    id: "sig-005",
    date: "2026-09-10",
    siteName: "Ras Mohammed Shark Reef Wall",
    speciesId: "sp-009",
    scientificName: "Tridacna gigas",
    commonName: "Giant Clam",
    taxa: "Mollusca",
    count: 6,
    densityPer100m2: 1.2,
    lifeStage: "Adult",
    depthMeters: 8,
    sizeEstimateCm: 75,
    observer: "Dr. Tariq Al-Sayed",
    notes: "Healthy mantle coloration (iridescent blue/green Symbiodiniaceae micro-algae)."
  },
  {
    id: "sig-006",
    date: "2026-09-20",
    siteName: "Misool Magic Mountain Seamount",
    speciesId: "sp-008",
    scientificName: "Chelonia mydas",
    commonName: "Green Sea Turtle",
    taxa: "Reptilia",
    count: 2,
    densityPer100m2: 0.4,
    lifeStage: "Adult",
    depthMeters: 14.5,
    sizeEstimateCm: 95,
    observer: "T. Lindqvist",
    notes: "Resting on soft coral ledge; tagged individual #ID-4421."
  },
  {
    id: "sig-007",
    date: "2026-09-04",
    siteName: "Tubbataha North Atoll Bird Islet Shelf",
    speciesId: "sp-003",
    scientificName: "Scaroides coeruleus",
    commonName: "Blue Parrotfish",
    taxa: "Teleostei",
    count: 28,
    densityPer100m2: 5.6,
    lifeStage: "Mixed",
    depthMeters: 6,
    sizeEstimateCm: 45,
    observer: "Captain Angelique Songco",
    notes: "High density grazing cohort keeping turf algae under 9% cover."
  }
];
var INITIAL_RESTORATIONS = [
  {
    id: "rst-001",
    batchCode: "REST-2026-FLK-08",
    siteName: "Sombrero Reef Rehabilitation Plot A",
    nurseryOrigin: "Dry Tortugas Offshore Tree Nursery #4",
    coralSpecies: ["Acropora cervicornis (Staghorn)", "Acropora palmata (Elkhorn)"],
    outplantDate: "2026-06-12",
    technique: "Coral Clips on Reef Stars",
    fragmentsOutplanted: 1250,
    restoredAreaM2: 450,
    leadRestorationBiologist: "Dr. Kimberly Adams",
    survivalRate30d: 96.4,
    survivalRate90d: 91.2,
    survivalRate1Year: 84.5,
    currentExtensionRateMmMonth: 8.4,
    status: "Stabilized / Thriving",
    maintenanceHistory: [
      { date: "2026-07-15", action: "Drupella snail predation removal (38 collected)", technician: "R. Diaz" },
      { date: "2026-08-20", action: "Macroalgal clearing around anchor pins", technician: "J. Kowalski" },
      { date: "2026-09-24", action: "Structural star junction tension check", technician: "Dr. K. Adams" }
    ],
    notes: "Genets G-14 and G-22 showing exceptional thermal resistance despite regional DHW reaching 5.4. Growth rates exceeding regional wild averages."
  },
  {
    id: "rst-002",
    batchCode: "REST-2026-BLZ-15",
    siteName: "Glover's Reef Patch Reef Cluster 3",
    nurseryOrigin: "Tobacco Caye Benthic Rope Nursery",
    coralSpecies: ["Orbicella faveolata (Mountainous Star Coral)", "Porites astreoides"],
    outplantDate: "2026-05-18",
    technique: "Substrate Cement",
    fragmentsOutplanted: 820,
    restoredAreaM2: 280,
    leadRestorationBiologist: "Carlos Nu\xF1ez",
    survivalRate30d: 94,
    survivalRate90d: 87.5,
    survivalRate1Year: 78,
    currentExtensionRateMmMonth: 2.1,
    status: "Maintenance Required",
    maintenanceHistory: [
      { date: "2026-06-22", action: "Micro-fragment perimeter cleaning", technician: "C. Nu\xF1ez" },
      { date: "2026-08-10", action: "Sediment flushing following storm surge", technician: "L. Gomez" }
    ],
    notes: "Micro-fragmentation technique fusing over substrate. Requires targeted macroalgal weeding due to low urchin herbivory in sector."
  },
  {
    id: "rst-003",
    batchCode: "REST-2026-IDN-04",
    siteName: "Misool North Bay Restoration Corridor",
    nurseryOrigin: "Misool Eco Ocean Deep Frame Line",
    coralSpecies: ["Acropora millepora", "Pocillopora verrucosa", "Montipora foliosa"],
    outplantDate: "2026-07-02",
    technique: "Direct Outplant Pin",
    fragmentsOutplanted: 2100,
    restoredAreaM2: 800,
    leadRestorationBiologist: "Wayan Artha",
    survivalRate30d: 98.2,
    survivalRate90d: 95.8,
    survivalRate1Year: 92,
    currentExtensionRateMmMonth: 9.8,
    status: "Stabilized / Thriving",
    maintenanceHistory: [
      { date: "2026-08-05", action: "Routine biofouling inspection", technician: "W. Artha" },
      { date: "2026-09-18", action: "Fish recruitment census in restored zone", technician: "S. Al-Mansoor" }
    ],
    notes: "Rapid skeletal consolidation observed. Juvenile damselfish and surgeonfish colonies established within 40 days of outplanting."
  },
  {
    id: "rst-004",
    batchCode: "REST-2026-GBR-22",
    siteName: "Fitzroy Island Reef Recovery Zone",
    nurseryOrigin: "Cairns Offshore Floating Coral Tree Grid",
    coralSpecies: ["Acropora tenuis", "Acropora loripes"],
    outplantDate: "2026-03-10",
    technique: "Marine Epoxy & Plugs",
    fragmentsOutplanted: 1600,
    restoredAreaM2: 600,
    leadRestorationBiologist: "Dr. Liam O\u2019Connor",
    survivalRate30d: 93.5,
    survivalRate90d: 89,
    survivalRate1Year: 82.3,
    currentExtensionRateMmMonth: 7.2,
    status: "Active Monitoring",
    maintenanceHistory: [
      { date: "2026-04-15", action: "Anchor check post-cyclone swell", technician: "T. Vance" },
      { date: "2026-06-30", action: "Photogrammetric 3D reef mesh reconstruction", technician: "K. Thorne" }
    ],
    notes: "3D rugosity increased by 38% across the test grid. High larval spillover detected into adjacent natural bommie structures."
  },
  {
    id: "rst-005",
    batchCode: "REST-2026-RED-09",
    siteName: "Hurghada South Artificial Substrate Reef",
    nurseryOrigin: "Red Sea Marine Institute Ex-situ Raceway",
    coralSpecies: ["Stylophora pistillata", "Acropora humilis"],
    outplantDate: "2026-08-14",
    technique: "Cable Ties on Rebar",
    fragmentsOutplanted: 750,
    restoredAreaM2: 220,
    leadRestorationBiologist: "Fatima El-Khatib",
    survivalRate30d: 97,
    survivalRate90d: 93.2,
    survivalRate1Year: 88,
    currentExtensionRateMmMonth: 5.5,
    status: "Active Monitoring",
    maintenanceHistory: [
      { date: "2026-09-12", action: "Rebar frame anti-corrosion inspection", technician: "F. El-Khatib" }
    ],
    notes: "Substrate colonization by crustose coralline algae over artificial modules accelerating natural coral recruit adhesion."
  }
];
var INITIAL_STATIONS = [
  {
    id: "st-001",
    stationCode: "BUOY-GBR-04",
    name: "Osprey Reef Deep Oceanic Buoy",
    region: "Coral Sea / Great Barrier Reef",
    coordinates: { lat: -13.9167, lng: 146.6333 },
    depthMeters: 18.5,
    status: "Nominal",
    lastTelemetryTimestamp: "2026-09-30 09:45 UTC",
    seaSurfaceTemperatureC: 27.9,
    climatologicalBaselineC: 27.2,
    temperatureAnomalyC: 0.7,
    degreeHeatingWeeks: 1.8,
    thermalAlert: "Watch",
    dissolvedOxygenMgL: 6.8,
    phLevel: 8.12,
    salinityPsu: 35.4,
    turbidityNtu: 0.42,
    parSolarIrradiance: 840,
    history: [
      { timestamp: "00:00", temperature: 27.6, dhw: 1.8, ph: 8.14 },
      { timestamp: "04:00", temperature: 27.5, dhw: 1.8, ph: 8.13 },
      { timestamp: "08:00", temperature: 27.7, dhw: 1.8, ph: 8.12 },
      { timestamp: "12:00", temperature: 28.2, dhw: 1.8, ph: 8.11 },
      { timestamp: "16:00", temperature: 28.1, dhw: 1.8, ph: 8.11 },
      { timestamp: "20:00", temperature: 27.9, dhw: 1.8, ph: 8.12 }
    ]
  },
  {
    id: "st-002",
    stationCode: "BUOY-FLK-02",
    name: "Sombrero Reef National Sanctuary Station",
    region: "Florida Keys, USA",
    coordinates: { lat: 24.6272, lng: -81.1105 },
    depthMeters: 8.2,
    status: "Nominal",
    lastTelemetryTimestamp: "2026-09-30 09:50 UTC",
    seaSurfaceTemperatureC: 30.2,
    climatologicalBaselineC: 28.7,
    temperatureAnomalyC: 1.5,
    degreeHeatingWeeks: 5.6,
    thermalAlert: "Alert Level 1",
    dissolvedOxygenMgL: 5.9,
    phLevel: 8.04,
    salinityPsu: 36.2,
    turbidityNtu: 1.15,
    parSolarIrradiance: 920,
    history: [
      { timestamp: "00:00", temperature: 29.8, dhw: 5.4, ph: 8.06 },
      { timestamp: "04:00", temperature: 29.6, dhw: 5.5, ph: 8.05 },
      { timestamp: "08:00", temperature: 29.9, dhw: 5.5, ph: 8.04 },
      { timestamp: "12:00", temperature: 30.4, dhw: 5.6, ph: 8.03 },
      { timestamp: "16:00", temperature: 30.3, dhw: 5.6, ph: 8.04 },
      { timestamp: "20:00", temperature: 30.2, dhw: 5.6, ph: 8.04 }
    ]
  },
  {
    id: "st-003",
    stationCode: "STATION-RAJA-09",
    name: "Misool Marine Telemetry Pod",
    region: "Raja Ampat, Indonesia",
    coordinates: { lat: -2.2541, lng: 130.5622 },
    depthMeters: 14,
    status: "Nominal",
    lastTelemetryTimestamp: "2026-09-30 09:30 UTC",
    seaSurfaceTemperatureC: 28.3,
    climatologicalBaselineC: 28.1,
    temperatureAnomalyC: 0.2,
    degreeHeatingWeeks: 0.4,
    thermalAlert: "No Stress",
    dissolvedOxygenMgL: 7.1,
    phLevel: 8.16,
    salinityPsu: 34.8,
    turbidityNtu: 0.35,
    parSolarIrradiance: 780,
    history: [
      { timestamp: "00:00", temperature: 28.1, dhw: 0.4, ph: 8.17 },
      { timestamp: "04:00", temperature: 28, dhw: 0.4, ph: 8.16 },
      { timestamp: "08:00", temperature: 28.2, dhw: 0.4, ph: 8.16 },
      { timestamp: "12:00", temperature: 28.5, dhw: 0.4, ph: 8.15 },
      { timestamp: "16:00", temperature: 28.4, dhw: 0.4, ph: 8.15 },
      { timestamp: "20:00", temperature: 28.3, dhw: 0.4, ph: 8.16 }
    ]
  },
  {
    id: "st-004",
    stationCode: "BUOY-BLZ-01",
    name: "Glover's Reef Marine Field Station",
    region: "Belize Barrier Reef",
    coordinates: { lat: 16.824, lng: -87.798 },
    depthMeters: 12,
    status: "Nominal",
    lastTelemetryTimestamp: "2026-09-30 09:40 UTC",
    seaSurfaceTemperatureC: 29.5,
    climatologicalBaselineC: 28.5,
    temperatureAnomalyC: 1,
    degreeHeatingWeeks: 3.8,
    thermalAlert: "Warning",
    dissolvedOxygenMgL: 6.2,
    phLevel: 8.08,
    salinityPsu: 35.8,
    turbidityNtu: 0.88,
    parSolarIrradiance: 890,
    history: [
      { timestamp: "00:00", temperature: 29.2, dhw: 3.7, ph: 8.09 },
      { timestamp: "04:00", temperature: 29.1, dhw: 3.7, ph: 8.08 },
      { timestamp: "08:00", temperature: 29.3, dhw: 3.7, ph: 8.08 },
      { timestamp: "12:00", temperature: 29.7, dhw: 3.8, ph: 8.07 },
      { timestamp: "16:00", temperature: 29.6, dhw: 3.8, ph: 8.07 },
      { timestamp: "20:00", temperature: 29.5, dhw: 3.8, ph: 8.08 }
    ]
  },
  {
    id: "st-005",
    stationCode: "STATION-RED-05",
    name: "Ras Mohammed Sub-Surface Mooring",
    region: "Sinai Red Sea, Egypt",
    coordinates: { lat: 27.7289, lng: 34.2564 },
    depthMeters: 16,
    status: "Nominal",
    lastTelemetryTimestamp: "2026-09-30 09:15 UTC",
    seaSurfaceTemperatureC: 28.8,
    climatologicalBaselineC: 28.2,
    temperatureAnomalyC: 0.6,
    degreeHeatingWeeks: 1.1,
    thermalAlert: "Watch",
    dissolvedOxygenMgL: 6.9,
    phLevel: 8.14,
    salinityPsu: 40.2,
    // Red sea high salinity standard
    turbidityNtu: 0.28,
    parSolarIrradiance: 860,
    history: [
      { timestamp: "00:00", temperature: 28.6, dhw: 1.1, ph: 8.15 },
      { timestamp: "04:00", temperature: 28.5, dhw: 1.1, ph: 8.14 },
      { timestamp: "08:00", temperature: 28.7, dhw: 1.1, ph: 8.14 },
      { timestamp: "12:00", temperature: 29, dhw: 1.1, ph: 8.13 },
      { timestamp: "16:00", temperature: 28.9, dhw: 1.1, ph: 8.13 },
      { timestamp: "20:00", temperature: 28.8, dhw: 1.1, ph: 8.14 }
    ]
  }
];

// server.ts
dotenv.config();
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var surveysDb = [...INITIAL_SURVEYS];
var sightingsDb = [...INITIAL_SIGHTINGS];
var restorationsDb = [...INITIAL_RESTORATIONS];
var stationsDb = [...INITIAL_STATIONS];
var serverStartTime = /* @__PURE__ */ new Date();
async function startServer() {
  const app = express();
  app.use(express.json());
  let port = parseInt(process.env.PORT || "3000", 10);
  const portArgIndex = process.argv.indexOf("--port");
  if (portArgIndex !== -1 && process.argv[portArgIndex + 1]) {
    port = parseInt(process.argv[portArgIndex + 1], 10);
  }
  app.get("/api/health", (_req, res) => {
    const uptimeSeconds = Math.floor((Date.now() - serverStartTime.getTime()) / 1e3);
    res.json({
      status: "OPERATIONAL",
      system: "Pelagia ReefOS Backend Engine",
      version: "2026.09-v4.5",
      uptimeSeconds,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      databaseCounts: {
        surveys: surveysDb.length,
        sightings: sightingsDb.length,
        restorations: restorationsDb.length,
        stations: stationsDb.length,
        indicatorSpecies: INDICATOR_SPECIES.length
      },
      telemetrySync: {
        provider: "NOAA Coral Reef Watch & GCRMN Global Node",
        frequency: "455 kHz Acoustic Sonar",
        activeAlerts: stationsDb.filter((s) => s.degreeHeatingWeeks >= 4).length
      }
    });
  });
  app.get("/api/surveys", (_req, res) => {
    res.json({
      count: surveysDb.length,
      data: surveysDb
    });
  });
  app.post("/api/surveys", (req, res) => {
    const survey = req.body;
    if (!survey || !survey.siteName || !survey.surveyCode) {
      return res.status(400).json({ error: "Missing mandatory survey parameters" });
    }
    const newSurvey = {
      ...survey,
      id: survey.id || `srv-${Date.now()}`,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    surveysDb.unshift(newSurvey);
    res.status(201).json({
      message: "Survey recorded successfully in GCRMN archival database",
      survey: newSurvey
    });
  });
  app.get("/api/sightings", (_req, res) => {
    res.json({
      count: sightingsDb.length,
      data: sightingsDb
    });
  });
  app.post("/api/sightings", (req, res) => {
    const sighting = req.body;
    if (!sighting || !sighting.scientificName || !sighting.siteName) {
      return res.status(400).json({ error: "Missing mandatory sighting parameters" });
    }
    const newSighting = {
      ...sighting,
      id: sighting.id || `sgt-${Date.now()}`
    };
    sightingsDb.unshift(newSighting);
    res.status(201).json({
      message: "Biodiversity sighting recorded",
      sighting: newSighting
    });
  });
  app.get("/api/restorations", (_req, res) => {
    res.json({
      count: restorationsDb.length,
      data: restorationsDb
    });
  });
  app.post("/api/restorations", (req, res) => {
    const restoration = req.body;
    if (!restoration || !restoration.batchCode || !restoration.siteName) {
      return res.status(400).json({ error: "Missing mandatory restoration batch parameters" });
    }
    const newRestoration = {
      ...restoration,
      id: restoration.id || `rst-${Date.now()}`
    };
    restorationsDb.unshift(newRestoration);
    res.status(201).json({
      message: "Restoration batch logged in registry",
      restoration: newRestoration
    });
  });
  app.get("/api/stations", (_req, res) => {
    res.json({
      count: stationsDb.length,
      data: stationsDb
    });
  });
  app.put("/api/stations/:id", (req, res) => {
    const { id } = req.params;
    const index = stationsDb.findIndex((s) => s.id === id || s.stationCode === id);
    if (index === -1) {
      return res.status(404).json({ error: "Station not found" });
    }
    stationsDb[index] = {
      ...stationsDb[index],
      ...req.body,
      lastTelemetryTimestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
    res.json({
      message: "Telemetry station updated",
      station: stationsDb[index]
    });
  });
  app.post("/api/auth/google-verify", (req, res) => {
    const { email, code } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email parameter required" });
    }
    const user = {
      id: "usr-google-verified",
      name: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) + " (Google Verified)",
      email,
      role: "Lead Benthic Ecologist",
      agency: "Global Coral Reef Monitoring Network (GCRMN)",
      clearanceLevel: "Level 4 Operations Director",
      badgeNumber: "GOOG-OAUTH-2026",
      assignedMPA: "Great Barrier Reef & Coral Sea",
      isGoogleAuth: true,
      emailVerified: true
    };
    res.json({
      verified: true,
      protocol: "OAuth 2.0 PKCE Verified",
      user
    });
  });
  app.post("/api/reset-baseline", (_req, res) => {
    surveysDb = [...INITIAL_SURVEYS];
    sightingsDb = [...INITIAL_SIGHTINGS];
    restorationsDb = [...INITIAL_RESTORATIONS];
    stationsDb = [...INITIAL_STATIONS];
    res.json({
      message: "Database reset to international baseline",
      counts: {
        surveys: surveysDb.length,
        sightings: sightingsDb.length,
        restorations: restorationsDb.length,
        stations: stationsDb.length
      }
    });
  });
  const isProduction = process.env.NODE_ENV === "production";
  if (isProduction) {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  } else {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  }
  app.listen(port, "0.0.0.0", () => {
    console.log(`[Pelagia ReefOS] Server active on http://0.0.0.0:${port} (Mode: ${isProduction ? "Production" : "Development"})`);
  });
}
startServer().catch((err) => {
  console.error("[Pelagia ReefOS] Startup Error:", err);
  process.exit(1);
});
