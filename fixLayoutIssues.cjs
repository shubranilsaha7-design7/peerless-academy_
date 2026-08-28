const fs = require('fs');

// 1. Fix App.tsx duplicate BottomTabBar and footer padding
let app = fs.readFileSync('src/App.tsx', 'utf-8');

// Remove the second BottomTabBar
const duplicateTabBar = `<BottomTabBar activeRoute={activeRoute} setActiveRoute={setActiveRoute} openAiDoubt={() => setIsDoubtOpen(true)} />
      <AIDoubtSolver`;

app = app.replace(duplicateTabBar, `<AIDoubtSolver`);

// Add padding to footer
const oldFooterClass = `<footer className={\`border-t px-5 py-12 lg:px-8`;
const newFooterClass = `<footer className={\`border-t px-5 pt-12 pb-28 lg:px-8 lg:pb-32`;
app = app.replace(oldFooterClass, newFooterClass);

fs.writeFileSync('src/App.tsx', app);

// 2. Fix BroadcastBanner spans
let banner = fs.readFileSync('src/components/BroadcastBanner.tsx', 'utf-8');

const oldSpans = `<span className="pr-12 whitespace-nowrap flex-shrink-0">{banner.message}</span>
                  <span className="pr-12 whitespace-nowrap flex-shrink-0">{banner.message}</span>`;
                  
const newSpans = `<span className="pr-12 whitespace-nowrap flex-shrink-0">{banner.message}</span>
                  <span className="pr-12 whitespace-nowrap flex-shrink-0">{banner.message}</span>
                  <span className="pr-12 whitespace-nowrap flex-shrink-0">{banner.message}</span>
                  <span className="pr-12 whitespace-nowrap flex-shrink-0">{banner.message}</span>`;

banner = banner.replace(oldSpans, newSpans);
fs.writeFileSync('src/components/BroadcastBanner.tsx', banner);

console.log('Fixed duplicate bottom bar, footer padding, and banner spans');
