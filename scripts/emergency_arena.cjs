const fs = require('fs');

function applyArenaFixes() {
  // 1. MythicBattlefield.tsx
  let mythic = fs.readFileSync('src/components/battle/MythicBattlefield.tsx', 'utf8');
  
  // Replace the container holding Arjuna and Karna
  // from: `<div className="relative z-10 w-full h-full flex flex-col md:flex-row justify-between items-center md:items-end px-4 sm:px-12 pb-8 gap-2 md:gap-4">`
  // to: `<div className="relative z-10 h-full flex flex-col md:flex-row justify-center items-center gap-4 md:gap-12 w-full px-4 sm:px-12 pb-8">`
  mythic = mythic.replace(
    /className="relative z-10 w-full h-full flex flex-col md:flex-row justify-between items-center md:items-end px-4 sm:px-12 pb-8 gap-2 md:gap-4"/g,
    'className="relative z-10 h-full flex flex-col md:flex-row justify-center items-center gap-4 md:gap-12 w-full px-4 sm:px-12 pb-8"'
  );
  
  // Arjuna wrapper
  mythic = mythic.replace(
    /<div className="relative flex flex-col items-center justify-end w-24 sm:w-32 md:w-48">[\s\S]*?<\/div>[\s\S]*?<\/div>/m,
    `<div className="relative flex flex-col items-center justify-end w-auto">
          <motion.div animate={attackAnimation === 'player' ? { x: [0, 20, 0] } : {}} transition={{ duration: 0.3 }} className="w-full">
            <img src={arjunaImageSrc || "/assets/mythic-battle.jpg"} alt="Arjuna" className="h-48 md:h-72 w-auto object-contain rounded-xl shadow-[0_0_30px_rgba(34,211,238,0.5)] border-2 border-cyan-500/50 bg-black/50" />
          </motion.div>
          <div className="absolute -bottom-6 font-black text-cyan-400 tracking-widest text-sm drop-shadow-md">ARJUNA</div>
        </div>`
  );

  // Karna wrapper
  mythic = mythic.replace(
    /\{\/\* KARNA \(Right\) \*\/\}[\s\S]*?<div className="relative flex flex-col items-center justify-end w-24 sm:w-32 md:w-48">[\s\S]*?<\/div>[\s\S]*?<\/div>/m,
    `{/* KARNA (Right) */}
        <div className="relative flex flex-col items-center justify-end w-auto">
          <motion.div animate={attackAnimation === 'enemy' ? { x: [0, -20, 0] } : {}} transition={{ duration: 0.3 }} className="w-full">
            <img src={karnaImageSrc || "/assets/mythic-battle.jpg"} alt="Karna" className="h-48 md:h-72 w-auto object-contain rounded-xl shadow-[0_0_30px_rgba(225,29,72,0.5)] border-2 border-rose-500/50 bg-black/50" />
          </motion.div>
          <div className="absolute -bottom-6 font-black text-rose-500 tracking-widest text-sm drop-shadow-md">KARNA</div>
        </div>`
  );
  
  fs.writeFileSync('src/components/battle/MythicBattlefield.tsx', mythic);


  // 2. Kurukshetra.tsx
  let kuru = fs.readFileSync('src/components/Kurukshetra.tsx', 'utf8');

  // Ensure MASTER_QUESTIONS is imported
  if (!kuru.includes('MASTER_QUESTIONS')) {
    kuru = kuru.replace("import 'katex/dist/katex.min.css';", "import 'katex/dist/katex.min.css';\nimport { MASTER_QUESTIONS } from '@/data/mockQuestionsPool';");
  }

  // Ensure 'relative' instead of 'absolute' or 'fixed' on header, or 'sticky top-0 z-50'
  kuru = kuru.replace(
    'className="relative p-6 flex justify-between items-center border-b border-amber-500/20 bg-black/50 backdrop-blur-md z-10"',
    'className="sticky top-0 z-50 p-6 flex justify-between items-center border-b border-amber-500/20 bg-black/50 backdrop-blur-md"'
  );

  // Main Wrapper
  kuru = kuru.replace(
    /className=\{`fixed inset-0 z-50 w-full min-h-screen overflow-x-hidden overflow-y-auto p-2 md:p-6 bg-\[#050510\] text-white flex flex-col \$\{shake \? 'animate-\[shake_0\.5s_ease-in-out\]' : ''\}`\}/,
    'className={`min-h-screen w-full flex flex-col overflow-x-hidden bg-[#090D16] text-white ${shake ? \'animate-[shake_0.5s_ease-in-out]\' : \'\'}`}'
  );

  // Question Box Visibility
  kuru = kuru.replace(
    'className="flex-1 bg-black/70 border border-slate-800 rounded-3xl p-8 flex flex-col shadow-2xl relative overflow-hidden backdrop-blur-md z-10"',
    'className="w-full max-w-4xl mx-auto flex-1 flex flex-col justify-end md:justify-center p-4 pb-12 bg-black/70 border border-slate-800 rounded-3xl shadow-2xl relative overflow-hidden backdrop-blur-md z-10"'
  );

  // Question Card bg-slate-800/50 rounded-xl p-6 mb-4
  // The original text wrapper is usually "prose prose-invert prose-xl max-w-none font-serif leading-relaxed" inside a div
  kuru = kuru.replace(
    /<div className="prose prose-invert prose-xl max-w-none font-serif leading-relaxed">/g,
    '<div className="bg-slate-800/50 rounded-xl p-6 mb-4 prose prose-invert prose-xl max-w-none font-serif leading-relaxed">'
  );

  // Options Grid
  // from grid grid-cols-2 gap-4 
  kuru = kuru.replace(
    'className="grid grid-cols-2 gap-4"',
    'className="grid grid-cols-1 md:grid-cols-2 gap-4"'
  );

  // Add loadEmergencyQuestions button below health bars if questions length is 0 inside the battle view
  const emergencyFunc = `
  const loadEmergencyQuestions = () => {
    setQuestions(MASTER_QUESTIONS.slice(0, 10).sort(() => 0.5 - Math.random()));
  };`;
  if (!kuru.includes('loadEmergencyQuestions')) {
    kuru = kuru.replace('const currentQ =', emergencyFunc + '\n  const currentQ =');
  }

  // Replace {currentQ ? ( ... ) : null} with the emergency fallback button
  kuru = kuru.replace(
    /\{currentQ \? \([\s\S]*?\) : null\}/,
    `{currentQ ? (
      // Extracted original block string match replaced inside script below
      /* PLACEHOLDER */
    ) : (
      view === 'battle' && (
        <div className="flex-1 flex flex-col items-center justify-center">
          <button onClick={loadEmergencyQuestions} className="px-10 py-6 bg-rose-600 hover:bg-rose-500 text-white font-black text-2xl rounded-2xl shadow-[0_0_50px_rgba(225,29,72,0.8)] animate-pulse border-4 border-rose-400">
            FORCE LOAD QUESTIONS
          </button>
        </div>
      )
    )}`
  );
  
  // Actually we need to carefully match the large currentQ block. Let's do it cleanly:
  let kParts = kuru.split('{currentQ ? (');
  if (kParts.length > 1) {
    let kEnd = kParts[1].split(') : null}');
    kuru = kParts[0] + '{currentQ ? (' + kEnd[0] + `) : (
      view === 'battle' && (
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <button onClick={loadEmergencyQuestions} className="px-10 py-6 bg-rose-600 hover:bg-rose-500 text-white font-black text-2xl rounded-2xl shadow-[0_0_50px_rgba(225,29,72,0.8)] animate-pulse border-4 border-rose-400">
            FORCE LOAD QUESTIONS
          </button>
        </div>
      )
    )}` + (kEnd[1] || '');
  }

  fs.writeFileSync('src/components/Kurukshetra.tsx', kuru);
  

  // 3. QuickMatchArena.tsx
  let quick = fs.readFileSync('src/components/arena/QuickMatchArena.tsx', 'utf8');
  
  // Selection Menu Cards
  // Usually mapped options in view === 'menu'
  quick = quick.replace(
    /className="grid grid-cols-1 md:grid-cols-2 gap-6"/,
    'className="w-full flex flex-col gap-4 px-4 md:px-8"'
  );

  // Main wrapper
  quick = quick.replace(
    /className=\{`fixed inset-0 z-50 w-full min-h-screen overflow-x-hidden overflow-y-auto p-2 md:p-6 bg-\[#050510\] text-white flex flex-col \$\{shake \? 'animate-\[shake_0\.5s_ease-in-out\]' : ''\}`\}/,
    'className={`min-h-screen w-full flex flex-col overflow-x-hidden overflow-y-auto bg-[#090D16] text-white ${shake ? \'animate-[shake_0.5s_ease-in-out]\' : \'\'}`}'
  );

  // Duel UI Stack (HP Bars)
  // Usually: className="flex justify-between items-center gap-4 bg-[#13192B] border border-slate-800 p-4 md:p-6 rounded-2xl shadow-lg mb-6 relative overflow-hidden"
  quick = quick.replace(
    /className="flex justify-between items-center gap-4 bg-\[#13192B\] border border-slate-800 p-4 md:p-6 rounded-2xl shadow-lg mb-6 relative overflow-hidden"/g,
    'className="flex flex-col md:flex-row justify-between items-center gap-4 bg-[#13192B] border border-slate-800 p-4 md:p-6 rounded-2xl shadow-lg mb-6 relative overflow-hidden w-full"'
  );
  quick = quick.replace(
    /className="flex items-center justify-between gap-4 bg-\[#13192B\] border border-slate-800 p-4 md:p-6 rounded-2xl shadow-lg mb-6 relative overflow-hidden"/g,
    'className="flex flex-col md:flex-row justify-between items-center gap-4 bg-[#13192B] border border-slate-800 p-4 md:p-6 rounded-2xl shadow-lg mb-6 relative overflow-hidden w-full"'
  );

  // Option Grid
  quick = quick.replace(
    /className="grid gap-3"/,
    'className="grid grid-cols-1 md:grid-cols-2 gap-4"'
  );

  // Question Text Box
  quick = quick.replace(
    /className="prose prose-invert prose-lg md:prose-xl max-w-none font-serif leading-relaxed"/g,
    'className="bg-slate-800/50 rounded-xl p-6 mb-4 prose prose-invert prose-lg md:prose-xl max-w-none font-serif leading-relaxed w-full"'
  );
  quick = quick.replace(
    /className="prose prose-invert prose-xl max-w-none font-serif leading-relaxed"/g,
    'className="bg-slate-800/50 rounded-xl p-6 mb-4 prose prose-invert prose-xl max-w-none font-serif leading-relaxed w-full"'
  );
  quick = quick.replace(
    /className="prose prose-invert prose-lg max-w-none font-serif leading-relaxed"/g,
    'className="bg-slate-800/50 rounded-xl p-6 mb-4 prose prose-invert prose-lg max-w-none font-serif leading-relaxed w-full"'
  );

  // Fallback Button
  if (!quick.includes('loadEmergencyQuestions')) {
    quick = quick.replace('const currentQ =', emergencyFunc + '\n  const currentQ =');
  }

  let qParts = quick.split('{currentQ ? (');
  if (qParts.length > 1) {
    let qEnd = qParts[1].split(') : null}');
    if (qEnd.length > 1) {
       quick = qParts[0] + '{currentQ ? (' + qEnd[0] + `) : (
          view === 'battle' && (
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              <button onClick={loadEmergencyQuestions} className="px-10 py-6 bg-rose-600 hover:bg-rose-500 text-white font-black text-2xl rounded-2xl shadow-[0_0_50px_rgba(225,29,72,0.8)] animate-pulse border-4 border-rose-400">
                FORCE LOAD QUESTIONS
              </button>
            </div>
          )
        )}` + (qEnd[1] || '');
    }
  }
  
  fs.writeFileSync('src/components/arena/QuickMatchArena.tsx', quick);
  console.log("Arena Emergency Patches Applied!");
}

applyArenaFixes();
