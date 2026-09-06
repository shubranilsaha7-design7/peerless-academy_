const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf-8');

const errorNotebookImport = `import ErrorNotebook from './components/dashboard/ErrorNotebook';`;
if (!app.includes('ErrorNotebook')) {
  app = app.replace(
    `import ProfileDashboard from './components/dashboard/ProfileDashboard';`,
    `import ProfileDashboard from './components/dashboard/ProfileDashboard';\n${errorNotebookImport}`
  );
}

const errorNotebookRoute = `    if (activeRoute === 'error_notebook') return <ErrorNotebook />;\n`;
if (!app.includes('activeRoute === \'error_notebook\'')) {
  app = app.replace(
    `if (activeRoute === 'video') return <AdvancedVideoPlayer />;`,
    `if (activeRoute === 'video') return <AdvancedVideoPlayer />;\n${errorNotebookRoute}`
  );
}

fs.writeFileSync('src/App.tsx', app);
console.log('Injected ErrorNotebook into App.tsx');
