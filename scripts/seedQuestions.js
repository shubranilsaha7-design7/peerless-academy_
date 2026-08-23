import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

const subjects = ['Physics', 'Chemistry', 'Mathematics', 'Biology'];
const difficulties = ['Easy', 'Moderate', 'Hard'];

const templates = {
  Physics: [
    {
      topic: 'Kinematics',
      generate: (i) => {
        const v = 5 + (i % 20);
        const t = 2 + (i % 5);
        return {
          question: `A particle moves with a constant velocity of ${v} m/s. What is its displacement after ${t} seconds?`,
          options: [`${v * t} m`, `${v * t + 10} m`, `${v * t - 5} m`, `${v + t} m`],
          answer: 0,
          solution: `Displacement = velocity x time = ${v} x ${t} = ${v * t} m.`,
        };
      }
    },
    {
      topic: 'Thermodynamics',
      generate: (i) => {
        const T1 = 300 + (i % 10) * 10;
        const T2 = 400 + (i % 10) * 10;
        const eff = ((1 - T1/T2) * 100).toFixed(1);
        return {
          question: `For a Carnot engine working between ${T2} K and ${T1} K, the efficiency is closest to:`,
          options: [`${eff}%`, `${(eff * 1.2).toFixed(1)}%`, `${(eff * 0.8).toFixed(1)}%`, '50%'],
          answer: 0,
          solution: `Efficiency = 1 - T1/T2 = 1 - ${T1}/${T2} = ${eff}%.`,
        }
      }
    }
  ],
  Chemistry: [
    {
      topic: 'Stoichiometry',
      generate: (i) => {
        const moles = 2 + (i % 10);
        return {
          question: `How many grams of H2O are produced from ${moles} moles of H2 gas reacting completely with O2?`,
          options: [`${moles * 18} g`, `${moles * 16} g`, `${moles * 2} g`, `${moles * 36} g`],
          answer: 0,
          solution: `2H2 + O2 -> 2H2O. ${moles} moles of H2 produce ${moles} moles of H2O. Mass = ${moles} * 18 = ${moles * 18} g.`,
        }
      }
    }
  ],
  Mathematics: [
    {
      topic: 'Calculus',
      generate: (i) => {
        const n = 2 + (i % 8);
        return {
          question: `What is the derivative of x^${n} with respect to x?`,
          options: [`${n}x^${n-1}`, `${n}x^${n}`, `x^${n-1}`, `${n-1}x^${n}`],
          answer: 0,
          solution: `Using the power rule: d/dx (x^n) = n*x^(n-1). Thus, ${n}x^${n-1}.`,
        }
      }
    }
  ],
  Biology: [
    {
      topic: 'Genetics',
      generate: (i) => {
        const percent = 10 + (i % 20);
        return {
          question: `If a DNA sample contains ${percent}% Adenine, what is the percentage of Cytosine?`,
          options: [`${50 - percent}%`, `${percent}%`, `${100 - percent}%`, 'Cannot be determined'],
          answer: 0,
          solution: `A = T = ${percent}%. Total A+T = ${percent * 2}%. Remaining G+C = ${100 - percent * 2}%. Cytosine = ${50 - percent}%.`,
        }
      }
    }
  ]
};

// Procedural generation
const generateDataset = () => {
  const dataset = [];
  const TOTAL = 10000;
  let idCounter = 1;

  for (let i = 0; i < TOTAL; i++) {
    const subject = subjects[i % subjects.length];
    const subjectTemplates = templates[subject] || templates['Physics'];
    const template = subjectTemplates[i % subjectTemplates.length];
    
    const { question, options, answer, solution } = template.generate(i);
    
    dataset.push({
      id: `q-${idCounter++}`,
      paper: ['JEE Main', 'NEET'], // Generic tag
      subject: subject,
      topic: template.topic,
      question,
      options,
      answer,
      solution,
      difficulty: difficulties[i % 3]
    });
  }
  return dataset;
};

async function main() {
  console.log('Generating 10,000 questions...');
  const questions = generateDataset();
  
  const filePath = path.join(process.cwd(), 'src', 'data', 'cbt_questions_10k.json');
  fs.writeFileSync(filePath, JSON.stringify(questions, null, 2));
  console.log(`Saved to ${filePath}`);

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.log('No Supabase credentials found in environment. Skipping database seed.');
    return;
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  console.log('Checking Supabase cbt_questions table...');
  const { count, error } = await supabase.from('cbt_questions').select('*', { count: 'exact', head: true });
  
  if (error) {
    console.error('Error checking table. Does cbt_questions exist?', error.message);
    return;
  }

  if (count && count > 0) {
    console.log(`Table already has ${count} questions. Skipping seed.`);
    return;
  }

  console.log('Seeding Supabase in batches...');
  const BATCH_SIZE = 500;
  for (let i = 0; i < questions.length; i += BATCH_SIZE) {
    const batch = questions.slice(i, i + BATCH_SIZE);
    const { error: insertErr } = await supabase.from('cbt_questions').insert(batch);
    if (insertErr) {
      console.error(`Batch insertion failed at index ${i}:`, insertErr.message);
    } else {
      console.log(`Inserted ${i + batch.length} / 10000`);
    }
  }
  console.log('Seeding complete!');
}

main().catch(console.error);
