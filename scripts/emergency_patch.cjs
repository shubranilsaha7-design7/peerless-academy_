const fs = require('fs');

const replaceInFile = (file, pattern, replacement) => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(pattern, replacement);
  fs.writeFileSync(file, content);
};

// -----------------------------------------
// 1. MythicBattlefield.tsx (Mobile Stacking)
// -----------------------------------------
let mythic = fs.readFileSync('src/components/battle/MythicBattlefield.tsx', 'utf8');
// Fix layout container
mythic = mythic.replace(
  'className="relative z-10 w-full h-full flex justify-between items-end px-4 sm:px-12 pb-8"',
  'className="relative z-10 w-full h-full flex flex-col md:flex-row justify-between items-center md:items-end px-4 sm:px-12 pb-8 gap-2 md:gap-4"'
);
// Fix image scaling (we have the split image divs)
// Replace absolute w-[200%] h-full with responsive h-32 md:h-64 inside the aspect ratio box
// The aspect-[3/4] box sizes based on width. So we just need the parent w-32 sm:w-48 to be responsive.
mythic = mythic.replace(
  'className="relative flex flex-col items-center justify-end w-32 sm:w-48"',
  'className="relative flex flex-col items-center justify-end w-24 sm:w-32 md:w-48"'
);
mythic = mythic.replace(
  'className="relative flex flex-col items-center justify-end w-32 sm:w-48"', // second one (Karna)
  'className="relative flex flex-col items-center justify-end w-24 sm:w-32 md:w-48"'
);
fs.writeFileSync('src/components/battle/MythicBattlefield.tsx', mythic);


// -----------------------------------------
// 2. Kurukshetra.tsx (Responsive + Master Qs)
// -----------------------------------------
let kuru = fs.readFileSync('src/components/Kurukshetra.tsx', 'utf8');

// Add import
if (!kuru.includes('MASTER_QUESTIONS')) {
  kuru = kuru.replace("import 'katex/dist/katex.min.css';", "import 'katex/dist/katex.min.css';\nimport { MASTER_QUESTIONS } from '@/data/mockQuestionsPool';");
}

// Fix responsive wrapper
kuru = kuru.replace(
  /className=\{`fixed inset-0 z-50 bg-\[#050510\] text-white flex flex-col overflow-hidden \$\{shake \? 'animate-\[shake_0\.5s_ease-in-out\]' : ''\}`\}/,
  'className={`fixed inset-0 z-50 w-full min-h-screen overflow-x-hidden overflow-y-auto p-2 md:p-6 bg-[#050510] text-white flex flex-col ${shake ? \'animate-[shake_0.5s_ease-in-out]\' : \'\'}`}'
);

