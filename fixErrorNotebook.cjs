const fs = require('fs');

let err = fs.readFileSync('src/components/dashboard/ErrorNotebook.tsx', 'utf-8');
err = err.replace(/export default function ErrorNotebook\(\)/, 'export default function ErrorNotebook({ onBack }: { onBack: () => void })');
err = err.replace(/<header className="mb-8">/, `<header className="flex items-center gap-4 mb-8">\n        <button onClick={onBack} className="text-slate-400 hover:text-white transition"><ChevronLeft size={24} /></button>\n        <div>`);
err = err.replace(/<\/header>/, `</div>\n      </header>`);
err = err.replace(/import { BrainCircuit/, 'import { ChevronLeft, BrainCircuit');
fs.writeFileSync('src/components/dashboard/ErrorNotebook.tsx', err);

let app = fs.readFileSync('src/App.tsx', 'utf-8');
app = app.replace(/<ErrorNotebook \/>/, `<ErrorNotebook onBack={() => setActiveRoute('profile')} />`);
fs.writeFileSync('src/App.tsx', app);

console.log('Fixed ErrorNotebook onBack');
