import React, { useState, useEffect } from 'react';
import {
  CoralReefSurvey,
  BiodiversitySighting,
  RestorationActivity,
  OceanographicStation,
} from '../types/marine';
import {
  Shield,
  ArrowRight,
  Flame,
  AlertTriangle,
  Waves,
  MapPin,
  Compass,
  FileSpreadsheet,
  CheckCircle2,
  Activity,
  Play,
  Crosshair,
  Radio,
  Cpu,
  Layers,
  Terminal,
  Volume2,
  Zap,
  Gauge,
  Navigation,
  Eye,
} from 'lucide-react';
import { playUiClick, playSonarPing, playAlertWarning, playHoloActivate } from '../utils/audio';

interface AgencyPortalLandingProps {
  surveys: CoralReefSurvey[];
  sightings: BiodiversitySighting[];
  restorations: RestorationActivity[];
  stations: OceanographicStation[];
  onNavigateTab: (tab: 'surveys' | 'biodiversity' | 'restoration' | 'monitoring' | 'map') => void;
  onOpenWizard: () => void;
  onOpenSimulator: () => void;
  onOpenReportModal: () => void;
  onPlayEntryAnimation: () => void;
}

export const AgencyPortalLanding: React.FC<AgencyPortalLandingProps> = ({
  surveys,
  sightings,
  restorations,
  stations,
  onNavigateTab,
  onOpenWizard,
  onOpenSimulator,
  onOpenReportModal,
  onPlayEntryAnimation,
}) => {
  const [selectedDepthLayer, setSelectedDepthLayer] = useState<'surface' | 'crest' | 'mesophotic' | 'bathyal'>('crest');
  const [activeRadarTarget, setActiveRadarTarget] = useState<string | null>('GBR-OSP-08');
  const [gliderDepth, setGliderDepth] = useState<number>(24.8);
  const [gliderSpeed, setGliderSpeed] = useState<number>(1.85);

  // Simulated telemetry clock for AUV Glider
  useEffect(() => {
    const timer = setInterval(() => {
      setGliderDepth(prev => {
        const delta = (Math.random() - 0.5) * 0.4;
        return Number(Math.max(12, Math.min(36, prev + delta)).toFixed(1));
      });
      setGliderSpeed(prev => {
        const delta = (Math.random() - 0.5) * 0.08;
        return Number(Math.max(1.2, Math.min(2.4, prev + delta)).toFixed(2));
      });
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const avgHardCoral = (
    surveys.reduce((acc, s) => acc + s.benthicComposition.hardCoralCover, 0) / (surveys.length || 1)
  ).toFixed(1);

  const totalFragments = restorations.reduce((acc, r) => acc + r.fragmentsOutplanted, 0);
  const avgSurvival90d = (
    restorations.reduce((acc, r) => acc + r.survivalRate90d, 0) / (restorations.length || 1)
  ).toFixed(1);

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* 1. Futuristic Cybernetic Command Bridge Hero Chassis */}
      <section className="relative bg-slate-950 border border-cyan-500/30 p-6 sm:p-8 overflow-hidden hud-grid shadow-[0_0_50px_rgba(2,132,199,0.08)]">
        {/* Laser Cut-Corner Accents */}
        <span className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
        <span className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
        <span className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
        <span className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />

        {/* Diagonal Tech Hatch Lines in Corner */}
        <div className="absolute top-0 right-16 w-32 h-6 bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(6,182,212,0.15)_4px,rgba(6,182,212,0.15)_8px)] pointer-events-none" />

        {/* Ambient Oceanic Holographic Glow */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Command Telemetry & Tactical Flight Deck */}
          <div className="lg:col-span-7 space-y-5">
            {/* Tactical Datum Header */}
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
              <span className="px-2 py-0.5 bg-cyan-950/90 border border-cyan-400/60 text-cyan-300 font-bold tracking-wider flex items-center gap-1.5 shadow-[0_0_10px_rgba(34,211,238,0.2)]">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                <span>CYBERNETIC SENTINEL ACTIVE // DEEP-SEA SECTOR 09</span>
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400">GCRMN NODE 408</span>
              <span className="text-slate-600">|</span>
              <span className="text-cyan-400 font-bold">WGS84 GEOSPATIAL MATRIX</span>
            </div>

            <div>
              <h1 className="text-3xl sm:text-5xl font-extrabold font-['Chakra_Petch'] tracking-tight text-slate-100 uppercase text-balance leading-none">
                Deep Ocean Ecological Command Nexus
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans mt-3 max-w-xl">
                Autonomous marine conservation intelligence system. Orchestrating robotic benthic transects,
                high-resolution multibeam acoustic bathymetry, bioceramic coral nursery propagation, and real-time planetary oceanographic telemetry.
              </p>
            </div>

            {/* Depth Stratification Selector */}
            <div className="bg-slate-900/90 border border-cyan-500/30 p-3.5 rounded space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1 text-cyan-300 font-semibold">
                  <Compass className="w-3.5 h-3.5 text-cyan-400" />
                  <span>TARGET BATHYMETRIC STRATIFICATION</span>
                </span>
                <span className="text-cyan-400 font-bold">CURRENT: -{gliderDepth}m MSL</span>
              </div>
              <div className="grid grid-cols-4 gap-2 font-mono text-[11px]">
                {[
                  { id: 'surface', label: '0m LAGOON', desc: 'Atoll Flat' },
                  { id: 'crest', label: '-12m CREST', desc: 'Spur & Groove' },
                  { id: 'mesophotic', label: '-30m WALL', desc: 'Fore-Reef Wall' },
                  { id: 'bathyal', label: '-110m ABYSS', desc: 'Deep Trench' },
                ].map((layer) => (
                  <button
                    key={layer.id}
                    type="button"
                    onClick={() => {
                      playUiClick(1600);
                      setSelectedDepthLayer(layer.id as typeof selectedDepthLayer);
                    }}
                    className={`py-2 px-2 rounded border text-center transition-all ${
                      selectedDepthLayer === layer.id
                        ? 'bg-cyan-500/25 text-cyan-200 border-cyan-400 font-bold shadow-[0_0_12px_rgba(34,211,238,0.3)]'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div className="font-bold">{layer.label}</div>
                    <div className="text-[9px] text-slate-400">{layer.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Futuristic Action Commands */}
            <div className="pt-1 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  playSonarPing(1400);
                  onOpenWizard();
                }}
                className="px-5 py-2.5 text-xs font-mono font-bold uppercase text-slate-950 bg-cyan-400 hover:bg-cyan-300 tracking-wider shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all flex items-center gap-2 group rounded"
              >
                <span>Deploy Field Transect Wizard</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => {
                  playSonarPing(1800);
                  onPlayEntryAnimation();
                }}
                className="px-4 py-2.5 text-xs font-mono font-bold uppercase text-cyan-300 bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-400/80 transition-all flex items-center gap-2 rounded shadow-[0_0_15px_rgba(6,182,212,0.2)]"
              >
                <Play className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
                <span>3D Sonar Dive (2s)</span>
              </button>

              <button
                onClick={() => {
                  playAlertWarning();
                  onOpenSimulator();
                }}
                className="px-4 py-2.5 text-xs font-mono font-bold uppercase text-amber-300 bg-amber-950/50 hover:bg-amber-900/60 border border-amber-500/70 transition-colors flex items-center gap-1.5 rounded"
              >
                <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>Thermal Heatwave Sim</span>
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Multibeam Sonar Radar Scope */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full border-2 border-cyan-500/50 bg-slate-950 flex items-center justify-center overflow-hidden shadow-[0_0_40px_rgba(6,182,212,0.25)]">
              {/* Concentric Sonar Range Rings */}
              <div className="absolute inset-4 rounded-full border border-cyan-500/20" />
              <div className="absolute inset-12 rounded-full border border-cyan-500/25" />
              <div className="absolute inset-20 rounded-full border border-cyan-500/35" />
              <div className="absolute inset-28 rounded-full border border-cyan-400/50" />

              {/* Crosshair Axes */}
              <div className="absolute w-full h-[1px] bg-cyan-500/30" />
              <div className="absolute h-full w-[1px] bg-cyan-500/30" />

              {/* Azimuth Angle Marks */}
              <span className="absolute top-1 text-[8px] font-mono text-cyan-400">000°</span>
              <span className="absolute right-1.5 text-[8px] font-mono text-cyan-400">090°</span>
              <span className="absolute bottom-1 text-[8px] font-mono text-cyan-400">180°</span>
              <span className="absolute left-1.5 text-[8px] font-mono text-cyan-400">270°</span>

              {/* Rotating Sonar Radar Beam */}
              <div className="absolute inset-0 radar-sweep pointer-events-none origin-center">
                <div className="w-1/2 h-1/2 bg-gradient-to-br from-cyan-400/40 via-cyan-500/10 to-transparent origin-bottom-right" />
              </div>

              {/* Clickable Radar Targets with Audio Pings */}
              <button
                type="button"
                onClick={() => {
                  playSonarPing(1800);
                  setActiveRadarTarget('GBR-OSP-08');
                }}
                className="absolute top-16 left-20 group focus:outline-none"
                title="GBR Osprey Reef Transect"
              >
                <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping absolute inset-0 opacity-75" />
                <div className="w-3 h-3 rounded-full bg-cyan-400 border border-slate-950 relative z-10" />
              </button>

              <button
                type="button"
                onClick={() => {
                  playSonarPing(1400);
                  setActiveRadarTarget('BUOY-NOAA-410');
                }}
                className="absolute bottom-20 right-16 group focus:outline-none"
                title="Oceanographic Telemetry Buoy"
              >
                <div className="w-3 h-3 rounded-full bg-amber-400 animate-pulse border border-slate-950" />
              </button>

              <button
                type="button"
                onClick={() => {
                  playSonarPing(2200);
                  setActiveRadarTarget('NURSERY-TREE-04');
                }}
                className="absolute top-28 right-24 group focus:outline-none"
                title="Coral Tree Nursery Array"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-slate-950" />
              </button>

              {/* Center Tactical Anchor */}
              <div className="z-10 bg-slate-950/90 border border-cyan-400 px-2 py-1 text-center font-mono text-[9px] text-cyan-300 backdrop-blur-sm">
                <div>SWEEP ACTIVE</div>
                <div className="text-[11px] font-bold text-slate-100">455 kHz</div>
              </div>
            </div>

            {/* Target HUD Details */}
            <div className="mt-3 p-2 bg-slate-900 border border-slate-800 rounded w-full max-w-xs text-center font-mono text-[11px] text-slate-300">
              <span className="text-slate-400">ACTIVE ACOUSTIC TARGET:</span>{' '}
              <strong className="text-cyan-300">{activeRadarTarget || 'GBR-OSP-08'}</strong>
              <div className="text-[10px] text-slate-400 mt-0.5">
                AZIMUTH: 042° · RANGE: 1.4 km · STATUS: STREAMING
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Autonomous Underwater Vehicle (AUV) Glider Telemetry Feed */}
      <section className="bg-slate-950 border border-cyan-500/20 p-5 rounded relative overflow-hidden font-mono text-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
          <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase tracking-wider">
            <Navigation className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>Autonomous Glider AUV "NAUTILUS-07" // Real-Time Telemetry Stream</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span className="text-emerald-400 font-bold">● LINK 100% OK</span>
            <span>BATTERY: 88.4%</span>
            <span>MISSION: TRANSECT TRAN-84</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
          <div className="bg-slate-900/80 p-3 rounded border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase">Subsea Sounding Depth</div>
            <div className="text-xl font-bold text-cyan-300 tabular-nums">-{gliderDepth} m</div>
            <div className="text-[9px] text-slate-400">Fore-reef dropoff slope</div>
          </div>

          <div className="bg-slate-900/80 p-3 rounded border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase">Acoustic Speed (Doppler)</div>
            <div className="text-xl font-bold text-emerald-400 tabular-nums">{gliderSpeed} kts</div>
            <div className="text-[9px] text-slate-400">Surface current vector -0.4kt</div>
          </div>

          <div className="bg-slate-900/80 p-3 rounded border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase">Forward Sonar Obstacle Clear</div>
            <div className="text-xl font-bold text-cyan-400 tabular-nums">48.2 m</div>
            <div className="text-[9px] text-slate-400">Spur & groove barrier clear</div>
          </div>

          <div className="bg-slate-900/80 p-3 rounded border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase">Seabed Rugosity (3D)</div>
            <div className="text-xl font-bold text-amber-300 tabular-nums">2.64 RHI</div>
            <div className="text-[9px] text-slate-400">High structural complexity</div>
          </div>
        </div>
      </section>

      {/* 3. Tactical Crisis Interventions (High-Priority Directives) */}
      <section className="bg-slate-950 border border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-amber-400 font-bold">
            <AlertTriangle className="w-4 h-4 animate-pulse" />
            <span>Active Rapid Ecological Directives</span>
          </div>
          <span className="font-mono text-[11px] text-slate-400">2 HIGH-PRIORITY THREATS</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          {/* Directive 1: COTS Cull */}
          <div className="bg-slate-900/80 border border-amber-800/60 p-4 space-y-2.5 relative group hover:border-amber-500 transition-colors">
            <div className="flex items-center justify-between text-[10px] text-amber-400">
              <span>DIRECTIVE 01: CORAL PREDATOR INTERCEPTION</span>
              <span className="bg-amber-950 text-amber-300 px-1.5 py-0.5 rounded border border-amber-700/60 font-bold">
                HIGH THREAT
              </span>
            </div>
            <h4 className="text-slate-100 font-bold text-sm">
              Crown-of-Thorns Starfish (COTS) Cluster at Osprey Fore-Reef
            </h4>
            <p className="text-slate-300 text-xs font-sans leading-relaxed">
              Sub-surface census identified 0.18 indiv/100m² approaching critical outbreak threshold.
              Sodium bisulphate single-shot injection diver squads mobilized on 24h standby.
            </p>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Action: Scuba Cull Roster</span>
              <button
                onClick={() => {
                  playUiClick();
                  onNavigateTab('biodiversity');
                }}
                className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
              >
                <span>Inspect Sighting Log →</span>
              </button>
            </div>
          </div>

          {/* Directive 2: SCTLD Disease Containment */}
          <div className="bg-slate-900/80 border border-rose-800/60 p-4 space-y-2.5 relative group hover:border-rose-500 transition-colors">
            <div className="flex items-center justify-between text-[10px] text-rose-400">
              <span>DIRECTIVE 02: PATHOGEN CONTAINMENT PROTOCOL</span>
              <span className="bg-rose-950 text-rose-300 px-1.5 py-0.5 rounded border border-rose-700/60 font-bold">
                CRITICAL THREAT
              </span>
            </div>
            <h4 className="text-slate-100 font-bold text-sm">
              Stony Coral Tissue Loss Disease (SCTLD) Lesions in Sector 3
            </h4>
            <p className="text-slate-300 text-xs font-sans leading-relaxed">
              Tissue necrosis verified on Orbicella faveolata massive colonies.
              Topical antibiotic barrier paste applied; 14-day photogrammetric margin audit initiated.
            </p>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Action: Margin Biopsy & Seal</span>
              <button
                onClick={() => {
                  playUiClick();
                  onNavigateTab('surveys');
                }}
                className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
              >
                <span>Inspect Transect #BLZ →</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. The 4 Specialized Tactical Mission Bays */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold font-['Chakra_Petch'] uppercase tracking-wider text-slate-100">
              Specialized Operational Command Bays
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Access localized telemetry bays, data normalization spreadsheets, and nursery pipelines.
            </p>
          </div>
          <button
            onClick={() => {
              playUiClick();
              onOpenReportModal();
            }}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Generate Full Agency Audit Package</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Module 1: Surveys */}
          <div
            onClick={() => {
              playUiClick();
              onNavigateTab('surveys');
            }}
            className="bg-slate-950 border border-slate-800 p-5 hover:border-cyan-400 transition-all cursor-pointer group flex flex-col justify-between relative overflow-hidden shadow-lg hover:shadow-cyan-500/10"
          >
            <span className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-cyan-400" />
            <div>
              <div className="text-[10px] font-mono uppercase text-cyan-400 tracking-wider mb-2">
                MODULE 01 // TRANSECT_OPS
              </div>
              <h3 className="text-base font-bold text-slate-100 font-['Chakra_Petch'] uppercase group-hover:text-cyan-300 mb-2">
                Benthic Line Surveys
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans mb-4">
                50m line intercept transects, point intercept tallies, photo-quadrat machine classification, and bleaching severity indices.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-900 flex items-center justify-between text-xs font-mono text-cyan-400 font-semibold">
              <span>{surveys.length} RECORDED</span>
              <span className="group-hover:translate-x-1 transition-transform">INITIALIZE →</span>
            </div>
          </div>

          {/* Module 2: Biodiversity */}
          <div
            onClick={() => {
              playUiClick();
              onNavigateTab('biodiversity');
            }}
            className="bg-slate-950 border border-slate-800 p-5 hover:border-emerald-400 transition-all cursor-pointer group flex flex-col justify-between relative overflow-hidden shadow-lg hover:shadow-emerald-500/10"
          >
            <span className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-emerald-400" />
            <div>
              <div className="text-[10px] font-mono uppercase text-emerald-400 tracking-wider mb-2">
                MODULE 02 // TROPHIC_CENSUS
              </div>
              <h3 className="text-base font-bold text-slate-100 font-['Chakra_Petch'] uppercase group-hover:text-cyan-300 mb-2">
                Biodiversity Sentinels
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans mb-4">
                Keystone indicator species registry, IUCN Red List threat ratings, herbivore grazing ratios, and diver census logs.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-900 flex items-center justify-between text-xs font-mono text-emerald-400 font-semibold">
              <span>{sightings.length} SIGHTINGS</span>
              <span className="group-hover:translate-x-1 transition-transform">INITIALIZE →</span>
            </div>
          </div>

          {/* Module 3: Restoration */}
          <div
            onClick={() => {
              playUiClick();
              onNavigateTab('restoration');
            }}
            className="bg-slate-950 border border-slate-800 p-5 hover:border-blue-400 transition-all cursor-pointer group flex flex-col justify-between relative overflow-hidden shadow-lg hover:shadow-blue-500/10"
          >
            <span className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-blue-400" />
            <div>
              <div className="text-[10px] font-mono uppercase text-blue-400 tracking-wider mb-2">
                MODULE 03 // RESTORATION_LAB
              </div>
              <h3 className="text-base font-bold text-slate-100 font-['Chakra_Petch'] uppercase group-hover:text-cyan-300 mb-2">
                Nursery & Outplants
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans mb-4">
                Mid-water coral trees, micro-fragmentation raceways, Mars Reef Star stabilization, and 365-day survivorship curves.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-900 flex items-center justify-between text-xs font-mono text-blue-400 font-semibold">
              <span>{restorations.length} BATCHES</span>
              <span className="group-hover:translate-x-1 transition-transform">INITIALIZE →</span>
            </div>
          </div>

          {/* Module 4: Telemetry */}
          <div
            onClick={() => {
              playUiClick();
              onNavigateTab('monitoring');
            }}
            className="bg-slate-950 border border-slate-800 p-5 hover:border-amber-400 transition-all cursor-pointer group flex flex-col justify-between relative overflow-hidden shadow-lg hover:shadow-amber-500/10"
          >
            <span className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-amber-400" />
            <div>
              <div className="text-[10px] font-mono uppercase text-amber-400 tracking-wider mb-2">
                MODULE 04 // CLIMATE_TELEMETRY
              </div>
              <h3 className="text-base font-bold text-slate-100 font-['Chakra_Petch'] uppercase group-hover:text-cyan-300 mb-2">
                Oceanic In-Situ Buoys
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans mb-4">
                Real-time SST, NOAA Degree Heating Weeks (DHW), ocean acidification pH, dissolved oxygen, and heatwave simulations.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-900 flex items-center justify-between text-xs font-mono text-amber-400 font-semibold">
              <span>{stations.length} BUOYS SYNCED</span>
              <span className="group-hover:translate-x-1 transition-transform">INITIALIZE →</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Sentinel MPA Tactical Station Nodes */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold font-['Chakra_Petch'] uppercase tracking-wider text-slate-100">
              Long-Term Sentinel Oceanic Sectors
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              High-resolution bathymetric telemetry stations streaming directly to GCRMN Global Node.
            </p>
          </div>
          <button
            onClick={() => {
              playUiClick();
              onNavigateTab('map');
            }}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Open Geospatial Zonation Matrix →</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Sector 1: GBR */}
          <div className="bg-slate-950 border border-slate-800 p-4 space-y-3 relative group hover:border-cyan-400 transition-colors">
            <span className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-400" />
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>COORD: 13.9167°S / 146.6333°E</span>
              <span className="text-cyan-400 font-bold">GBR-OSP-08</span>
            </div>
            <div className="relative h-32 overflow-hidden border border-slate-800 bg-slate-900">
              <img
                src="/src/assets/images/marine_biologist_diver_survey_1790787988736.jpg"
                alt="GBR Transect"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-2 left-2 text-[10px] font-mono text-cyan-300 bg-slate-950/90 px-2 py-0.5 border border-slate-800">
                Osprey Reef Fore-Reef Shelf
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-900/60 p-2.5 border border-slate-800/80">
              <div>Hard Coral: <span className="text-cyan-400 font-bold">46.2%</span></div>
              <div>RHI Health: <span className="text-emerald-400 font-bold">4.4 / 5</span></div>
              <div>DHW Stress: <span className="text-slate-300">1.8 °C-wks</span></div>
              <div>Status: <span className="text-emerald-400">Validated</span></div>
            </div>
          </div>

          {/* Sector 2: Raja Ampat */}
          <div className="bg-slate-950 border border-slate-800 p-4 space-y-3 relative group hover:border-emerald-400 transition-colors">
            <span className="absolute top-0 right-0 w-2 h-2 border-t border-r border-emerald-400" />
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>COORD: 02.2541°S / 130.5622°E</span>
              <span className="text-emerald-400 font-bold">RAJA-MIS-14</span>
            </div>
            <div className="relative h-32 overflow-hidden border border-slate-800 bg-slate-900">
              <img
                src="/src/assets/images/coral_reef_ecosystem_1790787941171.jpg"
                alt="Raja Ampat Seamount"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-2 left-2 text-[10px] font-mono text-emerald-300 bg-slate-950/90 px-2 py-0.5 border border-slate-800">
                Misool Magic Mountain Seamount
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-900/60 p-2.5 border border-slate-800/80">
              <div>Hard Coral: <span className="text-cyan-400 font-bold">52.8%</span></div>
              <div>RHI Health: <span className="text-emerald-400 font-bold">4.8 / 5</span></div>
              <div>DHW Stress: <span className="text-emerald-400">0.4 °C-wks</span></div>
              <div>Status: <span className="text-emerald-400">Apex Prime</span></div>
            </div>
          </div>

          {/* Sector 3: Florida Keys Nursery */}
          <div className="bg-slate-950 border border-slate-800 p-4 space-y-3 relative group hover:border-amber-400 transition-colors">
            <span className="absolute top-0 right-0 w-2 h-2 border-t border-r border-amber-400" />
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>COORD: 24.6272°N / 081.1105°W</span>
              <span className="text-amber-400 font-bold">FKNMS-SOM-05</span>
            </div>
            <div className="relative h-32 overflow-hidden border border-slate-800 bg-slate-900">
              <img
                src="/src/assets/images/coral_nursery_restoration_1790787956472.jpg"
                alt="Florida Keys Nursery"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-2 left-2 text-[10px] font-mono text-amber-300 bg-slate-950/90 px-2 py-0.5 border border-slate-800">
                Sombrero Reef Outplant Plot
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-900/60 p-2.5 border border-slate-800/80">
              <div>Outplants: <span className="text-emerald-400 font-bold">1,250 frags</span></div>
              <div>Retention: <span className="text-cyan-400 font-bold">91.2% (90d)</span></div>
              <div>DHW Stress: <span className="text-amber-400 font-bold">5.6 °C-wks</span></div>
              <div>Status: <span className="text-amber-400">Watch Tier</span></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
