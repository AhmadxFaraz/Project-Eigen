// --- Data Structure ---
const studyData = [
  {
    id: "topic_1",
    title: "1. Power Series and Convergence",
    description: "Series representation and convergence behavior.",
    color: "blue",
    tasks: [
      { id: "u2_t1_1", text: "Theory: Power series and convergence", type: "theory", completed: false },
      { id: "u2_t1_2", text: "Solved examples 12.28, 12.29 (Jain & Iyengar)", type: "problem", completed: false },
      { id: "u2_t1_3", text: "Exercise 12.3: Q1-14 (Jain & Iyengar)", type: "problem", completed: false }
    ]
  },
  {
    id: "topic_2",
    title: "2. Taylor and Laurent Series",
    description: "Complex series expansions for analytic and singular behavior.",
    color: "indigo",
    tasks: [
      { id: "u2_t2_1", text: "Theory: Taylor series", type: "theory", completed: false },
      { id: "u2_t2_2", text: "Theory: Laurent series", type: "theory", completed: false },
      { id: "u2_t2_3", text: "Solved examples 12.33, 12.34, 12.35, 12.40, 12.41, 12.42 (Jain & Iyengar)", type: "problem", completed: false },
      { id: "u2_t2_4", text: "Exercise 22: Q1-14 (Chandrika Prasad)", type: "problem", completed: false }
    ]
  },
  {
    id: "topic_3",
    title: "3. Zeros, Singularities, and Residues",
    description: "Classification of singular points and residue at different types.",
    color: "purple",
    tasks: [
      { id: "u2_t3_1", text: "Theory: Zeros and singularities of complex functions", type: "theory", completed: false },
      { id: "u2_t3_2", text: "Theory: Removable, pole, and essential singularities", type: "theory", completed: false },
      { id: "u2_t3_3", text: "Theory: Residue at removable, simple, and higher-order poles", type: "theory", completed: false },
      { id: "u2_t3_4", text: "Solved examples 13.3, 13.4, 13.8-13.15 (Jain & Iyengar)", type: "problem", completed: false },
      { id: "u2_t3_5", text: "Exercise 22 (page 184): Q15-29 (Chandrika Prasad)", type: "problem", completed: false }
    ]
  },
  {
    id: "topic_4",
    title: "4. Residue Theorem and Contour Integrals",
    description: "Using residues to evaluate contour integrals.",
    color: "teal",
    tasks: [
      { id: "u2_t4_1", text: "Theory: Residue theorem", type: "theory", completed: false },
      { id: "u2_t4_2", text: "Theory: Evaluation of contour integrals using residues", type: "theory", completed: false },
      { id: "u2_t4_3", text: "Solved examples 13.17-13.22 (Jain & Iyengar)", type: "problem", completed: false },
      { id: "u2_t4_4", text: "Exercise 22 (page 184): Q29-32 (Chandrika Prasad)", type: "problem", completed: false }
    ]
  },
  {
    id: "topic_5",
    title: "5. Applications to Real Integrals",
    description: "Applying residues to trigonometric and improper real integrals.",
    color: "amber",
    tasks: [
      { id: "u2_t5_1", text: "Theory: Applications of residue theorem to real definite integrals", type: "theory", completed: false },
      { id: "u2_t5_2", text: "Theory: Improper real integrals and singular points on real axis", type: "theory", completed: false },
      { id: "u2_t5_3", text: "Exercise 23 (page 191): Q1-11 (Chandrika Prasad)", type: "problem", completed: false }
    ]
  }
];
