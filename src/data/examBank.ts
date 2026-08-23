export type ExamPaper = 'JEE Main' | 'JEE Advanced' | 'NEET';
export type ExamSubject = 'Physics' | 'Chemistry' | 'Mathematics' | 'Biology';
export type Difficulty = 'Easy' | 'Moderate' | 'Hard';

export type ExamQuestion = {
  id: string;
  paper: ExamPaper[];
  subject: ExamSubject;
  topic: string;
  question: string;
  options: string[];
  answer: number;
  solution: string;
  difficulty: Difficulty;
};

const q = (
  id: string,
  paper: ExamPaper[],
  subject: ExamSubject,
  topic: string,
  question: string,
  options: string[],
  answer: number,
  solution: string,
  difficulty: Difficulty = 'Moderate',
): ExamQuestion => ({ id, paper, subject, topic, question, options, answer, solution, difficulty });

const ALL: ExamPaper[] = ['JEE Main', 'JEE Advanced', 'NEET'];
const JEE: ExamPaper[] = ['JEE Main', 'JEE Advanced'];
const NEET_ONLY: ExamPaper[] = ['NEET'];

// ───────────────────────── PHYSICS ─────────────────────────
const physics: ExamQuestion[] = [
  q('ph-01', ALL, 'Physics', 'Kinematics', 'A particle moves with velocity v = 6t² − 4t m/s. Its displacement between t = 0 and t = 2 s is', ['8 m', '16 m', '12 m', '4 m'], 0, 's = ∫₀² (6t² − 4t) dt = [2t³ − 2t²]₀² = 16 − 8 = 8 m.'),
  q('ph-02', ALL, 'Physics', 'Laws of Motion', 'A 5 kg block on a rough floor (μ = 0.4) is pulled by a 30 N horizontal force. Its acceleration is (g = 10 m/s²)', ['2 m/s²', '4 m/s²', '6 m/s²', '1 m/s²'], 0, 'f = μmg = 0.4×5×10 = 20 N. a = (30 − 20)/5 = 2 m/s².'),
  q('ph-03', ALL, 'Physics', 'Work Power Energy', 'A body of mass 2 kg falls freely from 20 m. Its kinetic energy just before impact is', ['200 J', '400 J', '40 J', '800 J'], 1, 'KE = mgh = 2×10×20 = 400 J.', 'Easy'),
  q('ph-04', JEE, 'Physics', 'Rotational Motion', 'Moment of inertia of a uniform disc of mass M, radius R about its central axis is', ['MR²', 'MR²/2', 'MR²/4', '2MR²/5'], 1, 'For a disc about the central axis, I = MR²/2.', 'Easy'),
  q('ph-05', ALL, 'Physics', 'Gravitation', 'The escape velocity from the Earth\'s surface is about', ['7.9 km/s', '11.2 km/s', '3.0 km/s', '22.4 km/s'], 1, 'vₑ = √(2GM/R) ≈ 11.2 km/s.', 'Easy'),
  q('ph-06', ALL, 'Physics', 'SHM', 'A particle in SHM has amplitude A and angular frequency ω. Its maximum acceleration is', ['ωA', 'ω²A', 'ω²A²', 'ωA²'], 1, 'a = −ω²x, so |a|max = ω²A at extreme positions.'),
  q('ph-07', ALL, 'Physics', 'Thermodynamics', 'In an adiabatic process for an ideal gas', ['Q = 0', 'ΔU = 0', 'W = 0', 'ΔT = 0'], 0, 'Adiabatic means no heat exchange: Q = 0, so ΔU = −W.', 'Easy'),
  q('ph-08', JEE, 'Physics', 'Thermodynamics', 'For a Carnot engine working between 500 K and 300 K, the efficiency is', ['20%', '40%', '60%', '80%'], 1, 'η = 1 − T₂/T₁ = 1 − 300/500 = 0.4 = 40%.'),
  q('ph-09', ALL, 'Physics', 'Current Electricity', 'A wire of resistance R is stretched to twice its length. Its new resistance is', ['2R', 'R/2', '4R', 'R/4'], 2, 'Volume constant → A halves, l doubles → R′ = ρ(2l)/(A/2) = 4R.'),
  q('ph-10', ALL, 'Physics', 'Magnetism', 'A charged particle moving parallel to a uniform magnetic field experiences a force of magnitude', ['qvB', 'zero', 'qvB/2', 'qB/v'], 1, 'F = qvB sinθ; θ = 0 ⇒ F = 0.', 'Easy'),
  q('ph-11', JEE, 'Physics', 'EMI & AC', 'In a purely inductive AC circuit, the current', ['leads voltage by 90°', 'lags voltage by 90°', 'is in phase', 'lags by 45°'], 1, 'For an inductor the current lags the applied voltage by π/2.'),
  q('ph-12', ALL, 'Physics', 'Ray Optics', 'An object is placed 30 cm from a convex lens of focal length 20 cm. Image distance is', ['60 cm', '12 cm', '−60 cm', '20 cm'], 0, '1/v = 1/f + 1/u = 1/20 − 1/30 = 1/60 ⇒ v = 60 cm.'),
  q('ph-13', ALL, 'Physics', 'Modern Physics', 'The stopping potential in the photoelectric effect depends on', ['intensity of light', 'frequency of light', 'area of the plate', 'distance of the source'], 1, 'eV₀ = hν − φ, so V₀ depends on frequency, not intensity.'),
  q('ph-14', JEE, 'Physics', 'Nuclear Physics', 'The half-life of a sample is 10 days. Fraction left after 30 days is', ['1/2', '1/4', '1/8', '1/16'], 2, 'n = 3 half-lives ⇒ (1/2)³ = 1/8.', 'Easy'),
  q('ph-15', ALL, 'Physics', 'Semiconductors', 'In a p-n junction diode, the depletion region width decreases on', ['reverse bias', 'forward bias', 'cooling', 'doping less'], 1, 'Forward bias opposes the barrier field, narrowing the depletion layer.'),
  q('ph-16', JEE, 'Physics', 'Fluid Mechanics', 'Terminal velocity of a sphere in a viscous fluid is proportional to', ['r', 'r²', '1/r', 'r³'], 1, 'v_t = 2r²(ρ − σ)g / 9η ⇒ v_t ∝ r².'),
];

