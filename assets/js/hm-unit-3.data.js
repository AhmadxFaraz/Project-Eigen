// --- Data Structure ---
const studyData = [
  {
    id: "topic_1",
    title: "1. Vector Field Fundamentals",
    description: "Scalar field, vector field, and core differential operators.",
    color: "blue",
    tasks: [
      { id: "u3_t1_1", text: "Theory: Scalar field and vector field", type: "theory", completed: false },
      { id: "u3_t1_2", text: "Theory: Gradient of a scalar field", type: "theory", completed: false },
      { id: "u3_t1_3", text: "Theory: Divergence and curl of a vector field", type: "theory", completed: false }
    ]
  },
  {
    id: "topic_2",
    title: "2. Physical Significance and Potentials",
    description: "Solenoidal/irrotational fields and potential function determination.",
    color: "indigo",
    tasks: [
      { id: "u3_t2_1", text: "Theory: Physical significance of divergence and curl", type: "theory", completed: false },
      { id: "u3_t2_2", text: "Theory: Solenoidal and irrotational vector fields", type: "theory", completed: false },
      { id: "u3_t2_3", text: "Theory: Determination of potential functions", type: "theory", completed: false }
    ]
  },
  {
    id: "topic_3",
    title: "3. Guided Problem Set",
    description: "Examples from Chandrika Prasad and solved examples from Jain & Iyengar.",
    color: "purple",
    tasks: [
      { id: "u3_t3_1", text: "Examples 15: Q1-13 and Q16-25 (Chandrika Prasad)", type: "problem", completed: false },
      { id: "u3_t3_2", text: "Solved examples 15.12, 15.13, 15.16 (Jain & Iyengar)", type: "problem", completed: false }
    ]
  },
  {
    id: "topic_4",
    title: "4. Exercise Practice",
    description: "Targeted practice from chapter 15 exercises.",
    color: "teal",
    tasks: [
      { id: "u3_t4_1", text: "Exercise 15.2: Q2, Q4, Q14, Q21, Q25, Q26 (Jain & Iyengar)", type: "problem", completed: false },
      { id: "u3_t4_2", text: "Exercise 15.3: Q5, Q8, Q10, Q12, Q16, Q26, Q28, Q30 (Jain & Iyengar)", type: "problem", completed: false }
    ]
  }
];
