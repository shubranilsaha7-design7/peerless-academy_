const fs = require('fs');

function patchAll() {
  // 1. App.tsx - Home Page Banner
  let app = fs.readFileSync('src/App.tsx', 'utf8');
  app = app.replace(
    '<div className="relative mx-auto grid w-full max-w-[1240px] items-center gap-12 lg:grid-cols-[1.08fr_.92fr]">',
    '<div className="relative z-20 mx-auto grid w-full max-w-[1240px] items-center gap-12 lg:grid-cols-[1.08fr_.92fr] text-white">'
  );
  app = app.replace(
    '<h1 className="max-w-[720px] text-[clamp(3.2rem,7.5vw,6.5rem)] font-black leading-[.94] tracking-[-.065em]">',
    '<h1 className="text-white max-w-[720px] text-[clamp(3.2rem,7.5vw,6.5rem)] font-black leading-[.94] tracking-[-.065em] relative z-20">'
  );
  fs.writeFileSync('src/App.tsx', app);

  // 2. QuickMatchArena.tsx - Remove setTimeouts
  let qm = fs.readFileSync('src/components/arena/QuickMatchArena.tsx', 'utf8');
  qm = qm.replace(/setTimeout\(\(\) => setView\('battle'\), 1500\);/g, "setView('battle');");
  qm = qm.replace(/setTimeout\(\(\) => setView\('battle'\), 1000\);/g, "setView('battle');");
  fs.writeFileSync('src/components/arena/QuickMatchArena.tsx', qm);

  // 3. Kurukshetra.tsx - Remove setTimeouts
  let kur = fs.readFileSync('src/components/Kurukshetra.tsx', 'utf8');
  kur = kur.replace(/setTimeout\(\(\) => setView\('battle'\), 2000\);/g, "setView('battle');");
  kur = kur.replace(/setTimeout\(\(\) => setView\('battle'\), 1000\);/g, "setView('battle');");
  fs.writeFileSync('src/components/Kurukshetra.tsx', kur);

  // 4. CustomTestBuilder.tsx - Force Question Rendering
  let ctb = fs.readFileSync('src/components/dashboard/CustomTestBuilder.tsx', 'utf8');
  if (!ctb.includes('5. Preview Pool')) {
    if (!ctb.includes('import Latex')) {
      ctb = ctb.replace("import { MASTER_QUESTIONS } from '@/data/mockQuestionsPool';", "import { MASTER_QUESTIONS } from '@/data/mockQuestionsPool';\nimport Latex from 'react-latex-next';\nimport 'katex/dist/katex.min.css';");
    }
    const previewBlock = `
        <section>
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2"><Layers size={14}/> 5. Preview Pool</h3>
          <div className="space-y-3">
            {MASTER_QUESTIONS.slice(0, 10).map((q, idx) => (
              <div key={idx} className="text-white bg-slate-800 p-4 rounded-lg shadow-lg">
                <Latex>{q.question_latex}</Latex>
              </div>
            ))}
          </div>
        </section>
      </main>
`;
    ctb = ctb.replace('</main>', previewBlock);
    fs.writeFileSync('src/components/dashboard/CustomTestBuilder.tsx', ctb);
  }

  // 5. CbtSimulator.tsx - Remove OLED engine blocks
  let cbt = fs.readFileSync('src/components/dashboard/CbtSimulator.tsx', 'utf8');
  // Auto-start test if not active
  cbt = cbt.replace(
    'const { infractions } = useProctoring(\'temp-user-id\', \'temp-session-id\', isTestActive);',
    'const { infractions } = useProctoring(\'temp-user-id\', \'temp-session-id\', isTestActive);\n  useEffect(() => { if (!isTestActive) startTest(); }, [isTestActive, startTest]);'
  );
  // Hide the loading/initializing screens
  cbt = cbt.replace(/if \(loading\) \{[\s\S]*?Hydrating OLED Engine\.\.\.[\s\S]*?<\/div>;\s*\}/g, 'if (loading) return null;');
  cbt = cbt.replace(/if \(!isTestActive\) \{[\s\S]*?INITIALIZE ENGINE[\s\S]*?<\/div>\s*\);\s*\}/g, 'if (!isTestActive) return null;');
  fs.writeFileSync('src/components/dashboard/CbtSimulator.tsx', cbt);
}

patchAll();
console.log('Applied emergency patches.');
