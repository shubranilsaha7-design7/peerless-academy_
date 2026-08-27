import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  ArrowLeft, Search, Mail, Phone, Calendar, RefreshCcw, Video, Key, 
  BarChart3, Plus, Trash2, CheckCircle, XCircle, Image as ImageIcon,
  Users, MessageSquare, Download, Sparkles, Send, Shield, Zap, Flame, 
  Eye, ExternalLink, Award, Megaphone, Check, AlertCircle, Copy, Database
} from 'lucide-react';
import type { User } from '@supabase/supabase-js';

interface AdminDashboardProps {
  user: User;
  onBack: () => void;
}

export default function AdminDashboard({ user, onBack }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'enquiries' | 'lectures' | 'codes' | 'media' | 'students' | 'banner' | 'stats' | 'sql'>('enquiries');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Data States
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [lectures, setLectures] = useState<any[]>([]);
  const [codes, setCodes] = useState<any[]>([]);
  const [media, setMedia] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  
  // Table Status Health Checks
  const [tableHealth, setTableHealth] = useState({
    inquiries: false,
    lectures: false,
    codes: false,
    media: false,
    profiles: false,
  });

  // Search & Filter States
  const [searchInquiry, setSearchInquiry] = useState('');
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState('all');
  const [searchLecture, setSearchLecture] = useState('');
  const [lectureSubjectFilter, setLectureSubjectFilter] = useState('all');
  const [searchCode, setSearchCode] = useState('');
  const [searchStudent, setSearchStudent] = useState('');

  // Forms
  const [lectureForm, setLectureForm] = useState({ 
    title: '', 
    subject: 'Physics', 
    grade_level: 'Class 10', 
    video_url: '', 
    duration: '', 
    is_free_preview: false 
  });
  
  const [codeForm, setCodeForm] = useState({ 
    code: '', 
    max_uses: 1, 
    description: '' 
  });
  
  const [mediaForm, setMediaForm] = useState({ 
    type: 'gallery_photo', 
    url: '', 
    embed_code: '' 
  });

  const [bannerForm, setBannerForm] = useState({
    message: '🔥 Admissions Open for Batch 2026-27 | Classes 5 to 12 CBSE & ICSE',
    badge: 'ADMISSIONS 2026',
    linkText: 'Book Free Demo',
    linkUrl: '#contact',
    theme: 'coral' as 'coral' | 'cyan' | 'emerald' | 'gold',
    is_active: true
  });

  const isAdmin = user?.email === 'admin@peerlessacademy.com' || user?.email === 'shubranilsaha7@gmail.com' || user?.email === 'xprasenjit1992@gmail.com';

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  useEffect(() => {
    if (isAdmin) {
      fetchAllData();
    }
  }, [isAdmin]);

  const fetchAllData = async () => {
    setLoading(true);
    let health = { inquiries: false, lectures: false, codes: false, media: false, profiles: false };

    try {
      // 1. Inquiries
      const { data: inq, error: inqErr } = await (supabase as any)
        .from('contact_inquiries')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!inqErr) {
        setInquiries(inq || []);
        health.inquiries = true;
      }

      // 2. Lectures
      const { data: lecs, error: lecsErr } = await (supabase as any)
        .from('lectures')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!lecsErr) {
        setLectures(lecs || []);
        health.lectures = true;
      }

      // 3. Codes
      const { data: cds, error: cdsErr } = await (supabase as any)
        .from('access_codes')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!cdsErr) {
        setCodes(cds || []);
        health.codes = true;
      }

      // 4. Media
      const { data: mda, error: mdaErr } = await (supabase as any)
        .from('site_media')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!mdaErr && mda) {
        setMedia(mda);
        health.media = true;

        const activeBanner = mda.find((m: any) => m.type === 'announcement_banner');
        if (activeBanner) {
          try {
            const parsed = JSON.parse(activeBanner.embed_code || '{}');
            setBannerForm({
              message: parsed.message || activeBanner.url || '',
              badge: parsed.badge || 'NOTICE',
              linkText: parsed.linkText || 'Learn More',
              linkUrl: parsed.linkUrl || activeBanner.url || '',
              theme: parsed.theme || 'coral',
              is_active: activeBanner.is_active ?? true
            });
          } catch {
            setBannerForm(prev => ({
              ...prev,
              message: activeBanner.url || prev.message,
              is_active: activeBanner.is_active ?? true
            }));
          }
        }
      }

      // 5. Students (Profiles)
      const { data: profs, error: profsErr } = await (supabase as any)
        .from('profiles')
        .select('*')
        .order('xp', { ascending: false });
      
      if (!profsErr) {
        setStudents(profs || []);
        health.profiles = true;
      }

      setTableHealth(health);

    } catch (err: any) {
      console.error('Error fetching admin data:', err);
      showToast('Error syncing records. Check database connection.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ── INQUIRIES ACTIONS ──
  const handleUpdateInquiryStatus = async (inquiryId: string, newStatus: string) => {
    setActionLoading(true);
    try {
      const { error } = await (supabase as any)
        .from('contact_inquiries')
        .update({ status: newStatus })
        .eq('id', inquiryId);
      
      if (error) throw error;
      setInquiries(prev => prev.map(inq => inq.id === inquiryId ? { ...inq, status: newStatus } : inq));
      showToast(`Status updated to "${newStatus}".`, 'success');
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to update status. Run the Master SQL setup if column is missing.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this enquiry lead?')) return;
    setActionLoading(true);
    try {
      const { error } = await (supabase as any).from('contact_inquiries').delete().eq('id', id);
      if (error) throw error;
      setInquiries(prev => prev.filter(inq => inq.id !== id));
      showToast('Enquiry deleted successfully.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete enquiry.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const exportInquiriesCSV = () => {
    if (inquiries.length === 0) {
      showToast('No enquiries to export.', 'info');
      return;
    }
    const headers = ['Student Name', 'Guardian Name', 'Phone', 'Class', 'Status', 'Message', 'Date Submitted'];
    const rows = inquiries.map(i => [
      `"${i.student_name || ''}"`,
      `"${i.guardian_name || ''}"`,
      `"${i.phone || ''}"`,
      `"${i.class_level || ''}"`,
      `"${i.status || 'pending'}"`,
      `"${(i.message || '').replace(/"/g, '""')}"`,
      `"${new Date(i.created_at).toLocaleString()}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Peerless_Academy_Enquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Enquiries exported to CSV successfully!', 'success');
  };

  // ── LECTURE ACTIONS ──
  const handleAddLecture = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const { error } = await (supabase as any).from('lectures').insert([lectureForm]);
      if (error) throw error;
      setLectureForm({ title: '', subject: 'Physics', grade_level: 'Class 10', video_url: '', duration: '', is_free_preview: false });
      fetchAllData();
      showToast('Lecture uploaded successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to add lecture. Check database RLS permissions.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteLecture = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lecture?')) return;
    setActionLoading(true);
    try {
      const { error } = await (supabase as any).from('lectures').delete().eq('id', id);
      if (error) throw error;
      setLectures(prev => prev.filter(l => l.id !== id));
      showToast('Lecture deleted.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete lecture.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const toggleLecturePreview = async (id: string, currentVal: boolean) => {
    setActionLoading(true);
    try {
      const { error } = await (supabase as any).from('lectures').update({ is_free_preview: !currentVal }).eq('id', id);
      if (error) throw error;
      setLectures(prev => prev.map(l => l.id === id ? { ...l, is_free_preview: !currentVal } : l));
      showToast(`Lecture marked as ${!currentVal ? 'Free Preview' : 'Locked'}.`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update lecture preview status.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // ── CODE ACTIONS ──
  const handleAddCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const { error } = await (supabase as any).from('access_codes').insert([codeForm]);
      if (error) throw error;
      setCodeForm({ code: '', max_uses: 1, description: '' });
      fetchAllData();
      showToast('Access code created!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to create code.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleGenerateBatchCodes = async (count = 5) => {
    setActionLoading(true);
    try {
      const batch = Array.from({ length: count }).map(() => {
        const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
        return {
          code: `PEER-${new Date().getFullYear()}-${rand}`,
          max_uses: 1,
          description: `Auto-generated Batch Code (${new Date().toLocaleDateString()})`,
          is_active: true
        };
      });
      const { error } = await (supabase as any).from('access_codes').insert(batch);
      if (error) throw error;
      fetchAllData();
      showToast(`Generated ${count} new access codes!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to generate batch codes.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const toggleCodeStatus = async (id: string, currentStatus: boolean) => {
    setActionLoading(true);
    try {
      const { error } = await (supabase as any).from('access_codes').update({ is_active: !currentStatus }).eq('id', id);
      if (error) throw error;
      setCodes(prev => prev.map(c => c.id === id ? { ...c, is_active: !currentStatus } : c));
      showToast(`Code is now ${!currentStatus ? 'Active' : 'Inactive'}.`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update code status.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCode = async (id: string) => {
    if (!confirm('Are you sure you want to delete this access code?')) return;
    setActionLoading(true);
    try {
      const { error } = await (supabase as any).from('access_codes').delete().eq('id', id);
      if (error) throw error;
      setCodes(prev => prev.filter(c => c.id !== id));
      showToast('Code deleted.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete code.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // ── MEDIA ACTIONS ──
  const handleAddMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const { error } = await (supabase as any).from('site_media').insert([mediaForm]);
      if (error) throw error;
      setMediaForm({ type: 'gallery_photo', url: '', embed_code: '' });
      fetchAllData();
      showToast('Media entry saved!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to add media.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteMedia = async (id: string) => {
    if (!confirm('Are you sure you want to delete this media item?')) return;
    setActionLoading(true);
    try {
      const { error } = await (supabase as any).from('site_media').delete().eq('id', id);
      if (error) throw error;
      setMedia(prev => prev.filter(m => m.id !== id));
      showToast('Media item removed.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete media.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // ── BANNER ACTIONS ──
  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const existing = media.find((m: any) => m.type === 'announcement_banner');
      const payload = {
        type: 'announcement_banner',
        url: bannerForm.linkUrl,
        embed_code: JSON.stringify({
          message: bannerForm.message,
          badge: bannerForm.badge,
          linkText: bannerForm.linkText,
          linkUrl: bannerForm.linkUrl,
          theme: bannerForm.theme
        }),
        is_active: bannerForm.is_active
      };

      if (existing) {
        const { error } = await (supabase as any).from('site_media').update(payload).eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await (supabase as any).from('site_media').insert([payload]);
        if (error) throw error;
      }
      fetchAllData();
      showToast('Broadcast banner updated across website!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to save announcement banner.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // ── STUDENT XP ACTIONS ──
  const handleAdjustStudentXp = async (studentId: string, amount: number) => {
    setActionLoading(true);
    try {
      const student = students.find(s => s.id === studentId);
      if (!student) return;
      const newXp = Math.max(0, (student.xp || 0) + amount);
      const newLevel = Math.max(1, Math.floor(newXp / 1000) + 1);

      const { error } = await (supabase as any)
        .from('profiles')
        .update({ xp: newXp, level: newLevel })
        .eq('id', studentId);

      if (error) throw error;

      setStudents(prev => prev.map(s => s.id === studentId ? { ...s, xp: newXp, level: newLevel } : s));
      showToast(`Updated ${student.full_name || 'student'}'s XP to ${newXp} (Level ${newLevel})!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to adjust student XP. Run Master SQL to grant profile update permission.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-center text-white">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-400">
          <Shield size={32} />
        </div>
        <h2 className="text-2xl font-black text-rose-500 sm:text-3xl">Admin Clearance Required</h2>
        <p className="mt-2 max-w-md text-sm text-slate-400">
          Your account (<span className="font-mono text-slate-300">{user?.email || 'Guest'}</span>) does not have owner credentials.
        </p>
        <button 
          onClick={onBack} 
          className="mt-6 flex items-center gap-2 rounded-xl bg-slate-800 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-700"
        >
          <ArrowLeft size={16} /> Return to Homepage
        </button>
      </div>
    );
  }

  // Filtered queries
  const filteredInquiries = inquiries.filter(inq => {
    const matchesSearch = 
      (inq.student_name?.toLowerCase() || '').includes(searchInquiry.toLowerCase()) ||
      (inq.phone || '').includes(searchInquiry) ||
      (inq.class_level?.toLowerCase() || '').includes(searchInquiry.toLowerCase()) ||
      (inq.guardian_name?.toLowerCase() || '').includes(searchInquiry.toLowerCase());
    
    const matchesStatus = inquiryStatusFilter === 'all' || (inq.status || 'pending') === inquiryStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredLectures = lectures.filter(lec => {
    const matchesSearch = (lec.title?.toLowerCase() || '').includes(searchLecture.toLowerCase());
    const matchesSubject = lectureSubjectFilter === 'all' || lec.subject === lectureSubjectFilter;
    return matchesSearch && matchesSubject;
  });

  const filteredCodes = codes.filter(c => 
    (c.code?.toLowerCase() || '').includes(searchCode.toLowerCase()) ||
    (c.description?.toLowerCase() || '').includes(searchCode.toLowerCase())
  );

  const filteredStudents = students.filter(s =>
    (s.full_name?.toLowerCase() || '').includes(searchStudent.toLowerCase()) ||
    (s.username?.toLowerCase() || '').includes(searchStudent.toLowerCase()) ||
    (s.id || '').includes(searchStudent)
  );

  const totalPlatformXp = students.reduce((sum, s) => sum + (s.xp || 0), 0);
  const isAnyTableMissing = !tableHealth.inquiries || !tableHealth.lectures || !tableHealth.codes || !tableHealth.media || !tableHealth.profiles;

  const masterSqlString = `-- 1. Contact Inquiries
CREATE TABLE IF NOT EXISTS public.contact_inquiries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name text NOT NULL,
  guardian_name text NOT NULL,
  phone text NOT NULL,
  class_level text NOT NULL,
  message text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.contact_inquiries ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending';
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public inserts" ON public.contact_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow auth all inquiries" ON public.contact_inquiries FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 2. Lectures
CREATE TABLE IF NOT EXISTS public.lectures (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  subject text NOT NULL,
  grade_level text NOT NULL,
  video_url text NOT NULL,
  duration text,
  is_free_preview boolean DEFAULT false,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.lectures ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public free lectures" ON public.lectures FOR SELECT USING (is_free_preview = true);
CREATE POLICY "Allow auth all lectures" ON public.lectures FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 3. Access Codes & User Access
CREATE TABLE IF NOT EXISTS public.access_codes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  code text UNIQUE NOT NULL,
  description text,
  max_uses integer DEFAULT 1,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE TABLE IF NOT EXISTS public.user_access (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  code_id uuid REFERENCES public.access_codes(id) ON DELETE CASCADE NOT NULL,
  redeemed_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, code_id)
);
ALTER TABLE public.access_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_access ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow auth all access_codes" ON public.access_codes FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow auth all user_access" ON public.user_access FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 4. Site Media
CREATE TABLE IF NOT EXISTS public.site_media (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  type text NOT NULL,
  url text,
  embed_code text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.site_media ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read site_media" ON public.site_media FOR SELECT USING (true);
CREATE POLICY "Allow auth all site_media" ON public.site_media FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 5. Profiles (XP Granter)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow auth update profiles" ON public.profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-6 right-6 z-[9999] flex items-center gap-3 rounded-2xl border px-5 py-3.5 text-sm font-bold text-white shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-4 ${
          toastMessage.type === 'error' ? 'border-rose-500/50 bg-rose-950/90 text-rose-200' :
          toastMessage.type === 'info' ? 'border-cyan-500/50 bg-cyan-950/90 text-cyan-200' :
          'border-emerald-500/50 bg-slate-900/95 text-white'
        }`}>
          {toastMessage.type === 'error' ? <AlertCircle size={18} className="text-rose-400" /> : <Sparkles size={18} className="text-emerald-400" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Admin Navbar */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          
          <div className="flex items-center gap-3">
            <button 
              onClick={onBack} 
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-slate-400 transition hover:bg-white/10 hover:text-white"
              title="Exit Admin"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                <h1 className="text-base font-black text-white sm:text-lg">Peerless Control Center</h1>
                <span className="hidden sm:inline-block rounded-md bg-indigo-500/20 px-2 py-0.5 text-[10px] font-black uppercase text-indigo-300 border border-indigo-500/30">Live Sync</span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono hidden sm:block">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={fetchAllData} 
              disabled={loading || actionLoading}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
            >
              <RefreshCcw size={14} className={loading ? 'animate-spin text-indigo-400' : ''} />
              <span className="hidden sm:inline">Refresh Data</span>
            </button>
            <button 
              onClick={onBack} 
              className="rounded-xl bg-orange-500/15 border border-orange-500/30 px-3.5 py-2 text-xs font-bold text-orange-400 transition hover:bg-orange-500 hover:text-white"
            >
              View Site
            </button>
          </div>

        </div>

        {/* Tab Strip */}
        <div className="mx-auto flex max-w-7xl overflow-x-auto px-4 pb-2 pt-1 gap-2 sm:px-6 lg:px-8 no-scrollbar">
          {[
            { id: 'enquiries', label: 'Enquiries & CRM', icon: MessageSquare, badge: inquiries.length },
            { id: 'lectures', label: 'Lectures Hub', icon: Video, badge: lectures.length },
            { id: 'codes', label: 'Access Codes', icon: Key, badge: codes.length },
            { id: 'media', label: 'Media & Gallery', icon: ImageIcon, badge: media.length },
            { id: 'students', label: 'Student Manager', icon: Users, badge: students.length },
            { id: 'banner', label: 'Announcement Banner', icon: Megaphone },
            { id: 'stats', label: 'Analytics & Health', icon: BarChart3 },
            { id: 'sql', label: 'Database Setup SQL', icon: Database },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black whitespace-nowrap transition ${
                activeTab === tab.id 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                  : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <tab.icon size={15} />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className={`rounded-full px-2 py-0.2 text-[10px] ${
                  activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-500'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </header>

      {/* Main Panel Content */}
      <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">

        {/* ── 1. ENQUIRIES & CRM ── */}
        {activeTab === 'enquiries' && (
          <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                  Student Enquiries & Leads
                </h2>
                <p className="text-xs text-slate-400">Direct booking submissions from the homepage contact form.</p>
              </div>
              <button
                onClick={exportInquiriesCSV}
                className="flex w-fit items-center gap-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 px-4 py-2 text-xs font-bold text-emerald-400 transition hover:bg-emerald-500 hover:text-white"
              >
                <Download size={14} /> Export CSV / Excel
              </button>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input
                  type="text"
                  placeholder="Search by student, guardian, phone, class..."
                  value={searchInquiry}
                  onChange={e => setSearchInquiry(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 py-2.5 pl-9 pr-4 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <select
                value={inquiryStatusFilter}
                onChange={e => setInquiryStatusFilter(e.target.value)}
                className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2.5 text-xs text-white focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="pending">⏳ Pending / New</option>
                <option value="contacted">📞 Contacted</option>
                <option value="enrolled">🎉 Enrolled</option>
                <option value="closed">❌ Closed</option>
              </select>
            </div>

            {/* Inquiries Table */}
            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-900/80 shadow-2xl">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-white/10 bg-slate-950/60 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-5 py-3.5">Student & Guardian</th>
                    <th className="px-5 py-3.5">Phone & Quick Actions</th>
                    <th className="px-5 py-3.5">Class / Board</th>
                    <th className="px-5 py-3.5">Status Tracking</th>
                    <th className="px-5 py-3.5">Date</th>
                    <th className="px-5 py-3.5 text-right">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredInquiries.map((inq) => {
                    const cleanPhone = (inq.phone || '').replace(/\D/g, '');
                    const waLink = `https://wa.me/91${cleanPhone.slice(-10)}?text=${encodeURIComponent(
                      `Hello ${inq.student_name || 'Student'}, this is Peerless Academy Agartala. We received your demo class inquiry! How can we assist you today?`
                    )}`;
                    const callLink = `tel:${inq.phone}`;

                    return (
                      <tr key={inq.id} className="transition hover:bg-white/[0.02]">
                        <td className="px-5 py-4">
                          <div className="font-bold text-white text-sm">{inq.student_name || 'Anonymous Student'}</div>
                          <div className="text-slate-400 text-[11px] mt-0.5">Guardian: {inq.guardian_name || 'N/A'}</div>
                          {inq.message && (
                            <p className="mt-1 max-w-xs text-[10px] text-slate-500 italic truncate">"{inq.message}"</p>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-mono text-slate-300 font-bold mb-2">{inq.phone || 'No phone'}</div>
                          <div className="flex items-center gap-1.5">
                            <a
                              href={waLink}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1 rounded-lg bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-1 text-[11px] font-bold text-emerald-400 transition hover:bg-emerald-500 hover:text-white"
                            >
                              <Send size={11} /> WhatsApp
                            </a>
                            <a
                              href={callLink}
                              className="flex items-center gap-1 rounded-lg bg-indigo-500/20 border border-indigo-500/30 px-2.5 py-1 text-[11px] font-bold text-indigo-400 transition hover:bg-indigo-500 hover:text-white"
                            >
                              <Phone size={11} /> Call
                            </a>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="rounded-lg bg-indigo-500/15 border border-indigo-500/30 px-2.5 py-1 font-bold text-indigo-300">
                            {inq.class_level || 'General'}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <select
                            value={inq.status || 'pending'}
                            onChange={e => handleUpdateInquiryStatus(inq.id, e.target.value)}
                            disabled={actionLoading}
                            className="rounded-lg border border-white/10 bg-slate-950 px-2.5 py-1 text-xs font-bold text-white focus:outline-none disabled:opacity-50"
                          >
                            <option value="pending">⏳ Pending</option>
                            <option value="contacted">📞 Contacted</option>
                            <option value="enrolled">🎉 Enrolled</option>
                            <option value="closed">❌ Closed</option>
                          </select>
                        </td>
                        <td className="px-5 py-4 text-slate-400 font-mono">
                          {new Date(inq.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={() => handleDeleteInquiry(inq.id)}
                            disabled={actionLoading}
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-rose-500/10 hover:text-rose-400 disabled:opacity-50"
                            title="Delete Lead"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredInquiries.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-5 py-12 text-center text-slate-500">
                        No enquiries found. Submissions from the contact form will appear here live.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── 2. LECTURES HUB MANAGER ── */}
        {activeTab === 'lectures' && (
          <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
            
            {/* Form */}
            <div className="rounded-2xl border border-white/10 bg-slate-900 p-6 h-fit shadow-xl">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-black text-white">
                <Video size={18} className="text-emerald-400" /> Upload Lecture Video
              </h3>
              <form onSubmit={handleAddLecture} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Lecture Title</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Electromagnetism: Biot-Savart Law"
                    value={lectureForm.title}
                    onChange={e => setLectureForm({ ...lectureForm, title: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Subject</label>
                    <select
                      value={lectureForm.subject}
                      onChange={e => setLectureForm({ ...lectureForm, subject: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none"
                    >
                      <option>Physics</option>
                      <option>Chemistry</option>
                      <option>Biology</option>
                      <option>Math</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Class Grade</label>
                    <select
                      value={lectureForm.grade_level}
                      onChange={e => setLectureForm({ ...lectureForm, grade_level: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none"
                    >
                      <option>Class 9</option>
                      <option>Class 10</option>
                      <option>Class 11</option>
                      <option>Class 12</option>
                      <option>Dropper / Target</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Video Stream URL</label>
                  <input
                    required
                    type="url"
                    placeholder="YouTube embed / Vimeo / Direct URL"
                    value={lectureForm.video_url}
                    onChange={e => setLectureForm({ ...lectureForm, video_url: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 52 min"
                    value={lectureForm.duration}
                    onChange={e => setLectureForm({ ...lectureForm, duration: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-950 p-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={lectureForm.is_free_preview}
                    onChange={e => setLectureForm({ ...lectureForm, is_free_preview: e.target.checked })}
                    className="h-4 w-4 rounded accent-emerald-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-white">Make Free Preview</span>
                    <p className="text-[10px] text-slate-400">Unlocked for all students without requiring an access code.</p>
                  </div>
                </label>

                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-xs font-black text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 disabled:opacity-50"
                >
                  <Plus size={16} /> Add to Curriculum Hub
                </button>
              </form>
            </div>

            {/* List */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="text-lg font-black text-white">Active Lectures ({filteredLectures.length})</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Filter title..."
                    value={searchLecture}
                    onChange={e => setSearchLecture(e.target.value)}
                    className="rounded-xl border border-white/10 bg-slate-900 px-3 py-1.5 text-xs text-white focus:outline-none"
                  />
                  <select
                    value={lectureSubjectFilter}
                    onChange={e => setLectureSubjectFilter(e.target.value)}
                    className="rounded-xl border border-white/10 bg-slate-900 px-3 py-1.5 text-xs text-white focus:outline-none"
                  >
                    <option value="all">All Subjects</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="Math">Math</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                {filteredLectures.map(lec => (
                  <div key={lec.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-white/10 bg-slate-900 p-4 transition hover:border-white/20">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-[10px] font-black uppercase text-indigo-300 border border-indigo-500/30">
                          {lec.subject}
                        </span>
                        <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-300">
                          {lec.grade_level}
                        </span>
                        {lec.duration && (
                          <span className="text-[10px] text-slate-500 font-mono">⏱️ {lec.duration}</span>
                        )}
                      </div>
                      <h4 className="font-bold text-white text-sm truncate">{lec.title}</h4>
                      <p className="text-xs font-mono text-slate-500 truncate mt-0.5">{lec.video_url}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleLecturePreview(lec.id, lec.is_free_preview)}
                        disabled={actionLoading}
                        className={`rounded-lg px-2.5 py-1 text-xs font-bold border transition ${
                          lec.is_free_preview 
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20' 
                            : 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20'
                        }`}
                      >
                        {lec.is_free_preview ? '🔓 Free' : '🔒 Locked'}
                      </button>
                      <button
                        onClick={() => handleDeleteLecture(lec.id)}
                        disabled={actionLoading}
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-rose-500/10 hover:text-rose-400"
                        title="Delete Lecture"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                {filteredLectures.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center text-slate-500 text-xs">
                    No lectures found. Use the upload panel to add one.
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* ── 3. ACCESS CODES GENERATOR ── */}
        {activeTab === 'codes' && (
          <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
            
            {/* Form */}
            <div className="rounded-2xl border border-white/10 bg-slate-900 p-6 h-fit shadow-xl space-y-6">
              <div>
                <h3 className="mb-4 flex items-center gap-2 text-lg font-black text-white">
                  <Key size={18} className="text-purple-400" /> Create Access Token
                </h3>
                <form onSubmit={handleAddCode} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Code String</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. PEER-2026-SUMMER"
                      value={codeForm.code}
                      onChange={e => setCodeForm({ ...codeForm, code: e.target.value.toUpperCase() })}
                      className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-xs text-white uppercase font-mono tracking-widest focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Description</label>
                    <input
                      type="text"
                      placeholder="e.g. For Batch A students"
                      value={codeForm.description}
                      onChange={e => setCodeForm({ ...codeForm, description: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Max Redemptions</label>
                    <input
                      required
                      type="number"
                      min={1}
                      value={codeForm.max_uses}
                      onChange={e => setCodeForm({ ...codeForm, max_uses: parseInt(e.target.value) || 1 })}
                      className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:outline-none font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 py-3 text-xs font-black text-white shadow-lg shadow-purple-600/30 transition hover:bg-purple-500 disabled:opacity-50"
                  >
                    <Plus size={16} /> Generate Token
                  </button>
                </form>
              </div>

              <div className="border-t border-white/10 pt-4">
                <button
                  onClick={() => handleGenerateBatchCodes(5)}
                  disabled={actionLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-purple-500/30 bg-purple-500/10 py-2.5 text-xs font-bold text-purple-300 transition hover:bg-purple-500/20 disabled:opacity-50"
                >
                  <Sparkles size={14} /> Quick Batch: 5 Random Codes
                </button>
              </div>
            </div>

            {/* List */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="text-lg font-black text-white">Issued Tokens ({filteredCodes.length})</h3>
                <input
                  type="text"
                  placeholder="Search code token..."
                  value={searchCode}
                  onChange={e => setSearchCode(e.target.value)}
                  className="rounded-xl border border-white/10 bg-slate-900 px-3 py-1.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="space-y-3">
                {filteredCodes.map(code => (
                  <div key={code.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-slate-900 p-4 transition hover:border-white/20">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-black tracking-wider text-white">
                          {code.code}
                        </span>
                        <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                          code.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
                        }`}>
                          {code.is_active ? 'Active' : 'Disabled'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{code.description || 'General enrollment token'}</p>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                        Allowed Uses: {code.max_uses} • Created: {new Date(code.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleCodeStatus(code.id, code.is_active)}
                        disabled={actionLoading}
                        className={`rounded-lg p-2 transition ${
                          code.is_active ? 'text-emerald-400 hover:bg-emerald-400/10' : 'text-slate-500 hover:bg-slate-800'
                        }`}
                        title={code.is_active ? 'Disable Code' : 'Enable Code'}
                      >
                        {code.is_active ? <CheckCircle size={20} /> : <XCircle size={20} />}
                      </button>
                      <button
                        onClick={() => handleDeleteCode(code.id)}
                        disabled={actionLoading}
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-rose-500/10 hover:text-rose-400"
                        title="Delete Code"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ── 4. MEDIA & GALLERY MANAGER ── */}
        {activeTab === 'media' && (
          <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
            
            {/* Form */}
            <div className="rounded-2xl border border-white/10 bg-slate-900 p-6 h-fit shadow-xl">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-black text-white">
                <ImageIcon size={18} className="text-pink-400" /> Add Site Media
              </h3>
              <form onSubmit={handleAddMedia} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Media Category</label>
                  <select
                    value={mediaForm.type}
                    onChange={e => setMediaForm({ ...mediaForm, type: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:outline-none"
                  >
                    <option value="gallery_photo">Life at Peerless (Gallery Photo)</option>
                    <option value="startup_video">Startup Intro Splash Video (.mp4)</option>
                    <option value="instagram_embed">Instagram Embed Code</option>
                  </select>
                </div>

                {mediaForm.type === 'instagram_embed' ? (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Paste HTML Embed</label>
                    <textarea
                      required
                      placeholder="Paste <iframe> or embed widget snippet here..."
                      value={mediaForm.embed_code}
                      onChange={e => setMediaForm({ ...mediaForm, embed_code: e.target.value })}
                      className="w-full h-32 rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs text-white font-mono focus:border-pink-500 focus:outline-none"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Direct Media Link (URL)</label>
                    <input
                      required
                      type="url"
                      placeholder="https://... (.jpg, .png, .mp4)"
                      value={mediaForm.url}
                      onChange={e => setMediaForm({ ...mediaForm, url: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-xs text-white font-mono focus:border-pink-500 focus:outline-none"
                    />
                  </div>
                )}

                {/* Preview Box */}
                {mediaForm.type === 'gallery_photo' && mediaForm.url && (
                  <div className="rounded-xl border border-white/10 bg-slate-950 p-2 text-center">
                    <p className="text-[10px] text-slate-500 mb-1">Live Image Preview:</p>
                    <img 
                      src={mediaForm.url} 
                      alt="Preview" 
                      className="h-32 w-full rounded-lg object-cover mx-auto" 
                      onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-pink-500 py-3 text-xs font-black text-white shadow-lg shadow-pink-500/20 transition hover:bg-pink-400 disabled:opacity-50"
                >
                  <Plus size={16} /> Save Media
                </button>
              </form>
            </div>

            {/* List */}
            <div className="space-y-4">
              <h3 className="text-lg font-black text-white">Configured Media Items ({media.length})</h3>
              
              <div className="space-y-3">
                {media.map(item => (
                  <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-slate-900 p-4 transition hover:border-white/20">
                    <div className="flex items-center gap-3 min-w-0">
                      {item.type === 'gallery_photo' && item.url && (
                        <img 
                          src={item.url} 
                          alt="Gallery" 
                          className="h-12 w-12 rounded-lg object-cover flex-shrink-0 border border-white/10" 
                        />
                      )}
                      <div className="min-w-0">
                        <span className="rounded bg-pink-500/15 border border-pink-500/30 px-2 py-0.5 text-[10px] font-black uppercase text-pink-300">
                          {item.type.replace('_', ' ')}
                        </span>
                        <p className="text-xs font-mono text-slate-400 truncate mt-1 max-w-md">
                          {item.type === 'instagram_embed' ? item.embed_code?.slice(0, 50) + '...' : item.url}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteMedia(item.id)}
                      disabled={actionLoading}
                      className="rounded-lg p-2 text-slate-500 transition hover:bg-rose-500/10 hover:text-rose-400"
                      title="Delete Media"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}

                {media.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center text-slate-500 text-xs">
                    No custom media configured. Add photos or intro videos using the form.
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* ── 5. STUDENT & XP MANAGER ── */}
        {activeTab === 'students' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-2xl font-black text-white">Student & Leaderboard Accounts</h2>
                <p className="text-xs text-slate-400">Manage student profiles, grant bonus XP, or adjust level rankings.</p>
              </div>
              <div className="relative max-w-xs w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchStudent}
                  onChange={e => setSearchStudent(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Students Table */}
            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-900/80 shadow-2xl">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-white/10 bg-slate-950/60 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-5 py-3.5">Student</th>
                    <th className="px-5 py-3.5">Current XP</th>
                    <th className="px-5 py-3.5">Rank Level</th>
                    <th className="px-5 py-3.5">Streak</th>
                    <th className="px-5 py-3.5 text-right">Quick XP Granter</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredStudents.map(student => (
                    <tr key={student.id} className="transition hover:bg-white/[0.02]">
                      <td className="px-5 py-4">
                        <div className="font-bold text-white text-sm">
                          {student.full_name || student.username || 'Peerless Scholar'}
                        </div>
                        <div className="text-slate-500 font-mono text-[10px] mt-0.5">{student.id}</div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 font-black text-amber-400 text-sm">
                          <Zap size={14} /> {student.xp || 0} XP
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="rounded-lg bg-cyan-500/15 border border-cyan-500/30 px-2.5 py-1 font-bold text-cyan-300">
                          Lv.{student.level || 1}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1 text-orange-400 font-bold">
                          <Flame size={14} /> {student.streak || 0} days
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleAdjustStudentXp(student.id, 100)}
                            disabled={actionLoading}
                            className="rounded-lg bg-amber-500/10 border border-amber-500/30 px-2 py-1 text-[11px] font-bold text-amber-300 transition hover:bg-amber-500 hover:text-black disabled:opacity-50"
                            title="Award +100 XP"
                          >
                            +100
                          </button>
                          <button
                            onClick={() => handleAdjustStudentXp(student.id, 500)}
                            disabled={actionLoading}
                            className="rounded-lg bg-amber-500/20 border border-amber-500/40 px-2.5 py-1 text-[11px] font-black text-amber-300 transition hover:bg-amber-500 hover:text-black disabled:opacity-50"
                            title="Award +500 XP"
                          >
                            +500
                          </button>
                          <button
                            onClick={() => handleAdjustStudentXp(student.id, -100)}
                            disabled={actionLoading}
                            className="rounded-lg bg-rose-500/10 border border-rose-500/30 px-2 py-1 text-[11px] font-bold text-rose-300 transition hover:bg-rose-500 hover:text-white disabled:opacity-50"
                            title="Deduct 100 XP"
                          >
                            -100
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredStudents.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-5 py-12 text-center text-slate-500">
                        No registered student profiles found yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── 6. BROADCAST BANNER CONTROLLER ── */}
        {activeTab === 'banner' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div>
              <h2 className="text-2xl font-black text-white flex items-center gap-2">
                <Megaphone size={24} className="text-orange-400" /> Global Website Announcement Bar
              </h2>
              <p className="text-xs text-slate-400">
                Display a prominent banner across the top of the entire website for admissions, holiday updates, or exam alerts.
              </p>
            </div>

            <form onSubmit={handleSaveBanner} className="rounded-2xl border border-white/10 bg-slate-900 p-6 space-y-4 shadow-xl">
              
              <label className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-950 p-3.5 cursor-pointer">
                <div>
                  <span className="text-sm font-bold text-white">Enable Announcement Bar</span>
                  <p className="text-[11px] text-slate-400">Toggles visibility for all visitors immediately.</p>
                </div>
                <input
                  type="checkbox"
                  checked={bannerForm.is_active}
                  onChange={e => setBannerForm({ ...bannerForm, is_active: e.target.checked })}
                  className="h-5 w-5 rounded accent-orange-500 cursor-pointer"
                />
              </label>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Banner Announcement Text</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Admissions Open for Batch 2026-27 | Classes 5 to 12"
                  value={bannerForm.message}
                  onChange={e => setBannerForm({ ...bannerForm, message: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Badge Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. ADMISSIONS 2026"
                    value={bannerForm.badge}
                    onChange={e => setBannerForm({ ...bannerForm, badge: e.target.value.toUpperCase() })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs text-white uppercase focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Color Theme</label>
                  <select
                    value={bannerForm.theme}
                    onChange={e => setBannerForm({ ...bannerForm, theme: e.target.value as any })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="coral">🔥 Coral Flame (Admissions)</option>
                    <option value="cyan">⚡ Cyber Blue (Exams)</option>
                    <option value="emerald">🛡️ Emerald Green (Notice)</option>
                    <option value="gold">👑 Golden Legend (Urgent)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Button Text</label>
                  <input
                    type="text"
                    placeholder="e.g. Book Free Demo"
                    value={bannerForm.linkText}
                    onChange={e => setBannerForm({ ...bannerForm, linkText: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Target Link</label>
                  <input
                    type="text"
                    placeholder="e.g. #contact or /lectures"
                    value={bannerForm.linkUrl}
                    onChange={e => setBannerForm({ ...bannerForm, linkUrl: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={actionLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 text-xs font-black text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 disabled:opacity-50"
              >
                <Check size={16} /> Deploy Banner to Website
              </button>
            </form>
          </div>
        )}

        {/* ── 7. ANALYTICS & HEALTH ── */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-white flex items-center gap-2">
                <BarChart3 size={24} className="text-indigo-400" /> Platform Telemetry & Health
              </h2>
              <p className="text-xs text-slate-400">Live operational data and system health metrics.</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
                <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Total Enquiries</div>
                <div className="text-3xl font-black text-white">{inquiries.length}</div>
                <div className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1 font-bold">
                  <CheckCircle size={12} /> Contact leads active
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
                <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Video Lectures</div>
                <div className="text-3xl font-black text-cyan-400">{lectures.length}</div>
                <div className="text-[11px] text-slate-500 mt-2 font-mono">
                  {lectures.filter(l => l.is_free_preview).length} free previews
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
                <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Access Tokens</div>
                <div className="text-3xl font-black text-purple-400">{codes.length}</div>
                <div className="text-[11px] text-slate-500 mt-2 font-mono">
                  {codes.filter(c => c.is_active).length} currently active
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
                <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Total Platform XP</div>
                <div className="text-3xl font-black text-amber-400">{totalPlatformXp.toLocaleString()}</div>
                <div className="text-[11px] text-amber-400/80 mt-2 flex items-center gap-1 font-bold">
                  <Zap size={12} /> Across {students.length} scholars
                </div>
              </div>

            </div>

            {/* System Health Check Grid */}
            <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
              <h3 className="text-base font-black text-white mb-4">Core Infrastructure Status</h3>
              
              <div className="grid sm:grid-cols-3 gap-4 text-xs font-mono">
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                  <div className="flex items-center justify-between font-bold text-emerald-400 mb-1">
                    <span>Supabase DB</span>
                    <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
                  </div>
                  <p className="text-slate-400 text-[11px]">Connected • RLS Active</p>
                </div>

                <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4">
                  <div className="flex items-center justify-between font-bold text-indigo-400 mb-1">
                    <span>Vercel Edge Functions</span>
                    <span className="flex h-2 w-2 rounded-full bg-indigo-400" />
                  </div>
                  <p className="text-slate-400 text-[11px]">Meta Cloud Webhook Ready</p>
                </div>

                <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">
                  <div className="flex items-center justify-between font-bold text-purple-400 mb-1">
                    <span>CBT Simulator Core</span>
                    <span className="flex h-2 w-2 rounded-full bg-purple-400" />
                  </div>
                  <p className="text-slate-400 text-[11px]">10,000+ Question Engine Live</p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ── 8. DATABASE SETUP SQL TAB ── */}
        {activeTab === 'sql' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                  <Database size={24} className="text-indigo-400" /> Master Database Configuration SQL
                </h2>
                <p className="text-xs text-slate-400">
                  Run this single SQL script in your Supabase SQL Editor to ensure all tables, columns, and write permissions are 100% active.
                </p>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(masterSqlString);
                  showToast('Master SQL copied to clipboard!', 'success');
                }}
                className="flex w-fit items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-black text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-500 active:scale-95"
              >
                <Copy size={15} /> Copy Full SQL
              </button>
            </div>

            {/* Table Health Check Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { name: 'contact_inquiries', label: 'Enquiries Table', active: tableHealth.inquiries },
                { name: 'lectures', label: 'Lectures Table', active: tableHealth.lectures },
                { name: 'access_codes', label: 'Codes Table', active: tableHealth.codes },
                { name: 'site_media', label: 'Site Media Table', active: tableHealth.media },
                { name: 'profiles', label: 'Profiles Table', active: tableHealth.profiles },
              ].map(item => (
                <div key={item.name} className={`rounded-xl border p-3 text-center transition ${
                  item.active ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
                }`}>
                  <div className="flex items-center justify-center gap-1 text-xs font-black mb-1">
                    {item.active ? <CheckCircle size={14} /> : <XCircle size={14} />}
                    <span>{item.active ? 'Ready' : 'Pending'}</span>
                  </div>
                  <p className="text-[10px] font-mono opacity-80 truncate">{item.label}</p>
                </div>
              ))}
            </div>

            {/* Code Block */}
            <div className="relative rounded-2xl border border-white/10 bg-slate-900 p-4 shadow-2xl">
              <pre className="text-[11px] font-mono text-slate-300 overflow-x-auto max-h-[400px] leading-relaxed select-all">
                {masterSqlString}
              </pre>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
