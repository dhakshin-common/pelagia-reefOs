import React, { useState } from 'react';
import { RestorationActivity } from '../types/marine';
import {
  Plus,
  Download,
  Sprout,
  CheckCircle2,
  Wrench,
  Calendar,
  Compass,
  ShieldAlert,
  Sparkles,
  Zap,
  Activity,
  Layers,
  Thermometer,
} from 'lucide-react';
import { exportToCSV } from '../utils/export';
import { playUiClick, playSonarPing } from '../utils/audio';

interface RestorationViewProps {
  restorations: RestorationActivity[];
  onOpenNewRestoration: () => void;
}

export const RestorationView: React.FC<RestorationViewProps> = ({
  restorations,
  onOpenNewRestoration,
}) => {
  const [selectedRestoration, setSelectedRestoration] = useState<RestorationActivity | null>(
    restorations[0] || null
  );
  const [showNurseryInventory, setShowNurseryInventory] = useState(false);

  const totalFragments = restorations.reduce((acc, r) => acc + r.fragmentsOutplanted, 0);
  const totalAreaM2 = restorations.reduce((acc, r) => acc + r.restoredAreaM2, 0);
  const avgSurvival90d = (
    restorations.reduce((acc, r) => acc + r.survivalRate90d, 0) / (restorations.length || 1)
  ).toFixed(1);

  const handleExportRestorations = () => {
    playUiClick();
    const exportData = restorations.map(r => ({
      BatchCode: r.batchCode,
      SiteName: r.siteName,
      NurseryOrigin: r.nurseryOrigin,
      Species: r.coralSpecies.join('; '),
      OutplantDate: r.outplantDate,
      Technique: r.technique,
      FragmentsOutplanted: r.fragmentsOutplanted,
      RestoredAreaM2: r.restoredAreaM2,
      LeadBiologist: r.leadRestorationBiologist,
      SurvivalRate30dPct: r.survivalRate30d,
      SurvivalRate90dPct: r.survivalRate90d,
      SurvivalRate1YearPct: r.survivalRate1Year,
      GrowthRateMmMonth: r.currentExtensionRateMmMonth,
      Status: r.status,
    }));
    exportToCSV('pelagia_habitat_restoration_batches', exportData);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* 1. Futuristic Bio-Fabrication & Propagation Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
        <div className="bg-slate-950 border border-slate-800 p-4 rounded flex items-center gap-4 relative overflow-hidden shadow-lg hover:border-cyan-400 transition-colors">
          <span className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyan-400" />
          <div className="p-3 bg-cyan-950 border border-cyan-500/50 rounded text-cyan-400">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">
              Cultivated Benthic Fragments
            </div>
            <div className="text-2xl font-bold text-slate-100 tabular-nums font-['Chakra_Petch']">
              {totalFragments.toLocaleString()} <span className="text-xs text-cyan-400 font-normal">frags</span>
            </div>
            <div className="text-[10px] text-cyan-400 mt-0.5">● 100% Thermal Genet Tested</div>
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 p-4 rounded flex items-center gap-4 relative overflow-hidden shadow-lg hover:border-emerald-400 transition-colors">
          <span className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-emerald-400" />
          <div className="p-3 bg-emerald-950 border border-emerald-500/50 rounded text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">
              Mean 90-Day Survivorship
            </div>
            <div className="text-2xl font-bold text-emerald-400 tabular-nums font-['Chakra_Petch']">
              {avgSurvival90d}% <span className="text-xs text-slate-400 font-normal">retention</span>
            </div>
            <div className="text-[10px] text-emerald-400 mt-0.5">● Substrate Cementation Locked</div>
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 p-4 rounded flex items-center gap-4 relative overflow-hidden shadow-lg hover:border-blue-400 transition-colors">
          <span className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-blue-400" />
          <div className="p-3 bg-blue-950 border border-blue-500/50 rounded text-blue-400">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">
              Restored Benthic Footprint
            </div>
            <div className="text-2xl font-bold text-slate-100 tabular-nums font-['Chakra_Petch']">
              {totalAreaM2.toLocaleString()} <span className="text-xs text-blue-400 font-normal">m² structural</span>
            </div>
            <div className="text-[10px] text-blue-400 mt-0.5">● Mars Reef Stars & Pinning</div>
          </div>
        </div>
      </div>

      {/* 2. Micro-Fragmentation Raceway Telemetry HUD */}
      <div className="bg-slate-950 border border-cyan-500/30 p-4 rounded hud-grid space-y-3 font-mono text-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-2.5 gap-2">
          <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>Nursery Raceway Hydro-Chemistry & Dosing Stream</span>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-slate-400">
            <span className="text-emerald-400 font-bold">● BIO-REACTOR NOMINAL</span>
            <span>PHOTOPERIOD: 14h LIGHT / 10h DARK</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase">Calcium Reactor [Ca²⁺]</div>
            <div className="text-lg font-bold text-cyan-300">435 ppm</div>
            <div className="text-[9px] text-slate-400">Continuous effusion 12 ml/min</div>
          </div>

          <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase">Alkalinity Buffer</div>
            <div className="text-lg font-bold text-emerald-400">8.65 dKH</div>
            <div className="text-[9px] text-slate-400">pH steady state 8.24</div>
          </div>

          <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase">PAR Irradiance Flux</div>
            <div className="text-lg font-bold text-amber-300">320 µmol/m²/s</div>
            <div className="text-[9px] text-slate-400">Spectrum tuned 450nm royal blue</div>
          </div>

          <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase">Raceway Surge Velocity</div>
            <div className="text-lg font-bold text-cyan-300">0.24 m/s</div>
            <div className="text-[9px] text-slate-400">Laminar gyre pulse active</div>
          </div>
        </div>

        <div className="pt-1 flex items-center justify-between">
          <span className="text-slate-400 text-[11px]">
            Genetic resilience indexing active for Acropora cervicornis genets #A7, #C12, #E4.
          </span>
          <button
            onClick={() => {
              playUiClick();
              setShowNurseryInventory(!showNurseryInventory);
            }}
            className="px-3 py-1 bg-slate-900 border border-slate-800 hover:border-cyan-400 text-cyan-300 rounded text-[11px] font-bold transition-colors"
          >
            {showNurseryInventory ? 'Hide Infrastructure Details' : 'View Infrastructure Details'}
          </button>
        </div>
      </div>

      {/* Nursery Infrastructure Breakdown Drawer */}
      {showNurseryInventory && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-slate-950 p-4 rounded border border-cyan-500/40 font-mono shadow-xl animate-in fade-in duration-200">
          <div className="p-3 bg-slate-900 rounded border border-slate-800">
            <div className="text-cyan-400 font-bold mb-1">01. Mid-Water Floating Trees</div>
            <p className="text-slate-300 text-[11px] leading-relaxed font-sans">
              Suspended PVC structures at 8-12m depth with monofilament fragment clips. High surge movement accelerates calcification and minimizes sediment smothering.
            </p>
          </div>
          <div className="p-3 bg-slate-900 rounded border border-slate-800">
            <div className="text-emerald-400 font-bold mb-1">02. Benthic Micro-Fragment Tables</div>
            <p className="text-slate-300 text-[11px] leading-relaxed font-sans">
              Diamond-saw sliced 1cm² fragments of massive corals (Orbicella, Porites) on ceramic plugs. Accelerated somatic fusion yields 25-50x wild growth rates.
            </p>
          </div>
          <div className="p-3 bg-slate-900 rounded border border-slate-800">
            <div className="text-amber-400 font-bold mb-1">03. Hexagonal Reef Stars (Mars Method)</div>
            <p className="text-slate-300 text-[11px] leading-relaxed font-sans">
              Sand-coated welded steel modular frames interlocked to stabilize loose coral rubble fields caused by blast fishing or storm impact.
            </p>
          </div>
        </div>
      )}

      {/* Main Split Layout: Batches List & Detail Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono">
        {/* Left Column: Outplanting Batches List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
              Restoration Outplant Batches ({restorations.length})
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportRestorations}
                className="px-2.5 py-1 text-xs text-slate-300 hover:text-cyan-300 bg-slate-900 border border-slate-800 rounded transition-colors flex items-center gap-1 font-bold"
                title="Export Batches CSV"
              >
                <Download className="w-3 h-3 text-cyan-400" />
                <span>CSV</span>
              </button>
              <button
                onClick={() => {
                  playSonarPing(1600);
                  onOpenNewRestoration();
                }}
                className="px-2.5 py-1 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded transition-all flex items-center gap-1 shadow-[0_0_10px_rgba(34,211,238,0.3)]"
              >
                <Plus className="w-3 h-3 stroke-[2.5]" />
                <span>+ NEW BATCH</span>
              </button>
            </div>
          </div>

          <div className="space-y-2.5">
            {restorations.map(batch => {
              const isSelected = selectedRestoration?.id === batch.id;
              return (
                <div
                  key={batch.id}
                  onClick={() => {
                    playSonarPing(1400);
                    setSelectedRestoration(batch);
                  }}
                  className={`p-3.5 rounded border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <div className="text-xs text-cyan-400 font-bold">
                        {batch.batchCode}
                      </div>
                      <div className="text-xs font-bold text-slate-100 font-sans line-clamp-1">
                        {batch.siteName}
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {batch.outplantDate}
                    </span>
                  </div>

                  <div className="text-xs text-slate-400 line-clamp-1 mb-2 font-sans">
                    {batch.coralSpecies.join(', ')}
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800">
                    <span className="text-slate-300">
                      {batch.fragmentsOutplanted} frags · {batch.restoredAreaM2} m²
                    </span>
                    <span className="text-emerald-400 font-bold">
                      {batch.survivalRate90d}% surv
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Batch Detail & Survivorship Analysis */}
        {selectedRestoration && (
          <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded p-5 space-y-6 shadow-xl">
            <div className="border-b border-slate-800 pb-4">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs text-cyan-400 font-bold">
                  {selectedRestoration.batchCode} · Outplanted {selectedRestoration.outplantDate}
                </span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  {selectedRestoration.status}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-100 font-['Chakra_Petch']">
                {selectedRestoration.siteName}
              </h2>
              <div className="text-xs text-slate-400 mt-1 font-sans">
                Source Nursery: <span className="text-slate-200 font-mono">{selectedRestoration.nurseryOrigin}</span>
              </div>
            </div>

            {/* Survivorship & Growth Progression */}
            <div>
              <h4 className="text-xs uppercase tracking-wider text-slate-400 mb-3 font-bold">
                Longitudinal Survivorship Cohort Curve (%)
              </h4>
              <div className="grid grid-cols-3 gap-3 text-center mb-4">
                <div className="bg-slate-900 p-3 rounded border border-slate-800">
                  <div className="text-[11px] text-slate-400">30-Day Check</div>
                  <div className="text-xl font-bold text-cyan-400 font-['Chakra_Petch']">
                    {selectedRestoration.survivalRate30d}%
                  </div>
                </div>
                <div className="bg-slate-900 p-3 rounded border border-slate-800">
                  <div className="text-[11px] text-slate-400">90-Day Metric</div>
                  <div className="text-xl font-bold text-emerald-400 font-['Chakra_Petch']">
                    {selectedRestoration.survivalRate90d}%
                  </div>
                </div>
                <div className="bg-slate-900 p-3 rounded border border-slate-800">
                  <div className="text-[11px] text-slate-400">1-Year Projected</div>
                  <div className="text-xl font-bold text-slate-200 font-['Chakra_Petch']">
                    {selectedRestoration.survivalRate1Year}%
                  </div>
                </div>
              </div>

              {/* Visualized survival progression bar */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Survival Retention</span>
                  <span className="text-cyan-400 font-bold">{selectedRestoration.survivalRate90d}% at Day 90</span>
                </div>
                <div className="w-full h-2.5 bg-slate-900 rounded overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-emerald-500 shadow-[0_0_10px_#10b981]"
                    style={{ width: `${selectedRestoration.survivalRate90d}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Batch Parameters Table */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-900 p-4 rounded border border-slate-800">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Attachment Technique</span>
                <span className="text-slate-100 font-bold">{selectedRestoration.technique}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Extension Growth Rate</span>
                <span className="text-cyan-400 font-bold">
                  {selectedRestoration.currentExtensionRateMmMonth} mm / month
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Fragments Outplanted</span>
                <span className="text-slate-200">{selectedRestoration.fragmentsOutplanted} colonies</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Lead Biologist</span>
                <span className="text-slate-200 font-sans">{selectedRestoration.leadRestorationBiologist}</span>
              </div>
            </div>

            {/* Maintenance & Predator Removal Log */}
            <div>
              <h4 className="text-xs uppercase tracking-wider text-slate-400 mb-2.5 font-bold">
                Restoration Maintenance & Intervention Logs
              </h4>
              <div className="space-y-2">
                {selectedRestoration.maintenanceHistory.map((m, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-900 border border-slate-800 p-2.5 rounded text-xs flex items-center justify-between"
                  >
                    <div>
                      <span className="text-cyan-400 text-[11px] mr-2 font-bold">{m.date}</span>
                      <span className="text-slate-200 font-sans">{m.action}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      Tech: {m.technician}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Field Notes */}
            <div className="bg-slate-900 p-3 rounded border border-slate-800 text-xs text-slate-300">
              <span className="text-[10px] text-cyan-400 uppercase tracking-wider block mb-1 font-bold">
                Restoration Phenotype Notes
              </span>
              <p className="font-sans leading-relaxed">
                {selectedRestoration.notes}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
