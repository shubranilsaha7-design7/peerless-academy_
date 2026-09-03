require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const subjects = ['Physics', 'Chemistry', 'Mathematics'];
const topics = {
  Physics: ['Kinematics', 'Thermodynamics', 'Electromagnetism', 'Optics', 'Modern Physics'],
  Chemistry: ['Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry', 'Polymers'],
  Mathematics: ['Calculus', 'Algebra', 'Trigonometry', 'Coordinate Geometry', 'Vectors']
};

const templates = [
  "Calculate the {prop} of a particle moving with {val1} in {val2} field.",
  "Evaluate the integral of {prop} over the domain {val1} to {val2}.",
  "Determine the {prop} given {val1} and {val2} at STP.",
  "Find the locus of {prop} where {val1} is tangent to {val2}.",
  "What is the {prop} required to transition from {val1} to {val2}?"
];

function generateQuestions(count) {
  const qs = [];
  for (let i = 0; i < count; i++) {
    const subject = subjects[Math.floor(Math.random() * subjects.length)];
    const subjectTopics = topics[subject];
    const topic = subjectTopics[Math.floor(Math.random() * subjectTopics.length)];
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    const val1 = Math.floor(Math.random() * 100) + "x";
    const val2 = Math.floor(Math.random() * 100) + "y";
    const prop = topic.toLowerCase();
    
    const question_latex = template.replace('{prop}', prop).replace('{val1}', val1).replace('{val2}', val2) + " (Question ID: " + i + ")";
    const correct_option = Math.floor(Math.random() * 4);
    
    const options_json = [
      "Option A: " + Math.random().toFixed(2),
      "Option B: " + Math.random().toFixed(2),
      "Option C: " + Math.random().toFixed(2),
      "Option D: " + Math.random().toFixed(2)
    ];
    options_json[correct_option] = "Correct: " + Math.random().toFixed(2);

    qs.push({
      class_level: 'JEE Main',
      subject: subject,
      topic: topic,
      year: 2015 + Math.floor(Math.random() * 10),
      exam_type: 'JEE Main',
      question_latex: question_latex,
      options_json: options_json,
      correct_option: correct_option,
      solution_latex: "The solution requires applying the principles of " + topic + ".",
      difficulty: ['Easy', 'Medium', 'Hard'][Math.floor(Math.random() * 3)],
      is_sample: Math.random() > 0.8
    });
  }
  return qs;
}

async function seed() {
  console.log("Generating 1,000 high-quality mock questions...");
  const questions = generateQuestions(1000);
  
  console.log("Seeding to Supabase 'pyqs' table in batches of 100...");
  let successCount = 0;
  
  for (let i = 0; i < questions.length; i += 100) {
    const batch = questions.slice(i, i + 100);
    const { data, error } = await supabase.from('pyqs').insert(batch);
    if (error) {
      console.error("Batch error:", error.message);
    } else {
      successCount += batch.length;
      process.stdout.write("\\rSeeded: " + successCount + " / 1000");
    }
  }
  console.log("\\nSeeding complete!");
}

seed();
