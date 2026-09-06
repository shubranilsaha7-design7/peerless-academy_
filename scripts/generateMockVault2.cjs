const fs = require('fs');

const MASTER_QUESTIONS = [];
const addBlock = (class_level, subject, startId, qs) => {
  qs.forEach((q, idx) => {
    MASTER_QUESTIONS.push({
      id: `mock-${class_level.replace(' ', '')}-${subject}-${startId + idx}`,
      class_level,
      subject,
      question_latex: q.q,
      options: q.o,
      correct_option: q.c,
      solution_latex: q.s || 'Standard derivation applied.'
    });
  });
};

addBlock('Class 10', 'Mathematics', 1, [
  {q: 'If the roots of the quadratic equation $x^2 + px + q = 0$ are $\\tan 30^\\circ$ and $\\tan 15^\\circ$, find $q - p$.', o: ['1', '2', '3', '0'], c: 0},
  {q: 'A tangent to a circle of radius $5\\text{ cm}$ from a point $P$ is $12\\text{ cm}$. The distance of $P$ from the center is?', o: ['13 cm', '10 cm', '14 cm', '15 cm'], c: 0},
  {q: 'The $n$-th term of an AP is $3n + 5$. Its common difference is?', o: ['3', '5', '8', '2'], c: 0},
  {q: 'Find the probability of getting a prime number on a single roll of a die.', o: ['1/2', '1/3', '1/6', '2/3'], c: 0},
  {q: 'The HCF of 96 and 404 is?', o: ['4', '2', '6', '8'], c: 0},
  {q: 'If $\\sin A = \\frac{3}{4}$, calculate $\\cos A$.', o: ['$\\frac{\\sqrt{7}}{4}$', '$\\frac{1}{4}$', '$\\frac{3}{5}$', '$\\frac{4}{5}$'], c: 0},
  {q: 'Distance between $(2, 3)$ and $(4, 1)$ is?', o: ['$2\\sqrt{2}$', '$3\\sqrt{2}$', '$4$', '$2$'], c: 0},
  {q: 'Mean of first 5 natural numbers is?', o: ['3', '4', '2', '5'], c: 0},
  {q: 'If the perimeter and the area of a circle are numerically equal, the radius is?', o: ['2 units', '$\\pi$ units', '4 units', '7 units'], c: 0},
  {q: 'Evaluate $\\sec^2 60^\\circ - 1$.', o: ['3', '4', '2', '0'], c: 0},
]);

addBlock('Class 10', 'Science', 11, [
  {q: 'Which of the following is a balanced equation?', o: ['$H_2 + O_2 \\to H_2O$', '$2H_2 + O_2 \\to 2H_2O$', '$H_2 + O_2 \\to 2H_2O$', '$H_2 + 2O_2 \\to H_2O$'], c: 1},
  {q: 'The pH of gastric juice is approx?', o: ['1.2', '7.4', '10', '14'], c: 0},
  {q: 'What is the SI unit of electric power?', o: ['Watt', 'Joule', 'Ampere', 'Volt'], c: 0},
  {q: 'Refractive index of water is?', o: ['1.33', '1.5', '2.42', '1.0'], c: 0},
  {q: 'Ozone layer protects us from?', o: ['UV Rays', 'Infrared', 'Microwaves', 'X-rays'], c: 0},
  {q: 'Which hormone regulates blood sugar?', o: ['Insulin', 'Adrenaline', 'Thyroxine', 'Estrogen'], c: 0},
  {q: 'Power of a convex lens of focal length 2m is?', o: ['+0.5 D', '-0.5 D', '+2 D', '-2 D'], c: 0},
  {q: 'An alloy of Copper and Zinc is?', o: ['Brass', 'Bronze', 'Solder', 'Steel'], c: 0},
  {q: 'Autotrophic nutrition requires?', o: ['CO2 and Water', 'Chlorophyll', 'Sunlight', 'All of the above'], c: 3},
  {q: 'Where does fertilization occur in humans?', o: ['Fallopian Tube', 'Uterus', 'Ovary', 'Vagina'], c: 0},
]);

