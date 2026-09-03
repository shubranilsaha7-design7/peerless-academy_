const fs = require('fs');
let code = fs.readFileSync('src/components/Kurukshetra.tsx', 'utf8');
code = code.replace(/\\`/g, '`').replace(/\\\$/g, '$');
fs.writeFileSync('src/components/Kurukshetra.tsx', code, 'utf8');
console.log('Fixed escaped backticks and dollars in Kurukshetra');
