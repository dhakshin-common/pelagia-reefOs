import React, { useState } from 'react';
import { CoralReefSurvey, MPAZone, SurveyMethod, BleachingSeverity, CoralDisease } from '../types/marine';
import { X, Check } from 'lucide-react';

interface NewSurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (survey: CoralReefSurvey) => void;
}

export const NewSurveyModal: React.FC<NewSurveyModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  const [siteName, setSiteName] = useState('');
  const [mpaZone, setMpaZone] = useState<MPAZone>('Sanctuary (No-Take Core)');
  const [region, setRegion] = useState('');
  const [surveyLeader, setSurveyLeader] = useState('');
  const [teamMembers, setTeamMembers] = useState('');
  const [method, setMethod] = useState<SurveyMethod>('Line Intercept Transect (LIT)');
  const [transectLength, setTransectLength] = useState(50);
  const [depthMin, setDepthMin] = useState(8);
  const [depthMax, setDepthMax] = useState(14);
  const [waterTemp, setWaterTemp] = useState(28.2);
  const [visibility, setVisibility] = useState(25);

  // Benthic Cover
  const [hardCoral, setHardCoral] = useState(42.0);
  const [softCoral, setSoftCoral] = useState(18.0);
  const [macroalgae, setMacroalgae] = useState(8.5);
  const [cca, setCca] = useState(12.5);
  const [turfAlgae, setTurfAlgae] = useState(9.0);
  const [abiotic, setAbiotic] = useState(10.0);

  const [bleachedPct, setBleachedPct] = useState(1.5);
  const [bleachingSeverity, setBleachingSeverity] = useState<BleachingSeverity>('Category 1 (Mild 1-10%)');
  const [disease, setDisease] = useState<CoralDisease>('None Detected');
  const [dominantGenera, setDominantGenera] = useState('Acropora, Porites, Pocillopora');
  const [notes, setNotes] = useState('');

  const totalComposition = (hardCoral + softCoral + macroalgae + cca + turfAlgae + abiotic).toFixed(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteName || !surveyLeader) return;

    // Calculate approximate RHI score based on hard coral vs macroalgae and disease
    let rhi = (hardCoral / 10) - (macroalgae / 15);
    if (disease !== 'None Detected') rhi -= 0.5;
    if (bleachedPct > 20) rhi -= 0.8;
    rhi = Math.min(5.0, Math.max(1.0, Number(rhi.toFixed(1))));

    const newSurvey: CoralReefSurvey = {
      id: `srv-${Date.now()}`,
      surveyCode: `SRV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      siteName,
      mpaZone,
      region: region || 'Marine Protected Area Sector',
      coordinates: {
        latitude: -14.2 + (Math.random() - 0.5) * 4,
        longitude: 145.8 + (Math.random() - 0.5) * 4,
      },
      surveyDate: new Date().toISOString().split('T')[0],
      surveyLeader,
      teamMembers: teamMembers ? teamMembers.split(',').map(s => s.trim()) : ['Field Research Team'],
      method,
      transectLengthMeters: Number(transectLength),
      depthRangeMeters: { min: Number(depthMin), max: Number(depthMax) },
      waterTempCelsius: Number(waterTemp),
      underwaterVisibilityMeters: Number(visibility),
      benthicComposition: {
        hardCoralCover: Number(hardCoral),
        softCoralCover: Number(softCoral),
        macroalgaeCover: Number(macroalgae),
        crustoseCorallineAlgae: Number(cca),
        turfAlgaeCover: Number(turfAlgae),
        abioticSubstrate: Number(abiotic),
      },
      bleachedCoralPercentage: Number(bleachedPct),
      bleachingSeverity,
      dominantCoralGenera: dominantGenera.split(',').map(g => g.trim()),
      diseaseDetected: disease,
      reefHealthIndex: rhi,
      photoUrl: '/src/assets/images/benthic_transect_quadrat_1790787975199.jpg',
      notes: notes || 'Standard benthic transect completed in compliance with GCRMN protocols.',
      validationStatus: 'Field Draft',
    };

    onSave(newSurvey);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900 z-10">
          <div>
            <span className="text-xs font-mono text-cyan-400">GCRMN Benthic Protocol</span>
            <h3 className="text-base font-semibold text-slate-100">
              Log New Coral Reef Transect Survey
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          {/* Site & MPA Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-300 mb-1">
                Reef Site Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Osprey Reef South Pinnacle"
                value={siteName}
                onChange={e => setSiteName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">
                MPA Zoning Classification
              </label>
              <select
                value={mpaZone}
                onChange={e => setMpaZone(e.target.value as MPAZone)}
                className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
              >
                <option value="Sanctuary (No-Take Core)">Sanctuary (No-Take Core)</option>
                <option value="Conservation Zone">Conservation Zone</option>
                <option value="Habitat Restoration Area">Habitat Restoration Area</option>
                <option value="Sustainable Use Buffer">Sustainable Use Buffer</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-300 mb-1">
                Region / Geographic Basin
              </label>
              <input
                type="text"
                placeholder="e.g. Great Barrier Reef Northern Sector"
                value={region}
                onChange={e => setRegion(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">
                Survey Methodology
              </label>
              <select
                value={method}
                onChange={e => setMethod(e.target.value as SurveyMethod)}
                className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
              >
                <option value="Line Intercept Transect (LIT)">Line Intercept Transect (LIT)</option>
                <option value="Point Intercept Transect (PIT)">Point Intercept Transect (PIT)</option>
                <option value="Photo-Quadrat (GCRMN)">Photo-Quadrat (GCRMN)</option>
                <option value="Manta Tow Survey">Manta Tow Survey</option>
              </select>
            </div>
          </div>

          {/* Environmental Conditions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Transect Length (m)</label>
              <input
                type="number"
                value={transectLength}
                onChange={e => setTransectLength(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-md px-2.5 py-1.5 font-mono text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Min/Max Depth (m)</label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={depthMin}
                  onChange={e => setDepthMin(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-md px-2 py-1.5 font-mono text-slate-100"
                />
                <span className="text-slate-500">-</span>
                <input
                  type="number"
                  value={depthMax}
                  onChange={e => setDepthMax(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-md px-2 py-1.5 font-mono text-slate-100"
                />
              </div>
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Water Temp (°C)</label>
              <input
                type="number"
                step="0.1"
                value={waterTemp}
                onChange={e => setWaterTemp(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-md px-2.5 py-1.5 font-mono text-slate-100"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Visibility (m)</label>
              <input
                type="number"
                value={visibility}
                onChange={e => setVisibility(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-md px-2.5 py-1.5 font-mono text-slate-100"
              />
            </div>
          </div>

          {/* Benthic Composition Partitioning */}
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-slate-300 uppercase tracking-wider font-semibold">
                Benthic Cover Composition (%)
              </span>
              <span className={`font-mono text-[11px] ${Number(totalComposition) === 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
                Sum: {totalComposition}% (Target: 100%)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-400 text-[11px] mb-1">Hard Coral %</label>
                <input
                  type="number"
                  step="0.1"
                  value={hardCoral}
                  onChange={e => setHardCoral(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 font-mono text-cyan-400 font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-[11px] mb-1">Soft Coral %</label>
                <input
                  type="number"
                  step="0.1"
                  value={softCoral}
                  onChange={e => setSoftCoral(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 font-mono text-blue-400"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-[11px] mb-1">Macroalgae %</label>
                <input
                  type="number"
                  step="0.1"
                  value={macroalgae}
                  onChange={e => setMacroalgae(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 font-mono text-amber-400"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-[11px] mb-1">CCA (Coralline) %</label>
                <input
                  type="number"
                  step="0.1"
                  value={cca}
                  onChange={e => setCca(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 font-mono text-emerald-400"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-[11px] mb-1">Turf Algae %</label>
                <input
                  type="number"
                  step="0.1"
                  value={turfAlgae}
                  onChange={e => setTurfAlgae(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 font-mono text-slate-300"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-[11px] mb-1">Abiotic Substrate %</label>
                <input
                  type="number"
                  step="0.1"
                  value={abiotic}
                  onChange={e => setAbiotic(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 font-mono text-slate-300"
                />
              </div>
            </div>
          </div>

          {/* Bleaching & Disease Observations */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Bleached Coral %</label>
              <input
                type="number"
                step="0.1"
                value={bleachedPct}
                onChange={e => setBleachedPct(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 font-mono text-slate-100"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Bleaching Severity</label>
              <select
                value={bleachingSeverity}
                onChange={e => setBleachingSeverity(e.target.value as BleachingSeverity)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-2 text-slate-100"
              >
                <option value="Category 0 (None <1%)">Category 0 (None &lt;1%)</option>
                <option value="Category 1 (Mild 1-10%)">Category 1 (Mild 1-10%)</option>
                <option value="Category 2 (Moderate 10-50%)">Category 2 (Moderate 10-50%)</option>
                <option value="Category 3 (Severe 50-80%)">Category 3 (Severe 50-80%)</option>
                <option value="Category 4 (Catastrophic >80%)">Category 4 (Catastrophic &gt;80%)</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Pathogen / Disease</label>
              <select
                value={disease}
                onChange={e => setDisease(e.target.value as CoralDisease)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-2 text-slate-100"
              >
                <option value="None Detected">None Detected</option>
                <option value="Stony Coral Tissue Loss Disease (SCTLD)">SCTLD Tissue Loss</option>
                <option value="Black Band Disease (BBD)">Black Band Disease</option>
                <option value="White Syndrome">White Syndrome</option>
                <option value="Yellow Band Disease">Yellow Band Disease</option>
              </select>
            </div>
          </div>

          {/* Lead Biologist & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-300 mb-1">Lead Biologist *</label>
              <input
                type="text"
                required
                placeholder="e.g. Dr. Maya Lin"
                value={surveyLeader}
                onChange={e => setSurveyLeader(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-300 mb-1">Team Divers</label>
              <input
                type="text"
                placeholder="Comma-separated divers"
                value={teamMembers}
                onChange={e => setTeamMembers(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1">
              Field Observations & Rugosity Notes
            </label>
            <textarea
              rows={2}
              placeholder="Record structural rugosity, fish schooling density, recruitment signs, or storm damage..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100"
            />
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-slate-100 bg-slate-800 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold rounded-md flex items-center gap-1.5"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Validate & Record Survey</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