addBlock('Class 11', 'Physics', 21, [
  {q: 'A car accelerates from rest at $2\\text{ m/s}^2$ for 10s. Distance covered?', o: ['100m', '200m', '50m', '150m'], c: 0},
  {q: 'Work done by a conservative force in a closed loop is?', o: ['Zero', 'Positive', 'Negative', 'Infinite'], c: 0},
  {q: 'Moment of inertia of a solid sphere of mass $M$ and radius $R$ is?', o: ['$\\frac{2}{5}MR^2$', '$\\frac{2}{3}MR^2$', '$\\frac{1}{2}MR^2$', '$MR^2$'], c: 0},
  {q: 'Escape velocity from Earth is approx?', o: ['11.2 km/s', '8 km/s', '3 \\times 10^8 m/s', '9.8 m/s'], c: 0},
  {q: 'Bernoulli’s theorem is a consequence of conservation of?', o: ['Energy', 'Mass', 'Momentum', 'Angular Momentum'], c: 0},
  {q: 'First law of thermodynamics implies conservation of?', o: ['Energy', 'Heat', 'Temperature', 'Entropy'], c: 0},
  {q: 'Root mean square velocity of gas molecules is proportional to?', o: ['$\\sqrt{T}$', '$T$', '$T^2$', '$1/T$'], c: 0},
  {q: 'A simple pendulum\'s time period is?', o: ['$2\\pi\\sqrt{L/g}$', '$2\\pi\\sqrt{g/L}$', '$\\sqrt{L/g}$', '$2\\pi L/g$'], c: 0},
  {q: 'Young\'s modulus applies to?', o: ['Solids', 'Liquids', 'Gases', 'Fluids'], c: 0},
  {q: 'Angular momentum is constant if?', o: ['Net torque is zero', 'Net force is zero', 'Velocity is zero', 'Mass is constant'], c: 0},
]);

addBlock('Class 11', 'Chemistry', 31, [
  {q: 'Number of moles in 18g of water?', o: ['1', '2', '0.5', '18'], c: 0},
  {q: 'Principal quantum number $n=3$ has how many orbitals?', o: ['9', '3', '6', '18'], c: 0},
  {q: 'Shape of $NH_3$ molecule is?', o: ['Pyramidal', 'Tetrahedral', 'Trigonal planar', 'Linear'], c: 0},
  {q: 'Which is the most electronegative element?', o: ['Fluorine', 'Oxygen', 'Chlorine', 'Nitrogen'], c: 0},
  {q: 'Oxidation state of Mn in $KMnO_4$?', o: ['+7', '+6', '+5', '+4'], c: 0},
  {q: 'Boyle’s law relates?', o: ['P and V at constant T', 'V and T at constant P', 'P and T at constant V', 'P, V, T'], c: 0},
  {q: 'Enthalpy of an exothermic reaction is?', o: ['Negative', 'Positive', 'Zero', 'Infinite'], c: 0},
  {q: 'Conjugate base of $H_2O$ is?', o: ['$OH^-$', '$H_3O^+$', '$H^+$', '$O^{2-}$'], c: 0},
  {q: 'Hybridization of Carbon in Benzene?', o: ['$sp^2$', '$sp^3$', '$sp$', '$dsp^2$'], c: 0},
  {q: 'Which series of hydrogen spectrum falls in visible region?', o: ['Balmer', 'Lyman', 'Paschen', 'Brackett'], c: 0},
]);

addBlock('Class 12', 'Physics', 41, [
  {q: 'Electric field inside a hollow spherical conductor is?', o: ['Zero', 'Constant', 'Infinite', 'Varies with $r$'], c: 0},
  {q: 'Capacitance of a parallel plate capacitor?', o: ['$\\frac{\\epsilon_0 A}{d}$', '$\\frac{d}{\\epsilon_0 A}$', '$\\frac{\\epsilon_0 d}{A}$', '$A d \\epsilon_0$'], c: 0},
  {q: 'Kirchhoff’s junction rule is based on conservation of?', o: ['Charge', 'Energy', 'Mass', 'Momentum'], c: 0},
  {q: 'Magnetic field at the center of a circular coil?', o: ['$\\frac{\\mu_0 I}{2R}$', '$\\frac{\\mu_0 I}{4\\pi R}$', '$\\frac{\\mu_0 I}{2\\pi R}$', 'Zero'], c: 0},
  {q: 'Lenz’s law gives the direction of?', o: ['Induced EMF', 'Magnetic Field', 'Electric Field', 'Current'], c: 0},
  {q: 'Impedance of an LCR circuit at resonance is?', o: ['$R$', '$\\sqrt{R^2 + X_L^2}$', '$X_L - X_C$', 'Zero'], c: 0},
  {q: 'Velocity of electromagnetic wave in vacuum?', o: ['$\\frac{1}{\\sqrt{\\mu_0 \\epsilon_0}}$', '$\\sqrt{\\mu_0 \\epsilon_0}$', '$\\mu_0 \\epsilon_0$', '$\\frac{\\mu_0}{\\epsilon_0}$'], c: 0},
  {q: 'Snell’s law is?', o: ['$\\frac{\\sin i}{\\sin r} = \\mu$', '$i = r$', '$\\sin i \\cdot \\sin r = \\mu$', '$\\mu_1 \\sin r = \\mu_2 \\sin i$'], c: 0},
  {q: 'Energy of a photon is?', o: ['$h\\nu$', '$hc/\\lambda^2$', '$h/\\lambda$', '$\\lambda/h$'], c: 0},
  {q: 'Majority charge carriers in N-type semiconductor?', o: ['Electrons', 'Holes', 'Protons', 'Neutrons'], c: 0},
]);

