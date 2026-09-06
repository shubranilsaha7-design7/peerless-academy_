import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import * as THREE from 'three';

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return (
      <div className="flex h-full w-full items-center justify-center bg-slate-900 text-slate-400 p-8 text-center border border-rose-500 rounded-lg shadow-2xl relative z-50">
        <div>
           <div className="text-rose-500 font-bold mb-2">3D Hardware Acceleration Unavailable.</div>
           <div>Please use PC for simulations. WebGL contexts failed to initialize.</div>
           <button onClick={() => this.setState({hasError:false})} className="mt-4 px-4 py-2 bg-slate-800 rounded border border-slate-700 hover:bg-slate-700 text-white font-bold">Retry Engine</button>
        </div>
      </div>
    );
    return this.props.children;
  }
}

function BohrAtom({ energy }: { energy: number }) {
  const electron1 = useRef<THREE.Group>(null);
  const electron2 = useRef<THREE.Group>(null);
  const electron3 = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    const speed = energy * delta * 2;
    if (electron1.current) electron1.current.rotation.y += speed;
    if (electron2.current) { electron2.current.rotation.x += speed * 0.8; electron2.current.rotation.z += speed * 0.5; }
    if (electron3.current) { electron3.current.rotation.z -= speed * 1.2; electron3.current.rotation.y += speed * 0.3; }
  });

  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.5} />
      </mesh>
      
      <group ref={electron1}>
        <mesh position={[2.5, 0, 0]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#38bdf8" />
        </mesh>
      </group>
      
      <group ref={electron2}>
        <mesh position={[0, 4, 0]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#38bdf8" />
        </mesh>
      </group>
      
      <group ref={electron3}>
        <mesh position={[-3.5, 0, -3.5]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#38bdf8" />
        </mesh>
      </group>
    </group>
  );
}

function H2OMolecule({ showDipole }: { showDipole: boolean }) {
  const r = 2.5;
  const rad = 52.25 * (Math.PI / 180);
  const h1 = [-r * Math.sin(rad), -r * Math.cos(rad), 0];
  const h2 = [r * Math.sin(rad), -r * Math.cos(rad), 0];
  
  const arrowHelper = useMemo(() => {
    return new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, -r * Math.cos(rad), 0), 2.8, 0xa855f7, 0.6, 0.4);
  }, [r, rad]);

  return (
    <group position={[0, 1, 0]}>
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#ef4444" roughness={0.4} />
      </mesh>
      
      <mesh position={new THREE.Vector3(...h1)}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial color="#ffffff" roughness={0.4} />
      </mesh>
      
      <mesh position={new THREE.Vector3(...h2)}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial color="#ffffff" roughness={0.4} />
      </mesh>
      
      <mesh position={[h1[0]/2, h1[1]/2, 0]} rotation={[0, 0, -rad]}>
        <cylinderGeometry args={[0.15, 0.15, r]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
      
      <mesh position={[h2[0]/2, h2[1]/2, 0]} rotation={[0, 0, rad]}>
        <cylinderGeometry args={[0.15, 0.15, r]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
      
      {showDipole && <primitive object={arrowHelper} />}
    </group>
  );
}

function DNAHelix({ mutated }: { mutated: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

  const pairs = 15;
  const height = 10;
  const radius = 1.8;

  return (
    <group ref={groupRef} position={[0, -height/2, 0]}>
      {Array.from({ length: pairs }).map((_, i) => {
        const y = (i / pairs) * height;
        const angle = i * 0.6;
        const x1 = Math.cos(angle) * radius;
        const z1 = Math.sin(angle) * radius;
        const x2 = -x1;
        const z2 = -z1;
        
        const isMutated = mutated && i === 7;
        const c1 = isMutated ? "#ef4444" : (i % 2 === 0 ? "#10b981" : "#3b82f6");
        const c2 = isMutated ? "#ef4444" : (i % 2 === 0 ? "#f59e0b" : "#8b5cf6");

        return (
          <group key={i} position={[0, y, 0]}>
            <mesh position={[x1, 0, z1]}>
              <sphereGeometry args={[0.35, 16, 16]} />
              <meshStandardMaterial color={c1} />
            </mesh>
            <mesh position={[x2, 0, z2]}>
              <sphereGeometry args={[0.35, 16, 16]} />
              <meshStandardMaterial color={c2} />
            </mesh>
            
            <mesh rotation={[0, -angle, 90 * Math.PI / 180]}>
              <cylinderGeometry args={[0.08, 0.08, radius * 2]} />
              <meshStandardMaterial color="#64748b" />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

export default function SimulationLab() {
  const [tab, setTab] = useState('physics');
  
  const [energy, setEnergy] = useState(1);
  const [dipole, setDipole] = useState(false);
  const [mutated, setMutated] = useState(false);

  return (
    <div className="w-full h-screen bg-[#050510] text-slate-200 flex flex-col md:flex-row overflow-hidden font-sans">
      
      <div className="flex-1 relative order-1 md:order-2 h-[50vh] md:h-screen">
        <ErrorBoundary>
          <Canvas camera={{ position: [0, 0, 10], fov: 60 }} dpr={[1, 1.5]}>
            <color attach="background" args={['#050510']} />
            <ambientLight intensity={0.6} />
            <spotLight position={[10, 15, 10]} angle={0.5} penumbra={1} intensity={1.5} />
            <directionalLight position={[-10, 0, -10]} intensity={0.5} />
            
            {tab === 'physics' && <BohrAtom energy={energy} />}
            {tab === 'chemistry' && <H2OMolecule showDipole={dipole} />}
            {tab === 'biology' && <DNAHelix mutated={mutated} />}
            
            <Grid infiniteGrid fadeDistance={30} fadeStrength={5} cellColor="#334155" sectionColor="#1e293b" position={[0,-4,0]} />
            <OrbitControls enableDamping dampingFactor={0.05} />
          </Canvas>
        </ErrorBoundary>

        <div className="absolute top-4 left-4 right-4 md:right-auto z-20 flex gap-2 overflow-x-auto custom-scrollbar pb-2">
          <button onClick={() => setTab('physics')} className={"px-4 py-2 rounded-lg text-sm font-bold transition whitespace-nowrap " + (tab === 'physics' ? "bg-amber-500 text-slate-950" : "bg-slate-800 text-slate-400 hover:bg-slate-700")}>Physics</button>
          <button onClick={() => setTab('chemistry')} className={"px-4 py-2 rounded-lg text-sm font-bold transition whitespace-nowrap " + (tab === 'chemistry' ? "bg-red-500 text-white" : "bg-slate-800 text-slate-400 hover:bg-slate-700")}>Chemistry</button>
          <button onClick={() => setTab('biology')} className={"px-4 py-2 rounded-lg text-sm font-bold transition whitespace-nowrap " + (tab === 'biology' ? "bg-emerald-500 text-slate-950" : "bg-slate-800 text-slate-400 hover:bg-slate-700")}>Biology</button>
        </div>
      </div>

      <div className="w-full md:w-80 border-t md:border-t-0 md:border-r border-slate-800 bg-[#0a0a14] p-6 order-2 md:order-1 overflow-y-auto h-[50vh] md:h-screen z-30 shadow-2xl relative">
        <h2 className="text-xs font-black tracking-widest text-slate-500 uppercase mb-6 border-b border-slate-800 pb-4">MODULE CONTROLS</h2>
        
        {tab === 'physics' && (
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-xs mb-2 font-bold"><span className="text-slate-400">Energy Level (Speed)</span><span className="text-amber-400">{energy}x</span></div>
              <input type="range" min="0.1" max="5" step="0.1" value={energy} onChange={(e)=>setEnergy(Number(e.target.value))} className="w-full accent-amber-500" />
            </div>
            <p className="text-xs text-slate-500 mt-4 leading-relaxed">Observe the kinematic rotation of electrons. The slider directly multiplies the delta-time integration within the 3D loop.</p>
          </div>
        )}

        {tab === 'chemistry' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-300">Show Dipole Moment</span>
              <button 
                onClick={() => setDipole(!dipole)}
                className={"w-12 h-6 rounded-full transition-colors relative flex items-center " + (dipole ? "bg-red-500" : "bg-slate-700")}
              >
                <div className={"w-4 h-4 rounded-full bg-white absolute transition-transform " + (dipole ? "translate-x-7" : "translate-x-1")} />
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-4 leading-relaxed">The H₂O molecule has a bent geometry (104.5°). Oxygen is highly electronegative, creating a net dipole moment pointing towards it.</p>
          </div>
        )}

        {tab === 'biology' && (
          <div className="space-y-6">
            <button 
              onMouseDown={() => setMutated(true)} 
              onMouseUp={() => setMutated(false)}
              onMouseLeave={() => setMutated(false)}
              onTouchStart={() => setMutated(true)}
              onTouchEnd={() => setMutated(false)}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 active:bg-rose-500 text-slate-950 font-black rounded-xl transition-colors"
            >
              TRIGGER MUTATION (HOLD)
            </button>
            <p className="text-xs text-slate-500 mt-4 leading-relaxed">Holding the button targets a specific base pair, rendering a simulated genetic mutation via a reactive state binding to the mesh material.</p>
          </div>
        )}
      </div>
    </div>
  );
}
