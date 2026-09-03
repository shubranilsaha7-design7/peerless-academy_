const fs = require('fs');

function updateStudyHub() {
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
    
    // Also highlight Biology for NEET
    code = code.replace(
      /className=\"rounded-2xl border border-slate-800 bg-slate-950\/50 p-5\"/g,
      "className={`rounded-2xl border ${targetExam === 'NEET' && s === 'Biology' ? 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)] bg-emerald-950/20' : 'border-slate-800 bg-slate-950/50'} p-5`}"
    );

    fs.writeFileSync('src/components/StudyHub.tsx', code);
  }
}

function updatePracticeLab() {
  let code = fs.readFileSync('src/components/PracticeLab.tsx', 'utf8');

  // Currently PracticeLab is generic, let's not touch it heavily unless it maps subjects.
  // We'll leave it as is if it doesn't map subjects directly like StudyHub does.
}

updateStudyHub();