addBlock('Class 12', 'Chemistry', 51, [
  {q: 'Unit of first order reaction rate constant?', o: ['$s^{-1}$', '$mol L^{-1} s^{-1}$', '$L mol^{-1} s^{-1}$', 'dimensionless'], c: 0},
  {q: 'Which defect lowers the density of a crystal?', o: ['Schottky', 'Frenkel', 'Interstitial', 'F-center'], c: 0},
  {q: 'Molarity of pure water?', o: ['55.5 M', '18 M', '1 M', '100 M'], c: 0},
  {q: 'Nernst equation is used to calculate?', o: ['Cell Potential', 'Rate constant', 'Equilibrium constant', 'Activation energy'], c: 0},
  {q: 'Catalyst used in Contact Process?', o: ['$V_2O_5$', '$Fe$', '$Ni$', '$Pt$'], c: 0},
  {q: 'Which ligand is bidentate?', o: ['Oxalate', 'Cyanide', 'Ammonia', 'Water'], c: 0},
  {q: 'Lucas reagent is?', o: ['Anh. $ZnCl_2$ + conc. $HCl$', '$Br_2$ water', '$AgNO_3$ in $NH_3$', 'Alkaline $KMnO_4$'], c: 0},
  {q: 'Iodoform test is given by?', o: ['Ethanol', 'Methanol', 'Formaldehyde', 'Acetic acid'], c: 0},
  {q: 'Vitamin C is also known as?', o: ['Ascorbic acid', 'Retinol', 'Calciferol', 'Tocopherol'], c: 0},
  {q: 'Polymer of Teflon is?', o: ['Tetrafluoroethene', 'Ethene', 'Vinyl chloride', 'Styrene'], c: 0},
]);

addBlock('NEET', 'Biology', 61, [
  {q: 'Which is the largest gland in the human body?', o: ['Liver', 'Pancreas', 'Thyroid', 'Adrenal'], c: 0},
  {q: 'Site of protein synthesis in a cell?', o: ['Ribosomes', 'Lysosomes', 'Mitochondria', 'Golgi apparatus'], c: 0},
  {q: 'Pacemaker of the heart is?', o: ['SA Node', 'AV Node', 'Purkinje fibers', 'Bundle of His'], c: 0},
  {q: 'Which hormone induces sleep?', o: ['Melatonin', 'Serotonin', 'Dopamine', 'Thyroxine'], c: 0},
  {q: 'Male gametophyte of angiosperms is?', o: ['Pollen grain', 'Anther', 'Microspore', 'Stamen'], c: 0},
  {q: 'Basic unit of classification is?', o: ['Species', 'Genus', 'Family', 'Order'], c: 0},
  {q: 'Cranial nerves in humans?', o: ['12 pairs', '10 pairs', '14 pairs', '8 pairs'], c: 0},
  {q: 'DNA replication is?', o: ['Semi-conservative', 'Conservative', 'Dispersive', 'Non-conservative'], c: 0},
  {q: 'Theory of Natural Selection was proposed by?', o: ['Darwin', 'Lamarck', 'Mendel', 'Pasteur'], c: 0},
  {q: 'Kranz anatomy is found in?', o: ['C4 plants', 'C3 plants', 'CAM plants', 'Gymnosperms'], c: 0},
  {q: 'Which blood group is universal acceptor?', o: ['AB', 'O', 'A', 'B'], c: 0},
  {q: 'Hormone responsible for ovulation?', o: ['LH', 'FSH', 'Estrogen', 'Progesterone'], c: 0},
  {q: 'Longest bone in human body?', o: ['Femur', 'Tibia', 'Humerus', 'Radius'], c: 0},
  {q: 'Phloem transports?', o: ['Food', 'Water', 'Minerals', 'Air'], c: 0},
  {q: 'Which organelle is semi-autonomous?', o: ['Mitochondria', 'Lysosome', 'ER', 'Vacuole'], c: 0},
  {q: 'Double fertilization is characteristic of?', o: ['Angiosperms', 'Gymnosperms', 'Pteridophytes', 'Bryophytes'], c: 0},
  {q: 'Which vector causes malaria?', o: ['Female Anopheles', 'Culex', 'Aedes', 'Housefly'], c: 0},
  {q: 'Antibodies are secreted by?', o: ['B-lymphocytes', 'T-lymphocytes', 'Macrophages', 'Erythrocytes'], c: 0},
  {q: 'What is the end product of glycolysis?', o: ['Pyruvic acid', 'Lactic acid', 'Citric acid', 'Acetyl CoA'], c: 0},
  {q: 'Total ATP produced in aerobic respiration?', o: ['38', '2', '36', '40'], c: 0},
]);

