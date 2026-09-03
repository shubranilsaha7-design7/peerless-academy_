const fs = require('fs');
let code = fs.readFileSync('src/components/AIChatBot.tsx', 'utf8');

// 1. Update imports
if (!code.includes('askVisionSolver')) {
  code = code.replace(
    /import \{ askDoubtSolver \} from '@\/lib\/backend';/,
    "import { askDoubtSolver, askVisionSolver } from '@/lib/backend';\nimport { Camera, Image as ImageIcon } from 'lucide-react';\nimport Latex from 'react-latex-next';\nimport 'katex/dist/katex.min.css';"
  );
}

// 2. Add image support to type Msg
code = code.replace(
  /type Msg = \{ id: number; role: 'user' \| 'assistant'; text: string \};/,
  "type Msg = { id: number; role: 'user' | 'assistant'; text: string; image?: string };"
);

// 3. Add file input ref and handleFile logic to AIChatBot component
const componentStart = "export default function AIChatBot() {";
const fileInputLogic = `
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64 = ev.target?.result as string;
      setMessages((m) => [...m, { id: Date.now(), role: 'user', text: input || "Solve this problem:", image: base64 }]);
      setInput('');
      setTyping(true);
      
      try {
        const reply = await askVisionSolver(input || "Solve this problem.", base64);
        
        const words = reply.split(' ');
        let acc = '';
        for (let i = 0; i < words.length; i++) {
          acc += (i ? ' ' : '') + words[i];
          setStreamed(acc);
          await new Promise((r) => setTimeout(r, 22));
        }
        setStreamed('');
        setMessages((m) => [...m, { id: Date.now() + 1, role: 'assistant', text: reply }]);
      } catch (err: any) {
        console.error('Vision API Error:', err);
        setStreamed('');
        setMessages((m) => [...m, { id: Date.now() + 1, role: 'assistant', text: \`Error: \${err.message}\` }]);
      } finally {
        setTyping(false);
      }
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
`;
code = code.replace(
  /export default function AIChatBot\(\) \{/,
  componentStart + fileInputLogic
);

// 4. Render Latex instead of pure text and support images
const renderMsgBlock = `
                <div key={m.id} className={\`flex \${m.role === 'user' ? 'justify-end' : 'justify-start'}\`}>
                  <div
                    className={\`max-w-[85%] rounded-2xl px-4 py-2.5 text-[13px] leading-6 overflow-x-auto \${
                      m.role === 'user'
                        ? 'rounded-br-md bg-coral text-white'
                        : 'rounded-bl-md border border-slate-800 bg-slate-800/70 text-slate-200'
                    }\`}
                  >
                    {m.image && <img src={m.image} alt="User Upload" className="max-w-full rounded-lg mb-2 border border-slate-700" />}
                    {m.role === 'assistant' ? <Latex>{m.text}</Latex> : m.text}
                  </div>
                </div>
`;
code = code.replace(
  /<div key=\{m\.id\} className=\{\`flex \$\{m\.role === 'user' \? 'justify-end' : 'justify-start'\}\`\}>[\s\S]*?<\/div>\s*<\/div>/g,
  renderMsgBlock.trim()
);

// Update streamed to use Latex
code = code.replace(
  /\{streamed\}\s*<span className="ml-0\.5 inline-block h-3\.5 w-1\.5 animate-pulse bg-coral align-middle" \/>/,
  "<Latex>{streamed}</Latex>\n                    <span className=\"ml-0.5 inline-block h-3.5 w-1.5 animate-pulse bg-coral align-middle\" />"
);

// 5. Add UI for Camera
const inputBlockRegex = /<input\s+value=\{input\}[\s\S]*?\/>/;
const updatedInputBlock = `
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFile}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={typing}
                  aria-label="Upload Image"
                  className="rounded-xl bg-slate-800/60 border border-slate-800 p-3 text-slate-400 hover:text-white hover:border-slate-600 transition disabled:opacity-40"
                >
                  <Camera size={16} />
                </button>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && send()}
                  placeholder="Ask or snap a doubt..."
                  className="flex-1 rounded-xl border border-slate-800 bg-slate-800/60 px-4 py-3 text-[13px] text-white outline-none placeholder:text-slate-500 focus:border-coral"
                />
`;

code = code.replace(inputBlockRegex, updatedInputBlock.trim());

fs.writeFileSync('src/components/AIChatBot.tsx', code);
