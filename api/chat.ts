import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req: any, res: any) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "AQ.Ab8RN6IMIMPGsZDc_dKFiz8-pQP_DX-yzAwu2x1XdobUYwf-ng";
    
    if (!apiKey) {
      console.error("Missing Gemini API Key in backend environment.");
      return res.status(500).json({ error: 'Server Misconfiguration: Missing API Key' });
    }

    const { messages, systemPrompt, modelTier } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid payload: messages array is required.' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Safely enforce gemini-3.6-flash if the user's DB specifies a model they don't have access to
    const requestedModel = modelTier || "gemini-3.6-flash";
    const safeModel = requestedModel.includes('pro') ? 'gemini-3.6-flash' : requestedModel; // Force flash to avoid 404s

    const model = genAI.getGenerativeModel({ 
      model: "gemini-3.6-flash", // Hardcoded safely
      systemInstruction: systemPrompt 
    });

    // Format for Gemini SDK (gemini-3.6-flash)
    const contents = messages.map((msg: any) => ({
      role: msg.role === 'ai' || msg.role === 'model' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    // The SDK generateContent accepts structured contents array
    const result = await model.generateContent({ contents });
    const aiResponse = result.response.text();

    return res.status(200).json({ reply: aiResponse });

  } catch (error: any) {
    console.error("AI API Error:", error);
    
    // Extract specific quota or auth errors from Gemini SDK
    if (error.message?.includes('API key not valid') || error.message?.includes('API_KEY_INVALID')) {
      return res.status(401).json({ error: 'Invalid API Key provided to the AI provider.' });
    }
    if (error.message?.includes('quota') || error.message?.includes('429')) {
      return res.status(429).json({ error: 'AI API quota exceeded. Please try again later.' });
    }
    
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