addBlock('JEE Main', 'Mathematics', 81, [
  {q: 'If $f(x) = x^3 + x$, then $f^{-1}(2)$ is?', o: ['1', '0', '-1', '2'], c: 0},
  {q: 'Limit $x \\to 0$ of $\\frac{\\sin x}{x}$ is?', o: ['1', '0', '$\\infty$', 'Does not exist'], c: 0},
  {q: 'Value of $\\int_{0}^{\\pi/2} \\log(\\tan x) dx$ is?', o: ['0', '$\\pi/2$', '$\\pi/4$', '$1$'], c: 0},
  {q: 'The maximum value of $3\\cos x + 4\\sin x$ is?', o: ['5', '7', '1', '12'], c: 0},
  {q: 'Number of ways to arrange the letters of "APPLE"?', o: ['60', '120', '30', '20'], c: 0},
  {q: 'Area of triangle formed by $(0,0), (a,0), (0,b)$ is?', o: ['$\\frac{1}{2}ab$', '$ab$', '$\\sqrt{a^2+b^2}$', '$\\frac{a+b}{2}$'], c: 0},
  {q: 'Derivative of $e^{\\sin x}$ is?', o: ['$e^{\\sin x}\\cos x$', '$e^{\\cos x}$', '$e^{\\sin x}$', '$\\cos x e^{\\cos x}$'], c: 0},
  {q: 'Probability of a leap year having 53 Sundays is?', o: ['2/7', '1/7', '53/366', '3/7'], c: 0},
  {q: 'Distance from origin to plane $2x - y + 2z = 6$ is?', o: ['2', '6', '3', '1'], c: 0},
  {q: 'If $A$ and $B$ are symmetric matrices, $AB - BA$ is?', o: ['Skew-symmetric', 'Symmetric', 'Null matrix', 'Identity'], c: 0},
  {q: 'Equation of tangent to $y=x^2$ at $(1,1)$ is?', o: ['$y=2x-1$', '$y=x$', '$y=2x+1$', '$y=x-1$'], c: 0},
  {q: 'Sum of the infinite GP $1, 1/2, 1/4...$ is?', o: ['2', '1', '$\\infty$', '1.5'], c: 0},
  {q: 'Root of $e^x - x = 0$? (real roots)', o: ['0', '1', 'None', 'e'], c: 2},
  {q: 'Value of $i^4 + i^5 + i^6 + i^7$ is?', o: ['0', '1', '-1', 'i'], c: 0},
  {q: 'Locus of $z$ such that $|z - 1| = |z + 1|$ is?', o: ['y-axis', 'x-axis', 'circle', 'parabola'], c: 0},
  {q: 'The sum of roots of $x^3 - 6x^2 + 11x - 6 = 0$ is?', o: ['6', '11', '6', '1'], c: 0},
  {q: 'Rank of a $3 \\times 3$ non-singular matrix is?', o: ['3', '2', '1', '0'], c: 0},
  {q: 'Period of $\\sin(2x)$ is?', o: ['$\\pi$', '$2\\pi$', '$\\pi/2$', '$\\pi/4$'], c: 0},
  {q: 'Integration of $1/x$ is?', o: ['$\\ln|x|$', '$x^2/2$', '$-1/x^2$', '$e^x$'], c: 0},
  {q: 'Value of $\\cos 20^\\circ \\cos 40^\\circ \\cos 80^\\circ$?', o: ['1/8', '1/4', '1/2', '1'], c: 0},
]);

const fileContent = `export interface ArenaQuestion {
  id: string;
  class_level: string;
  subject: string;
  question_latex: string;
  options: string[];
  correct_option: number;
  solution_latex: string;
}

export const MASTER_QUESTIONS: ArenaQuestion[] = ${JSON.stringify(MASTER_QUESTIONS, null, 2)};
`;

fs.mkdirSync('src/data', { recursive: true });
fs.writeFileSync('src/data/mockQuestionsPool.ts', fileContent);
console.log('Created src/data/mockQuestionsPool.ts');
