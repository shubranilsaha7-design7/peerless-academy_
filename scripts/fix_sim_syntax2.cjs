const fs = require('fs');
let content = fs.readFileSync('src/components/SimulationLab.tsx', 'utf8');

content = content.replace(/\\`\\\$\\{Math/g, '\`${Math');
content = content.replace(/\\}%\\`/g, '}%\`');

// Also let's fix the toggle button string templates
content = content.replace(/\\\$\\{showVectors \? 'bg-cyan-500' : 'bg-slate-700'\\}/g, '${showVectors ? \'bg-cyan-500\' : \'bg-slate-700\'}');
content = content.replace(/\\\$\\{showVectors \? 'translate-x-7' : 'translate-x-1'\\}/g, '${showVectors ? \'translate-x-7\' : \'translate-x-1\'}');

fs.writeFileSync('src/components/SimulationLab.tsx', content);
