const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const subjects = ['Physics', 'Chemistry', 'Mathematics', 'Biology'];
const exams = ['JEE_MAIN', 'NEET', 'JEE_ADVANCED'];

const generateQuestions = (count) => {
  const qs = [];
  for (let i = 0; i < count; i++) {
    const sub = subjects[Math.floor(Math.random() * subjects.length)];
    const ex = exams[Math.floor(Math.random() * exams.length)];
    const lvl = Math.random() > 0.5 ? 11 : 12;
    const diff = ['Standard', 'Challenger', 'Advanced'][Math.floor(Math.random() * 3)];
    
    // Procedurally generated realistic-looking variables
    const v1 = Math.floor(Math.random() * 100) + 1;
    const v2 = Math.floor(Math.random() * 50) + 1;
    
    let text = '';
    let opts = [];
    let correct = '';
    
    if (sub === 'Physics') {
      text = `A particle moves with a velocity of $${v1} m/s$ and accelerates at $${v2} m/s^2$. What is its displacement after 2 seconds?`;
      const ans = (v1 * 2) + (0.5 * v2 * 4);
      correct = `$${ans} m$`;
      opts = [correct, `$${ans + 10} m$`, `$${ans - 5} m$`, `$${ans * 2} m$`];
    } else if (sub === 'Mathematics') {
      text = `Evaluate the integral of $f(x) = ${v1}x^2 + ${v2}$ from 0 to 1.`;
      const ans = (v1 / 3) + v2;
      correct = `$${ans.toFixed(2)}$`;
      opts = [correct, `$${(ans + 1).toFixed(2)}$`, `$${(ans - 1).toFixed(2)}$`, `$${(ans * 2).toFixed(2)}$`];
    } else if (sub === 'Chemistry') {
      text = `Calculate the molar mass of a compound with empirical formula $C_${v1}H_${v2}$.`;
      const ans = (v1 * 12) + (v2 * 1);
      correct = `$${ans} g/mol$`;
      opts = [correct, `$${ans + 12} g/mol$`, `$${ans - 1} g/mol$`, `$${ans + 2} g/mol$`];
    } else {
      text = `Which of the following enzymes is most active at pH ${v1 % 7 + 1} in the human digestive system?`;
      correct = `Enzyme Variant ${v2}`;
      opts = [correct, `Enzyme Variant ${v2 + 1}`, `Enzyme Variant ${v2 + 2}`, `Enzyme Variant ${v2 + 3}`];
    }

    // Shuffle options
    opts.sort(() => Math.random() - 0.5);

    qs.push({
      exam_target: ex,
      class_level: lvl,
      subject: sub,
      chapter: 'Mock Chapter ' + (i % 10 + 1),
      difficulty: diff,
      question_type: 'Single_Correct',
      question_text: text,
      options: opts,
      correct_answer: correct,
      explanation: `By applying the standard formula, we arrive at the correct answer: ${correct}.`,
      exam_year_tag: 'AI Seed Generated'
    });
  }
  return qs;
};

async function seedDB() {
  console.log("Generating 10,000 Questions in Memory...");
  const allQs = generateQuestions(10000);
  
  console.log("Connecting to Supabase and injecting 10,000 questions (in chunks of 1000)...");
  
  let successCount = 0;
  for (let i = 0; i < allQs.length; i += 1000) {
    const chunk = allQs.slice(i, i + 1000);
    const { data, error } = await supabase.from('cbt_questions').insert(chunk);
    
    if (error) {
      console.error(`Error inserting chunk ${i/1000 + 1}:`, error.message);
    } else {
      successCount += chunk.length;
      console.log(`Successfully injected chunk ${i/1000 + 1} (${successCount} / 10000)`);
    }
  }
  
  console.log(`\n🎉 Seed Complete: Successfully implemented ${successCount} questions into CBT Databank.`);
}

seedDB();
