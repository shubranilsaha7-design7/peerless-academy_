const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Remove from root div
code = code.replace(
  /className="flex flex-col min-h-screen w-full overflow-x-hidden overflow-y-auto/g,
  'className="flex flex-col min-h-screen w-full overflow-x-hidden'
);

// Remove from motion.div
code = code.replace(
  /className="flex-1 overflow-y-auto overscroll-y-contain/g,
  'className="flex-1 pb-[env(safe-area-inset-bottom)] relative"'
);
// Also clean up any leftover from that replacement if it was duplicated
code = code.replace(
  /className="flex-1 pb-\[env\(safe-area-inset-bottom\)\] relative" pb-\[env\(safe-area-inset-bottom\)\] scroll-smooth relative"/g,
  'className="flex-1 pb-[env(safe-area-inset-bottom)] relative"'
);

fs.writeFileSync('src/App.tsx', code);