// ───────────────────────── CHEMISTRY ─────────────────────────
const chemistry: ExamQuestion[] = [
  q('ch-01', ALL, 'Chemistry', 'Mole Concept', 'Number of molecules in 11.2 L of an ideal gas at STP is', ['6.022×10²³', '3.011×10²³', '1.204×10²⁴', '6.022×10²²'], 1, '11.2 L at STP = 0.5 mol ⇒ 0.5 × 6.022×10²³ = 3.011×10²³.'),
  q('ch-02', ALL, 'Chemistry', 'Atomic Structure', 'The number of unpaired electrons in a ground-state Fe²⁺ ion (Z = 26) is', ['2', '4', '5', '6'], 1, 'Fe²⁺ is 3d⁶ ⇒ four unpaired electrons.'),
  q('ch-03', ALL, 'Chemistry', 'Periodic Table', 'Correct order of first ionisation enthalpy is', ['B < Be < N < O', 'Be < B < N < O', 'B < Be < O < N', 'O < N < Be < B'], 2, 'IE: B (801) < Be (899) < O (1314) < N (1402) kJ/mol.', 'Hard'),
  q('ch-04', ALL, 'Chemistry', 'Chemical Bonding', 'Hybridisation of the central atom in SF₄ is', ['sp³', 'sp³d', 'sp³d²', 'sp²'], 1, 'SF₄ has 4 bond pairs + 1 lone pair ⇒ sp³d (see-saw shape).'),
  q('ch-05', ALL, 'Chemistry', 'Thermodynamics', 'For a spontaneous process at constant T and P', ['ΔG > 0', 'ΔG = 0', 'ΔG < 0', 'ΔH < 0 always'], 2, 'Spontaneity requires ΔG = ΔH − TΔS < 0.', 'Easy'),
  q('ch-06', ALL, 'Chemistry', 'Equilibrium', 'For N₂ + 3H₂ ⇌ 2NH₃, increasing pressure shifts equilibrium', ['left', 'right', 'no change', 'stops the reaction'], 1, 'Fewer moles of gas on the product side, so higher pressure favours NH₃.'),
  q('ch-07', ALL, 'Chemistry', 'Electrochemistry', 'Standard EMF of a cell with E°cathode = 0.34 V and E°anode = −0.76 V is', ['0.42 V', '1.10 V', '−1.10 V', '0.76 V'], 1, 'E°cell = E°cathode − E°anode = 0.34 − (−0.76) = 1.10 V.', 'Easy'),
  q('ch-08', JEE, 'Chemistry', 'Chemical Kinetics', 'For a first-order reaction, the half-life is', ['dependent on [A]₀', '0.693/k', 'k/0.693', 'proportional to [A]₀'], 1, 't₁/₂ = ln2/k, independent of initial concentration.', 'Easy'),
  q('ch-09', ALL, 'Chemistry', 'Solutions', 'Which is a colligative property?', ['Viscosity', 'Osmotic pressure', 'Surface tension', 'Refractive index'], 1, 'Colligative properties depend on the number of solute particles — osmotic pressure is one.', 'Easy'),
  q('ch-10', ALL, 'Chemistry', 'Coordination Chemistry', 'The oxidation state of Cr in [Cr(NH₃)₆]Cl₃ is', ['+2', '+3', '+6', '0'], 1, 'NH₃ is neutral and three Cl⁻ balance the charge ⇒ Cr is +3.', 'Easy'),
  q('ch-11', ALL, 'Chemistry', 'Organic — GOC', 'Most stable carbocation among the following is', ['CH₃⁺', 'CH₃CH₂⁺', '(CH₃)₂CH⁺', '(CH₃)₃C⁺'], 3, 'Hyperconjugation and +I effect make the tertiary carbocation most stable.'),
  q('ch-12', ALL, 'Chemistry', 'Organic — Reactions', 'Markovnikov addition of HBr to propene gives mainly', ['1-bromopropane', '2-bromopropane', 'propane', '1,2-dibromopropane'], 1, 'H adds to the carbon with more H, Br to the more substituted carbon ⇒ 2-bromopropane.'),
  q('ch-13', JEE, 'Chemistry', 'Organic — Aromatic', 'Nitration of benzene uses', ['HNO₃ + NaOH', 'conc. HNO₃ + conc. H₂SO₄', 'dil. HNO₃ alone', 'NaNO₂ + HCl'], 1, 'H₂SO₄ generates the nitronium ion NO₂⁺, the electrophile.'),
  q('ch-14', ALL, 'Chemistry', 'Biomolecules', 'The glycosidic linkage in sucrose is between', ['C1 of glucose and C2 of fructose', 'C1 of glucose and C4 of fructose', 'C4 of glucose and C1 of fructose', 'C6 of both'], 0, 'Sucrose: α-glucose C1 — β-fructose C2 linkage, hence non-reducing.', 'Hard'),
  q('ch-15', NEET_ONLY, 'Chemistry', 'p-Block', 'The strongest reducing agent among hydrides of group 15 is', ['NH₃', 'PH₃', 'AsH₃', 'BiH₃'], 3, 'Bond dissociation enthalpy falls down the group ⇒ BiH₃ is the strongest reducing agent.'),
  q('ch-16', JEE, 'Chemistry', 'Solid State', 'Number of atoms per unit cell in a face-centred cubic lattice is', ['1', '2', '4', '6'], 2, '8 corners × 1/8 + 6 faces × 1/2 = 4 atoms.', 'Easy'),
];

