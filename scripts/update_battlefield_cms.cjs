const fs = require('fs');
let code = fs.readFileSync('src/components/battle/MythicBattlefield.tsx', 'utf8');

const arjunaBlock = `{arjunaImageSrc ? (
              <img src={arjunaImageSrc} alt="Arjuna" className="w-full object-contain drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
            ) : (
              <div className="w-full aspect-[3/4] overflow-hidden rounded-xl relative shadow-[0_0_30px_rgba(34,211,238,0.5)] border-2 border-cyan-500/50">
                <img src="/assets/mythic-battle.jpg" alt="Arjuna" className="absolute top-0 left-0 w-[200%] h-full max-w-none object-cover object-left" />
              </div>
            )}`;

const karnaBlock = `{karnaImageSrc ? (
              <img src={karnaImageSrc} alt="Karna" className="w-full object-contain drop-shadow-[0_0_15px_rgba(225,29,72,0.5)] transform -scale-x-100" />
            ) : (
              <div className="w-full aspect-[3/4] overflow-hidden rounded-xl relative shadow-[0_0_30px_rgba(225,29,72,0.5)] border-2 border-rose-500/50">
                <img src="/assets/mythic-battle.jpg" alt="Karna" className="absolute top-0 right-0 w-[200%] h-full max-w-none object-cover object-right" />
              </div>
            )}`;

code = code.replace(
  /<div className="w-full aspect-\[3\/4\] overflow-hidden rounded-xl relative shadow-\[0_0_30px_rgba\(34,211,238,0\.5\)\] border-2 border-cyan-500\/50\">\s*<img src="\/assets\/mythic-battle\.jpg" alt="Arjuna" className="absolute top-0 left-0 w-\[200%\] h-full max-w-none object-cover object-left" \/>\s*<\/div>/,
  arjunaBlock
);

code = code.replace(
  /<div className="w-full aspect-\[3\/4\] overflow-hidden rounded-xl relative shadow-\[0_0_30px_rgba\(225,29,72,0\.5\)\] border-2 border-rose-500\/50\">\s*<img src="\/assets\/mythic-battle\.jpg" alt="Karna" className="absolute top-0 right-0 w-\[200%\] h-full max-w-none object-cover object-right" \/>\s*<\/div>/,
  karnaBlock
);

fs.writeFileSync('src/components/battle/MythicBattlefield.tsx', code);
