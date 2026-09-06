const fs = require('fs');

// 1. App.tsx
let app = fs.readFileSync('src/App.tsx', 'utf-8');
if (!app.includes("import Kurukshetra from './components/Kurukshetra';")) {
  app = app.replace("import KurukshetraHub from './components/dashboard/KurukshetraHub';", "import KurukshetraHub from './components/dashboard/KurukshetraHub';\nimport Kurukshetra from './components/Kurukshetra';");
}
fs.writeFileSync('src/App.tsx', app);

// 2. ProfileDashboard.tsx
let profile = fs.readFileSync('src/components/dashboard/ProfileDashboard.tsx', 'utf-8');
profile = profile.replace(/import \{ Trophy \} from 'lucide-react';\n/g, ''); // just in case
profile = profile.replace(/Clock, Trophy/, 'Clock'); // remove the one I injected
profile = profile.replace(/User, Shield, BrainCircuit, Target, Network, Settings, X, LogOut, Clock/, 'User, Shield, BrainCircuit, Target, Network, Settings, X, LogOut, Clock, Trophy');
fs.writeFileSync('src/components/dashboard/ProfileDashboard.tsx', profile);

// 3. Kurukshetra.tsx
let kur = fs.readFileSync('src/components/Kurukshetra.tsx', 'utf-8');
kur = kur.replace(/let timer: NodeJS\.Timeout;/g, 'let timer: ReturnType<typeof setInterval>;');
fs.writeFileSync('src/components/Kurukshetra.tsx', kur);

// 4. CbtSimulator.tsx
let cbt = fs.readFileSync('src/components/dashboard/CbtSimulator.tsx', 'utf-8');
cbt = cbt.replace(/case 'marked':/g, "case 'not_answered_marked':");
cbt = cbt.replace(/selectOption\(i\)/g, "selectOption(currentQ.id, i)");
cbt = cbt.replace(/onClick=\{markReview\}/g, "onClick={() => markReview(currentQ.id)}");
cbt = cbt.replace(/onClick=\{clearResponse\}/g, "onClick={() => clearResponse(currentQ.id)}");
fs.writeFileSync('src/components/dashboard/CbtSimulator.tsx', cbt);

console.log('Fixed Type errors');
