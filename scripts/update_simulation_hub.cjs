const fs = require('fs');

const fileContent = `import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid, MeshTransmissionMaterial, Instances, Instance, Text, Trail } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { Activity, Beaker, Zap, ActivitySquare, AlertTriangle, ShieldCheck, Microscope, HeartPulse } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

// --- Error Boundary ---
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: any) { console.error("WebGL Error:", error); }
  render() {
    if (this.state.hasError) return (
      <div className="flex h-full w-full items-center justify-center bg-slate-900 text-rose-500 font-mono">WebGL Crash. Hardware unsupported.</div>
    );
    return this.props.children;
  }
}

// --- UTILS ---
function wavelengthToRGB(w: number) {
  let R = 0, G = 0, B = 0, alpha = 0;
  if (w >= 380 && w < 440) { R = -(w - 440) / (440 - 380); B = 1.0; }
  else if (w >= 440 && w < 490) { G = (w - 440) / (490 - 440); B = 1.0; }
  else if (w >= 490 && w < 510) { G = 1.0; B = -(w - 510) / (510 - 490); }
  else if (w >= 510 && w < 580) { R = (w - 510) / (580 - 510); G = 1.0; }
  else if (w >= 580 && w < 645) { R = 1.0; G = -(w - 645) / (645 - 580); }
  else if (w >= 645 && w <= 780) { R = 1.0; }
  if (w >= 380 && w < 420) alpha = 0.3 + 0.7 * (w - 380) / (420 - 380);
  else if (w >= 420 && w < 701) alpha = 1.0;
  else if (w >= 701 && w <= 780) alpha = 0.3 + 0.7 * (780 - w) / (780 - 700);
  return new THREE.Color(R * alpha, G * alpha, B * alpha);
}

// --- LAB 1: OPTICS ---
function OpticsLab({ wavelength, index, polarization }: any) {
  const color = wavelengthToRGB(wavelength);
  const beamRef = useRef<THREE.Mesh>(null);
  const criticalAngle = Math.asin(1 / index);
  
  useFrame(({ clock }) => {
    if (beamRef.current) {
      // Modulate beam intensity based on polarization
      beamRef.current.material.opacity = polarization ? 0.3 + Math.sin(clock.elapsedTime * 5) * 0.1 : 0.8;
      // Refraction angle approximation for visualization
      const angle = (wavelength - 380) / (750 - 380) * 0.2;
      beamRef.current.rotation.z = -Math.PI/2 + angle;
    }
  });

  return (
    <group position={[0, 2, 0]}>
      {/* Laser Source */}
      <mesh position={[-4, 0, 0]}>
        <boxGeometry args={[1, 0.5, 0.5]} />
        <meshStandardMaterial color="#333" metalness={0.8} />
      </mesh>
      
      {/* Laser Beam */}
      <mesh ref={beamRef} position={[-1.5, 0, 0]} rotation={[0, 0, -Math.PI/2]}>
        <cylinderGeometry args={[0.05, 0.05, 5, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={4} transparent opacity={0.8} />
      </mesh>
      
      {/* Prism */}
      <mesh position={[1, 0, 0]} rotation={[0, Math.PI/4, 0]}>
        <coneGeometry args={[1.5, 2, 3]} />
        <MeshTransmissionMaterial 
          thickness={1.5} roughness={0} transmission={1} ior={index} chromaticAberration={0.2} distortion={0.1} color="#ffffff"
        />
      </mesh>

      {/* Refracted Beam (Approximation) */}
      <mesh position={[3, -0.5, 0]} rotation={[0, 0, -Math.PI/2 - 0.2]}>
        <cylinderGeometry args={[0.05, 0.3, 4, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

// --- LAB 2: THERMODYNAMICS ---
const DUMMY = new THREE.Object3D();
function ThermoLab({ temperature, pressure, concentration }: any) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const time = clock.elapsedTime;
    let i = 0;
    const size = Math.floor(concentration);
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        for (let z = 0; z < size; z++) {
          const id = i++;
          // Brownian motion scales with temperature
          const tFactor = (temperature / 1000) * 0.5;
          DUMMY.position.set(
            (x - size/2) * 1.2 + Math.sin(time * 10 + id) * tFactor,
            (y - size/2) * 1.2 + Math.cos(time * 15 + id) * tFactor + 3,
            (z - size/2) * 1.2 + Math.sin(time * 5 + id) * tFactor
          );
          // Pressure scales density
          const pScale = 1 / Math.cbrt(pressure);
          DUMMY.scale.set(pScale, pScale, pScale);
          DUMMY.updateMatrix();
          meshRef.current.setMatrixAt(id, DUMMY.matrix);
        }
      }
    }
    meshRef.current.count = i;
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      {/* Holographic Chamber */}
      <mesh position={[0, 3, 0]}>
        <boxGeometry args={[10, 10, 10]} />
        <meshBasicMaterial color="#0f172a" wireframe transparent opacity={0.1} />
      </mesh>
      
      <instancedMesh ref={meshRef} args={[undefined, undefined, 1000]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#06b6d4" metalness={0.8} roughness={0.2} emissive="#0891b2" emissiveIntensity={temperature/2000} />
      </instancedMesh>
    </group>
  );
}

// --- LAB 3: HEMODYNAMICS ---
function HemoLab({ bpm, svr, ef, pathology }: any) {
  const heartRef = useRef<THREE.Group>(null);
  const aortaRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (!heartRef.current) return;
    const t = clock.elapsedTime;
    const freq = bpm / 60;
    
    // Systole/Diastole scaling
    let phase = Math.abs(Math.sin(t * Math.PI * freq));
    
    if (pathology === 'VFib') {
      phase += (Math.random() - 0.5) * 0.4;
    }

    const efFactor = ef / 100;
    const scaleX = 1 - (phase * efFactor * 0.5);
    const scaleY = 1 - (phase * efFactor);
    
    heartRef.current.scale.set(scaleX, scaleY, scaleX);

    // SVR constricts Aorta
    if (aortaRef.current) {
      const radius = 1 - (svr / 300);
      aortaRef.current.scale.set(radius, 1, radius);
      
      // Stenosis texture swap would go here visually
      if (pathology === 'Aortic Stenosis') {
        aortaRef.current.material.color.setHex(0xeab308); // Calcified yellow
      } else {
        aortaRef.current.material.color.setHex(0xef4444); // Normal red
      }
    }
  });

  return (
    <group position={[0, 3, 0]}>
      {/* Left Ventricle (Simulated) */}
      <group ref={heartRef}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[2, 32, 32]} />
          <meshStandardMaterial color="#991b1b" roughness={0.3} metalness={0.1} />
        </mesh>
      </group>
      
      {/* Aorta outflow tract */}
      <mesh ref={aortaRef} position={[0, 2.5, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 3, 32]} />
        <meshStandardMaterial color="#ef4444" roughness={0.4} />
      </mesh>
    </group>
  );
}

// --- MAIN HUB ---
export default function SimulationLab() {
  const [tab, setTab] = useState<'optics'|'thermo'|'hemo'>('hemo');

  // Optics State
  const [wavelength, setWavelength] = useState(532);
  const [refractiveIndex, setRefractiveIndex] = useState(1.52);
  const [polarization, setPolarization] = useState(false);

  // Thermo State
  const [temperature, setTemperature] = useState(298);
  const [pressure, setPressure] = useState(1);
  const [concentration, setConcentration] = useState(5);

  // Hemo State
  const [bpm, setBpm] = useState(72);
  const [svr, setSvr] = useState(100);
  const [ef, setEf] = useState(60);
  const [pathology, setPathology] = useState('Normal');

  // AI Diagnostic State
  const [aiReport, setAiReport] = useState<any>(null);
  const [scanning, setScanning] = useState(false);

  const runDiagnosticScan = async () => {
    setScanning(true);
    setAiReport(null);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) throw new Error("API Key missing");
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const payload = \`Active Lab: \${tab}. 
        Optics: Wavelength=\${wavelength}nm, RefractiveIndex=\${refractiveIndex}, Polarization=\${polarization}. 
        Thermo: Temp=\${temperature}K, Pressure=\${pressure}atm. 
        Hemo: BPM=\${bpm}, SVR=\${svr}, EF=\${ef}%, Pathology=\${pathology}.\`;

      const prompt = \`Act as an advanced clinical and engineering diagnostic AI. Analyze this telemetry: \${payload}.
      Identify the anomaly in the currently active physics, chemistry, or biological system.
      Output exactly in this format without markdown code blocks:
      1. Identified Anomaly: [anomaly]
      2. Theoretical Consequence: [consequence]
      3. Corrective Action: [action]\`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      
      const lines = text.split('\\n').filter(l => l.trim().length > 0);
      setAiReport({
        anomaly: lines.find(l => l.includes('1.'))?.replace('1. Identified Anomaly:', '')?.trim() || 'N/A',
        consequence: lines.find(l => l.includes('2.'))?.replace('2. Theoretical Consequence:', '')?.trim() || 'N/A',
        action: lines.find(l => l.includes('3.'))?.replace('3. Corrective Action:', '')?.trim() || 'N/A',
      });
    } catch (err) {
      console.error(err);
      setAiReport({ anomaly: 'System Offline', consequence: 'Telemetry Link Failed', action: 'Check API Key' });
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-slate-950 text-white font-sans overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 p-4 md:p-6 bg-slate-900/50">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-3">
            <Microscope className="text-emerald-500" /> Ultra-High-Fidelity Simulation Hub
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">Clinical & Engineering Parameter Sandbox</p>
        </div>
        <div className="flex gap-2 bg-slate-900 p-1 rounded-lg border border-slate-800">
          <button onClick={() => setTab('optics')} className={\`px-4 py-2 text-xs font-bold rounded \${tab==='optics'?'bg-emerald-500/20 text-emerald-400':'text-slate-500'}\`}>OPTICS</button>
          <button onClick={() => setTab('thermo')} className={\`px-4 py-2 text-xs font-bold rounded \${tab==='thermo'?'bg-cyan-500/20 text-cyan-400':'text-slate-500'}\`}>THERMO</button>
          <button onClick={() => setTab('hemo')} className={\`px-4 py-2 text-xs font-bold rounded \${tab==='hemo'?'bg-rose-500/20 text-rose-400':'text-slate-500'}\`}>HEMO</button>
        </div>
      </div>
      
      <div className="flex flex-1 flex-col md:flex-row relative">
        {/* 3D Canvas Area */}
        <div className="relative flex-1 bg-slate-900 min-h-[50vh]">
          <ErrorBoundary>
            <Canvas camera={{ position: [0, 4, 12], fov: 45 }} className="w-full h-full" gl={{ antialias: true, logarithmicDepthBuffer: true }}>
              <color attach="background" args={['#050505']} />
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 5]} intensity={2} />
              <Grid infiniteGrid fadeDistance={40} sectionColor="#1e293b" cellColor="#050505" position={[0, -1, 0]} />
              
              {tab === 'optics' && <OpticsLab wavelength={wavelength} index={refractiveIndex} polarization={polarization} />}
              {tab === 'thermo' && <ThermoLab temperature={temperature} pressure={pressure} concentration={concentration} />}
              {tab === 'hemo' && <HemoLab bpm={bpm} svr={svr} ef={ef} pathology={pathology} />}
              
              <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2 + 0.1} minDistance={5} maxDistance={20} />
              <EffectComposer>
                <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} />
              </EffectComposer>
            </Canvas>
          </ErrorBoundary>
          
          {/* Overlay Stats (Live Telemetry) */}
          <div className="absolute top-4 left-4 rounded-xl border border-slate-700 bg-slate-900/90 p-4 backdrop-blur-md shadow-2xl z-10 min-w-[200px]">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-300 mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400 animate-pulse" /> Sensor Telemetry
            </h3>
            
            {tab === 'optics' && (
              <div className="space-y-2 text-xs font-mono text-slate-400">
                <div className="flex justify-between"><span>Critical Angle ($\theta_c$):</span> <span className="text-emerald-400 font-bold">{(Math.asin(1/refractiveIndex) * 180 / Math.PI).toFixed(2)}°</span></div>
                <div className="flex justify-between"><span>Wavelength:</span> <span className="text-white">{wavelength} nm</span></div>
                <div className="flex justify-between"><span>Phase Shift:</span> <span className="text-sky-400">{polarization ? '$\pi/2$ (Circ)' : '0 (Lin)'}</span></div>
              </div>
            )}

            {tab === 'thermo' && (
              <div className="space-y-2 text-xs font-mono text-slate-400">
                <div className="flex justify-between"><span>$\Delta H$ (Enthalpy):</span> <span className="text-white">-50.0 kJ/mol</span></div>
                <div className="flex justify-between"><span>$\Delta S$ (Entropy):</span> <span className="text-white">-0.1 kJ/mol·K</span></div>
                <div className="flex justify-between">
                  <span>$\Delta G$ (Gibbs):</span> 
                  <span className={\`font-bold \${(-50 - temperature * -0.1) > 0 ? 'text-rose-500 animate-pulse' : 'text-emerald-400'}\`}>
                    {(-50 - temperature * -0.1).toFixed(1)} kJ/mol
                  </span>
                </div>
                {(-50 - temperature * -0.1) > 0 && <div className="text-[10px] text-rose-500 mt-2">WARNING: Non-spontaneous</div>}
              </div>
            )}

            {tab === 'hemo' && (
              <div className="space-y-2 text-xs font-mono text-slate-400">
                {/* Fake ECG SVG */}
                <div className="h-10 w-full overflow-hidden border-b border-rose-500/30 mb-2 relative flex items-center">
                   <svg viewBox="0 0 100 20" className="w-[200%] h-full stroke-rose-500 fill-none stroke-[0.5] opacity-80 animate-[slide_1s_linear_infinite]" style={{animationDuration: \`\${60/bpm}s\`}}>
                     <path d="M0 10 L10 10 L12 8 L14 10 L20 10 L22 15 L25 -5 L28 12 L30 10 L40 10 L45 7 L50 10 L100 10" />
                   </svg>
                </div>
                <div className="flex justify-between"><span>Cycle Phase:</span> <span className="text-rose-400 font-bold">{bpm > 100 ? 'Tachycardia' : bpm < 60 ? 'Bradycardia' : 'Sinus'}</span></div>
                <div className="flex justify-between"><span>Cardiac Output:</span> <span className="text-white">{((ef/100) * 120 * bpm / 1000).toFixed(1)} L/min</span></div>
                <div className="flex justify-between"><span>Aortic Press:</span> <span className="text-sky-400">{Math.floor(120 * (svr/100))}/{Math.floor(80 * (svr/100))}</span></div>
              </div>
            )}
          </div>
        </div>

        {/* Control Panel */}
        <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-slate-800 bg-slate-950 p-6 overflow-y-auto z-20 flex flex-col gap-6">
          <div>
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4">Advanced Parameters</h2>
            
            {tab === 'optics' && (
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2"><label className="text-xs text-slate-300">Wavelength ($\lambda$)</label><span className="text-xs font-mono text-emerald-400">{wavelength} nm</span></div>
                  <input type="range" min="380" max="750" value={wavelength} onChange={(e) => setWavelength(Number(e.target.value))} className="w-full accent-emerald-500" />
                </div>
                <div>
                  <div className="flex justify-between mb-2"><label className="text-xs text-slate-300">Refractive Index ($n$)</label><span className="text-xs font-mono text-emerald-400">{refractiveIndex.toFixed(3)}</span></div>
                  <input type="range" min="1" max="2.42" step="0.01" value={refractiveIndex} onChange={(e) => setRefractiveIndex(Number(e.target.value))} className="w-full accent-emerald-500" />
                </div>
                <div className="flex items-center justify-between pt-2">
                  <label className="text-xs text-slate-300">Polarization Grid</label>
                  <input type="checkbox" checked={polarization} onChange={() => setPolarization(!polarization)} className="w-4 h-4 accent-emerald-500" />
                </div>
              </div>
            )}

            {tab === 'thermo' && (
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2"><label className="text-xs text-slate-300">Temperature ($T$)</label><span className="text-xs font-mono text-cyan-400">{temperature} K</span></div>
                  <input type="range" min="0" max="1000" value={temperature} onChange={(e) => setTemperature(Number(e.target.value))} className="w-full accent-cyan-500" />
                </div>
                <div>
                  <div className="flex justify-between mb-2"><label className="text-xs text-slate-300">Pressure ($P$)</label><span className="text-xs font-mono text-cyan-400">{pressure} atm</span></div>
                  <input type="range" min="1" max="100" value={pressure} onChange={(e) => setPressure(Number(e.target.value))} className="w-full accent-cyan-500" />
                </div>
                <div>
                  <div className="flex justify-between mb-2"><label className="text-xs text-slate-300">Solute Concentration</label><span className="text-xs font-mono text-cyan-400">{concentration} M</span></div>
                  <input type="range" min="2" max="12" value={concentration} onChange={(e) => setConcentration(Number(e.target.value))} className="w-full accent-cyan-500" />
                </div>
              </div>
            )}

            {tab === 'hemo' && (
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2"><label className="text-xs text-slate-300">Heart Rate</label><span className="text-xs font-mono text-rose-400">{bpm} BPM</span></div>
                  <input type="range" min="40" max="200" value={bpm} onChange={(e) => setBpm(Number(e.target.value))} className="w-full accent-rose-500" />
                </div>
                <div>
                  <div className="flex justify-between mb-2"><label className="text-xs text-slate-300">Ejection Fraction (EF%)</label><span className="text-xs font-mono text-rose-400">{ef}%</span></div>
                  <input type="range" min="10" max="75" value={ef} onChange={(e) => setEf(Number(e.target.value))} className="w-full accent-rose-500" />
                </div>
                <div>
                  <div className="flex justify-between mb-2"><label className="text-xs text-slate-300">Vascular Resistance (SVR)</label><span className="text-xs font-mono text-rose-400">{svr}</span></div>
                  <input type="range" min="50" max="300" value={svr} onChange={(e) => setSvr(Number(e.target.value))} className="w-full accent-rose-500" />
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-2">Pathology Injection</label>
                  <select value={pathology} onChange={(e) => setPathology(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-slate-300 focus:outline-none focus:border-rose-500">
                    <option value="Normal">Normal Sinus Rhythm</option>
                    <option value="VFib">Ventricular Fibrillation</option>
                    <option value="Aortic Stenosis">Aortic Stenosis</option>
                  </select>
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-auto">
            <button onClick={runDiagnosticScan} disabled={scanning} className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 p-4 flex items-center justify-center gap-2 font-bold text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:scale-[1.02] transition">
              {scanning ? <ActivitySquare className="animate-spin" /> : <Zap className="text-amber-300" />}
              {scanning ? 'ANALYZING...' : 'RUN AI DIAGNOSTIC'}
            </button>
            <p className="text-center text-[10px] text-slate-500 mt-2 font-mono">GEMINI-3.6-FLASH CORE</p>
          </div>
        </div>
      </div>

      {/* AI Diagnostic Modal */}
      {aiReport && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-indigo-500/50 rounded-2xl w-full max-w-lg overflow-hidden shadow-[0_0_50px_rgba(99,102,241,0.2)] animate-in fade-in zoom-in duration-300">
            <div className="bg-indigo-500/10 p-4 border-b border-indigo-500/20 flex justify-between items-center">
              <h3 className="font-black text-indigo-400 flex items-center gap-2"><ShieldCheck /> DIAGNOSTIC REPORT</h3>
              <button onClick={() => setAiReport(null)} className="text-slate-400 hover:text-white"><ActivitySquare /></button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-1">Identified Anomaly</h4>
                <p className="text-rose-400 font-mono text-sm">{aiReport.anomaly}</p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-1">Theoretical Consequence</h4>
                <p className="text-amber-400 font-mono text-sm">{aiReport.consequence}</p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-1">Corrective Action</h4>
                <p className="text-emerald-400 font-mono text-sm">{aiReport.action}</p>
              </div>
            </div>
            <div className="bg-slate-950 p-4 border-t border-slate-800 text-center">
              <button onClick={() => setAiReport(null)} className="px-8 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded font-bold transition">ACKNOWLEDGE</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
`;

fs.writeFileSync('src/components/SimulationLab.tsx', fileContent);
