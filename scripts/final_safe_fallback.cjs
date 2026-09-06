const fs = require('fs');

const fallbackQ = `[
  { id: '1', question_latex: 'Calculate the force required to accelerate a 5kg mass at 2m/s^2.', options_json: ['10 N', '5 N', '2.5 N', '20 N'], correct_option: 0, subject: 'Physics' },
  { id: '2', question_latex: 'What is the powerhouse of the cell?', options_json: ['Nucleus', 'Mitochondria', 'Ribosome', 'Endoplasmic Reticulum'], correct_option: 1, subject: 'Biology' },
  { id: '3', question_latex: 'Integration of $x^2 dx$ is?', options_json: ['$x^3/3$', '$2x$', '$x^2/2$', '$x^3$'], correct_option: 0, subject: 'Math' },
  { id: '4', question_latex: 'Chemical formula for water?', options_json: ['HO', 'H2O2', 'H2O', 'OH'], correct_option: 2, subject: 'Chemistry' },
  { id: '5', question_latex: 'Which planet is known as the Red Planet?', options_json: ['Earth', 'Mars', 'Jupiter', 'Saturn'], correct_option: 1, subject: 'Physics' }
]`;

// --- KURUKSHETRA ---
let kurukshetra = fs.readFileSync('src/components/Kurukshetra.tsx', 'utf8');

const kTarget = "if (data && data.length > 0) setQuestions(data.sort(() => 0.5 - Math.random()));";
const kReplace = `if (data && data.length >= 5) {
          setQuestions(data.sort(() => 0.5 - Math.random()));
        } else {
          console.warn('DB empty. Using fallback questions.');
          setQuestions(${fallbackQ});
        }`;

kurukshetra = kurukshetra.replace(kTarget, kReplace);
fs.writeFileSync('src/components/Kurukshetra.tsx', kurukshetra);

// --- QUICKMATCH ---
let quick = fs.readFileSync('src/components/arena/QuickMatchArena.tsx', 'utf8');

const qTarget = `if (data && data.length >= 5) {
                  const selected = data.sort(() => 0.5 - Math.random()).slice(0, 5);
                  channel.send({
                    type: 'broadcast',
                    event: 'start_match',
                    payload: { questions: selected, hostId: host.user_id, clientId: client.user_id }
                  });
                  setQuestions(selected);
                  setTimeout(() => setView('battle'), 1500);
                } else {
                  console.error("Supabase Sync Error:", error);
                }`;
const qReplace = `if (data && data.length >= 5) {
                  const selected = data.sort(() => 0.5 - Math.random()).slice(0, 5);
                  channel.send({
                    type: 'broadcast',
                    event: 'start_match',
                    payload: { questions: selected, hostId: host.user_id, clientId: client.user_id }
                  });
                  setQuestions(selected);
                  setTimeout(() => setView('battle'), 1500);
                } else {
                  console.warn("DB empty. Using fallback.");
                  const selected = ${fallbackQ};
                  channel.send({
                    type: 'broadcast',
                    event: 'start_match',
                    payload: { questions: selected, hostId: host.user_id, clientId: client.user_id }
                  });
                  setQuestions(selected);
                  setTimeout(() => setView('battle'), 1500);
                }`;

quick = quick.replace(qTarget, qReplace);

const botTarget = `const { data, error } = await (supabase as any).from('pyqs').select('*').limit(20);
      if (data && data.length >= 5) {
        setQuestions(data.sort(() => 0.5 - Math.random()).slice(0, 5));
        setTimeout(() => setView('battle'), 1000);
      } else {
        console.error("Supabase Sync Error:", error);
      }`;
const botReplace = `const { data, error } = await (supabase as any).from('pyqs').select('*').limit(20);
      if (data && data.length >= 5) {
        setQuestions(data.sort(() => 0.5 - Math.random()).slice(0, 5));
        setTimeout(() => setView('battle'), 1000);
      } else {
        setQuestions(${fallbackQ});
        setTimeout(() => setView('battle'), 1000);
      }`;

quick = quick.replace(botTarget, botReplace);
fs.writeFileSync('src/components/arena/QuickMatchArena.tsx', quick);
