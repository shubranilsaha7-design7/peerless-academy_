const fs = require('fs');

function fixKurukshetra() {
  let content = fs.readFileSync('src/components/Kurukshetra.tsx', 'utf8');

  // Option buttons
  content = content.replace(
    /className="bg-slate-900\/50 border-2 border-slate-800 hover:border-amber-500 hover:bg-amber-500\/10 hover:shadow-\[0_0_15px_rgba\(245,158,11,0\.2\)\] p-5 rounded-2xl text-left transition-all group"/g,
    'className="bg-slate-800 border border-slate-700 text-white p-4 rounded-xl hover:bg-slate-700 active:bg-blue-600 text-left transition-all group"'
  );

  // Z-index & Text visibility
  content = content.replace(
    /className="bg-slate-800\/50 rounded-xl p-6 mb-4 prose prose-invert prose-xl max-w-none font-serif leading-relaxed text-slate-100 \[\&_\.katex\]:text-slate-100"/g,
    'className="relative z-20 bg-slate-900/90 rounded-xl p-6 mb-4 text-white text-lg md:text-xl font-medium max-w-none leading-relaxed [&_.katex]:text-white shadow-xl"'
  );

  // Fallback if pyqs fetch fails
  content = content.replace(
    /setQuestions\(MASTER_QUESTIONS\.slice\(0, 10\)\); \/\/ Fallback\n          }/g,
    "setQuestions(MASTER_QUESTIONS.slice(0, 10));\n            setView('battle');\n          }"
  );
  content = content.replace(
    /setQuestions\(MASTER_QUESTIONS\.slice\(0, 10\)\); \/\/ Fallback\n        }/g,
    "setQuestions(MASTER_QUESTIONS.slice(0, 10));\n          setView('battle');\n        }"
  );

  fs.writeFileSync('src/components/Kurukshetra.tsx', content);
}

function fixQuickMatch() {
  let content = fs.readFileSync('src/components/arena/QuickMatchArena.tsx', 'utf8');

  // Option buttons
  content = content.replace(
    /className="bg-\[\#0B0F19\] border-2 border-slate-800 hover:border-indigo-500 hover:bg-indigo-500\/10 p-5 rounded-2xl text-left transition-all group shadow-sm"/g,
    'className="bg-slate-800 border border-slate-700 text-white p-4 rounded-xl hover:bg-slate-700 active:bg-blue-600 text-left transition-all group"'
  );

  // Z-index & Text visibility
  content = content.replace(
    /className="bg-slate-800\/50 rounded-xl p-6 mb-4 prose prose-invert prose-lg md:prose-xl max-w-none font-serif leading-relaxed w-full text-slate-100 \[\&_\.katex\]:text-slate-100"/g,
    'className="relative z-20 bg-slate-900/90 rounded-xl p-6 mb-4 text-white text-lg md:text-xl font-medium max-w-none leading-relaxed w-full [&_.katex]:text-white shadow-xl"'
  );

  // Fix Bot Match fallback
  content = content.replace(
    /console\.error\("Supabase Sync Error:", error\);\n      }/g,
    "console.error(\"Supabase Sync Error:\", error);\n        setQuestions(MASTER_QUESTIONS.slice(0, 10).sort(() => 0.5 - Math.random()).slice(0, 5));\n        setView('battle');\n      }"
  );
  
  // Fix Host fetch fallback
  content = content.replace(
    /console\.error\("Supabase Sync Error:", error\);\n                  }/g,
    "console.error(\"Supabase Sync Error:\", error);\n                    const selected = MASTER_QUESTIONS.slice(0, 10).sort(() => 0.5 - Math.random()).slice(0, 5);\n                    channel.send({ type: 'broadcast', event: 'start_match', payload: { questions: selected, hostId: host.user_id, clientId: client.user_id } });\n                    setQuestions(selected);\n                    setView('battle');\n                  }"
  );

  fs.writeFileSync('src/components/arena/QuickMatchArena.tsx', content);
}

function fixCbt() {
  let content = fs.readFileSync('src/components/dashboard/CbtSimulator.tsx', 'utf8');

  // Question container
  content = content.replace(
    /className="bg-slate-900\/50 backdrop-blur-md border border-white\/10 rounded-2xl p-6 sm:p-8 mb-6 shadow-xl text-base sm:text-lg leading-relaxed select-none text-slate-100 \[\&_\.katex\]:text-slate-100"/g,
    'className="relative z-20 bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 mb-6 shadow-xl text-white text-lg md:text-xl font-medium leading-relaxed select-none [&_.katex]:text-white"'
  );

  // Options container
  content = content.replace(
    /className={`w-full text-left p-5 sm:p-6 rounded-2xl border transition-all duration-200 flex gap-5 items-center \${isSelected \? 'bg-cyan-500\/10 border-cyan-500\/50 shadow-\[0_0_25px_rgba\(6,182,212,0\.15\)\] text-cyan-300' : 'bg-slate-900\/80 backdrop-blur-sm border-white\/5 text-slate-300 hover:border-slate-600 hover:bg-slate-800'}`}/g,
    'className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex gap-5 items-center ${isSelected ? \'bg-blue-600 border-blue-500 text-white\' : \'bg-slate-800 border-slate-700 text-white hover:bg-slate-700 active:bg-blue-600\'}`}'
  );

  fs.writeFileSync('src/components/dashboard/CbtSimulator.tsx', content);
}

try {
  fixKurukshetra();
  fixQuickMatch();
  fixCbt();
  console.log("CSS Fixes and fallbacks applied successfully.");
} catch (e) {
  console.error("Error applying CSS fixes:", e);
}
