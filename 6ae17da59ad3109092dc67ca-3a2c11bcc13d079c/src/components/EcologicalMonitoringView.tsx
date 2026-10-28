import React, { useState } from 'react';
import { OceanographicStation } from '../types/marine';
import {
  Activity,
  Thermometer,
  Waves,
  Droplet,
  Sun,
  Radio,
  AlertCircle,
  Compass,
  Zap,
} from 'lucide-react';
import { exportToCSV } from '../utils/export';
import { playUiClick, playSonarPing, playAlertWarning } from '../utils/audio';

interface EcologicalMonitoringViewProps {
  stations: OceanographicStation[];
  onUpdateStation?: (updated: OceanographicStation) => void;
}

export const EcologicalMonitoringView: React.FC<EcologicalMonitoringViewProps> = ({
  stations,
}) => {
  const [selectedStation, setSelectedStation] = useState<OceanographicStation>(
    stations[0] || null
  );

  const handleExportTelemetry = () => {
    playUiClick();
    const exportData = stations.map(s => ({
      StationCode: s.stationCode,
      Name: s.name,
      Region: s.region,
      Latitude: s.coordinates.lat,
      Longitude: s.coordinates.lng,
      DepthMeters: s.depthMeters,
      Status: s.status,
      LastTelemetry: s.lastTelemetryTimestamp,
      SST_Celsius: s.seaSurfaceTemperatureC,
      ClimatologicalBaselineC: s.climatologicalBaselineC,
      AnomalyC: s.temperatureAnomalyC,
      DegreeHeatingWeeks_DHW: s.degreeHeatingWeeks,
      ThermalAlert: s.thermalAlert,
      DissolvedOxygen_mgL: s.dissolvedOxygenMgL,
      pH: s.phLevel,
      Salinity_PSU: s.salinityPsu,
      Turbidity_NTU: s.turbidityNtu,
      PAR_Irradiance: s.parSolarIrradiance,
    }));
    exportToCSV('pelagia_oceanographic_telemetry', exportData);
  };

  const getAlertStyle = (alert: string) => {
    switch (alert) {
      case 'Alert Level 2':
        return { text: 'text-rose-400', label: 'CRITICAL ALERT LVL 2', dot: 'bg-rose-500' };
      case 'Alert Level 1':
        return { text: 'text-amber-400', label: 'ALERT LEVEL 1', dot: 'bg-amber-500' };
      case 'Warning':
        return { text: 'text-amber-300', label: 'BLEACHING WARNING', dot: 'bg-amber-400' };
      case 'Watch':
        return { text: 'text-cyan-400', label: 'THERMAL WATCH', dot: 'bg-cyan-400' };
      default:
        return { text: 'text-emerald-400', label: 'NOMINAL (NO STRESS)', dot: 'bg-emerald-500' };
    }
  };

  const history = selectedStation?.history || [];
  const minTemp = Math.min(...history.map(h => h.temperature), 26);
  const maxTemp = Math.max(...history.map(h => h.temperature), 31);
  const tempRange = maxTemp - minTemp || 1;

  return (
    <div className="space-y-6 font-sans">
      {/* 1. Top Station Selector & Export */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-950 border border-cyan-500/30 p-4 rounded hud-grid shadow-lg font-mono">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-100 flex items-center gap-2">
              <span className="font-['Chakra_Petch'] uppercase tracking-wider">
                Autonomous Deep-Sea Moored Buoy Telemetry
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                ● 5 STATIONS SYNCED
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              Real-time thermal stress (NOAA Coral Reef Watch DHW) & physico-chemical spectral stream
            </div>
          </div>
        </div>

        <button
          onClick={handleExportTelemetry}
          className="px-3 py-1.5 text-xs text-slate-300 hover:text-cyan-300 bg-slate-900 border border-slate-700 rounded transition-colors flex items-center gap-1.5 self-start sm:self-center font-bold"
        >
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span>EXPORT CSV</span>
        </button>
      </div>

      {/* 2. Station Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 font-mono">
        {stations.map(st => {
          const isSelected = selectedStation.id === st.id;
          const alertMeta = getAlertStyle(st.thermalAlert);
          return (
            <button
              key={st.id}
              onClick={() => {
                if (st.thermalAlert.includes('Alert')) {
                  playAlertWarning();
                } else {
                  playSonarPing(1500);
                }
                setSelectedStation(st);
              }}
              className={`p-3 text-left rounded border transition-all relative overflow-hidden ${
                isSelected
                  ? 'bg-slate-900 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="font-bold text-xs text-slate-200 truncate">
                  {st.stationCode}
                </span>
                <span className={`w-2 h-2 rounded-full ${alertMeta.dot} animate-pulse`} />
              </div>
              <div className="text-[11px] text-slate-400 truncate mb-1.5 font-sans">
                {st.name}
              </div>
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-100">{st.seaSurfaceTemperatureC}°C</span>
                <span className={`text-[10px] ${alertMeta.text}`}>
                  {st.degreeHeatingWeeks.toFixed(1)} DHW
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Selected Station Deep Telemetry Console */}
      {selectedStation && (
        <div className="space-y-6 font-mono">
          {/* Station Banner */}
          <div className="bg-slate-950 border border-slate-800 rounded p-5 relative overflow-hidden shadow-xl">
            <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-5">
              <div>
                <div className="text-xs text-cyan-400 mb-1 font-bold">
                  BUOY NODE {selectedStation.stationCode} · {selectedStation.region}
                </div>
                <h3 className="text-xl font-bold text-slate-100 font-['Chakra_Petch']">
                  {selectedStation.name}
                </h3>
                <div className="text-xs text-slate-400 mt-0.5">
                  Mooring Sounding Depth: <strong className="text-cyan-300">-{selectedStation.depthMeters}m</strong> · Coordinates: Lat {selectedStation.coordinates.lat.toFixed(4)}° / Lng {selectedStation.coordinates.lng.toFixed(4)}°
                </div>
              </div>

              <div className="text-right sm:self-center">
                <div className="text-[11px] text-slate-400 mb-1">
                  NOAA CRW Planetary Thermal State
                </div>
                <div className={`text-xs font-bold px-3 py-1.5 rounded border border-slate-800 bg-slate-900 inline-block shadow-sm ${getAlertStyle(selectedStation.thermalAlert).text}`}>
                  {getAlertStyle(selectedStation.thermalAlert).label}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Telemetry Latency: ~1.2s · {selectedStation.lastTelemetryTimestamp}
                </div>
              </div>
            </div>

            {/* 6 High-Precision Parameter Telemetry Gauges */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {/* Sea Surface Temp */}
              <div className="bg-slate-900 p-3.5 rounded border border-slate-800">
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase mb-1">
                  <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
                  <span>SST Seawater</span>
                </div>
                <div className="text-2xl font-bold text-slate-100 tabular-nums font-['Chakra_Petch']">
                  {selectedStation.seaSurfaceTemperatureC}
                  <span className="text-xs text-slate-400 ml-1">°C</span>
                </div>
                <div className="text-[11px] text-cyan-400 mt-1">
                  Anomaly: +{selectedStation.temperatureAnomalyC}°C
                </div>
              </div>

              {/* Degree Heating Weeks */}
              <div className="bg-slate-900 p-3.5 rounded border border-slate-800">
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase mb-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Thermal DHW</span>
                </div>
                <div className="text-2xl font-bold text-amber-400 tabular-nums font-['Chakra_Petch']">
                  {selectedStation.degreeHeatingWeeks.toFixed(1)}
                  <span className="text-xs text-slate-400 ml-1">°C-wks</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Baseline: {selectedStation.climatologicalBaselineC}°C
                </div>
              </div>

              {/* Dissolved Oxygen */}
              <div className="bg-slate-900 p-3.5 rounded border border-slate-800">
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase mb-1">
                  <Droplet className="w-3.5 h-3.5 text-blue-400" />
                  <span>Dissolved O₂</span>
                </div>
                <div className="text-2xl font-bold text-slate-100 tabular-nums font-['Chakra_Petch']">
                  {selectedStation.dissolvedOxygenMgL}
                  <span className="text-xs text-slate-400 ml-1">mg/L</span>
                </div>
                <div className="text-[11px] text-emerald-400 mt-1">
                  Healthy Aerobic
                </div>
              </div>

              {/* Ocean pH */}
              <div className="bg-slate-900 p-3.5 rounded border border-slate-800">
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase mb-1">
                  <Waves className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Seawater pH</span>
                </div>
                <div className="text-2xl font-bold text-slate-100 tabular-nums font-['Chakra_Petch']">
                  {selectedStation.phLevel.toFixed(2)}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Target: 8.10 - 8.20
                </div>
              </div>

              {/* Salinity */}
              <div className="bg-slate-900 p-3.5 rounded border border-slate-800">
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase mb-1">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Salinity</span>
                </div>
                <div className="text-2xl font-bold text-slate-100 tabular-nums font-['Chakra_Petch']">
                  {selectedStation.salinityPsu}
                  <span className="text-xs text-slate-400 ml-1">PSU</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Nominal Oceanic
                </div>
              </div>

              {/* Solar PAR */}
              <div className="bg-slate-900 p-3.5 rounded border border-slate-800">
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase mb-1">
                  <Sun className="w-3.5 h-3.5 text-amber-300" />
                  <span>PAR Irradiance</span>
                </div>
                <div className="text-2xl font-bold text-slate-100 tabular-nums font-['Chakra_Petch']">
                  {selectedStation.parSolarIrradiance}
                  <span className="text-xs text-slate-400 ml-1">µmol</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Turbidity: {selectedStation.turbidityNtu} NTU
                </div>
              </div>
            </div>

            {/* 24-Hour In-Situ Telemetry Curve (SVG Chart) */}
            <div className="mt-6 pt-5 border-t border-slate-800">
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="text-slate-300 uppercase tracking-wider font-bold">
                  24-Hour Diurnal Temperature Profile vs Degree Heating Accumulation
                </span>
                <div className="flex items-center gap-4 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-0.5 bg-cyan-400 inline-block shadow-[0_0_8px_#22d3ee]" /> Water Temp (°C)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-0.5 bg-amber-400 border-dashed inline-block" /> Thermal DHW
                  </span>
                </div>
              </div>

              <div className="h-44 w-full bg-slate-900 rounded p-3 border border-slate-800 relative">
                <svg className="w-full h-full" viewBox="0 0 600 120" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal gridlines */}
                  <line x1="0" y1="30" x2="600" y2="30" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="0" y1="60" x2="600" y2="60" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="0" y1="90" x2="600" y2="90" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />

                  {/* Temperature curve coordinates */}
                  {(() => {
                    const stepX = 600 / (history.length - 1 || 1);
                    const points = history.map((pt, i) => {
                      const x = i * stepX;
                      const y = 100 - ((pt.temperature - minTemp) / tempRange) * 80;
                      return `${x},${y}`;
                    });

                    const areaPoints = `0,120 ${points.join(' ')} 600,120`;

                    return (
                      <>
                        <polygon points={areaPoints} fill="url(#tempGradient)" />
                        <polyline
                          fill="none"
                          stroke="#22d3ee"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={points.join(' ')}
                        />
                        {history.map((pt, i) => {
                          const x = i * stepX;
                          const y = 100 - ((pt.temperature - minTemp) / tempRange) * 80;
                          return (
                            <circle
                              key={i}
                              cx={x}
                              cy={y}
                              r="3.5"
                              fill="#0891b2"
                              stroke="#cffafe"
                              strokeWidth="1.5"
                            />
                          );
                        })}
                      </>
                    );
                  })()}
                </svg>

                {/* X-Axis Time Labels */}
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  {history.map(h => (
                    <span key={h.timestamp}>{h.timestamp}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
