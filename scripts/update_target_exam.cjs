const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('targetExam')) {
  // Add targetExam state
  code = code.replace(
    /const \[level,\s*setLevel\]\s*=\s*useState\(1\);/,
    "const [level, setLevel] = useState(1);\n  const [targetExam, setTargetExam] = useState<string>('');"
  );

  // Modify fetchUserStats
  code = code.replace(
    /select\('xp, streak, level'\)/,
    "select('xp, streak, level, target_exam')"
  );

  code = code.replace(
    /if \(data\) \{ setXp\(data\.xp \|\| 0\); setStreak\(data\.streak \|\| 0\); setLevel\(data\.level \|\| 1\); \}/,
    "if (data) { setXp(data.xp || 0); setStreak(data.streak || 0); setLevel(data.level || 1); setTargetExam(data.target_exam || ''); }"
  );

  // Inject Target Exam banner after Hero (before Ticker Strip or inside Hero)
  // Let's add it right below the Hero section.
  code = code.replace(
    /<LifeAtPeerless \/>/,
    "{targetExam && (\n          <div className=\"bg-indigo-600 text-white font-black text-center py-3 uppercase tracking-widest text-sm shadow-md\">\n            Target: {targetExam} 2026\n          </div>\n        )}\n        <LifeAtPeerless />"
  );
}

fs.writeFileSync('src/App.tsx', code);
