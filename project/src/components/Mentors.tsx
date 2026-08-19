import React from 'react';
import { motion } from 'framer-motion';
import { Award, BookOpen, Sparkles } from 'lucide-react';

const mentors = [
  {
    name: "Rahul Sir",
    role: "Physics Mentor",
    desc: "Specializes in simplifying complex mechanical and electrical concepts for JEE & NEET aspirants.",
    badge: "Expert Faculty",
    image: "/images/rahul-sir.jpg" // Drop your image in public/images/ or update path
  },
  {
    name: "Tanima Mam",
    role: "Biology Mentor",
    desc: "Bringing life sciences to life with crystal-clear explanations and diagrammatic mastery.",
    badge: "Concept Clarity",
    image: "/images/tanima-mam.jpg"
  },
  {
    name: "Prasenjit Sir",
    role: "Mathematics & Physics Mentor",
    desc: "Founder & Lead Mentor. Building strong scientific foundations, one breakthrough at a time.",
    badge: "Lead Mentor",
    image: "/images/prasenjit-sir.jpg"
  },
  {
    name: "Dipjoy Sir",
    role: "Chemistry Mentor",
    desc: "Makes organic and inorganic reactions click effortlessly through logical frameworks.",
    badge: "Proven Results",
    image: "/images/dipjoy-sir.jpg"
  }
];

export default function Mentors() {
  return (
    <section id="mentors" className="py-20 bg-slate-950 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-orange-500 font-semibold tracking-wider uppercase text-sm bg-orange-500/10 px-4 py-1.5 rounded-full border border-orange-500/20">
            02 / The Mentors
          </span>
          <h2 className="text-4xl sm:text-5xl font-black mt-4 tracking-tight">
            The people behind <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">the progress.</span>
          </h2>
          <p className="text-slate-400 mt-4 text-lg">
            Great teachers don't just explain the answer. They make you want to find the next one. Meet the minds leading Peerless Academy.
          </p>
        </div>

        {/* Mentors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {mentors.map((mentor, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col group relative"
            >
              {/* Image & Badge Header */}
              <div className="relative h-64 bg-slate-800 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10" />
                <div className="w-full h-full flex items-center justify-center text-6xl bg-slate-800/80 group-hover:scale-105 transition duration-500">
                  👨‍🏫
                </div>
                <span className="absolute top-4 right-4 z-20 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  {mentor.badge}
                </span>
              </div>

              {/* Content Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white group-hover:text-orange-400 transition">
                    {mentor.name}
                  </h3>
                  <p className="text-orange-500 font-medium text-sm mt-1">{mentor.role}</p>
                  <p className="text-slate-400 text-sm mt-3 leading-relaxed">{mentor.desc}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Award size={14} className="text-orange-500" /> Expert Faculty</span>
                  <span className="flex items-center gap-1"><Sparkles size={14} className="text-orange-500" /> Personalized</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}