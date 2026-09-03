const { createClient } = require('@supabase/supabase-js');
const { GoogleGenerativeAI, SchemaType } = require('@google/generative-ai');
require('dotenv').config();

// Ensure credentials exist
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY || !GEMINI_API_KEY) {
  console.error("Missing necessary API keys in .env file (Supabase or Gemini).");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Define schema for structured JSON output
const schema = {
  type: SchemaType.ARRAY,
  description: "List of generated questions",
  items: {
    type: SchemaType.OBJECT,
    properties: {
      question_text: { type: SchemaType.STRING, description: "The full question text with LaTeX math wrapped in $" },
      options: {
        type: SchemaType.ARRAY,
        items: { type: SchemaType.STRING },
        description: "Exactly 4 options, containing LaTeX where necessary"
      },
      correct_answer: { type: SchemaType.STRING, description: "The exact string of the correct option" },
      explanation: { type: SchemaType.STRING, description: "Step-by-step full breakdown explanation with LaTeX math" },
      difficulty: { type: SchemaType.STRING, description: "One of: Standard, Challenger, Advanced" },
      exam_year_tag: { type: SchemaType.STRING, description: "The PYQ year, e.g., 'JEE Main 2023'" }
    },
    required: ["question_text", "options", "correct_answer", "explanation", "difficulty", "exam_year_tag"]
  }
};

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: schema,
  },
  systemInstruction: "You are an elite Indian academic content generator for JEE Main, JEE Advanced, and NEET UG. Generate highly authentic, historically accurate Previous Year Questions (PYQs). Use LaTeX for all mathematical formatting wrapped in $."
});

// Massive syllabus list
const SYLLABUS = {
  'Physics': ['Kinematics', 'Laws of Motion', 'Work, Energy and Power', 'Rotational Motion', 'Gravitation', 'Thermodynamics', 'Oscillations and Waves', 'Electrostatics', 'Current Electricity', 'Magnetic Effects of Current', 'Electromagnetic Induction', 'Optics', 'Modern Physics'],
  'Chemistry': ['Atomic Structure', 'Chemical Bonding', 'Thermodynamics', 'Equilibrium', 'Redox Reactions', 'Kinetics', 'Coordination Compounds', 'Organic Chemistry - Some Basic Principles', 'Hydrocarbons', 'Haloalkanes', 'Alcohols, Phenols, Ethers', 'Aldehydes, Ketones'],
  'Mathematics': ['Sets, Relations and Functions', 'Complex Numbers', 'Quadratic Equations', 'Matrices and Determinants', 'Permutations and Combinations', 'Binomial Theorem', 'Sequence and Series', 'Calculus (Limits, Continuity, Differentiability)', 'Integral Calculus', 'Differential Equations', 'Coordinate Geometry', 'Vector Algebra', '3D Geometry', 'Probability'],
  'Biology': ['Diversity in Living World', 'Structural Organisation', 'Cell Structure and Function', 'Plant Physiology', 'Human Physiology', 'Reproduction', 'Genetics and Evolution', 'Biology and Human Welfare', 'Biotechnology', 'Ecology']
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function runGeneration() {
  const TOTAL_TARGET = 10000;
  const BATCH_SIZE = 25; // How many questions to ask the LLM for in one API call
  let totalSeeded = 0;

  console.log(`🚀 Starting Auto-Generator for ${TOTAL_TARGET} Real PYQs...`);
  console.log(`⚠️ This will take several hours and bypass rate limits by pausing between batches.\n`);

  while (totalSeeded < TOTAL_TARGET) {
    // Pick a random subject and chapter
    const subjects = Object.keys(SYLLABUS);
    const subject = subjects[Math.floor(Math.random() * subjects.length)];
    const chapters = SYLLABUS[subject];
    const chapter = chapters[Math.floor(Math.random() * chapters.length)];
    
    // Pick target exam based on subject
    let exam_target = subject === 'Biology' ? 'NEET' : (Math.random() > 0.5 ? 'JEE_MAIN' : 'JEE_ADVANCED');
    const year = Math.floor(Math.random() * (2024 - 2010 + 1)) + 2010;

    console.log(`[Batch] Requesting ${BATCH_SIZE} questions for ${subject} - ${chapter} (${exam_target} ${year})...`);
    
    try {
      const prompt = `Generate exactly ${BATCH_SIZE} highly authentic ${exam_target} Previous Year Questions from the year ${year}. Subject: ${subject}, Chapter: ${chapter}. Ensure extreme rigorous accuracy.`;
      
      const result = await model.generateContent(prompt);
      const generated = JSON.parse(result.response.text());

      if (generated && generated.length > 0) {
        // Map to DB schema
        const payload = generated.map(q => ({
          exam_target: exam_target,
          class_level: Math.random() > 0.5 ? 11 : 12, // Approximate
          subject: subject,
          chapter: chapter,
          difficulty: q.difficulty || 'Standard',
          question_type: 'Single_Correct',
          question_text: q.question_text,
          options: q.options,
          correct_answer: q.correct_answer,
          explanation: q.explanation,
          exam_year_tag: q.exam_year_tag || `${exam_target} ${year}`
        }));

        const { error } = await supabase.from('cbt_questions').insert(payload);
        if (error) {
          console.error("Supabase Insert Error:", error.message);
        } else {
          totalSeeded += payload.length;
          console.log(`✅ Success! Seeded ${payload.length} questions. [Total Progress: ${totalSeeded} / ${TOTAL_TARGET}]`);
        }
      }
    } catch (err) {
      console.error(`❌ Batch Failed (Rate limit or AI error):`, err.message);
    }

    // Crucial: Wait 15 seconds to avoid Gemini API rate limits (15 RPM for free tier usually)
    console.log(`⏳ Waiting 15 seconds to respect API limits...\n`);
    await delay(15000);
  }

  console.log(`\n🎉 MASTER SEED COMPLETE! 10,000 Questions generated and injected successfully!`);
}

runGeneration();
