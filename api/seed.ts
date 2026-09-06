import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const sampleQuestions = Array.from({ length: 100 }).map((_, i) => ({
      exam_target: 'JEE_MAIN',
      class_level: 11,
      subject: ['Physics', 'Chemistry', 'Mathematics'][i % 3],
      chapter: 'Sample Chapter',
      exam_year_tag: 'Standard Mock Inject',
      difficulty: ['Standard', 'Advanced', 'Challenger'][i % 3],
      question_type: 'Single_Correct',
      question_text: `Sample ${['Physics', 'Chemistry', 'Mathematics'][i % 3]} Question #${i + 1}. A particle exhibits motion defined by $v = ${i + 1}t$. What is the displacement?`,
      options: [`$\\frac{${i + 1}t^2}{2}$`, `$${i + 1}t^2$`, `$\\frac{t^2}{${i + 1}}$`, `$t$`],
      correct_answer: `$\\frac{${i + 1}t^2}{2}$`,
      explanation: `Integrating velocity $v = ${i + 1}t$ gives displacement $s = \\frac{${i + 1}t^2}{2}$.`,
      ncert_reference: 'Mock Reference',
    }));

    // delete previous mock injects
    await supabase.from('cbt_questions').delete().eq('exam_year_tag', 'Standard Mock Inject');
    const { error } = await supabase.from('cbt_questions').insert(sampleQuestions);
    if (error) throw error;
    return res.status(200).json({ message: 'Seeded 100 mock questions.' });
  } catch (err) {
    console.error('Seeding error:', err);
    return res.status(500).json({ error: err.message || 'Seeding failed' });
  }
}
