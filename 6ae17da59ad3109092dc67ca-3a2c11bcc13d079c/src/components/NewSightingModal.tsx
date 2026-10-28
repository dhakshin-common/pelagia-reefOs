import React, { useState } from 'react';
import { BiodiversitySighting, IndicatorSpecies } from '../types/marine';
import { X, Check } from 'lucide-react';

interface NewSightingModalProps {
  isOpen: boolean;
  onClose: () => void;
  speciesList: IndicatorSpecies[];
  onSave: (sighting: BiodiversitySighting) => void;
}

export const NewSightingModal: React.FC<NewSightingModalProps> = ({
  isOpen,
  onClose,
  speciesList,
  onSave,
}) => {
  if (!isOpen) return null;

  const [selectedSpeciesId, setSelectedSpeciesId] = useState(speciesList[0]?.id || '');
  const [siteName, setSiteName] = useState('');
  const [count, setCount] = useState(1);
  const [lifeStage, setLifeStage] = useState<'Juvenile' | 'Sub-Adult' | 'Adult' | 'Mixed'>('Adult');
  const [depth, setDepth] = useState(10);
  const [sizeEstimate, setSizeEstimate] = useState(30);
  const [observer, setObserver] = useState('');
  const [notes, setNotes] = useState('');

  const selectedSpecies = speciesList.find(s => s.id === selectedSpeciesId) || speciesList[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteName || !observer) return;

    const density = Number((count / 5).toFixed(1)); // estimate density per 100m² belt

    const newSighting: BiodiversitySighting = {
      id: `sig-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      siteName,
      speciesId: selectedSpecies.id,
      scientificName: selectedSpecies.scientificName,
      commonName: selectedSpecies.commonName,
      taxa: selectedSpecies.taxa,
      count: Number(count),
      densityPer100m2: density,
      lifeStage,
      depthMeters: Number(depth),
      sizeEstimateCm: Number(sizeEstimate),
      observer,
      notes: notes || `Direct field census observation. Guild: ${selectedSpecies.trophicGuild}.`,
    };

    onSave(newSighting);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full shadow-2xl">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-cyan-400">Biodiversity Monitoring</span>
            <h3 className="text-base font-semibold text-slate-100">
              Record Indicator Species Census Sighting
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-medium text-slate-300 mb-1">
              Select Indicator / Keystone Species *
            </label>
            <select
              value={selectedSpeciesId}
              onChange={e => setSelectedSpeciesId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
            >
              {speciesList.map(sp => (
                <option key={sp.id} value={sp.id}>
                  {sp.commonName} ({sp.scientificName}) — {sp.iucnStatus.split(' ')[0]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1">
              Survey Site / MPA Location *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Sombrero Reef Spur #2"
              value={siteName}
              onChange={e => setSiteName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Count (Indiv)</label>
              <input
                type="number"
                min="1"
                value={count}
                onChange={e => setCount(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 font-mono text-slate-100"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Life Stage</label>
              <select
                value={lifeStage}
                onChange={e => setLifeStage(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-slate-100"
              >
                <option value="Adult">Adult</option>
                <option value="Sub-Adult">Sub-Adult</option>
                <option value="Juvenile">Juvenile</option>
                <option value="Mixed">Mixed</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Depth (m)</label>
              <input
                type="number"
                value={depth}
                onChange={e => setDepth(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 font-mono text-slate-100"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Size (cm est)</label>
              <input
                type="number"
                value={sizeEstimate}
                onChange={e => setSizeEstimate(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 font-mono text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1">
              Observer / Diver Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Dr. Elena Rostova"
              value={observer}
              onChange={e => setObserver(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1">
              Behavioral & Habitat Interaction Notes
            </label>
            <textarea
              rows={2}
              placeholder="Feeding behavior, cleaning station usage, territorial interaction..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
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
              <span>Log Census Sighting</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
