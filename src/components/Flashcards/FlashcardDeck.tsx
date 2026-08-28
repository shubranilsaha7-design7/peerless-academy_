import { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import Latex from 'react-latex-next';
import { X, Brain, RotateCcw } from 'lucide-react';
import 'katex/dist/katex.min.css';

interface Card {
  id: string;
  front: string;
  back: string;
}

const mockDeck: Card[] = [
  { id: '1', front: 'Derivative of $\\sin(x)$', back: '$\\cos(x)$' },
  { id: '2', front: 'Integral of $e^x$', back: '$e^x + C$' },
  { id: '3', front: "Euler's Identity", back: '$e^{i\\pi} + 1 = 0$' },
];

export default function FlashcardDeck({ onBack }: { onBack: () => void }) {
  const [cards, setCards] = useState(mockDeck);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
  
  // Color transforms based on drag direction
  const backgroundColor = useTransform(
    x,
    [-200, 0, 200],
    ['rgba(244, 63, 94, 0.2)', 'rgba(30, 41, 59, 0.8)', 'rgba(16, 185, 129, 0.2)']
  );
  const borderColor = useTransform(
    x,
    [-200, 0, 200],
    ['rgba(244, 63, 94, 0.5)', 'rgba(51, 65, 85, 0.5)', 'rgba(16, 185, 129, 0.5)']
  );

  const handleDragEnd = (e: any, info: any) => {
    if (info.offset.x > 100) {
      // Swiped right (Easy / Remembered)
      handleNextCard('easy');
    } else if (info.offset.x < -100) {
      // Swiped left (Hard / Forgot)
      handleNextCard('hard');
    }
  };

  const handleNextCard = (rating: 'easy' | 'hard') => {
    // SM-2 logic would go here, calculating next_review_date
    // For now, just advance UI
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
    }, 200);
  };

  if (currentIndex >= cards.length) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center text-white">
        <Brain size={64} className="text-cyan-500 mb-6" />
        <h2 className="text-3xl font-black mb-2">Review Complete</h2>
        <p className="text-slate-400 mb-8">You've finished your SM-2 queue for today.</p>
        <button onClick={onBack} className="bg-cyan-500 text-slate-900 px-8 py-3 rounded-full font-black">Return Home</button>
      </div>
    );
  }

  const currentCard = cards[currentIndex];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col font-sans text-white overflow-hidden">
      <header className="flex justify-between items-center p-6">
        <button onClick={onBack} className="text-slate-400 hover:text-white transition">
          <X size={24} />
        </button>
        <div className="font-bold text-slate-400 text-sm">
          Card {currentIndex + 1} of {cards.length}
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 relative">
        <AnimatePresence>
          <motion.div
            key={currentCard.id}
            style={{ x, rotate, opacity, backgroundColor, borderColor }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            initial={{ scale: 0.9, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0, transition: { duration: 0.2 } }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            className="absolute w-full max-w-sm aspect-[3/4] border-2 rounded-3xl p-8 flex flex-col justify-center items-center text-center cursor-grab active:cursor-grabbing backdrop-blur-md shadow-2xl"
          >
            
            <div className="text-xl sm:text-2xl font-medium prose prose-invert">
              <Latex>{isFlipped ? currentCard.back : currentCard.front}</Latex>
            </div>

            {/* Hint to flip */}
            <div className="absolute bottom-8 text-xs font-bold text-slate-500 uppercase tracking-widest flex flex-col items-center gap-2">
              <button 
                onClick={(e) => { e.stopPropagation(); setIsFlipped(!isFlipped); }}
                className="bg-slate-800 p-3 rounded-full hover:bg-slate-700 transition text-slate-300"
              >
                <RotateCcw size={20} />
              </button>
              Tap to Flip
            </div>
            
            {/* Swipe Indicators visible on drag */}
            <motion.div style={{ opacity: useTransform(x, [-100, -50], [1, 0]) }} className="absolute top-8 left-8 text-rose-500 font-black text-2xl border-4 border-rose-500 px-4 py-1 rounded-xl -rotate-12">HARD</motion.div>
            <motion.div style={{ opacity: useTransform(x, [50, 100], [0, 1]) }} className="absolute top-8 right-8 text-emerald-500 font-black text-2xl border-4 border-emerald-500 px-4 py-1 rounded-xl rotate-12">EASY</motion.div>
          </motion.div>
        </AnimatePresence>
      </main>

      <div className="p-8 text-center text-slate-500 text-sm font-bold">
        Swipe left if you forgot. Swipe right if it was easy.
      </div>
    </div>
  );
}
