const fs = require('fs');
let content = fs.readFileSync('src/components/SimulationLab.tsx', 'utf8');

// The write_to_file tool literally wrote \` and \${
content = content.replace(/\\`/g, '`');
content = content.replace(/\\\$/g, '$');
content = content.replace(/\\n/g, '\\n'); // this was string '\\n' -> need '\n' 

fs.writeFileSync('src/components/SimulationLab.tsx', content);
