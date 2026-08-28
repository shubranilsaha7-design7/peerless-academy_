import { motion } from 'framer-motion';
import { Network, X, Search } from 'lucide-react';

const mockNodes = [
  { id: 1, label: 'Kinematics', x: 50, y: 100, color: 'bg-cyan-500' },
  { id: 2, label: "Newton's Laws", x: 200, y: 150, color: 'bg-indigo-500' },
  { id: 3, label: 'Work & Energy', x: 350, y: 100, color: 'bg-emerald-500' },
  { id: 4, label: 'Center of Mass', x: 500, y: 200, color: 'bg-rose-500' },
];

export default function VisualRoadmap({ onBack }: { onBack: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col font-sans text-white">
      <header className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md">
        <button onClick={onBack} className="text-slate-400 hover:text-white transition"><X size={24} /></button>
        <div className="font-black text-lg tracking-widest text-fuchsia-500 uppercase flex items-center gap-2">
          <Network size={20} /> Concept Roadmap
        </div>
      </header>
      
      <main className="flex-1 relative overflow-hidden bg-slate-950">
        {/* Background Grid */}
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.2 }} />
        
        {/* Controls */}
        <div className="absolute top-6 left-6 z-10 glass-panel p-4 rounded-2xl flex items-center gap-4">
          <Search size={20} className="text-slate-400" />
          <input type="text" placeholder="Search concept..." className="bg-transparent border-none outline-none text-sm w-48 text-white" />
        </div>

        {/* Pan and Zoom Canvas */}
        <motion.div 
          drag 
          dragConstraints={{ left: -1000, right: 1000, top: -1000, bottom: 1000 }}
          className="w-full h-full cursor-grab active:cursor-grabbing relative"
        >
          {/* Edges */}
          <svg className="absolute inset-0 w-[2000px] h-[2000px] pointer-events-none">
            <path d="M 125 120 C 175 120, 150 170, 225 170" stroke="#475569" strokeWidth="2" fill="none" strokeDasharray="5,5" />
            <path d="M 275 170 C 325 170, 300 120, 375 120" stroke="#475569" strokeWidth="2" fill="none" strokeDasharray="5,5" />
            <path d="M 425 120 C 475 120, 450 220, 525 220" stroke="#475569" strokeWidth="2" fill="none" strokeDasharray="5,5" />
          </svg>

          {/* Nodes */}
          {mockNodes.map(node => (
            <motion.div
              key={node.id}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`absolute px-6 py-3 rounded-full font-bold text-sm cursor-pointer shadow-lg shadow-black/50 ${node.color}`}
              style={{ left: node.x, top: node.y }}
            >
              {node.label}
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
