import React, { useState, useEffect } from 'react';
import {
  Download,
  Plus,
  RotateCcw,
  Flame,
  Wand2,
  Play,
  User,
  LogOut,
  ChevronDown,
  BadgeCheck,
  Radio,
  Volume2,
  VolumeX,
  Compass,
  Crosshair,
  Activity,
  Layers,
  Archive,
} from 'lucide-react';
import { AgencyUser } from '../types/marine';
import { playUiClick, playSonarPing, toggleAudioMute, isAudioMuted } from '../utils/audio';

interface HeaderProps {
  activeTab: 'portal' | 'surveys' | 'biodiversity' | 'restoration' | 'monitoring' | 'map';
  setActiveTab: (tab: 'portal' | 'surveys' | 'biodiversity' | 'restoration' | 'monitoring' | 'map') => void;
  currentUser: AgencyUser | null;
  onOpenReportModal: () => void;
  onOpenNewSurvey: () => void;
  onOpenWizard: () => void;
  onOpenSimulator: () => void;
  onOpenNewSighting: () => void;
  onOpenNewRestoration: () => void;
  onPlayEntryAnimation: () => void;
  onOpenLoginPage: () => void;
  onSignOut: () => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenReportModal,
  onOpenNewSurvey,
  onOpenWizard,
  onOpenSimulator,
  onOpenNewSighting,
  onOpenNewRestoration,
  onPlayEntryAnimation,
  onOpenLoginPage,
  onSignOut,
  onResetData,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [audioMuted, setAudioMuted] = useState(isAudioMuted());
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toISOString().substring(11, 19) + ' UTC'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleTabChange = (
    tab: 'portal' | 'surveys' | 'biodiversity' | 'restoration' | 'monitoring' | 'map'
  ) => {
    playUiClick(1400);
    setActiveTab(tab);
  };

