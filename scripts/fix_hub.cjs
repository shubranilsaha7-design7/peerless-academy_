const fs = require('fs');
let content = fs.readFileSync('src/components/dashboard/KurukshetraHub.tsx', 'utf8');

content = content.replace(
  '<main className="flex-1 p-6 overflow-y-auto space-y-6">',
  '<main className="flex-1 p-6 overflow-y-auto space-y-6 pb-28 relative z-10">'
);

// Add the requested classes to buttons
content = content.replace(
  'className="w-full relative overflow-hidden group p-6 rounded-3xl border border-coral/30 bg-gradient-to-br from-slate-900 to-slate-950 text-left"',
  'className="w-full relative z-20 cursor-pointer overflow-hidden group p-6 rounded-3xl border border-coral/30 hover:border-blue-500 bg-gradient-to-br from-slate-900 to-slate-950 hover:bg-slate-800/80 transition-all text-left"'
);

content = content.replace(
  'className="w-full relative overflow-hidden group p-6 rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-slate-900 to-slate-950 text-left"',
  'className="w-full relative z-20 cursor-pointer overflow-hidden group p-6 rounded-3xl border border-indigo-500/30 hover:border-blue-500 bg-gradient-to-br from-slate-900 to-slate-950 hover:bg-slate-800/80 transition-all text-left"'
);

content = content.replace(
  'className="w-full relative overflow-hidden group p-6 rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-slate-900 to-slate-950 text-left"',
  'className="w-full relative z-20 cursor-pointer overflow-hidden group p-6 rounded-3xl border border-emerald-500/30 hover:border-blue-500 bg-gradient-to-br from-slate-900 to-slate-950 hover:bg-slate-800/80 transition-all text-left"'
);

content = content.replace(
  'className="w-full relative overflow-hidden group p-6 rounded-3xl border border-amber-500/30 bg-gradient-to-br from-slate-900 to-slate-950 text-left"',
  'className="w-full relative z-20 cursor-pointer overflow-hidden group p-6 rounded-3xl border border-amber-500/30 hover:border-blue-500 bg-gradient-to-br from-slate-900 to-slate-950 hover:bg-slate-800/80 transition-all text-left"'
);

fs.writeFileSync('src/components/dashboard/KurukshetraHub.tsx', content);
