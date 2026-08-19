import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Users, BookOpen, Sparkles } from 'lucide-react';

const galleryItems = [
  {
    title: "Wall of Fame - Top Scorers 2026",
    category: "wall-of-fame",
    desc: "Celebrating our students who scored 95+ and secured top ranks in board examinations.",
    icon: <Trophy className="text-amber-400" />
  },
  {
    title: "State-Level Mock Exam Session",
    category: "exams",
    desc: "Rigorous exam-hall simulation environment conducted for NEET & JEE aspirants.",
    icon: <BookOpen className="text-orange-400" />
  },
  {
    title: "Interactive Daily Class",
    category: "classes",
    desc: "Small batch attention ensuring every single student's doubts are resolved instantly.",
    icon: <Users className="text-blue-400" />
  },
  {
    title: "Olympiad Quiz Championship",
    category: "quizzes",
    desc: "Encouraging rapid problem solving and analytical thinking through competitive quizzes.",
    icon: <Sparkles className="text-purple-400" />
  }
];

export default function Gallery() {
  const [activeTab, setActiveTab] = useState('all');

  const filteredItems = activeTab === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeTab);

  return (
    <section id="gallery" className="py-20 bg-slate-900 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-orange-500 font-semibold tracking-wider uppercase text-sm bg-orange-500/10 px-4 py-1.5 rounded-full border border-orange-500/20">
            03 / Campus & Success
          </span>
          <h2 className="text-4xl sm:text-5xl font-black mt-4 tracking-tight">
            Proud Moments & <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Wall of Fame</span>
          </h2>
          <p className="text-slate-400 mt-4 text-lg">
            A visual glimpse into our daily classrooms, competitive exam drills, and celebrated achievers.
          </p>

          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {[
              { id: 'all', label: 'All Highlights' },
              { id: 'wall-of-fame', label: 'Wall of Fame' },
              { id: 'exams', label: 'Exams & Tests' },
              { id: 'quizzes', label: 'Quizzes' },
              { id: 'classes', label: 'Daily Classes' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeTab === tab.id 
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' 
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          <AnimatePresence>
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.title}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-xl group hover:border-orange-500/50 transition duration-300 flex flex-col sm:flex-row"
              >
                {/* Visual Placeholder Box */}
                <div className="sm:w-1/2 h-56 sm:h-auto bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition duration-500">
                  <div className="absolute inset-0 bg-orange-500/5 group-hover:bg-transparent transition" />
                  <div className="p-6 bg-slate-900/80 rounded-2xl border border-slate-700 shadow-xl flex flex-col items-center justify-center">
                    <span className="text-4xl mb-2">📸</span>
                    <span className="text-xs text-slate-400 font-mono tracking-wider uppercase">Visual Asset</span>
                  </div>
                </div>

                {/* Info Box */}
                <div className="sm:w-1/2 p-8 flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-4">
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-orange-400 transition">
                      {item.title}
                    </h3>
                    <p className="text-slate-400 text-sm mt-3 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-orange-400 font-semibold">
                    <span>Peerless Academy</span>
                    <span className="text-slate-500 font-normal">Agartala</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
}