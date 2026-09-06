const fs = require('fs');
let p = fs.readFileSync('src/components/dashboard/ProfileDashboard.tsx', 'utf-8');
p = p.replace(/User, Shield, BrainCircuit, Target, Network, Settings, X, LogOut, Clock/, 'User, Shield, BrainCircuit, Target, Network, Settings, X, LogOut, Clock, Trophy');
p = p.replace(/label: 'Flashcards'/g, "label: 'Error Notebook'");
p = p.replace(/id: 'flashcards'/g, "id: 'error_notebook'");
fs.writeFileSync('src/components/dashboard/ProfileDashboard.tsx', p);
console.log('Fixed ProfileDashboard');
