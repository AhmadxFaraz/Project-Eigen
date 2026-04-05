const trackData = [
  {
    id: "foundations",
    title: "1. Foundations",
    description: "The grammar of the subject. Skip these and everything else becomes decorative confusion.",
    color: "cyan",
    topics: [
      {
        id: "utility-theory",
        title: "Utility Theory",
        subtopics: ["Expected utility", "Risk aversion"],
        useCase: "Modeling consumer choices under uncertainty.",
        mathUsed: ["Probability", "Optimization"],
        completed: false
      },
      {
        id: "preferences-choice",
        title: "Preferences & Rational Choice",
        subtopics: ["Preference ordering", "Rational choice theory"],
        useCase: "Explaining how individuals rank options and make tradeoffs.",
        mathUsed: ["Set Theory", "Logic"],
        completed: false
      },
      {
        id: "demand-supply",
        title: "Demand & Supply Modeling",
        subtopics: ["Functional forms", "Equilibrium intuition"],
        useCase: "Understanding price-quantity relationships in markets.",
        mathUsed: ["Functions", "Calculus"],
        completed: false
      },
      {
        id: "elasticity",
        title: "Elasticity",
        subtopics: ["Price elasticity", "Income elasticity", "Cross elasticity"],
        useCase: "Studying how sensitive demand is to real market changes.",
        mathUsed: ["Differentiation", "Ratios"],
        completed: false
      }
    ]
  },
  {
    id: "core-game-theory",
    title: "2. Core Game Theory",
    description: "The strategic core. Once Nash clicks, you start seeing it everywhere.",
    color: "indigo",
    topics: [
      {
        id: "game-theory-basics",
        title: "Game Theory Basics",
        subtopics: ["Players", "Payoffs", "Strategies"],
        useCase: "Framing strategic interaction before solving it.",
        mathUsed: ["Matrices", "Logic"],
        completed: false
      },
      {
        id: "normal-form-games",
        title: "Normal Form Games",
        subtopics: ["Payoff matrices", "Simultaneous games"],
        useCase: "Analyzing pricing, competition, and simple strategic choices.",
        mathUsed: ["Matrix Representation", "Optimization"],
        completed: false
      },
      {
        id: "extensive-form-games",
        title: "Extensive Form Games",
        subtopics: ["Game trees", "Sequential moves"],
        useCase: "Modeling negotiations and step-by-step competitive decisions.",
        mathUsed: ["Tree Structures", "Backward Induction"],
        completed: false
      },
      {
        id: "dominant-strategies-nash",
        title: "Dominant Strategies & Nash Equilibrium",
        subtopics: ["Dominant strategies", "Pure Nash", "Mixed Nash"],
        useCase: "Explaining why people cooperate, compete, or free-ride in teams and markets.",
        mathUsed: ["Probability", "Optimization"],
        completed: false
      }
    ]
  },
  {
    id: "advanced-game-theory",
    title: "3. Advanced Game Theory",
    description: "The serious layer where strategic modeling starts looking like a profession.",
    color: "purple",
    topics: [
      {
        id: "repeated-games",
        title: "Repeated Games",
        subtopics: ["Incentives over time", "Reputation effects"],
        useCase: "Understanding long-term competition and cooperation.",
        mathUsed: ["Sequences", "Discounting"],
        completed: false
      },
      {
        id: "subgame-perfect-equilibrium",
        title: "Subgame Perfect Equilibrium",
        subtopics: ["Credible threats", "Backward induction"],
        useCase: "Testing strategic plans in multi-step interactions.",
        mathUsed: ["Trees", "Optimization"],
        completed: false
      },
      {
        id: "bayesian-games",
        title: "Bayesian Games",
        subtopics: ["Incomplete information", "Beliefs", "Types"],
        useCase: "Modeling competition when players know different things.",
        mathUsed: ["Conditional Probability", "Expected Value"],
        completed: false
      },
      {
        id: "mechanism-auction-theory",
        title: "Mechanism Design & Auction Theory",
        subtopics: ["Incentive compatibility", "Auctions", "Revelation principle"],
        useCase: "Designing systems where the rules shape behavior.",
        mathUsed: ["Optimization", "Probability"],
        completed: false
      }
    ]
  },
  {
    id: "behavioral-economics",
    title: "4. Behavioral Economics",
    description: "Because humans ruin neat models and the math has to adapt.",
    color: "amber",
    topics: [
      {
        id: "behavioral-basics",
        title: "Behavioral Economics",
        subtopics: ["Deviation from rational models", "Decision anomalies"],
        useCase: "Explaining why real people do not behave like clean equations.",
        mathUsed: ["Statistics", "Decision Theory"],
        completed: false
      },
      {
        id: "prospect-theory",
        title: "Prospect Theory",
        subtopics: ["Reference points", "Value functions", "Loss aversion"],
        useCase: "Understanding how gains and losses are felt asymmetrically.",
        mathUsed: ["Probability Weighting", "Piecewise Functions"],
        completed: false
      },
      {
        id: "cognitive-biases",
        title: "Cognitive Biases",
        subtopics: ["Anchoring", "Loss aversion", "Framing"],
        useCase: "Explaining pricing, investing, and negotiation mistakes.",
        mathUsed: ["Statistics", "Inference"],
        completed: false
      },
      {
        id: "bounded-rationality",
        title: "Bounded Rationality",
        subtopics: ["Limited information", "Limited computation"],
        useCase: "Modeling real-world decision-making under constraints.",
        mathUsed: ["Optimization", "Heuristics"],
        completed: false
      }
    ]
  },
  {
    id: "market-models",
    title: "5. Market & Economic Models",
    description: "The models behind pricing, competition, and why some firms behave like villains.",
    color: "cyan",
    topics: [
      {
        id: "competition-monopoly",
        title: "Perfect Competition vs Monopoly",
        subtopics: ["Competitive pricing", "Monopoly pricing"],
        useCase: "Comparing price behavior under different market structures.",
        mathUsed: ["Calculus", "Optimization"],
        completed: false
      },
      {
        id: "oligopoly-models",
        title: "Oligopoly Models",
        subtopics: ["Cournot", "Bertrand"],
        useCase: "Understanding strategic competition among a few firms.",
        mathUsed: ["Game Theory", "Equilibrium Analysis"],
        completed: false
      },
      {
        id: "market-equilibrium",
        title: "Market Equilibrium",
        subtopics: ["Walrasian equilibrium", "Price adjustment"],
        useCase: "Explaining how supply and demand settle into market prices.",
        mathUsed: ["Systems of Equations", "Fixed Points"],
        completed: false
      },
      {
        id: "general-equilibrium",
        title: "General Equilibrium Theory",
        subtopics: ["Interconnected markets", "System-wide balance"],
        useCase: "Studying economies where many markets interact at once.",
        mathUsed: ["Linear Algebra", "Optimization"],
        completed: false
      }
    ]
  },
  {
    id: "financial-mathematics",
    title: "6. Financial Mathematics",
    description: "Where math meets money and the stress level goes up accordingly.",
    color: "indigo",
    topics: [
      {
        id: "time-value-money",
        title: "Time Value of Money",
        subtopics: ["Present value", "Future value", "Compounding"],
        useCase: "Comparing money across time in finance and business.",
        mathUsed: ["Exponential Functions", "Sequences"],
        completed: false
      },
      {
        id: "discounting-cash-flow",
        title: "Discounting & Cash Flow Models",
        subtopics: ["Discount factors", "NPV", "Cash flow valuation"],
        useCase: "Evaluating projects, firms, and investment opportunities.",
        mathUsed: ["Series", "Optimization"],
        completed: false
      },
      {
        id: "stochastic-processes",
        title: "Stochastic Processes",
        subtopics: ["Random walks", "State evolution"],
        useCase: "Modeling price movement and uncertainty over time.",
        mathUsed: ["Probability", "Markov Models"],
        completed: false
      },
      {
        id: "black-scholes",
        title: "Black-Scholes Model",
        subtopics: ["Option pricing", "Volatility", "Risk-neutral ideas"],
        useCase: "Connecting differential equations and finance in one famous model.",
        mathUsed: ["Probability", "Differential Equations"],
        completed: false
      }
    ]
  },
  {
    id: "optimization-in-economics",
    title: "7. Optimization in Economics",
    description: "Economics without optimization is just storytelling.",
    color: "purple",
    topics: [
      {
        id: "linear-programming-econ",
        title: "Linear Programming",
        subtopics: ["Resource allocation", "Constraint modeling"],
        useCase: "Planning production and optimizing decisions under limits.",
        mathUsed: ["Matrices", "Optimization"],
        completed: false
      },
      {
        id: "convex-optimization",
        title: "Convex Optimization",
        subtopics: ["Convex sets", "Convex objectives"],
        useCase: "Solving stable optimization problems with reliable minima.",
        mathUsed: ["Calculus", "Geometry"],
        completed: false
      },
      {
        id: "lagrange-multipliers",
        title: "Lagrange Multipliers",
        subtopics: ["Constrained maxima/minima", "Economic interpretation"],
        useCase: "Handling constrained decisions in economics and finance.",
        mathUsed: ["Multivariable Calculus", "Optimization"],
        completed: false
      },
      {
        id: "duality-theory",
        title: "Duality Theory",
        subtopics: ["Primal-dual viewpoint", "Shadow prices"],
        useCase: "Understanding the hidden economic meaning of constraints.",
        mathUsed: ["Linear Programming", "Optimization"],
        completed: false
      }
    ]
  },
  {
    id: "network-social-economics",
    title: "8. Network & Social Economics",
    description: "Finally, some integration instead of isolated boxes.",
    color: "amber",
    topics: [
      {
        id: "network-effects",
        title: "Network Effects",
        subtopics: ["Positive feedback", "Platform growth"],
        useCase: "Explaining why some digital products become stronger as users increase.",
        mathUsed: ["Graph Theory", "Nonlinear Growth"],
        completed: false
      },
      {
        id: "graph-theory-economics",
        title: "Graph Theory in Economics",
        subtopics: ["Nodes and links", "Strategic networks"],
        useCase: "Modeling trade links, information spread, and influence structures.",
        mathUsed: ["Graph Theory", "Matrices"],
        completed: false
      },
      {
        id: "social-influence-models",
        title: "Social Influence Models",
        subtopics: ["Peer effects", "Diffusion"],
        useCase: "Understanding how behavior spreads through connected groups.",
        mathUsed: ["Probability", "Networks"],
        completed: false
      },
      {
        id: "information-cascades",
        title: "Information Cascades",
        subtopics: ["Herding", "Sequential decisions"],
        useCase: "Explaining bubbles, hype cycles, and mass overreaction.",
        mathUsed: ["Bayesian Reasoning", "Decision Theory"],
        completed: false
      }
    ]
  },
  {
    id: "decision-theory-uncertainty",
    title: "9. Decision Theory & Uncertainty",
    description: "The bridge to AI is right here. Almost everything is connected.",
    color: "cyan",
    topics: [
      {
        id: "decision-trees",
        title: "Decision Trees",
        subtopics: ["Decision nodes", "Chance nodes", "Payoff evaluation"],
        useCase: "Breaking uncertain decisions into analyzable branches.",
        mathUsed: ["Trees", "Expected Value"],
        completed: false
      },
      {
        id: "expected-value-risk",
        title: "Expected Value & Risk",
        subtopics: ["Expected return", "Risk tradeoffs"],
        useCase: "Comparing options when outcomes are uncertain.",
        mathUsed: ["Probability", "Statistics"],
        completed: false
      },
      {
        id: "utility-under-uncertainty",
        title: "Utility Under Uncertainty",
        subtopics: ["Utility functions", "Risk preferences"],
        useCase: "Explaining why people choose safer or riskier options.",
        mathUsed: ["Probability", "Optimization"],
        completed: false
      },
      {
        id: "markov-decision-processes",
        title: "Markov Decision Processes",
        subtopics: ["States", "Actions", "Policy"],
        useCase: "Connecting economics, dynamic decisions, and AI-style planning.",
        mathUsed: ["Markov Chains", "Dynamic Programming"],
        completed: false
      }
    ]
  },
  {
    id: "real-world-applications",
    title: "10. Real-World Applications",
    description: "The section that makes the project stand out instead of reading like a decorative syllabus.",
    color: "indigo",
    topics: [
      {
        id: "uber-surge-pricing",
        title: "Uber Surge Pricing",
        subtopics: ["Demand spikes", "Dynamic pricing"],
        useCase: "Explaining how platforms adjust price when local demand overwhelms supply.",
        mathUsed: ["Optimization", "Elasticity", "Probability"],
        linkedConcepts: ["Demand & Supply Modeling", "Market Equilibrium", "Game Theory Basics"],
        example: "Price moves not because the app is emotional, but because matching under scarcity is an optimization problem.",
        completed: false
      },
      {
        id: "ad-auctions",
        title: "eBay & Ad-Bidding Auctions",
        subtopics: ["Bidding strategy", "Auction design"],
        useCase: "Understanding why auction rules shape final prices and participant behavior.",
        mathUsed: ["Auction Theory", "Probability", "Optimization"],
        linkedConcepts: ["Mechanism Design & Auction Theory", "Bayesian Games"],
        example: "The auction is not just selling attention; it is engineering incentives.",
        completed: false
      },
      {
        id: "cricket-strategy",
        title: "Game Theory in Cricket Strategy",
        subtopics: ["Bowling plans", "Field setups", "Shot selection"],
        useCase: "Modeling repeated strategic adaptation between teams.",
        mathUsed: ["Mixed Strategies", "Repeated Games", "Probability"],
        linkedConcepts: ["Dominant Strategies & Nash Equilibrium", "Repeated Games"],
        example: "A captain changing field positions is often running a live strategic model without saying it out loud.",
        completed: false
      },
      {
        id: "negotiation-scenarios",
        title: "Negotiation Scenarios",
        subtopics: ["Commitment", "Threats", "Information gaps"],
        useCase: "Understanding how leverage and information change the result of a deal.",
        mathUsed: ["Extensive Form Games", "Bayesian Games", "Decision Trees"],
        linkedConcepts: ["Extensive Form Games", "Subgame Perfect Equilibrium", "Decision Trees"],
        example: "Good negotiation is rarely pure confidence; usually it is structure plus leverage plus timing.",
        completed: false
      },
      {
        id: "stock-market-behavior",
        title: "Stock Market Behavior",
        subtopics: ["Volatility", "Herding", "Risk pricing"],
        useCase: "Reading markets as a mix of stochastic movement and human overreaction.",
        mathUsed: ["Stochastic Processes", "Behavioral Economics", "Expected Value"],
        linkedConcepts: ["Prospect Theory", "Stochastic Processes", "Expected Value & Risk"],
        example: "Markets are not just numbers moving; they are beliefs, incentives, and panic translated into price.",
        completed: false
      }
    ]
  }
];
