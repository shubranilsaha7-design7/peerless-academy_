const fs = require('fs');

// Fix ActivitySquare in SimulationLab
let sim = fs.readFileSync('src/components/SimulationLab.tsx', 'utf8');
sim = sim.replace(/<ActivitySquare size=\{14\} \/>/g, '<Activity size={14} />');
fs.writeFileSync('src/components/SimulationLab.tsx', sim);

// Fix options_json type error in CbtSimulator
let cbt = fs.readFileSync('src/components/dashboard/CbtSimulator.tsx', 'utf8');
cbt = cbt.replace(
  '(currentQ.options || currentQ.options_json || []).map((opt: any, i: number)',
  '(currentQ.options || (currentQ as any).options_json || []).map((opt: any, i: number)'
);
fs.writeFileSync('src/components/dashboard/CbtSimulator.tsx', cbt);

let kuru = fs.readFileSync('src/components/Kurukshetra.tsx', 'utf8');
kuru = kuru.replace(
  '(currentQ.options || currentQ.options_json || []).map',
  '(currentQ.options || (currentQ as any).options_json || []).map'
);
fs.writeFileSync('src/components/Kurukshetra.tsx', kuru);

let quick = fs.readFileSync('src/components/arena/QuickMatchArena.tsx', 'utf8');
quick = quick.replace(
  '(currentQ.options || currentQ.options_json || []).map',
  '(currentQ.options || (currentQ as any).options_json || []).map'
);
fs.writeFileSync('src/components/arena/QuickMatchArena.tsx', quick);

console.log("Fixed types");
