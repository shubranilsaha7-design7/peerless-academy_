const fs = require('fs');

let cbt = fs.readFileSync('src/components/dashboard/CbtSimulator.tsx', 'utf8');
cbt = cbt.replace(
  '(currentQ.options || currentQ.options_json || []).map',
  '(currentQ.options || (currentQ as any).options_json || []).map'
);
fs.writeFileSync('src/components/dashboard/CbtSimulator.tsx', cbt);

console.log("Fixed CbtSimulator types");
