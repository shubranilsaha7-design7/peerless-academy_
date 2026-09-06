import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Settings, Maximize, PictureInPicture, Forward, Rewind, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';
import Latex from 'react-latex-next';
import { supabase } from '@/integrations/supabase/client';

interface PopUpQuiz {
  timeSeconds: number;
  questionLatex: string;
  options: string[];
  correctIndex: number;
}

const MOCK_QUIZ: PopUpQuiz[] = [
  {
    timeSeconds: 15,
    questionLatex: 'What is the integral of $x^2$?',
    options: ['$x^3/3$', '$2x$', '$x^2$', '$\\ln(x)$'],
    correctIndex: 0
  }
];

export default function AdvancedVideoPlayer({ onBack }: { onBack?: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [showControls, setShowControls] = useState(true);
  
  const [activeQuiz, setActiveQuiz] = useState<PopUpQuiz | null>(null);
  const [quizAnswered, setQuizAnswered] = useState<Record<number, boolean>>({});
  
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [title, setTitle] = useState('Loading Module...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideo();
    
    const channel = supabase
      .channel('public:course_modules')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'course_modules' }, (payload) => {
        fetchVideo();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchVideo = async () => {
    try {
      const { data, error } = await (supabase as any).from('course_modules')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
        
      if (data) {
        setVideoUrl(data.video_url);
        setTitle(data.title);
      } else {
        setVideoUrl('http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
        setTitle('Fallback Module');
      }
    } catch (e) {
      console.error(e);
      setVideoUrl('http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
      setTitle('Fallback Module');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let timeout: any;
    if (isPlaying && !activeQuiz) {
      timeout = setTimeout(() => setShowControls(false), 3000);
    }
    return () => clearTimeout(timeout);
  }, [isPlaying, showControls, activeQuiz]);

  const togglePlay = () => {
    if (activeQuiz) return;
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && !activeQuiz) {
      const current = videoRef.current.currentTime;
      setProgress((current / videoRef.current.duration) * 100);
      
      const quiz = MOCK_QUIZ.find(q => 
        Math.floor(current) === q.timeSeconds && 
        !quizAnswered[q.timeSeconds]
      );
      
      if (quiz) {
        videoRef.current.pause();
        setIsPlaying(false);
        setActiveQuiz(quiz);
      }
    }
  };

  const skip = (seconds: number) => {
    if (videoRef.current) videoRef.current.currentTime += seconds;
  };

  const handleQuizAnswer = (i: number) => {
    if (activeQuiz && i === activeQuiz.correctIndex) {
      setQuizAnswered(prev => ({ ...prev, [activeQuiz.timeSeconds]: true }));
      setActiveQuiz(null);
      if (videoRef.current) videoRef.current.play();
      setIsPlaying(true);
    }
  };

  // Smart URL parser
  const getEmbedType = (url: string) => {
    if (url.includes('youtube.com/watch') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('vimeo.com')) return 'vimeo';
    return 'native';
  };

  const getYoutubeEmbed = (url: string) => {
    let v = '';
    if (url.includes('youtube.com/watch')) {
      v = new URLSearchParams(url.split('?')[1]).get('v') || '';
    } else if (url.includes('youtu.be')) {
      v = url.split('youtu.be/')[1].split('?')[0];
    }
    return `https://www.youtube.com/embed/${v}?autoplay=0`;
  };

  if (loading || !videoUrl) {
    return <div className="h-full flex items-center justify-center bg-black text-cyan-500"><Loader2 className="animate-spin" /></div>;
  }

  const embedType = getEmbedType(videoUrl);

  return (
    <div className="flex flex-col h-[100dvh] bg-black text-white relative font-sans">
      <header className="absolute top-0 w-full z-50 p-4 bg-gradient-to-b from-black/80 to-transparent flex items-center gap-4">
        {onBack && (
          <button onClick={onBack} className="text-white hover:text-cyan-400">
            <ArrowLeft size={24} />
          </button>
        )}
        <div>
          <h1 className="font-black text-lg text-white">{title}</h1>
          <p className="text-xs text-cyan-400 font-bold uppercase tracking-widest">Live Batch</p>
        </div>
      </header>
      
      <div className="relative flex-1 bg-black overflow-hidden flex items-center justify-center"
           onMouseMove={() => setShowControls(true)}
           onTouchStart={() => setShowControls(true)}
           onClick={() => showControls ? setShowControls(false) : setShowControls(true)}>
           
        {embedType === 'youtube' ? (
          <iframe 
            src={getYoutubeEmbed(videoUrl)} 
            className="w-full h-full lg:w-4/5 lg:h-[80%] rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-slate-800"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : embedType === 'vimeo' ? (
          <iframe 
            src={videoUrl.replace('vimeo.com', 'player.vimeo.com/video')} 
            className="w-full h-full lg:w-4/5 lg:h-[80%] rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-slate-800"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full object-contain"
            onTimeUpdate={handleTimeUpdate}
            onClick={(e) => { e.stopPropagation(); togglePlay(); }}
            playsInline
          />
        )}

        {/* NATIVE CONTROLS OVERLAY (Only for MP4) */}
        {embedType === 'native' && (
          <AnimatePresence>
            {showControls && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Timeline */}
                <div className="w-full h-2 bg-white/20 rounded-full mb-6 cursor-pointer relative group">
                  <div className="absolute top-0 left-0 h-full bg-cyan-500 rounded-full" style={{ width: `${progress}%` }} />
                  <div className="absolute top-1/2 -mt-2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" style={{ left: `calc(${progress}% - 8px)` }} />
                </div>
                
                {/* Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <button onClick={() => skip(-10)} className="hover:text-cyan-400 transition"><Rewind size={24} fill="currentColor" /></button>
                    <button onClick={togglePlay} className="w-14 h-14 bg-cyan-500 rounded-full flex items-center justify-center text-black hover:scale-110 transition shadow-[0_0_20px_rgba(6,182,212,0.5)]">
                      {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
                    </button>
                    <button onClick={() => skip(10)} className="hover:text-cyan-400 transition"><Forward size={24} fill="currentColor" /></button>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <button onClick={() => {
                      const speeds = [1, 1.25, 1.5, 2, 2.5];
                      const next = speeds[(speeds.indexOf(speed) + 1) % speeds.length];
                      setSpeed(next);
                      if (videoRef.current) videoRef.current.playbackRate = next;
                    }} className="font-black text-sm hover:text-cyan-400 transition w-10 text-center">
                      {speed}x
                    </button>
                    <button onClick={() => videoRef.current?.requestPictureInPicture()} className="hover:text-cyan-400 transition hidden sm:block"><PictureInPicture size={24} /></button>
                    <button onClick={() => document.documentElement.requestFullscreen()} className="hover:text-cyan-400 transition"><Maximize size={24} /></button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* POP-UP QUIZ OVERLAY */}
        <AnimatePresence>
          {activeQuiz && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            >
              <div className="bg-slate-900 border border-slate-700 p-8 rounded-3xl max-w-md w-full shadow-2xl">
                <div className="flex items-center gap-2 text-rose-500 font-black uppercase tracking-widest text-xs mb-6">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" /> Pop-Up Challenge
                </div>
                <div className="text-xl mb-8 leading-relaxed"><Latex>{activeQuiz.questionLatex}</Latex></div>
                
                <div className="space-y-3">
                  {activeQuiz.options.map((opt, i) => (
                    <button 
                      key={i} 
                      onClick={() => handleQuizAnswer(i)}
                      className="w-full text-left p-4 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 transition flex items-center gap-3"
                    >
                      <div className="w-6 h-6 rounded-full border border-slate-600 flex items-center justify-center text-xs">{String.fromCharCode(65+i)}</div>
                      <Latex>{opt}</Latex>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
