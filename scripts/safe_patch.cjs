const fs = require('fs');

function safePatch() {
  // --- 1. MythicBattlefield.tsx ---
  let mythic = fs.readFileSync('src/components/battle/MythicBattlefield.tsx', 'utf8');
  
  // Replace container classes
  mythic = mythic.split('className="relative z-10 w-full h-full flex flex-col md:flex-row justify-between items-center md:items-end px-4 sm:px-12 pb-8 gap-4"')
                 .join('className="relative z-10 h-full flex flex-col md:flex-row justify-center items-center gap-4 md:gap-12 w-full px-4 sm:px-12 pb-8"');
  mythic = mythic.split('className="relative z-10 w-full h-full flex flex-col md:flex-row justify-between items-center md:items-end px-4 sm:px-12 pb-8 gap-2 md:gap-4"')
                 .join('className="relative z-10 h-full flex flex-col md:flex-row justify-center items-center gap-4 md:gap-12 w-full px-4 sm:px-12 pb-8"');
  
  // Arjuna wrapper
  mythic = mythic.split('<div className="relative flex flex-col items-center justify-end w-24 sm:w-32 md:w-48">').join('<div className="relative flex flex-col items-center justify-end w-auto">');
  
  // Arjuna image
  mythic = mythic.split('<img src="/assets/mythic-battle.jpg" alt="Arjuna" className="absolute top-0 left-0 w-[200%] h-full max-w-none object-cover object-left" />')
                 .join('<img src={arjunaImageSrc || "/assets/mythic-battle.jpg"} alt="Arjuna" className="h-48 md:h-72 w-auto object-contain shadow-[0_0_30px_rgba(34,211,238,0.5)] border-2 border-cyan-500/50 rounded-xl bg-black/50" />');
  
  // Karna image
  mythic = mythic.split('<img src="/assets/mythic-battle.jpg" alt="Karna" className="absolute top-0 right-0 w-[200%] h-full max-w-none object-cover object-right" />')
                 .join('<img src={karnaImageSrc || "/assets/mythic-battle.jpg"} alt="Karna" className="h-48 md:h-72 w-auto object-contain shadow-[0_0_30px_rgba(225,29,72,0.5)] border-2 border-rose-500/50 rounded-xl bg-black/50" />');
  
  // Strip the w-full aspect-[3/4] etc
  mythic = mythic.split('<div className="w-full aspect-[3/4] overflow-hidden rounded-xl relative shadow-[0_0_30px_rgba(34,211,238,0.5)] border-2 border-cyan-500/50">')
                 .join('');
  mythic = mythic.split('<div className="w-full aspect-[3/4] overflow-hidden rounded-xl relative shadow-[0_0_30px_rgba(225,29,72,0.5)] border-2 border-rose-500/50">')
                 .join('');
  
  // Since we stripped two <div>s, we need to remove their closing </div>s right after the image
  // We can do this by replacing `img ... />\n            </div>` with `img ... />`
  mythic = mythic.replace(/bg-black\/50" \/>\s*<\/div>/g, 'bg-black/50" />');
  
  fs.writeFileSync('src/components/battle/MythicBattlefield.tsx', mythic);
  

  // --- 2. Kurukshetra.tsx ---
  let kuru = fs.readFileSync('src/components/Kurukshetra.tsx', 'utf8');

  if (!kuru.includes('MASTER_QUESTIONS')) {
    kuru = kuru.replace("import 'katex/dist/katex.min.css';", "import 'katex/dist/katex.min.css';\nimport { MASTER_QUESTIONS } from '@/data/mockQuestionsPool';");
  }

  // Wrapper
  kuru = kuru.replace(
    /className=\{`fixed inset-0 z-50 w-full min-h-screen overflow-x-hidden overflow-y-auto p-2 md:p-6 bg-\[#050510\] text-white flex flex-col \$\{shake \? 'animate-\[shake_0\.5s_ease-in-out\]' : ''\}`\}/,
    'className={`min-h-screen w-full flex flex-col overflow-x-hidden bg-[#090D16] text-white ${shake ? \'animate-[shake_0.5s_ease-in-out]\' : \'\'}`}'
  );

  // Header
  kuru = kuru.split('className="relative p-6 flex justify-between items-center border-b border-amber-500/20 bg-black/50 backdrop-blur-md z-10"')
             .join('className="sticky top-0 z-50 p-6 flex justify-between items-center border-b border-amber-500/20 bg-black/50 backdrop-blur-md"');

  // Question Box
  kuru = kuru.split('className="flex-1 bg-black/70 border border-slate-800 rounded-3xl p-8 flex flex-col shadow-2xl relative overflow-hidden backdrop-blur-md z-10"')
             .join('className="w-full max-w-4xl mx-auto flex-1 flex flex-col justify-end md:justify-center p-4 pb-12 bg-black/70 border border-slate-800 rounded-3xl shadow-2xl relative overflow-hidden backdrop-blur-md z-10"');
  
  kuru = kuru.split('<div className="prose prose-invert prose-xl max-w-none font-serif leading-relaxed">')
             .join('<div className="bg-slate-800/50 rounded-xl p-6 mb-4 prose prose-invert prose-xl max-w-none font-serif leading-relaxed">');

  kuru = kuru.split('className="grid grid-cols-2 gap-4"')
             .join('className="grid grid-cols-1 md:grid-cols-2 gap-4"');

  // Fallback function
  const emergencyFunc = `
  const loadEmergencyQuestions = () => {
    setQuestions(MASTER_QUESTIONS.slice(0, 10).sort(() => 0.5 - Math.random()));
  };`;
  if (!kuru.includes('loadEmergencyQuestions')) {
    kuru = kuru.split('const currentQ =').join(emergencyFunc + '\n  const currentQ =');
  }

  // We find {currentQ ? ( and change its else branch
  // The else branch is currently:
  // } : null}
  // We'll just replace that exact string
  kuru = kuru.split('          } : null}').join(`          } : (
            view === 'battle' && (
              <div className="flex-1 flex flex-col items-center justify-center p-8">
                <button onClick={loadEmergencyQuestions} className="px-10 py-6 bg-rose-600 hover:bg-rose-500 text-white font-black text-2xl rounded-2xl shadow-[0_0_50px_rgba(225,29,72,0.8)] animate-pulse border-4 border-rose-400">
                  FORCE LOAD QUESTIONS
                </button>
              </div>
            )
          )}`);

  fs.writeFileSync('src/components/Kurukshetra.tsx', kuru);


  // --- 3. QuickMatchArena.tsx ---
  let quick = fs.readFileSync('src/components/arena/QuickMatchArena.tsx', 'utf8');

  if (!quick.includes('MASTER_QUESTIONS')) {
    quick = quick.replace("import 'katex/dist/katex.min.css';", "import 'katex/dist/katex.min.css';\nimport { MASTER_QUESTIONS } from '@/data/mockQuestionsPool';");
  }

  // Selection Menu Cards
  quick = quick.split('className="grid grid-cols-1 md:grid-cols-2 gap-6"').join('className="w-full flex flex-col gap-4 px-4 md:px-8"');

  // Main wrapper
  quick = quick.replace(
    /className=\{`fixed inset-0 z-50 w-full min-h-screen overflow-x-hidden overflow-y-auto p-2 md:p-6 bg-\[#050510\] text-white flex flex-col \$\{shake \? 'animate-\[shake_0\.5s_ease-in-out\]' : ''\}`\}/,
    'className={`min-h-screen w-full flex flex-col overflow-x-hidden overflow-y-auto bg-[#090D16] text-white ${shake ? \'animate-[shake_0.5s_ease-in-out]\' : \'\'}`}'
  );
  quick = quick.replace(
    'className="fixed inset-0 z-50 w-full min-h-screen overflow-x-hidden overflow-y-auto p-2 md:p-6 bg-[#050510] text-white flex flex-col"',
    'className="min-h-screen w-full flex flex-col overflow-x-hidden overflow-y-auto bg-[#090D16] text-white"'
  );

  // Duel UI Stack (HP Bars)
  quick = quick.split('className="flex justify-between items-center gap-4 bg-[#13192B] border border-slate-800 p-4 md:p-6 rounded-2xl shadow-lg mb-6 relative overflow-hidden"')
               .join('className="flex flex-col md:flex-row justify-between items-center gap-4 bg-[#13192B] border border-slate-800 p-4 md:p-6 rounded-2xl shadow-lg mb-6 relative overflow-hidden w-full"');
  quick = quick.split('className="flex items-center justify-between gap-4 bg-[#13192B] border border-slate-800 p-4 md:p-6 rounded-2xl shadow-lg mb-6 relative overflow-hidden"')
               .join('className="flex flex-col md:flex-row justify-between items-center gap-4 bg-[#13192B] border border-slate-800 p-4 md:p-6 rounded-2xl shadow-lg mb-6 relative overflow-hidden w-full"');

  // Option Grid
  quick = quick.split('className="grid gap-3"').join('className="grid grid-cols-1 md:grid-cols-2 gap-4"');

  // Question Text Box
  quick = quick.split('className="prose prose-invert prose-lg md:prose-xl max-w-none font-serif leading-relaxed"')
               .join('className="bg-slate-800/50 rounded-xl p-6 mb-4 prose prose-invert prose-lg md:prose-xl max-w-none font-serif leading-relaxed w-full"');
  quick = quick.split('className="prose prose-invert prose-xl max-w-none font-serif leading-relaxed"')
               .join('className="bg-slate-800/50 rounded-xl p-6 mb-4 prose prose-invert prose-xl max-w-none font-serif leading-relaxed w-full"');
  quick = quick.split('className="prose prose-invert prose-lg max-w-none font-serif leading-relaxed"')
               .join('className="bg-slate-800/50 rounded-xl p-6 mb-4 prose prose-invert prose-lg max-w-none font-serif leading-relaxed w-full"');

  if (!quick.includes('loadEmergencyQuestions')) {
    quick = quick.split('const currentQ =').join(emergencyFunc + '\n  const currentQ =');
  }

  quick = quick.split('          } : null}').join(`          } : (
            view === 'battle' && (
              <div className="flex-1 flex flex-col items-center justify-center p-8">
                <button onClick={loadEmergencyQuestions} className="px-10 py-6 bg-rose-600 hover:bg-rose-500 text-white font-black text-2xl rounded-2xl shadow-[0_0_50px_rgba(225,29,72,0.8)] animate-pulse border-4 border-rose-400">
                  FORCE LOAD QUESTIONS
                </button>
              </div>
            )
          )}`);

  fs.writeFileSync('src/components/arena/QuickMatchArena.tsx', quick);
  console.log("Safe patches applied.");
}

safePatch();
