const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('AdminSeedTrigger')) {
  code = code.replace(
    /import AdminDashboard\s+from\s+['"]@\/components\/admin\/AdminDashboard['"];/,
    "import AdminDashboard from '@/components/admin/AdminDashboard';\\nimport AdminSeedTrigger from './components/admin/AdminSeedTrigger';"
  );
  
  code = code.replace(
    "if (path.includes('/terms')) return 'terms';",
    "if (path.includes('/terms')) return 'terms';\\n      if (path.includes('/admin/seed-trigger')) return 'seed-trigger';"
  );

  code = code.replace(
    "if (activeRoute === 'quickmatch') return <QuickMatchArena onBack={() => setActiveRoute('home')} />;",
    "if (activeRoute === 'quickmatch') return <QuickMatchArena onBack={() => setActiveRoute('home')} />;\\n    if (activeRoute === 'seed-trigger') return <AdminSeedTrigger onBack={() => setActiveRoute('admin')} />;"
  );
}

fs.writeFileSync('src/App.tsx', code);
