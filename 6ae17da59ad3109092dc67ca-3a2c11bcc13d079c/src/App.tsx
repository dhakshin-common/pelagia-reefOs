import React, { useState, useEffect } from 'react';
import {
  CoralReefSurvey,
  BiodiversitySighting,
  RestorationActivity,
  OceanographicStation,
  IndicatorSpecies,
  AgencyUser,
} from './types/marine';
import {
  loadStoredSurveys,
  saveStoredSurveys,
  loadStoredSightings,
  saveStoredSightings,
  loadStoredRestorations,
  saveStoredRestorations,
  loadStoredStations,
  loadStoredSpecies,
  loadStoredAuthUser,
  saveStoredAuthUser,
  resetAllStorageData,
} from './utils/storage';
import { Header } from './components/Header';
import { AgencyPortalLanding } from './components/AgencyPortalLanding';
import { MetricCards } from './components/MetricCards';
import { SurveysView } from './components/SurveysView';
import { BiodiversityView } from './components/BiodiversityView';
import { RestorationView } from './components/RestorationView';
import { EcologicalMonitoringView } from './components/EcologicalMonitoringView';
import { SpatialReefMap } from './components/SpatialReefMap';
import { RapidBenthicSurveyWizard } from './components/RapidBenthicSurveyWizard';
import { ThermalStressSimulatorModal } from './components/ThermalStressSimulatorModal';
import { NewSurveyModal } from './components/NewSurveyModal';
import { NewSightingModal } from './components/NewSightingModal';
import { NewRestorationModal } from './components/NewRestorationModal';
import { ReportExportModal } from './components/ReportExportModal';
import { EntryBathymetryAnimation } from './components/EntryBathymetryAnimation';
import { LoginPage } from './components/LoginPage';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<
    'portal' | 'surveys' | 'biodiversity' | 'restoration' | 'monitoring' | 'map'
  >('portal');

  // Authenticated Agency User state
  const [currentUser, setCurrentUser] = useState<AgencyUser | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // 3D 2-Second Topography Entry Animation
  const [showEntryAnimation, setShowEntryAnimation] = useState(true);

  // Loaded states
  const [surveys, setSurveys] = useState<CoralReefSurvey[]>([]);
  const [sightings, setSightings] = useState<BiodiversitySighting[]>([]);
  const [restorations, setRestorations] = useState<RestorationActivity[]>([]);
  const [stations, setStations] = useState<OceanographicStation[]>([]);
  const [speciesList, setSpeciesList] = useState<IndicatorSpecies[]>([]);

  // Modals state
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isNewSurveyOpen, setIsNewSurveyOpen] = useState(false);
  const [isNewSightingOpen, setIsNewSightingOpen] = useState(false);
  const [isNewRestorationOpen, setIsNewRestorationOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    setSurveys(loadStoredSurveys());
    setSightings(loadStoredSightings());
    setRestorations(loadStoredRestorations());
    setStations(loadStoredStations());
    setSpeciesList(loadStoredSpecies());
    setCurrentUser(loadStoredAuthUser());
  }, []);

  const handleLoginSuccess = (user: AgencyUser) => {
    setCurrentUser(user);
    saveStoredAuthUser(user);
    setIsLoginOpen(false);
    showToast(`Authenticated as ${user.name} (${user.role})`);
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    saveStoredAuthUser(null);
    showToast('Signed out of terminal session.');
  };

  const handleSaveSurvey = (survey: CoralReefSurvey) => {
    const updated = [survey, ...surveys];
    setSurveys(updated);
    saveStoredSurveys(updated);
    showToast(`Survey ${survey.surveyCode} recorded & validated.`);
  };

  const handleSaveSighting = (sighting: BiodiversitySighting) => {
    const updated = [sighting, ...sightings];
    setSightings(updated);
    saveStoredSightings(updated);
    showToast(`Biodiversity sighting for ${sighting.commonName} saved.`);
  };

  const handleSaveRestoration = (activity: RestorationActivity) => {
    const updated = [activity, ...restorations];
    setRestorations(updated);
    saveStoredRestorations(updated);
    showToast(`Restoration batch ${activity.batchCode} logged.`);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all databases to the official verified agency baseline?')) {
      resetAllStorageData();
      setSurveys(loadStoredSurveys());
      setSightings(loadStoredSightings());
      setRestorations(loadStoredRestorations());
      setStations(loadStoredStations());
      setSpeciesList(loadStoredSpecies());
      setCurrentUser(loadStoredAuthUser());
      showToast('Database reset to verified baseline dataset.');
    }
  };

  // If user opens the full-page login portal or is logged out and requests login:
  if (isLoginOpen || (!currentUser && isLoginOpen)) {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onCancel={() => setIsLoginOpen(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* 2-Second 3D Bathymetric Topography Dive Entry Animation */}
      {showEntryAnimation && (
        <EntryBathymetryAnimation
          onComplete={() => setShowEntryAnimation(false)}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-cyan-950 border border-cyan-500/80 text-cyan-200 px-4 py-2.5 rounded-lg shadow-xl text-xs font-mono flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Bar (Strict 3-zone contract) */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onOpenNewSurvey={() => setIsNewSurveyOpen(true)}
        onOpenWizard={() => setIsWizardOpen(true)}
        onOpenSimulator={() => setIsSimulatorOpen(true)}
        onOpenNewSighting={() => setIsNewSightingOpen(true)}
        onOpenNewRestoration={() => setIsNewRestorationOpen(true)}
        onPlayEntryAnimation={() => setShowEntryAnimation(true)}
        onOpenLoginPage={() => setIsLoginOpen(true)}
        onSignOut={handleSignOut}
        onResetData={handleResetData}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* If on a specialized workspace, show the top telemetry ribbon */}
        {activeTab !== 'portal' && (
          <MetricCards
            surveys={surveys}
            restorations={restorations}
            stations={stations}
          />
        )}

        {/* 1. Agency Mission Executive Landing Page */}
        {activeTab === 'portal' && (
          <AgencyPortalLanding
            surveys={surveys}
            sightings={sightings}
            restorations={restorations}
            stations={stations}
            onNavigateTab={setActiveTab}
            onOpenWizard={() => setIsWizardOpen(true)}
            onOpenSimulator={() => setIsSimulatorOpen(true)}
            onOpenReportModal={() => setIsReportModalOpen(true)}
            onPlayEntryAnimation={() => setShowEntryAnimation(true)}
          />
        )}

        {/* 2. Reef Surveys Workspace */}
        {activeTab === 'surveys' && (
          <SurveysView
            surveys={surveys}
            onOpenNewSurvey={() => setIsNewSurveyOpen(true)}
            onOpenWizard={() => setIsWizardOpen(true)}
          />
        )}

        {/* 3. Biodiversity Workspace */}
        {activeTab === 'biodiversity' && (
          <BiodiversityView
            speciesList={speciesList}
            sightings={sightings}
            onOpenNewSighting={() => setIsNewSightingOpen(true)}
          />
        )}

        {/* 4. Restoration Workspace */}
        {activeTab === 'restoration' && (
          <RestorationView
            restorations={restorations}
            onOpenNewRestoration={() => setIsNewRestorationOpen(true)}
          />
        )}

        {/* 5. Telemetry Workspace */}
        {activeTab === 'monitoring' && (
          <EcologicalMonitoringView
            stations={stations}
          />
        )}

        {/* 6. MPA GIS Spatial Map */}
        {activeTab === 'map' && (
          <SpatialReefMap
            surveys={surveys}
            restorations={restorations}
            stations={stations}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 mt-12 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">Pelagia ReefOS</span>
            <span>·</span>
            <span>Marine Ecological Information System</span>
            <span>·</span>
            <span>v2026.09</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>CBD Target 3 (30x30 Protected Areas)</span>
            <span>·</span>
            <span>Global Coral Reef Monitoring Network (GCRMN)</span>
            <span>·</span>
            <span>NOAA Coral Reef Watch</span>
          </div>
        </div>
      </footer>

      {/* Field Dive Transect Wizard Modal */}
      <RapidBenthicSurveyWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onSave={handleSaveSurvey}
      />

      {/* Marine Heatwave & Thermal Stress Simulator Modal */}
      <ThermalStressSimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        stations={stations}
      />

      {/* Standard Survey Manual Form Modal */}
      <NewSurveyModal
        isOpen={isNewSurveyOpen}
        onClose={() => setIsNewSurveyOpen(false)}
        onSave={handleSaveSurvey}
      />

      {/* Sighting Modal */}
      <NewSightingModal
        isOpen={isNewSightingOpen}
        onClose={() => setIsNewSightingOpen(false)}
        speciesList={speciesList}
        onSave={handleSaveSighting}
      />

      {/* Restoration Modal */}
      <NewRestorationModal
        isOpen={isNewRestorationOpen}
        onClose={() => setIsNewRestorationOpen(false)}
        onSave={handleSaveRestoration}
      />

      {/* Report & Agency Audit Export Modal */}
      <ReportExportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        surveys={surveys}
        sightings={sightings}
        restorations={restorations}
        stations={stations}
      />
    </div>
  );
}
