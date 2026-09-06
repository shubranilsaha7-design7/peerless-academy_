const fs = require('fs');

const fallbackQ = `[
  { id: '1', question_latex: 'Calculate the force required to accelerate a 5kg mass at 2m/s^2.', options_json: ['10 N', '5 N', '2.5 N', '20 N'], correct_option: 0, subject: 'Physics' },
  { id: '2', question_latex: 'What is the powerhouse of the cell?', options_json: ['Nucleus', 'Mitochondria', 'Ribosome', 'Endoplasmic Reticulum'], correct_option: 1, subject: 'Biology' },
  { id: '3', question_latex: 'Integration of $x^2 dx$ is?', options_json: ['$x^3/3$', '$2x$', '$x^2/2$', '$x^3$'], correct_option: 0, subject: 'Math' },
  { id: '4', question_latex: 'Chemical formula for water?', options_json: ['HO', 'H2O2', 'H2O', 'OH'], correct_option: 2, subject: 'Chemistry' },
  { id: '5', question_latex: 'Which planet is known as the Red Planet?', options_json: ['Earth', 'Mars', 'Jupiter', 'Saturn'], correct_option: 1, subject: 'Physics' }
]`;

// Kurukshetra.tsx
let kurukshetra = fs.readFileSync('src/components/Kurukshetra.tsx', 'utf8');

kurukshetra = kurukshetra.replace(
  /if \(data && data\.length > 0\) setQuestions\(data\.sort\(\(\) => 0\.5 - Math\.random\(\)\)\);/,
  `if (data && data.length >= 5) {
          setQuestions(data.sort(() => 0.5 - Math.random()));
        } else {
          console.warn('DB empty. Using fallback questions.');
          setQuestions(${fallbackQ});
        }`
);
fs.writeFileSync('src/components/Kurukshetra.tsx', kurukshetra);

// QuickMatchArena.tsx
let quick = fs.readFileSync('src/components/arena/QuickMatchArena.tsx', 'utf8');

quick = quick.replace(
  /if \(data && data\.length >= 5\) \{[\s\S]*?\} else \{[\s\S]*?console\.error\("Supabase Sync Error:", error\);\s*\}/,
  `if (data && data.length >= 5) {
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
                }`
);
fs.writeFileSync('src/components/arena/QuickMatchArena.tsx', quick);

// Also fix AI Bot timer logic in QuickMatchArena.tsx (if timer hits 0)
const botLogicRegex = /if \(searchTimer > 0\) \{[\s\S]*?\} else if \(searchTimer === 0 && view === 'searching'\) \{[\s\S]*?\}/;
quick = quick.replace(
  botLogicRegex,
  `if (searchTimer > 0) {
      interval = setTimeout(() => setSearchTimer(t => t - 1), 1000);
    } else if (searchTimer === 0 && view === 'searching') {
      setIsBot(true);
      setOppId('bot-1');
      setOppName('AI Scholar (Lvl 8)');
      
      // Fetch or fallback
      (supabase as any).from('pyqs').select('*').limit(10).then(({ data }: any) => {
        let selected;
        if (data && data.length >= 5) {
          selected = data.sort(() => 0.5 - Math.random()).slice(0, 5);
        } else {
          selected = ${fallbackQ};
        }
        setQuestions(selected);
        setView('battle');
      });
    }`
);

fs.writeFileSync('src/components/arena/QuickMatchArena.tsx', quick);

