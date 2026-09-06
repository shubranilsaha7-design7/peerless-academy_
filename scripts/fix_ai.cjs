const fs = require('fs');

// 1. Fix backend.ts
let backend = fs.readFileSync('src/lib/backend.ts', 'utf8');
backend = backend.replace(
  /const apiKey = import\.meta\.env\.VITE_GEMINI_API_KEY \|\| ".*?";/,
  "const apiKey = import.meta.env.VITE_GEMINI_API_KEY;"
);
fs.writeFileSync('src/lib/backend.ts', backend);

// 2. Fix AIChatBot.tsx
let chatBot = fs.readFileSync('src/components/AIChatBot.tsx', 'utf8');
chatBot = chatBot.replace(
  /if \(\/402\|credit\/i\.test\(message\)\) \{[\s\S]*?\}/,
  "console.error('Raw AI API Error:', err);"
);
fs.writeFileSync('src/components/AIChatBot.tsx', chatBot);
