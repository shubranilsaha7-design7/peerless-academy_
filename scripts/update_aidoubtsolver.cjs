const fs = require('fs');

const targetFile = 'src/components/AIDoubtSolver.tsx';
let content = fs.readFileSync(targetFile, 'utf8');

if (!content.includes("import { GoogleGenerativeAI }")) {
    content = "import { GoogleGenerativeAI } from '@google/generative-ai';\n" + content;
}

const targetBlock = `      try {
        const apiMessages = newMessages.map(m => ({
          role: m.sender === 'ai' ? 'model' : 'user',
          content: m.id === newMessages[newMessages.length - 1].id ? prompt : m.text
        }));
  
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: apiMessages,
            systemPrompt,
            modelTier
          })
        });
  
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch AI response');
        }
  
        setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'ai', text: data.reply }]);
      } catch (err: any) {
        console.error("AI API Error:", err);
        setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'ai', text: \`Error: \${err.message || 'Network error connecting to the AI core.'}\` }]);
      } finally {
        setLoading(false);
      }`;

const replacementBlock = `      try {
        const apiMessages = newMessages.map(m => ({
          role: m.sender === 'ai' ? 'model' : 'user',
          parts: [{ text: m.id === newMessages[newMessages.length - 1].id ? prompt : m.text }]
        }));

        const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "AQ.Ab8RN6IMIMPGsZDc_dKFiz8-pQP_DX-yzAwu2x1XdobUYwf-ng";
        if (!apiKey) throw new Error("Missing Gemini API Key");

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
          model: "gemini-2.5-flash", // Strictly force flash to avoid 404s
          systemInstruction: systemPrompt
        });

        const result = await model.generateContent({ contents: apiMessages });
        const aiResponseText = result.response.text();

        setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'ai', text: aiResponseText }]);
      } catch (err: any) {
        console.error("AI API Error:", err);
        setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'ai', text: \`Error: \${err.message || 'Network error connecting to the AI core.'}\` }]);
      } finally {
        setLoading(false);
      }`;

// Do literal replace ignoring exact whitespace variations
content = content.replace(/try\s*\{\s*const apiMessages[\s\S]*?setLoading\(false\);\s*\}/, replacementBlock);

fs.writeFileSync(targetFile, content, 'utf8');
console.log('Successfully updated AIDoubtSolver.tsx to use direct Gemini SDK.');
