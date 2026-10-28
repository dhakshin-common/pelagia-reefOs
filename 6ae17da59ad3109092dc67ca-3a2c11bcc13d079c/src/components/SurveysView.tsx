import React, { useState } from 'react';
import {
  CoralReefSurvey,
  MPAZone,
  SurveyMethod,
} from '../types/marine';
import {
  Search,
  SlidersHorizontal,
  Eye,
  X,
  Download,
  Wand2,
  Plus,
  AlertCircle,
  Scan,
  Crosshair,
  Compass,
  Activity,
  Maximize2,
  Camera,
  Layers,
} from 'lucide-react';
import { exportToCSV } from '../utils/export';
import { playUiClick, playSonarPing, playAlertWarning } from '../utils/audio';

interface SurveysViewProps {
  surveys: CoralReefSurvey[];
  onOpenNewSurvey: () => void;
  onOpenWizard: () => void;
}

export const SurveysView: React.FC<SurveysViewProps> = ({
  surveys,
  onOpenNewSurvey,
  onOpenWizard,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'quadrat_vision'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZone, setSelectedZone] = useState<string>('ALL');
  const [selectedMethod, setSelectedMethod] = useState<string>('ALL');
  const [selectedDisease, setSelectedDisease] = useState<string>('ALL');
  const [inspectSurvey, setInspectSurvey] = useState<CoralReefSurvey | null>(null);

  // Vision scanner transect distance simulation slider (0 - 50m)
  const [transectMeter, setTransectMeter] = useState<number>(18.5);

  // Filtered surveys
  const filteredSurveys = surveys.filter(s => {
    const matchesSearch =
      s.siteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.surveyCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.surveyLeader.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.region.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesZone = selectedZone === 'ALL' || s.mpaZone === selectedZone;
    const matchesMethod = selectedMethod === 'ALL' || s.method === selectedMethod;
    const matchesDisease =
      selectedDisease === 'ALL' ||
      (selectedDisease === 'NONE' ? s.diseaseDetected === 'None Detected' : s.diseaseDetected !== 'None Detected');

    return matchesSearch && matchesZone && matchesMethod && matchesDisease;
  });

  const handleExportFiltered = () => {
    playUiClick();
    const exportRows = filteredSurveys.map(s => ({
      SurveyCode: s.surveyCode,
      SiteName: s.siteName,
      MPAZone: s.mpaZone,
      Region: s.region,
      Date: s.surveyDate,
      Method: s.method,
      TransectLengthM: s.transectLengthMeters,
      DepthMinM: s.depthRangeMeters.min,
      DepthMaxM: s.depthRangeMeters.max,
      WaterTempC: s.waterTempCelsius,
      VisibilityM: s.underwaterVisibilityMeters,
      HardCoralCoverPct: s.benthicComposition.hardCoralCover,
      SoftCoralCoverPct: s.benthicComposition.softCoralCover,
      MacroalgaeCoverPct: s.benthicComposition.macroalgaeCover,
      CrustoseCorallineAlgaePct: s.benthicComposition.crustoseCorallineAlgae,
      TurfAlgaeCoverPct: s.benthicComposition.turfAlgaeCover,
      AbioticPct: s.benthicComposition.abioticSubstrate,
      BleachedPct: s.bleachedCoralPercentage,
      BleachingSeverity: s.bleachingSeverity,
      Disease: s.diseaseDetected,
      ReefHealthIndex: s.reefHealthIndex,
      LeadBiologist: s.surveyLeader,
      Validation: s.validationStatus,
    }));
    exportToCSV('pelagia_reef_surveys', exportRows);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Futuristic Command Header */}
      <div className="bg-slate-950 border border-cyan-500/30 p-5 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hud-grid shadow-lg">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-cyan-400 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-bold">BENTHIC LINE INTERCEPT & MACHINE VISION SUITE</span>
          </div>
          <h2 className="text-xl font-bold font-['Chakra_Petch'] uppercase tracking-wider text-slate-100">
            Reef Transect Surveys & Benthic Telemetry
          </h2>
          <p className="text-xs text-slate-400 max-w-xl font-sans mt-0.5">
            Standardized line intercept transect (LIT) and photo-quadrat (PIT) monitoring complying with the Global Coral Reef Monitoring Network (GCRMN).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-stretch sm:self-auto font-mono text-xs">
          {/* View Mode Toggle */}
          <div className="flex bg-slate-900 border border-slate-800 rounded p-0.5">
            <button
              onClick={() => {
                playUiClick();
                setViewMode('grid');
              }}
              className={`px-3 py-1.5 rounded transition-colors ${
                viewMode === 'grid'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/50'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              DATA GRID
            </button>
            <button
              onClick={() => {
                playSonarPing(1800);
                setViewMode('quadrat_vision');
              }}
              className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
                viewMode === 'quadrat_vision'
                  ? 'bg-cyan-500/25 text-cyan-300 font-bold border border-cyan-500/50 shadow-[0_0_10px_rgba(34,211,238,0.3)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Scan className="w-3.5 h-3.5 text-cyan-400" />
              <span>AI VISION SCANNER</span>
            </button>
          </div>

          <button
            onClick={() => {
              playSonarPing(1400);
              onOpenWizard();
            }}
            className="px-4 py-2 font-bold uppercase text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(34,211,238,0.3)]"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Field Wizard</span>
          </button>

          <button
            onClick={() => {
              playUiClick();
              onOpenNewSurvey();
            }}
            className="px-3 py-2 text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-cyan-400" />
            <span>Manual Form</span>
          </button>
        </div>
      </div>

      {/* Subsea Computer Vision Quadrat Scanner Showcase (Futuristic Machine Vision Mode) */}
      {viewMode === 'quadrat_vision' && (
        <div className="bg-slate-950 border border-cyan-500/40 p-5 rounded-lg space-y-4 relative overflow-hidden font-mono shadow-[0_0_30px_rgba(6,182,212,0.15)]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
            <div className="flex items-center gap-2">
              <Scan className="w-5 h-5 text-cyan-400 animate-pulse" />
              <div>
                <span className="font-bold text-slate-100 text-sm">
                  AUTONOMOUS PHOTO-QUADRAT DEEP LEARNING CLASSIFIER
                </span>
                <div className="text-[10px] text-cyan-400">
                  MODEL: REEF-YOLO-V9 MARINE · CONFIDENCE THRESHOLD: 85% · CALIBRATION: 50x50cm
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="text-slate-400">TRANSECT PROGRESS:</span>
              <span className="text-cyan-300 font-bold tabular-nums">
                {transectMeter.toFixed(1)}m / 50.0m
              </span>
            </div>
          </div>

          {/* Interactive Simulated Transect Frame with Holographic Bounding Boxes */}
          <div className="relative aspect-video max-h-96 w-full rounded border border-cyan-500/50 overflow-hidden bg-slate-900 select-none">
            <img
              src="/src/assets/images/benthic_transect_survey_1790787968388.jpg"
              alt="Benthic Quadrat Frame"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* Scanlines Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%)] bg-[length:100%_4px] pointer-events-none opacity-40" />

            {/* Target Reticle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border border-cyan-400/40 rounded-full flex items-center justify-center pointer-events-none">
              <Crosshair className="w-6 h-6 text-cyan-400 animate-pulse" />
            </div>

            {/* Bounding Box 1: Acropora palmata */}
            <div className="absolute top-12 left-16 w-36 h-28 border-2 border-cyan-400 bg-cyan-400/10 p-1 flex flex-col justify-between">
              <div className="bg-slate-950/90 text-cyan-300 text-[10px] px-1 py-0.5 border border-cyan-400/50 font-bold self-start">
                Acropora cervicornis [98.4%]
              </div>
              <div className="text-[9px] text-cyan-200 bg-slate-950/80 px-1 self-start">
                Live Coral · Health: High
              </div>
            </div>

            {/* Bounding Box 2: Porites massive */}
            <div className="absolute bottom-14 right-20 w-44 h-32 border-2 border-emerald-400 bg-emerald-400/10 p-1 flex flex-col justify-between">
              <div className="bg-slate-950/90 text-emerald-300 text-[10px] px-1 py-0.5 border border-emerald-400/50 font-bold self-start">
                Porites lutea (Dome) [94.7%]
              </div>
              <div className="text-[9px] text-emerald-200 bg-slate-950/80 px-1 self-start">
                Substrate Anchor · 0.42m²
              </div>
            </div>

            {/* Bounding Box 3: Bleaching lesion */}
            <div className="absolute top-20 right-36 w-28 h-24 border-2 border-amber-400 bg-amber-400/10 p-1 flex flex-col justify-between">
              <div className="bg-slate-950/90 text-amber-300 text-[10px] px-1 py-0.5 border border-amber-400/50 font-bold self-start">
                Bleached Tip [Cat 2: 91.2%]
              </div>
              <div className="text-[9px] text-amber-200 bg-slate-950/80 px-1 self-start">
                Thermal Stress · Pale
              </div>
            </div>

            {/* Telemetry Corner Badges */}
            <div className="absolute bottom-3 left-3 bg-slate-950/90 px-2.5 py-1 rounded border border-cyan-500/40 text-[11px] text-cyan-300">
              FRAME #037 · DEPTH: -18.2m · WATER TEMP: 27.8°C
            </div>

            <div className="absolute top-3 right-3 bg-slate-950/90 px-2.5 py-1 rounded border border-cyan-500/40 text-[11px] text-slate-300">
              RUGOSITY INDEX: 2.85 (High Structural Complexity)
            </div>
          </div>

          {/* Interactive Transect Distance Scrubber */}
          <div className="space-y-1.5 bg-slate-900/80 p-3 rounded border border-slate-800">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">TRANSECT 50M PHOTO-QUADRAT SCRUBBER:</span>
              <span className="text-cyan-400 font-bold">{transectMeter.toFixed(1)} METERS</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="0.5"
              value={transectMeter}
              onChange={e => {
                setTransectMeter(parseFloat(e.target.value));
                if (Math.random() > 0.7) playUiClick(1600);
              }}
              className="w-full accent-cyan-400 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0m Origin (Reef Crest)</span>
              <span>25m Mid-Transect (Wall)</span>
              <span>50m Terminal (Deep Abyss)</span>
            </div>
          </div>
        </div>
      )}

      {/* Controls & Filter Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-slate-950 border border-slate-800 p-3.5 rounded-lg font-mono">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by site, code, leader, region..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded pl-9 pr-4 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Filter Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedZone}
            onChange={e => {
              playUiClick();
              setSelectedZone(e.target.value);
            }}
            className="bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All MPA Zones</option>
            <option value="Sanctuary (No-Take Core)">Sanctuary (No-Take Core)</option>
            <option value="Conservation Zone">Conservation Zone</option>
            <option value="Habitat Restoration Area">Habitat Restoration Area</option>
            <option value="Sustainable Use Buffer">Sustainable Use Buffer</option>
          </select>

          <select
            value={selectedMethod}
            onChange={e => {
              playUiClick();
              setSelectedMethod(e.target.value);
            }}
            className="bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Survey Methods</option>
            <option value="Line Intercept Transect (LIT)">Line Intercept (LIT)</option>
            <option value="Point Intercept Transect (PIT)">Point Intercept (PIT)</option>
            <option value="Photo-Quadrat (GCRMN)">Photo-Quadrat (GCRMN)</option>
            <option value="Manta Tow Survey">Manta Tow</option>
          </select>

          <select
            value={selectedDisease}
            onChange={e => {
              playUiClick();
              setSelectedDisease(e.target.value);
            }}
            className="bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Pathogen States</option>
            <option value="NONE">No Disease Detected</option>
            <option value="DETECTED">Pathogen / SCTLD Present</option>
          </select>

          <button
            onClick={handleExportFiltered}
            className="px-3 py-1.5 text-xs text-slate-300 hover:text-cyan-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded transition-colors flex items-center gap-1.5 font-bold"
            title="Download active filtered surveys as CSV"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* High-Density Futuristic Surveys Table */}
      <div className="bg-slate-950 border border-slate-800 rounded-lg overflow-hidden font-mono shadow-xl">
        <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="font-bold text-slate-200">Reef Benthic Transect Logs</span>
            <span>·</span>
            <span className="text-cyan-400">{filteredSurveys.length} surveys recorded</span>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-sm bg-cyan-400 inline-block" /> Hard Coral
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-sm bg-blue-500 inline-block" /> Soft Coral
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-sm bg-emerald-500 inline-block" /> CCA
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-sm bg-amber-500 inline-block" /> Macroalgae
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 text-[10px] uppercase tracking-wider">
                <th className="py-3 px-4">Survey Code & Date</th>
                <th className="py-3 px-4">Reef Site & MPA Sector</th>
                <th className="py-3 px-4">Method & Depth</th>
                <th className="py-3 px-4 min-w-[180px]">Benthic Composition</th>
                <th className="py-3 px-4">Bleaching</th>
                <th className="py-3 px-4">Health (RHI)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredSurveys.map(survey => {
                const bc = survey.benthicComposition;
                return (
                  <tr
                    key={survey.id}
                    className="hover:bg-slate-900/60 transition-colors group cursor-pointer"
                    onClick={() => {
                      playSonarPing(1600);
                      setInspectSurvey(survey);
                    }}
                  >
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">
                        {survey.surveyCode}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {survey.surveyDate}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-200 max-w-[200px] truncate font-sans">
                        {survey.siteName}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[200px]">
                        {survey.mpaZone}
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap text-slate-300">
                      <div>{survey.method.split(' ')[0]}</div>
                      <div className="text-[11px] text-slate-400">
                        {survey.depthRangeMeters.min}m – {survey.depthRangeMeters.max}m · {survey.waterTempCelsius}°C
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="text-cyan-300 font-bold">{bc.hardCoralCover}% Hard</span>
                        <span className="text-amber-400">{bc.macroalgaeCover}% Algae</span>
                      </div>
                      {/* Stacked micro-bar */}
                      <div className="w-full h-1.5 bg-slate-900 rounded-sm overflow-hidden flex border border-slate-800">
                        <div
                          style={{ width: `${bc.hardCoralCover}%` }}
                          className="bg-cyan-400 h-full"
                          title={`Hard Coral: ${bc.hardCoralCover}%`}
                        />
                        <div
                          style={{ width: `${bc.softCoralCover}%` }}
                          className="bg-blue-500 h-full"
                          title={`Soft Coral: ${bc.softCoralCover}%`}
                        />
                        <div
                          style={{ width: `${bc.crustoseCorallineAlgae}%` }}
                          className="bg-emerald-500 h-full"
                          title={`CCA: ${bc.crustoseCorallineAlgae}%`}
                        />
                        <div
                          style={{ width: `${bc.macroalgaeCover}%` }}
                          className="bg-amber-500 h-full"
                          title={`Macroalgae: ${bc.macroalgaeCover}%`}
                        />
                        <div
                          style={{ width: `${bc.turfAlgaeCover + bc.abioticSubstrate}%` }}
                          className="bg-slate-700 h-full"
                          title={`Turf & Abiotic: ${bc.turfAlgaeCover + bc.abioticSubstrate}%`}
                        />
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="text-slate-200 font-bold">
                        {survey.bleachedCoralPercentage}%
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[130px]">
                        {survey.bleachingSeverity.split(' ')[0]} {survey.bleachingSeverity.split(' ')[1]}
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-bold text-emerald-400">
                        {survey.reefHealthIndex.toFixed(1)} / 5.0
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {survey.diseaseDetected === 'None Detected' ? 'No Disease' : 'SCTLD Lesions'}
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="text-slate-300 font-medium">
                        {survey.validationStatus}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          playSonarPing(1600);
                          setInspectSurvey(survey);
                        }}
                        className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-900 rounded transition-colors"
                        title="View complete survey inspection"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Survey Detail / Photo-Quadrat Inspection Modal */}
      {inspectSurvey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="bg-slate-950 border border-cyan-500/50 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl font-mono">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-950 z-10">
              <div>
                <div className="flex items-center gap-2 text-xs text-cyan-400 font-bold">
                  <span>{inspectSurvey.surveyCode}</span>
                  <span>·</span>
                  <span>{inspectSurvey.surveyDate}</span>
                </div>
                <h3 className="text-base font-bold text-slate-100 mt-0.5 font-['Chakra_Petch']">
                  {inspectSurvey.siteName}
                </h3>
              </div>
              <button
                onClick={() => setInspectSurvey(null)}
                className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-900 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Photo Evidence & Quadrat banner */}
              {inspectSurvey.photoUrl && (
                <div className="relative rounded overflow-hidden border border-slate-800 bg-slate-950 aspect-video max-h-72 w-full">
                  <img
                    src={inspectSurvey.photoUrl}
                    alt={`Benthic survey photograph at ${inspectSurvey.siteName}`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent pointer-events-none" />
                  <div className="absolute bottom-3 left-3 right-3 text-xs flex items-center justify-between text-slate-200">
                    <span className="bg-slate-950/90 px-2 py-1 rounded border border-slate-800">
                      Transect Record · Depth: {inspectSurvey.depthRangeMeters.min}m
                    </span>
                    <span className="bg-slate-950/90 px-2 py-1 rounded border border-slate-800">
                      Visibility: {inspectSurvey.underwaterVisibilityMeters}m
                    </span>
                  </div>
                </div>
              )}

              {/* Grid of Key Survey Diagnostics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-900 p-3 rounded border border-slate-800">
                  <div className="text-[11px] text-slate-400">Hard Coral Cover</div>
                  <div className="text-xl font-bold text-cyan-400">
                    {inspectSurvey.benthicComposition.hardCoralCover}%
                  </div>
                </div>
                <div className="bg-slate-900 p-3 rounded border border-slate-800">
                  <div className="text-[11px] text-slate-400">Macroalgae Cover</div>
                  <div className="text-xl font-bold text-amber-400">
                    {inspectSurvey.benthicComposition.macroalgaeCover}%
                  </div>
                </div>
                <div className="bg-slate-900 p-3 rounded border border-slate-800">
                  <div className="text-[11px] text-slate-400">Bleaching Severity</div>
                  <div className="text-xl font-bold text-slate-200">
                    {inspectSurvey.bleachedCoralPercentage}%
                  </div>
                </div>
                <div className="bg-slate-900 p-3 rounded border border-slate-800">
                  <div className="text-[11px] text-slate-400">Reef Health Index</div>
                  <div className="text-xl font-bold text-emerald-400">
                    {inspectSurvey.reefHealthIndex} <span className="text-xs text-slate-500 font-normal">/ 5.0</span>
                  </div>
                </div>
              </div>

              {/* Benthic Composition Full Breakdown */}
              <div className="bg-slate-900/60 p-4 rounded border border-slate-800">
                <h4 className="text-xs uppercase tracking-wider text-slate-300 mb-3 font-bold">
                  Full Benthic Class Partitioning (50m Transect)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="flex justify-between border-b border-slate-800 pb-1.5">
                    <span className="text-slate-400">Hard Coral:</span>
                    <span className="text-cyan-400 font-bold">{inspectSurvey.benthicComposition.hardCoralCover}%</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1.5">
                    <span className="text-slate-400">Soft Coral:</span>
                    <span className="text-blue-400 font-bold">{inspectSurvey.benthicComposition.softCoralCover}%</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1.5">
                    <span className="text-slate-400">CCA:</span>
                    <span className="text-emerald-400 font-bold">{inspectSurvey.benthicComposition.crustoseCorallineAlgae}%</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1.5">
                    <span className="text-slate-400">Macroalgae:</span>
                    <span className="text-amber-400 font-bold">{inspectSurvey.benthicComposition.macroalgaeCover}%</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1.5">
                    <span className="text-slate-400">Turf Algae:</span>
                    <span className="text-slate-300 font-bold">{inspectSurvey.benthicComposition.turfAlgaeCover}%</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1.5">
                    <span className="text-slate-400">Abiotic:</span>
                    <span className="text-slate-300 font-bold">{inspectSurvey.benthicComposition.abioticSubstrate}%</span>
                  </div>
                </div>
              </div>

              {/* Dominant Genera & Health Indicators */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-900 p-4 rounded border border-slate-800">
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider mb-2 font-bold">
                    Dominant Coral Genera Observed
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {inspectSurvey.dominantCoralGenera.map(genus => (
                      <span key={genus} className="text-cyan-300 bg-slate-950 border border-slate-800 px-2 py-1 rounded">
                        {genus}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 text-slate-400 text-[11px]">
                    <span className="text-slate-300 font-medium">Pathogen Status: </span>
                    <span className={inspectSurvey.diseaseDetected === 'None Detected' ? 'text-emerald-400' : 'text-rose-400'}>
                      {inspectSurvey.diseaseDetected}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-900 p-4 rounded border border-slate-800">
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider mb-2 font-bold">
                    Dive Operations & Roster
                  </div>
                  <div className="space-y-1 text-slate-300 font-sans">
                    <div><span className="text-slate-500 font-mono">Lead Biologist:</span> {inspectSurvey.surveyLeader}</div>
                    <div><span className="text-slate-500 font-mono">Survey Team:</span> {inspectSurvey.teamMembers.join(', ')}</div>
                    <div><span className="text-slate-500 font-mono">MPA Sector:</span> {inspectSurvey.mpaZone}</div>
                    <div>
                      <span className="text-slate-500 font-mono">GPS Coordinates:</span>{' '}
                      <span className="font-mono text-cyan-300">
                        {inspectSurvey.coordinates.latitude.toFixed(4)}°, {inspectSurvey.coordinates.longitude.toFixed(4)}°
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ecological Notes */}
              <div className="bg-slate-900 p-4 rounded border border-slate-800">
                <div className="text-[11px] text-slate-400 uppercase tracking-wider mb-1 font-bold">
                  Field Observations & Ecological Notes
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {inspectSurvey.notes}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-slate-800 flex justify-end bg-slate-950">
              <button
                onClick={() => setInspectSurvey(null)}
                className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-slate-100 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded transition-colors"
              >
                Close Inspection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
