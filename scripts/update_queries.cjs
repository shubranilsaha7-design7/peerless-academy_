const fs = require('fs');

function modifyFile(filePath, isCustomBuilder) {
  let code = fs.readFileSync(filePath, 'utf8');
  
  if (isCustomBuilder) {
    code = code.replace(
      "const { data, error } = await (supabase as any).from('cbt_questions')",
      `// CHECK IP PROTECTION LOCK
      const { data: settings } = await (supabase as any).from('platform_settings').select('full_pyq_access').eq('id', 'GLOBAL').single();
      const hasFullAccess = settings?.full_pyq_access || false;
      
      let query = (supabase as any).from('cbt_questions').select('*');
      if (!hasFullAccess) {
        query = query.eq('is_sample', true).limit(50);
      } else {
        query = query.eq('subject', subject);
        if (chapter) query = query.eq('chapter', chapter);
        if (difficulty && difficulty !== 'All') query = query.eq('difficulty', difficulty);
        query = query.limit(Number(count));
      }
      
      const { data, error } = await query; //`
    );
    // Remove the old query building logic
    code = code.replace(/\.select\('\*'\);\s*if \(subject\) query = query\.eq\('subject', subject\);\s*if \(chapter\) query = query\.eq\('chapter', chapter\);\s*if \(difficulty && difficulty !== 'All'\) query = query\.eq\('difficulty', difficulty\);\s*const \{ data, error \} = await query\.limit\(Number\(count\)\);/, '');
  } else {
    // useTestHydration.ts
    code = code.replace(
      "const { data, error } = await supabase\n          .from('cbt_questions')",
      `const { data: settings } = await (supabase as any).from('platform_settings').select('full_pyq_access').eq('id', 'GLOBAL').single();
        const hasFullAccess = settings?.full_pyq_access || false;
        
        let query = (supabase as any).from('cbt_questions').select('*');
        if (!hasFullAccess) {
          query = query.eq('is_sample', true).limit(50);
        } else {
          query = query.eq('exam_target', 'NEET').limit(90); // default fallback logic
        }
        
        const { data, error } = await query; //`
    );
  }
  
  fs.writeFileSync(filePath, code);
}

// NOTE: Since I am replacing exact text, I need to be precise. 
// Let's actually use a regex or just rewrite the function.
