export interface ArenaQuestion {
  id: string;
  class_level: string;
  subject: string;
  question_latex: string;
  options: string[];
  correct_option: number;
  solution_latex: string;
}

export const MASTER_QUESTIONS: ArenaQuestion[] = [
  {
    "id": "mock-Class10-Mathematics-1",
    "class_level": "Class 10",
    "subject": "Mathematics",
    "question_latex": "If the roots of the quadratic equation $x^2 + px + q = 0$ are $\\tan 30^\\circ$ and $\\tan 15^\\circ$, find $q - p$.",
    "options": [
      "1",
      "2",
      "3",
      "0"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class10-Mathematics-2",
    "class_level": "Class 10",
    "subject": "Mathematics",
    "question_latex": "A tangent to a circle of radius $5\\text{ cm}$ from a point $P$ is $12\\text{ cm}$. The distance of $P$ from the center is?",
    "options": [
      "13 cm",
      "10 cm",
      "14 cm",
      "15 cm"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class10-Mathematics-3",
    "class_level": "Class 10",
    "subject": "Mathematics",
    "question_latex": "The $n$-th term of an AP is $3n + 5$. Its common difference is?",
    "options": [
      "3",
      "5",
      "8",
      "2"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class10-Mathematics-4",
    "class_level": "Class 10",
    "subject": "Mathematics",
    "question_latex": "Find the probability of getting a prime number on a single roll of a die.",
    "options": [
      "1/2",
      "1/3",
      "1/6",
      "2/3"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class10-Mathematics-5",
    "class_level": "Class 10",
    "subject": "Mathematics",
    "question_latex": "The HCF of 96 and 404 is?",
    "options": [
      "4",
      "2",
      "6",
      "8"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class10-Mathematics-6",
    "class_level": "Class 10",
    "subject": "Mathematics",
    "question_latex": "If $\\sin A = \\frac{3}{4}$, calculate $\\cos A$.",
    "options": [
      "$\\frac{\\sqrt{7}}{4}$",
      "$\\frac{1}{4}$",
      "$\\frac{3}{5}$",
      "$\\frac{4}{5}$"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class10-Mathematics-7",
    "class_level": "Class 10",
    "subject": "Mathematics",
    "question_latex": "Distance between $(2, 3)$ and $(4, 1)$ is?",
    "options": [
      "$2\\sqrt{2}$",
      "$3\\sqrt{2}$",
      "$4$",
      "$2$"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class10-Mathematics-8",
    "class_level": "Class 10",
    "subject": "Mathematics",
    "question_latex": "Mean of first 5 natural numbers is?",
    "options": [
      "3",
      "4",
      "2",
      "5"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class10-Mathematics-9",
    "class_level": "Class 10",
    "subject": "Mathematics",
    "question_latex": "If the perimeter and the area of a circle are numerically equal, the radius is?",
    "options": [
      "2 units",
      "$\\pi$ units",
      "4 units",
      "7 units"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class10-Mathematics-10",
    "class_level": "Class 10",
    "subject": "Mathematics",
    "question_latex": "Evaluate $\\sec^2 60^\\circ - 1$.",
    "options": [
      "3",
      "4",
      "2",
      "0"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class10-Science-11",
    "class_level": "Class 10",
    "subject": "Science",
    "question_latex": "Which of the following is a balanced equation?",
    "options": [
      "$H_2 + O_2 \\to H_2O$",
      "$2H_2 + O_2 \\to 2H_2O$",
      "$H_2 + O_2 \\to 2H_2O$",
      "$H_2 + 2O_2 \\to H_2O$"
    ],
    "correct_option": 1,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class10-Science-12",
    "class_level": "Class 10",
    "subject": "Science",
    "question_latex": "The pH of gastric juice is approx?",
    "options": [
      "1.2",
      "7.4",
      "10",
      "14"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class10-Science-13",
    "class_level": "Class 10",
    "subject": "Science",
    "question_latex": "What is the SI unit of electric power?",
    "options": [
      "Watt",
      "Joule",
      "Ampere",
      "Volt"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class10-Science-14",
    "class_level": "Class 10",
    "subject": "Science",
    "question_latex": "Refractive index of water is?",
    "options": [
      "1.33",
      "1.5",
      "2.42",
      "1.0"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class10-Science-15",
    "class_level": "Class 10",
    "subject": "Science",
    "question_latex": "Ozone layer protects us from?",
    "options": [
      "UV Rays",
      "Infrared",
      "Microwaves",
      "X-rays"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class10-Science-16",
    "class_level": "Class 10",
    "subject": "Science",
    "question_latex": "Which hormone regulates blood sugar?",
    "options": [
      "Insulin",
      "Adrenaline",
      "Thyroxine",
      "Estrogen"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class10-Science-17",
    "class_level": "Class 10",
    "subject": "Science",
    "question_latex": "Power of a convex lens of focal length 2m is?",
    "options": [
      "+0.5 D",
      "-0.5 D",
      "+2 D",
      "-2 D"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class10-Science-18",
    "class_level": "Class 10",
    "subject": "Science",
    "question_latex": "An alloy of Copper and Zinc is?",
    "options": [
      "Brass",
      "Bronze",
      "Solder",
      "Steel"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class10-Science-19",
    "class_level": "Class 10",
    "subject": "Science",
    "question_latex": "Autotrophic nutrition requires?",
    "options": [
      "CO2 and Water",
      "Chlorophyll",
      "Sunlight",
      "All of the above"
    ],
    "correct_option": 3,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class10-Science-20",
    "class_level": "Class 10",
    "subject": "Science",
    "question_latex": "Where does fertilization occur in humans?",
    "options": [
      "Fallopian Tube",
      "Uterus",
      "Ovary",
      "Vagina"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class11-Physics-21",
    "class_level": "Class 11",
    "subject": "Physics",
    "question_latex": "A car accelerates from rest at $2\\text{ m/s}^2$ for 10s. Distance covered?",
    "options": [
      "100m",
      "200m",
      "50m",
      "150m"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class11-Physics-22",
    "class_level": "Class 11",
    "subject": "Physics",
    "question_latex": "Work done by a conservative force in a closed loop is?",
    "options": [
      "Zero",
      "Positive",
      "Negative",
      "Infinite"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class11-Physics-23",
    "class_level": "Class 11",
    "subject": "Physics",
    "question_latex": "Moment of inertia of a solid sphere of mass $M$ and radius $R$ is?",
    "options": [
      "$\\frac{2}{5}MR^2$",
      "$\\frac{2}{3}MR^2$",
      "$\\frac{1}{2}MR^2$",
      "$MR^2$"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class11-Physics-24",
    "class_level": "Class 11",
    "subject": "Physics",
    "question_latex": "Escape velocity from Earth is approx?",
    "options": [
      "11.2 km/s",
      "8 km/s",
      "3 \\times 10^8 m/s",
      "9.8 m/s"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class11-Physics-25",
    "class_level": "Class 11",
    "subject": "Physics",
    "question_latex": "Bernoulli’s theorem is a consequence of conservation of?",
    "options": [
      "Energy",
      "Mass",
      "Momentum",
      "Angular Momentum"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class11-Physics-26",
    "class_level": "Class 11",
    "subject": "Physics",
    "question_latex": "First law of thermodynamics implies conservation of?",
    "options": [
      "Energy",
      "Heat",
      "Temperature",
      "Entropy"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class11-Physics-27",
    "class_level": "Class 11",
    "subject": "Physics",
    "question_latex": "Root mean square velocity of gas molecules is proportional to?",
    "options": [
      "$\\sqrt{T}$",
      "$T$",
      "$T^2$",
      "$1/T$"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class11-Physics-28",
    "class_level": "Class 11",
    "subject": "Physics",
    "question_latex": "A simple pendulum's time period is?",
    "options": [
      "$2\\pi\\sqrt{L/g}$",
      "$2\\pi\\sqrt{g/L}$",
      "$\\sqrt{L/g}$",
      "$2\\pi L/g$"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class11-Physics-29",
    "class_level": "Class 11",
    "subject": "Physics",
    "question_latex": "Young's modulus applies to?",
    "options": [
      "Solids",
      "Liquids",
      "Gases",
      "Fluids"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class11-Physics-30",
    "class_level": "Class 11",
    "subject": "Physics",
    "question_latex": "Angular momentum is constant if?",
    "options": [
      "Net torque is zero",
      "Net force is zero",
      "Velocity is zero",
      "Mass is constant"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class11-Chemistry-31",
    "class_level": "Class 11",
    "subject": "Chemistry",
    "question_latex": "Number of moles in 18g of water?",
    "options": [
      "1",
      "2",
      "0.5",
      "18"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class11-Chemistry-32",
    "class_level": "Class 11",
    "subject": "Chemistry",
    "question_latex": "Principal quantum number $n=3$ has how many orbitals?",
    "options": [
      "9",
      "3",
      "6",
      "18"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class11-Chemistry-33",
    "class_level": "Class 11",
    "subject": "Chemistry",
    "question_latex": "Shape of $NH_3$ molecule is?",
    "options": [
      "Pyramidal",
      "Tetrahedral",
      "Trigonal planar",
      "Linear"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class11-Chemistry-34",
    "class_level": "Class 11",
    "subject": "Chemistry",
    "question_latex": "Which is the most electronegative element?",
    "options": [
      "Fluorine",
      "Oxygen",
      "Chlorine",
      "Nitrogen"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class11-Chemistry-35",
    "class_level": "Class 11",
    "subject": "Chemistry",
    "question_latex": "Oxidation state of Mn in $KMnO_4$?",
    "options": [
      "+7",
      "+6",
      "+5",
      "+4"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class11-Chemistry-36",
    "class_level": "Class 11",
    "subject": "Chemistry",
    "question_latex": "Boyle’s law relates?",
    "options": [
      "P and V at constant T",
      "V and T at constant P",
      "P and T at constant V",
      "P, V, T"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class11-Chemistry-37",
    "class_level": "Class 11",
    "subject": "Chemistry",
    "question_latex": "Enthalpy of an exothermic reaction is?",
    "options": [
      "Negative",
      "Positive",
      "Zero",
      "Infinite"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class11-Chemistry-38",
    "class_level": "Class 11",
    "subject": "Chemistry",
    "question_latex": "Conjugate base of $H_2O$ is?",
    "options": [
      "$OH^-$",
      "$H_3O^+$",
      "$H^+$",
      "$O^{2-}$"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class11-Chemistry-39",
    "class_level": "Class 11",
    "subject": "Chemistry",
    "question_latex": "Hybridization of Carbon in Benzene?",
    "options": [
      "$sp^2$",
      "$sp^3$",
      "$sp$",
      "$dsp^2$"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class11-Chemistry-40",
    "class_level": "Class 11",
    "subject": "Chemistry",
    "question_latex": "Which series of hydrogen spectrum falls in visible region?",
    "options": [
      "Balmer",
      "Lyman",
      "Paschen",
      "Brackett"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class12-Physics-41",
    "class_level": "Class 12",
    "subject": "Physics",
    "question_latex": "Electric field inside a hollow spherical conductor is?",
    "options": [
      "Zero",
      "Constant",
      "Infinite",
      "Varies with $r$"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class12-Physics-42",
    "class_level": "Class 12",
    "subject": "Physics",
    "question_latex": "Capacitance of a parallel plate capacitor?",
    "options": [
      "$\\frac{\\epsilon_0 A}{d}$",
      "$\\frac{d}{\\epsilon_0 A}$",
      "$\\frac{\\epsilon_0 d}{A}$",
      "$A d \\epsilon_0$"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class12-Physics-43",
    "class_level": "Class 12",
    "subject": "Physics",
    "question_latex": "Kirchhoff’s junction rule is based on conservation of?",
    "options": [
      "Charge",
      "Energy",
      "Mass",
      "Momentum"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class12-Physics-44",
    "class_level": "Class 12",
    "subject": "Physics",
    "question_latex": "Magnetic field at the center of a circular coil?",
    "options": [
      "$\\frac{\\mu_0 I}{2R}$",
      "$\\frac{\\mu_0 I}{4\\pi R}$",
      "$\\frac{\\mu_0 I}{2\\pi R}$",
      "Zero"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class12-Physics-45",
    "class_level": "Class 12",
    "subject": "Physics",
    "question_latex": "Lenz’s law gives the direction of?",
    "options": [
      "Induced EMF",
      "Magnetic Field",
      "Electric Field",
      "Current"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class12-Physics-46",
    "class_level": "Class 12",
    "subject": "Physics",
    "question_latex": "Impedance of an LCR circuit at resonance is?",
    "options": [
      "$R$",
      "$\\sqrt{R^2 + X_L^2}$",
      "$X_L - X_C$",
      "Zero"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class12-Physics-47",
    "class_level": "Class 12",
    "subject": "Physics",
    "question_latex": "Velocity of electromagnetic wave in vacuum?",
    "options": [
      "$\\frac{1}{\\sqrt{\\mu_0 \\epsilon_0}}$",
      "$\\sqrt{\\mu_0 \\epsilon_0}$",
      "$\\mu_0 \\epsilon_0$",
      "$\\frac{\\mu_0}{\\epsilon_0}$"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class12-Physics-48",
    "class_level": "Class 12",
    "subject": "Physics",
    "question_latex": "Snell’s law is?",
    "options": [
      "$\\frac{\\sin i}{\\sin r} = \\mu$",
      "$i = r$",
      "$\\sin i \\cdot \\sin r = \\mu$",
      "$\\mu_1 \\sin r = \\mu_2 \\sin i$"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class12-Physics-49",
    "class_level": "Class 12",
    "subject": "Physics",
    "question_latex": "Energy of a photon is?",
    "options": [
      "$h\\nu$",
      "$hc/\\lambda^2$",
      "$h/\\lambda$",
      "$\\lambda/h$"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class12-Physics-50",
    "class_level": "Class 12",
    "subject": "Physics",
    "question_latex": "Majority charge carriers in N-type semiconductor?",
    "options": [
      "Electrons",
      "Holes",
      "Protons",
      "Neutrons"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class12-Chemistry-51",
    "class_level": "Class 12",
    "subject": "Chemistry",
    "question_latex": "Unit of first order reaction rate constant?",
    "options": [
      "$s^{-1}$",
      "$mol L^{-1} s^{-1}$",
      "$L mol^{-1} s^{-1}$",
      "dimensionless"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class12-Chemistry-52",
    "class_level": "Class 12",
    "subject": "Chemistry",
    "question_latex": "Which defect lowers the density of a crystal?",
    "options": [
      "Schottky",
      "Frenkel",
      "Interstitial",
      "F-center"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class12-Chemistry-53",
    "class_level": "Class 12",
    "subject": "Chemistry",
    "question_latex": "Molarity of pure water?",
    "options": [
      "55.5 M",
      "18 M",
      "1 M",
      "100 M"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class12-Chemistry-54",
    "class_level": "Class 12",
    "subject": "Chemistry",
    "question_latex": "Nernst equation is used to calculate?",
    "options": [
      "Cell Potential",
      "Rate constant",
      "Equilibrium constant",
      "Activation energy"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class12-Chemistry-55",
    "class_level": "Class 12",
    "subject": "Chemistry",
    "question_latex": "Catalyst used in Contact Process?",
    "options": [
      "$V_2O_5$",
      "$Fe$",
      "$Ni$",
      "$Pt$"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class12-Chemistry-56",
    "class_level": "Class 12",
    "subject": "Chemistry",
    "question_latex": "Which ligand is bidentate?",
    "options": [
      "Oxalate",
      "Cyanide",
      "Ammonia",
      "Water"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class12-Chemistry-57",
    "class_level": "Class 12",
    "subject": "Chemistry",
    "question_latex": "Lucas reagent is?",
    "options": [
      "Anh. $ZnCl_2$ + conc. $HCl$",
      "$Br_2$ water",
      "$AgNO_3$ in $NH_3$",
      "Alkaline $KMnO_4$"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class12-Chemistry-58",
    "class_level": "Class 12",
    "subject": "Chemistry",
    "question_latex": "Iodoform test is given by?",
    "options": [
      "Ethanol",
      "Methanol",
      "Formaldehyde",
      "Acetic acid"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class12-Chemistry-59",
    "class_level": "Class 12",
    "subject": "Chemistry",
    "question_latex": "Vitamin C is also known as?",
    "options": [
      "Ascorbic acid",
      "Retinol",
      "Calciferol",
      "Tocopherol"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class12-Chemistry-60",
    "class_level": "Class 12",
    "subject": "Chemistry",
    "question_latex": "Polymer of Teflon is?",
    "options": [
      "Tetrafluoroethene",
      "Ethene",
      "Vinyl chloride",
      "Styrene"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-NEET-Biology-61",
    "class_level": "NEET",
    "subject": "Biology",
    "question_latex": "Which is the largest gland in the human body?",
    "options": [
      "Liver",
      "Pancreas",
      "Thyroid",
      "Adrenal"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-NEET-Biology-62",
    "class_level": "NEET",
    "subject": "Biology",
    "question_latex": "Site of protein synthesis in a cell?",
    "options": [
      "Ribosomes",
      "Lysosomes",
      "Mitochondria",
      "Golgi apparatus"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-NEET-Biology-63",
    "class_level": "NEET",
    "subject": "Biology",
    "question_latex": "Pacemaker of the heart is?",
    "options": [
      "SA Node",
      "AV Node",
      "Purkinje fibers",
      "Bundle of His"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-NEET-Biology-64",
    "class_level": "NEET",
    "subject": "Biology",
    "question_latex": "Which hormone induces sleep?",
    "options": [
      "Melatonin",
      "Serotonin",
      "Dopamine",
      "Thyroxine"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-NEET-Biology-65",
    "class_level": "NEET",
    "subject": "Biology",
    "question_latex": "Male gametophyte of angiosperms is?",
    "options": [
      "Pollen grain",
      "Anther",
      "Microspore",
      "Stamen"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-NEET-Biology-66",
    "class_level": "NEET",
    "subject": "Biology",
    "question_latex": "Basic unit of classification is?",
    "options": [
      "Species",
      "Genus",
      "Family",
      "Order"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-NEET-Biology-67",
    "class_level": "NEET",
    "subject": "Biology",
    "question_latex": "Cranial nerves in humans?",
    "options": [
      "12 pairs",
      "10 pairs",
      "14 pairs",
      "8 pairs"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-NEET-Biology-68",
    "class_level": "NEET",
    "subject": "Biology",
    "question_latex": "DNA replication is?",
    "options": [
      "Semi-conservative",
      "Conservative",
      "Dispersive",
      "Non-conservative"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-NEET-Biology-69",
    "class_level": "NEET",
    "subject": "Biology",
    "question_latex": "Theory of Natural Selection was proposed by?",
    "options": [
      "Darwin",
      "Lamarck",
      "Mendel",
      "Pasteur"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-NEET-Biology-70",
    "class_level": "NEET",
    "subject": "Biology",
    "question_latex": "Kranz anatomy is found in?",
    "options": [
      "C4 plants",
      "C3 plants",
      "CAM plants",
      "Gymnosperms"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-NEET-Biology-71",
    "class_level": "NEET",
    "subject": "Biology",
    "question_latex": "Which blood group is universal acceptor?",
    "options": [
      "AB",
      "O",
      "A",
      "B"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-NEET-Biology-72",
    "class_level": "NEET",
    "subject": "Biology",
    "question_latex": "Hormone responsible for ovulation?",
    "options": [
      "LH",
      "FSH",
      "Estrogen",
      "Progesterone"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-NEET-Biology-73",
    "class_level": "NEET",
    "subject": "Biology",
    "question_latex": "Longest bone in human body?",
    "options": [
      "Femur",
      "Tibia",
      "Humerus",
      "Radius"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-NEET-Biology-74",
    "class_level": "NEET",
    "subject": "Biology",
    "question_latex": "Phloem transports?",
    "options": [
      "Food",
      "Water",
      "Minerals",
      "Air"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-NEET-Biology-75",
    "class_level": "NEET",
    "subject": "Biology",
    "question_latex": "Which organelle is semi-autonomous?",
    "options": [
      "Mitochondria",
      "Lysosome",
      "ER",
      "Vacuole"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-NEET-Biology-76",
    "class_level": "NEET",
    "subject": "Biology",
    "question_latex": "Double fertilization is characteristic of?",
    "options": [
      "Angiosperms",
      "Gymnosperms",
      "Pteridophytes",
      "Bryophytes"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-NEET-Biology-77",
    "class_level": "NEET",
    "subject": "Biology",
    "question_latex": "Which vector causes malaria?",
    "options": [
      "Female Anopheles",
      "Culex",
      "Aedes",
      "Housefly"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-NEET-Biology-78",
    "class_level": "NEET",
    "subject": "Biology",
    "question_latex": "Antibodies are secreted by?",
    "options": [
      "B-lymphocytes",
      "T-lymphocytes",
      "Macrophages",
      "Erythrocytes"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-NEET-Biology-79",
    "class_level": "NEET",
    "subject": "Biology",
    "question_latex": "What is the end product of glycolysis?",
    "options": [
      "Pyruvic acid",
      "Lactic acid",
      "Citric acid",
      "Acetyl CoA"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-NEET-Biology-80",
    "class_level": "NEET",
    "subject": "Biology",
    "question_latex": "Total ATP produced in aerobic respiration?",
    "options": [
      "38",
      "2",
      "36",
      "40"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-JEEMain-Mathematics-81",
    "class_level": "JEE Main",
    "subject": "Mathematics",
    "question_latex": "If $f(x) = x^3 + x$, then $f^{-1}(2)$ is?",
    "options": [
      "1",
      "0",
      "-1",
      "2"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-JEEMain-Mathematics-82",
    "class_level": "JEE Main",
    "subject": "Mathematics",
    "question_latex": "Limit $x \\to 0$ of $\\frac{\\sin x}{x}$ is?",
    "options": [
      "1",
      "0",
      "$\\infty$",
      "Does not exist"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-JEEMain-Mathematics-83",
    "class_level": "JEE Main",
    "subject": "Mathematics",
    "question_latex": "Value of $\\int_{0}^{\\pi/2} \\log(\\tan x) dx$ is?",
    "options": [
      "0",
      "$\\pi/2$",
      "$\\pi/4$",
      "$1$"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-JEEMain-Mathematics-84",
    "class_level": "JEE Main",
    "subject": "Mathematics",
    "question_latex": "The maximum value of $3\\cos x + 4\\sin x$ is?",
    "options": [
      "5",
      "7",
      "1",
      "12"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-JEEMain-Mathematics-85",
    "class_level": "JEE Main",
    "subject": "Mathematics",
    "question_latex": "Number of ways to arrange the letters of \"APPLE\"?",
    "options": [
      "60",
      "120",
      "30",
      "20"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-JEEMain-Mathematics-86",
    "class_level": "JEE Main",
    "subject": "Mathematics",
    "question_latex": "Area of triangle formed by $(0,0), (a,0), (0,b)$ is?",
    "options": [
      "$\\frac{1}{2}ab$",
      "$ab$",
      "$\\sqrt{a^2+b^2}$",
      "$\\frac{a+b}{2}$"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-JEEMain-Mathematics-87",
    "class_level": "JEE Main",
    "subject": "Mathematics",
    "question_latex": "Derivative of $e^{\\sin x}$ is?",
    "options": [
      "$e^{\\sin x}\\cos x$",
      "$e^{\\cos x}$",
      "$e^{\\sin x}$",
      "$\\cos x e^{\\cos x}$"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-JEEMain-Mathematics-88",
    "class_level": "JEE Main",
    "subject": "Mathematics",
    "question_latex": "Probability of a leap year having 53 Sundays is?",
    "options": [
      "2/7",
      "1/7",
      "53/366",
      "3/7"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-JEEMain-Mathematics-89",
    "class_level": "JEE Main",
    "subject": "Mathematics",
    "question_latex": "Distance from origin to plane $2x - y + 2z = 6$ is?",
    "options": [
      "2",
      "6",
      "3",
      "1"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-JEEMain-Mathematics-90",
    "class_level": "JEE Main",
    "subject": "Mathematics",
    "question_latex": "If $A$ and $B$ are symmetric matrices, $AB - BA$ is?",
    "options": [
      "Skew-symmetric",
      "Symmetric",
      "Null matrix",
      "Identity"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-JEEMain-Mathematics-91",
    "class_level": "JEE Main",
    "subject": "Mathematics",
    "question_latex": "Equation of tangent to $y=x^2$ at $(1,1)$ is?",
    "options": [
      "$y=2x-1$",
      "$y=x$",
      "$y=2x+1$",
      "$y=x-1$"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-JEEMain-Mathematics-92",
    "class_level": "JEE Main",
    "subject": "Mathematics",
    "question_latex": "Sum of the infinite GP $1, 1/2, 1/4...$ is?",
    "options": [
      "2",
      "1",
      "$\\infty$",
      "1.5"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-JEEMain-Mathematics-93",
    "class_level": "JEE Main",
    "subject": "Mathematics",
    "question_latex": "Root of $e^x - x = 0$? (real roots)",
    "options": [
      "0",
      "1",
      "None",
      "e"
    ],
    "correct_option": 2,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-JEEMain-Mathematics-94",
    "class_level": "JEE Main",
    "subject": "Mathematics",
    "question_latex": "Value of $i^4 + i^5 + i^6 + i^7$ is?",
    "options": [
      "0",
      "1",
      "-1",
      "i"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-JEEMain-Mathematics-95",
    "class_level": "JEE Main",
    "subject": "Mathematics",
    "question_latex": "Locus of $z$ such that $|z - 1| = |z + 1|$ is?",
    "options": [
      "y-axis",
      "x-axis",
      "circle",
      "parabola"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-JEEMain-Mathematics-96",
    "class_level": "JEE Main",
    "subject": "Mathematics",
    "question_latex": "The sum of roots of $x^3 - 6x^2 + 11x - 6 = 0$ is?",
    "options": [
      "6",
      "11",
      "6",
      "1"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-JEEMain-Mathematics-97",
    "class_level": "JEE Main",
    "subject": "Mathematics",
    "question_latex": "Rank of a $3 \\times 3$ non-singular matrix is?",
    "options": [
      "3",
      "2",
      "1",
      "0"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-JEEMain-Mathematics-98",
    "class_level": "JEE Main",
    "subject": "Mathematics",
    "question_latex": "Period of $\\sin(2x)$ is?",
    "options": [
      "$\\pi$",
      "$2\\pi$",
      "$\\pi/2$",
      "$\\pi/4$"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-JEEMain-Mathematics-99",
    "class_level": "JEE Main",
    "subject": "Mathematics",
    "question_latex": "Integration of $1/x$ is?",
    "options": [
      "$\\ln|x|$",
      "$x^2/2$",
      "$-1/x^2$",
      "$e^x$"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-JEEMain-Mathematics-100",
    "class_level": "JEE Main",
    "subject": "Mathematics",
    "question_latex": "Value of $\\cos 20^\\circ \\cos 40^\\circ \\cos 80^\\circ$?",
    "options": [
      "1/8",
      "1/4",
      "1/2",
      "1"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class10-Mathematics-1_v2",
    "class_level": "Class 10",
    "subject": "Mathematics",
    "question_latex": "If the roots of the quadratic equation $x^2 + px + q = 0$ are $\\tan 30^\\circ$ and $\\tan 15^\\circ$, find $q - p$.",
    "options": [
      "1",
      "2",
      "3",
      "0"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class10-Mathematics-2_v2",
    "class_level": "Class 10",
    "subject": "Mathematics",
    "question_latex": "A tangent to a circle of radius $5\\text{ cm}$ from a point $P$ is $12\\text{ cm}$. The distance of $P$ from the center is?",
    "options": [
      "13 cm",
      "10 cm",
      "14 cm",
      "15 cm"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class10-Mathematics-3_v2",
    "class_level": "Class 10",
    "subject": "Mathematics",
    "question_latex": "The $n$-th term of an AP is $3n + 5$. Its common difference is?",
    "options": [
      "3",
      "5",
      "8",
      "2"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class10-Mathematics-4_v2",
    "class_level": "Class 10",
    "subject": "Mathematics",
    "question_latex": "Find the probability of getting a prime number on a single roll of a die.",
    "options": [
      "1/2",
      "1/3",
      "1/6",
      "2/3"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class10-Mathematics-5_v2",
    "class_level": "Class 10",
    "subject": "Mathematics",
    "question_latex": "The HCF of 96 and 404 is?",
    "options": [
      "4",
      "2",
      "6",
      "8"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class10-Mathematics-6_v2",
    "class_level": "Class 10",
    "subject": "Mathematics",
    "question_latex": "If $\\sin A = \\frac{3}{4}$, calculate $\\cos A$.",
    "options": [
      "$\\frac{\\sqrt{7}}{4}$",
      "$\\frac{1}{4}$",
      "$\\frac{3}{5}$",
      "$\\frac{4}{5}$"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class10-Mathematics-7_v2",
    "class_level": "Class 10",
    "subject": "Mathematics",
    "question_latex": "Distance between $(2, 3)$ and $(4, 1)$ is?",
    "options": [
      "$2\\sqrt{2}$",
      "$3\\sqrt{2}$",
      "$4$",
      "$2$"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class10-Mathematics-8_v2",
    "class_level": "Class 10",
    "subject": "Mathematics",
    "question_latex": "Mean of first 5 natural numbers is?",
    "options": [
      "3",
      "4",
      "2",
      "5"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class10-Mathematics-9_v2",
    "class_level": "Class 10",
    "subject": "Mathematics",
    "question_latex": "If the perimeter and the area of a circle are numerically equal, the radius is?",
    "options": [
      "2 units",
      "$\\pi$ units",
      "4 units",
      "7 units"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class10-Mathematics-10_v2",
    "class_level": "Class 10",
    "subject": "Mathematics",
    "question_latex": "Evaluate $\\sec^2 60^\\circ - 1$.",
    "options": [
      "3",
      "4",
      "2",
      "0"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class10-Science-11_v2",
    "class_level": "Class 10",
    "subject": "Science",
    "question_latex": "Which of the following is a balanced equation?",
    "options": [
      "$H_2 + O_2 \\to H_2O$",
      "$2H_2 + O_2 \\to 2H_2O$",
      "$H_2 + O_2 \\to 2H_2O$",
      "$H_2 + 2O_2 \\to H_2O$"
    ],
    "correct_option": 1,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class10-Science-12_v2",
    "class_level": "Class 10",
    "subject": "Science",
    "question_latex": "The pH of gastric juice is approx?",
    "options": [
      "1.2",
      "7.4",
      "10",
      "14"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class10-Science-13_v2",
    "class_level": "Class 10",
    "subject": "Science",
    "question_latex": "What is the SI unit of electric power?",
    "options": [
      "Watt",
      "Joule",
      "Ampere",
      "Volt"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class10-Science-14_v2",
    "class_level": "Class 10",
    "subject": "Science",
    "question_latex": "Refractive index of water is?",
    "options": [
      "1.33",
      "1.5",
      "2.42",
      "1.0"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class10-Science-15_v2",
    "class_level": "Class 10",
    "subject": "Science",
    "question_latex": "Ozone layer protects us from?",
    "options": [
      "UV Rays",
      "Infrared",
      "Microwaves",
      "X-rays"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class10-Science-16_v2",
    "class_level": "Class 10",
    "subject": "Science",
    "question_latex": "Which hormone regulates blood sugar?",
    "options": [
      "Insulin",
      "Adrenaline",
      "Thyroxine",
      "Estrogen"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class10-Science-17_v2",
    "class_level": "Class 10",
    "subject": "Science",
    "question_latex": "Power of a convex lens of focal length 2m is?",
    "options": [
      "+0.5 D",
      "-0.5 D",
      "+2 D",
      "-2 D"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class10-Science-18_v2",
    "class_level": "Class 10",
    "subject": "Science",
    "question_latex": "An alloy of Copper and Zinc is?",
    "options": [
      "Brass",
      "Bronze",
      "Solder",
      "Steel"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class10-Science-19_v2",
    "class_level": "Class 10",
    "subject": "Science",
    "question_latex": "Autotrophic nutrition requires?",
    "options": [
      "CO2 and Water",
      "Chlorophyll",
      "Sunlight",
      "All of the above"
    ],
    "correct_option": 3,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class10-Science-20_v2",
    "class_level": "Class 10",
    "subject": "Science",
    "question_latex": "Where does fertilization occur in humans?",
    "options": [
      "Fallopian Tube",
      "Uterus",
      "Ovary",
      "Vagina"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class11-Physics-21_v2",
    "class_level": "Class 11",
    "subject": "Physics",
    "question_latex": "A car accelerates from rest at $2\\text{ m/s}^2$ for 10s. Distance covered?",
    "options": [
      "100m",
      "200m",
      "50m",
      "150m"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class11-Physics-22_v2",
    "class_level": "Class 11",
    "subject": "Physics",
    "question_latex": "Work done by a conservative force in a closed loop is?",
    "options": [
      "Zero",
      "Positive",
      "Negative",
      "Infinite"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class11-Physics-23_v2",
    "class_level": "Class 11",
    "subject": "Physics",
    "question_latex": "Moment of inertia of a solid sphere of mass $M$ and radius $R$ is?",
    "options": [
      "$\\frac{2}{5}MR^2$",
      "$\\frac{2}{3}MR^2$",
      "$\\frac{1}{2}MR^2$",
      "$MR^2$"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class11-Physics-24_v2",
    "class_level": "Class 11",
    "subject": "Physics",
    "question_latex": "Escape velocity from Earth is approx?",
    "options": [
      "11.2 km/s",
      "8 km/s",
      "3 \\times 10^8 m/s",
      "9.8 m/s"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class11-Physics-25_v2",
    "class_level": "Class 11",
    "subject": "Physics",
    "question_latex": "Bernoulli’s theorem is a consequence of conservation of?",
    "options": [
      "Energy",
      "Mass",
      "Momentum",
      "Angular Momentum"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class11-Physics-26_v2",
    "class_level": "Class 11",
    "subject": "Physics",
    "question_latex": "First law of thermodynamics implies conservation of?",
    "options": [
      "Energy",
      "Heat",
      "Temperature",
      "Entropy"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class11-Physics-27_v2",
    "class_level": "Class 11",
    "subject": "Physics",
    "question_latex": "Root mean square velocity of gas molecules is proportional to?",
    "options": [
      "$\\sqrt{T}$",
      "$T$",
      "$T^2$",
      "$1/T$"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class11-Physics-28_v2",
    "class_level": "Class 11",
    "subject": "Physics",
    "question_latex": "A simple pendulum's time period is?",
    "options": [
      "$2\\pi\\sqrt{L/g}$",
      "$2\\pi\\sqrt{g/L}$",
      "$\\sqrt{L/g}$",
      "$2\\pi L/g$"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class11-Physics-29_v2",
    "class_level": "Class 11",
    "subject": "Physics",
    "question_latex": "Young's modulus applies to?",
    "options": [
      "Solids",
      "Liquids",
      "Gases",
      "Fluids"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class11-Physics-30_v2",
    "class_level": "Class 11",
    "subject": "Physics",
    "question_latex": "Angular momentum is constant if?",
    "options": [
      "Net torque is zero",
      "Net force is zero",
      "Velocity is zero",
      "Mass is constant"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class11-Chemistry-31_v2",
    "class_level": "Class 11",
    "subject": "Chemistry",
    "question_latex": "Number of moles in 18g of water?",
    "options": [
      "1",
      "2",
      "0.5",
      "18"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class11-Chemistry-32_v2",
    "class_level": "Class 11",
    "subject": "Chemistry",
    "question_latex": "Principal quantum number $n=3$ has how many orbitals?",
    "options": [
      "9",
      "3",
      "6",
      "18"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class11-Chemistry-33_v2",
    "class_level": "Class 11",
    "subject": "Chemistry",
    "question_latex": "Shape of $NH_3$ molecule is?",
    "options": [
      "Pyramidal",
      "Tetrahedral",
      "Trigonal planar",
      "Linear"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class11-Chemistry-34_v2",
    "class_level": "Class 11",
    "subject": "Chemistry",
    "question_latex": "Which is the most electronegative element?",
    "options": [
      "Fluorine",
      "Oxygen",
      "Chlorine",
      "Nitrogen"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class11-Chemistry-35_v2",
    "class_level": "Class 11",
    "subject": "Chemistry",
    "question_latex": "Oxidation state of Mn in $KMnO_4$?",
    "options": [
      "+7",
      "+6",
      "+5",
      "+4"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class11-Chemistry-36_v2",
    "class_level": "Class 11",
    "subject": "Chemistry",
    "question_latex": "Boyle’s law relates?",
    "options": [
      "P and V at constant T",
      "V and T at constant P",
      "P and T at constant V",
      "P, V, T"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class11-Chemistry-37_v2",
    "class_level": "Class 11",
    "subject": "Chemistry",
    "question_latex": "Enthalpy of an exothermic reaction is?",
    "options": [
      "Negative",
      "Positive",
      "Zero",
      "Infinite"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class11-Chemistry-38_v2",
    "class_level": "Class 11",
    "subject": "Chemistry",
    "question_latex": "Conjugate base of $H_2O$ is?",
    "options": [
      "$OH^-$",
      "$H_3O^+$",
      "$H^+$",
      "$O^{2-}$"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class11-Chemistry-39_v2",
    "class_level": "Class 11",
    "subject": "Chemistry",
    "question_latex": "Hybridization of Carbon in Benzene?",
    "options": [
      "$sp^2$",
      "$sp^3$",
      "$sp$",
      "$dsp^2$"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class11-Chemistry-40_v2",
    "class_level": "Class 11",
    "subject": "Chemistry",
    "question_latex": "Which series of hydrogen spectrum falls in visible region?",
    "options": [
      "Balmer",
      "Lyman",
      "Paschen",
      "Brackett"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class12-Physics-41_v2",
    "class_level": "Class 12",
    "subject": "Physics",
    "question_latex": "Electric field inside a hollow spherical conductor is?",
    "options": [
      "Zero",
      "Constant",
      "Infinite",
      "Varies with $r$"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class12-Physics-42_v2",
    "class_level": "Class 12",
    "subject": "Physics",
    "question_latex": "Capacitance of a parallel plate capacitor?",
    "options": [
      "$\\frac{\\epsilon_0 A}{d}$",
      "$\\frac{d}{\\epsilon_0 A}$",
      "$\\frac{\\epsilon_0 d}{A}$",
      "$A d \\epsilon_0$"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class12-Physics-43_v2",
    "class_level": "Class 12",
    "subject": "Physics",
    "question_latex": "Kirchhoff’s junction rule is based on conservation of?",
    "options": [
      "Charge",
      "Energy",
      "Mass",
      "Momentum"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class12-Physics-44_v2",
    "class_level": "Class 12",
    "subject": "Physics",
    "question_latex": "Magnetic field at the center of a circular coil?",
    "options": [
      "$\\frac{\\mu_0 I}{2R}$",
      "$\\frac{\\mu_0 I}{4\\pi R}$",
      "$\\frac{\\mu_0 I}{2\\pi R}$",
      "Zero"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class12-Physics-45_v2",
    "class_level": "Class 12",
    "subject": "Physics",
    "question_latex": "Lenz’s law gives the direction of?",
    "options": [
      "Induced EMF",
      "Magnetic Field",
      "Electric Field",
      "Current"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class12-Physics-46_v2",
    "class_level": "Class 12",
    "subject": "Physics",
    "question_latex": "Impedance of an LCR circuit at resonance is?",
    "options": [
      "$R$",
      "$\\sqrt{R^2 + X_L^2}$",
      "$X_L - X_C$",
      "Zero"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class12-Physics-47_v2",
    "class_level": "Class 12",
    "subject": "Physics",
    "question_latex": "Velocity of electromagnetic wave in vacuum?",
    "options": [
      "$\\frac{1}{\\sqrt{\\mu_0 \\epsilon_0}}$",
      "$\\sqrt{\\mu_0 \\epsilon_0}$",
      "$\\mu_0 \\epsilon_0$",
      "$\\frac{\\mu_0}{\\epsilon_0}$"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class12-Physics-48_v2",
    "class_level": "Class 12",
    "subject": "Physics",
    "question_latex": "Snell’s law is?",
    "options": [
      "$\\frac{\\sin i}{\\sin r} = \\mu$",
      "$i = r$",
      "$\\sin i \\cdot \\sin r = \\mu$",
      "$\\mu_1 \\sin r = \\mu_2 \\sin i$"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class12-Physics-49_v2",
    "class_level": "Class 12",
    "subject": "Physics",
    "question_latex": "Energy of a photon is?",
    "options": [
      "$h\\nu$",
      "$hc/\\lambda^2$",
      "$h/\\lambda$",
      "$\\lambda/h$"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class12-Physics-50_v2",
    "class_level": "Class 12",
    "subject": "Physics",
    "question_latex": "Majority charge carriers in N-type semiconductor?",
    "options": [
      "Electrons",
      "Holes",
      "Protons",
      "Neutrons"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class12-Chemistry-51_v2",
    "class_level": "Class 12",
    "subject": "Chemistry",
    "question_latex": "Unit of first order reaction rate constant?",
    "options": [
      "$s^{-1}$",
      "$mol L^{-1} s^{-1}$",
      "$L mol^{-1} s^{-1}$",
      "dimensionless"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class12-Chemistry-52_v2",
    "class_level": "Class 12",
    "subject": "Chemistry",
    "question_latex": "Which defect lowers the density of a crystal?",
    "options": [
      "Schottky",
      "Frenkel",
      "Interstitial",
      "F-center"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class12-Chemistry-53_v2",
    "class_level": "Class 12",
    "subject": "Chemistry",
    "question_latex": "Molarity of pure water?",
    "options": [
      "55.5 M",
      "18 M",
      "1 M",
      "100 M"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class12-Chemistry-54_v2",
    "class_level": "Class 12",
    "subject": "Chemistry",
    "question_latex": "Nernst equation is used to calculate?",
    "options": [
      "Cell Potential",
      "Rate constant",
      "Equilibrium constant",
      "Activation energy"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class12-Chemistry-55_v2",
    "class_level": "Class 12",
    "subject": "Chemistry",
    "question_latex": "Catalyst used in Contact Process?",
    "options": [
      "$V_2O_5$",
      "$Fe$",
      "$Ni$",
      "$Pt$"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class12-Chemistry-56_v2",
    "class_level": "Class 12",
    "subject": "Chemistry",
    "question_latex": "Which ligand is bidentate?",
    "options": [
      "Oxalate",
      "Cyanide",
      "Ammonia",
      "Water"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class12-Chemistry-57_v2",
    "class_level": "Class 12",
    "subject": "Chemistry",
    "question_latex": "Lucas reagent is?",
    "options": [
      "Anh. $ZnCl_2$ + conc. $HCl$",
      "$Br_2$ water",
      "$AgNO_3$ in $NH_3$",
      "Alkaline $KMnO_4$"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class12-Chemistry-58_v2",
    "class_level": "Class 12",
    "subject": "Chemistry",
    "question_latex": "Iodoform test is given by?",
    "options": [
      "Ethanol",
      "Methanol",
      "Formaldehyde",
      "Acetic acid"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class12-Chemistry-59_v2",
    "class_level": "Class 12",
    "subject": "Chemistry",
    "question_latex": "Vitamin C is also known as?",
    "options": [
      "Ascorbic acid",
      "Retinol",
      "Calciferol",
      "Tocopherol"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-Class12-Chemistry-60_v2",
    "class_level": "Class 12",
    "subject": "Chemistry",
    "question_latex": "Polymer of Teflon is?",
    "options": [
      "Tetrafluoroethene",
      "Ethene",
      "Vinyl chloride",
      "Styrene"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-NEET-Biology-61_v2",
    "class_level": "NEET",
    "subject": "Biology",
    "question_latex": "Which is the largest gland in the human body?",
    "options": [
      "Liver",
      "Pancreas",
      "Thyroid",
      "Adrenal"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-NEET-Biology-62_v2",
    "class_level": "NEET",
    "subject": "Biology",
    "question_latex": "Site of protein synthesis in a cell?",
    "options": [
      "Ribosomes",
      "Lysosomes",
      "Mitochondria",
      "Golgi apparatus"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-NEET-Biology-63_v2",
    "class_level": "NEET",
    "subject": "Biology",
    "question_latex": "Pacemaker of the heart is?",
    "options": [
      "SA Node",
      "AV Node",
      "Purkinje fibers",
      "Bundle of His"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-NEET-Biology-64_v2",
    "class_level": "NEET",
    "subject": "Biology",
    "question_latex": "Which hormone induces sleep?",
    "options": [
      "Melatonin",
      "Serotonin",
      "Dopamine",
      "Thyroxine"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-NEET-Biology-65_v2",
    "class_level": "NEET",
    "subject": "Biology",
    "question_latex": "Male gametophyte of angiosperms is?",
    "options": [
      "Pollen grain",
      "Anther",
      "Microspore",
      "Stamen"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-NEET-Biology-66_v2",
    "class_level": "NEET",
    "subject": "Biology",
    "question_latex": "Basic unit of classification is?",
    "options": [
      "Species",
      "Genus",
      "Family",
      "Order"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-NEET-Biology-67_v2",
    "class_level": "NEET",
    "subject": "Biology",
    "question_latex": "Cranial nerves in humans?",
    "options": [
      "12 pairs",
      "10 pairs",
      "14 pairs",
      "8 pairs"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-NEET-Biology-68_v2",
    "class_level": "NEET",
    "subject": "Biology",
    "question_latex": "DNA replication is?",
    "options": [
      "Semi-conservative",
      "Conservative",
      "Dispersive",
      "Non-conservative"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-NEET-Biology-69_v2",
    "class_level": "NEET",
    "subject": "Biology",
    "question_latex": "Theory of Natural Selection was proposed by?",
    "options": [
      "Darwin",
      "Lamarck",
      "Mendel",
      "Pasteur"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-NEET-Biology-70_v2",
    "class_level": "NEET",
    "subject": "Biology",
    "question_latex": "Kranz anatomy is found in?",
    "options": [
      "C4 plants",
      "C3 plants",
      "CAM plants",
      "Gymnosperms"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-NEET-Biology-71_v2",
    "class_level": "NEET",
    "subject": "Biology",
    "question_latex": "Which blood group is universal acceptor?",
    "options": [
      "AB",
      "O",
      "A",
      "B"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-NEET-Biology-72_v2",
    "class_level": "NEET",
    "subject": "Biology",
    "question_latex": "Hormone responsible for ovulation?",
    "options": [
      "LH",
      "FSH",
      "Estrogen",
      "Progesterone"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-NEET-Biology-73_v2",
    "class_level": "NEET",
    "subject": "Biology",
    "question_latex": "Longest bone in human body?",
    "options": [
      "Femur",
      "Tibia",
      "Humerus",
      "Radius"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-NEET-Biology-74_v2",
    "class_level": "NEET",
    "subject": "Biology",
    "question_latex": "Phloem transports?",
    "options": [
      "Food",
      "Water",
      "Minerals",
      "Air"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-NEET-Biology-75_v2",
    "class_level": "NEET",
    "subject": "Biology",
    "question_latex": "Which organelle is semi-autonomous?",
    "options": [
      "Mitochondria",
      "Lysosome",
      "ER",
      "Vacuole"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-NEET-Biology-76_v2",
    "class_level": "NEET",
    "subject": "Biology",
    "question_latex": "Double fertilization is characteristic of?",
    "options": [
      "Angiosperms",
      "Gymnosperms",
      "Pteridophytes",
      "Bryophytes"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-NEET-Biology-77_v2",
    "class_level": "NEET",
    "subject": "Biology",
    "question_latex": "Which vector causes malaria?",
    "options": [
      "Female Anopheles",
      "Culex",
      "Aedes",
      "Housefly"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-NEET-Biology-78_v2",
    "class_level": "NEET",
    "subject": "Biology",
    "question_latex": "Antibodies are secreted by?",
    "options": [
      "B-lymphocytes",
      "T-lymphocytes",
      "Macrophages",
      "Erythrocytes"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-NEET-Biology-79_v2",
    "class_level": "NEET",
    "subject": "Biology",
    "question_latex": "What is the end product of glycolysis?",
    "options": [
      "Pyruvic acid",
      "Lactic acid",
      "Citric acid",
      "Acetyl CoA"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-NEET-Biology-80_v2",
    "class_level": "NEET",
    "subject": "Biology",
    "question_latex": "Total ATP produced in aerobic respiration?",
    "options": [
      "38",
      "2",
      "36",
      "40"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-JEEMain-Mathematics-81_v2",
    "class_level": "JEE Main",
    "subject": "Mathematics",
    "question_latex": "If $f(x) = x^3 + x$, then $f^{-1}(2)$ is?",
    "options": [
      "1",
      "0",
      "-1",
      "2"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-JEEMain-Mathematics-82_v2",
    "class_level": "JEE Main",
    "subject": "Mathematics",
    "question_latex": "Limit $x \\to 0$ of $\\frac{\\sin x}{x}$ is?",
    "options": [
      "1",
      "0",
      "$\\infty$",
      "Does not exist"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-JEEMain-Mathematics-83_v2",
    "class_level": "JEE Main",
    "subject": "Mathematics",
    "question_latex": "Value of $\\int_{0}^{\\pi/2} \\log(\\tan x) dx$ is?",
    "options": [
      "0",
      "$\\pi/2$",
      "$\\pi/4$",
      "$1$"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-JEEMain-Mathematics-84_v2",
    "class_level": "JEE Main",
    "subject": "Mathematics",
    "question_latex": "The maximum value of $3\\cos x + 4\\sin x$ is?",
    "options": [
      "5",
      "7",
      "1",
      "12"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-JEEMain-Mathematics-85_v2",
    "class_level": "JEE Main",
    "subject": "Mathematics",
    "question_latex": "Number of ways to arrange the letters of \"APPLE\"?",
    "options": [
      "60",
      "120",
      "30",
      "20"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-JEEMain-Mathematics-86_v2",
    "class_level": "JEE Main",
    "subject": "Mathematics",
    "question_latex": "Area of triangle formed by $(0,0), (a,0), (0,b)$ is?",
    "options": [
      "$\\frac{1}{2}ab$",
      "$ab$",
      "$\\sqrt{a^2+b^2}$",
      "$\\frac{a+b}{2}$"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-JEEMain-Mathematics-87_v2",
    "class_level": "JEE Main",
    "subject": "Mathematics",
    "question_latex": "Derivative of $e^{\\sin x}$ is?",
    "options": [
      "$e^{\\sin x}\\cos x$",
      "$e^{\\cos x}$",
      "$e^{\\sin x}$",
      "$\\cos x e^{\\cos x}$"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-JEEMain-Mathematics-88_v2",
    "class_level": "JEE Main",
    "subject": "Mathematics",
    "question_latex": "Probability of a leap year having 53 Sundays is?",
    "options": [
      "2/7",
      "1/7",
      "53/366",
      "3/7"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-JEEMain-Mathematics-89_v2",
    "class_level": "JEE Main",
    "subject": "Mathematics",
    "question_latex": "Distance from origin to plane $2x - y + 2z = 6$ is?",
    "options": [
      "2",
      "6",
      "3",
      "1"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-JEEMain-Mathematics-90_v2",
    "class_level": "JEE Main",
    "subject": "Mathematics",
    "question_latex": "If $A$ and $B$ are symmetric matrices, $AB - BA$ is?",
    "options": [
      "Skew-symmetric",
      "Symmetric",
      "Null matrix",
      "Identity"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-JEEMain-Mathematics-91_v2",
    "class_level": "JEE Main",
    "subject": "Mathematics",
    "question_latex": "Equation of tangent to $y=x^2$ at $(1,1)$ is?",
    "options": [
      "$y=2x-1$",
      "$y=x$",
      "$y=2x+1$",
      "$y=x-1$"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-JEEMain-Mathematics-92_v2",
    "class_level": "JEE Main",
    "subject": "Mathematics",
    "question_latex": "Sum of the infinite GP $1, 1/2, 1/4...$ is?",
    "options": [
      "2",
      "1",
      "$\\infty$",
      "1.5"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-JEEMain-Mathematics-93_v2",
    "class_level": "JEE Main",
    "subject": "Mathematics",
    "question_latex": "Root of $e^x - x = 0$? (real roots)",
    "options": [
      "0",
      "1",
      "None",
      "e"
    ],
    "correct_option": 2,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-JEEMain-Mathematics-94_v2",
    "class_level": "JEE Main",
    "subject": "Mathematics",
    "question_latex": "Value of $i^4 + i^5 + i^6 + i^7$ is?",
    "options": [
      "0",
      "1",
      "-1",
      "i"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-JEEMain-Mathematics-95_v2",
    "class_level": "JEE Main",
    "subject": "Mathematics",
    "question_latex": "Locus of $z$ such that $|z - 1| = |z + 1|$ is?",
    "options": [
      "y-axis",
      "x-axis",
      "circle",
      "parabola"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-JEEMain-Mathematics-96_v2",
    "class_level": "JEE Main",
    "subject": "Mathematics",
    "question_latex": "The sum of roots of $x^3 - 6x^2 + 11x - 6 = 0$ is?",
    "options": [
      "6",
      "11",
      "6",
      "1"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-JEEMain-Mathematics-97_v2",
    "class_level": "JEE Main",
    "subject": "Mathematics",
    "question_latex": "Rank of a $3 \\times 3$ non-singular matrix is?",
    "options": [
      "3",
      "2",
      "1",
      "0"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-JEEMain-Mathematics-98_v2",
    "class_level": "JEE Main",
    "subject": "Mathematics",
    "question_latex": "Period of $\\sin(2x)$ is?",
    "options": [
      "$\\pi$",
      "$2\\pi$",
      "$\\pi/2$",
      "$\\pi/4$"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-JEEMain-Mathematics-99_v2",
    "class_level": "JEE Main",
    "subject": "Mathematics",
    "question_latex": "Integration of $1/x$ is?",
    "options": [
      "$\\ln|x|$",
      "$x^2/2$",
      "$-1/x^2$",
      "$e^x$"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  },
  {
    "id": "mock-JEEMain-Mathematics-100_v2",
    "class_level": "JEE Main",
    "subject": "Mathematics",
    "question_latex": "Value of $\\cos 20^\\circ \\cos 40^\\circ \\cos 80^\\circ$?",
    "options": [
      "1/8",
      "1/4",
      "1/2",
      "1"
    ],
    "correct_option": 0,
    "solution_latex": "Standard derivation applied."
  }
];

export const EXTRA_CLASS_QUESTIONS = [
  {
    id: 'class5_math_1',
    class_level: 'Class 5',
    subject: 'Mathematics',
    question_latex: "What is the LCM of 12 and 15?",
    options: ["60", "30", "120", "15"],
    correct_option: 0,
    solution_latex: "The prime factors are $12 = 2^2 \times 3$ and $15 = 3 \times 5$. LCM = $2^2 \times 3 \times 5 = 60$."
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
    solution_latex: "$3x = 15 \implies x = 5$."
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
    options: ["$kg \cdot m/s$", "$N \cdot s$", "$Joule$", "$Watt$"],
    correct_option: 0,
    solution_latex: "$p = mv$, so the unit is $kg \cdot m/s$."
  },
  {
    id: 'class10_chem_1',
    class_level: 'Class 10',
    subject: 'Chemistry',
    question_latex: "What happens when dilute hydrochloric acid is added to iron fillings?",
    options: ["Hydrogen gas and iron chloride are produced.", "Chlorine gas and iron hydroxide are produced.", "No reaction takes place.", "Iron salt and water are produced."],
    correct_option: 0,
    solution_latex: "$Fe + 2HCl \rightarrow FeCl_2 + H_2$"
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
    question_latex: "Evaluate the integral: $\int e^x dx$",
    options: ["$e^x + C$", "$x e^x + C$", "$\ln(x) + C$", "$e^{2x} + C$"],
    correct_option: 0,
    solution_latex: "The integral of $e^x$ is $e^x + C$."
  }
];

 MASTER_QUESTIONS.push(...EXTRA_CLASS_QUESTIONS);
