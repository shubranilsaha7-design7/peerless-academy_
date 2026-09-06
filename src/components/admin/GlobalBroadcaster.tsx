import React, { useState } from 'react';
import { Radio, Send, Bell } from 'lucide-react';

export default function GlobalBroadcaster() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [urgency, setUrgency] = useState('info');
  const [sending, setSending] = useState(false);

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // Mock push notification logic
    setTimeout(() => {
      setSending(false);
      setTitle('');
      setMessage('');
      alert('Broadcast deployed to all active devices!');
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <Radio className="text-rose-400" size={28} />
        <h2 className="text-3xl font-black text-white">Global Broadcaster</h2>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <p className="text-slate-400 mb-8">Deploy instant push notifications and banner alerts to all connected student devices simultaneously.</p>
        
        <form onSubmit={handleBroadcast} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Alert Title</label>
            <input 
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g., Target 2027 Mock Test Now Live!"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Message Body</label>
            <textarea 
              required
              rows={4}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Enter the broadcast details..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Urgency Level</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-white cursor-pointer">
                <input type="radio" name="urgency" value="info" checked={urgency === 'info'} onChange={() => setUrgency('info')} /> Info (Blue)
              </label>
              <label className="flex items-center gap-2 text-white cursor-pointer">
                <input type="radio" name="urgency" value="warning" checked={urgency === 'warning'} onChange={() => setUrgency('warning')} /> Warning (Amber)
              </label>
              <label className="flex items-center gap-2 text-white cursor-pointer">
                <input type="radio" name="urgency" value="critical" checked={urgency === 'critical'} onChange={() => setUrgency('critical')} /> Critical (Red)
              </label>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={sending}
            className="w-full flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-500 text-white font-black py-4 rounded-xl transition disabled:opacity-50"
          >
            {sending ? 'Deploying Broadcast...' : <><Send size={18} /> DEPLOY BROADCAST</>}
          </button>
        </form>
      </div>
    </div>
  );
}
