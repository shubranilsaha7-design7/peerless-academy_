export type Subject = 'Physics' | 'Chemistry' | 'Mathematics' | 'Biology';

export type Question = {
  id: string;
  klass: number; // 5..12
  subject: Subject;
  topic: string;
  question: string;
  options: string[];
  answer: number; // index
  solution: string;
};

export const questionBank: Question[] = [
  { id: 'p1', klass: 11, subject: 'Physics', topic: 'Kinematics', question: 'A body is thrown up with 20 m/s. Time to reach the highest point (g = 10 m/s²)?', options: ['1 s', '2 s', '4 s', '0.5 s'], answer: 1, solution: 't = u/g = 20/10 = 2 s.' },
  { id: 'p2', klass: 11, subject: 'Physics', topic: 'Projectile', question: 'Range of a projectile is maximum at a launch angle of', options: ['30°', '45°', '60°', '90°'], answer: 1, solution: 'R = u²sin2θ/g is maximum when sin2θ = 1, i.e. θ = 45°.' },
  { id: 'p3', klass: 12, subject: 'Physics', topic: 'Current Electricity', question: 'Two 6 Ω resistors in parallel give an equivalent resistance of', options: ['12 Ω', '6 Ω', '3 Ω', '1.5 Ω'], answer: 2, solution: '1/R = 1/6 + 1/6 = 1/3, so R = 3 Ω.' },
  { id: 'p4', klass: 10, subject: 'Physics', topic: 'Optics', question: 'A concave mirror always forms a virtual image when the object is', options: ['At focus', 'Beyond C', 'Between pole and focus', 'At C'], answer: 2, solution: 'For an object between the pole and focus, a concave mirror forms a virtual, erect, magnified image.' },
  { id: 'p5', klass: 9, subject: 'Physics', topic: 'Motion', question: 'SI unit of acceleration is', options: ['m/s', 'm/s²', 'N', 'J'], answer: 1, solution: 'Acceleration = change in velocity / time → m/s².' },
  { id: 'p6', klass: 12, subject: 'Physics', topic: 'Modern Physics', question: 'Photoelectric emission depends on', options: ['Intensity only', 'Frequency of light', 'Wavelength only for metals', 'Temperature'], answer: 1, solution: 'Emission occurs only above the threshold frequency; intensity affects the number of electrons, not their emission.' },

  { id: 'c1', klass: 11, subject: 'Chemistry', topic: 'Mole Concept', question: 'Number of moles in 44 g of CO₂ is', options: ['0.5', '1', '2', '4'], answer: 1, solution: 'Molar mass of CO₂ = 44 g/mol → 44/44 = 1 mole.' },
  { id: 'c2', klass: 11, subject: 'Chemistry', topic: 'Atomic Structure', question: 'Maximum electrons in the M shell', options: ['8', '18', '32', '2'], answer: 1, solution: 'M shell (n = 3) holds 2n² = 18 electrons.' },
  { id: 'c3', klass: 12, subject: 'Chemistry', topic: 'Organic', question: 'Which is a functional group of alcohols?', options: ['–CHO', '–OH', '–COOH', '–NH₂'], answer: 1, solution: 'Alcohols contain the hydroxyl (–OH) group.' },
  { id: 'c4', klass: 10, subject: 'Chemistry', topic: 'Acids & Bases', question: 'pH of a neutral solution at 25 °C is', options: ['0', '7', '14', '1'], answer: 1, solution: 'Neutral water has [H⁺] = 10⁻⁷ M → pH 7.' },
  { id: 'c5', klass: 9, subject: 'Chemistry', topic: 'Matter', question: 'Change of solid directly to gas is called', options: ['Melting', 'Sublimation', 'Condensation', 'Freezing'], answer: 1, solution: 'Solid → gas without a liquid stage is sublimation.' },
  { id: 'c6', klass: 12, subject: 'Chemistry', topic: 'Electrochemistry', question: 'In a galvanic cell, oxidation happens at the', options: ['Cathode', 'Anode', 'Salt bridge', 'Electrolyte'], answer: 1, solution: 'Oxidation always occurs at the anode (negative electrode in a galvanic cell).' },

  { id: 'm1', klass: 10, subject: 'Mathematics', topic: 'Quadratics', question: 'Roots of x² − 5x + 6 = 0 are', options: ['1, 6', '2, 3', '−2, −3', '5, 6'], answer: 1, solution: 'x² − 5x + 6 = (x − 2)(x − 3) → x = 2, 3.' },
  { id: 'm2', klass: 12, subject: 'Mathematics', topic: 'Calculus', question: 'd/dx (sin x) equals', options: ['cos x', '−cos x', 'sin x', '−sin x'], answer: 0, solution: 'The derivative of sin x is cos x.' },
  { id: 'm3', klass: 11, subject: 'Mathematics', topic: 'Trigonometry', question: 'Value of sin 30° is', options: ['1/2', '√3/2', '1', '0'], answer: 0, solution: 'sin 30° = 1/2 (standard value).' },
  { id: 'm4', klass: 8, subject: 'Mathematics', topic: 'Algebra', question: 'If 3x + 6 = 21, then x =', options: ['3', '5', '7', '9'], answer: 1, solution: '3x = 15 → x = 5.' },
  { id: 'm5', klass: 6, subject: 'Mathematics', topic: 'Fractions', question: '1/2 + 1/3 =', options: ['2/5', '5/6', '3/5', '1/6'], answer: 1, solution: 'LCM 6 → 3/6 + 2/6 = 5/6.' },
  { id: 'm6', klass: 5, subject: 'Mathematics', topic: 'Numbers', question: 'Which is the smallest prime number?', options: ['0', '1', '2', '3'], answer: 2, solution: '2 is the smallest (and only even) prime number.' },
  { id: 'm7', klass: 12, subject: 'Mathematics', topic: 'Integration', question: '∫ x dx =', options: ['x²', 'x²/2 + C', '2x + C', '1 + C'], answer: 1, solution: '∫xⁿ dx = xⁿ⁺¹/(n+1) + C → x²/2 + C.' },

  { id: 'b1', klass: 11, subject: 'Biology', topic: 'Cell Biology', question: 'Powerhouse of the cell is', options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi body'], answer: 1, solution: 'Mitochondria generate ATP through cellular respiration.' },
  { id: 'b2', klass: 12, subject: 'Biology', topic: 'Genetics', question: 'Mendel worked on which plant?', options: ['Maize', 'Pea', 'Rice', 'Wheat'], answer: 1, solution: 'Mendel used the garden pea (Pisum sativum).' },
  { id: 'b3', klass: 10, subject: 'Biology', topic: 'Life Processes', question: 'Exchange of gases in humans occurs in the', options: ['Trachea', 'Bronchi', 'Alveoli', 'Larynx'], answer: 2, solution: 'Alveoli provide the surface for gaseous exchange.' },
  { id: 'b4', klass: 9, subject: 'Biology', topic: 'Tissues', question: 'Which tissue conducts water in plants?', options: ['Phloem', 'Xylem', 'Cambium', 'Cortex'], answer: 1, solution: 'Xylem conducts water and minerals upward.' },
  { id: 'b5', klass: 7, subject: 'Biology', topic: 'Nutrition', question: 'Green plants prepare food by', options: ['Respiration', 'Photosynthesis', 'Transpiration', 'Digestion'], answer: 1, solution: 'Photosynthesis converts CO₂ and water into glucose using sunlight.' },
  { id: 'b6', klass: 12, subject: 'Biology', topic: 'Human Physiology', question: 'Normal human heart rate at rest (beats/min) is about', options: ['30–40', '72', '120', '200'], answer: 1, solution: 'The resting adult heart rate averages ~72 beats per minute.' },
];

export const subjects: Subject[] = ['Physics', 'Chemistry', 'Mathematics', 'Biology'];
export const classes = [5, 6, 7, 8, 9, 10, 11, 12];

export function pickQuestions(klass: number, subject: Subject, count = 5): Question[] {
  const exact = questionBank.filter((q) => q.subject === subject && q.klass === klass);
  const near = questionBank
    .filter((q) => q.subject === subject && q.klass !== klass)
    .sort((a, b) => Math.abs(a.klass - klass) - Math.abs(b.klass - klass));
  return [...exact, ...near].slice(0, count);
}
