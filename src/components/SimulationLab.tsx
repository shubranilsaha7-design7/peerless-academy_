import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Grid } from '@react-three/drei';
import * as THREE from 'three';

function Pendulum({ length = 5, gravity = 9.8, mass = 1 }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const rodRef = useRef<THREE.Line>(null);
  
  // Starting angle in radians (e.g. pi/4)
  const [angle, setAngle] = useState(Math.PI / 4);
  const [velocity, setVelocity] = useState(0);
  
  useFrame((state, delta) => {
    // Basic Euler integration for pendulum motion:
    // Angular acceleration: alpha = -(g/L) * sin(theta)
    const acceleration = -(gravity / length) * Math.sin(angle);
    
    // Update velocity and angle
    const newVelocity = velocity + acceleration * delta;
    const newAngle = angle + newVelocity * delta;
    
    setVelocity(newVelocity);
    setAngle(newAngle);
    
    // Calculate Cartesian coordinates
    const x = length * Math.sin(newAngle);
    const y = -length * Math.cos(newAngle);
    
    if (meshRef.current) {
      meshRef.current.position.set(x, y, 0);
    }
    
    if (rodRef.current) {
      const positions = new Float32Array([0, 0, 0, x, y, 0]);
      rodRef.current.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    }
  });

  return (
    <group position={[0, 4, 0]}>
      {/* Pivot point */}
      <mesh>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      
      {/* Rod */}
      <line ref={rodRef}>
        <bufferGeometry />
        <lineBasicMaterial color="#94a3b8" linewidth={2} />
      </line>
      
      {/* Bob */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.5 + (mass * 0.1), 32, 32]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.6} roughness={0.2} />
      </mesh>
    </group>
  );
}

export default function SimulationLab() {
  const [gravity, setGravity] = useState(9.8);
  const [length, setLength] = useState(5);
  const [mass, setMass] = useState(2);

  return (
    <div className="flex h-screen flex-col bg-slate-950 text-white">
      <div className="flex items-center justify-between border-b border-slate-800 p-6">
        <div>
          <h1 className="text-2xl font-black text-white">Interactive Physics Lab</h1>
          <p className="text-sm text-slate-400 mt-1">Real-time Kinematics & Pendulum Motion Sandbox</p>
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* 3D Canvas Area */}
        <div className="relative flex-1 bg-slate-900">
          <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
            <color attach="background" args={['#0f172a']} />
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            
            <Grid infiniteGrid fadeDistance={40} sectionColor="#1e293b" cellColor="#0f172a" position={[0, -6, 0]} />
            
            <Pendulum length={length} gravity={gravity} mass={mass} />
            <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2 + 0.2} minDistance={5} maxDistance={30} />
          </Canvas>
          
          {/* Overlay Stats */}
          <div className="absolute top-6 left-6 rounded-xl border border-slate-700 bg-slate-800/80 p-4 backdrop-blur-md">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">Live Telemetry</h3>
            <div className="space-y-1 text-sm font-mono">
              <p>g: {gravity.toFixed(1)} m/s²</p>
              <p>L: {length.toFixed(1)} m</p>
              <p>T: {(2 * Math.PI * Math.sqrt(length / gravity)).toFixed(2)} s</p>
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="w-80 border-l border-slate-800 bg-slate-950 p-6 overflow-y-auto">
          <h2 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-6">Environment Controls</h2>
          
          <div className="space-y-8">
            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-xs font-bold uppercase text-slate-300">Gravity (m/s²)</label>
                <span className="text-xs font-mono text-amber-400">{gravity}</span>
              </div>
              <input 
                type="range" min="1" max="25" step="0.1" 
                value={gravity} onChange={(e) => setGravity(parseFloat(e.target.value))}
                className="w-full accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Moon (1.6)</span>
                <span>Earth (9.8)</span>
                <span>Jupiter (24.7)</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-xs font-bold uppercase text-slate-300">String Length (m)</label>
                <span className="text-xs font-mono text-amber-400">{length}</span>
              </div>
              <input 
                type="range" min="2" max="10" step="0.5" 
                value={length} onChange={(e) => setLength(parseFloat(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-xs font-bold uppercase text-slate-300">Bob Mass (kg)</label>
                <span className="text-xs font-mono text-amber-400">{mass}</span>
              </div>
              <input 
                type="range" min="0.5" max="10" step="0.5" 
                value={mass} onChange={(e) => setMass(parseFloat(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>
          </div>
          
          <div className="mt-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">Connected PYQ</h3>
            <p className="text-xs leading-5 text-slate-300 mb-3">
              "A simple pendulum has a time period T. If it is taken to a planet where gravity is double that of Earth, what is the new time period?"
            </p>
            <button className="w-full rounded-lg bg-indigo-500 py-2 text-[10px] font-black uppercase text-white hover:bg-indigo-600 transition">
              Solve Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
