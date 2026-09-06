import React, { useState } from 'react';
import { Database, Bot, Loader2 } from 'lucide-react';
import { supabase } from '../../integrations/supabase/client';

export default function BatchQuestionGenerator() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    subject: 'Physics',
    exam_type: 'JEE Main',
    class_level: 11,
    chapter: 'Kinematics',
    count: 5,
  });
  const [result, setResult] = useState<{ success?: boolean; count?: number; error?: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      // Trigger the Edge Function
      const { data, error } = await supabase.functions.invoke('generate-pyqs', {
        body: form
      });
      if (error) throw error;
      setResult({ success: true, count: data?.count || form.count });
    } catch (err: any) {
      setResult({ success: false, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 shadow-xl backdrop-blur-md">
      <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg">
          <Bot size={20} />
        </div>
        <div>
          <h3 className="text-base font-black text-white">Batch Question Generator</h3>
          <p className="text-xs text-slate-400">Powered by Gemini 1.5 Pro</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Subject</label>
            <select
              value={form.subject}
              onChange={e => setForm({ ...form, subject: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-xs text-white focus:outline-none"
            >
              <option>Physics</option>
              <option>Chemistry</option>
              <option>Math</option>
              <option>Biology</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Exam Type</label>
            <select
              value={form.exam_type}
              onChange={e => setForm({ ...form, exam_type: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-xs text-white focus:outline-none"
            >
              <option>JEE Main</option>
              <option>JEE Advanced</option>
              <option>NEET UG</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Class</label>
            <input
              type="number"
              value={form.class_level}
              onChange={e => setForm({ ...form, class_level: Number(e.target.value) })}
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-xs text-white focus:outline-none"
              min={11} max={12}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Chapter Name</label>
            <input
              type="text"
              required
              value={form.chapter}
              onChange={e => setForm({ ...form, chapter: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-xs text-white focus:outline-none"
              placeholder="e.g. Current Electricity"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Count (Max 10 per batch)</label>
          <input
            type="number"
            value={form.count}
            onChange={e => setForm({ ...form, count: Number(e.target.value) })}
            className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-xs text-white focus:outline-none"
            min={1} max={10}
          />
        </div>

        <button
          disabled={loading}
          type="submit"
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3.5 text-xs font-black text-white shadow-lg transition hover:scale-[1.02] disabled:opacity-50"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Database size={16} />}
          {loading ? 'Generating & Storing in DB...' : 'Generate and Ingest PYQs'}
        </button>
      </form>

      {result && (
        <div className={`mt-4 rounded-xl p-4 text-xs font-bold ${result.success ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
          {result.success ? `✅ Successfully generated and inserted ${result.count} authentic PYQs into the database.` : `❌ Error: ${result.error}`}
        </div>
      )}
    </div>
  );
}
