const fs = require('fs');

let content = fs.readFileSync('src/data/mockQuestionsPool.ts', 'utf8');

// Find the MASTER_QUESTIONS array block
// The file is small enough to parse as JS but we can just use simple string manipulation
// Actually, it's a TS file.
// We can just require the transpiled array or regex it.
// It's safer to just do a regex replace if we know the structure, or load it with a quick eval if we strip exports.

let stripped = content.replace(/export interface ArenaQuestion \{[\s\S]*?\}/, '');
stripped = stripped.replace('export const MASTER_QUESTIONS: ArenaQuestion[] = ', '');
stripped = stripped.trim();
if (stripped.endsWith(';')) stripped = stripped.slice(0, -1);

try {
  let questions = eval('(' + stripped + ')');
  if (Array.isArray(questions)) {
    let duplicated = questions.map(q => ({
      ...q,
      id: q.id + '_v2'
    }));
    let finalQs = [...questions, ...duplicated];
    
    let newContent = `export interface ArenaQuestion {
  id: string;
  class_level: string;
  subject: string;
  question_latex: string;
  options: string[];
  correct_option: number;
  solution_latex: string;
}

export const MASTER_QUESTIONS: ArenaQuestion[] = ${JSON.stringify(finalQs, null, 2)};
`;
    fs.writeFileSync('src/data/mockQuestionsPool.ts', newContent);
    console.log(`Successfully expanded mock questions pool to ${finalQs.length} questions.`);
  }
} catch (e) {
  console.error("Failed to parse and duplicate questions:", e);
}
