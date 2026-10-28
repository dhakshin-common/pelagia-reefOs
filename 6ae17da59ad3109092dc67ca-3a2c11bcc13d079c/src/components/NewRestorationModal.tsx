import React, { useState } from 'react';
import { RestorationActivity, AttachmentTechnique } from '../types/marine';
import { X, Check } from 'lucide-react';

interface NewRestorationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (activity: RestorationActivity) => void;
}

export const NewRestorationModal: React.FC<NewRestorationModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  const [siteName, setSiteName] = useState('');
  const [nurseryOrigin, setNurseryOrigin] = useState('');
  const [coralSpecies, setCoralSpecies] = useState('Acropora cervicornis, Acropora palmata');
  const [technique, setTechnique] = useState<AttachmentTechnique>('Coral Clips on Reef Stars');
  const [fragments, setFragments] = useState(650);
  const [areaM2, setAreaM2] = useState(250);
  const [leadBiologist, setLeadBiologist] = useState('');
  const [initialSurvival, setInitialSurvival] = useState(97.5);
  const [extensionRate, setExtensionRate] = useState(7.5);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteName || !leadBiologist) return;

    const newRestoration: RestorationActivity = {
      id: `rst-${Date.now()}`,
      batchCode: `REST-${new Date().getFullYear()}-PLG-${Math.floor(10 + Math.random() * 90)}`,
      siteName,
      nurseryOrigin: nurseryOrigin || 'In-Situ Ocean Rope Nursery Line #2',
      coralSpecies: coralSpecies.split(',').map(s => s.trim()),
      outplantDate: new Date().toISOString().split('T')[0],
      technique,
      fragmentsOutplanted: Number(fragments),
      restoredAreaM2: Number(areaM2),
      leadRestorationBiologist: leadBiologist,
      survivalRate30d: Number(initialSurvival),
      survivalRate90d: Number((initialSurvival - 3.5).toFixed(1)),
      survivalRate1Year: Number((initialSurvival - 10.0).toFixed(1)),
      currentExtensionRateMmMonth: Number(extensionRate),
      status: 'Active Monitoring',
      maintenanceHistory: [
        {
          date: new Date().toISOString().split('T')[0],
          action: 'Initial outplanting verification & stability audit',
          technician: leadBiologist,
        },
      ],
      notes: notes || 'Outplanted into degraded reef matrix to enhance rugosity and larval seeding.',
    };

    onSave(newRestoration);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-xl w-full shadow-2xl">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-cyan-400">Reef Restoration Program</span>
            <h3 className="text-base font-semibold text-slate-100">
              Record Coral Outplanting Campaign Batch
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
              Restoration Plot / Reef Site *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. North Atoll Recovery Zone Block B"
              value={siteName}
              onChange={e => setSiteName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-300 mb-1">
                Source Nursery Origin
              </label>
              <input
                type="text"
                placeholder="e.g. Offshore Floating Coral Tree Grid #5"
                value={nurseryOrigin}
                onChange={e => setNurseryOrigin(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">
                Attachment Technique
              </label>
              <select
                value={technique}
                onChange={e => setTechnique(e.target.value as AttachmentTechnique)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100"
              >
                <option value="Coral Clips on Reef Stars">Coral Clips on Reef Stars (Mars Method)</option>
                <option value="Marine Epoxy & Plugs">Marine Epoxy & Ceramic Plugs</option>
                <option value="Direct Outplant Pin">Direct Outplant Stainless Pin</option>
                <option value="Substrate Cement">Hydraulic Substrate Cement</option>
                <option value="Cable Ties on Rebar">Cable Ties on Rebar Frame</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1">
              Outplanted Coral Species
            </label>
            <input
              type="text"
              placeholder="e.g. Acropora cervicornis, Porites cylindrica"
              value={coralSpecies}
              onChange={e => setCoralSpecies(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Fragments (Count)</label>
              <input
                type="number"
                min="10"
                value={fragments}
                onChange={e => setFragments(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 font-mono text-slate-100"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Restored Area (m²)</label>
              <input
                type="number"
                min="1"
                value={areaM2}
                onChange={e => setAreaM2(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 font-mono text-slate-100"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">30d Surv. (%)</label>
              <input
                type="number"
                step="0.1"
                value={initialSurvival}
                onChange={e => setInitialSurvival(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 font-mono text-slate-100"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Ext. Rate (mm/mo)</label>
              <input
                type="number"
                step="0.1"
                value={extensionRate}
                onChange={e => setExtensionRate(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 font-mono text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1">
              Lead Restoration Biologist *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Dr. Kimberly Adams"
              value={leadBiologist}
              onChange={e => setLeadBiologist(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1">
              Campaign Notes & Genet Resilience
            </label>
            <textarea
              rows={2}
              placeholder="Genotypes utilized, thermal pre-conditioning notes, structural anchor integrity..."
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
              <span>Record Outplant Campaign</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