// Fix fallback logic
kuru = kuru.replace(
  /const fetchQuestions = async \(\) => \{[\s\S]*?fetchQuestions\(\);/m,
  `const fetchQuestions = async () => {
      try {
        const { data, error } = await (supabase as any).from('pyqs').select('*').limit(30);
        if (data && data.length >= 5) {
          setQuestions(data.sort(() => 0.5 - Math.random()));
        } else {
          setQuestions(MASTER_QUESTIONS.slice(0, 10)); // Fallback
        }
      } catch (err) {
        setQuestions(MASTER_QUESTIONS.slice(0, 10)); // Fallback
      }
    };
    fetchQuestions();`
);
fs.writeFileSync('src/components/Kurukshetra.tsx', kuru);


// -----------------------------------------
// 3. CustomTestBuilder.tsx (Mini Tests)
// -----------------------------------------
let ctb = fs.readFileSync('src/components/dashboard/CustomTestBuilder.tsx', 'utf8');
if (!ctb.includes('MASTER_QUESTIONS')) {
  ctb = ctb.replace("import { Loader2 } from 'lucide-react';", "import { Loader2 } from 'lucide-react';\nimport { MASTER_QUESTIONS } from '@/data/mockQuestionsPool';");
}

ctb = ctb.replace(
  /if \(data && data\.length > 0\) \{[\s\S]*?\} else \{[\s\S]*?alert\("No questions found for criteria\."\);[\s\S]*?\}/m,
  `if (data && data.length > 0) {
        const mapped = data.map((d: any) => ({
          ...d,
          question_latex: d.question_text || d.question_latex,
          correct_index: d.options ? (d.options.findIndex((o: string) => o === d.correct_answer) === -1 ? 0 : d.options.findIndex((o: string) => o === d.correct_answer)) : (d.correct_option || 0),
          explanation_latex: d.explanation || d.solution_latex || 'Standard derivation applied.'
        }));
        useCbtStore.getState().hydrateQuestions(mapped);
        onStart();
      } else {
        // Fallback to MASTER_QUESTIONS
        const localFiltered = MASTER_QUESTIONS.filter(q => subjects.includes(q.subject));
        const finalQs = localFiltered.length > 0 ? localFiltered : MASTER_QUESTIONS.slice(0, 30);
        const mapped = finalQs.map((d: any) => ({
          ...d,
          correct_index: d.correct_option || 0,
          explanation_latex: d.solution_latex || 'Standard derivation applied.'
        }));
        useCbtStore.getState().hydrateQuestions(mapped);
        onStart();
      }`
);
fs.writeFileSync('src/components/dashboard/CustomTestBuilder.tsx', ctb);


// -----------------------------------------
// 4. QuickMatchArena.tsx (Fast AI Match)
// -----------------------------------------
let quick = fs.readFileSync('src/components/arena/QuickMatchArena.tsx', 'utf8');
if (!quick.includes('MASTER_QUESTIONS')) {
  quick = quick.replace("import 'katex/dist/katex.min.css';", "import 'katex/dist/katex.min.css';\nimport { MASTER_QUESTIONS } from '@/data/mockQuestionsPool';");
}

// Mobile responsive wrapper
quick = quick.replace(
  /className="fixed inset-0 z-50 bg-\[#050510\] text-white flex flex-col overflow-hidden"/,
  'className="fixed inset-0 z-50 w-full min-h-screen overflow-x-hidden overflow-y-auto p-2 md:p-6 bg-[#050510] text-white flex flex-col"'
);
quick = quick.replace(
  /className=\{`fixed inset-0 z-50 bg-\[#050510\] text-white flex flex-col overflow-hidden \$\{shake \? 'animate-\[shake_0\.5s_ease-in-out\]' : ''\}`\}/,
  'className={`fixed inset-0 z-50 w-full min-h-screen overflow-x-hidden overflow-y-auto p-2 md:p-6 bg-[#050510] text-white flex flex-col ${shake ? \'animate-[shake_0.5s_ease-in-out]\' : \'\'}`}'
);


// Replace the entire search match logic to force AI bot after 3 seconds
quick = quick.replace(
  /const startSearch = async \(\) => \{[\s\S]*?clearInterval\(interval\);[\s\S]*?\};/m,
  `const startSearch = async () => {
    setView('searching');
    setSearchTimer(3);
    
    // Fast 3-second animated radar, then force AI match
    let count = 3;
    const interval = setInterval(() => {
      count--;
      setSearchTimer(count);
      if (count <= 0) {
        clearInterval(interval);
        setIsBot(true);
        setOppId('bot-1');
        setOppName('AI Scholar [Level 12]');
        
        // Load random questions from MASTER_QUESTIONS
        const shuffled = [...MASTER_QUESTIONS].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 5);
        setQuestions(selected);
        
        // Start battle
        setTimeout(() => setView('battle'), 800);
      }
    }, 1000);
  };`
);

// AI simulated scoring every 4-7 seconds
quick = quick.replace(
  /useEffect\(\(\) => \{[\s\S]*?if \(!isBot || view !== 'battle'\) return;[\s\S]*?return \(\) => clearInterval\(botInterval\);[\s\S]*?\}, \[isBot, view\]\);/m,
  `useEffect(() => {
    if (!isBot || view !== 'battle') return;
    
    // AI opponent scores randomly every 4-7 seconds
    const intervalTime = Math.random() * 3000 + 4000;
    const botInterval = setInterval(() => {
      setOppHp(prev => Math.max(0, prev - BASE_DMG * 0.8));
    }, intervalTime);
    
    return () => clearInterval(botInterval);
  }, [isBot, view]);`
);

fs.writeFileSync('src/components/arena/QuickMatchArena.tsx', quick);
console.log("Emergency patches applied.");