// ───────────────────────── MATHEMATICS ─────────────────────────
const mathematics: ExamQuestion[] = [
  q('ma-01', JEE, 'Mathematics', 'Quadratic Equations', 'If the roots of x² − px + q = 0 are equal, then', ['p² = 4q', 'p² > 4q', 'p² < 4q', 'p = q'], 0, 'Equal roots ⇒ discriminant p² − 4q = 0.', 'Easy'),
  q('ma-02', JEE, 'Mathematics', 'Complex Numbers', 'The modulus of (1 + i)/(1 − i) is', ['1', '√2', '2', '0'], 0, '(1+i)/(1−i) = i, whose modulus is 1.'),
  q('ma-03', JEE, 'Mathematics', 'Sequences', 'Sum of the first 20 terms of an AP with a = 3, d = 4 is', ['820', '760', '800', '900'], 0, 'Sₙ = n/2[2a + (n−1)d] = 10[6 + 76] = 820.'),
  q('ma-04', JEE, 'Mathematics', 'Binomial Theorem', 'The coefficient of x³ in (1 + x)⁶ is', ['15', '20', '10', '6'], 1, 'C(6,3) = 20.', 'Easy'),
  q('ma-05', JEE, 'Mathematics', 'Trigonometry', 'If sin θ + cos θ = 1, then sin θ cos θ equals', ['0', '1/2', '1', '−1/2'], 0, 'Squaring: 1 + 2 sinθcosθ = 1 ⇒ sinθcosθ = 0.'),
  q('ma-06', JEE, 'Mathematics', 'Straight Lines', 'Distance of the point (1, 2) from the line 3x + 4y − 5 = 0 is', ['6/5', '1', '2', '11/5'], 0, '|3+8−5|/√(9+16) = 6/5.', 'Easy'),
  q('ma-07', JEE, 'Mathematics', 'Circles', 'The centre of x² + y² − 4x + 6y − 12 = 0 is', ['(2, −3)', '(−2, 3)', '(4, −6)', '(−4, 6)'], 0, 'Centre = (−g, −f) = (2, −3).', 'Easy'),
  q('ma-08', JEE, 'Mathematics', 'Conic Sections', 'Eccentricity of the ellipse x²/25 + y²/9 = 1 is', ['3/5', '4/5', '5/4', '1/2'], 1, 'e = √(1 − b²/a²) = √(1 − 9/25) = 4/5.'),
  q('ma-09', JEE, 'Mathematics', 'Limits', 'lim(x→0) (sin 3x)/x equals', ['1', '3', '0', '1/3'], 1, 'lim (sin3x)/(3x) × 3 = 3.', 'Easy'),
  q('ma-10', JEE, 'Mathematics', 'Differentiation', 'If y = x ln x, then dy/dx is', ['ln x', '1 + ln x', 'x', '1/x'], 1, 'Product rule: 1·ln x + x·(1/x) = 1 + ln x.'),
  q('ma-11', JEE, 'Mathematics', 'AOD', 'The function f(x) = x³ − 3x has a local minimum at', ['x = −1', 'x = 0', 'x = 1', 'x = 3'], 2, 'f′ = 3x² − 3 = 0 ⇒ x = ±1; f″(1) = 6 > 0 ⇒ minimum at x = 1.'),
  q('ma-12', JEE, 'Mathematics', 'Integration', '∫ dx/(1 + x²) equals', ['ln(1+x²) + C', 'tan⁻¹x + C', 'sin⁻¹x + C', '2x/(1+x²) + C'], 1, 'Standard result: ∫dx/(1+x²) = tan⁻¹x + C.', 'Easy'),
  q('ma-13', JEE, 'Mathematics', 'Definite Integrals', '∫₀^{π/2} sin x dx equals', ['0', '1', 'π/2', '2'], 1, '[−cos x]₀^{π/2} = 0 − (−1) = 1.', 'Easy'),
  q('ma-14', JEE, 'Mathematics', 'Probability', 'Two dice are thrown. Probability that the sum is 8 is', ['5/36', '1/6', '1/9', '7/36'], 0, 'Favourable pairs: (2,6),(3,5),(4,4),(5,3),(6,2) = 5 ⇒ 5/36.'),
  q('ma-15', JEE, 'Mathematics', 'Matrices', 'If A is a 3×3 matrix with |A| = 2, then |2A| equals', ['4', '8', '16', '2'], 2, '|kA| = k³|A| = 8 × 2 = 16.'),
  q('ma-16', JEE, 'Mathematics', 'Vectors', 'If a·b = 0 for non-zero vectors, the vectors are', ['parallel', 'perpendicular', 'equal', 'collinear'], 1, 'Zero dot product means the angle is 90°.', 'Easy'),
];

