import { supabase } from '@/integrations/supabase/client';

// ── Types ────────────────────────────────────────────────────────
export type Subject    = 'Physics' | 'Chemistry' | 'Maths' | 'Biology';
export type ExamType   = 'NCERT'   | 'JEE'       | 'NEET'  | 'General';
export type Difficulty = 'Easy'    | 'Medium'     | 'Hard';

export interface Question {
  id: string;
  question_text: string;
  options: string[];
  correct_option_index: number;
  explanation: string;
  subject: Subject;
  class_level: number;
  exam_type: ExamType;
  difficulty: Difficulty;
}

export interface FetchOptions {
  subject?: Subject;
  classLevel?: number;
  examType?: ExamType;
  difficulty?: Difficulty;
  count?: number;
}

// ── Local Seed Dataset (27 questions) ───────────────────────────
export const SEED_QUESTIONS: Question[] = [
  // ── PHYSICS ──────────────────────────────────────────────────
  {
    id: 'seed-phys-001',
    question_text: 'A ray of light passes from air into glass at an angle of incidence of 30°. If the refractive index of glass is 1.5, the angle of refraction is approximately:',
    options: ['19.5°', '20°', '30°', '45°'],
    correct_option_index: 0,
    explanation: 'By Snell\'s Law: n₁ sinθ₁ = n₂ sinθ₂ → 1 × sin30° = 1.5 × sinθ₂ → sinθ₂ = 0.5/1.5 = 0.333 → θ₂ ≈ 19.5°.',
    subject: 'Physics', class_level: 10, exam_type: 'NCERT', difficulty: 'Medium',
  },
  {
    id: 'seed-phys-002',
    question_text: 'A projectile is fired at 45° with initial speed 20 m/s (g = 10 m/s²). The maximum height reached is:',
    options: ['5 m', '10 m', '20 m', '40 m'],
    correct_option_index: 1,
    explanation: 'H = u²sin²θ / 2g = (20)² × (sin45°)² / (2×10) = 400 × 0.5 / 20 = 10 m.',
    subject: 'Physics', class_level: 11, exam_type: 'JEE', difficulty: 'Medium',
  },
  {
    id: 'seed-phys-003',
    question_text: 'Two parallel plates are 2 cm apart with a potential difference of 100 V. The electric field between them is:',
    options: ['200 V/m', '5000 V/m', '50 V/m', '2 V/m'],
    correct_option_index: 1,
    explanation: 'E = V/d = 100 V / 0.02 m = 5000 V/m. Electric field is uniform between the plates.',
    subject: 'Physics', class_level: 12, exam_type: 'NCERT', difficulty: 'Easy',
  },
  {
    id: 'seed-phys-004',
    question_text: 'Which of the following is NOT a vector quantity?',
    options: ['Velocity', 'Acceleration', 'Speed', 'Force'],
    correct_option_index: 2,
    explanation: 'Speed is a scalar — it has magnitude only. Velocity, acceleration, and force have both magnitude and direction (vectors).',
    subject: 'Physics', class_level: 9, exam_type: 'NCERT', difficulty: 'Easy',
  },
  {
    id: 'seed-phys-005',
    question_text: 'The time period of a simple pendulum of length 1 m (g = 10 m/s²) is approximately:',
    options: ['1 s', '2 s', 'π s', '2π s'],
    correct_option_index: 1,
    explanation: 'T = 2π√(L/g) = 2π√(1/10) = 2π/√10 ≈ 2π/3.16 ≈ 1.99 ≈ 2 s.',
    subject: 'Physics', class_level: 11, exam_type: 'NCERT', difficulty: 'Easy',
  },
  {
    id: 'seed-phys-006',
    question_text: 'Newton\'s Third Law of Motion states:',
    options: [
      'A body at rest stays at rest unless acted upon',
      'Force = Mass × Acceleration',
      'Every action has an equal and opposite reaction',
      'Momentum is always conserved',
    ],
    correct_option_index: 2,
    explanation: 'Newton\'s Third Law: For every action there is an equal and opposite reaction. The forces act on different bodies.',
    subject: 'Physics', class_level: 9, exam_type: 'NCERT', difficulty: 'Easy',
  },
  {
    id: 'seed-phys-007',
    question_text: 'Bernoulli\'s principle is based on conservation of:',
    options: ['Momentum', 'Energy', 'Mass', 'Charge'],
    correct_option_index: 1,
    explanation: 'Bernoulli\'s equation (P + ½ρv² + ρgh = constant) is derived from conservation of energy for fluid flow.',
    subject: 'Physics', class_level: 11, exam_type: 'NEET', difficulty: 'Medium',
  },
  // ── CHEMISTRY ────────────────────────────────────────────────
  {
    id: 'seed-chem-001',
    question_text: 'The pH of a 0.001 M HCl solution is:',
    options: ['1', '2', '3', '4'],
    correct_option_index: 2,
    explanation: 'HCl is a strong acid, fully dissociating. [H⁺] = 0.001 M = 10⁻³. pH = −log[H⁺] = −log(10⁻³) = 3.',
    subject: 'Chemistry', class_level: 10, exam_type: 'NCERT', difficulty: 'Easy',
  },
  {
    id: 'seed-chem-002',
    question_text: 'The molar mass of H₂SO₄ is:',
    options: ['96 g/mol', '97 g/mol', '98 g/mol', '100 g/mol'],
    correct_option_index: 2,
    explanation: 'H₂SO₄: 2(H) + S + 4(O) = 2(1) + 32 + 4(16) = 2 + 32 + 64 = 98 g/mol.',
    subject: 'Chemistry', class_level: 9, exam_type: 'NCERT', difficulty: 'Easy',
  },
  {
    id: 'seed-chem-003',
    question_text: 'The hybridization of carbon atoms in ethene (C₂H₄) is:',
    options: ['sp', 'sp²', 'sp³', 'dsp²'],
    correct_option_index: 1,
    explanation: 'Each carbon in ethene forms one double bond (σ + π). Carbon uses sp² hybridization, leaving one p-orbital for the π bond.',
    subject: 'Chemistry', class_level: 11, exam_type: 'JEE', difficulty: 'Medium',
  },
  {
    id: 'seed-chem-004',
    question_text: 'The oxidation state of Manganese (Mn) in KMnO₄ is:',
    options: ['+4', '+5', '+6', '+7'],
    correct_option_index: 3,
    explanation: 'K is +1, each O is −2 (×4 = −8). Total = 0 → +1 + Mn − 8 = 0 → Mn = +7.',
    subject: 'Chemistry', class_level: 11, exam_type: 'NCERT', difficulty: 'Medium',
  },
  {
    id: 'seed-chem-005',
    question_text: 'Number of moles in 36 g of water (H₂O)?',
    options: ['1', '2', '3', '4'],
    correct_option_index: 1,
    explanation: 'Molar mass of H₂O = 2(1) + 16 = 18 g/mol. n = mass/M = 36/18 = 2 mol.',
    subject: 'Chemistry', class_level: 9, exam_type: 'NCERT', difficulty: 'Easy',
  },
  {
    id: 'seed-chem-006',
    question_text: 'When zinc reacts with dilute HCl, the gas produced is:',
    options: ['O₂', 'Cl₂', 'H₂', 'CO₂'],
    correct_option_index: 2,
    explanation: 'Zn + 2HCl → ZnCl₂ + H₂↑. Hydrogen gas is produced. This is a displacement reaction.',
    subject: 'Chemistry', class_level: 10, exam_type: 'NCERT', difficulty: 'Easy',
  },
  {
    id: 'seed-chem-007',
    question_text: 'SN1 reactions proceed through which intermediate?',
    options: ['Carbanion', 'Free radical', 'Carbocation', 'Cyclic transition state'],
    correct_option_index: 2,
    explanation: 'SN1 (Substitution Nucleophilic Unimolecular) involves a carbocation intermediate formed after the leaving group departs in the rate-determining step.',
    subject: 'Chemistry', class_level: 12, exam_type: 'JEE', difficulty: 'Medium',
  },
  // ── MATHS ────────────────────────────────────────────────────
  {
    id: 'seed-math-001',
    question_text: 'The sum of the roots of x² − 5x + 6 = 0 is:',
    options: ['2', '3', '5', '6'],
    correct_option_index: 2,
    explanation: 'By Vieta\'s formulas, sum of roots = −(−5)/1 = 5. Product of roots = 6/1 = 6. Roots are 2 and 3: 2+3=5.',
    subject: 'Maths', class_level: 10, exam_type: 'NCERT', difficulty: 'Easy',
  },
  {
    id: 'seed-math-002',
    question_text: 'The value of sin(π/6) is:',
    options: ['√3/2', '1/2', '1/√2', '√3'],
    correct_option_index: 1,
    explanation: 'π/6 = 30°. sin(30°) = 1/2. This is a standard trigonometric value.',
    subject: 'Maths', class_level: 11, exam_type: 'NCERT', difficulty: 'Easy',
  },
  {
    id: 'seed-math-003',
    question_text: 'The derivative of f(x) = x³ + 2x with respect to x is:',
    options: ['3x² + 2', '3x + 2', 'x² + 2', '3x²'],
    correct_option_index: 0,
    explanation: 'd/dx(x³) = 3x² and d/dx(2x) = 2. So f\'(x) = 3x² + 2.',
    subject: 'Maths', class_level: 12, exam_type: 'JEE', difficulty: 'Easy',
  },
  {
    id: 'seed-math-004',
    question_text: 'Area of a circle with radius 7 cm (use π = 22/7) is:',
    options: ['44 cm²', '154 cm²', '49π cm²', '22 cm²'],
    correct_option_index: 1,
    explanation: 'A = πr² = (22/7) × 7² = (22/7) × 49 = 22 × 7 = 154 cm².',
    subject: 'Maths', class_level: 8, exam_type: 'NCERT', difficulty: 'Easy',
  },
  {
    id: 'seed-math-005',
    question_text: '∫x² dx = ?',
    options: ['x³ + C', 'x³/3 + C', '2x + C', 'x²/2 + C'],
    correct_option_index: 1,
    explanation: 'Using the power rule: ∫xⁿ dx = xⁿ⁺¹/(n+1) + C. For n=2: ∫x² dx = x³/3 + C.',
    subject: 'Maths', class_level: 12, exam_type: 'JEE', difficulty: 'Easy',
  },
  {
    id: 'seed-math-006',
    question_text: 'If 2x + 3 = 11, then x equals:',
    options: ['2', '3', '4', '5'],
    correct_option_index: 2,
    explanation: '2x + 3 = 11 → 2x = 11 − 3 = 8 → x = 8/2 = 4.',
    subject: 'Maths', class_level: 7, exam_type: 'NCERT', difficulty: 'Easy',
  },
  {
    id: 'seed-math-007',
    question_text: 'cos²θ + sin²θ = ?',
    options: ['0', '1', '2', 'tan²θ'],
    correct_option_index: 1,
    explanation: 'This is the Pythagorean identity: sin²θ + cos²θ = 1, valid for all values of θ.',
    subject: 'Maths', class_level: 10, exam_type: 'NCERT', difficulty: 'Easy',
  },
  // ── BIOLOGY ──────────────────────────────────────────────────
  {
    id: 'seed-bio-001',
    question_text: 'Which organelle is known as the "powerhouse of the cell"?',
    options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Golgi apparatus'],
    correct_option_index: 2,
    explanation: 'Mitochondria produce ATP through cellular respiration (oxidative phosphorylation), supplying energy for the cell. Hence called the powerhouse.',
    subject: 'Biology', class_level: 9, exam_type: 'NCERT', difficulty: 'Easy',
  },
  {
    id: 'seed-bio-002',
    question_text: 'Which enzyme synthesizes the new DNA strand during DNA replication?',
    options: ['RNA Polymerase', 'DNA Polymerase III', 'Helicase', 'Topoisomerase'],
    correct_option_index: 1,
    explanation: 'DNA Polymerase III is the primary enzyme for synthesizing new DNA strands in prokaryotes. Helicase unwinds; Topoisomerase relieves tension; RNA Polymerase makes RNA.',
    subject: 'Biology', class_level: 12, exam_type: 'NEET', difficulty: 'Medium',
  },
  {
    id: 'seed-bio-003',
    question_text: 'The light-dependent reactions of photosynthesis occur in the:',
    options: ['Stroma', 'Thylakoid membrane', 'Cytoplasm', 'Outer chloroplast membrane'],
    correct_option_index: 1,
    explanation: 'Light reactions (photosystems I & II) occur on the thylakoid membranes. The Calvin cycle (dark reactions) occurs in the stroma.',
    subject: 'Biology', class_level: 11, exam_type: 'NEET', difficulty: 'Medium',
  },
  {
    id: 'seed-bio-004',
    question_text: 'Mendel\'s Law of Segregation states that:',
    options: [
      'Genes for different traits assort independently',
      'Alleles separate during gamete formation',
      'Dominant allele always masks recessive',
      'Chromosomes are linked in groups',
    ],
    correct_option_index: 1,
    explanation: 'Law of Segregation: Each organism has two alleles for each trait; these alleles separate (segregate) during gamete formation so each gamete carries only one allele.',
    subject: 'Biology', class_level: 12, exam_type: 'NEET', difficulty: 'Medium',
  },
  {
    id: 'seed-bio-005',
    question_text: 'Blood is carried from the heart to the lungs via the:',
    options: ['Pulmonary vein', 'Pulmonary artery', 'Aorta', 'Superior vena cava'],
    correct_option_index: 1,
    explanation: 'Pulmonary artery carries deoxygenated blood from the right ventricle to the lungs. Pulmonary veins return oxygenated blood to the left atrium.',
    subject: 'Biology', class_level: 10, exam_type: 'NCERT', difficulty: 'Medium',
  },
  {
    id: 'seed-bio-006',
    question_text: 'Normal human body temperature is approximately:',
    options: ['36°C', '37°C', '38°C', '35°C'],
    correct_option_index: 1,
    explanation: 'Normal human body temperature is 37°C (98.6°F). Values above 38°C indicate fever (pyrexia).',
    subject: 'Biology', class_level: 8, exam_type: 'NCERT', difficulty: 'Easy',
  },
];

