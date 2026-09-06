const fs = require('fs');

function replaceSVGs() {
  let code = fs.readFileSync('src/components/battle/MythicBattlefield.tsx', 'utf8');

  // Replace Arjuna SVG with img
  code = code.replace(
    /<svg viewBox=\"0 0 100 100\" className=\"w-full drop-shadow-\[0_0_15px_rgba\(34,211,238,0\.6\)\]\">[\s\S]*?<\/svg>/,
    '<img src="/assets/arjuna-anime.png" alt="Arjuna" className="w-full object-contain drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]" />'
  );

  // Replace Karna SVG with img
  code = code.replace(
    /<svg viewBox=\"0 0 100 100\" className=\"w-full drop-shadow-\[0_0_15px_rgba\(225,29,72,0\.6\)\] transform -scale-x-100\">[\s\S]*?<\/svg>/,
    '<img src="/assets/karna-anime.png" alt="Karna" className="w-full object-contain drop-shadow-[0_0_15px_rgba(225,29,72,0.5)] transform -scale-x-100" />'
  );

  fs.writeFileSync('src/components/battle/MythicBattlefield.tsx', code);
  console.log('SVGs replaced with image tags.');
}

replaceSVGs();