  const handleAudioToggle = () => {
    const muted = toggleAudioMute();
    setAudioMuted(muted);
    if (!muted) {
      playSonarPing(1600);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-xl border-b border-cyan-500/20 font-sans">
      {/* Top Futuristic Telemetry Ribbon */}
      <div className="bg-slate-950 border-b border-slate-800/80 px-4 py-1 text-[11px] font-mono flex items-center justify-between text-slate-400 select-none overflow-x-auto">
        <div className="flex items-center gap-3 sm:gap-6 shrink-0">
          <div className="flex items-center gap-1.5 text-cyan-400 font-semibold tracking-wider">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block" />
            <span className="text-[10px] tracking-widest uppercase">NODE 09: PELAGIA NEXUS</span>
          </div>

          <div className="hidden md:flex items-center gap-1 text-slate-400">
            <Compass className="w-3 h-3 text-cyan-500" />
            <span>LAT -14°18'12" S · LON +145°54'43" E</span>
          </div>

          <div className="hidden lg:flex items-center gap-1 text-slate-400">
            <Activity className="w-3 h-3 text-emerald-400" />
            <span>BATHYMETRY DEPTH: <strong className="text-cyan-300">-24.8M</strong></span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>SONAR 455 kHz</span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Tactical UTC Marine Chronometer */}
          <span className="text-cyan-300 font-bold tabular-nums">
            {currentTime || '17:05:00 UTC'}
          </span>

          {/* Sonar Acoustic Sound Toggle */}
          <button
            onClick={handleAudioToggle}
            className={`p-1 rounded border transition-colors flex items-center gap-1 text-[10px] ${
              !audioMuted
                ? 'bg-cyan-950/60 border-cyan-500/60 text-cyan-300'
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
            title={audioMuted ? 'Enable Acoustic Sonar Audio Pings' : 'Mute Sonar Audio'}
          >
            {!audioMuted ? <Volume2 className="w-3 h-3 text-cyan-400" /> : <VolumeX className="w-3 h-3" />}
            <span className="hidden sm:inline font-mono">{!audioMuted ? 'SONAR FX ON' : 'MUTED'}</span>
          </button>

          {/* Quick Launch 3D Bathymetry Flythrough */}
          <button
            onClick={() => {
              playSonarPing(1800);
              onPlayEntryAnimation();
            }}
            className="flex items-center gap-1.5 px-2 py-0.5 bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-400/50 hover:border-cyan-300 text-cyan-200 rounded text-[10px] font-mono tracking-wider font-semibold transition-all group"
            title="Launch 2-Second 3D Bathymetry Topography Sequence"
          >
            <Play className="w-2.5 h-2.5 fill-cyan-400 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span>3D SONAR SCAN</span>
          </button>

          {/* Quick ZIP Download */}
          <a
            href="/pelagia-reefos.zip"
            download="pelagia-reefos.zip"
            onClick={() => playSonarPing(1800)}
            className="flex items-center gap-1 px-2 py-0.5 bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-500/50 hover:border-emerald-400 text-emerald-300 rounded text-[10px] font-mono tracking-wider font-semibold transition-all group"
            title="Download Complete Project Source Code (.ZIP)"
          >
            <Archive className="w-2.5 h-2.5 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span className="hidden xs:inline">PROJECT ZIP</span>
            <span className="xs:hidden">ZIP</span>
          </a>
        </div>
      </div>

      {/* Main Bridge Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Callsign with Holographic Radar Ring */}
        <a
          href="#portal"
          onClick={(e) => {
            e.preventDefault();
            handleTabChange('portal');
          }}
          className="flex items-center gap-3 group"
        >
          <div className="relative w-8 h-8 rounded border border-cyan-500/50 bg-slate-900 flex items-center justify-center overflow-hidden group-hover:border-cyan-400 transition-colors">
            <div className="absolute inset-0 bg-cyan-500/10" />
            <Crosshair className="w-4 h-4 text-cyan-400 relative z-10 stroke-[2] group-hover:rotate-45 transition-transform duration-500" />
            <div className="absolute inset-0 border border-cyan-400/30 rounded-full animate-ping opacity-30" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-['Chakra_Petch'] text-lg font-bold tracking-wider text-slate-100 uppercase group-hover:text-cyan-300 transition-colors">
                Pelagia ReefOS
              </span>
              <span className="text-[10px] font-mono text-cyan-400 px-1 py-0.2 bg-cyan-950/80 border border-cyan-500/40 rounded">
                v2045.9
              </span>
            </div>
            <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest hidden sm:block -mt-0.5">
              Deep Marine Ecological Information System
            </div>
          </div>
        </a>

        {/* Futuristic Cybernetic Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 font-mono text-xs">
          {[
            { id: 'portal', num: '01', label: 'COMMAND NEXUS' },
            { id: 'surveys', num: '02', label: 'BENTHIC TRANSECTS' },
            { id: 'biodiversity', num: '03', label: 'BIO-REGISTRY' },
            { id: 'restoration', num: '04', label: 'CORAL NURSERY' },
            { id: 'monitoring', num: '05', label: 'TELEMETRY' },
            { id: 'map', num: '06', label: 'TACTICAL GIS' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as HeaderProps['activeTab'])}
                className={`relative px-3.5 py-2 transition-all flex flex-col items-center ${
                  isActive
                    ? 'text-cyan-300 bg-cyan-950/40 border-b-2 border-cyan-400 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border-b-2 border-transparent'
                }`}
              >
                <span className="text-[9px] text-slate-400 tracking-wider">
                  {tab.num}
                </span>
                <span className="tracking-wide text-xs">{tab.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Tactical Action Controls & Security Clearance */}
        <div className="flex items-center gap-2">
          {/* Heat Stress Simulator Trigger */}
          <button
            onClick={() => {
              playUiClick();
              onOpenSimulator();
            }}
            title="Launch Thermal Heat Stress Predictive Engine"
            className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono font-medium text-amber-300 bg-amber-950/40 hover:bg-amber-900/50 border border-amber-800/60 rounded transition-colors"
          >
            <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>THERMAL SIM</span>
          </button>

          {/* Quick Field Wizard */}
          <button
            onClick={() => {
              playSonarPing(1200);
              onOpenWizard();
            }}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-semibold text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/70 border border-cyan-500/60 rounded transition-all shadow-[0_0_12px_rgba(6,182,212,0.15)]"
          >
            <Wand2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>FIELD WIZARD</span>
          </button>

          {/* Export Telemetry Data */}
          <button
            onClick={() => {
              playUiClick();
              onOpenReportModal();
            }}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded transition-colors"
            title="Download Scientific Reports & CSV Archives"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">EXPORT</span>
          </button>

          {/* Download Complete Project Source Code ZIP */}
          <a
            href="/pelagia-reefos.zip"
            download="pelagia-reefos.zip"
            onClick={() => playSonarPing(1800)}
            className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono font-semibold text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/50 hover:border-emerald-400 rounded transition-all shadow-[0_0_10px_rgba(16,185,129,0.15)] group"
            title="Download Complete Project Source Code ZIP (Vercel & Render Ready)"
          >
            <Archive className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span>ZIP ARCHIVE</span>
          </a>

          {/* Log Data Dropdown Menu */}
          <div className="relative">
            <button
              onClick={() => {
                playUiClick();
                setDropdownOpen(!dropdownOpen);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>+ LOG DATA</span>
            </button>

            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-72 bg-slate-950 border border-cyan-500/40 rounded-lg shadow-2xl z-30 py-1 divide-y divide-slate-800/80 font-mono">
                  <div className="px-3 py-2 text-[10px] text-cyan-400 uppercase tracking-wider bg-slate-900/80 font-bold flex items-center justify-between">
                    <span>ARCHIVAL INPUT PROTOCOLS</span>
                    <span className="text-[9px] text-slate-500">GCRMN v4</span>
                  </div>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      playSonarPing(1200);
                      onOpenWizard();
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs text-slate-200 hover:bg-slate-900 hover:text-cyan-300 transition-colors flex flex-col group"
                  >
                    <span className="font-semibold text-cyan-300 flex items-center gap-1.5">
                      <Wand2 className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
                      Rapid Transect Wizard (Guided)
                    </span>
                    <span className="text-[11px] text-slate-400 font-sans">
                      Automated 50-point photo-quadrat intercept with RHI calculator
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      playUiClick();
                      onOpenNewSurvey();
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs text-slate-200 hover:bg-slate-900 hover:text-cyan-300 transition-colors flex flex-col"
                  >
                    <span className="font-semibold text-slate-100">Standard Survey Entry</span>
                    <span className="text-[11px] text-slate-400 font-sans">
                      Direct benthic composition & bleaching categorization
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      playUiClick();
                      onOpenNewSighting();
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs text-slate-200 hover:bg-slate-900 hover:text-cyan-300 transition-colors flex flex-col"
                  >
                    <span className="font-semibold text-slate-100">Biodiversity Sighting</span>
                    <span className="text-[11px] text-slate-400 font-sans">
                      Record indicator organisms, trophic index, and COTS clusters
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      playUiClick();
                      onOpenNewRestoration();
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs text-slate-200 hover:bg-slate-900 hover:text-cyan-300 transition-colors flex flex-col"
                  >
                    <span className="font-semibold text-slate-100">Restoration Outplanting Batch</span>
                    <span className="text-[11px] text-slate-400 font-sans">
                      Nursery fragment deployments and substrate cementation
                    </span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Reset Baseline Data Button */}
          <button
            onClick={() => {
              playUiClick();
              onResetData();
            }}
            title="Reset telemetry baseline database"
            className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-slate-900 border border-transparent hover:border-slate-800 rounded transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Security Clearance / Google Auth Operator Button */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => {
                  playUiClick();
                  setUserMenuOpen(!userMenuOpen)}
                }
                className="flex items-center gap-2 p-1.5 pl-2.5 bg-slate-900 hover:bg-slate-850 border border-cyan-500/40 rounded text-xs transition-colors"
              >
                <div className="w-5 h-5 rounded bg-cyan-950 border border-cyan-400 flex items-center justify-center text-cyan-300 font-bold text-[10px] font-mono">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="hidden md:block text-left">
                  <div className="font-bold text-slate-200 text-xs leading-none truncate max-w-[100px]">
                    {currentUser.name.split(' ')[0]}
                  </div>
                  <div className="text-[9px] font-mono text-emerald-400 leading-none mt-0.5">
                    ● AUTHENTICATED
                  </div>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 bg-slate-950 border border-cyan-500/40 rounded-xl shadow-2xl z-30 p-4 space-y-3 font-mono">
                    <div className="border-b border-slate-800 pb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-100 text-sm truncate font-sans">
                          {currentUser.name}
                        </span>
                        <BadgeCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                      </div>
                      <div className="text-xs text-slate-400 font-sans">
                        {currentUser.role}
                      </div>

                      {/* Google Email Verification Badge */}
                      <div className="mt-2.5 p-2 bg-slate-900 border border-slate-800 rounded space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-300 truncate">{currentUser.email}</span>
                          {currentUser.emailVerified && (
                            <span className="text-emerald-400 font-semibold flex items-center gap-0.5 shrink-0">
                              ✓ Verified
                            </span>
                          )}
                        </div>
                        {currentUser.isGoogleAuth && (
                          <div className="text-[10px] text-cyan-300 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                            <span>Google Workspace SSO Linked</span>
                          </div>
                        )}
                      </div>

                      <div className="text-[10px] text-cyan-400 mt-2 flex items-center justify-between">
                        <span>{currentUser.clearanceLevel}</span>
                        <span className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                          {currentUser.badgeNumber}
                        </span>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-400 space-y-1 font-sans">
                      <div><strong className="text-slate-300 font-mono">Agency:</strong> {currentUser.agency}</div>
                      <div><strong className="text-slate-300 font-mono">Zone:</strong> {currentUser.assignedMPA}</div>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between font-mono text-xs">
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          playUiClick();
                          onOpenLoginPage();
                        }}
                        className="text-cyan-400 hover:text-cyan-300 font-semibold"
                      >
                        Switch Identity
                      </button>

                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          playUiClick();
                          onSignOut();
                        }}
                        className="text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold"
                      >
                        <LogOut className="w-3 h-3" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={() => {
                playUiClick();
                onOpenLoginPage();
              }}
              className="px-3 py-1.5 text-xs font-mono font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-cyan-500/50 rounded transition-colors flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span>SIGN IN</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Subnavigation */}
      <div className="lg:hidden flex items-center justify-between border-t border-slate-800/80 px-4 py-2 overflow-x-auto text-xs font-mono text-slate-400 space-x-4 bg-slate-950">
        {[
          { id: 'portal', label: '01 NEXUS' },
          { id: 'surveys', label: '02 SURVEYS' },
          { id: 'biodiversity', label: '03 SPECIES' },
          { id: 'restoration', label: '04 RESTORE' },
          { id: 'monitoring', label: '05 TELEMETRY' },
          { id: 'map', label: '06 GIS MAP' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id as HeaderProps['activeTab'])}
            className={`whitespace-nowrap px-2 py-1 rounded transition-colors ${
              activeTab === tab.id
                ? 'text-cyan-300 bg-cyan-950/80 border border-cyan-500/50 font-bold'
                : 'hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </header>
  );
};
