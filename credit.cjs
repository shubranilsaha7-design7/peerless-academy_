const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// The original line has © which might be rendered weirdly, but usually standard UTF-8 works.
// Let's use a regex that catches the 2026 Peerless Academy string
const regex = /<span>(?:©|Ac|)\s*2026 Peerless Academy\. Made for the next breakthrough\.<\/span>/g;

const replacement = `<div className="flex flex-col gap-1 text-center md:text-left">
            <span>© 2026 Peerless Academy. Made for the next breakthrough.</span>
            <span className="text-[9px] text-emerald-500/70 font-bold tracking-widest uppercase mt-0.5">Lead Architect: Shubranil Saha</span>
          </div>`;

code = code.replace(regex, replacement);

fs.writeFileSync('src/App.tsx', code, 'utf8');
console.log('Credit injected');