// ── AI Auto-Generator ────────────────────────────────────────────
// Generates plausible MCQ stubs when DB returns fewer than requested
function generateAIQuestion(subject: Subject, classLevel: number, examType: ExamType, index: number): Question {
  const templates: Record<Subject, { q: string; opts: string[]; ans: number; exp: string }[]> = {
    Physics: [
      {
        q: `A body of mass ${2 + index}kg is moving with velocity ${5 + index}m/s. Its kinetic energy is:`,
        opts: [`${(2 + index) * (5 + index) ** 2 / 2} J`, `${(2 + index) * (5 + index)} J`, `${(5 + index) ** 2} J`, `${(2 + index) ** 2} J`],
        ans: 0,
        exp: `KE = ½mv² = ½ × ${2 + index} × ${(5 + index) ** 2} = ${(2 + index) * (5 + index) ** 2 / 2} J`,
      },
    ],
    Chemistry: [
      {
        q: `The atomic number of element with electronic configuration 2,8,${1 + (index % 8)} is:`,
        opts: [`${11 + (index % 8)}`, `${10 + (index % 8)}`, `${12 + (index % 8)}`, `${9 + (index % 8)}`],
        ans: 0,
        exp: `Atomic number = total electrons = 2 + 8 + ${1 + (index % 8)} = ${11 + (index % 8)}.`,
      },
    ],
    Maths: [
      {
        q: `If f(x) = ${2 + index}x² + ${index}x, then f'(x) is:`,
        opts: [`${2 * (2 + index)}x + ${index}`, `${2 + index}x + ${index}`, `${4 + index}x`, `${index}x`],
        ans: 0,
        exp: `f'(x) = ${2 * (2 + index)}x + ${index} by power rule.`,
      },
    ],
    Biology: [
      {
        q: 'Which of the following is a correct statement about cell division?',
        opts: ['Mitosis produces 4 genetically diverse cells', 'Meiosis produces 2 identical cells', 'Mitosis produces 2 identical diploid cells', 'Meiosis produces diploid gametes'],
        ans: 2,
        exp: 'Mitosis: 1 diploid cell → 2 identical diploid daughter cells. Meiosis: 1 diploid cell → 4 haploid genetically diverse cells.',
      },
    ],
  };

  const tmpl = templates[subject][0];
  return {
    id: `ai-gen-${subject.toLowerCase()}-${Date.now()}-${index}`,
    question_text: tmpl.q,
    options: tmpl.opts,
    correct_option_index: tmpl.ans,
    explanation: tmpl.exp,
    subject,
    class_level: classLevel,
    exam_type: examType,
    difficulty: 'Medium',
  };
}

