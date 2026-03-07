// --- Data Structure ---
const studyData = [
  {
    id: "topic_1",
    title: "1. Complex Variable Basics",
    description: "Limits, continuity, and differential coefficients of complex functions.",
    color: "blue",
    tasks: [
      { id: "u1_t1_1", text: "Theory: Functions of complex variables", type: "theory", completed: false },
      { id: "u1_t1_2", text: "Theory: Limits and continuity in complex plane", type: "theory", completed: false },
      { id: "u1_t1_3", text: "Theory: Differential coefficients in complex analysis", type: "theory", completed: false },
      { id: "u1_t1_4", text: "Exercise 19: Q1-20 (Chandrika Prasad)", type: "problem", completed: false }
    ]
  },
  {
    id: "topic_2",
    title: "2. Analytic Functions",
    description: "Cauchy-Riemann equation, analyticity conditions, harmonic functions, and Milne Thomson method.",
    color: "indigo",
    tasks: [
      { id: "u1_t2_1", text: "Theory: Cauchy-Riemann equations", type: "theory", completed: false },
      { id: "u1_t2_2", text: "Theory: Necessary and sufficient condition of analyticity (Theorems 10.8, 10.9)", type: "theory", completed: false },
      { id: "u1_t2_3", text: "Theory: Harmonic functions", type: "theory", completed: false },
      { id: "u1_t2_4", text: "Theory: Milne Thomson's method", type: "theory", completed: false },
      { id: "u1_t2_5", text: "Solved examples 10.32, 10.33, 10.35, 10.36, 10.38, 10.44, 10.45, 10.48 (Jain & Iyengar)", type: "problem", completed: false }
    ]
  },
  {
    id: "topic_3",
    title: "3. Complex Integration Foundations",
    description: "Curves in complex plane, line integrals, and connected domains.",
    color: "purple",
    tasks: [
      { id: "u1_t3_1", text: "Theory: Curves in complex plane and line integral", type: "theory", completed: false },
      { id: "u1_t3_2", text: "Theory: Simply connected and multiply connected domains", type: "theory", completed: false },
      { id: "u1_t3_3", text: "Exercise 10.5: Q27, Q28, Q49, Q50 (Jain & Iyengar)", type: "problem", completed: false },
      { id: "u1_t3_4", text: "Exercise 10.6: Q12, Q13, Q19 (Jain & Iyengar)", type: "problem", completed: false }
    ]
  },
  {
    id: "topic_4",
    title: "4. Cauchy Theorems and Formula",
    description: "Cauchy's theorem, Cauchy integral formula, and extension to multiply connected domains.",
    color: "teal",
    tasks: [
      { id: "u1_t4_1", text: "Theory: Cauchy's theorem", type: "theory", completed: false },
      { id: "u1_t4_2", text: "Theory: Cauchy integral formula", type: "theory", completed: false },
      { id: "u1_t4_3", text: "Theory: Extension of Cauchy integral theorem to multiply connected domains", type: "theory", completed: false },
      { id: "u1_t4_4", text: "Solved examples 1, 2 (Chandrika Prasad)", type: "problem", completed: false },
      { id: "u1_t4_5", text: "Exercise 21: Q1-10 (Chandrika Prasad)", type: "problem", completed: false }
    ]
  },
  {
    id: "topic_5",
    title: "5. Unit Practice Set",
    description: "Consolidated problem practice from chapter 11.",
    color: "amber",
    tasks: [
      { id: "u1_t5_1", text: "Solved examples 11.10, 11.11, 11.19, 11.20, 11.24, 11.25, 11.29, 11.31-11.35, 11.39-11.41 (Jain & Iyengar)", type: "problem", completed: false },
      { id: "u1_t5_2", text: "Exercise 11.2: Q1, Q3, Q4, Q13-Q16 (Jain & Iyengar)", type: "problem", completed: false },
      { id: "u1_t5_3", text: "Exercise 11.3: Q8, Q9, Q11, Q14, Q22, Q23, Q26, Q28 (Jain & Iyengar)", type: "problem", completed: false },
      { id: "u1_t5_4", text: "Exercise 11.4: Q11-Q16 (Jain & Iyengar)", type: "problem", completed: false },
      { id: "u1_t5_5", text: "Exercise 11.5: Q1, Q4, Q5, Q6, Q8 (Jain & Iyengar)", type: "problem", completed: false }
    ]
  }
];
