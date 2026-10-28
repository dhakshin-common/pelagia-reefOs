import React, { useState } from 'react';
import { AgencyUser } from '../types/marine';
import { DEMO_USERS } from '../data/mockMarineData';
import {
  Shield,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  BadgeCheck,
  Compass,
  AlertCircle,
  X,
  Sparkles,
  RefreshCw,
  Scan,
  Crosshair,
  Radio,
  Fingerprint,
} from 'lucide-react';
import { playUiClick, playSonarPing, playAlertWarning, playHoloActivate } from '../utils/audio';

interface LoginPageProps {
  onLoginSuccess: (user: AgencyUser) => void;
  onCancel?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onCancel,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Password Reset Modal
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  // Google Sign-In & Email Verification Modal State
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleStep, setGoogleStep] = useState<'select' | 'verify' | 'verified'>('select');
  const [selectedGoogleEmail, setSelectedGoogleEmail] = useState('cometoleage@gmail.com');
  const [verificationCode, setVerificationCode] = useState(['8', '4', '9', '2', '1', '6']);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(30);

  // Handle standard manual login
  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      playAlertWarning();
      setErrorMessage('Please enter both your registered agency email and access credentials.');
      return;
    }

    playUiClick(1600);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const matched = DEMO_USERS.find(
        u => u.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (matched) {
        playSonarPing(1800);
        onLoginSuccess(matched);
      } else {
        const customUser: AgencyUser = {
          id: `usr-${Date.now()}`,
          name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          email: email.trim(),
          role: 'Lead Benthic Ecologist',
          agency: 'Marine Protected Area Authority',
          clearanceLevel: 'Level 3 Scientific Specialist',
          badgeNumber: `AGY-${Math.floor(1000 + Math.random() * 9000)}`,
          assignedMPA: 'Global Sentinel Marine Network',
          emailVerified: true,
        };
        playSonarPing(1800);
        onLoginSuccess(customUser);
      }
    }, 500);
  };

  // Quick 1-click login for demo personas
  const handleSelectDemoUser = (user: AgencyUser) => {
    playSonarPing(1500);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(user);
    }, 300);
  };

  // Trigger Google Sign-In Flow
  const handleOpenGoogleFlow = () => {
    playHoloActivate();
    setGoogleStep('select');
    setShowGoogleModal(true);
  };

  // Proceed to Email Verification code check
  const handleGoogleAccountSelected = () => {
    playSonarPing(1600);
    setGoogleStep('verify');
    setResendCooldown(30);
  };

  // Verify the 6-digit email confirmation code
  const handleVerifyGoogleCode = () => {
    playUiClick(1800);
    setIsVerifyingCode(true);
    setTimeout(() => {
      setIsVerifyingCode(false);
      setGoogleStep('verified');
      playHoloActivate();

      setTimeout(() => {
        const googleUser: AgencyUser = {
          id: 'usr-google-verified',
          name: selectedGoogleEmail.split('@')[0].replace(/\b\w/g, l => l.toUpperCase()) + ' (Google Verified)',
          email: selectedGoogleEmail,
          role: 'Lead Benthic Ecologist',
          agency: 'Global Coral Reef Monitoring Network (GCRMN)',
          clearanceLevel: 'Level 4 Operations Director',
          badgeNumber: 'GOOG-OAUTH-2026',
          assignedMPA: 'Great Barrier Reef & Coral Sea',
          isGoogleAuth: true,
          emailVerified: true,
        };
        setShowGoogleModal(false);
        onLoginSuccess(googleUser);
      }, 900);
    }, 600);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background Deep Ocean Atmosphere with Scanline Reticle */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img
          src="/src/assets/images/coral_reef_ecosystem_1790787941171.jpg"
          alt="Coral Reef Underwater"
          className="w-full h-full object-cover opacity-20 filter blur-[1px] scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-950/90" />
        <div className="absolute inset-0 hud-grid opacity-60" />
      </div>

      {/* Main Authentication Terminal Frame */}
      <div className="relative z-10 w-full max-w-xl bg-slate-950/95 border border-cyan-500/40 rounded-xl shadow-[0_0_50px_rgba(6,182,212,0.2)] backdrop-blur-xl overflow-hidden">
        {/* Laser Corner Brackets */}
        <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
        <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
        <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
        <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />

        {/* Top Header Ribbon */}
        <div className="px-6 py-4 border-b border-cyan-500/30 bg-slate-900/90 flex items-center justify-between font-mono">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
            <div>
              <span className="text-base font-bold tracking-wider text-slate-100 font-['Chakra_Petch'] uppercase">
                Pelagia ReefOS // Terminal Gate
              </span>
              <span className="text-[10px] text-cyan-400 block -mt-0.5">
                CLEARANCE PROTOCOL: LEVEL 4 COMMAND
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/50 px-2 py-0.5 rounded font-bold">
              TLS 1.3 · ENCRYPTED
            </span>
            {onCancel && (
              <button
                onClick={() => {
                  playUiClick();
                  onCancel();
                }}
                className="text-slate-400 hover:text-slate-200 text-xs px-2 py-1 rounded hover:bg-slate-800 transition-colors"
              >
                Guest View ✕
              </button>
            )}
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Headline & Mission */}
          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-['Chakra_Petch'] text-slate-100 uppercase tracking-wide">
              Operator Biometric & Identity Clearance
            </h1>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed font-sans">
              Authorized scientific observer credentials required for benthic transect verification, autonomous AUV glider telemetry control, and nursery bio-outplant logging.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-950/60 border border-rose-500/60 rounded text-xs text-rose-300 flex items-center gap-2 font-mono">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Primary Action: Sign In with Google (with Email Verification) */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={handleOpenGoogleFlow}
              className="w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-850 text-slate-100 font-semibold rounded border border-cyan-400/80 hover:border-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.25)] transition-all flex items-center justify-center gap-3 text-xs group"
            >
              {/* Google 4-Color 'G' Logo */}
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span className="font-mono tracking-wide text-cyan-200">
                AUTHORIZE WITH GOOGLE & VERIFY EMAIL
              </span>
              <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/60 px-1.5 py-0.5 rounded font-bold ml-1">
                PKCE 2.0
              </span>
            </button>
            <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 font-mono">
              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="w-3 h-3" /> Automatic 2-Step Email Verification
              </span>
              <span>Account: {selectedGoogleEmail}</span>
            </div>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-slate-950 px-3 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              Or sign in with agency credentials
            </span>
            <div className="border-t border-slate-800 w-full" />
          </div>

          {/* Standard Credentials Form */}
          <form onSubmit={handleManualLogin} className="space-y-4 text-xs font-mono">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Agency Email or Observer Callsign
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-cyan-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="e.g. e.rostova@gcrmn-marine.org"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded pl-9 pr-3 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-300 font-medium">Cryptographic Access Key</label>
                <button
                  type="button"
                  onClick={() => {
                    playUiClick();
                    setShowResetModal(true);
                  }}
                  className="text-cyan-400 hover:text-cyan-300 text-[11px] underline"
                >
                  Forgot Key?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-cyan-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded pl-9 pr-10 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-400 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-400">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-800 text-cyan-500 focus:ring-0"
                />
                <span>Maintain session persistence</span>
              </label>

              <span className="font-mono text-[11px] text-slate-500">
                FIPS 140-3 LEVEL 4
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all flex items-center justify-center gap-2 text-xs disabled:opacity-50 tracking-wider uppercase font-mono"
            >
              {isLoading ? (
                <span className="inline-block w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In with Operator Key</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick 1-Click Role Switcher */}
          <div className="pt-4 border-t border-slate-800/80 space-y-2.5 font-mono">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider">
                Instant Demo Personas (1-Click Switch)
              </span>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                <BadgeCheck className="w-3 h-3" /> All Verified
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {DEMO_USERS.map(user => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleSelectDemoUser(user)}
                  className="p-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-cyan-400 rounded text-left transition-all group"
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-bold text-slate-200 text-xs group-hover:text-cyan-300 flex items-center gap-1 font-sans">
                      {user.isGoogleAuth && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      )}
                      <span>{user.name}</span>
                    </span>
                    <BadgeCheck className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    {user.email}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 flex items-center justify-between">
                    <span>{user.clearanceLevel.split(' ')[0]} {user.clearanceLevel.split(' ')[1]}</span>
                    <span className="text-cyan-400 group-hover:translate-x-0.5 transition-transform font-bold">
                      Deploy →
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-slate-900/90 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 flex items-center justify-between">
          <span>PELAGIA REEF.OS v2045.9</span>
          <span>GOOGLE WORKSPACE & GCRMN VERIFIED NODE</span>
        </div>
      </div>

      {/* Google Sign In & Email Verification Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 font-mono">
          <div className="bg-slate-950 border border-cyan-500/50 rounded-xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span className="font-bold text-sm text-slate-100">
                  Google Workspace Authentication
                </span>
              </div>
              <button
                onClick={() => setShowGoogleModal(false)}
                className="text-slate-400 hover:text-slate-100 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step 1: Select Google Email Account */}
            {googleStep === 'select' && (
              <div className="space-y-4 text-xs">
                <p className="text-slate-300 leading-relaxed font-sans">
                  Select your Google account to authorize scientific data clearance and verify your agency email:
                </p>

                {/* Primary Google Account Card */}
                <div
                  onClick={handleGoogleAccountSelected}
                  className="p-3.5 bg-slate-900 hover:bg-slate-850 border border-cyan-500/50 rounded-lg cursor-pointer transition-all flex items-center justify-between group shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                      {selectedGoogleEmail.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-100 text-sm flex items-center gap-1.5 font-sans">
                        <span>{selectedGoogleEmail.split('@')[0]}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <div className="text-[11px] text-cyan-300">
                        {selectedGoogleEmail}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-cyan-400 group-hover:translate-x-1 transition-transform">
                    Select →
                  </span>
                </div>

                {/* Custom Google Email Input option */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-slate-400 text-[11px]">
                    Or specify alternate Google Workspace email:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={selectedGoogleEmail}
                      onChange={e => setSelectedGoogleEmail(e.target.value)}
                      placeholder="username@gmail.com"
                      className="flex-1 bg-slate-900 border border-slate-800 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400"
                    />
                    <button
                      type="button"
                      onClick={handleGoogleAccountSelected}
                      className="px-3.5 py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded whitespace-nowrap"
                    >
                      Continue
                    </button>
                  </div>
                </div>

                <div className="bg-slate-900 p-3 rounded border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Your email address will be verified through Google OAuth 2.0 PKCE protocol.</span>
                </div>
              </div>
            )}

            {/* Step 2: 6-Digit Email Security Verification Code */}
            {googleStep === 'verify' && (
              <div className="space-y-4 text-xs">
                <div className="text-center space-y-1">
                  <div className="w-12 h-12 rounded-full bg-cyan-950 border border-cyan-500 flex items-center justify-center text-cyan-400 mx-auto mb-2">
                    <Mail className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-100">
                    Verify Your Google Email
                  </h3>
                  <p className="text-slate-400 leading-relaxed font-sans text-xs">
                    We sent a 6-digit confirmation security code to:
                    <br />
                    <span className="text-cyan-300 font-mono font-bold">{selectedGoogleEmail}</span>
                  </p>
                </div>

                {/* 6-Digit Code Display / Input Boxes */}
                <div className="flex justify-center items-center gap-2 my-2">
                  {verificationCode.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={e => {
                        const val = e.target.value.slice(-1);
                        const nextCode = [...verificationCode];
                        nextCode[index] = val;
                        setVerificationCode(nextCode);
                        playUiClick(1400 + index * 100);
                      }}
                      className="w-11 h-12 text-center text-lg font-mono font-bold bg-slate-900 border border-cyan-500/70 rounded text-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Didn't receive code?</span>
                  <button
                    type="button"
                    onClick={() => {
                      playUiClick();
                      setVerificationCode(['8', '4', '9', '2', '1', '6']);
                      setResendCooldown(30);
                    }}
                    className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Resend Code</span>
                  </button>
                </div>

                {/* Verify Button */}
                <button
                  type="button"
                  disabled={isVerifyingCode}
                  onClick={handleVerifyGoogleCode}
                  className="w-full py-2.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-colors flex items-center justify-center gap-2 text-xs disabled:opacity-50 uppercase tracking-wider"
                >
                  {isVerifyingCode ? (
                    <span className="inline-block w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                      <span>Confirm & Verify Email</span>
                    </>
                  )}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      playUiClick();
                      setGoogleStep('select');
                    }}
                    className="text-slate-400 hover:text-slate-200 text-[11px] underline"
                  >
                    Change Google Account
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Verified Success Animation */}
            {googleStep === 'verified' && (
              <div className="py-6 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-950 border border-emerald-500 flex items-center justify-center text-emerald-400 mx-auto animate-bounce shadow-[0_0_20px_#10b981]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-100 font-['Chakra_Petch']">
                  Email Verified Successfully!
                </h3>
                <div className="text-xs text-slate-300 font-mono">
                  {selectedGoogleEmail}
                </div>
                <div className="text-[11px] text-emerald-400 font-bold">
                  ● Level 4 Operations Director Clearance Granted
                </div>
                <p className="text-[11px] text-slate-400 font-sans">
                  Launching Pelagia ReefOS terminal session...
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Password Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md font-mono">
          <div className="bg-slate-950 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <KeyRound className="w-4 h-4" />
                <span>Credential Recovery Protocol</span>
              </div>
              <button
                onClick={() => {
                  setShowResetModal(false);
                  setResetSuccess(false);
                }}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {resetSuccess ? (
              <div className="space-y-3 py-2 text-xs">
                <div className="p-3 bg-emerald-950/60 border border-emerald-500/60 rounded text-emerald-300">
                  Recovery instructions and temporary cryptographic token dispatched to <span className="font-bold text-white">{resetEmail}</span>.
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowResetModal(false);
                    setResetSuccess(false);
                  }}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-slate-100 rounded font-bold"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form
                onSubmit={e => {
                  e.preventDefault();
                  if (resetEmail) {
                    playSonarPing(1800);
                    setResetSuccess(true);
                  }
                }}
                className="space-y-3 text-xs"
              >
                <p className="text-slate-400 leading-relaxed font-sans">
                  Enter your registered institutional email. A cryptographic recovery token will be dispatched to reset your agency observer key.
                </p>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Agency Email</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. observer@marine-agency.org"
                    value={resetEmail}
                    onChange={e => setResetEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowResetModal(false)}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 rounded text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded"
                  >
                    Send Recovery Key
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
