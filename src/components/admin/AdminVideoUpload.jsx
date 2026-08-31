import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Video, Upload, ShieldAlert, CheckCircle2, ChevronLeft } from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';

export default function AdminVideoUpload({ user, onBack }) {
  const { isAdmin, loading } = useAdmin();
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);



  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      const { error } = await supabase.from('video_lectures').insert([{
        title: formData.get('title'),
        subject: formData.get('subject'),
        chapter: formData.get('chapter'),
        video_url: formData.get('video_url'),
        duration: parseInt(formData.get('duration'), 10),
      }]);
      
      if (error) throw error;
      
      setToast('Lecture published successfully!');
      e.target.reset();
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      console.error(err);
      setToast('Failed to publish lecture.');
      setTimeout(() => setToast(null), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading...</div>;

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-4">
        <ShieldAlert size={64} className="text-red-500 mb-4" />
        <h1 className="text-3xl font-black mb-2">Access Denied</h1>
        <p className="text-slate-400 mb-6 text-center max-w-sm">
          You do not have the required administrative privileges to view this page.
        </p>
        <button 
          onClick={onBack}
          className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold px-6 py-3 rounded-xl transition"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12 relative">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 bg-emerald-500 text-emerald-950 px-4 py-3 rounded-xl font-bold flex items-center gap-2 shadow-xl z-50 animate-bounce">
          <CheckCircle2 size={18} /> {toast}
        </div>
      )}

      <div className="max-w-3xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition mb-8">
          <ChevronLeft size={20} /> Back to Dashboard
        </button>
        
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-purple-500/20 p-3 rounded-xl border border-purple-500/30">
            <Video size={28} className="text-purple-400" />
          </div>
          <div>
            <h1 className="text-3xl font-black">Publish Lecture</h1>
            <p className="text-slate-400 text-sm">Upload a new video lecture to the curriculum database.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Video Title</label>
              <input required name="title" type="text" placeholder="e.g. Intro to Thermodynamics" 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition" />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Subject</label>
              <select required name="subject" 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition">
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
                <option value="Maths">Maths</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Chapter / Topic</label>
              <input required name="chapter" type="text" placeholder="e.g. Thermodynamics" 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Video URL</label>
              <input required name="video_url" type="url" placeholder="https://youtube.com/... or MP4 link" 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Estimated Duration (Minutes)</label>
              <input required name="duration" type="number" min="1" placeholder="45" 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition" />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={submitting}
            className="mt-8 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 py-4 rounded-xl font-black text-white shadow-lg transition active:scale-[0.98] disabled:opacity-50"
          >
            {submitting ? 'Publishing...' : <><Upload size={20} /> Publish Lecture</>}
          </button>
        </form>
      </div>
    </div>
  );
}
