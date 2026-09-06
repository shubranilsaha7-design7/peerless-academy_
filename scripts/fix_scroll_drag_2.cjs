const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /drag="x"[\s\S]*?className="flex-1 overflow-y-auto overscroll-y-contain pb-\[env\(safe-area-inset-bottom\)\] scroll-smooth relative"/;
code = code.replace(regex, 'className="flex-1 overflow-y-auto overscroll-y-contain pb-[env(safe-area-inset-bottom)] scroll-smooth relative"');

fs.writeFileSync('src/App.tsx', code);
