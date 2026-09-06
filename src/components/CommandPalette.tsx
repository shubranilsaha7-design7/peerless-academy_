import { useState, useEffect } from 'react';
import { Search, MonitorPlay, FlaskConical, Beaker, Zap, Video, Calendar, X, Swords } from 'lucide-react';

export default function CommandPalette({ isOpen, onClose, navigateTo }: { isOpen: boolean, onClose: () => void, navigateTo: (route: string) => void }) {
  const [query, setQuery] = useState('');

  // Handle Ctrl+K / Cmd+K to open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open logic is handled by parent, but we prevent default browser search
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Focus input on mount
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        document.getElementById('cmd-palette-input')?.focus();
      }, 50);
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const commands = [
    { id: 'lectures', title: 'Video Lectures Hub', icon: Video, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { id: 'arena', title: 'The Arena (CBT)', icon: Swords, color: 'text-rose-400', bg: 'bg-rose-500/10' },
    { id: 'chemistry', title: 'Chemistry 3D Lab', icon: FlaskConical, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { id: 'physics', title: 'Physics 3D Lab', icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { id: 'monk_mode', title: 'Enter Monk Mode', icon: MonitorPlay, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
  ];

  const filtered = commands.filter(c => c.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[10vh] px-4 bg-slate-950/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="w-full max-w-2xl bg-slate-900 border border-slate-700 shadow-2xl rounded-2xl overflow-hidden transform transition-all"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-4 border-b border-slate-800">
          <Search size={20} className="text-slate-400 mr-3" />
          <input 
            id="cmd-palette-input"
            type="text" 
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Where do you want to go? (Try 'Physics')"
            className="flex-1 bg-transparent border-none outline-none text-white text-lg placeholder-slate-500"
          />
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block text-[10px] font-black tracking-widest uppercase text-slate-500 border border-slate-700 px-2 py-1 rounded bg-slate-800">ESC</span>
            <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg transition hover:bg-slate-800">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No results found for "{query}"
            </div>
          ) : (
            <div className="space-y-1">
              <div className="px-3 py-2 text-xs font-black uppercase tracking-wider text-slate-500">Quick Actions</div>
              {filtered.map((cmd) => (
                <button
                  key={cmd.id}
                  onClick={() => {
                    navigateTo(cmd.id);
                    onClose();
                  }}
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-xl transition hover:bg-slate-800 text-left group"
                >
                  <div className={`p-2 rounded-lg ${cmd.bg} ${cmd.color} transition group-hover:scale-110`}>
                    <cmd.icon size={20} />
                  </div>
                  <span className="font-bold text-slate-300 group-hover:text-white transition">{cmd.title}</span>
                  <span className="ml-auto opacity-0 group-hover:opacity-100 transition text-slate-500 text-sm">Jump &rarr;</span>
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className="px-4 py-3 border-t border-slate-800 bg-slate-950/50 text-xs text-slate-500 flex justify-between items-center">
          <span>Search the entire Peerless Academy ecosystem.</span>
          <span className="hidden sm:inline">Use <kbd className="font-mono bg-slate-800 px-1 rounded text-slate-300">↑</kbd> <kbd className="font-mono bg-slate-800 px-1 rounded text-slate-300">↓</kbd> to navigate</span>
        </div>
      </div>
    </div>
  );
}