// ───────────────────────── BIOLOGY ─────────────────────────
const biology: ExamQuestion[] = [
  q('bi-01', NEET_ONLY, 'Biology', 'Cell Biology', 'Which organelle is the site of protein synthesis?', ['Lysosome', 'Ribosome', 'Peroxisome', 'Centriole'], 1, 'Ribosomes translate mRNA into polypeptides.', 'Easy'),
  q('bi-02', NEET_ONLY, 'Biology', 'Cell Cycle', 'Crossing over occurs during which stage?', ['Leptotene', 'Zygotene', 'Pachytene', 'Diplotene'], 2, 'Recombination via crossing over occurs in pachytene of prophase I.'),
  q('bi-03', NEET_ONLY, 'Biology', 'Plant Physiology', 'The pigment that absorbs light maximally in photosynthesis is', ['Chlorophyll b', 'Chlorophyll a', 'Carotenoid', 'Xanthophyll'], 1, 'Chlorophyll a is the chief pigment and reaction-centre molecule.', 'Easy'),
  q('bi-04', NEET_ONLY, 'Biology', 'Plant Physiology', 'C₄ plants avoid photorespiration because', ['they lack RuBisCO', 'CO₂ is concentrated in bundle sheath cells', 'they fix N₂', 'stomata stay open'], 1, 'PEP carboxylase concentrates CO₂ in bundle sheath cells, suppressing oxygenation.'),
  q('bi-05', NEET_ONLY, 'Biology', 'Human Physiology', 'Oxygen dissociation curve shifts right on', ['increase in pH', 'decrease in CO₂', 'increase in H⁺ concentration', 'decrease in temperature'], 2, 'Bohr effect: more H⁺/CO₂ lowers haemoglobin affinity, shifting the curve right.'),
  q('bi-06', NEET_ONLY, 'Biology', 'Human Physiology', 'The functional unit of the kidney is the', ['Neuron', 'Nephron', 'Alveolus', 'Nephridia'], 1, 'Each kidney has about a million nephrons.', 'Easy'),
  q('bi-07', NEET_ONLY, 'Biology', 'Human Physiology', 'Insulin is secreted by', ['alpha cells', 'beta cells', 'delta cells', 'acinar cells'], 1, 'β-cells of the islets of Langerhans secrete insulin.', 'Easy'),
  q('bi-08', NEET_ONLY, 'Biology', 'Genetics', 'A cross between AaBb × aabb gives a phenotypic ratio of', ['9:3:3:1', '1:1:1:1', '3:1', '1:2:1'], 1, 'A test cross of a dihybrid gives four phenotypes in equal 1:1:1:1 proportion.'),
  q('bi-09', NEET_ONLY, 'Biology', 'Genetics', 'Colour blindness in humans is', ['autosomal dominant', 'X-linked recessive', 'Y-linked', 'autosomal recessive'], 1, 'The gene lies on the X chromosome and is recessive, so males are affected more.', 'Easy'),
  q('bi-10', NEET_ONLY, 'Biology', 'Molecular Biology', 'In DNA replication, the enzyme that joins Okazaki fragments is', ['helicase', 'DNA ligase', 'primase', 'topoisomerase'], 1, 'DNA ligase seals the nicks between adjacent fragments on the lagging strand.'),
  q('bi-11', NEET_ONLY, 'Biology', 'Molecular Biology', 'Number of hydrogen bonds between guanine and cytosine is', ['1', '2', '3', '4'], 2, 'G≡C forms three hydrogen bonds; A=T forms two.', 'Easy'),
  q('bi-12', NEET_ONLY, 'Biology', 'Reproduction', 'Double fertilisation in angiosperms produces', ['zygote only', 'zygote and endosperm', 'endosperm only', 'two zygotes'], 1, 'Syngamy gives the zygote; triple fusion gives the primary endosperm nucleus.'),
  q('bi-13', NEET_ONLY, 'Biology', 'Ecology', 'Pyramid of energy in an ecosystem is always', ['inverted', 'upright', 'spindle-shaped', 'variable'], 1, 'Energy is lost at each transfer, so the energy pyramid is always upright.', 'Easy'),
  q('bi-14', NEET_ONLY, 'Biology', 'Biotechnology', 'The vector most commonly used in plant genetic engineering is', ['E. coli plasmid', 'Agrobacterium tumefaciens Ti plasmid', 'Bacteriophage λ', 'Yeast'], 1, 'The Ti plasmid of A. tumefaciens transfers T-DNA into plant genomes.'),
  q('bi-15', NEET_ONLY, 'Biology', 'Evolution', 'Industrial melanism in peppered moths demonstrates', ['genetic drift', 'natural selection', 'mutation pressure', 'gene flow'], 1, 'Darker moths survived better on soot-covered trees — directional natural selection.'),
  q('bi-16', NEET_ONLY, 'Biology', 'Human Health', 'The causative agent of malaria in humans is', ['Trypanosoma', 'Plasmodium', 'Entamoeba', 'Wuchereria'], 1, 'Plasmodium species, transmitted by female Anopheles mosquitoes.', 'Easy'),
];

