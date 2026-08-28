import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRole) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Seeding requires the service role key to bypass RLS.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRole);

const TOTAL_QUESTIONS = 15000;
const CHUNK_SIZE = 500;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function runSeeder() {
  console.log(`🚀 Starting Kurukshetra Question Bank Seeder for ${TOTAL_QUESTIONS} questions...`);
  
  for (let chunkStart = 0; chunkStart < TOTAL_QUESTIONS; chunkStart += CHUNK_SIZE) {
    const chunk = [];
    for (let i = 0; i < CHUNK_SIZE && (chunkStart + i) < TOTAL_QUESTIONS; i++) {
      const globalIndex = chunkStart + i;
      chunk.push({
        exam_target: globalIndex % 2 === 0 ? 'JEE_MAIN' : 'NEET',
        class_level: globalIndex % 2 === 0 ? 11 : 12,
        subject: ['Physics', 'Chemistry', 'Mathematics', 'Biology'][globalIndex % 4],
        chapter: `Chapter ${globalIndex % 20}`,
        exam_year_tag: 'Synthetic Gen 2',
        difficulty: ['Standard', 'Challenger', 'Advanced'][globalIndex % 3],
        question_type: 'Single_Correct',
        question_text: `Procedural Question #${globalIndex}. If a system is placed under stress condition $C_${globalIndex}$, calculate the expected threshold limit.`,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correct_answer: 'Option B',
        explanation: `Explanation for Q${globalIndex}: The system reaches equilibrium when differential variables converge.`,
        ncert_reference: `NCERT Page ${globalIndex % 300}`
      });
    }

    console.log(`Uploading chunk ${chunkStart/CHUNK_SIZE + 1} (${chunk.length} items)...`);
    
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
    
    await delay(100); // Rate-limit protection
  }
  
  console.log("🎉 15,000+ Seeding Complete. The Kurukshetra Engine is fully loaded.");
}

runSeeder();
