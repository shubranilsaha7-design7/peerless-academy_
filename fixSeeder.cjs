const fs = require('fs');
let script = fs.readFileSync('scripts/seed_kurukshetra_bank.ts', 'utf-8');
script = script.replace(/path\.resolve\(__dirname, '\.\.\/\.env'\)/, 'new URL("../.env", import.meta.url).pathname');
// Windows paths with file:/// URL pathname prefix can be tricky with dotenv, better to just use standard .env loading if we run from root.
script = script.replace(/dotenv\.config\(\{ path:.*\);/, 'dotenv.config(); // defaults to ./.env in cwd');
fs.writeFileSync('scripts/seed_kurukshetra_bank.ts', script);
console.log('Fixed dirname error');
