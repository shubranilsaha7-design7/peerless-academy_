const fs = require('fs');

let cbt = fs.readFileSync('src/components/dashboard/CbtSimulator.tsx', 'utf8');

cbt = cbt.replace(
  '{currentQ.options.map((opt, i) => {',
  '{(currentQ.options || currentQ.options_json || []).map((opt: any, i: number) => {'
);

cbt = cbt.replace(
  '<div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 mb-6 shadow-xl text-base sm:text-lg leading-relaxed select-none">',
  '<div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 mb-6 shadow-xl text-base sm:text-lg leading-relaxed select-none text-slate-100">'
);

fs.writeFileSync('src/components/dashboard/CbtSimulator.tsx', cbt);
console.log('Fixed CbtSimulator');
