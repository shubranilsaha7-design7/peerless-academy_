const fs = require('fs');

let content = fs.readFileSync('src/components/arena/QuickMatchArena.tsx', 'utf8');

content = content.replace(/console\.error\("Supabase Sync Error:", error\);/g, `console.error("Supabase Sync Error:", error);
                    const selected = MASTER_QUESTIONS.slice(0, 10).sort(() => 0.5 - Math.random()).slice(0, 5);
                    if (typeof channel !== 'undefined' && channel.send) {
                      try {
                        channel.send({ type: 'broadcast', event: 'start_match', payload: { questions: selected, hostId: 'host', clientId: 'client' } });
                      } catch(e) {}
                    }
                    setQuestions(selected);
                    setView('battle');`);

fs.writeFileSync('src/components/arena/QuickMatchArena.tsx', content);
