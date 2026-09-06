const fs = require('fs');

const code = `import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid, Trail } from '@react-three/drei';
import * as THREE from 'three';

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: any) { console.error("WebGL Error:", error); }
  render() {
    if (this.state.hasError) return (
      <div className="flex flex-col h-full w-full items-center justify-center bg-slate-900 text-slate-300 font-mono gap-4 p-6 text-center">
        <div className="text-rose-500 font-black text-xl">WebGL Render Crash</div>
        <div>Your device ran out of memory or doesn't support WebGL contexts.</div>
        <button onClick={() => this.setState({hasError:false})} className="px-4 py-2 border border-slate-700 hover:bg-slate-800 rounded">Retry Render</button>
      </div>
    );
    return this.props.children;
  }
}

function PendulumLab({ mass, length, gravity, damping, initialAngle, showVectors, telemetryRefs }: any) {
  const bobRef = useRef<THREE.Mesh>(null);
  const rodRef = useRef<THREE.Mesh>(null);
  
  const thetaRef = useRef(initialAngle * Math.PI / 180);
  const omegaRef = useRef(0);
  
  useEffect(() => {
    thetaRef.current = initialAngle * Math.PI / 180;
    omegaRef.current = 0;
  }, [initialAngle, length]);

  const gravArrow = useMemo(() => new THREE.ArrowHelper(new THREE.Vector3(0,-1,0), new THREE.Vector3(0,0,0), 1, 0xef4444, 0.4, 0.2), []);
  const tensArrow = useMemo(() => new THREE.ArrowHelper(new THREE.Vector3(0,1,0), new THREE.Vector3(0,0,0), 1, 0x3b82f6, 0.4, 0.2), []);
  const velArrow = useMemo(() => new THREE.ArrowHelper(new THREE.Vector3(1,0,0), new THREE.Vector3(0,0,0), 1, 0x22c55e, 0.4, 0.2), []);

  useFrame((state, delta) => {
    const g = gravity;
    const L = length;
    const dt = Math.min(delta, 0.05); 
    
    const alpha = -(g / L) * Math.sin(thetaRef.current);
    
    omegaRef.current += alpha * dt;
    omegaRef.current *= Math.max(0, 1 - (damping * dt * 2)); 
    thetaRef.current += omegaRef.current * dt;

    const theta = thetaRef.current;
    const omega = omegaRef.current;
    
    const x = L * Math.sin(theta);
    const y = 5 - L * Math.cos(theta);

    if (bobRef.current && rodRef.current) {
      bobRef.current.position.set(x, y, 0);
      bobRef.current.scale.setScalar(Math.pow(mass, 0.33));
      
      rodRef.current.position.set(x/2, 5 - (5-y)/2, 0);
      rodRef.current.rotation.z = theta;
      rodRef.current.scale.set(1, L, 1);
    }
    
    const v = L * omega;
    const KE = 0.5 * mass * v * v;
    const PE = mass * g * L * (1 - Math.cos(theta));
    const totalE = KE + PE;
    const maxPE = mass * g * L * (1 - Math.cos(initialAngle * Math.PI / 180));
    const maxE = Math.max(maxPE, totalE, 0.001); 

    if (showVectors) {
      const bobPos = new THREE.Vector3(x, y, 0);
      
      gravArrow.visible = true;
      gravArrow.position.copy(bobPos);
      gravArrow.setLength(Math.max(0.5, mass * g * 0.1));

      tensArrow.visible = true;
      tensArrow.position.copy(bobPos);
      const tensDir = new THREE.Vector3(-Math.sin(theta), Math.cos(theta), 0).normalize();
      tensArrow.setDirection(tensDir);
      const tensionMag = mass * g * Math.cos(theta) + mass * (v * v) / L;
      tensArrow.setLength(Math.max(0.5, tensionMag * 0.1));

      velArrow.visible = true;
      velArrow.position.copy(bobPos);
      const velVec = new THREE.Vector3(L * omega * Math.cos(theta), L * omega * Math.sin(theta), 0);
      if (velVec.length() > 0.01) {
        velArrow.setDirection(velVec.clone().normalize());
        velArrow.setLength(Math.max(0.5, Math.abs(v) * 0.5));
      } else {
        velArrow.visible = false;
      }
    } else {
      gravArrow.visible = false;
      tensArrow.visible = false;
      velArrow.visible = false;
    }

    if (telemetryRefs.theta.current) telemetryRefs.theta.current.innerText = (theta * 180 / Math.PI).toFixed(1) + '°';
    if (telemetryRefs.vel.current) telemetryRefs.vel.current.innerText = Math.abs(v).toFixed(2) + ' m/s';
    if (telemetryRefs.keText.current) telemetryRefs.keText.current.innerText = KE.toFixed(1) + ' J';
    if (telemetryRefs.peText.current) telemetryRefs.peText.current.innerText = PE.toFixed(1) + ' J';
    
    if (telemetryRefs.keBar.current) telemetryRefs.keBar.current.style.width = Math.min(100, (KE / maxE) * 100) + '%';
    if (telemetryRefs.peBar.current) telemetryRefs.peBar.current.style.width = Math.min(100, (PE / maxE) * 100) + '%';
  });

  return (
    <group>
      <mesh position={[0, 5, 0]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
      
      <mesh ref={rodRef}>
        <cylinderGeometry args={[0.05, 0.05, 1, 8]} />
        <meshStandardMaterial color="#888" />
      </mesh>

      <Trail width={2} length={20} color="#06b6d4" attenuation={(t) => t * t}>
        <mesh ref={bobRef}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color="#0ea5e9" metalness={0.5} roughness={0.2} />
        </mesh>
      </Trail>

      <primitive object={gravArrow} />
      <primitive object={tensArrow} />
      <primitive object={velArrow} />
    </group>
  );
}

export default function SimulationLab() {
  const [mass, setMass] = useState(1);
  const [length, setLength] = useState(5);
  const [gravity, setGravity] = useState(9.81);
  const [initialAngle, setInitialAngle] = useState(45);
  const [damping, setDamping] = useState(0);
  const [showVectors, setShowVectors] = useState(false);

  const telemetryRefs = {
    theta: useRef<HTMLSpanElement>(null),
    vel: useRef<HTMLSpanElement>(null),
    keText: useRef<HTMLSpanElement>(null),
    peText: useRef<HTMLSpanElement>(null),
    keBar: useRef<HTMLDivElement>(null),
    peBar: useRef<HTMLDivElement>(null),
  };

  return (
    <div className="w-full h-screen bg-[#050510] text-slate-200 flex flex-col md:flex-row overflow-hidden font-sans">
      <div className="flex-1 relative order-1 md:order-2 h-[50vh] md:h-screen">
        <ErrorBoundary>
          <Canvas camera={{ position: [0, 5, 10], fov: 60 }} dpr={[1, 2]}>
            <color attach="background" args={['#050510']} />
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
            
            <PendulumLab 
              mass={mass} length={length} gravity={gravity} 
              damping={damping} initialAngle={initialAngle} showVectors={showVectors}
              telemetryRefs={telemetryRefs}
            />
            
            <Grid infiniteGrid fadeDistance={40} fadeStrength={5} cellColor="#334155" sectionColor="#1e293b" />
            <OrbitControls enableDamping dampingFactor={0.05} />
          </Canvas>
        </ErrorBoundary>

        <div className="absolute top-4 left-4 z-20 bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-xl p-4 font-mono text-xs w-64 pointer-events-none shadow-2xl">
          <div className="flex items-center justify-between text-cyan-400 mb-3 border-b border-slate-700 pb-2 font-bold tracking-widest">
            <span>LIVE TELEMETRY</span>
            <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between"><span className="text-slate-500">Period (T):</span><span className="text-emerald-400 font-bold">{(2 * Math.PI * Math.sqrt(length/gravity)).toFixed(2)} s</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Gravity:</span><span className="text-white font-bold">{gravity.toFixed(1)} m/s²</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Angle (θ):</span><span ref={telemetryRefs.theta} className="text-amber-400 font-bold">0.0°</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Velocity:</span><span ref={telemetryRefs.vel} className="text-blue-400 font-bold">0.00 m/s</span></div>
          </div>

          <div className="space-y-3 pt-3 border-t border-slate-700">
            <div>
              <div className="flex justify-between text-[10px] mb-1">
                <span className="text-slate-400">Kinetic Energy</span>
                <span ref={telemetryRefs.keText} className="text-green-400 font-bold">0.0 J</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div ref={telemetryRefs.keBar} className="bg-green-400 h-full w-0 transition-all duration-75" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[10px] mb-1">
                <span className="text-slate-400">Potential Energy</span>
                <span ref={telemetryRefs.peText} className="text-rose-400 font-bold">0.0 J</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div ref={telemetryRefs.peBar} className="bg-rose-400 h-full w-0 transition-all duration-75" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full md:w-80 border-t md:border-t-0 md:border-r border-slate-800 bg-[#0a0a14] p-6 order-2 md:order-1 overflow-y-auto h-[50vh] md:h-screen custom-scrollbar relative z-30 shadow-2xl">
        <h2 className="text-xs font-black tracking-widest text-slate-500 uppercase mb-6 border-b border-slate-800 pb-4">ENVIRONMENT CONTROLS</h2>
        
        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-xs mb-2 font-bold"><span className="text-slate-400">Initial Angle (θ)</span><span className="text-amber-400">{initialAngle}°</span></div>
            <input type="range" min="10" max="90" step="1" value={initialAngle} onChange={(e)=>setInitialAngle(Number(e.target.value))} className="w-full accent-amber-500" />
          </div>
          <div>
            <div className="flex justify-between text-xs mb-2 font-bold"><span className="text-slate-400">Bob Mass (kg)</span><span className="text-indigo-400">{mass.toFixed(1)} kg</span></div>
            <input type="range" min="0.1" max="10" step="0.1" value={mass} onChange={(e)=>setMass(Number(e.target.value))} className="w-full accent-indigo-500" />
          </div>
          <div>
            <div className="flex justify-between text-xs mb-2 font-bold"><span className="text-slate-400">Rod Length (m)</span><span className="text-indigo-400">{length.toFixed(1)} m</span></div>
            <input type="range" min="1" max="10" step="0.1" value={length} onChange={(e)=>setLength(Number(e.target.value))} className="w-full accent-indigo-500" />
          </div>
          <div>
            <div className="flex justify-between text-xs mb-2 font-bold"><span className="text-slate-400">Gravity (g)</span><span className="text-indigo-400">{gravity.toFixed(2)} m/s²</span></div>
            <input type="range" min="1" max="25" step="0.1" value={gravity} onChange={(e)=>setGravity(Number(e.target.value))} className="w-full accent-indigo-500" />
          </div>
          <div>
            <div className="flex justify-between text-xs mb-2 font-bold"><span className="text-slate-400">Air Resistance</span><span className="text-teal-400">{damping.toFixed(2)}</span></div>
            <input type="range" min="0" max="1" step="0.05" value={damping} onChange={(e)=>setDamping(Number(e.target.value))} className="w-full accent-teal-500" />
          </div>
          
          <div className="pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">Show Force Vectors</span>
              <button 
                onClick={() => setShowVectors(!showVectors)}
                className={"w-12 h-6 rounded-full transition-colors relative flex items-center " + (showVectors ? "bg-cyan-500" : "bg-slate-700")}
              >
                <div className={"w-4 h-4 rounded-full bg-white absolute transition-transform " + (showVectors ? "translate-x-7" : "translate-x-1")} />
              </button>
            </div>
            {showVectors && (
              <div className="mt-4 grid grid-cols-2 gap-2 text-[10px] font-mono">
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded bg-red-500"/> Gravity (mg)</div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded bg-blue-500"/> Tension (T)</div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded bg-green-500"/> Velocity (v)</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/components/SimulationLab.tsx', code);
