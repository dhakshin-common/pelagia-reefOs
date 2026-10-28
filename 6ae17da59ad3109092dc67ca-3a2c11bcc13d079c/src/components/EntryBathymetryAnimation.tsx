import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Compass, Crosshair, Waves, Zap, Volume2, VolumeX } from 'lucide-react';

interface EntryBathymetryAnimationProps {
  onComplete: () => void;
}

export const EntryBathymetryAnimation: React.FC<EntryBathymetryAnimationProps> = ({
  onComplete,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentDepth, setCurrentDepth] = useState(0);
  const [activeZone, setActiveZone] = useState('ATOLL LAGOON SURFACE');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Play subtle scientific sonar ping via Web Audio API
  const playSonarPing = (freq = 1400) => {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, ctx.currentTime + 0.35);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch {
      // Audio autoplay policy safe fallback
    }
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Three.js Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020617); // Deep slate obsidian
    scene.fog = new THREE.FogExp2(0x020617, 0.008);

    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 1. Generate Multi-Topography Bathymetric Grid
    // Creating realistic ocean floor features: lagoon flat, coral ridge, fore-reef wall, deep abyss
    const width = 280;
    const height = 280;
    const segments = 110;
    const geometry = new THREE.PlaneGeometry(width, height, segments, segments);
    geometry.rotateX(-Math.PI / 2);

    const pos = geometry.attributes.position;
    const count = pos.count;
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);

      // Topography modeling function with distinct stepped zones
      // Zone A: Shallow Atoll lagoon (x < -40)
      // Zone B: Reef Crest & Spur-and-Groove Ridge (-40 < x < 20)
      // Zone C: Steep Fore-Reef Drop-Off (20 < x < 70)
      // Zone D: Deep Abyssal Channel (x > 70)
      let elevation = 0;

      // Primary slope
      const distFromCenter = Math.sqrt(x * x + z * z);
      const ridgeNoise = Math.sin(x * 0.08) * Math.cos(z * 0.08) * 8;
      const spurNoise = Math.sin(z * 0.25) * 4.5;
      const microRugosity = (Math.sin(x * 0.4) + Math.cos(z * 0.4)) * 1.5;

      if (x < -30) {
        // Shallow reef flat
        elevation = 12 + Math.sin(x * 0.05 + z * 0.05) * 2;
      } else if (x >= -30 && x < 20) {
        // Raised coral barrier crest with spurs & grooves
        elevation = 20 + ridgeNoise + spurNoise + microRugosity;
      } else if (x >= 20 && x < 70) {
        // Steep drop-off continental slope
        const t = (x - 20) / 50;
        elevation = (1 - t) * 18 - t * 45 + spurNoise * 0.5;
      } else {
        // Abyssal canyon floor
        elevation = -45 + Math.sin(z * 0.04) * 6;
      }

      pos.setY(i, elevation);

      // Height-based bathymetric color palette
      // High (reef crest): bright laser cyan (#22d3ee)
      // Mid (fore-reef slope): cobalt blue (#2563eb)
      // Deep (abyss): dark navy indigo (#0f172a)
      const normHeight = (elevation + 45) / 75; // 0 (deep) to 1 (shallow)

      if (normHeight > 0.7) {
        // Shallow coral crest: Cyan
        colors[i * 3] = 0.13;
        colors[i * 3 + 1] = 0.83;
        colors[i * 3 + 2] = 0.93;
      } else if (normHeight > 0.4) {
        // Mid-slope: Marine Blue
        colors[i * 3] = 0.14;
        colors[i * 3 + 1] = 0.45;
        colors[i * 3 + 2] = 0.88;
      } else {
        // Deep trench: Dark Indigo Slate
        colors[i * 3] = 0.06;
        colors[i * 3 + 1] = 0.15;
        colors[i * 3 + 2] = 0.32;
      }
    }

    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.computeVertexNormals();

    // Wireframe Mesh for bathymetric isobaths
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      vertexColors: true,
      wireframe: true,
      transparent: true,
      opacity: 0.85,
    });
    const terrainMesh = new THREE.Mesh(geometry, wireframeMaterial);
    scene.add(terrainMesh);

    // Solid terrain underneath wireframe for depth occlusion
    const solidMaterial = new THREE.MeshBasicMaterial({
      color: 0x020817,
      transparent: true,
      opacity: 0.92,
    });
    const solidMesh = new THREE.Mesh(geometry, solidMaterial);
    solidMesh.position.y = -0.4;
    scene.add(solidMesh);

    // 2. Multibeam Sonar Acoustic Sweep Line (Green/Cyan laser line scanning the seabed)
    const sweepGeom = new THREE.BufferGeometry();
    const sweepPositions = new Float32Array(200 * 3);
    sweepGeom.setAttribute('position', new THREE.BufferAttribute(sweepPositions, 3));
    const sweepMaterial = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      linewidth: 2,
      transparent: true,
      opacity: 0.9,
    });
    const sweepLine = new THREE.Line(sweepGeom, sweepMaterial);
    scene.add(sweepLine);

    // 3. Central Target MPA Waypoint Beacon (Target alignment lock)
    const beaconGeom = new THREE.CylinderGeometry(0.8, 0.8, 60, 16);
    const beaconMat = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.5,
      wireframe: true,
    });
    const beacon = new THREE.Mesh(beaconGeom, beaconMat);
    beacon.position.set(0, 10, 0);
    scene.add(beacon);

    // Beacon Rings
    const ringGeom = new THREE.RingGeometry(3, 3.4, 32);
    ringGeom.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
    });
    const ring = new THREE.Mesh(ringGeom, ringMat);
    ring.position.set(0, 22, 0);
    scene.add(ring);

    // Camera Flight Choreography (Exact 2.0s duration)
    // 0.0s -> high oblique overview (y=120, z=140)
    // 1.0s -> diving through canyon slope (y=40, z=60)
    // 2.0s -> locked onto reef crest transect depth (y=26, z=18)
    const startCamPos = new THREE.Vector3(-40, 110, 130);
    const midCamPos = new THREE.Vector3(-10, 48, 65);
    const targetCamPos = new THREE.Vector3(0, 25, 22);

    const startLookAt = new THREE.Vector3(0, -10, 0);
    const targetLookAt = new THREE.Vector3(0, 21, 0);

    const DURATION_MS = 2000;
    const startTime = performance.now();
    let animationFrameId: number;

    // Trigger initial sonar acoustic sound
    playSonarPing(1600);
    setTimeout(() => playSonarPing(1100), 900);
    setTimeout(() => playSonarPing(2200), 1600);

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / DURATION_MS, 1.0);

      // Smooth custom easing curve (rapid dive, smooth settle)
      // cubic-bezier(0.16, 1, 0.3, 1) approx:
      const eased = 1 - Math.pow(1 - progress, 3.2);

      setElapsedTime(Number((elapsed / 1000).toFixed(2)));

      // Depth metric descent (from 0.0m surface to -24.8m transect depth)
      const simulatedDepth = (eased * 24.8).toFixed(1);
      setCurrentDepth(Number(simulatedDepth));

      // Active Topography Zone update
      if (progress < 0.25) {
        setActiveZone('ZONE 01: ATOLL LAGOON REEF FLAT (-3.2m)');
      } else if (progress < 0.6) {
        setActiveZone('ZONE 02: FORE-REEF SPUR & GROOVE RIDGE (-12.4m)');
      } else if (progress < 0.85) {
        setActiveZone('ZONE 03: CONTINENTAL SHELF DROP-OFF (-24.8m)');
      } else {
        setActiveZone('ZONE 04: SANCTUARY NODE LOCKED (WGS84 ALIGNED)');
      }

      // Camera Interpolation
      if (progress < 0.5) {
        const subT = progress / 0.5;
        camera.position.lerpVectors(startCamPos, midCamPos, subT);
      } else {
        const subT = (progress - 0.5) / 0.5;
        camera.position.lerpVectors(midCamPos, targetCamPos, subT);
      }

      // Camera orientation & slight roll during banking
      const currentLookAt = new THREE.Vector3().lerpVectors(startLookAt, targetLookAt, eased);
      camera.lookAt(currentLookAt);
      camera.rotation.z = Math.sin(progress * Math.PI) * 0.06; // slight realistic dive roll

      // Pulse beacon ring
      ring.scale.setScalar(1 + Math.sin(elapsed * 0.008) * 0.25);
      ring.rotation.y += 0.02;

      // Update multibeam sonar sweep line across topography
      const sweepX = -80 + eased * 160;
      const sweepArr = sweepLine.geometry.attributes.position.array as Float32Array;
      for (let j = 0; j < 200; j++) {
        const zCoord = -100 + (j / 200) * 200;
        sweepArr[j * 3] = sweepX;
        sweepArr[j * 3 + 1] = 15 + Math.sin(zCoord * 0.1) * 4;
        sweepArr[j * 3 + 2] = zCoord;
      }
      sweepLine.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);

      if (progress < 1.0) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        // 2 seconds completed: Fade out smoothly and proceed
        setIsFadingOut(true);
        setTimeout(() => {
          onComplete();
        }, 300);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geometry.dispose();
      wireframeMaterial.dispose();
      solidMaterial.dispose();
      sweepGeom.dispose();
      sweepMaterial.dispose();
      beaconGeom.dispose();
      beaconMat.dispose();
      ringGeom.dispose();
      ringMat.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden bg-slate-950 transition-opacity duration-300 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* 3D WebGL Canvas Mount */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />

      {/* Grid Alignment Reticles & Scientific Calibration HUD (Proper Alignment) */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 sm:p-8 font-mono select-none">
        {/* Top Bar: Telemetry Calibration & Heading */}
        <div className="flex items-start justify-between text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-cyan-400 font-bold tracking-wider">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping inline-block" />
              <span>MULTIBEAM SONAR BATHYMETRIC DIVE ENTRY</span>
            </div>
            <div className="text-[11px] text-slate-400">
              ACOUSTIC FREQ: 455 kHz · LAT -14.1820° / LNG 145.9120° · WGS84
            </div>
          </div>

          <div className="flex items-center gap-3 pointer-events-auto">
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                playSonarPing(1800);
              }}
              className="p-1.5 rounded bg-slate-900/80 border border-slate-700/80 text-slate-300 hover:text-cyan-300 transition-colors"
              title="Toggle Acoustic Sonar Hydrophone Sound"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={onComplete}
              className="px-3.5 py-1.5 rounded bg-slate-900/90 border border-cyan-500/60 text-cyan-300 hover:bg-cyan-500/20 text-xs font-semibold tracking-wider transition-all"
            >
              Skip Entry ✕
            </button>
          </div>
        </div>

        {/* Center Target Crosshair Reticle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none">
          <div className="relative w-36 h-36 border border-cyan-400/40 rounded-full flex items-center justify-center animate-pulse">
            <div className="w-24 h-24 border border-cyan-300/60 rounded-full" />
            <Crosshair className="w-8 h-8 text-cyan-400 stroke-[1.5]" />

            {/* Degree ticks */}
            <span className="absolute top-1 text-[9px] text-cyan-400/70">000°</span>
            <span className="absolute right-1 text-[9px] text-cyan-400/70">090°</span>
            <span className="absolute bottom-1 text-[9px] text-cyan-400/70">180°</span>
            <span className="absolute left-1 text-[9px] text-cyan-400/70">270°</span>
          </div>

          <div className="mt-3 px-3 py-1 bg-slate-950/80 border border-cyan-500/50 rounded text-center">
            <div className="text-[10px] text-slate-400 font-mono">BATHYMETRIC ZONE</div>
            <div className="text-xs text-cyan-300 font-bold tracking-wide">{activeZone}</div>
          </div>
        </div>

        {/* Bottom Alignment Ribbon */}
        <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between gap-3 text-xs border-t border-slate-800/80 pt-4">
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-slate-500 text-[11px] uppercase">Sounding Depth:</span>
              <span className="text-2xl sm:text-3xl font-bold text-cyan-300 font-mono tabular-nums">
                -{currentDepth.toFixed(1)}
              </span>
              <span className="text-xs uppercase text-slate-400">METERS</span>
            </div>
            <div className="text-[11px] text-slate-400">
              TOPOGRAPHY: Coral Spur & Groove Reef Crest · Vertical Drop: 45m
            </div>
          </div>

          {/* 2-Second Sequence Progress Bar */}
          <div className="w-48 sm:w-64 space-y-1 text-right">
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>DESCENT CHOREOGRAPHY</span>
              <span className="text-cyan-400 font-bold tabular-nums">
                {Math.min(elapsedTime, 2.0).toFixed(2)}s / 2.00s
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400 transition-all duration-75"
                style={{ width: `${Math.min((elapsedTime / 2.0) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
