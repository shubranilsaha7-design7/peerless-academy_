const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('const [isOnboarded, setIsOnboarded] = useState(true)')) {
  code = code.replace(
    /const \[activeRoute,\s*setActiveRoute\]\s*=\s*useState/,
    "const [isOnboarded, setIsOnboarded] = useState(true);\n  const [activeRoute,  setActiveRoute]  = useState"
  );
}

if (!code.includes('targetExam')) {
  code = code.replace(
    /const \[level,\s*setLevel\]\s*=\s*useState\(1\);/,
    "const [level, setLevel] = useState(1);\n  const [targetExam, setTargetExam] = useState<string>('');"
  );

  code = code.replace(
    /select\('xp, streak, level'\)/,
    "select('xp, streak, level, target_exam')"
  );

  code = code.replace(
    /if \(data\) \{ setXp\(data\.xp \|\| 0\); setStreak\(data\.streak \|\| 0\); setLevel\(data\.level \|\| 1\); \}/,
    "if (data) { setXp(data.xp || 0); setStreak(data.streak || 0); setLevel(data.level || 1); setTargetExam(data.target_exam || ''); }"
  );

  code = code.replace(
    /<LifeAtPeerless \/>/,
    "{targetExam && (\n          <div className=\"bg-indigo-600 text-white font-black text-center py-3 uppercase tracking-widest text-sm shadow-md\">\n            Target: {targetExam} 2026\n          </div>\n        )}\n        <LifeAtPeerless />"
  );
}

// Pass targetExam to StudyHub
code = code.replace(
  /<StudyHub \/>/,
  "<StudyHub targetExam={targetExam} />"
);

fs.writeFileSync('src/App.tsx', code);
