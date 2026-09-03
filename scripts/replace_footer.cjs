const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = '<span className="text-[9px] text-emerald-500/70 font-bold tracking-widest uppercase mt-0.5">Lead Architect: Shubranil Saha</span>';
const replacement = '<a href="https://www.linkedin.com/in/shubranil-saha-b463613b3?utm_source=share_via&utm_content=profile&utm_medium=member_android" target="_blank" rel="noreferrer" className="text-[9px] text-emerald-500/70 hover:text-emerald-400 font-bold tracking-widest uppercase mt-0.5 transition-colors block">Lead Architect: Shubranil Saha</a>';

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('src/App.tsx', code, 'utf8');
    console.log('Replaced successfully.');
} else {
    console.log('Target not found in App.tsx');
}