export const examBank: ExamQuestion[] = [...physics, ...chemistry, ...mathematics, ...biology];

export const PAPER_CONFIG: Record<ExamPaper, { subjects: ExamSubject[]; perSubject: number; minutes: number; positive: number; negative: number }> = {
  'JEE Main': { subjects: ['Physics', 'Chemistry', 'Mathematics'], perSubject: 10, minutes: 60, positive: 4, negative: 1 },
  'JEE Advanced': { subjects: ['Physics', 'Chemistry', 'Mathematics'], perSubject: 8, minutes: 50, positive: 4, negative: 2 },
  NEET: { subjects: ['Physics', 'Chemistry', 'Biology'], perSubject: 10, minutes: 60, positive: 4, negative: 1 },
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function buildPaper(paper: ExamPaper): ExamQuestion[] {
  const cfg = PAPER_CONFIG[paper];
  return cfg.subjects.flatMap((subject) => {
    const pool = examBank.filter((item) => item.subject === subject && item.paper.includes(paper));
    const fallback = examBank.filter((item) => item.subject === subject);
    const source = pool.length >= 4 ? pool : fallback;
    return shuffle(source).slice(0, cfg.perSubject);
  });
}

export function questionsBySubject(list: ExamQuestion[], subject: ExamSubject) {
  return list.filter((item) => item.subject === subject);
}
