const fs = require('fs');

function applyPatches() {
  // 1. MythicBattlefield.tsx
  let mythic = fs.readFileSync('src/components/battle/MythicBattlefield.tsx', 'utf8');
  mythic = mythic.replace(
    'className="relative z-10 w-full h-full flex justify-between items-end px-4 sm:px-12 pb-8"',
    'className="relative z-10 w-full h-full flex flex-col md:flex-row justify-between items-center md:items-end px-4 sm:px-12 pb-8 gap-4"'
  );
  // Scale the container for images
  mythic = mythic.split('className="relative flex flex-col items-center justify-end w-32 sm:w-48"').join('className="relative flex flex-col items-center justify-end w-24 sm:w-32 md:w-48"');
  fs.writeFileSync('src/components/battle/MythicBattlefield.tsx', mythic);
  console.log("Patched MythicBattlefield.tsx");

  // 2. Kurukshetra.tsx
  let kuru = fs.readFileSync('src/components/Kurukshetra.tsx', 'utf8');
  if (!kuru.includes('MASTER_QUESTIONS')) {
    kuru = kuru.replace("import 'katex/dist/katex.min.css';", "import 'katex/dist/katex.min.css';\nimport { MASTER_QUESTIONS } from '@/data/mockQuestionsPool';");
  }
  
  // Responsive main wrapper
  kuru = kuru.replace(
    /className=\{`fixed inset-0 z-50 bg-\[#050510\] text-white flex flex-col overflow-hidden \$\{shake \? 'animate-\[shake_0\.5s_ease-in-out\]' : ''\}`\}/,
    'className={`fixed inset-0 z-50 w-full min-h-screen overflow-x-hidden overflow-y-auto p-2 md:p-6 bg-[#050510] text-white flex flex-col ${shake ? \'animate-[shake_0.5s_ease-in-out]\' : \'\'}`}'
  );

  // Fallback ingestion
  const kTarget = `if (data && data.length >= 5) {
          setQuestions(data.sort(() => 0.5 - Math.random()));
        } else {
          console.warn('DB empty. Using fallback questions.');
          setQuestions([
  { id: '1', question_latex: 'Calculate the force required to accelerate a 5kg mass at 2m/s^2.', options_json: ['10 N', '5 N', '2.5 N', '20 N'], correct_option: 0, subject: 'Physics' },
  { id: '2', question_latex: 'What is the powerhouse of the cell?', options_json: ['Nucleus', 'Mitochondria', 'Ribosome', 'Endoplasmic Reticulum'], correct_option: 1, subject: 'Biology' },
  { id: '3', question_latex: 'Integration of $$x^2 dx$$ is?', options_json: ['$$x^3/3$$', '$$2x$$', '$$x^2/2$$', '$$x^3$$'], correct_option: 0, subject: 'Math' },
  { id: '4', question_latex: 'Chemical formula for water?', options_json: ['HO', 'H2O2', 'H2O', 'OH'], correct_option: 2, subject: 'Chemistry' },
  { id: '5', question_latex: 'Which planet is known as the Red Planet?', options_json: ['Earth', 'Mars', 'Jupiter', 'Saturn'], correct_option: 1, subject: 'Physics' }
]);
        }`;
  const kReplace = `if (data && data.length >= 5) {
          setQuestions(data.sort(() => 0.5 - Math.random()));
        } else {
          console.warn('DB empty. Using MASTER_QUESTIONS.');
          const target = localStorage.getItem('targetExam') || 'NEET';
          const filtered = MASTER_QUESTIONS.filter(q => q.class_level === target);
          const finalQs = filtered.length >= 5 ? filtered : MASTER_QUESTIONS;
          setQuestions(finalQs.sort(() => 0.5 - Math.random()).slice(0, 10));
        }`;
        
  kuru = kuru.split(kTarget).join(kReplace);
  
  // Also catch the catch block fallback
  const kCatchTarget = `} catch (err) {
        console.error("Supabase Sync Error:", err);
        setQuestions([]);
      }`;
  const kCatchReplace = `} catch (err) {
        console.error("Supabase Sync Error:", err);
        const target = localStorage.getItem('targetExam') || 'NEET';
        const filtered = MASTER_QUESTIONS.filter(q => q.class_level === target);
        setQuestions((filtered.length >= 5 ? filtered : MASTER_QUESTIONS).sort(() => 0.5 - Math.random()).slice(0, 10));
      }`;
  kuru = kuru.split(kCatchTarget).join(kCatchReplace);

  fs.writeFileSync('src/components/Kurukshetra.tsx', kuru);
  console.log("Patched Kurukshetra.tsx");

  // 3. CustomTestBuilder.tsx
  let ctb = fs.readFileSync('src/components/dashboard/CustomTestBuilder.tsx', 'utf8');
  if (!ctb.includes('MASTER_QUESTIONS')) {
    ctb = ctb.replace("import { Loader2 } from 'lucide-react';", "import { Loader2 } from 'lucide-react';\nimport { MASTER_QUESTIONS } from '@/data/mockQuestionsPool';");
  }
  
  const ctbTarget = `} else {
        alert("No questions found for criteria.");
      }`;
  const ctbReplace = `} else {
        const localFiltered = MASTER_QUESTIONS.filter(q => subjects.includes(q.subject));
        const finalQs = localFiltered.length > 0 ? localFiltered : MASTER_QUESTIONS.slice(0, questionCount);
        const mapped = finalQs.map((d: any) => ({
          ...d,
          question_latex: d.question_latex,
          correct_index: d.correct_option,
          explanation_latex: d.solution_latex
        }));
        useCbtStore.getState().hydrateQuestions(mapped);
        onStart();
      }`;
  ctb = ctb.split(ctbTarget).join(ctbReplace);
  fs.writeFileSync('src/components/dashboard/CustomTestBuilder.tsx', ctb);
  console.log("Patched CustomTestBuilder.tsx");

  // 4. QuickMatchArena.tsx
  let quick = fs.readFileSync('src/components/arena/QuickMatchArena.tsx', 'utf8');
  if (!quick.includes('MASTER_QUESTIONS')) {
    quick = quick.replace("import 'katex/dist/katex.min.css';", "import 'katex/dist/katex.min.css';\nimport { MASTER_QUESTIONS } from '@/data/mockQuestionsPool';");
  }
  
  // Mobile responsive wrapper
  quick = quick.replace(
    'className="fixed inset-0 z-50 bg-[#050510] text-white flex flex-col overflow-hidden"',
    'className="fixed inset-0 z-50 w-full min-h-screen overflow-x-hidden overflow-y-auto p-2 md:p-6 bg-[#050510] text-white flex flex-col"'
  );
  
  // Remove long realtime logic for 'searching', replace with 3s radar and force match
  const searchEffectTarget = `if (view === 'searching') {
      channel = supabase.channel('room:quickmatch');`;
      
  // We'll just replace the startSearch function, and then simplify the interval inside useEffect
  // Wait, startSearch is easier to just replace:
  const startSearchTarget = `const startSearch = () => {
    setSearchTimer(10);
    setView('searching');
  };`;
  const startSearchReplace = `const startSearch = () => {
    setSearchTimer(3);
    setView('searching');
    
    // Simulate 3 seconds radar, then force AI bot
    setTimeout(() => {
      setOppId('bot-1');
      setOppName('AI Scholar [Level 12]');
      setIsBot(true);
      
      const target = localStorage.getItem('targetExam') || 'NEET';
      const filtered = MASTER_QUESTIONS.filter(q => q.class_level === target);
      const finalQs = filtered.length >= 5 ? filtered : MASTER_QUESTIONS;
      
      setQuestions(finalQs.sort(() => 0.5 - Math.random()).slice(0, 5));
      setView('battle');
    }, 3000);
  };`;
  
  quick = quick.split(startSearchTarget).join(startSearchReplace);
  
  // Fix AI simulated scoring (currently inside the 'battle' view condition in useEffect)
  // Let's modify the `if (isBot) {` block
  const botScoringTarget = `if (isBot) {
        const botDelay = Math.floor(Math.random() * 5000) + 4000;
        setTimeout(() => {
          const isCorrect = Math.random() < 0.8;
          if (isCorrect) setOppScore(s => s + 4);
          else setOppScore(s => Math.max(0, s - 1));
        }, botDelay);
      }`;
  const botScoringReplace = `if (isBot) {
        const botDelay = Math.floor(Math.random() * 3000) + 4000; // 4 to 7 seconds
        setTimeout(() => {
          const isCorrect = Math.random() < 0.85;
          if (isCorrect) setOppScore(s => s + 4);
          else setOppScore(s => Math.max(0, s - 1));
        }, botDelay);
      }`;
  quick = quick.split(botScoringTarget).join(botScoringReplace);

  fs.writeFileSync('src/components/arena/QuickMatchArena.tsx', quick);
  console.log("Patched QuickMatchArena.tsx");

}

applyPatches();
