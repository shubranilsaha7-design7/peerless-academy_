const fs = require('fs');

// 1. CBT Simulator - Remove framer-motion drag on question palette buttons, just to be safe, and fix onClick issues.
let cbt = fs.readFileSync('src/components/dashboard/CbtSimulator.tsx', 'utf-8');
cbt = cbt.replace(/drag="x"/g, '');
cbt = cbt.replace(/dragConstraints=\{\{ left: 0, right: 0 \}\}/g, '');
cbt = cbt.replace(/dragElastic=\{0.2\}/g, '');
cbt = cbt.replace(/onDragEnd=\{.*?\}\}/gs, '');
cbt = cbt.replace(/<motion\.div\s+key=\{currentQ\.id\}/, '<motion.div key={currentQ.id}');
fs.writeFileSync('src/components/dashboard/CbtSimulator.tsx', cbt);

// 2. CustomTestBuilder.tsx
let builder = fs.readFileSync('src/components/dashboard/CustomTestBuilder.tsx', 'utf-8');
if (!builder.includes('useCbtStore')) {
  builder = builder.replace("import { motion } from 'framer-motion';", "import { motion } from 'framer-motion';\nimport { supabase } from '@/integrations/supabase/client';\nimport { useCbtStore } from '@/store/cbtStore';\nimport { Loader2 } from 'lucide-react';");
  
  builder = builder.replace("const toggleSubject = (s: string) => {", "const [loading, setLoading] = useState(false);\n  const toggleSubject = (s: string) => {");
  
  const generateLogic = `
  const handleGenerate = async () => {
    setLoading(true);
    try {
      const { data, error } = await (supabase as any).from('cbt_questions')
        .select('*')
        .in('subject', subjects)
        .limit(questionCount);
        
      if (data && data.length > 0) {
        // Map to format
        const mapped = data.map((d: any) => ({
          ...d,
          question_latex: d.question_text,
          correct_index: d.options.findIndex((o: string) => o === d.correct_answer) === -1 ? 0 : d.options.findIndex((o: string) => o === d.correct_answer),
          explanation_latex: d.explanation
        }));
        useCbtStore.getState().hydrateQuestions(mapped);
        onStart();
      } else {
        alert("No questions found for criteria.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  `;
  
  builder = builder.replace("return (", generateLogic + "\n  return (");
  builder = builder.replace(/onClick=\{onStart\}/, "onClick={handleGenerate}");
  builder = builder.replace(/GENERATE DRILL <ChevronRight size=\{20\} \/>/, "{loading ? <Loader2 className=\"animate-spin\" /> : <>GENERATE DRILL <ChevronRight size={20} /></>}");
  fs.writeFileSync('src/components/dashboard/CustomTestBuilder.tsx', builder);
}

console.log('Fixed TestBuilder and CbtSimulator');
