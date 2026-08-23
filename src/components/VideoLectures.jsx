import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PlayCircle, CheckCircle, Clock, ChevronLeft, BookOpen, AlertCircle } from 'lucide-react';

const MASTERY_TARGET_HRS = 65;

export default function VideoLectures({ onBack }) {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);
  const [completedIds, setCompletedIds] = useState(new Set());
  const [activeSubject, setActiveSubject] = useState('Physics');

  useEffect(() => {
    fetchLectures();
  }, []);

  const fetchLectures = async () => {
    try {
      const { data, error } = await supabase
        .from('video_lectures')
        .select('*')
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      setLectures(data || []);
      if (data && data.length > 0) setActiveVideo(data[0]);
    } catch (err) {
      console.error(err);
      setError('Failed to load lectures.');
    } finally {
      setLoading(false);
    }
  };

  const markCompleted = (id) => {
    setCompletedIds(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  // Group lectures by Subject -> Chapter
  const curriculum = useMemo(() => {
    const grouped = {};
    lectures.forEach(lec => {
      if (!grouped[lec.subject]) grouped[lec.subject] = {};
      if (!grouped[lec.subject][lec.chapter]) grouped[lec.subject][lec.chapter] = [];
      grouped[lec.subject][lec.chapter].push(lec);
    });
    return grouped;
  }, [lectures]);

  // Calculate progress for active subject
  const subjectProgress = useMemo(() => {
    const subjectLectures = lectures.filter(l => l.subject === activeSubject);
    const completedDuration = subjectLectures
      .filter(l => completedIds.has(l.id))
      .reduce((sum, l) => sum + (l.duration || 0), 0);
    
    const completedHrs = (completedDuration / 60).toFixed(1);
    const pct = Math.min((completedHrs / MASTERY_TARGET_HRS) * 100, 100);
    return { completedHrs, pct };
  }, [lectures, completedIds, activeSubject]);

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

  const subjects = Object.keys(curriculum);

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col font-sans">
      
      {/* Top Navbar */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 flex-shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-slate-400 hover:text-white transition flex items-center gap-1">
            <ChevronLeft size={20} /> Back
          </button>
          <div className="h-6 w-px bg-slate-800 mx-2" />
          <h1 className="text-lg font-black text-white flex items-center gap-2">
            <BookOpen size={18} className="text-cyan-400" /> Video Lectures Hub
          </h1>
        </div>
        
        {/* Subject Tabs */}
        <div className="hidden md:flex bg-slate-950 rounded-xl p-1 border border-slate-800">
          {subjects.map(sub => (
            <button
              key={sub}
              onClick={() => { setActiveSubject(sub); setActiveVideo(curriculum[sub]?.[Object.keys(curriculum[sub])[0]]?.[0]); }}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${activeSubject === sub ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-500 hover:text-white'}`}
            >
              {sub}
            </button>
          ))}
        </div>
      </header>

      {/* Main Split Layout */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Pane: Video Player (70%) */}
        <div className="flex-1 bg-black flex flex-col overflow-y-auto">
          {activeVideo ? (
            <>
              <div className="w-full bg-black aspect-video relative flex-shrink-0 border-b border-slate-800">
                <iframe 
                  src={getEmbedUrl(activeVideo.video_url)} 
                  title={activeVideo.title}
                  className="absolute inset-0 w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="p-8 max-w-5xl mx-auto w-full">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-cyan-400 mb-3">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                      {activeVideo.subject} · {activeVideo.chapter}
                    </div>
                    <h2 className="text-3xl font-black text-white">{activeVideo.title}</h2>
                    <p className="text-slate-400 flex items-center gap-2 mt-2 text-sm">
                      <Clock size={16} /> Estimated Time: {activeVideo.duration} mins
                    </p>
                  </div>
                  
                  <button 
                    onClick={() => markCompleted(activeVideo.id)}
                    disabled={completedIds.has(activeVideo.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition ${completedIds.has(activeVideo.id) ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-cyan-500 hover:bg-cyan-600 text-slate-950'}`}
                  >
                    <CheckCircle size={18} />
                    {completedIds.has(activeVideo.id) ? 'Completed' : 'Mark as Completed'}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
              <PlayCircle size={64} className="mb-4 opacity-20" />
              <p>Select a lecture from the playlist to begin.</p>
            </div>
          )}
        </div>

        {/* Right Pane: Playlist (30%) */}
        <div className="w-96 bg-slate-900 border-l border-slate-800 flex flex-col flex-shrink-0">
          
          {/* Progress Tracker */}
          <div className="p-6 border-b border-slate-800 bg-slate-900/50">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">{activeSubject} Mastery Target</h3>
            <div className="flex justify-between text-sm font-bold text-white mb-2">
              <span>{subjectProgress.completedHrs} hrs</span>
              <span className="text-slate-500">{MASTERY_TARGET_HRS} hrs</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-1000"
                style={{ width: `${subjectProgress.pct}%` }}
              />
            </div>
          </div>

          {/* Chapters Accordion */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {curriculum[activeSubject] ? Object.entries(curriculum[activeSubject]).map(([chapter, videos]) => (
              <div key={chapter} className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
                <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 font-bold text-sm text-white">
                  {chapter}
                </div>
                <div className="divide-y divide-slate-800/50">
                  {videos.map(video => {
                    const isActive = activeVideo?.id === video.id;
                    const isDone = completedIds.has(video.id);
                    return (
                      <button
                        key={video.id}
                        onClick={() => setActiveVideo(video)}
                        className={`w-full flex items-start gap-3 p-4 text-left transition hover:bg-slate-900/50 ${isActive ? 'bg-cyan-500/5' : ''}`}
                      >
                        <div className={`mt-0.5 flex-shrink-0 ${isDone ? 'text-emerald-400' : isActive ? 'text-cyan-400' : 'text-slate-600'}`}>
                          {isDone ? <CheckCircle size={16} /> : <PlayCircle size={16} />}
                        </div>
                        <div>
                          <p className={`text-sm font-semibold leading-tight ${isActive ? 'text-cyan-300' : 'text-slate-300'}`}>
                            {video.title}
                          </p>
                          <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                            <Clock size={10} /> {video.duration}m
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )) : (
              <p className="text-center text-sm text-slate-500 mt-10">No lectures available for {activeSubject} yet.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
