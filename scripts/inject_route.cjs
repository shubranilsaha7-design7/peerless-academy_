const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('QuickMatchArena')) {
  code = code.replace(
    "import Kurukshetra from './components/Kurukshetra';",
    "import Kurukshetra from './components/Kurukshetra';\\nimport QuickMatchArena from './components/arena/QuickMatchArena';"
  );
  
  code = code.replace(
    "if (path.includes('/terms')) return 'terms';",
    "if (path.includes('/terms')) return 'terms';\\n      if (path.includes('/arena/quickmatch')) return 'quickmatch';"
  );

  code = code.replace(
    "if (activeRoute === 'error_notebook') return <ErrorNotebook onBack={() => setActiveRoute('profile')} />;",
    "if (activeRoute === 'error_notebook') return <ErrorNotebook onBack={() => setActiveRoute('profile')} />;\\n    if (activeRoute === 'quickmatch') return <QuickMatchArena onBack={() => setActiveRoute('home')} />;"
  );
}

fs.writeFileSync('src/App.tsx', code);