// ── Main Fetch Function ──────────────────────────────────────────
export async function fetchQuestions({
  subject,
  classLevel,
  examType,
  difficulty,
  count = 10,
}: FetchOptions): Promise<Question[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any;

  try {
    // Build Supabase query dynamically
    let query = sb.from('questions').select('*');
    if (subject)    query = query.eq('subject', subject);
    if (classLevel) query = query.eq('class_level', classLevel);
    if (examType)   query = query.eq('exam_type', examType);
    if (difficulty) query = query.eq('difficulty', difficulty);

    // Fetch more than needed so we can shuffle and slice
    const { data, error } = await query.limit(count * 3);

    if (error || !data || data.length === 0) throw new Error(error?.message || 'No results');

    // Shuffle and take requested count
    const shuffled = (data as Question[]).sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, count);

    // If DB returned fewer than needed, pad with seed + AI-generated
    if (selected.length < count) {
      const filtered = SEED_QUESTIONS.filter(q =>
        (!subject    || q.subject    === subject)    &&
        (!classLevel || q.class_level === classLevel) &&
        (!examType   || q.exam_type   === examType)
      ).sort(() => Math.random() - 0.5);

      const needed = count - selected.length;
      const fromSeed = filtered.slice(0, needed);
      selected.push(...fromSeed);

      // If still short, AI-generate the rest
      for (let i = selected.length; i < count; i++) {
        const aiQ = generateAIQuestion(
          subject || 'Physics',
          classLevel || 10,
          examType || 'NCERT',
          i
        );
        selected.push(aiQ);
        // Async insert for future users (fire & forget)
        sb.from('questions').insert([{
          question_text:        aiQ.question_text,
          options:              aiQ.options,
          correct_option_index: aiQ.correct_option_index,
          explanation:          aiQ.explanation,
          subject:              aiQ.subject,
          class_level:          aiQ.class_level,
          exam_type:            aiQ.exam_type,
          difficulty:           aiQ.difficulty,
        }]).then(() => {});
      }
    }

    return selected;
  } catch {
    // ── FULL OFFLINE FALLBACK: serve seed data only ──
    const filtered = SEED_QUESTIONS.filter(q =>
      (!subject    || q.subject     === subject)    &&
      (!classLevel || q.class_level === classLevel) &&
      (!examType   || q.exam_type   === examType)
    ).sort(() => Math.random() - 0.5);

    // Pad with unfiltered seeds if still short
    const pool = filtered.length >= count
      ? filtered
      : [...filtered, ...SEED_QUESTIONS.filter(q => !filtered.includes(q)).sort(() => Math.random() - 0.5)];

    const result = pool.slice(0, count);

    // Pad with AI-generated if absolutely necessary
    for (let i = result.length; i < count; i++) {
      result.push(generateAIQuestion(subject || 'Physics', classLevel || 10, examType || 'NCERT', i));
    }

    return result;
  }
}
