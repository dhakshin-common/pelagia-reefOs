import React, { useState } from 'react';
import { CoralReefSurvey, BiodiversitySighting, RestorationActivity, OceanographicStation } from '../types/marine';
import { exportToCSV, exportToJSON, generateAgencyReportSummary } from '../utils/export';
import { X, FileText, Download, CheckCircle, Database, Archive, Sparkles, ExternalLink } from 'lucide-react';
import { playUiClick, playSonarPing } from '../utils/audio';

interface ReportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  surveys: CoralReefSurvey[];
  sightings: BiodiversitySighting[];
  restorations: RestorationActivity[];
  stations: OceanographicStation[];
}

export const ReportExportModal: React.FC<ReportExportModalProps> = ({
  isOpen,
  onClose,
  surveys,
  sightings,
  restorations,
  stations,
}) => {
  if (!isOpen) return null;

  const report = generateAgencyReportSummary(surveys, sightings, restorations, stations);

  const handleExportFullJSON = () => {
    exportToJSON('pelagia_marine_conservation_agency_full_audit', report);
  };

  const handleExportSurveysCSV = () => {
    const data = surveys.map(s => ({
      SurveyCode: s.surveyCode,
      SiteName: s.siteName,
      MPAZone: s.mpaZone,
      Region: s.region,
      Date: s.surveyDate,
      Method: s.method,
      HardCoralCoverPct: s.benthicComposition.hardCoralCover,
      SoftCoralCoverPct: s.benthicComposition.softCoralCover,
      MacroalgaeCoverPct: s.benthicComposition.macroalgaeCover,
      CCA_CoverPct: s.benthicComposition.crustoseCorallineAlgae,
      BleachedPct: s.bleachedCoralPercentage,
      BleachingCategory: s.bleachingSeverity,
      PathogenDetected: s.diseaseDetected,
      ReefHealthIndex: s.reefHealthIndex,
      LeadBiologist: s.surveyLeader,
      ValidationStatus: s.validationStatus,
    }));
    exportToCSV('pelagia_surveys_dataset', data);
  };

  const handleExportBiodiversityCSV = () => {
    const data = sightings.map(s => ({
      Date: s.date,
      Site: s.siteName,
      CommonName: s.commonName,
      ScientificName: s.scientificName,
      Taxa: s.taxa,
      Count: s.count,
      DensityPer100m2: s.densityPer100m2,
      LifeStage: s.lifeStage,
      DepthM: s.depthMeters,
      Observer: s.observer,
    }));
    exportToCSV('pelagia_biodiversity_dataset', data);
  };

  const handleExportRestorationCSV = () => {
    const data = restorations.map(r => ({
      BatchCode: r.batchCode,
      Site: r.siteName,
      Origin: r.nurseryOrigin,
      OutplantDate: r.outplantDate,
      Technique: r.technique,
      FragmentsOutplanted: r.fragmentsOutplanted,
      RestoredAreaM2: r.restoredAreaM2,
      Survival30d: r.survivalRate30d,
      Survival90d: r.survivalRate90d,
      Survival1Year: r.survivalRate1Year,
      ExtensionRateMmMo: r.currentExtensionRateMmMonth,
      Status: r.status,
    }));
    exportToCSV('pelagia_restoration_dataset', data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900 z-10">
          <div>
            <span className="text-xs font-mono text-cyan-400">Official Conservation Summary</span>
            <h3 className="text-base font-semibold text-slate-100">
              Agency Ecological Audit & Data Export Suite
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
          {/* Executive Summary Stats */}
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 font-mono text-cyan-300 font-semibold uppercase tracking-wider text-[11px]">
              <FileText className="w-4 h-4" />
              <span>GCRMN Inter-Agency Benthic Health Summary</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-200 font-mono">
              <div className="border-r border-slate-800 pr-2">
                <span className="text-slate-500 text-[10px] block">Mean Coral Cover</span>
                <span className="text-lg font-bold text-cyan-400">
                  {report.executiveSummary.averageHardCoralCoverPct}%
                </span>
              </div>
              <div className="border-r border-slate-800 pr-2">
                <span className="text-slate-500 text-[10px] block">Bleaching Rate</span>
                <span className="text-lg font-bold text-amber-400">
                  {report.executiveSummary.averageBleachingIncidencePct}%
                </span>
              </div>
              <div className="border-r border-slate-800 pr-2">
                <span className="text-slate-500 text-[10px] block">Restored Outplants</span>
                <span className="text-lg font-bold text-emerald-400">
                  {report.executiveSummary.totalFragmentsOutplanted}
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">90-Day Survivorship</span>
                <span className="text-lg font-bold text-slate-100">
                  {report.executiveSummary.averageOutplant90dSurvivalPct}%
                </span>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 flex items-center justify-between">
              <span>Timestamp: {new Date(report.metadata.reportGenerated).toUTCString()}</span>
              <span className="text-emerald-400 flex items-center gap-1 font-mono">
                <CheckCircle className="w-3.5 h-3.5" /> ISO 14001 / GCRMN Compliant
              </span>
            </div>
          </div>

          {/* Project Source Code Repository ZIP Download */}
          <div className="p-4 bg-gradient-to-r from-cyan-950/70 via-slate-900 to-indigo-950/70 border border-cyan-500/50 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.15)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-[9px] font-mono uppercase bg-cyan-400/20 text-cyan-300 border border-cyan-400/40 rounded font-semibold">
                    COMPLETE REPO ARCHIVE
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Ready for Vercel & Render
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-2 font-mono">
                  <Archive className="w-4 h-4 text-cyan-400" />
                  pelagia-reefos.zip (Full Source Code)
                </h4>
                <p className="text-[11px] text-slate-300">
                  Contains all React 19 source files, Vite & Tailwind configuration, Express full-stack API backend, <code className="text-cyan-300">vercel.json</code>, and <code className="text-cyan-300">render.yaml</code> deployment manifests.
                </p>
              </div>

              <a
                href="/pelagia-reefos.zip"
                download="pelagia-reefos.zip"
                onClick={() => playSonarPing(1800)}
                className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-bold rounded-lg text-xs font-mono shadow-[0_0_15px_rgba(34,211,238,0.4)] flex items-center gap-2 shrink-0 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Download className="w-4 h-4 stroke-[2.5]" />
                <span>DOWNLOAD ZIP</span>
              </a>
            </div>
          </div>

          {/* Export Options */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">
              Standard Data Dissemination Formats
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleExportFullJSON}
                className="p-3.5 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 rounded-lg text-left transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-100 group-hover:text-cyan-300">
                    Full Scientific JSON Archive
                  </span>
                  <Database className="w-4 h-4 text-cyan-400" />
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  All surveys, biodiversity census, nursery batches & buoy telemetry in structured schema.
                </p>
              </button>

              <button
                onClick={handleExportSurveysCSV}
                className="p-3.5 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 rounded-lg text-left transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-100 group-hover:text-cyan-300">
                    Reef Transect Surveys CSV
                  </span>
                  <Download className="w-4 h-4 text-cyan-400" />
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Benthic composition breakdown (% hard coral, algae), bleaching scores, and validation status.
                </p>
              </button>

              <button
                onClick={handleExportBiodiversityCSV}
                className="p-3.5 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 rounded-lg text-left transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-100 group-hover:text-cyan-300">
                    Biodiversity Census Records CSV
                  </span>
                  <Download className="w-4 h-4 text-cyan-400" />
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Indicator taxa counts, density per 100m², trophic guilds, life stages, and observer logs.
                </p>
              </button>

              <button
                onClick={handleExportRestorationCSV}
                className="p-3.5 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 rounded-lg text-left transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-100 group-hover:text-cyan-300">
                    Habitat Restoration Batches CSV
                  </span>
                  <Download className="w-4 h-4 text-cyan-400" />
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Outplant fragment numbers, attachment techniques, survival trajectories, and growth rates.
                </p>
              </button>
            </div>
          </div>

          <div className="bg-slate-950/60 p-3 rounded border border-slate-800/60 text-[11px] text-slate-400">
            Exported packages match global standards for national biodiversity reporting (CBD Target 3 30x30 Protected Areas and NOAA Coral Reef Watch integration).
          </div>
        </div>

        <div className="px-6 py-3 border-t border-slate-800 flex justify-end bg-slate-900">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-slate-100 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
