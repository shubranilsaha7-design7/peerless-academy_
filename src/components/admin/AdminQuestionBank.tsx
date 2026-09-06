import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Plus, Edit2, Trash2, Check, X, Search, Database } from 'lucide-react';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';

export default function AdminQuestionBank() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isEditing, setIsEditing] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    class_level: 'Class 10',
    subject: 'Physics',
    topic: '',
    question_latex: '',
    options_json: '["Option A", "Option B", "Option C", "Option D"]',
    correct_option: 0,
    solution_latex: '',
    difficulty: 'Medium'
  });

  const fetchQuestions = async () => {
    setLoading(true);
    const { data } = await (supabase as any).from('pyqs').select('*').order('created_at', { ascending: false }).limit(100);
    if (data) setQuestions(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let options = formData.options_json;
      if (typeof options === 'string') {
        options = JSON.parse(options);
      }
      
      const payload = {
        ...formData,
        options_json: options
      };

      if (isEditing === 'new') {
        await (supabase as any).from('pyqs').insert([payload]);
      } else {
        await (supabase as any).from('pyqs').update(payload).eq('id', isEditing.id);
      }
      setIsEditing(null);
      fetchQuestions();
    } catch (err: any) {
      alert("Error saving: " + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this question permanently?')) return;
    await (supabase as any).from('pyqs').delete().eq('id', id);
    fetchQuestions();
  };

  const filtered = questions.filter(q => 
    q.question_latex?.toLowerCase().includes(search.toLowerCase()) ||
    q.subject?.toLowerCase().includes(search.toLowerCase())
  );

  if (isEditing) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          {isEditing === 'new' ? <Plus /> : <Edit2 />} 
          {isEditing === 'new' ? 'Add New Question' : 'Edit Question'}
        </h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <label className="block text-sm text-slate-400">Class Level
              <input value={formData.class_level} onChange={e => setFormData({...formData, class_level: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white mt-1" />
            </label>
            <label className="block text-sm text-slate-400">Subject
              <input value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white mt-1" />
            </label>
            <label className="block text-sm text-slate-400">Topic
              <input value={formData.topic} onChange={e => setFormData({...formData, topic: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white mt-1" />
            </label>
            <label className="block text-sm text-slate-400">Difficulty
              <select value={formData.difficulty} onChange={e => setFormData({...formData, difficulty: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white mt-1">
                <option>Easy</option><option>Medium</option><option>Hard</option>
              </select>
            </label>
          </div>
          <label className="block text-sm text-slate-400">Question (LaTeX Supported)
            <textarea required rows={4} value={formData.question_latex} onChange={e => setFormData({...formData, question_latex: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white mt-1 font-mono text-xs" />
          </label>
          <label className="block text-sm text-slate-400">Options (Valid JSON Array)
            <textarea required rows={2} value={typeof formData.options_json === 'string' ? formData.options_json : JSON.stringify(formData.options_json)} onChange={e => setFormData({...formData, options_json: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white mt-1 font-mono text-xs" />
          </label>
          <label className="block text-sm text-slate-400">Correct Option Index (0-3)
            <input type="number" required min="0" max="3" value={formData.correct_option} onChange={e => setFormData({...formData, correct_option: parseInt(e.target.value)})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white mt-1" />
          </label>
          <label className="block text-sm text-slate-400">Solution (LaTeX)
            <textarea rows={3} value={formData.solution_latex} onChange={e => setFormData({...formData, solution_latex: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white mt-1 font-mono text-xs" />
          </label>
          
          <div className="flex gap-4 pt-4 border-t border-slate-800">
            <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-xl font-bold">Save Question</button>
            <button type="button" onClick={() => setIsEditing(null)} className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2 rounded-xl font-bold">Cancel</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2"><Database className="text-indigo-400" /> Question Bank Manager</h2>
          <p className="text-sm text-slate-400">Manage PYQs and Mock Test data directly.</p>
        </div>
        <button onClick={() => {
          setFormData({ class_level: 'Class 10', subject: 'Physics', topic: '', question_latex: '', options_json: '["A", "B", "C", "D"]', correct_option: 0, solution_latex: '', difficulty: 'Medium' });
          setIsEditing('new');
        }} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 text-sm">
          <Plus size={16} /> Add Question
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search questions..." className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white" />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-slate-500" /></div>
        ) : (
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950 text-slate-400">
              <tr>
                <th className="p-4 font-bold">Class / Subject</th>
                <th className="p-4 font-bold">Question Preview</th>
                <th className="p-4 font-bold">Difficulty</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map(q => (
                <tr key={q.id} className="hover:bg-slate-800/50">
                  <td className="p-4">
                    <div className="font-bold text-white">{q.class_level}</div>
                    <div className="text-xs text-slate-500">{q.subject} {q.topic && `?" ${q.topic}`}</div>
                  </td>
                  <td className="p-4 max-w-xs truncate">
                    <Latex>{q.question_latex?.substring(0, 80) + (q.question_latex?.length > 80 ? '...' : '')}</Latex>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${q.difficulty === 'Hard' ? 'bg-rose-500/20 text-rose-400' : q.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                      {q.difficulty || 'Medium'}
                    </span>
                  </td>
                  <td className="p-4 flex justify-end gap-2">
                    <button onClick={() => {
                      setFormData({...q, options_json: typeof q.options_json === 'string' ? q.options_json : JSON.stringify(q.options_json)});
                      setIsEditing(q);
                    }} className="p-2 text-indigo-400 hover:bg-indigo-500/20 rounded-lg"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(q.id)} className="p-2 text-rose-400 hover:bg-rose-500/20 rounded-lg"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
