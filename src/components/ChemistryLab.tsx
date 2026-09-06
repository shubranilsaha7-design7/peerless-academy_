import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Text } from '@react-three/drei';
import * as THREE from 'three';

// A simple reusable atom component
function Atom({ position, color, radius, name }: { position: [number, number, number], color: string, radius: number, name: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.1;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshPhysicalMaterial color={color} metalness={0.2} roughness={0.1} clearcoat={0.8} />
      </mesh>
      <Text position={[0, radius + 0.3, 0]} fontSize={0.3} color="white" anchorX="center" anchorY="middle">
        {name}
      </Text>
    </group>
  );
}

// A simple cylinder to represent chemical bonds
function Bond({ start, end }: { start: [number, number, number], end: [number, number, number] }) {
  const startVec = new THREE.Vector3(...start);
  const endVec = new THREE.Vector3(...end);
  const distance = startVec.distanceTo(endVec);
  const position = startVec.clone().lerp(endVec, 0.5);
  
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (ref.current) {
      ref.current.lookAt(endVec);
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <cylinderGeometry args={[0.1, 0.1, distance, 16]} />
      <meshStandardMaterial color="#94a3b8" />
    </mesh>
  );
}

// H2O Molecule
function WaterMolecule() {
  const O_POS: [number, number, number] = [0, 0, 0];
  const H1_POS: [number, number, number] = [-1.2, -0.8, 0];
  const H2_POS: [number, number, number] = [1.2, -0.8, 0];

  return (
    <group>
      <Atom position={O_POS} color="#ef4444" radius={0.8} name="O" />
      <Atom position={H1_POS} color="#f8fafc" radius={0.5} name="H" />
      <Atom position={H2_POS} color="#f8fafc" radius={0.5} name="H" />
      <Bond start={O_POS} end={H1_POS} />
      <Bond start={O_POS} end={H2_POS} />
    </group>
  );
}

export default function ChemistryLab() {
  const [molecule, setMolecule] = useState('H2O');

  return (
    <div className="flex h-screen flex-col bg-slate-950 text-white">
      <div className="flex items-center justify-between border-b border-slate-800 p-6">
        <div>
          <h1 className="text-2xl font-black text-white">Interactive Chemistry Lab</h1>
          <p className="text-sm text-slate-400 mt-1">3D Molecular Viewer & Lattice Visualizer</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setMolecule('H2O')}
            className={`rounded-lg px-4 py-2 text-xs font-bold transition ${molecule === 'H2O' ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-300'}`}
          >
            Water (H₂O)
          </button>
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        <div className="relative flex-1 bg-black">
          <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
            <color attach="background" args={['#020617']} />
            <ambientLight intensity={0.6} />
            <pointLight position={[10, 10, 10]} intensity={1.5} />
            <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
            
            <group rotation={[0.2, 0.5, 0]}>
              {molecule === 'H2O' && <WaterMolecule />}
            </group>
            
            <OrbitControls autoRotate autoRotateSpeed={1.5} enablePan={true} maxPolarAngle={Math.PI} minDistance={3} maxDistance={20} />
          </Canvas>
          
          <div className="absolute bottom-6 left-6 rounded-xl border border-rose-500/20 bg-slate-900/80 p-4 backdrop-blur-md max-w-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-2">Molecular Data</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              <strong>Water (H₂O)</strong> is a polar inorganic compound. The oxygen atom has a partial negative charge, while the hydrogen atoms have a partial positive charge, resulting in a bent molecular geometry.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
