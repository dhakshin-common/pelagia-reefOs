import React, { useState } from 'react';
import { CoralReefSurvey, RestorationActivity, OceanographicStation } from '../types/marine';
import { Layers, MapPin, Radio, Sprout, Crosshair, Compass, Navigation, Zap } from 'lucide-react';
import { playUiClick, playSonarPing } from '../utils/audio';

interface SpatialReefMapProps {
  surveys: CoralReefSurvey[];
  restorations: RestorationActivity[];
  stations: OceanographicStation[];
  onSelectSurvey?: (survey: CoralReefSurvey) => void;
}

export const SpatialReefMap: React.FC<SpatialReefMapProps> = ({
  surveys,
  restorations,
  stations,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');
  const [showSurveys, setShowSurveys] = useState(true);
  const [showStations, setShowStations] = useState(true);
  const [showRestorations, setShowRestorations] = useState(true);
  const [activeItem, setActiveItem] = useState<{
    type: 'survey' | 'station' | 'restoration';
    data: CoralReefSurvey | OceanographicStation | RestorationActivity;
  } | null>(null);

  const [mouseCoords, setMouseCoords] = useState<{ lat: string; lng: string }>({
    lat: '14.2850° S',
    lng: '145.4210° E',
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xRatio = (e.clientX - rect.left) / rect.width;
    const yRatio = (e.clientY - rect.top) / rect.height;

    const lat = (-10 - yRatio * 20).toFixed(4);
    const lng = (130 + xRatio * 30).toFixed(4);
    setMouseCoords({
      lat: `${Math.abs(Number(lat))}° ${Number(lat) < 0 ? 'S' : 'N'}`,
      lng: `${Math.abs(Number(lng))}° ${Number(lng) < 0 ? 'W' : 'E'}`,
    });
  };

  return (
    <div className="space-y-4 font-sans">
      {/* 1. Map Control Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-950 border border-cyan-500/30 p-3.5 rounded hud-grid text-xs font-mono shadow-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-slate-100">
            <Compass className="w-4 h-4 text-cyan-400 animate-spin-slow" />
            <span className="font-['Chakra_Petch'] uppercase tracking-wider text-sm">
              Tactical Geospatial Marine GIS Matrix
            </span>
          </div>
          <span className="text-slate-600 hidden md:inline">|</span>
          <span className="text-cyan-400 hidden md:inline">
            WGS84 MULTIBEAM CONTOUR GRID
          </span>
        </div>

        {/* Layer Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-900 p-1 border border-slate-800 rounded">
            <button
              onClick={() => {
                playUiClick();
                setShowSurveys(!showSurveys);
              }}
              className={`px-2.5 py-1 rounded transition-all flex items-center gap-1 text-[11px] font-bold ${
                showSurveys ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/50 shadow-sm' : 'text-slate-500'
              }`}
            >
              <MapPin className="w-3 h-3" />
              <span>Transects ({surveys.length})</span>
            </button>

            <button
              onClick={() => {
                playUiClick();
                setShowStations(!showStations);
              }}
              className={`px-2.5 py-1 rounded transition-all flex items-center gap-1 text-[11px] font-bold ${
                showStations ? 'bg-amber-500/25 text-amber-300 border border-amber-500/50 shadow-sm' : 'text-slate-500'
              }`}
            >
              <Radio className="w-3 h-3" />
              <span>Buoys ({stations.length})</span>
            </button>

            <button
              onClick={() => {
                playUiClick();
                setShowRestorations(!showRestorations);
              }}
              className={`px-2.5 py-1 rounded transition-all flex items-center gap-1 text-[11px] font-bold ${
                showRestorations ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/50 shadow-sm' : 'text-slate-500'
              }`}
            >
              <Sprout className="w-3 h-3" />
              <span>Nurseries ({restorations.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Interactive Map Canvas Stage */}
      <div
        onMouseMove={handleMouseMove}
        className="relative w-full h-[540px] bg-slate-950 border border-cyan-500/40 rounded-xl overflow-hidden cursor-crosshair select-none shadow-[0_0_40px_rgba(2,132,199,0.1)]"
      >
        {/* Laser Corner Brackets */}
        <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400 z-20" />
        <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400 z-20" />
        <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400 z-20" />
        <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400 z-20" />

        {/* SVG Bathymetric Background Graphic */}
        <svg
          className="absolute inset-0 w-full h-full opacity-60 pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="oceanGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#082f49" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#020617" stopOpacity="0.95" />
            </radialGradient>
            <pattern id="grid" width="36" height="36" patternUnits="userSpaceOnUse">
              <path d="M 36 0 L 0 0 0 36" fill="none" stroke="#082f49" strokeWidth="0.8" opacity="0.6" />
            </pattern>
          </defs>

          <rect width="100%" height="100%" fill="url(#oceanGlow)" />
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Bathymetric depth contour isobaths */}
          <path
            d="M 50,220 Q 200,160 380,260 T 700,200 T 950,280 T 1200,220"
            fill="none"
            stroke="#0284c7"
            strokeWidth="1.2"
            strokeDasharray="4 4"
            opacity="0.4"
          />
          <path
            d="M 20,320 Q 250,280 440,360 T 780,310 T 1000,420 T 1280,330"
            fill="none"
            stroke="#0369a1"
            strokeWidth="1"
            opacity="0.3"
          />
          <path
            d="M 80,120 Q 320,80 500,180 T 880,110 T 1150,190"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1.5"
            opacity="0.3"
          />

          {/* Autonomous AUV Flight Path Vector */}
          <polyline
            fill="none"
            stroke="#22d3ee"
            strokeWidth="2"
            strokeDasharray="6 4"
            opacity="0.6"
            points="140,240 280,180 440,280 620,210 820,290 1020,220"
          />

          {/* Sanctuary Core Zone A */}
          <polygon
            points="140,90 320,110 300,240 120,200"
            fill="#06b6d4"
            fillOpacity="0.08"
            stroke="#06b6d4"
            strokeWidth="1.5"
            strokeDasharray="6 3"
          />
          <text x="145" y="115" fill="#38bdf8" fontSize="10" fontFamily="monospace" opacity="0.9" fontWeight="bold">
            SANCTUARY NO-TAKE CORE A
          </text>

          {/* Restoration Zone B */}
          <polygon
            points="520,180 720,210 690,340 480,310"
            fill="#10b981"
            fillOpacity="0.08"
            stroke="#10b981"
            strokeWidth="1.5"
            strokeDasharray="6 3"
          />
          <text x="530" y="205" fill="#34d399" fontSize="10" fontFamily="monospace" opacity="0.9" fontWeight="bold">
            HABITAT RESTORATION CORRIDOR B
          </text>

          {/* High Bleaching Risk Corridor C */}
          <polygon
            points="840,140 1080,170 1050,330 810,290"
            fill="#f59e0b"
            fillOpacity="0.08"
            stroke="#f59e0b"
            strokeWidth="1.5"
            strokeDasharray="6 3"
          />
          <text x="850" y="165" fill="#fbbf24" fontSize="10" fontFamily="monospace" opacity="0.9" fontWeight="bold">
            THERMAL WATCH SECTOR C
          </text>
        </svg>

        {/* Survey Transect Waypoint Markers */}
        {showSurveys &&
          surveys.map((srv, idx) => {
            const posX = 160 + (idx % 3) * 320 + ((idx * 37) % 80);
            const posY = 130 + Math.floor(idx / 3) * 160 + ((idx * 23) % 60);

            return (
              <div
                key={srv.id}
                style={{ left: `${posX}px`, top: `${posY}px` }}
                onClick={() => {
                  playSonarPing(1800);
                  setActiveItem({ type: 'survey', data: srv });
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 group z-20 cursor-pointer"
              >
                <div className="relative flex items-center justify-center">
                  <span className="absolute w-8 h-8 rounded-full bg-cyan-400/25 animate-ping" />
                  <div className="w-5 h-5 rounded-full bg-cyan-400 border-2 border-slate-950 flex items-center justify-center shadow-lg group-hover:scale-125 transition-transform">
                    <MapPin className="w-3 h-3 text-slate-950 stroke-[3]" />
                  </div>
                </div>

                <div className="mt-1 font-mono text-[10px] text-cyan-300 bg-slate-950/95 px-1.5 py-0.5 rounded border border-cyan-500/50 whitespace-nowrap shadow-md">
                  {srv.siteName.split(' ')[0]} ({srv.benthicComposition.hardCoralCover}%)
                </div>
              </div>
            );
          })}

        {/* Oceanographic Buoy Stations */}
        {showStations &&
          stations.map((st, idx) => {
            const posX = 240 + idx * 190;
            const posY = 90 + (idx % 2) * 220;
            const isHighThermal = st.degreeHeatingWeeks >= 4;

            return (
              <div
                key={st.id}
                style={{ left: `${posX}px`, top: `${posY}px` }}
                onClick={() => {
                  playSonarPing(1400);
                  setActiveItem({ type: 'station', data: st });
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 group z-20 cursor-pointer"
              >
                <div className="relative flex items-center justify-center">
                  <div
                    className={`w-6 h-6 rounded bg-slate-950 border-2 ${
                      isHighThermal ? 'border-amber-400 text-amber-400 animate-pulse' : 'border-cyan-400 text-cyan-400'
                    } flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
                  >
                    <Radio className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="mt-1 font-mono text-[10px] text-slate-200 bg-slate-950/95 px-1.5 py-0.5 rounded border border-slate-800 whitespace-nowrap shadow-md">
                  {st.stationCode} · {st.seaSurfaceTemperatureC}°C
                </div>
              </div>
            );
          })}

        {/* Coral Nursery Sites */}
        {showRestorations &&
          restorations.map((rst, idx) => {
            const posX = 560 + (idx % 2) * 120;
            const posY = 230 + idx * 45;

            return (
              <div
                key={rst.id}
                style={{ left: `${posX}px`, top: `${posY}px` }}
                onClick={() => {
                  playSonarPing(2200);
                  setActiveItem({ type: 'restoration', data: rst });
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 group z-20 cursor-pointer"
              >
                <div className="relative flex items-center justify-center">
                  <div className="w-5 h-5 rounded-full bg-emerald-400 border-2 border-slate-950 flex items-center justify-center shadow-lg group-hover:scale-125 transition-transform">
                    <Sprout className="w-3 h-3 text-slate-950 stroke-[3]" />
                  </div>
                </div>

                <div className="mt-1 font-mono text-[10px] text-emerald-300 bg-slate-950/95 px-1.5 py-0.5 rounded border border-emerald-500/50 whitespace-nowrap shadow-md">
                  {rst.batchCode.split('-')[2]} ({rst.fragmentsOutplanted} frags)
                </div>
              </div>
            );
          })}

        {/* Live Coordinate HUD Overlay (Bottom-Left) */}
        <div className="absolute bottom-3 left-3 bg-slate-950/90 border border-cyan-500/40 px-3 py-1.5 rounded font-mono text-xs text-slate-300 flex items-center gap-3 shadow-md pointer-events-none">
          <Crosshair className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
          <span>LAT: {mouseCoords.lat}</span>
          <span className="text-slate-600">|</span>
          <span>LNG: {mouseCoords.lng}</span>
          <span className="text-slate-600">|</span>
          <span className="text-cyan-400 font-bold">1:50,000 WGS84</span>
        </div>

        {/* Legend Overlay (Bottom-Right) */}
        <div className="absolute bottom-3 right-3 bg-slate-950/90 border border-slate-800 p-2.5 rounded text-[11px] font-mono text-slate-400 space-y-1 shadow-md pointer-events-none">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <span>Transect Survey Station</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded bg-amber-400" />
            <span>Telemetry Buoy (Ocean In-Situ)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span>Restoration Nursery Plot</span>
          </div>
        </div>

        {/* Map Popover Inspection Card (when item is selected) */}
        {activeItem && (
          <div className="absolute top-4 right-4 z-30 w-80 bg-slate-950 border border-cyan-500/50 rounded p-4 shadow-2xl font-mono">
            <div className="flex items-start justify-between mb-2">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-cyan-400 font-bold">
                  {activeItem.type === 'survey'
                    ? 'Benthic Transect Node'
                    : activeItem.type === 'station'
                    ? 'In-Situ Oceanographic Buoy'
                    : 'Habitat Outplant Plot'}
                </span>
                <h4 className="text-sm font-bold text-slate-100 font-['Chakra_Petch']">
                  {activeItem.type === 'survey'
                    ? (activeItem.data as CoralReefSurvey).siteName
                    : activeItem.type === 'station'
                    ? (activeItem.data as OceanographicStation).name
                    : (activeItem.data as RestorationActivity).siteName}
                </h4>
              </div>
              <button
                onClick={() => {
                  playUiClick();
                  setActiveItem(null);
                }}
                className="text-slate-400 hover:text-slate-100 p-1"
              >
                ✕
              </button>
            </div>

            {activeItem.type === 'survey' && (
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex justify-between border-b border-slate-800 pb-1">
                  <span className="text-slate-500">Hard Coral Cover:</span>
                  <span className="text-cyan-400 font-bold">
                    {(activeItem.data as CoralReefSurvey).benthicComposition.hardCoralCover}%
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1">
                  <span className="text-slate-500">Bleaching Incidence:</span>
                  <span className="text-amber-400 font-bold">
                    {(activeItem.data as CoralReefSurvey).bleachedCoralPercentage}%
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1">
                  <span className="text-slate-500">Reef Health Index:</span>
                  <span className="text-emerald-400 font-bold">
                    {(activeItem.data as CoralReefSurvey).reefHealthIndex} / 5.0
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 pt-1">
                  Leader: {(activeItem.data as CoralReefSurvey).surveyLeader}
                </div>
              </div>
            )}

            {activeItem.type === 'station' && (
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex justify-between border-b border-slate-800 pb-1">
                  <span className="text-slate-500">Sea Surface Temp:</span>
                  <span className="text-slate-100 font-bold">
                    {(activeItem.data as OceanographicStation).seaSurfaceTemperatureC}°C
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1">
                  <span className="text-slate-500">Thermal Stress:</span>
                  <span className="text-amber-400 font-bold">
                    {(activeItem.data as OceanographicStation).degreeHeatingWeeks} DHW
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1">
                  <span className="text-slate-500">Dissolved O₂:</span>
                  <span className="text-cyan-400 font-bold">
                    {(activeItem.data as OceanographicStation).dissolvedOxygenMgL} mg/L
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1">
                  <span className="text-slate-500">Ocean pH:</span>
                  <span className="text-emerald-400 font-bold">
                    {(activeItem.data as OceanographicStation).phLevel}
                  </span>
                </div>
              </div>
            )}

            {activeItem.type === 'restoration' && (
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex justify-between border-b border-slate-800 pb-1">
                  <span className="text-slate-500">Fragments Outplanted:</span>
                  <span className="text-cyan-400 font-bold">
                    {(activeItem.data as RestorationActivity).fragmentsOutplanted} frags
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1">
                  <span className="text-slate-500">90-Day Survival:</span>
                  <span className="text-emerald-400 font-bold">
                    {(activeItem.data as RestorationActivity).survivalRate90d}%
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1">
                  <span className="text-slate-500">Growth Extension:</span>
                  <span className="text-slate-200">
                    {(activeItem.data as RestorationActivity).currentExtensionRateMmMonth} mm/mo
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
