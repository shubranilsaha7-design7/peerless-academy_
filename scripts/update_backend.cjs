const fs = require('fs');
let code = fs.readFileSync('src/lib/backend.ts', 'utf8');

code += `\n
export async function askVisionSolver(question: string, base64Image: string): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) throw new Error("Missing Gemini API Key in environment.");
  
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ 
    model: "gemini-3.6-flash",
    systemInstruction: "You are an expert AI tutor. Solve the problem in the provided image. Enforce LaTeX ($...$ and $$...$$) for all math derivations. Do not use Markdown math blocks like \\\\[ ... \\\\]. Use single $ for inline and double $$ for block math."
  });

  const [header, data] = base64Image.split(',');
  const mimeType = header.match(/:(.*?);/)?.[1] || 'image/jpeg';

  const imagePart = {
    inlineData: {
      data: data,
      mimeType
    }
  };

  const result = await model.generateContent([question || "Solve this.", imagePart]);
  return result.response.text();
}
`;

fs.writeFileSync('src/lib/backend.ts', code);
