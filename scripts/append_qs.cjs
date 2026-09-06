const fs = require('fs');
let content = fs.readFileSync('src/data/mockQuestionsPool.ts', 'utf8');

const newQuestions = `
export const EXTRA_CLASS_QUESTIONS = [
  {
    id: 'class5_math_1',
    class_level: 'Class 5',
    subject: 'Mathematics',
    question_latex: "What is the LCM of 12 and 15?",
    options: ["60", "30", "120", "15"],
    correct_option: 0,
    solution_latex: "The prime factors are $12 = 2^2 \\times 3$ and $15 = 3 \\times 5$. LCM = $2^2 \\times 3 \\times 5 = 60$."
  },
  {
    id: 'class6_sci_1',
    class_level: 'Class 6',
    subject: 'Science',
    question_latex: "Which of the following is a reversible change?",
    options: ["Melting of ice", "Burning of paper", "Rusting of iron", "Cooking of food"],
    correct_option: 0,
    solution_latex: "Melting of ice is a physical change and can be reversed by freezing the water again."
  },
  {
    id: 'class7_math_1',
    class_level: 'Class 7',
    subject: 'Mathematics',
    question_latex: "Solve for $x$: $3x + 5 = 20$",
    options: ["5", "4", "3", "6"],
    correct_option: 0,
    solution_latex: "$3x = 15 \\implies x = 5$."
  },
  {
    id: 'class8_sci_1',
    class_level: 'Class 8',
    subject: 'Science',
    question_latex: "Which microorganism is responsible for converting milk into curd?",
    options: ["Lactobacillus", "Rhizobium", "Yeast", "Amoeba"],
    correct_option: 0,
    solution_latex: "Lactobacillus promotes the formation of curd."
  },
  {
    id: 'class9_phy_1',
    class_level: 'Class 9',
    subject: 'Physics',
    question_latex: "What is the SI unit of momentum?",
    options: ["$kg \\cdot m/s$", "$N \\cdot s$", "$Joule$", "$Watt$"],
    correct_option: 0,
    solution_latex: "$p = mv$, so the unit is $kg \\cdot m/s$."
  },
  {
    id: 'class10_chem_1',
    class_level: 'Class 10',
    subject: 'Chemistry',
    question_latex: "What happens when dilute hydrochloric acid is added to iron fillings?",
    options: ["Hydrogen gas and iron chloride are produced.", "Chlorine gas and iron hydroxide are produced.", "No reaction takes place.", "Iron salt and water are produced."],
    correct_option: 0,
    solution_latex: "$Fe + 2HCl \\rightarrow FeCl_2 + H_2$"
  },
  {
    id: 'class11_bio_1',
    class_level: 'Class 11',
    subject: 'Biology',
    question_latex: "Which of the following is the energy currency of the cell?",
    options: ["ATP", "ADP", "DNA", "RNA"],
    correct_option: 0,
    solution_latex: "ATP (Adenosine Triphosphate) stores and provides energy for cellular processes."
  },
  {
    id: 'class12_math_1',
    class_level: 'Class 12',
    subject: 'Mathematics',
    question_latex: "Evaluate the integral: $\\int e^x dx$",
    options: ["$e^x + C$", "$x e^x + C$", "$\\ln(x) + C$", "$e^{2x} + C$"],
    correct_option: 0,
    solution_latex: "The integral of $e^x$ is $e^x + C$."
  }
];
`;

content = content + newQuestions + `\n MASTER_QUESTIONS.push(...EXTRA_CLASS_QUESTIONS);\n`;

fs.writeFileSync('src/data/mockQuestionsPool.ts', content);
