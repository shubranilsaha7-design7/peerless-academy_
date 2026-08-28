import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Settings, Maximize, PictureInPicture, Forward, Rewind, CheckCircle2 } from 'lucide-react';
import Latex from 'react-latex-next';

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

export default function AdvancedVideoPlayer({ src = "https://www.w3schools.com/html/mov_bbb.mp4" }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [showControls, setShowControls] = useState(true);
  
  // Pop-up quiz state
  const [activeQuiz, setActiveQuiz] = useState<PopUpQuiz | null>(null);
  const [quizAnswered, setQuizAnswered] = useState<Record<number, boolean>>({});
  
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
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      setProgress((current / duration) * 100);

      // Check for pop-up quizzes
      const pendingQuiz = MOCK_QUIZ.find(q => 
        Math.abs(current - q.timeSeconds) < 0.5 && !quizAnswered[q.timeSeconds]
      );
      
      if (pendingQuiz) {
        videoRef.current.pause();
        setIsPlaying(false);
        setActiveQuiz(pendingQuiz);
        setShowControls(true);
      }
    }
  };

  const cycleSpeed = () => {
    const nextSpeed = speed >= 2.5 ? 0.5 : speed + 0.5;
    setSpeed(nextSpeed);
    if (videoRef.current) videoRef.current.playbackRate = nextSpeed;
  };

  const togglePiP = async () => {
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
    } else if (videoRef.current) {
      await videoRef.current.requestPictureInPicture();
    }
  };

  const toggleFullscreen = () => {
    const container = videoRef.current?.parentElement;
    if (!document.fullscreenElement && container) {
      container.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const skip = (seconds: number) => {
    if (videoRef.current) videoRef.current.currentTime += seconds;
  };

  const handleQuizAnswer = (idx: number) => {
    if (!activeQuiz) return;
    if (idx === activeQuiz.correctIndex) {
      setQuizAnswered(prev => ({ ...prev, [activeQuiz.timeSeconds]: true }));
      setActiveQuiz(null);
      if (videoRef.current) {
        videoRef.current.play();
        setIsPlaying(true);
      }
    } else {
      // Vibrate or flash red for incorrect
      if (navigator.vibrate) navigator.vibrate(200);
    }
  };

  return (
    <div 
      className="relative w-full max-w-4xl mx-auto rounded-3xl overflow-hidden bg-slate-950 group shadow-2xl shadow-cyan-500/10 border border-slate-800"
      onMouseMove={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && !activeQuiz && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        className={`w-full h-auto transition-all ${activeQuiz ? 'blur-xl brightness-50' : ''}`}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        onClick={togglePlay}
      />

      {/* Pop-Up Quiz Overlay */}
      <AnimatePresence>
        {activeQuiz && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-slate-950/40 backdrop-blur-sm"
          >
            <div className="glass-panel p-8 rounded-3xl max-w-md w-full border border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
              <div className="flex items-center gap-2 text-cyan-400 font-bold mb-4 uppercase tracking-widest text-xs">
                <CheckCircle2 size={16} /> Knowledge Check
              </div>
              <div className="text-xl font-bold text-white mb-6 prose prose-invert">
                <Latex>{activeQuiz.questionLatex}</Latex>
              </div>
              <div className="space-y-3">
                {activeQuiz.options.map((opt, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleQuizAnswer(idx)}
                    className="w-full p-4 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-cyan-500/20 hover:border-cyan-500 transition text-left text-white"
                  >
                    <Latex>{opt}</Latex>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10"
          >
            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-slate-700 rounded-full mb-4 cursor-pointer relative overflow-hidden"
              onClick={(e) => {
                if (videoRef.current) {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pos = (e.clientX - rect.left) / rect.width;
                  videoRef.current.currentTime = pos * videoRef.current.duration;
                }
              }}
            >
              <div className="absolute top-0 left-0 h-full bg-cyan-500 transition-all ease-linear" style={{ width: progress + "%" }} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-white">
                <button onClick={togglePlay} className="hover:text-cyan-400 transition">
                  {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                </button>
                <button onClick={() => skip(-10)} className="hover:text-cyan-400 transition"><Rewind size={20} /></button>
                <button onClick={() => skip(10)} className="hover:text-cyan-400 transition"><Forward size={20} /></button>
              </div>

              <div className="flex items-center gap-4 text-white">
                <button onClick={cycleSpeed} className="text-sm font-bold bg-white/10 px-2 py-1 rounded hover:bg-white/20 transition">
                  {speed}x
                </button>
                <button onClick={togglePiP} className="hover:text-cyan-400 transition" title="Picture-in-Picture">
                  <PictureInPicture size={20} />
                </button>
                <button onClick={toggleFullscreen} className="hover:text-cyan-400 transition" title="Fullscreen">
                  <Maximize size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
