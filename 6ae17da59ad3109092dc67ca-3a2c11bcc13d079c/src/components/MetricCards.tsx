import React from 'react';
import { CoralReefSurvey, RestorationActivity, OceanographicStation } from '../types/marine';
import { Activity, Shield, AlertTriangle, Compass, TrendingUp, Waves, Sparkles } from 'lucide-react';
import { playUiClick } from '../utils/audio';

interface MetricCardsProps {
  surveys: CoralReefSurvey[];
  restorations: RestorationActivity[];
  stations: OceanographicStation[];
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  surveys,
  restorations,
  stations,
}) => {
  // Calculations
  const avgHardCoralCover = (
    surveys.reduce((acc, s) => acc + s.benthicComposition.hardCoralCover, 0) / (surveys.length || 1)
  ).toFixed(1);

  const avgBleachingSeverity = (
    surveys.reduce((acc, s) => acc + s.bleachedCoralPercentage, 0) / (surveys.length || 1)
  ).toFixed(1);

  const totalFragmentsOutplanted = restorations.reduce(
    (acc, r) => acc + r.fragmentsOutplanted,
    0
  );

  const avg90dSurvival = (
    restorations.reduce((acc, r) => acc + r.survivalRate90d, 0) / (restorations.length || 1)
  ).toFixed(1);

  const maxThermalDHW = Math.max(...stations.map(s => s.degreeHeatingWeeks), 0);
  const elevatedStations = stations.filter(s => s.degreeHeatingWeeks >= 4).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-8 font-mono">
      {/* Instrumentation Bay 1: Mean Benthic Hard Coral Cover */}
      <div
        onClick={() => playUiClick(1200)}
        className="relative bg-slate-950 border border-slate-800 p-4 transition-all hover:border-cyan-400 group overflow-hidden shadow-lg hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] cursor-pointer"
      >
        {/* Futuristic Laser Ticks */}
        <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-cyan-400" />
        <span className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-cyan-400" />
        <span className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-cyan-400" />
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-cyan-400" />

        <div className="flex items-center justify-between text-[10px] tracking-widest uppercase text-slate-400 mb-1.5">
          <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            BENTHIC LIVE COVER
          </span>
          <span className="text-slate-400 text-[9px]">[TEL-01.ALPHA]</span>
        </div>

        <div className="flex items-baseline my-1">
          <span className="text-3xl sm:text-4xl font-bold font-['Chakra_Petch'] text-slate-100 tabular-nums tracking-tight">
            {avgHardCoralCover}
          </span>
          <span className="text-xs uppercase text-cyan-400 ml-1.5 font-bold">% COVER</span>
        </div>

        {/* Micro Telemetry Frequency Bar */}
        <div className="flex items-center gap-1 my-2 h-1.5">
          {[40, 65, 80, 55, 90, 75, 85, 95, 70, 60, 85, 75].map((h, i) => (
            <div
              key={i}
              className="flex-1 bg-cyan-950 rounded-sm overflow-hidden"
              style={{ height: '100%' }}
            >
              <div
                className="bg-cyan-400 h-full opacity-75 group-hover:opacity-100 transition-opacity"
                style={{ width: `${h}%` }}
              />
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-400">
          <span>BASELINE: &gt;35.0%</span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 bg-emerald-400 rounded-full" /> GCRMN STANDARD
          </span>
        </div>
      </div>

      {/* Instrumentation Bay 2: NOAA CRW Thermal Stress */}
      <div
        onClick={() => playUiClick(900)}
        className="relative bg-slate-950 border border-slate-800 p-4 transition-all hover:border-amber-400 group overflow-hidden shadow-lg hover:shadow-[0_0_20px_rgba(251,146,60,0.15)] cursor-pointer"
      >
        <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-amber-400" />
        <span className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-amber-400" />
        <span className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-amber-400" />
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-amber-400" />

        <div className="flex items-center justify-between text-[10px] tracking-widest uppercase text-slate-400 mb-1.5">
          <span className="flex items-center gap-1.5 text-amber-400 font-bold">
            <span className={`w-1.5 h-1.5 rounded-full ${maxThermalDHW >= 4 ? 'bg-amber-400 animate-ping' : 'bg-cyan-400'}`} />
            THERMAL ACCUMULATION
          </span>
          <span className="text-slate-400 text-[9px]">[SST-CRW.DHW]</span>
        </div>

        <div className="flex items-baseline my-1">
          <span className={`text-3xl sm:text-4xl font-bold font-['Chakra_Petch'] tabular-nums tracking-tight ${maxThermalDHW >= 4 ? 'text-amber-400' : 'text-cyan-400'}`}>
            {maxThermalDHW.toFixed(1)}
          </span>
          <span className="text-xs uppercase text-slate-400 ml-1.5 font-bold">°C-WEEKS DHW</span>
        </div>

        {/* Micro Telemetry Bar */}
        <div className="flex items-center gap-1 my-2 h-1.5">
          {[20, 30, 45, 60, 75, 85, 90, 80, 70, 60, 50, 40].map((h, i) => (
            <div
              key={i}
              className="flex-1 bg-amber-950/60 rounded-sm overflow-hidden"
              style={{ height: '100%' }}
            >
              <div
                className="bg-amber-400 h-full opacity-75 group-hover:opacity-100 transition-opacity"
                style={{ width: `${h}%` }}
              />
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-400">
          <span>{elevatedStations} OF {stations.length} BUOYS ELEVATED</span>
          <span className={maxThermalDHW >= 4 ? 'text-amber-400 font-semibold' : 'text-emerald-400 font-semibold'}>
            {maxThermalDHW >= 4 ? 'THERMAL WATCH' : 'NOMINAL STATUS'}
          </span>
        </div>
      </div>

      {/* Instrumentation Bay 3: Outplanted Bio-Structure */}
      <div
        onClick={() => playUiClick(1400)}
        className="relative bg-slate-950 border border-slate-800 p-4 transition-all hover:border-emerald-400 group overflow-hidden shadow-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] cursor-pointer"
      >
        <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-emerald-400" />
        <span className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-emerald-400" />
        <span className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-emerald-400" />
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-emerald-400" />

        <div className="flex items-center justify-between text-[10px] tracking-widest uppercase text-slate-400 mb-1.5">
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            NURSERY OUTPLANTS
          </span>
          <span className="text-slate-400 text-[9px]">[BIO-FAB.90D]</span>
        </div>

        <div className="flex items-baseline my-1">
          <span className="text-3xl sm:text-4xl font-bold font-['Chakra_Petch'] text-slate-100 tabular-nums tracking-tight">
            {totalFragmentsOutplanted.toLocaleString()}
          </span>
          <span className="text-xs uppercase text-emerald-400 ml-1.5 font-bold">FRAGMENTS</span>
        </div>

        {/* Micro Telemetry Bar */}
        <div className="flex items-center gap-1 my-2 h-1.5">
          {[50, 70, 85, 90, 92, 95, 91, 88, 92, 94, 96, 91].map((h, i) => (
            <div
              key={i}
              className="flex-1 bg-emerald-950/60 rounded-sm overflow-hidden"
              style={{ height: '100%' }}
            >
              <div
                className="bg-emerald-400 h-full opacity-75 group-hover:opacity-100 transition-opacity"
                style={{ width: `${h}%` }}
              />
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-400">
          <span>90-DAY SURVIVORSHIP</span>
          <span className="text-emerald-400 font-bold tabular-nums">{avg90dSurvival}% RETENTION</span>
        </div>
      </div>

      {/* Instrumentation Bay 4: Bleaching Incidence */}
      <div
        onClick={() => playUiClick(1600)}
        className="relative bg-slate-950 border border-slate-800 p-4 transition-all hover:border-cyan-400 group overflow-hidden shadow-lg hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] cursor-pointer"
      >
        <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-cyan-400" />
        <span className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-cyan-400" />
        <span className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-cyan-400" />
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-cyan-400" />

        <div className="flex items-center justify-between text-[10px] tracking-widest uppercase text-slate-400 mb-1.5">
          <span className="flex items-center gap-1.5 text-blue-400 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            BLEACHING SENTINEL
          </span>
          <span className="text-slate-400 text-[9px]">[OPTIC-IR.NDVI]</span>
        </div>

        <div className="flex items-baseline my-1">
          <span className="text-3xl sm:text-4xl font-bold font-['Chakra_Petch'] text-slate-100 tabular-nums tracking-tight">
            {avgBleachingSeverity}
          </span>
          <span className="text-xs uppercase text-slate-400 ml-1.5 font-bold">% INCIDENCE</span>
        </div>

        {/* Micro Telemetry Bar */}
        <div className="flex items-center gap-1 my-2 h-1.5">
          {[10, 15, 20, 18, 12, 14, 16, 22, 19, 15, 12, 11].map((h, i) => (
            <div
              key={i}
              className="flex-1 bg-blue-950/60 rounded-sm overflow-hidden"
              style={{ height: '100%' }}
            >
              <div
                className="bg-blue-400 h-full opacity-75 group-hover:opacity-100 transition-opacity"
                style={{ width: `${h}%` }}
              />
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-400">
          <span>{surveys.length} TRANSECTS VALIDATED</span>
          <span className="text-cyan-400 font-semibold">RHI 3.8 / 5.0</span>
        </div>
      </div>
    </div>
  );
};
