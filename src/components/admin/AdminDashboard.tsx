import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Search, Mail, Phone, Calendar, RefreshCcw, Video, Key, BarChart3, Plus, Trash2, CheckCircle, XCircle, Image as ImageIcon } from 'lucide-react';
import type { User } from '@supabase/supabase-js';

interface AdminDashboardProps {
  user: User;
  onBack: () => void;
}

export default function AdminDashboard({ user, onBack }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'enquiries' | 'lectures' | 'codes' | 'media' | 'stats'>('enquiries');
  const [loading, setLoading] = useState(true);
  
  // Data States
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [lectures, setLectures] = useState<any[]>([]);
  const [codes, setCodes] = useState<any[]>([]);
  const [media, setMedia] = useState<any[]>([]);
  
  const [stats, setStats] = useState({ activeLectures: 0, enrolledStudents: 0, redemptions: 0 });

  // Forms
  const [lectureForm, setLectureForm] = useState({ title: '', subject: 'Physics', grade_level: 'Class 10', video_url: '', duration: '', is_free_preview: false });
  const [codeForm, setCodeForm] = useState({ code: '', max_uses: 1, description: '' });
  const [mediaForm, setMediaForm] = useState({ type: 'gallery_photo', url: '', embed_code: '' });

  const isAdmin = user?.email === 'admin@peerlessacademy.com' || user?.email === 'shubranilsaha7@gmail.com' || user?.email === 'xprasenjit1992@gmail.com';

  useEffect(() => {
    if (isAdmin) {
      fetchAllData();
    }
  }, [isAdmin]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Inquiries
      const { data: inq } = await (supabase as any).from('contact_inquiries').select('*').order('created_at', { ascending: false });
      setInquiries(inq || []);
      
      // Lectures
      const { data: lecs } = await (supabase as any).from('lectures').select('*').order('created_at', { ascending: false });
      setLectures(lecs || []);
      
      // Codes
      const { data: cds } = await (supabase as any).from('access_codes').select('*').order('created_at', { ascending: false });
      setCodes(cds || []);

      // Media
      const { data: mda } = await (supabase as any).from('site_media').select('*').order('created_at', { ascending: false });
      setMedia(mda || []);
      
      // Stats
      const { count: usersCount } = await (supabase as any).from('profiles').select('*', { count: 'exact', head: true });
      const { count: redemptionsCount } = await (supabase as any).from('user_access').select('*', { count: 'exact', head: true });
      
      setStats({
        activeLectures: lecs?.length || 0,
        enrolledStudents: usersCount || 0,
        redemptions: redemptionsCount || 0,
      });
      
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Lecture Actions
  const handleAddLecture = async (e: React.FormEvent) => {
    e.preventDefault();
    await (supabase as any).from('lectures').insert([lectureForm]);
    setLectureForm({ title: '', subject: 'Physics', grade_level: 'Class 10', video_url: '', duration: '', is_free_preview: false });
    fetchAllData();
  };
  
  const handleDeleteLecture = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lecture?')) return;
    await (supabase as any).from('lectures').delete().eq('id', id);
    fetchAllData();
  };

  // Code Actions
  const handleAddCode = async (e: React.FormEvent) => {
    e.preventDefault();
    await (supabase as any).from('access_codes').insert([codeForm]);
    setCodeForm({ code: '', max_uses: 1, description: '' });
    fetchAllData();
  };
  
  const toggleCodeStatus = async (id: string, currentStatus: boolean) => {
    await (supabase as any).from('access_codes').update({ is_active: !currentStatus }).eq('id', id);
    fetchAllData();
  };

  // Media Actions
  const handleAddMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    await (supabase as any).from('site_media').insert([mediaForm]);
    setMediaForm({ type: 'gallery_photo', url: '', embed_code: '' });
    fetchAllData();
  };

  const handleDeleteMedia = async (id: string) => {
    if (!confirm('Are you sure you want to delete this media item?')) return;
    await (supabase as any).from('site_media').delete().eq('id', id);
    fetchAllData();
  };

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-white">
        <h2 className="text-2xl font-bold text-rose-500 mb-4">Access Denied</h2>
        <p className="text-slate-400 mb-6">You do not have administrator privileges.</p>
        <button onClick={onBack} className="rounded-xl bg-slate-800 px-6 py-3 font-bold hover:bg-slate-700">Return to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-white/5 bg-slate-950/80 p-4 backdrop-blur-md lg:px-8">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="flex items-center justify-center rounded-full bg-white/5 p-2 text-slate-400 transition hover:bg-white/10 hover:text-white">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-white hidden sm:block">Admin Console</h1>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          {['enquiries', 'lectures', 'codes', 'media', 'stats'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-3 py-1.5 text-sm font-bold rounded-lg capitalize transition ${activeTab === tab ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-6 lg:p-8">
        
        {/* ENQUIRIES TAB */}
        {activeTab === 'enquiries' && (
          <div className="space-y-6">
             <div className="flex justify-between items-center">
               <h2 className="text-2xl font-black text-white">Contact Enquiries</h2>
               <button onClick={fetchAllData} className="flex items-center gap-2 rounded-lg bg-indigo-500/10 px-4 py-2 text-sm font-bold text-indigo-400"><RefreshCcw size={16}/> Refresh</button>
             </div>
             <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-900">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-950/50 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-6 py-4 font-black tracking-wider">Student Name</th>
                      <th className="px-6 py-4 font-black tracking-wider">Guardian</th>
                      <th className="px-6 py-4 font-black tracking-wider">Contact</th>
                      <th className="px-6 py-4 font-black tracking-wider">Class</th>
                      <th className="px-6 py-4 font-black tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {inquiries.map((inq) => (
                      <tr key={inq.id} className="transition hover:bg-white/[0.02]">
                        <td className="px-6 py-4 font-bold text-white">{inq.student_name}</td>
                        <td className="px-6 py-4">{inq.guardian_name}</td>
                        <td className="px-6 py-4">{inq.phone}</td>
                        <td className="px-6 py-4"><span className="rounded bg-indigo-500/20 px-2 py-1 text-xs font-bold text-indigo-300">{inq.class_level}</span></td>
                        <td className="px-6 py-4 text-xs text-slate-500">{new Date(inq.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>
        )}

        {/* LECTURES TAB */}
        {activeTab === 'lectures' && (
          <div className="grid lg:grid-cols-[350px_1fr] gap-8">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-fit">
              <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2"><Video size={18} className="text-emerald-400"/> Add Lecture</h3>
              <form onSubmit={handleAddLecture} className="space-y-4">
                <input required type="text" placeholder="Lecture Title" value={lectureForm.title} onChange={e => setLectureForm({...lectureForm, title: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white" />
                <div className="grid grid-cols-2 gap-3">
                  <select value={lectureForm.subject} onChange={e => setLectureForm({...lectureForm, subject: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white">
                    <option>Physics</option><option>Chemistry</option><option>Biology</option><option>Math</option>
                  </select>
                  <select value={lectureForm.grade_level} onChange={e => setLectureForm({...lectureForm, grade_level: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white">
                    <option>Class 9</option><option>Class 10</option><option>Class 11</option><option>Class 12</option><option>Dropper</option>
                  </select>
                </div>
                <input required type="url" placeholder="Video URL (YouTube/Vimeo)" value={lectureForm.video_url} onChange={e => setLectureForm({...lectureForm, video_url: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white" />
                <input type="text" placeholder="Duration (e.g. 45 min)" value={lectureForm.duration} onChange={e => setLectureForm({...lectureForm, duration: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white" />
                <label className="flex items-center gap-3 p-3 bg-slate-950 border border-slate-700 rounded-xl cursor-pointer">
                  <input type="checkbox" checked={lectureForm.is_free_preview} onChange={e => setLectureForm({...lectureForm, is_free_preview: e.target.checked})} className="accent-emerald-500" />
                  <span className="text-sm font-bold text-slate-300">Is Free Preview?</span>
                </label>
                <button type="submit" className="w-full flex justify-center items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition">
                  <Plus size={16} /> Add Lecture
                </button>
              </form>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-black text-white">Managed Lectures</h3>
              {lectures.map(lec => (
                <div key={lec.id} className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-xl">
                  <div>
                    <h4 className="font-bold text-white">{lec.title}</h4>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-400 font-medium uppercase">
                      <span>{lec.subject}</span>&bull;<span>{lec.grade_level}</span>&bull;
                      <span className={lec.is_free_preview ? 'text-emerald-400' : 'text-rose-400'}>{lec.is_free_preview ? 'Free' : 'Locked'}</span>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteLecture(lec.id)} className="p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              {lectures.length === 0 && <p className="text-slate-500 text-sm">No lectures found.</p>}
            </div>
          </div>
        )}

        {/* CODES TAB */}
        {activeTab === 'codes' && (
          <div className="grid lg:grid-cols-[350px_1fr] gap-8">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-fit">
               <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2"><Key size={18} className="text-purple-400"/> Generate Code</h3>
               <form onSubmit={handleAddCode} className="space-y-4">
                 <input required type="text" placeholder="Code (e.g. PEER-SUMMER)" value={codeForm.code} onChange={e => setCodeForm({...codeForm, code: e.target.value.toUpperCase()})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-mono uppercase" />
                 <input type="text" placeholder="Description (Optional)" value={codeForm.description} onChange={e => setCodeForm({...codeForm, description: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white" />
                 <input required type="number" min="1" placeholder="Max Uses" value={codeForm.max_uses} onChange={e => setCodeForm({...codeForm, max_uses: parseInt(e.target.value)})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white" />
                 <button type="submit" className="w-full flex justify-center items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 rounded-xl transition">
                   <Plus size={16} /> Create Code
                 </button>
               </form>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-black text-white">Active Access Codes</h3>
              {codes.map(code => (
                <div key={code.id} className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-xl">
                  <div>
                    <h4 className="font-bold text-white font-mono tracking-wider">{code.code}</h4>
                    <div className="text-sm text-slate-400 mt-1">{code.description || 'No description'}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-slate-500 uppercase bg-slate-950 px-2 py-1 rounded">Uses: {code.max_uses}</span>
                    <button onClick={() => toggleCodeStatus(code.id, code.is_active)} className={`p-2 rounded-lg transition ${code.is_active ? 'text-emerald-400 hover:bg-emerald-400/10' : 'text-slate-500 hover:bg-slate-800'}`}>
                      {code.is_active ? <CheckCircle size={22} /> : <XCircle size={22} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MEDIA TAB */}
        {activeTab === 'media' && (
          <div className="grid lg:grid-cols-[350px_1fr] gap-8">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-fit">
               <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2"><ImageIcon size={18} className="text-pink-400"/> Add Media</h3>
               <form onSubmit={handleAddMedia} className="space-y-4">
                 <select value={mediaForm.type} onChange={e => setMediaForm({...mediaForm, type: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white">
                   <option value="startup_video">Startup Intro Video</option>
                   <option value="gallery_photo">Life at Peerless Gallery Photo</option>
                   <option value="instagram_embed">Instagram Embed Code</option>
                 </select>
                 
                 {mediaForm.type === 'instagram_embed' ? (
                   <textarea placeholder="Paste <iframe> or Embed HTML" value={mediaForm.embed_code} onChange={e => setMediaForm({...mediaForm, embed_code: e.target.value})} className="w-full h-32 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-mono" />
                 ) : (
                   <input type="url" placeholder="Direct Media URL (.mp4, .jpg, .png)" required value={mediaForm.url} onChange={e => setMediaForm({...mediaForm, url: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white" />
                 )}
                 
                 <button type="submit" className="w-full flex justify-center items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 rounded-xl transition">
                   <Plus size={16} /> Add Media
                 </button>
               </form>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-black text-white">Active Site Media</h3>
              {media.map(item => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-xl">
                  <div className="flex-1 min-w-0 pr-4">
                    <h4 className="font-bold text-white uppercase text-xs tracking-wider text-pink-400 mb-1">
                      {item.type.replace('_', ' ')}
                    </h4>
                    <div className="text-sm text-slate-400 truncate">
                      {item.type === 'instagram_embed' ? 'HTML Embed Code Snippet' : item.url}
                    </div>
                  </div>
                  <button onClick={() => handleDeleteMedia(item.id)} className="p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              {media.length === 0 && <p className="text-slate-500 text-sm">No custom media configured.</p>}
            </div>
          </div>
        )}

        {/* STATS TAB */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-white flex items-center gap-2"><BarChart3 size={24} className="text-coral"/> Real-Time Stats</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
                <div className="text-5xl font-black text-white mb-2">{stats.activeLectures}</div>
                <div className="text-sm font-bold uppercase tracking-wider text-slate-500">Active Lectures</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
                <div className="text-5xl font-black text-white mb-2">{stats.enrolledStudents}</div>
                <div className="text-sm font-bold uppercase tracking-wider text-slate-500">Enrolled Students</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
                <div className="text-5xl font-black text-white mb-2">{stats.redemptions}</div>
                <div className="text-sm font-bold uppercase tracking-wider text-slate-500">Code Redemptions</div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
