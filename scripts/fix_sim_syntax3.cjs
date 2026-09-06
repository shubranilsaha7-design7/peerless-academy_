const fs = require('fs');
let content = fs.readFileSync('src/components/SimulationLab.tsx', 'utf8');

content = content.replace(/\\\`\\\$\\{Math\.min/g, '\`${Math.min');
content = content.replace(/\\}%\\\`/g, '}%\`');
content = content.replace(/\\\$\\{showVectors \\? 'bg-cyan-500' : 'bg-slate-700'\\}/g, '${showVectors ? \'bg-cyan-500\' : \'bg-slate-700\'}');
content = content.replace(/\\\$\\{showVectors \\? 'translate-x-7' : 'translate-x-1'\\}/g, '${showVectors ? \'translate-x-7\' : \'translate-x-1\'}');

fs.writeFileSync('src/components/SimulationLab.tsx', content);
