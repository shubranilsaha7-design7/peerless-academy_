const fs = require('fs');

let content = fs.readFileSync('src/components/arena/QuickMatchArena.tsx', 'utf8');

const oldBlock = `    } else {
       console.error("Supabase Sync Error:", error);
                      const selected = MASTER_QUESTIONS.slice(0, 10).sort(() => 0.5 - Math.random()).slice(0, 5);
                      if (typeof channel !== 'undefined' && channel.send) {
                        try {
                          channel.send({ type: 'broadcast', event: 'start_match', payload: { questions: selected, hostId: 'host', clientId: 'client' } });
                        } catch(e) {}
                      }
                      setQuestions(selected);
                      setView('battle');
    }`;

const newBlock = `    } else {
      console.error("Supabase Sync Error:", error);
      const selected = MASTER_QUESTIONS.slice(0, 10).sort(() => 0.5 - Math.random()).slice(0, 5);
      setQuestions(selected);
      setView('battle');
    }`;

// Replace ONLY the second occurrence which is the bot match
let occurrences = content.split('console.error("Supabase Sync Error:", error);');
if (occurrences.length > 2) {
  // It means it matched at least 2
  // Let's just find the index of "const startBotMatch" and replace everything inside it.
  const botIdx = content.indexOf('const startBotMatch');
  const endIdx = content.indexOf('};', botIdx);
  
  const botMatchClean = \`const startBotMatch = async () => {
    setOppId('ai-bot');
    setOppName('AI Scholar [Level 8]');
    setIsBot(true);
    const { data, error } = await (supabase as any).from('pyqs').select('*').limit(20);
    if (data && data.length >= 5) {
      setQuestions(data.sort(() => 0.5 - Math.random()).slice(0, 5));
      setView('battle');
    } else {
      console.error("Supabase Sync Error:", error);
      const selected = MASTER_QUESTIONS.slice(0, 10).sort(() => 0.5 - Math.random()).slice(0, 5);
      setQuestions(selected);
      setView('battle');
    }
  \`;
  
  content = content.substring(0, botIdx) + botMatchClean + content.substring(endIdx);
  fs.writeFileSync('src/components/arena/QuickMatchArena.tsx', content);
}
