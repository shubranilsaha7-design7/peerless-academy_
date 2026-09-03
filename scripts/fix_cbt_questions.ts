import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRole) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRole);

const realQuestions = [
  {
    subject: 'Physics',
    chapter: 'Kinematics',
    question_text: 'A particle moves along the x-axis with velocity $v = 4t - t^2$ m/s. Calculate the total distance covered before it comes to rest.',
    options: ['$\\frac{16}{3}$ m', '$\\frac{32}{3}$ m', '$16$ m', '$\\frac{64}{3}$ m'],
    correct_answer: '$\\frac{32}{3}$ m',
    explanation: 'Velocity becomes zero when $v = 4t - t^2 = 0 \\implies t = 4$s. Distance $s = \\int_0^4 (4t - t^2) dt = [2t^2 - \\frac{t^3}{3}]_0^4 = 32 - \\frac{64}{3} = \\frac{32}{3}$ m.'
  },
  {
    subject: 'Mathematics',
    chapter: 'Calculus',
    question_text: 'Evaluate the integral $\\int_0^{\\pi/2} \\frac{\\sin x}{\\sin x + \\cos x} dx$',
    options: ['$\\frac{\\pi}{2}$', '$\\frac{\\pi}{4}$', '$\\pi$', '$0$'],
    correct_answer: '$\\frac{\\pi}{4}$',
    explanation: 'Using the property $\\int_0^a f(x)dx = \\int_0^a f(a-x)dx$, let $I = \\int_0^{\\pi/2} \\frac{\\sin x}{\\sin x + \\cos x} dx$. Then $I = \\int_0^{\\pi/2} \\frac{\\cos x}{\\cos x + \\sin x} dx$. Adding both gives $2I = \\int_0^{\\pi/2} 1 dx = \\frac{\\pi}{2}$, so $I = \\frac{\\pi}{4}$.'
  },
  {
    subject: 'Chemistry',
    chapter: 'Thermodynamics',
    question_text: 'For a given reaction, $\\Delta H = 35.5 \\text{ kJ mol}^{-1}$ and $\\Delta S = 83.6 \\text{ J K}^{-1} \\text{mol}^{-1}$. The reaction is spontaneous at: (Assume that $\\Delta H$ and $\\Delta S$ do not vary with temperature)',
    options: ['$T > 425$ K', '$T < 425$ K', '$T > 298$ K', 'All temperatures'],
    correct_answer: '$T > 425$ K',
    explanation: 'For a reaction to be spontaneous, $\\Delta G < 0$. Since $\\Delta G = \\Delta H - T\\Delta S$, we have $T > \\frac{\\Delta H}{\\Delta S} = \\frac{35500}{83.6} \\approx 425$ K.'
  },
  {
    subject: 'Biology',
    chapter: 'Genetics',
    question_text: 'In a population in Hardy-Weinberg equilibrium, the frequency of the recessive allele is 0.4. What is the expected frequency of heterozygous individuals?',
    options: ['0.16', '0.36', '0.48', '0.64'],
    correct_answer: '0.48',
    explanation: 'Given $q = 0.4$, then $p = 1 - 0.4 = 0.6$. The frequency of heterozygotes is $2pq = 2(0.6)(0.4) = 0.48$.'
  },
  {
    subject: 'Physics',
    chapter: 'Electrodynamics',
    question_text: 'Two point charges $q$ and $-q$ are separated by a distance $2a$. The electric potential at a distance $r$ from the center of the dipole on its equatorial plane is:',
    options: ['$\\frac{1}{4\\pi\\epsilon_0}\\frac{p}{r^2}$', '$\\frac{1}{4\\pi\\epsilon_0}\\frac{p}{r}$', 'Zero', '$\\frac{1}{4\\pi\\epsilon_0}\\frac{2p}{r^3}$'],
    correct_answer: 'Zero',
    explanation: 'On the equatorial plane, the distance from any point to both charges is equal. Since potentials are scalars and the charges are equal and opposite, they cancel out exactly. $V = V_+ + V_- = 0$.'
  },
  {
    subject: 'Mathematics',
    chapter: 'Algebra',
    question_text: 'If the roots of the equation $x^2 - 5x + 6 = 0$ are $\\alpha$ and $\\beta$, find the equation whose roots are $\\alpha^2$ and $\\beta^2$.',
    options: ['$x^2 - 13x + 36 = 0$', '$x^2 - 25x + 36 = 0$', '$x^2 - 13x + 6 = 0$', '$x^2 - 25x + 6 = 0$'],
    correct_answer: '$x^2 - 13x + 36 = 0$',
    explanation: 'The roots of $x^2 - 5x + 6 = 0$ are $2$ and $3$. The squares of the roots are $4$ and $9$. Sum $= 13$, Product $= 36$. Equation: $x^2 - 13x + 36 = 0$.'
  }
];

const TOTAL = 15000;
const CHUNK = 500;

async function run() {
  console.log("Emptying old procedural garbage...");
  
  // We can delete all where exam_year_tag = 'Synthetic Gen 2' to wipe the 15k dummy qs
  const { error: delErr } = await supabase.from('cbt_questions').delete().eq('exam_year_tag', 'Synthetic Gen 2');
  if (delErr) console.error("Del Error:", delErr);
  
  console.log("Seeding realistic questions...");
  for (let c = 0; c < TOTAL; c += CHUNK) {
    const chunk = [];
    for (let i = 0; i < CHUNK; i++) {
      const q = realQuestions[(c + i) % realQuestions.length];
      chunk.push({
        exam_target: ['JEE_MAIN', 'NEET'][(c+i) % 2],
        class_level: [(c+i) % 2 === 0 ? 11 : 12],
        subject: q.subject,
        chapter: q.chapter,
        exam_year_tag: 'Synthetic Gen 3 Realistic',
        difficulty: 'Standard',
        question_type: 'Single_Correct',
        question_text: q.question_text,
        options: q.options,
        correct_answer: q.correct_answer,
        explanation: q.explanation,
        ncert_reference: 'NCERT Reference'
      });
    }
    await supabase.from('cbt_questions').insert(chunk);
    console.log(`Chunk ${c/CHUNK + 1} done`);
  }
  console.log("Realistic Seeding Complete!");
}

run();
