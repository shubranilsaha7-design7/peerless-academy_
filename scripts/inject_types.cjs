const fs = require('fs');
let content = fs.readFileSync('src/integrations/supabase/types.ts', 'utf8');

const injection = `
      cbt_questions: {
        Row: {
          id: string;
          exam_target: string;
          class_level: number;
          subject: string;
          chapter: string;
          difficulty: string;
          question_text: string;
          options: string[];
          correct_answer: string;
          explanation: string;
          exam_year_tag: string;
        }
        Insert: any; Update: any; Relationships: any;
      },
      platform_settings: {
        Row: {
          id: string;
          system_prompt: string;
          model_tier: string;
          ai_name: string;
          ai_greeting: string;
        }
        Insert: any; Update: any; Relationships: any;
      },`;

content = content.replace(/Tables: \{/, 'Tables: {' + injection);
fs.writeFileSync('src/integrations/supabase/types.ts', content, 'utf8');
console.log('Injected missing tables into types.ts');
