const fs = require('fs');
let code = fs.readFileSync('src/components/battle/MythicBattlefield.tsx', 'utf8');

const arjunaBlock = `<div className="w-full aspect-[3/4] overflow-hidden rounded-xl relative shadow-[0_0_30px_rgba(34,211,238,0.5)] border-2 border-cyan-500/50">
              <img src="/assets/mythic-battle.jpg" alt="Arjuna" className="absolute top-0 left-0 w-[200%] h-full max-w-none object-cover object-left" />
            </div>`;

const karnaBlock = `<div className="w-full aspect-[3/4] overflow-hidden rounded-xl relative shadow-[0_0_30px_rgba(225,29,72,0.5)] border-2 border-rose-500/50">
              <img src="/assets/mythic-battle.jpg" alt="Karna" className="absolute top-0 right-0 w-[200%] h-full max-w-none object-cover object-right" />
            </div>`;

code = code.replace(
  /<motion\.div animate=\{attackAnimation === 'player' \? \{ x: \[0, 20, 0\] \} : \{\}\} transition=\{\{ duration: 0\.3 \}\} className="w-full">[\s\S]*?<\/motion\.div>/,
  `<motion.div animate={attackAnimation === 'player' ? { x: [0, 20, 0] } : {}} transition={{ duration: 0.3 }} className="w-full">\n            ${arjunaBlock}\n          </motion.div>`
);

code = code.replace(
  /<motion\.div animate=\{attackAnimation === 'enemy' \? \{ x: \[0, -20, 0\] \} : \{\}\} transition=\{\{ duration: 0\.3 \}\} className="w-full">[\s\S]*?<\/motion\.div>/,
  `<motion.div animate={attackAnimation === 'enemy' ? { x: [0, -20, 0] } : {}} transition={{ duration: 0.3 }} className="w-full">\n            ${karnaBlock}\n          </motion.div>`
);

fs.writeFileSync('src/components/battle/MythicBattlefield.tsx', code);
