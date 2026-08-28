const fs = require('fs');

// App.tsx
let app = fs.readFileSync('src/App.tsx', 'utf-8');
app = app.replace(/ArenaHub/g, 'KurukshetraHub');
app = app.replace(/arena_hub/g, 'kurukshetra_hub');
app = app.replace(/isArenaOpen/g, 'isKurukshetraOpen');
app = app.replace(/setIsArenaOpen/g, 'setIsKurukshetraOpen');
app = app.replace(/openArena/g, 'openKurukshetra');
app = app.replace(/<Arena onBack/g, '<Kurukshetra onBack');
app = app.replace(/'arena'/g, "'kurukshetra'");
app = app.replace(/"arena"/g, '"kurukshetra"');

// Replace imports
app = app.replace(/import ArenaHub from '.\/components\/dashboard\/ArenaHub';/g, "import KurukshetraHub from './components/dashboard/KurukshetraHub';");
app = app.replace(/import Arena from '.\/components\/Arena';/g, "import Kurukshetra from './components/Kurukshetra';");
fs.writeFileSync('src/App.tsx', app);

// BottomTabBar.tsx
let bot = fs.readFileSync('src/components/layout/BottomTabBar.tsx', 'utf-8');
bot = bot.replace(/label: 'Arena'/g, "label: 'Kurukshetra'");
bot = bot.replace(/id: 'arena'/g, "id: 'kurukshetra'");
bot = bot.replace(/route: 'arena_hub'/g, "route: 'kurukshetra_hub'");
fs.writeFileSync('src/components/layout/BottomTabBar.tsx', bot);

console.log('Renamed Arena to Kurukshetra in App and BottomTabBar');
