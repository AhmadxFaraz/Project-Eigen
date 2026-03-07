// --- Data Structure ---
const studyData = [
  {
    id: "topic_1",
    title: "1. Linear System Solvers",
    description: "Gauss elimination and Gauss-Seidel methods for systems of linear equations.",
    color: "blue",
    tasks: [
      { id: "u1_t1_1", text: "Theory: Gauss elimination method", type: "theory", completed: false },
      { id: "u1_t1_2", text: "Theory: Gauss-Seidel iterative method", type: "theory", completed: false },
      { id: "u1_t1_3", text: "Solved examples 2.10-2.13 and 2.15-2.19 (pp. 33-42, S. S. Sastry)", type: "problem", completed: false },
      { id: "u1_t1_4", text: "Solved example 5 (p. 90), Q2 / Exercise (p. 97), Exercise (p. 105) (M. K. Venkatraman)", type: "problem", completed: false }
    ]
  },
  {
    id: "topic_2",
    title: "2. Nonlinear Equation Solvers",
    description: "Newton-Raphson and general iteration methods with convergence behavior.",
    color: "indigo",
    tasks: [
      { id: "u1_t2_1", text: "Theory: Newton-Raphson method", type: "theory", completed: false },
      { id: "u1_t2_2", text: "Theory: General iteration method", type: "theory", completed: false },
      { id: "u1_t2_3", text: "Theory: Rate of convergence", type: "theory", completed: false },
      { id: "u1_t2_4", text: "Solved examples 11 and 12 (pp. 104-105, M. K. Venkatraman)", type: "problem", completed: false },
      { id: "u1_t2_5", text: "Solved examples 1 and 2 (pp. 117-119, M. K. Venkatraman)", type: "problem", completed: false },
      { id: "u1_t2_6", text: "Question on rate of convergence", type: "problem", completed: false },
      { id: "u1_t2_7", text: "Q15 / Exercise (p. 120, M. K. Venkatraman)", type: "problem", completed: false },
      { id: "u1_t2_8", text: "Q35 / Exercise (p. 146, M. K. Venkatraman)", type: "problem", completed: false }
    ]
  },
  {
    id: "topic_3",
    title: "3. Finite Difference Operators",
    description: "Difference operators, symbolic relations, missing value, and difference tables.",
    color: "purple",
    tasks: [
      { id: "u1_t3_1", text: "Theory: Finite difference operators", type: "theory", completed: false },
      { id: "u1_t3_2", text: "Theory: Symbolic relations", type: "theory", completed: false },
      { id: "u1_t3_3", text: "Theory: Missing value in difference tables", type: "theory", completed: false },
      { id: "u1_t3_4", text: "Theory: Construction of difference tables", type: "theory", completed: false }
    ]
  },
  {
    id: "topic_4",
    title: "4. Finite Difference Practice",
    description: "Worked examples from Sastry and Venkatraman.",
    color: "teal",
    tasks: [
      { id: "u1_t4_1", text: "Solved examples 3.1 and 3.2 (pp. 81-82, S. S. Sastry)", type: "problem", completed: false },
      { id: "u1_t4_2", text: "Solved examples 3.4, 3.5, 3.7 (pp. 86-88, S. S. Sastry)", type: "problem", completed: false },
      { id: "u1_t4_3", text: "Solved examples 14-18 (pp. 180-184) and Exercise (p. 183) (M. K. Venkatraman)", type: "problem", completed: false }
    ]
  }
];
