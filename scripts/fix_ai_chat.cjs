const fs = require('fs');
let html = fs.readFileSync('public/nfc.html', 'utf8');

const oldAiChat = `      // 💡 AI Chat 💡
      function sendMsg() {
        const inp  = document.getElementById('aiInput');
        const text = inp.value.trim();
        if (!text) return;
        const log = document.getElementById('aiLog');
  
        const u = document.createElement('div');
        u.className = 'msg user';
        u.textContent = text;
        log.appendChild(u);
        inp.value = '';
  
        const t = document.createElement('div');
        t.className = 'msg ai';
        t.textContent = '...';
        log.appendChild(t);
        log.scrollTop = log.scrollHeight;
  
        setTimeout(() => {
          t.textContent = 'For personalized academic mentoring, visit our CBT portal! For admissions or fee queries, please call +91-8794130855 or tap the Email button above. 😊';
          log.scrollTop = log.scrollHeight;
        }, 1200);
      }`;

const newAiChat = `      // 💡 AI Chat 💡
      async function sendMsg() {
        const inp = document.getElementById('aiInput');
        const text = inp.value.trim();
        if (!text) return;
        const log = document.getElementById('aiLog');
  
        const u = document.createElement('div');
        u.className = 'msg user';
        u.textContent = text;
        log.appendChild(u);
        inp.value = '';
  
        const t = document.createElement('div');
        t.className = 'msg ai';
        t.textContent = '...';
        log.appendChild(t);
        log.scrollTop = log.scrollHeight;
  
        try {
          const res = await fetch('https://peerlessacademy.in/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              messages: [{ role: 'user', content: text }],
              systemPrompt: "You are an AI assistant for Peerless Academy. Be helpful, concise, and friendly.",
              modelTier: "gemini-2.5-flash"
            })
          });
          const data = await res.json();
          if (data.reply) {
            t.textContent = data.reply;
          } else {
            t.textContent = 'Sorry, I encountered an error answering that.';
          }
        } catch (err) {
          t.textContent = 'Network error. Please try again later. For admissions, call +91-8794130855.';
        }
        log.scrollTop = log.scrollHeight;
      }`;

// We will use a regex to replace it because emojis and exact spaces might differ.
const aiChatRegex = /\/\/ [^\n]*AI Chat[^\n]*\n[\s]*function sendMsg\(\) \{[\s\S]*?setTimeout\([\s\S]*?\}, 1200\);\n[\s]*\}/;

if (aiChatRegex.test(html)) {
    html = html.replace(aiChatRegex, newAiChat);
    fs.writeFileSync('public/nfc.html', html, 'utf8');
    console.log('NFC AI chat fixed.');
} else {
    console.log('Regex failed to find AI Chat in nfc.html');
}
