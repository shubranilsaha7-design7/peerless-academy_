import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';

export default function AdminSeedTrigger({ onBack }: { onBack?: () => void }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSeed = async () => {
    setLoading(true);
    setStatus('idle');
    
    try {
      const subjects = ['Physics', 'Chemistry', 'Mathematics'];
      const topics = {
        Physics: ['Kinematics', 'Thermodynamics', 'Electromagnetism', 'Optics', 'Modern Physics'],
        Chemistry: ['Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry', 'Polymers'],
        Mathematics: ['Calculus', 'Algebra', 'Trigonometry', 'Coordinate Geometry', 'Vectors']
      };
      
      const templates = [
        "Calculate the {prop} of a particle moving with {val1} in {val2} field.",
        "Evaluate the integral of {prop} over the domain {val1} to {val2}.",
        "Determine the {prop} given {val1} and {val2} at STP.",
        "Find the locus of {prop} where {val1} is tangent to {val2}.",
        "What is the {prop} required to transition from {val1} to {val2}?"
      ];

      const qs = [];
      for (let i = 0; i < 100; i++) {
        const subject = subjects[Math.floor(Math.random() * subjects.length)];
        const topic = topics[subject as keyof typeof topics][Math.floor(Math.random() * topics[subject as keyof typeof topics].length)];
        const template = templates[Math.floor(Math.random() * templates.length)];
        
        const val1 = Math.floor(Math.random() * 100) + "x";
        const val2 = Math.floor(Math.random() * 100) + "y";
        const prop = topic.toLowerCase();
        
        const question_latex = template.replace('{prop}', prop).replace('{val1}', val1).replace('{val2}', val2) + " (Admin Seeded)";
        const correct_option = Math.floor(Math.random() * 4);
        
        const options_json = [
          "Option A: " + Math.random().toFixed(2),
          "Option B: " + Math.random().toFixed(2),
          "Option C: " + Math.random().toFixed(2),
          "Option D: " + Math.random().toFixed(2)
        ];
        options_json[correct_option] = "Correct: " + Math.random().toFixed(2);

        qs.push({
          class_level: ['JEE Main', 'NEET', 'Class 10'][Math.floor(Math.random() * 3)],
          subject: subject,
          topic: topic,
          year: 2026,
          exam_type: 'JEE Main',
          question_latex: question_latex,
          options_json: options_json,
          correct_option: correct_option,
          solution_latex: "The solution requires applying the principles of " + topic + ".",
          difficulty: ['Easy', 'Medium', 'Hard'][Math.floor(Math.random() * 3)],
          is_sample: false
        });
      }

      const { error } = await (supabase as any).from('pyqs').insert(qs);
      
      if (error) throw error;

      setStatus('success');
      setMessage(`Successfully inserted 100 fresh questions into the database.`);
      
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setMessage(err.message || 'Failed to seed database.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white p-8 flex flex-col items-center justify-center font-sans">
      <div className="w-full max-w-lg bg-[#13192B] border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {onBack && (
          <button onClick={onBack} className="absolute top-4 right-4 text-slate-400 hover:text-white">
            Cancel
          </button>
        )}
        
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center border border-indigo-500/30">
            <Database size={40} className="text-indigo-400" />
          </div>
        </div>
        
        <h1 className="text-2xl font-black text-center mb-2">Admin Seeder Trigger</h1>
        <p className="text-slate-400 text-center text-sm mb-8">
          Instantly invoke the backend seeding logic. This will inject 100 fresh, algorithmically generated questions directly into the live Supabase <code>pyqs</code> table.
        </p>

        {status === 'success' && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-3 text-emerald-400">
            <CheckCircle size={24} />
            <p className="font-medium text-sm">{message}</p>
          </div>
        )}

        {status === 'error' && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-3 text-rose-400">
            <AlertTriangle size={24} />
            <p className="font-medium text-sm">{message}</p>
          </div>
        )}

        <button 
          onClick={handleSeed} 
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition shadow-[0_0_15px_rgba(79,70,229,0.3)] flex justify-center items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Executing Payload...
            </>
          ) : (
            <>
              <Database size={20} />
              Inject 100 Questions Now
            </>
          )}
        </button>
      </div>
    </div>
  );
}
