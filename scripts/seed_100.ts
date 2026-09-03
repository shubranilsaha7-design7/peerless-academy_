import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceRole);

const sampleQuestions = Array.from({ length: 100 }).map((_, i) => ({
  exam_target: 'JEE_MAIN',
  class_level: 11,
  subject: ['Physics', 'Chemistry', 'Mathematics'][i % 3],
  chapter: 'Sample Chapter',
  exam_year_tag: 'Standard Mock Inject',
  difficulty: ['Standard', 'Advanced', 'Challenger'][i % 3],
  question_type: 'Single_Correct',
  question_text: `Sample ${['Physics', 'Chemistry', 'Mathematics'][i % 3]} Question #${i + 1}. A particle exhibits standard motion defined by $v = ${i + 1}t$. What is the displacement?`,
  options: [`$\\frac{${i + 1}t^2}{2}$`, `$${i + 1}t^2$`, `$\\frac{t^2}{${i + 1}}$`, `$t$`],
  correct_answer: `$\\frac{${i + 1}t^2}{2}$`,
  explanation: `By integrating velocity $v = ${i + 1}t$, we get displacement $s = \\frac{${i + 1}t^2}{2}$.`,
  ncert_reference: 'Mock Reference'
}));

async function seed() {
  console.log("Emptying old procedural garbage...");
  await supabase.from('cbt_questions').delete().eq('exam_year_tag', 'Standard Mock Inject');
  
  console.log("Seeding 100 standard mock questions...");
  const { error } = await supabase.from('cbt_questions').insert(sampleQuestions);
  
  if (error) {
    console.error("Error seeding:", error);
  } else {
    console.log("Successfully seeded 100 standard mock questions!");
  }
}

seed();
