const fs = require('fs');
let code = fs.readFileSync('src/components/StudyHub.tsx', 'utf8');

if (!code.includes('targetExam?: string')) {
  // Add targetExam prop
  code = code.replace(
    /export default function StudyHub\(\) \{/,
    "export default function StudyHub({ targetExam }: { targetExam?: string }) {"
  );
  
  // Filter subjects based on targetExam
  code = code.replace(
    /\{subjects\.map\(\(s\) => \{/,
    "{subjects.filter(s => { if (targetExam === 'NEET' && s === 'Mathematics') return false; if (targetExam === 'JEE' && s === 'Biology') return false; return true; }).map((s) => {"
  );
  
  // Also highlight Biology for NEET, ONLY inside the subjects loop.
  // We look for:
  // className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5"
  // but only the one right after `return (` inside `subjects.map`
  
  const searchPattern = "return (\n                        <div key={s} className=\"rounded-2xl border border-slate-800 bg-slate-950/50 p-5\">";
  const replacePattern = "return (\n                        <div key={s} className={`rounded-2xl border ${targetExam === 'NEET' && s === 'Biology' ? 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)] bg-emerald-950/20' : 'border-slate-800 bg-slate-950/50'} p-5`}>";
  
  code = code.replace(searchPattern, replacePattern);

  fs.writeFileSync('src/components/StudyHub.tsx', code);
}
