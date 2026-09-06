const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// The block to replace is:
/*
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(e: any, { offset }: any) => {
            const swipe = offset.x;
            const routes = ['home', 'kurukshetra_hub', 'video', 'profile'];
            const i = routes.indexOf(activeRoute);
            if (swipe < -50 && i !== -1 && i < routes.length - 1) {
              setActiveRoute(routes[i + 1]);
            } else if (swipe > 50 && i > 0) {
              setActiveRoute(routes[i - 1]);
            }
          }}
*/
code = code.replace(
  /drag="x"[\s\S]*?\}\}\n\s*className="/m,
  'className="'
);

// We should also remove 'h-[100dvh]' if it's there. Just make sure the root div doesn't have overflow-hidden.
// Check index.css as well, I checked it before and html { scroll-behavior: smooth; } was there.

fs.writeFileSync('src/App.tsx', code);
