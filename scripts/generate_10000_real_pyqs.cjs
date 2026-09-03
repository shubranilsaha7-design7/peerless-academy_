const { createClient } = require('@supabase/supabase-js');
const { GoogleGenerativeAI, SchemaType } = require('@google/generative-ai');
require('dotenv').config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY || !GEMINI_API_KEY) {
  console.error("Missing necessary API keys in .env file.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const schema = {
  type: SchemaType.ARRAY,
  description: "List of generated questions",
  items: {
    type: SchemaType.OBJECT,
    properties: {
      question_text: { type: SchemaType.STRING, description: "Full question text with LaTeX math wrapped in $" },
      options: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING }, description: "Exactly 4 options" },
      correct_answer: { type: SchemaType.STRING, description: "The exact string of the correct option" },
      explanation: { type: SchemaType.STRING, description: "Step-by-step full breakdown explanation" },
      difficulty: { type: SchemaType.STRING, description: "Standard, Challenger, or Advanced" },
      exam_year_tag: { type: SchemaType.STRING, description: "e.g., 'Class 8 2023' or 'JEE Main 2024'" }
    },
    required: ["question_text", "options", "correct_answer", "explanation", "difficulty", "exam_year_tag"]
  }
};

const model = genAI.getGenerativeModel({
  model: "gemini-3.6-flash",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: schema,
  },
  systemInstruction: "You are an elite Indian academic content generator for Foundation (Class 5-10) and Competitive (JEE/NEET). Generate highly authentic, historically accurate questions. Use LaTeX for all mathematical formatting wrapped in $."
}, { apiVersion: 'v1beta', timeout: 120000 }); // 120s timeout

const FOUNDATION_SYLLABUS = {
  5: { 'Mathematics': ['Number System', 'Fractions', 'Geometry'], 'Science': ['Living Things', 'Our Body', 'Earth'] },
  6: { 'Mathematics': ['Integers', 'Algebra', 'Ratio'], 'Science': ['Food', 'Materials', 'Light'] },
  7: { 'Mathematics': ['Fractions', 'Simple Equations', 'Lines and Angles'], 'Science': ['Nutrition', 'Heat', 'Motion'] },
  8: { 'Mathematics': ['Rational Numbers', 'Linear Equations', 'Quadrilaterals'], 'Science': ['Microorganisms', 'Force and Pressure', 'Cell'] },
  9: { 'Mathematics': ['Polynomials', 'Triangles', 'Circles'], 'Science': ['Matter', 'Motion', 'Tissues'] },
  10: { 'Mathematics': ['Quadratic Equations', 'Trigonometry', 'Probability'], 'Science': ['Chemical Reactions', 'Electricity', 'Life Processes'] }
};

const COMPETITIVE_SYLLABUS = {
  'Physics': ['Kinematics', 'Laws of Motion', 'Thermodynamics', 'Electromagnetism'],
  'Chemistry': ['Atomic Structure', 'Equilibrium', 'Organic Chemistry'],
  'Mathematics': ['Calculus', 'Algebra', 'Coordinate Geometry'],
  'Biology': ['Genetics', 'Human Physiology', 'Ecology']
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchWithRetry(prompt, batchSize, retries = 0) {
  try {
    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
  } catch (err) {
    const message = err.message || "";
    if (message.includes('503') || message.includes('fetch failed') || message.includes('429')) {
      const waitTime = Math.pow(2, retries) * 30000; // 30s, 60s, 120s...
      console.warn(`[Network Drop] Error: ${message}. Retrying in ${waitTime/1000}s... (Attempt ${retries + 1})`);
      await delay(waitTime);
      return fetchWithRetry(prompt, batchSize, retries + 1);
    }
    throw err; // Throw if it's a structural error, not a network drop
  }
}

async function runGeneration() {
  console.log(`🚀 Starting Multi-Phase Auto-Generator...`);
  
  // PHASE 1: FOUNDATION SEEDING
  console.log(`\n--- PHASE 1: FOUNDATION (CLASS 5-10) ---`);
  for (let classLevel = 5; classLevel <= 10; classLevel++) {
    for (const [subject, chapters] of Object.entries(FOUNDATION_SYLLABUS[classLevel])) {
      console.log(`[Phase 1] Seeding Class ${classLevel} - ${subject}...`);
      const chapter = chapters[Math.floor(Math.random() * chapters.length)];
      const prompt = `Generate exactly 50 highly authentic foundation questions for Class ${classLevel} ${subject}. Chapter: ${chapter}.`;
      
      const generated = await fetchWithRetry(prompt, 50);
      
      if (generated && generated.length > 0) {
        const payload = generated.map(q => ({
          exam_target: `Class ${classLevel}`,
          class_level: classLevel,
          subject: subject,
          chapter: chapter,
          difficulty: q.difficulty || 'Standard',
          question_type: 'Single_Correct',
          question_text: q.question_text,
          options: q.options,
          correct_answer: q.correct_answer,
          explanation: q.explanation,
          exam_year_tag: q.exam_year_tag || `Class ${classLevel} Foundation`,
          is_sample: Math.random() < 0.1 // Flag ~10% as sample preview
        }));

        const { error } = await supabase.from('cbt_questions').insert(payload);
        if (error) console.error("DB Insert Error:", error.message);
        else console.log(`✅ Success! Seeded ${payload.length} questions for Class ${classLevel}.`);
      }
      await delay(15000); // Base wait
    }
  }

  // PHASE 2: COMPETITIVE
  console.log(`\n--- PHASE 2: COMPETITIVE (JEE/NEET) Unrestricted ---`);
  let totalSeeded = 0;
  const TOTAL_TARGET = 10000;
  
  while (totalSeeded < TOTAL_TARGET) {
    const subjects = Object.keys(COMPETITIVE_SYLLABUS);
    const subject = subjects[Math.floor(Math.random() * subjects.length)];
    const chapters = COMPETITIVE_SYLLABUS[subject];
    const chapter = chapters[Math.floor(Math.random() * chapters.length)];
    
    let exam_target = subject === 'Biology' ? 'NEET' : (Math.random() > 0.5 ? 'JEE_MAIN' : 'JEE_ADVANCED');
    
    console.log(`[Phase 2] Requesting 25 questions for ${subject} - ${chapter} (${exam_target})...`);
    const prompt = `Generate exactly 25 authentic ${exam_target} Previous Year Questions. Subject: ${subject}, Chapter: ${chapter}.`;
    
    try {
      const generated = await fetchWithRetry(prompt, 25);
      if (generated && generated.length > 0) {
        const payload = generated.map(q => ({
          exam_target: exam_target,
          class_level: 12,
          subject: subject,
          chapter: chapter,
          difficulty: q.difficulty || 'Standard',
          question_type: 'Single_Correct',
          question_text: q.question_text,
          options: q.options,
          correct_answer: q.correct_answer,
          explanation: q.explanation,
          exam_year_tag: q.exam_year_tag || exam_target,
          is_sample: Math.random() < 0.05
        }));

        const { error } = await supabase.from('cbt_questions').insert(payload);
        if (error) console.error("DB Insert Error:", error.message);
        else {
          totalSeeded += payload.length;
          console.log(`✅ Success! Seeded ${payload.length} questions. [Phase 2 Progress: ${totalSeeded} / ${TOTAL_TARGET}]`);
        }
      }
    } catch (err) {
      console.error(`❌ Unrecoverable Batch Failed:`, err.message);
    }
    await delay(15000);
  }
}

runGeneration();
