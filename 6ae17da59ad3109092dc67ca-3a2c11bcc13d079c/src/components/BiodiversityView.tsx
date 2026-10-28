import React, { useState } from 'react';
import { IndicatorSpecies, BiodiversitySighting } from '../types/marine';
import {
  Search,
  Plus,
  Download,
  AlertTriangle,
  ShieldCheck,
  Fish,
  AlertCircle,
  Syringe,
  Radio,
  Volume2,
  Activity,
  Compass,
  Dna,
} from 'lucide-react';
import { exportToCSV } from '../utils/export';
import { playUiClick, playSonarPing, playAlertWarning } from '../utils/audio';

interface BiodiversityViewProps {
  speciesList: IndicatorSpecies[];
  sightings: BiodiversitySighting[];
  onOpenNewSighting: () => void;
}

export const BiodiversityView: React.FC<BiodiversityViewProps> = ({
  speciesList,
  sightings,
  onOpenNewSighting,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'sightings' | 'species'>('sightings');
  const [searchQuery, setSearchQuery] = useState('');
  const [taxaFilter, setTaxaFilter] = useState('ALL');
  const [iucnFilter, setIucnFilter] = useState('ALL');
  const [showCotsPlaybook, setShowCotsPlaybook] = useState(false);
  const [activeFrequencyBand, setActiveFrequencyBand] = useState<'high' | 'mid' | 'low'>('high');

  // Filtered sightings
  const filteredSightings = sightings.filter(s => {
    const matchesSearch =
      s.commonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.scientificName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.siteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.observer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Filtered species
  const filteredSpecies = speciesList.filter(sp => {
    const matchesSearch =
      sp.commonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sp.scientificName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sp.indicatorRole.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTaxa = taxaFilter === 'ALL' || sp.taxa.includes(taxaFilter);
    const matchesIucn = iucnFilter === 'ALL' || sp.iucnStatus.includes(iucnFilter);
    return matchesSearch && matchesTaxa && matchesIucn;
  });

  // Trophic Cascade analysis
  const herbivoreSightings = sightings.filter(s =>
    s.scientificName.includes('Scaroides') ||
    s.scientificName.includes('Acanthurus') ||
    s.scientificName.includes('Diadema') ||
    s.scientificName.includes('Bolbometopon')
  );
  const totalHerbivores = herbivoreSightings.reduce((acc, s) => acc + s.count, 0);

  const cotsSightings = sightings.filter(s => s.scientificName.includes('Acanthaster'));
  const totalCots = cotsSightings.reduce((acc, s) => acc + s.count, 0);

  const handleExportSightings = () => {
    playUiClick();
    const exportData = sightings.map(s => ({
      Date: s.date,
      Site: s.siteName,
      CommonName: s.commonName,
      ScientificName: s.scientificName,
      Taxa: s.taxa,
      Count: s.count,
      DensityPer100m2: s.densityPer100m2,
      LifeStage: s.lifeStage,
      DepthMeters: s.depthMeters,
      SizeEstimateCm: s.sizeEstimateCm,
      Observer: s.observer,
      Notes: s.notes,
    }));
    exportToCSV('pelagia_biodiversity_census', exportData);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* 1. Bio-Acoustic Soundscape & Keystone Sentinel Ticker */}
      <div className="bg-slate-950 border border-cyan-500/30 p-5 rounded-lg hud-grid space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-3 gap-2 font-mono">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="text-xs font-bold text-slate-100 uppercase tracking-wider font-['Chakra_Petch']">
              Bio-Acoustic Reef Hydrophone Spectrum & eDNA Array
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span>HYDROPHONE DEPTH: -14.2m</span>
            <span className="text-cyan-400 font-bold">STREAM: 192 kHz / 24-bit</span>
          </div>
        </div>

        {/* Bio-Acoustic Spectrum Visualizer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
          <div
            onClick={() => {
              playSonarPing(2400, 0.2);
              setActiveFrequencyBand('high');
            }}
            className={`p-3 rounded border cursor-pointer transition-all ${
              activeFrequencyBand === 'high'
                ? 'bg-cyan-950/70 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-[10px] mb-1 font-bold">
              <span>HIGH FREQ (4 - 10 kHz)</span>
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-sm font-bold text-slate-100 font-sans">
              Snapping Shrimp Bio-Cavitation
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Active crackle intensity: 142 dB re 1µPa (High Reef Rigidity)
            </div>
          </div>

          <div
            onClick={() => {
              playSonarPing(750, 0.35);
              setActiveFrequencyBand('mid');
            }}
            className={`p-3 rounded border cursor-pointer transition-all ${
              activeFrequencyBand === 'mid'
                ? 'bg-emerald-950/70 border-emerald-400 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-[10px] mb-1 font-bold text-emerald-400">
              <span>MID FREQ (400 - 900 Hz)</span>
              <Volume2 className="w-3.5 h-3.5" />
            </div>
            <div className="text-sm font-bold text-slate-100 font-sans">
              Herbivore Grazing Scrape Pulses
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Scaroides parrotfish scrape index: 38 bites/min
            </div>
          </div>

          <div
            onClick={() => {
              playSonarPing(220, 0.5);
              setActiveFrequencyBand('low');
            }}
            className={`p-3 rounded border cursor-pointer transition-all ${
              activeFrequencyBand === 'low'
                ? 'bg-blue-950/70 border-blue-400 text-blue-200 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-[10px] mb-1 font-bold text-blue-400">
              <span>LOW FREQ (20 - 250 Hz)</span>
              <Volume2 className="w-3.5 h-3.5" />
            </div>
            <div className="text-sm font-bold text-slate-100 font-sans">
              Cetacean & Pelagic Hydrodynamics
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Megaptera novaeangliae low register pulses verified
            </div>
          </div>
        </div>
      </div>

      {/* 2. Trophic Cascade & Early Warning HUD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
        {/* Trophic Grazing Pressure */}
        <div className="bg-slate-950 border border-slate-800 p-4 rounded relative overflow-hidden">
          <span className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-emerald-400" />
          <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">
            Herbivore Grazing Guild Index
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-['Chakra_Petch']">
            {totalHerbivores} <span className="text-xs text-slate-400 font-normal">grazers logged</span>
          </div>
          <div className="text-xs text-slate-400 mt-2 flex items-center justify-between">
            <span>Parrotfish / Tangs / Urchins</span>
            <span className="text-emerald-400 font-bold">Grazing Buffer Strong</span>
          </div>
        </div>

        {/* COTS Outbreak Early Warning */}
        <div className="bg-slate-950 border border-slate-800 p-4 rounded relative overflow-hidden">
          <span className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-amber-400" />
          <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">
            Crown-of-Thorns Outbreak Status
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-400 font-['Chakra_Petch']">
              {totalCots > 0 ? `${totalCots} Recorded` : 'Zero Outbreaks'}
            </span>
            <span className="text-xs text-slate-400 font-mono">(Threshold: &gt;0.2 / 100m²)</span>
          </div>
          <div className="text-xs mt-2 flex items-center justify-between">
            <span className="text-slate-400">Early Warning Trigger:</span>
            <button
              onClick={() => {
                playAlertWarning();
                setShowCotsPlaybook(!showCotsPlaybook);
              }}
              className="text-cyan-400 hover:text-cyan-300 underline font-bold"
            >
              {showCotsPlaybook ? 'Hide Cull Protocol' : 'View Cull Protocol'}
            </button>
          </div>
        </div>

        {/* IUCN Red-List Vulnerability */}
        <div className="bg-slate-950 border border-slate-800 p-4 rounded relative overflow-hidden">
          <span className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-rose-400" />
          <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">
            IUCN Red List Indicator Sentinel
          </div>
          <div className="text-2xl font-bold text-rose-400 font-['Chakra_Petch']">
            3 <span className="text-xs text-slate-400 font-normal">Critically Endangered Taxa</span>
          </div>
          <div className="text-xs text-slate-400 mt-2 flex items-center justify-between">
            <span>Acropora palmata · Tridacna</span>
            <span className="text-cyan-400 font-bold">Recovery Active</span>
          </div>
        </div>
      </div>

      {/* COTS Cull Protocol Drawer (When expanded) */}
      {showCotsPlaybook && (
        <div className="bg-slate-950 border border-amber-500/80 p-4 rounded space-y-2 text-xs animate-in fade-in duration-200 font-mono shadow-[0_0_20px_rgba(251,146,60,0.15)]">
          <div className="flex items-center gap-2 text-amber-400 font-bold uppercase text-xs">
            <Syringe className="w-4 h-4" />
            <span>Standard Operating Procedure: Crown-of-Thorns Starfish (COTS) Control Cull</span>
          </div>
          <p className="text-slate-300 leading-relaxed font-sans">
            When density surpasses 0.2 starfish per 2-minute manta tow or &gt;15 individuals/hectare, dispatch rapid-response scuba cull teams.
            Utilize single-shot 10ml to 12ml oxbile (bile salt 20% solution) or sodium bisulphate (200g/L) injection into the base of an arm.
            Avoid manual cutting or removal without containment to prevent gamete release or arm regeneration.
          </p>
        </div>
      )}

      {/* Top Bar with Subtabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-950 border border-slate-800 p-4 rounded font-mono">
        {/* Subtabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded">
          <button
            onClick={() => {
              playUiClick();
              setActiveSubTab('sightings');
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded transition-colors whitespace-nowrap ${
              activeSubTab === 'sightings'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/60 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            FIELD CENSUS LOGS ({sightings.length})
          </button>
          <button
            onClick={() => {
              playUiClick();
              setActiveSubTab('species');
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded transition-colors whitespace-nowrap ${
              activeSubTab === 'species'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/60 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            INDICATOR SPECIES REGISTRY ({speciesList.length})
          </button>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search species or site..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <button
            onClick={handleExportSightings}
            className="px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-cyan-300 bg-slate-900 hover:bg-slate-850 border border-slate-700 rounded transition-colors flex items-center gap-1.5"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">CSV</span>
          </button>

          <button
            onClick={() => {
              playSonarPing(1600);
              onOpenNewSighting();
            }}
            className="px-3 py-1.5 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded transition-all flex items-center gap-1 whitespace-nowrap shadow-[0_0_12px_rgba(34,211,238,0.3)]"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>+ RECORD SIGHTING</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'sightings' ? (
        /* Field Sightings Log Table */
        <div className="bg-slate-950 border border-slate-800 rounded overflow-hidden font-mono shadow-xl">
          <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 bg-slate-900/60">
            <span className="font-bold text-slate-200">
              Recent Ecological Census Sightings
            </span>
            <span className="text-cyan-400 font-bold">
              {filteredSightings.length} records active
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 text-[10px] uppercase tracking-wider">
                  <th className="py-3 px-4">Date & Site</th>
                  <th className="py-3 px-4">Species Name & Taxa</th>
                  <th className="py-3 px-4">Count & Density</th>
                  <th className="py-3 px-4">Life Stage & Size</th>
                  <th className="py-3 px-4">Depth</th>
                  <th className="py-3 px-4">Observer & Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredSightings.map(sighting => (
                  <tr key={sighting.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-bold text-slate-300">{sighting.date}</div>
                      <div className="text-[11px] text-slate-400 font-sans">{sighting.siteName}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-100 flex items-center gap-1.5 font-sans">
                        <Fish className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>{sighting.commonName}</span>
                      </div>
                      <div className="text-[11px] italic font-serif text-cyan-300">
                        {sighting.scientificName} · {sighting.taxa}
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-bold text-slate-100">
                        {sighting.count} individuals
                      </div>
                      <div className="text-[11px] text-cyan-400">
                        {sighting.densityPer100m2} / 100m²
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="text-slate-200 font-sans">{sighting.lifeStage}</div>
                      <div className="text-[11px] text-slate-400">
                        ~{sighting.sizeEstimateCm} cm est.
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap text-cyan-300 font-bold">
                      -{sighting.depthMeters.toFixed(1)} m
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <div className="text-slate-300 font-sans truncate">{sighting.observer}</div>
                      <div className="text-[11px] text-slate-400 line-clamp-1 font-sans">{sighting.notes}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Indicator Species Catalog Grid */
        <div className="space-y-4 font-mono">
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={taxaFilter}
              onChange={e => {
                playUiClick();
                setTaxaFilter(e.target.value);
              }}
              className="bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Taxonomical Classes</option>
              <option value="Scleractinia">Scleractinia (Hard Coral)</option>
              <option value="Teleostei">Teleostei (Reef Fish)</option>
              <option value="Echinodermata">Echinodermata (Urchins & Stars)</option>
              <option value="Mollusca">Mollusca (Giant Clams)</option>
              <option value="Elasmobranchii">Elasmobranchii (Sharks)</option>
              <option value="Reptilia">Reptilia (Turtles)</option>
            </select>

            <select
              value={iucnFilter}
              onChange={e => {
                playUiClick();
                setIucnFilter(e.target.value);
              }}
              className="bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All IUCN Statuses</option>
              <option value="CR">Critically Endangered (CR)</option>
              <option value="EN">Endangered (EN)</option>
              <option value="VU">Vulnerable (VU)</option>
              <option value="NT">Near Threatened (NT)</option>
              <option value="LC">Least Concern (LC)</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSpecies.map(species => {
              const isThreatened =
                species.iucnStatus.includes('CR') ||
                species.iucnStatus.includes('EN') ||
                species.iucnStatus.includes('VU');
              return (
                <div
                  key={species.id}
                  className="bg-slate-950 border border-slate-800 rounded p-4 transition-all hover:border-cyan-400 flex flex-col justify-between shadow-lg relative group overflow-hidden"
                >
                  <span className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyan-400" />
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h4 className="text-sm font-bold text-slate-100 font-sans group-hover:text-cyan-300 transition-colors">
                          {species.commonName}
                        </h4>
                        <div className="text-xs font-serif italic text-cyan-300">
                          {species.scientificName}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-[11px]">
                        {isThreatened ? (
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                        ) : (
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                        <span className={isThreatened ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                          {species.iucnStatus.split(' ')[0]}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-400 mb-3 space-y-1">
                      <div>
                        <span className="text-slate-500">Guild: </span>
                        <span>{species.trophicGuild}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Taxa: </span>
                        <span>{species.taxa}</span>
                      </div>
                    </div>

                    <div className="bg-slate-900 p-2.5 rounded border border-slate-800 text-xs text-slate-300 leading-relaxed mb-3 font-sans">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 mb-0.5">
                        Ecological Indicator Role
                      </div>
                      {species.indicatorRole}
                    </div>
                  </div>

                  <div className="text-[11px] text-cyan-400 pt-2 border-t border-slate-800 flex items-center justify-between">
                    <span>Baseline Density:</span>
                    <span className="font-bold">{species.idealDensity}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
