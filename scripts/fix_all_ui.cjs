const fs = require('fs');

function patchFile(filepath) {
  let content = fs.readFileSync(filepath, 'utf8');

  // Fix options_json mapping
  content = content.replace(
    /currentQ\.options\.map/g,
    "(currentQ.options || currentQ.options_json || []).map"
  );
  content = content.replace(
    /q\.options\.map/g,
    "(q.options || q.options_json || []).map"
  );

  // Fix Latex text color being dark
  // Find Latex wrappers and add text-white or similar
  // CbtSimulator text wrapper
  content = content.replace(
    /className="bg-slate-900\/50 backdrop-blur-md border border-white\/10 rounded-2xl p-6 sm:p-8 mb-6 shadow-xl text-base sm:text-lg leading-relaxed select-none"/g,
    'className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 mb-6 shadow-xl text-base sm:text-lg leading-relaxed select-none text-slate-100 [&_.katex]:text-slate-100"'
  );

  // CbtSimulator options wrapper
  content = content.replace(
    /className="flex-1 text-base select-none"/g,
    'className="flex-1 text-base select-none text-slate-100 [&_.katex]:text-slate-100"'
  );

  // Kurukshetra/QuickMatch text wrapper
  content = content.replace(
    /className="bg-slate-800\/50 rounded-xl p-6 mb-4 prose prose-invert prose-xl max-w-none font-serif leading-relaxed"/g,
    'className="bg-slate-800/50 rounded-xl p-6 mb-4 prose prose-invert prose-xl max-w-none font-serif leading-relaxed text-slate-100 [&_.katex]:text-slate-100"'
  );
  content = content.replace(
    /className="bg-slate-800\/50 rounded-xl p-6 mb-4 prose prose-invert prose-lg md:prose-xl max-w-none font-serif leading-relaxed w-full"/g,
    'className="bg-slate-800/50 rounded-xl p-6 mb-4 prose prose-invert prose-lg md:prose-xl max-w-none font-serif leading-relaxed w-full text-slate-100 [&_.katex]:text-slate-100"'
  );
  content = content.replace(
    /className="bg-slate-800\/50 rounded-xl p-6 mb-4 prose prose-invert prose-xl max-w-none font-serif leading-relaxed w-full"/g,
    'className="bg-slate-800/50 rounded-xl p-6 mb-4 prose prose-invert prose-xl max-w-none font-serif leading-relaxed w-full text-slate-100 [&_.katex]:text-slate-100"'
  );

  // QuickMatch options text
  // They are usually just rendering <Latex>{opt}</Latex> inside a button or div
  content = content.replace(
    /<div className="flex-1 text-base md:text-lg font-medium text-slate-200">/g,
    '<div className="flex-1 text-base md:text-lg font-medium text-slate-100 [&_.katex]:text-slate-100">'
  );
  content = content.replace(
    /<div className="flex-1 text-base md:text-lg font-medium">/g,
    '<div className="flex-1 text-base md:text-lg font-medium text-slate-100 [&_.katex]:text-slate-100">'
  );
  content = content.replace(
    /<div className="flex-1 text-base font-medium">/g,
    '<div className="flex-1 text-base font-medium text-slate-100 [&_.katex]:text-slate-100">'
  );
  content = content.replace(
    /<div className="flex-1 text-base sm:text-lg font-medium">/g,
    '<div className="flex-1 text-base sm:text-lg font-medium text-slate-100 [&_.katex]:text-slate-100">'
  );
  
  // Quick fix: replace `<Latex>` with a wrapping span just in case the above div replaces failed
  // Not strictly necessary if we target the katex class globally, but just to be sure:
  // If the above replaces work, it's fine.

  fs.writeFileSync(filepath, content);
}

const files = [
  'src/components/dashboard/CbtSimulator.tsx',
  'src/components/Kurukshetra.tsx',
  'src/components/arena/QuickMatchArena.tsx'
];

files.forEach(f => {
  try {
    patchFile(f);
    console.log('Patched ' + f);
  } catch (e) {
    console.error('Failed to patch ' + f, e.message);
  }
});
