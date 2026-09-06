import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PlayCircle, CheckCircle, Clock, ChevronLeft, BookOpen, AlertCircle, Lock, Unlock, Brain } from 'lucide-react';

const MASTERY_TARGET_HRS = 65;

export default function VideoLectures({ onBack, addToast }) {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [activeVideo, setActiveVideo] = useState(null);
  const [activeSubject, setActiveSubject] = useState('Physics');
  const [completedIds, setCompletedIds] = useState(new Set());
  
  // Access Code State
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [codeError, setCodeError] = useState('');
  const [hasAccess, setHasAccess] = useState(false); // Does the user have global access?
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkUserAndAccess();
    fetchLectures();
  }, []);

  const checkUserAndAccess = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUser(session.user);
      // Check if user has redeemed any code in user_access table
      const { data } = await supabase
        .from('user_access')
        .select('*')
        .eq('user_id', session.user.id)
        .limit(1);
      
      if (data && data.length > 0) {
        setHasAccess(true);
      }
    }
  };

  const fetchLectures = async () => {
    try {
      // Query the new lectures table
      const { data, error } = await supabase
        .from('lectures')
        .select('*')
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      setLectures(data || []);
      if (data && data.length > 0) {
        // Set first free video as active default
        const freeVid = data.find(l => l.is_free_preview) || data[0];
        setActiveVideo(freeVid);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load lectures.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!user) {
      setCodeError('You must be logged in to redeem a code.');
      return;
    }
    
    setVerifying(true);
    setCodeError('');
    
    try {
      // Find code
      const { data: codeData, error: codeErr } = await supabase
        .from('access_codes')
        .select('*')
        .eq('code', accessCode.trim())
        .eq('is_active', true)
        .single();
        
      if (codeErr || !codeData) {
        throw new Error('Invalid or expired code.');
      }
      
      // Insert into user_access
      const { error: insertErr } = await supabase
        .from('user_access')
        .insert([{ user_id: user.id, code_id: codeData.id }]);
        
      if (insertErr) {
        // Check if already redeemed constraint error
        if (insertErr.code === '23505') {
           setHasAccess(true);
           setShowCodeModal(false);
           return;
        }
        throw new Error('Failed to redeem code.');
      }
      
      setHasAccess(true);
      setShowCodeModal(false);
      // Re-fetch lectures now that we have access (RLS might expose protected URLs now)
      fetchLectures();
      
    } catch (err) {
      setCodeError(err.message || 'Verification failed');
    } finally {
      setVerifying(false);
    }
  };

  const markCompleted = (id) => {
    setCompletedIds(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  // Group lectures by Subject -> Class (grade_level)
  const curriculum = useMemo(() => {
    const grouped = {};
    lectures.forEach(lec => {
      if (!grouped[lec.subject]) grouped[lec.subject] = {};
      if (!grouped[lec.subject][lec.grade_level]) grouped[lec.subject][lec.grade_level] = [];
      grouped[lec.subject][lec.grade_level].push(lec);
    });
    return grouped;
  }, [lectures]);

  // Convert youtube links to embed links safely
  const getEmbedUrl = (url) => {
    if (!url) return '';
    if (url.includes('youtube.com/watch?v=')) {
      return url.replace('watch?v=', 'embed/');
    }
    if (url.includes('youtu.be/')) {
      return url.replace('youtu.be/', 'youtube.com/embed/');
    }
    return url;
  };

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading curriculum...</div>;
  if (error) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-red-500"><AlertCircle className="mr-2"/> {error}</div>;

  const subjects = Object.keys(curriculum).length > 0 ? Object.keys(curriculum) : ['Physics', 'Chemistry', 'Biology', 'Math'];

  const canWatch = (lec) => lec.is_free_preview || hasAccess;

  const handleVideoSelect = (lec) => {
    if (canWatch(lec)) {
      setActiveVideo(lec);
    } else {
      setShowCodeModal(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col font-sans text-white">
      
      {/* Top Navbar */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 flex-shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-slate-400 hover:text-white transition flex items-center gap-1">
            <ChevronLeft size={20} /> Back
          </button>
          <div className="h-6 w-px bg-slate-800 mx-2" />
          <h1 className="text-lg font-black text-white flex items-center gap-2">
            <BookOpen size={18} className="text-cyan-400" /> Video Lectures
          </h1>
        </div>
        
        {/* Subject Tabs */}
        <div className="hidden md:flex gap-2">
          {subjects.map(sub => (
            <button
              key={sub}
              onClick={() => setActiveSubject(sub)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition ${activeSubject === sub ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-transparent text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
              {sub}
            </button>
          ))}
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        
        {/* Player Section */}
        <div className="flex-1 bg-black flex flex-col border-r border-slate-800 relative">
          <div className="flex-1 relative aspect-video md:aspect-auto">
            {activeVideo ? (
              canWatch(activeVideo) ? (
                <iframe
                  src={getEmbedUrl(activeVideo.video_url)}
                  title={activeVideo.title}
                  className="absolute inset-0 w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 border border-slate-800 p-8 text-center">
                  <div className="w-16 h-16 bg-rose-500/20 rounded-full flex items-center justify-center text-rose-500 mb-4">
                    <Lock size={32} />
                  </div>
                  <h3 className="text-2xl font-black mb-2">Lecture Locked</h3>
                  <p className="text-slate-400 mb-6 max-w-md">This lecture requires an active enrollment code to view.</p>
                  <button onClick={() => setShowCodeModal(true)} className="bg-rose-500 hover:bg-rose-600 px-6 py-3 rounded-full font-bold transition">
                    Enter Access Code
                  </button>
                </div>
              )
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-slate-500">Select a lecture to start watching</div>
            )}
          </div>
          
          {/* Active Video Meta */}
          {activeVideo && (
            <div className="p-6 bg-slate-900 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2 py-1 bg-cyan-500/10 text-cyan-400 text-xs font-black uppercase rounded">{activeVideo.subject}</span>
                  <span className="px-2 py-1 bg-slate-800 text-slate-300 text-xs font-black uppercase rounded">{activeVideo.grade_level}</span>
                  {activeVideo.is_free_preview && (
                     <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-black uppercase rounded">Free Preview</span>
                  )}
                </div>
                <h2 className="text-2xl font-black">{activeVideo.title}</h2>
                <p className="text-slate-400 mt-2 text-sm">{activeVideo.description || 'No description provided.'}</p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => {
                    if (addToast) addToast('AI Note Generation started! Notes will be emailed to you shortly.', 'success');
                    else alert('AI Note Generation started! Notes will be emailed to you shortly.');
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/40"
                >
                  <Brain size={18} />
                  AI Notes
                </button>
                <button
                  onClick={() => markCompleted(activeVideo.id)}
                  disabled={completedIds.has(activeVideo.id) || !canWatch(activeVideo)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition ${completedIds.has(activeVideo.id) ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-50'}`}
                >
                  <CheckCircle size={18} />
                  {completedIds.has(activeVideo.id) ? 'Completed' : 'Mark Complete'}
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Sidebar / Curriculum List */}
        <div className="w-full md:w-[400px] flex flex-col bg-slate-900 flex-shrink-0">
          <div className="p-5 border-b border-slate-800">
            <h3 className="font-black text-lg mb-1">Curriculum</h3>
            <p className="text-xs text-slate-400">Select a class to view lessons</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-6">
            {curriculum[activeSubject] && Object.keys(curriculum[activeSubject]).map((grade, gIdx) => (
              <div key={gIdx}>
                <h4 className="text-xs font-black uppercase text-slate-500 mb-3 px-2 border-b border-slate-800 pb-2">{grade}</h4>
                <div className="space-y-1">
                  {curriculum[activeSubject][grade].map((lec, idx) => {
                    const isLocked = !canWatch(lec);
                    const isActive = activeVideo?.id === lec.id;
                    const isCompleted = completedIds.has(lec.id);
                    
                    return (
                      <button
                        key={lec.id}
                        onClick={() => handleVideoSelect(lec)}
                        className={`w-full flex items-start gap-3 p-3 rounded-xl transition text-left ${isActive ? 'bg-slate-800 border-l-4 border-cyan-400' : 'hover:bg-slate-800/50 border-l-4 border-transparent'}`}
                      >
                        <div className={`mt-0.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`}>
                           {isLocked ? <Lock size={16} className="text-rose-400" /> : <PlayCircle size={16} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className={`text-sm font-bold truncate ${isActive ? 'text-white' : 'text-slate-300'}`}>
                            {idx + 1}. {lec.title}
                          </h5>
                          <div className="flex items-center gap-3 mt-1.5 text-[11px] font-medium text-slate-500">
                            {lec.duration && <span className="flex items-center gap-1"><Clock size={11} /> {lec.duration} min</span>}
                            {isCompleted && <span className="flex items-center gap-1 text-emerald-400"><CheckCircle size={11} /> Done</span>}
                            {lec.is_free_preview && <span className="text-emerald-400">Preview</span>}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            
            {!curriculum[activeSubject] && (
               <div className="p-4 text-sm text-slate-500 text-center">No lectures found for {activeSubject}.</div>
            )}
          </div>
        </div>
      </div>
      
      {/* Access Code Modal */}
      {showCodeModal && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
             <button onClick={() => setShowCodeModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
               <ChevronLeft className="rotate-180" />
             </button>
             <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center mb-5">
               <Unlock size={24} />
             </div>
             <h3 className="text-xl font-black mb-2">Unlock Full Access</h3>
             <p className="text-sm text-slate-400 mb-6">Enter your enrollment access code provided by Peerless Academy to view protected lectures.</p>
             
             <form onSubmit={handleVerifyCode} className="space-y-4">
               <div>
                 <input
                   type="text"
                   required
                   value={accessCode}
                   onChange={e => setAccessCode(e.target.value.toUpperCase())}
                   placeholder="e.g. PEER-2026-XYZ"
                   className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 uppercase tracking-widest font-mono"
                 />
                 {codeError && <p className="text-rose-400 text-xs mt-2">{codeError}</p>}
               </div>
               <button 
                 type="submit" 
                 disabled={verifying}
                 className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 rounded-xl transition disabled:opacity-50"
               >
                 {verifying ? 'Verifying...' : 'Redeem Code'}
               </button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}
