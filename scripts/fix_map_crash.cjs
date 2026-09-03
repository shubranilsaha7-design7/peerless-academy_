const fs = require('fs');

function fixKurukshetra() {
  let code = fs.readFileSync('src/components/Kurukshetra.tsx', 'utf8');

  // Fix the render map
  code = code.replace(
    /\{currentQ\.options\.map\(\(opt: string, i: number\) => \(/,
    "{(() => { const opts = Array.isArray(currentQ.options_json) ? currentQ.options_json : (typeof currentQ.options_json === 'string' ? JSON.parse(currentQ.options_json) : (currentQ.options || [])); return opts.map((opt: string, i: number) => ("
  );

  // Add the closing braces for the IIFE (immediately invoked function expression) 
  // Wait, the replace string was:
  // {(() => { const opts = ...; return opts.map(...)
  // We need to close the IIFE after the map.
  // The original was: {currentQ.options.map((opt: string, i: number) => ( ... ))}
  // If we replace the first part, the end part `))} ` will be left.
  // So: {(() => { const opts = ...; return opts.map((opt: string, i: number) => (
  // And we need to add `))})()}` at the end?
  
  // It's easier to just do:
  // {(() => { const opts = ...; return opts; })().map((opt: string, i: number) => (
  
  code = code.replace(
    /\{currentQ\.options\.map\(\(opt: string, i: number\) => \(/,
    "{(Array.isArray(currentQ.options_json) ? currentQ.options_json : (typeof currentQ.options_json === 'string' ? JSON.parse(currentQ.options_json) : (currentQ.options || []))).map((opt: string, i: number) => ("
  );

  // Fix handleAnswer correct_option check
  code = code.replace(
    /if \(selectedIndex === currentQ\.correct_index\)/,
    "if (selectedIndex === (currentQ.correct_option !== undefined ? currentQ.correct_option : currentQ.correct_index))"
  );

  // Add a loading/empty state gracefully before rendering currentQ
  // Or just guard the map, which we did.

  fs.writeFileSync('src/components/Kurukshetra.tsx', code);
  console.log('Fixed Kurukshetra.tsx');
}

function fixQuickMatch() {
  let code = fs.readFileSync('src/components/arena/QuickMatchArena.tsx', 'utf8');

  code = code.replace(
    /\{currentQ\.options_json\.map\(\(opt: string, i: number\) => \(/,
    "{(Array.isArray(currentQ.options_json) ? currentQ.options_json : (typeof currentQ.options_json === 'string' ? JSON.parse(currentQ.options_json) : [])).map((opt: string, i: number) => ("
  );

  fs.writeFileSync('src/components/arena/QuickMatchArena.tsx', code);
  console.log('Fixed QuickMatchArena.tsx');
}

fixKurukshetra();
fixQuickMatch();
