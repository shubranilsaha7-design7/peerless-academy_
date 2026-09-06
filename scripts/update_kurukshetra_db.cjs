const fs = require('fs');
let code = fs.readFileSync('src/components/Kurukshetra.tsx', 'utf8');

const target = `  // Hydrate with Real Questions (Default to JEE_MAIN for now)
  const storeQs = useCbtStore(s => s.questions);
  useTestHydration('JEE_MAIN', false, storeQs.length > 0);
  const currentQ = storeQs.length > qIndex ? storeQs[qIndex] : (storeQs.length > 0 ? storeQs[0] : null);`;

const replacement = `  // Direct DB Fetch for PYQs
  const [questions, setQuestions] = useState<any[]>([]);
  useEffect(() => {
    const fetchQuestions = async () => {
      // Direct query to the pyqs table using PostgREST random() order
      try {
        const { data, error } = await (supabase as any).from('pyqs')
          .select('*')
          // Assuming there's a random() function or relying on limit
          // Using a simple query for now.
          .limit(20);
        
        if (error) {
          console.error('Failed to fetch from pyqs:', error);
          setQuestions([{ question_latex: 'Error connecting to pyqs table.', options: ['A','B','C','D'], correct_index: 0 }]);
        } else if (data && data.length > 0) {
          // Shuffle data client side just in case 'random()' isn't exposed
          const shuffled = data.sort(() => 0.5 - Math.random());
          setQuestions(shuffled);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchQuestions();
  }, []);
  const currentQ = questions.length > qIndex ? questions[qIndex] : (questions.length > 0 ? questions[0] : null);`;

code = code.replace(target, replacement);

// We should also remove the unused imports `useCbtStore` and `useTestHydration`
code = code.replace(/import \{ useCbtStore \} from '@\/store\/cbtStore';\n/, '');
code = code.replace(/import \{ useTestHydration \} from '@\/hooks\/useTestHydration';\n/, '');

fs.writeFileSync('src/components/Kurukshetra.tsx', code);
console.log('Kurukshetra pyqs fetch integrated.');
