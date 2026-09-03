const fs = require('fs');

// 1. Update tailwind.config.js for deep zinc night mode
let tailwind = fs.readFileSync('tailwind.config.js', 'utf8');
if (!tailwind.includes('#090D16')) {
  tailwind = tailwind.replace('extend: {', "extend: { colors: { obsidian: '#090D16' },");
  fs.writeFileSync('tailwind.config.js', tailwind);
}

// 2. Inject script into index.html for zero-flicker
let html = fs.readFileSync('index.html', 'utf8');
if (!html.includes('peerless-theme')) {
  const script = `  <script>
    (function() {
      try {
        var theme = localStorage.getItem('peerless-theme');
        if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } catch (e) {}
    })();
  </script>`;
  html = html.replace('</head>', script + '\n  </head>');
  fs.writeFileSync('index.html', html);
}

// 3. Fix App.tsx dark:bg-black to dark:bg-obsidian
let app = fs.readFileSync('src/App.tsx', 'utf8');
app = app.replace(/dark:bg-black/g, 'dark:bg-obsidian');
app = app.replace(/flex flex-col h-\[100dvh\] w-full overflow-hidden/g, 'flex flex-col h-[100dvh] w-full overflow-x-hidden overflow-y-hidden');
fs.writeFileSync('src/App.tsx', app);

console.log("Module 4 applied.");
