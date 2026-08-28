import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRole) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Seeding requires the service role key to bypass RLS.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRole);

// DUMMY PAYLOAD BATCH - Represents the LLM/Procedural Generation Payload
// In a full run, this array would be built by calling the LLM API in loops.
const seedQuestions = [
  {
    exam_target: 'JEE_MAIN',
    class_level: 11,
    subject: 'Physics',
    chapter: 'Kinematics',
    exam_year_tag: 'JEE Main 2024 Jan Session',
    difficulty: 'Standard',
    question_type: 'Single_Correct',
    question_text: 'A particle moves along the x-axis with velocity $v = 4t - t^2$ m/s. Calculate the total distance covered before it comes to rest.',
    options: ['$\\frac{16}{3}$ m', '$\\frac{32}{3}$ m', '$16$ m', '$\\frac{64}{3}$ m'],
    correct_answer: '$\\frac{32}{3}$ m',
    explanation: 'Velocity becomes zero when $v = 4t - t^2 = 0 \\implies t = 4$s. Distance $s = \\int_0^4 (4t - t^2) dt = [2t^2 - \\frac{t^3}{3}]_0^4 = 32 - \\frac{64}{3} = \\frac{32}{3}$ m.',
    ncert_reference: 'Class 11 Physics, Chapter 3: Motion in a Straight Line, Page 45'
  },
  {
    exam_target: 'NEET',
    class_level: 12,
    subject: 'Chemistry',
    chapter: 'Electrochemistry',
    exam_year_tag: 'NEET 2023',
    difficulty: 'Standard',
    question_type: 'Single_Correct',
    question_text: 'For the cell reaction $Cu(s) + 2Ag^+(aq) \\rightarrow Cu^{2+}(aq) + 2Ag(s)$, standard cell potential is 0.46 V. Calculate the equilibrium constant at 298 K. (Take $\\frac{2.303 RT}{F} = 0.059$ V)',
    options: ['$4.0 \\times 10^{15}$', '$3.9 \\times 10^{15}$', '$4.0 \\times 10^{16}$', '$1.0 \\times 10^{15}$'],
    correct_answer: '$3.9 \\times 10^{15}$',
    explanation: '$\\log K_c = \\frac{n E^{\\circ}}{0.059} = \\frac{2 \\times 0.46}{0.059} = 15.59$. So, $K_c = 10^{15.59} \\approx 3.9 \\times 10^{15}$.',
    ncert_reference: 'Class 12 Chemistry, Chapter 3: Electrochemistry, Page 73'
  },
  {
    exam_target: 'JEE_ADVANCED',
    class_level: 11,
    subject: 'Mathematics',
    chapter: 'Coordinate Geometry',
    exam_year_tag: 'JEE Advanced 2022 Paper 1',
    difficulty: 'Advanced',
    question_type: 'Multi_Correct',
    question_text: 'Let $P$ be a point on the parabola $y^2 = 4ax$. The normal at $P$ meets the axis in $G$. Which of the following statements are correct?',
    options: ['The subnormal is constant and equal to $2a$', 'The focus bisects the subnormal', 'The tangent at vertex bisects the normal', 'The sub-tangent is bisected at the vertex'],
    correct_answer: '["The subnormal is constant and equal to $2a$", "The sub-tangent is bisected at the vertex"]',
    explanation: 'Standard properties of parabola $y^2 = 4ax$. Subnormal $= 2a$ (constant). Sub-tangent is bisected at the vertex.',
    ncert_reference: 'Class 11 Maths, Chapter 11: Conic Sections, Page 246'
  }
];

// Generate exactly 50 dummy questions to prove out the pipeline without burning real LLM tokens yet.
for (let i = 0; i < 47; i++) {
  seedQuestions.push({
    exam_target: 'JEE_MAIN',
    class_level: 12,
    subject: 'Physics',
    chapter: 'Modern Physics',
    exam_year_tag: 'Mock Test Gen',
    difficulty: i % 3 === 0 ? 'Advanced' : 'Standard',
    question_type: 'Single_Correct',
    question_text: `Dummy generated question #${i+4} for stress testing the CBT payload. What is the energy of a photon with wavelength $\\lambda = 400$ nm?`,
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    correct_answer: 'Option B',
    explanation: 'Dummy explanation for payload bulk.',
    ncert_reference: 'NCERT Reference Dummy'
  });
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function runSeeder() {
  console.log("🚀 Starting Kurukshetra Question Bank Seeder...");
  
  const CHUNK_SIZE = 50;
  for (let i = 0; i < seedQuestions.length; i += CHUNK_SIZE) {
    const chunk = seedQuestions.slice(i, i + CHUNK_SIZE);
    console.log(`Uploading chunk ${i/CHUNK_SIZE + 1} (${chunk.length} items)...`);
    
    let retries = 3;
    while (retries > 0) {
      const { error } = await supabase.from('cbt_questions').insert(chunk);
      if (error) {
        console.error(`Chunk failed. Retrying... (${3 - retries + 1}/3)`);
        console.error(error);
        retries--;
        await delay(2000); // Backoff
      } else {
        console.log(`✅ Chunk uploaded successfully.`);
        break;
      }
    }
    
    await delay(500); // Rate-limit protection
  }
  
  console.log("🎉 Seeding Complete. The Kurukshetra Engine is ready.");
}

runSeeder();
