import React, { useState } from 'react';
import { CoralReefSurvey, MPAZone, SurveyMethod, BleachingSeverity, CoralDisease } from '../types/marine';
import { X, Check, ArrowRight, ArrowLeft, Grid3X3, Camera, AlertCircle, Shield } from 'lucide-react';

interface RapidBenthicSurveyWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (survey: CoralReefSurvey) => void;
}

// 50 benthic sample points simulating a 50m line intercept transect (1 point per meter)
type BenthicClass = 'hardCoral' | 'softCoral' | 'cca' | 'macroalgae' | 'turf' | 'abiotic';

export const RapidBenthicSurveyWizard: React.FC<RapidBenthicSurveyWizardProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Dive Context
  const [siteName, setSiteName] = useState('');
  const [mpaZone, setMpaZone] = useState<MPAZone>('Sanctuary (No-Take Core)');
  const [region, setRegion] = useState('Coral Sea Northern MPA Sector');
  const [surveyLeader, setSurveyLeader] = useState('');
  const [method, setMethod] = useState<SurveyMethod>('Point Intercept Transect (PIT)');
  const [depthMin, setDepthMin] = useState(7.5);
  const [depthMax, setDepthMax] = useState(13.0);
  const [waterTemp, setWaterTemp] = useState(28.1);
  const [visibility, setVisibility] = useState(24);

  // Step 2: 50-Point Intercept Array
  // Initial default realistic scientific distribution
  const [samplePoints, setSamplePoints] = useState<BenthicClass[]>(() => {
    const pts: BenthicClass[] = [];
    for (let i = 0; i < 22; i++) pts.push('hardCoral');
    for (let i = 0; i < 9; i++) pts.push('softCoral');
    for (let i = 0; i < 7; i++) pts.push('cca');
    for (let i = 0; i < 4; i++) pts.push('macroalgae');
    for (let i = 0; i < 4; i++) pts.push('turf');
    for (let i = 0; i < 4; i++) pts.push('abiotic');
    return pts;
  });

  const [activePaintTool, setActivePaintTool] = useState<BenthicClass>('hardCoral');

  // Step 3: Bleaching & Pathogen
  const [bleachedPct, setBleachedPct] = useState(1.8);
  const [bleachingSeverity, setBleachingSeverity] = useState<BleachingSeverity>('Category 1 (Mild 1-10%)');
  const [disease, setDisease] = useState<CoralDisease>('None Detected');
  const [dominantGenera, setDominantGenera] = useState('Acropora, Porites, Pocillopora, Montipora');
  const [notes, setNotes] = useState('High rugosity with tabular Acropora shelf. Healthy coralline algae crust indicating high recruitment viability.');

  // Point count tallies
  const counts = samplePoints.reduce(
    (acc, pt) => {
      acc[pt] = (acc[pt] || 0) + 1;
      return acc;
    },
    { hardCoral: 0, softCoral: 0, cca: 0, macroalgae: 0, turf: 0, abiotic: 0 } as Record<BenthicClass, number>
  );

  const totalPoints = samplePoints.length; // 50
  const hardCoralPct = Number(((counts.hardCoral / totalPoints) * 100).toFixed(1));
  const softCoralPct = Number(((counts.softCoral / totalPoints) * 100).toFixed(1));
  const ccaPct = Number(((counts.cca / totalPoints) * 100).toFixed(1));
  const macroalgaePct = Number(((counts.macroalgae / totalPoints) * 100).toFixed(1));
  const turfPct = Number(((counts.turf / totalPoints) * 100).toFixed(1));
  const abioticPct = Number(((counts.abiotic / totalPoints) * 100).toFixed(1));

  // Handle click on a grid point
  const handlePointClick = (index: number) => {
    const updated = [...samplePoints];
    updated[index] = activePaintTool;
    setSamplePoints(updated);
  };

  // Color mappings
  const getClassColor = (c: BenthicClass) => {
    switch (c) {
      case 'hardCoral':
        return 'bg-cyan-400 text-slate-950 border-cyan-300';
      case 'softCoral':
        return 'bg-blue-500 text-white border-blue-400';
      case 'cca':
        return 'bg-emerald-500 text-white border-emerald-400';
      case 'macroalgae':
        return 'bg-amber-500 text-slate-950 border-amber-400';
      case 'turf':
        return 'bg-slate-600 text-slate-200 border-slate-500';
      case 'abiotic':
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  const calculateRHI = () => {
    let rhi = (hardCoralPct / 10) + (ccaPct / 15) - (macroalgaePct / 12);
    if (disease !== 'None Detected') rhi -= 0.6;
    if (bleachedPct > 20) rhi -= 0.7;
    return Math.min(5.0, Math.max(1.0, Number(rhi.toFixed(1))));
  };

  const handleFinish = () => {
    if (!siteName || !surveyLeader) return;

    const finalRHI = calculateRHI();

    const newSurvey: CoralReefSurvey = {
      id: `srv-${Date.now()}`,
      surveyCode: `TRANSECT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      siteName,
      mpaZone,
      region,
      coordinates: {
        latitude: -14.182 + (Math.random() - 0.5) * 2,
        longitude: 145.912 + (Math.random() - 0.5) * 2,
      },
      surveyDate: new Date().toISOString().split('T')[0],
      surveyLeader,
      teamMembers: ['Scientific Dive Ops Unit', 'Benthic Surveyor'],
      method,
      transectLengthMeters: 50,
      depthRangeMeters: { min: Number(depthMin), max: Number(depthMax) },
      waterTempCelsius: Number(waterTemp),
      underwaterVisibilityMeters: Number(visibility),
      benthicComposition: {
        hardCoralCover: hardCoralPct,
        softCoralCover: softCoralPct,
        macroalgaeCover: macroalgaePct,
        crustoseCorallineAlgae: ccaPct,
        turfAlgaeCover: turfPct,
        abioticSubstrate: abioticPct,
      },
      bleachedCoralPercentage: Number(bleachedPct),
      bleachingSeverity,
      dominantCoralGenera: dominantGenera.split(',').map(s => s.trim()),
      diseaseDetected: disease,
      reefHealthIndex: finalRHI,
      photoUrl: '/src/assets/images/benthic_transect_quadrat_1790787975199.jpg',
      notes: notes || 'Standard GCRMN transect validated with 50-point intercept tally.',
      validationStatus: 'Validated',
    };

    onSave(newSurvey);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Wizard Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900 z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <span>FIELD DIVE TRANSECT WIZARD</span>
              <span>·</span>
              <span>STEP {currentStep} OF 4</span>
            </div>
            <h3 className="text-base font-semibold text-slate-100">
              {currentStep === 1 && 'Dive Operations & Transect Setup'}
              {currentStep === 2 && 'Point-Intercept Benthic Intercept Matrix (50m)'}
              {currentStep === 3 && 'Coral Bleaching & Pathogen Diagnostic'}
              {currentStep === 4 && 'Field Verification & GCRMN Archival'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Step Progress Bar */}
        <div className="w-full bg-slate-950 h-1 flex border-b border-slate-800">
          <div
            className="bg-cyan-400 h-full transition-all duration-300"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>

        {/* Step Body */}
        <div className="p-6 flex-1 text-xs space-y-5">
          {/* STEP 1: DIVE CONTEXT */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="bg-cyan-950/30 border border-cyan-800/50 p-3 rounded text-cyan-300 flex items-center gap-2">
                <Shield className="w-4 h-4 shrink-0 text-cyan-400" />
                <span>Standardized 50m Line/Point Intercept protocol for marine protected areas.</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">
                    Reef Site Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Osprey North Pinnacle Fore-Reef"
                    value={siteName}
                    onChange={e => setSiteName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">
                    MPA Zonation
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
                    Region / Ocean Basin
                  </label>
                  <input
                    type="text"
                    value={region}
                    onChange={e => setRegion(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-slate-100"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">
                    Methodology
                  </label>
                  <select
                    value={method}
                    onChange={e => setMethod(e.target.value as SurveyMethod)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-slate-100"
                  >
                    <option value="Point Intercept Transect (PIT)">Point Intercept Transect (PIT - 1m interval)</option>
                    <option value="Line Intercept Transect (LIT)">Line Intercept Transect (LIT)</option>
                    <option value="Photo-Quadrat (GCRMN)">Photo-Quadrat (GCRMN Machine Analyzed)</option>
                    <option value="Manta Tow Survey">Manta Tow Survey (Reef perimeter)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-3.5 rounded-lg border border-slate-800">
                <div>
                  <label className="block text-slate-400 mb-1 text-[11px]">Min Depth (m)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={depthMin}
                    onChange={e => setDepthMin(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 font-mono text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 text-[11px]">Max Depth (m)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={depthMax}
                    onChange={e => setDepthMax(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 font-mono text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 text-[11px]">Water Temp (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={waterTemp}
                    onChange={e => setWaterTemp(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 font-mono text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 text-[11px]">Visibility (m)</label>
                  <input
                    type="number"
                    value={visibility}
                    onChange={e => setVisibility(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 font-mono text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">
                  Lead Scientific Diver *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Maya Lin, Scientific Diver #408"
                  value={surveyLeader}
                  onChange={e => setSurveyLeader(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-slate-100"
                />
              </div>
            </div>
          )}

          {/* STEP 2: INTERACTIVE POINT-INTERCEPT TALLY */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <div className="font-semibold text-slate-200">
                    50-Meter Point Intercept Tally Tool
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Click points below to stamp with the selected benthic class, simulating the underwater slate tally.
                  </div>
                </div>

                <div className="flex items-center gap-1 font-mono text-xs">
                  <span className="text-cyan-400 font-bold">{hardCoralPct}% Hard Coral</span>
                  <span className="text-slate-600">|</span>
                  <span className="text-amber-400">{macroalgaePct}% Algae</span>
                </div>
              </div>

              {/* Class Paint Tool Selector */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-mono uppercase text-slate-400 mr-1">Active Stamp:</span>
                {(
                  [
                    { key: 'hardCoral', label: 'Hard Coral (Scleractinia)', color: 'bg-cyan-400 text-slate-950' },
                    { key: 'softCoral', label: 'Soft Coral (Alcyonacea)', color: 'bg-blue-500 text-white' },
                    { key: 'cca', label: 'CCA (Coralline)', color: 'bg-emerald-500 text-white' },
                    { key: 'macroalgae', label: 'Macroalgae', color: 'bg-amber-500 text-slate-950' },
                    { key: 'turf', label: 'Turf Algae', color: 'bg-slate-600 text-slate-200' },
                    { key: 'abiotic', label: 'Abiotic (Sand/Rubble)', color: 'bg-slate-800 text-slate-300' },
                  ] as { key: BenthicClass; label: string; color: string }[]
                ).map(item => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setActivePaintTool(item.key)}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono font-medium transition-all ${
                      activePaintTool === item.key
                        ? `${item.color} ring-2 ring-white shadow-md`
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {item.label} ({counts[item.key]})
                  </button>
                ))}
              </div>

              {/* Stacked Live Benthic Cover Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>Cover Proportion</span>
                  <span>50 of 50 Points Classified (100%)</span>
                </div>
                <div className="w-full h-3 bg-slate-950 rounded-sm overflow-hidden flex border border-slate-800">
                  <div style={{ width: `${hardCoralPct}%` }} className="bg-cyan-400 h-full" title={`Hard Coral: ${hardCoralPct}%`} />
                  <div style={{ width: `${softCoralPct}%` }} className="bg-blue-500 h-full" title={`Soft Coral: ${softCoralPct}%`} />
                  <div style={{ width: `${ccaPct}%` }} className="bg-emerald-500 h-full" title={`CCA: ${ccaPct}%`} />
                  <div style={{ width: `${macroalgaePct}%` }} className="bg-amber-500 h-full" title={`Macroalgae: ${macroalgaePct}%`} />
                  <div style={{ width: `${turfPct}%` }} className="bg-slate-600 h-full" title={`Turf: ${turfPct}%`} />
                  <div style={{ width: `${abioticPct}%` }} className="bg-slate-800 h-full" title={`Abiotic: ${abioticPct}%`} />
                </div>
              </div>

              {/* 50-Point Intercept Grid */}
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-2 flex items-center justify-between">
                  <span>Point 01m to Point 50m along transect tape</span>
                  <span>Click any block to reassign</span>
                </div>

                <div className="grid grid-cols-10 gap-1.5">
                  {samplePoints.map((pt, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handlePointClick(i)}
                      className={`h-7 rounded border font-mono text-[10px] font-bold transition-transform hover:scale-105 flex items-center justify-center ${getClassColor(pt)}`}
                      title={`Point ${i + 1}m: ${pt}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: BLEACHING & PATHOGEN */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-slate-200">
                    Bleached Coral Incidence (%)
                  </span>
                  <span className="font-mono text-amber-400 font-bold text-sm">
                    {bleachedPct}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.5"
                  value={bleachedPct}
                  onChange={e => {
                    const val = Number(e.target.value);
                    setBleachedPct(val);
                    if (val < 1) setBleachingSeverity('Category 0 (None <1%)');
                    else if (val <= 10) setBleachingSeverity('Category 1 (Mild 1-10%)');
                    else if (val <= 50) setBleachingSeverity('Category 2 (Moderate 10-50%)');
                    else if (val <= 80) setBleachingSeverity('Category 3 (Severe 50-80%)');
                    else setBleachingSeverity('Category 4 (Catastrophic >80%)');
                  }}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <div className="text-xs font-mono text-slate-400">
                  Assigned Severity Tier:{' '}
                  <span className="text-amber-300 font-semibold">{bleachingSeverity}</span>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1.5">
                  Coral Disease & Pathogen Diagnostics
                </label>
                <select
                  value={disease}
                  onChange={e => setDisease(e.target.value as CoralDisease)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100"
                >
                  <option value="None Detected">None Detected (Healthy tissue margins)</option>
                  <option value="Stony Coral Tissue Loss Disease (SCTLD)">Stony Coral Tissue Loss Disease (SCTLD - Urgent)</option>
                  <option value="Black Band Disease (BBD)">Black Band Disease (Cyanobacterial consortium)</option>
                  <option value="White Syndrome">White Syndrome (Bacterial necrosis)</option>
                  <option value="Yellow Band Disease">Yellow Band Disease</option>
                  <option value="Skeletal Eroding Band">Skeletal Eroding Band (Ciliate Halofolliculina)</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">
                  Dominant Coral Genera Observed
                </label>
                <input
                  type="text"
                  value={dominantGenera}
                  onChange={e => setDominantGenera(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">
                  Biologist Rugosity & Structural Notes
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100"
                />
              </div>
            </div>
          )}

          {/* STEP 4: VERIFICATION & ARCHIVAL */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-mono text-cyan-400 font-semibold uppercase text-xs">
                    Transect Summary Scorecard
                  </span>
                  <span className="font-mono text-emerald-400 font-bold text-sm">
                    Reef Health Index: {calculateRHI()} / 5.0
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
                  <div>
                    <span className="text-slate-500 block">Site:</span>
                    <span className="text-slate-200 font-semibold">{siteName || 'Unnamed Site'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Hard Coral Cover:</span>
                    <span className="text-cyan-400 font-bold">{hardCoralPct}%</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Macroalgae Cover:</span>
                    <span className="text-amber-400 font-bold">{macroalgaePct}%</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Bleaching Rate:</span>
                    <span className="text-slate-200">{bleachedPct}%</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Disease Status:</span>
                    <span className={disease === 'None Detected' ? 'text-emerald-400' : 'text-rose-400'}>
                      {disease}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Lead Biologist:</span>
                    <span className="text-slate-200">{surveyLeader || 'Field Diver'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-cyan-950/20 border border-cyan-800/40 p-3 rounded text-xs text-slate-300 flex items-start gap-2">
                <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  By validating, this record is signed with GCRMN scientific schema, indexed into the regional MPA monitoring registry, and made available for instant CSV/JSON exports.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer Controls */}
        <div className="px-6 py-3 border-t border-slate-800 flex items-center justify-between bg-slate-900">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((currentStep - 1) as any)}
              className="px-3 py-1.5 text-xs text-slate-300 hover:text-slate-100 bg-slate-800 rounded flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-100 bg-slate-800 rounded"
            >
              Cancel
            </button>

            {currentStep < 4 ? (
              <button
                type="button"
                disabled={currentStep === 1 && (!siteName || !surveyLeader)}
                onClick={() => setCurrentStep((currentStep + 1) as any)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed rounded flex items-center gap-1"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                className="px-4 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded flex items-center gap-1"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Save & Validate Survey</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
