import React, { useState } from 'react';
import { X, Thermometer, AlertTriangle, ShieldCheck, Flame, ArrowRight } from 'lucide-react';
import { OceanographicStation } from '../types/marine';

interface ThermalStressSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  stations: OceanographicStation[];
}

export const ThermalStressSimulatorModal: React.FC<ThermalStressSimulatorModalProps> = ({
  isOpen,
  onClose,
  stations,
}) => {
  if (!isOpen) return null;

  const [selectedStationId, setSelectedStationId] = useState(stations[0]?.id || '');
  const [tempAnomaly, setTempAnomaly] = useState(1.4); // °C above MMM
  const [durationWeeks, setDurationWeeks] = useState(6); // weeks

  const currentStation = stations.find(s => s.id === selectedStationId) || stations[0];

  // NOAA CRW DHW Calculation model:
  // DHW = sum of positive SST anomalies >= 1.0°C over 12-week window
  const calculatedDHW = tempAnomaly >= 1.0 ? Number((tempAnomaly * durationWeeks).toFixed(1)) : 0;

  let alertTier = 'No Stress';
  let alertColor = 'text-emerald-400';
  let alertBg = 'bg-emerald-950/40 border-emerald-800/60';
  let ecologicalOutcome = 'Thermal conditions remain within normal adaptive envelope. No significant bleaching expected.';
  let agencyActions = [
    'Continue routine autonomous buoy telemetry monitoring.',
    'Maintain baseline monthly transect survey cadence.',
  ];

  if (calculatedDHW >= 8.0) {
    alertTier = 'ALERT LEVEL 2 (Catastrophic Mortality Risk)';
    alertColor = 'text-rose-400';
    alertBg = 'bg-rose-950/60 border-rose-800/80';
    ecologicalOutcome = 'Catastrophic mass coral bleaching and multi-species mortality (>50%) likely across shallow taxa (Acropora, Pocillopora).';
    agencyActions = [
      'IMMEDIATE: Deploy emergency solar shading tarps over high-value coral nursery trees.',
      'LOWER: Drop mid-water rope nurseries to deep thermocline (>15m) to escape surface heat stagnation.',
      'HALT: Freeze all field outplanting campaigns to prevent thermal shock to fresh fragments.',
      'GENOME: Collect emergency gamete/cryopreservation samples from verified resilient genets.',
    ];
  } else if (calculatedDHW >= 4.0) {
    alertTier = 'ALERT LEVEL 1 (Ecologically Significant Bleaching)';
    alertColor = 'text-amber-400';
    alertBg = 'bg-amber-950/60 border-amber-800/80';
    ecologicalOutcome = 'Widespread bleaching expected across sensitive branching species. Moderate mortality expected without cold water intrusion.';
    agencyActions = [
      'Increase in-situ diver survey frequency to twice weekly.',
      'Activate bleaching rapid-response observer network (volunteer divers & dive centers).',
      'Audit nursery genets for thermal tolerance differentials.',
      'Restrict anchoring and motorized vessel traffic in core shallow lagoons.',
    ];
  } else if (calculatedDHW > 0) {
    alertTier = 'BLEACHING WARNING (Thermal Stress Accumulating)';
    alertColor = 'text-yellow-400';
    alertBg = 'bg-yellow-950/40 border-yellow-800/60';
    ecologicalOutcome = 'Minor paling and localized bleaching at tips of branching corals. Full recovery probable if heat subsides.';
    agencyActions = [
      'Calibrate buoy thermistor arrays and cross-check with NOAA CRW satellite 5km SST.',
      'Prepare nursery shade deployment gear and emergency response dive teams.',
    ];
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900 z-10">
          <div>
            <span className="text-xs font-mono text-cyan-400">NOAA Coral Reef Watch Algorithm</span>
            <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              Thermal Stress & Marine Heatwave Simulator
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 text-xs">
          <p className="text-slate-400 text-xs leading-relaxed">
            Simulate hypothetical ocean thermal anomalies to forecast Degree Heating Weeks (DHW) and generate preventive conservation interventions for coral nurseries and MPA sanctuary zones.
          </p>

          {/* Station Selection */}
          <div>
            <label className="block font-medium text-slate-300 mb-1.5">
              Select Monitored Oceanic Station
            </label>
            <select
              value={selectedStationId}
              onChange={e => setSelectedStationId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
            >
              {stations.map(st => (
                <option key={st.id} value={st.id}>
                  {st.stationCode} — {st.name} ({st.region}) · Baseline: {st.climatologicalBaselineC}°C
                </option>
              ))}
            </select>
          </div>

          {/* Interactive Simulation Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-lg border border-slate-800">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-slate-300 font-medium">Temperature Anomaly (above baseline)</span>
                <span className="font-mono text-cyan-400 font-bold text-sm">+{tempAnomaly.toFixed(1)}°C</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="3.0"
                step="0.1"
                value={tempAnomaly}
                onChange={e => setTempAnomaly(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>+0.2°C (Minor)</span>
                <span>+1.5°C (Severe)</span>
                <span>+3.0°C (Extreme)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-slate-300 font-medium">Heatwave Exposure Duration</span>
                <span className="font-mono text-amber-400 font-bold text-sm">{durationWeeks} weeks</span>
              </div>
              <input
                type="range"
                min="1"
                max="12"
                step="1"
                value={durationWeeks}
                onChange={e => setDurationWeeks(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>1 week</span>
                <span>6 weeks</span>
                <span>12 weeks</span>
              </div>
            </div>
          </div>

          {/* Simulation Output Dashboard */}
          <div className={`p-4 rounded-lg border ${alertBg} space-y-3`}>
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  Projected Thermal Stress Accumulation
                </div>
                <div className="text-2xl font-mono font-bold text-slate-100 flex items-baseline gap-2">
                  <span className={alertColor}>{calculatedDHW.toFixed(1)}</span>
                  <span className="text-xs uppercase font-mono text-slate-400">°C-weeks DHW</span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] font-mono uppercase text-slate-400">Projected Seawater Temp</div>
                <div className="text-xl font-mono font-bold text-slate-200">
                  {(currentStation.climatologicalBaselineC + tempAnomaly).toFixed(1)}°C
                </div>
              </div>
            </div>

            <div className="pt-1">
              <div className={`font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 mb-1 ${alertColor}`}>
                <AlertTriangle className="w-4 h-4" />
                <span>{alertTier}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {ecologicalOutcome}
              </p>
            </div>
          </div>

          {/* Mandatory Agency Intervention Playbook */}
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 mb-2.5 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              Standard Agency Emergency Action Protocol
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              {agencyActions.map((action, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-cyan-400 font-mono font-bold">0{i + 1}.</span>
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="px-6 py-3 border-t border-slate-800 flex justify-end bg-slate-900">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-slate-100 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors"
          >
            Close Simulator
          </button>
        </div>
      </div>
    </div>
  );
};
