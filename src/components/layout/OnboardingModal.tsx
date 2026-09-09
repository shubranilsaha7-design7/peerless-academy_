import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { User, BookOpen, GraduationCap, MapPin, ChevronRight, Loader2, Target } from 'lucide-react';

export default function OnboardingModal({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    class_level: '',
    target_exam: '',
    state: ''
  });
  
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase?.auth?.getUser?.().then((res: any) => {
      const user = res?.data?.user;
      if (user) {
        setUserId(user.id);
        // Check if already onboarded
        (supabase as any).from('user_profiles').select('*').eq('id', user.id).single()
          .then(({ data }: { data: any }) => {
            if (data && data.class_level && data.target_exam) {
              onComplete();
            }
          })
          .catch(() => {});
      }
    }).catch(() => {});
  }, [onComplete]);

  const handleSubmit = async () => {
    if (!userId) {
      onComplete();
      return;
    }
    
    setLoading(true);
    const { error } = await (supabase as any)
      .from('user_profiles')
      .upsert({
        id: userId,
        full_name: formData.full_name,
        class_level: formData.class_level,
        target_exam: formData.target_exam,
        state: formData.state,
      });

    setLoading(false);
    if (!error) {
      localStorage.setItem('isOnboarded', 'true');
      onComplete();
    } else {
      console.error(error);
      alert('Failed to save profile. Please try again.');
    }
  };

  const handleNext = () => {
    if (step === 1 && formData.full_name.trim().length > 2) setStep(2);
    else if (step === 2 && formData.class_level) setStep(3);
    else if (step === 3 && formData.target_exam) setStep(4);
    else if (step === 4 && formData.state) handleSubmit();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 font-sans text-white">
      <motion.div 
        initial={{ opacity: 0, y: 50 }} 
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative"
      >
        <div className="absolute top-0 left-0 h-1 bg-indigo-500 transition-all duration-300" style={{ width: `${(step / 4) * 100}%` }} />
        
        <div className="p-8">
          <h2 className="text-2xl font-black mb-6 text-center">
            {step === 1 && "What's your name?"}
            {step === 2 && "Which class are you in?"}
            {step === 3 && "What's your target?"}
            {step === 4 && "Where are you from?"}
          </h2>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Enter your full name" 
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-2xl py-4 pl-12 pr-4 outline-none text-lg transition-colors placeholder:text-slate-600"
                    autoFocus
                  />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                <div className="grid grid-cols-2 gap-3">
                  {['Class 9', 'Class 10', 'Class 11', 'Class 12', 'Dropper'].map(cls => (
                    <button 
                      key={cls}
                      onClick={() => setFormData({ ...formData, class_level: cls })}
                      className={`py-4 rounded-2xl border-2 transition-all font-bold ${formData.class_level === cls ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400' : 'border-slate-800 hover:border-slate-700 bg-slate-950'}`}
                    >
                      {cls}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-3">
                {[
                  { id: 'JEE', icon: <Target className="text-orange-400" />, desc: 'Engineering Entrance' },
                  { id: 'NEET', icon: <Target className="text-emerald-400" />, desc: 'Medical Entrance' },
                  { id: 'Foundation', icon: <BookOpen className="text-indigo-400" />, desc: 'School & Boards' }
                ].map(exam => (
                  <button 
                    key={exam.id}
                    onClick={() => setFormData({ ...formData, target_exam: exam.id })}
                    className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center gap-4 text-left ${formData.target_exam === exam.id ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-800 hover:border-slate-700 bg-slate-950'}`}
                  >
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">{exam.icon}</div>
                    <div>
                      <div className={`font-black text-lg ${formData.target_exam === exam.id ? 'text-indigo-400' : 'text-white'}`}>{exam.id}</div>
                      <div className="text-sm text-slate-400">{exam.desc}</div>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select 
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-2xl py-4 pl-12 pr-4 outline-none text-lg transition-colors appearance-none"
                  >
                    <option value="" disabled>Select your State...</option>
                    {['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Uttar Pradesh', 'West Bengal', 'Rajasthan', 'Gujarat', 'Bihar', 'Other'].map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8 pt-6 border-t border-slate-800 flex justify-between items-center">
            {step > 1 ? (
              <button onClick={() => setStep(s => s - 1)} className="text-slate-400 font-bold hover:text-white px-4 py-2">
                Back
              </button>
            ) : <div />}
            
            <button 
              onClick={handleNext}
              disabled={
                (step === 1 && formData.full_name.trim().length < 3) ||
                (step === 2 && !formData.class_level) ||
                (step === 3 && !formData.target_exam) ||
                (step === 4 && !formData.state) ||
                loading
              }
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-3 px-8 rounded-xl transition flex items-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : step === 4 ? 'Complete Setup' : 'Continue'}
              {!loading && step < 4 && <ChevronRight size={20} />}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
