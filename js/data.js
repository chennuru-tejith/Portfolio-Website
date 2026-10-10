// ============================================================
//  ALL PORTFOLIO CONTENT LIVES HERE.
//  Edit this file to update the site — no other code changes needed.
// ============================================================

window.PORTFOLIO = {
  profile: {
    name: "Chennuru Tejith",
    shortName: "Tejith",
    title: "Business Strategist in Training",
    tagline: "BBA + MBA @ O.P. Jindal Global University · Finance · Operations · Leadership — and a builder of AI tools on the side.",
    location: "Hyderabad, India",
    // assembled at runtime so simple scrapers don't harvest the address from the source
    email: ["ch.tejith", "gmail.com"].join("@"),
    linkedin: "https://www.linkedin.com/in/chennuru-tejith",
    github: "https://github.com/chennuru-tejith",
    cv: "assets/Chennuru_Tejith_CV.pdf",
    // The harbour greeting cycles through the languages Tejith speaks.
    greetings: ["Hi there!", "Namaste!", "నమస్కారం!", "Bonjour!"],
    summary:
      "Business management student with hands-on experience in CSR operations, finance, and project management at a nonprofit trust and leading corporate organizations. Skilled in on-ground project monitoring, budget tracking, financial analysis, and stakeholder/sponsor reporting. Combines operational and analytical rigor with active leadership in institutional governance and student organizations.",
    stats: [
      { label: "Internships", value: "3" },
      { label: "CSR project monitored", value: "₹4 Cr" },
      { label: "Member club directed", value: "200+" },
      { label: "CGPA", value: "7.9/8" },
    ],
    // The quote shown between the Gyms and the Journey. Wrap words in *stars* to set them in italic gold.
    quote: {
      text: "Loyalty isn't proven when staying is easy. It's proven when *leaving would be easier.*",
      by: "A rule I work by",
    },
    languages: ["English (Full Professional)", "Telugu (Native)", "Hindi (Working)", "French (Elementary)"],
  },

  // ---------- The 5 Gyms (skill domains) ----------
  gyms: [
    {
      id: "ledger",
      name: "Ledger Gym",
      domain: "Finance & Analytics",
      type: "Finance",
      color: "#e0a526",
      icon: "coin", medal: "Ledger Badge",
      intro: "Numbers tell stories. I track every rupee and explain every trend.",
      moves: ["Financial Analysis", "Cost Analysis", "Budgeting", "Bookkeeping", "Financial Reporting", "Data Interpretation"],
      battles: [
        {
          role: "Project Management Intern",
          org: "Dr. Reddy's Laboratories Ltd.",
          when: "Jun 2025 – Jul 2025 · Hyderabad",
          points: [
            "Conducted employee cost analysis across FY2021–FY2025, tracking trends in salaries, share-based payments, and welfare expenses to support cost-optimization discussions.",
            "Prepared structured management reports from multi-year workforce data, enabling leadership decisions on headcount budgeting and welfare spending.",
          ],
        },
        {
          role: "Finance Intern",
          org: "Ion Exchange India Ltd.",
          when: "Dec 2024 – Jan 2025 · Hyderabad",
          points: [
            "Streamlined daily transaction processing, improving workflow efficiency and reducing documentation backlogs.",
            "Standardized vendor records and aligned internal financial documentation, enhancing data consistency and audit readiness.",
          ],
        },
      ],
    },
    {
      id: "blueprint",
      name: "Blueprint Gym",
      domain: "Operations & Project Management",
      type: "Operations",
      color: "#e2603a",
      icon: "blueprint", medal: "Blueprint Badge",
      intro: "Plans are easy. Execution on the ground is the real battle.",
      moves: ["On-ground Monitoring", "Budget Tracking", "Sponsor Reporting", "Vendor Verification", "Cross-functional Coordination"],
      battles: [
        {
          role: "Operations Intern",
          org: "Round Table India — Hyderabad Titans Round Table Charitable Trust",
          when: "Jun 2026 – Jul 2026 · Hyderabad",
          points: [
            "Monitored on-site execution of a ₹4 Cr CSR-funded government school construction project (MPPS & ZPHS Integrated School, Phase II) across 23 site visits over 7 weeks.",
            "Tracked CSR fund utilisation against the sanctioned budget and co-drafted progress-and-spend updates for CSR sponsor VST Industries Ltd., including a live sponsor update call.",
            "Verified contractor-reported material stock and spend against supervisor records — catching and resolving a reporting discrepancy before it reached the sponsor.",
          ],
        },
      ],
    },
    {
      id: "summit",
      name: "Summit Gym",
      domain: "Leadership & Governance",
      type: "Leadership",
      color: "#8b5cf6",
      icon: "crown", medal: "Summit Badge",
      intro: "Leadership is learned by doing: through committees, clubs and communities.",
      moves: ["Leadership", "Institutional Governance", "Policy Deliberation", "Event Programming", "Mentorship"],
      battles: [
        {
          role: "Director",
          org: "JGU Entrepreneurship Club",
          when: "Feb 2026 – May 2026 · Sonipat",
          points: ["Oversaw entrepreneurial programming, mentorship activities, and startup events for a 200+ member student community."],
        },
        {
          role: "Student Representative, COGSASH",
          org: "O.P. Jindal Global University",
          when: "Nov 2025 – Present · Sonipat",
          points: ["Elected representative on JGU's Gender Sensitisation Committee — policy deliberations, awareness campaigns, and institutional governance."],
        },
        {
          role: "Member, Election Commission",
          org: "Jindal Global Business School (JGBS)",
          when: "Apr 2025 – Present · Sonipat",
          points: ["Administer student election processes ensuring compliance, transparency, and fair representation."],
        },
        {
          role: "Member, Student Grievance Redressal Committee",
          org: "Food & Mess Committee, JGBS",
          when: "Aug 2026 – Present · Sonipat",
          points: ["Represent student interests on food and mess service quality, handling grievance resolution and liaison with campus administration."],
        },
      ],
    },
    {
      id: "signal",
      name: "Signal Gym",
      domain: "Marketing & Communication",
      type: "Comms",
      color: "#ec4899",
      icon: "signal", medal: "Signal Badge",
      intro: "A great idea is only as strong as the way you tell it.",
      moves: ["Strategic Communication", "Stakeholder Management", "Partnership Development", "Report Writing", "Public Outreach"],
      battles: [
        {
          role: "Head of Outreach",
          org: "ZAMAC — The Marketing Club, JGBS",
          when: "Feb 2026 – Present · Sonipat (member since Sep 2025)",
          points: ["Lead external partnership development and outreach strategy, managing stakeholder relationships and event visibility for the university's marketing club."],
        },
        {
          role: "Business Partner Communications",
          org: "Ion Exchange India Ltd.",
          when: "Dec 2024 – Jan 2025",
          points: ["Coordinated business partner communications and order confirmations, improving accuracy across stakeholder interactions."],
        },
      ],
    },
    {
      id: "circuit",
      name: "Circuit Gym",
      domain: "Tech & Automation",
      type: "Tech",
      color: "#14b8a6",
      icon: "chip", medal: "Circuit Badge",
      intro: "A business mind that can also build, using AI-assisted development to ship real tools.",
      moves: ["Microsoft Excel (Certified)", "Tableau", "MS Office Suite", "Python (Foundational)", "AI-assisted Development", "Browser Extensions"],
      battles: [
        {
          role: "Independent Builder",
          org: "GitHub — chennuru-tejith",
          when: "2026",
          points: [
            "Shipped browser extensions for AI-chat productivity (auto-resume queues, chat recovery) and outreach automation.",
            "Built a multi-engine stock-screening indicator suite for the Indian market (NSE/BSE) on TradingView.",
            "See Selected Work for every project.",
          ],
        },
      ],
    },
  ],

  // ---------- Selected Work (projects) ----------
  // Add "live" URLs for your Lovable projects when published.
  projects: [
    {
      id: "reachly",
      name: "Reachly — AI Networking & Outreach Strategist",
      types: ["Comms", "Tech"],
      blurb: "Discover the right people, send personalized outreach, and land internships, jobs and referrals without the spam. Built with Lovable.",
      moves: ["People Discovery", "Personalized Outreach", "Referral Strategy"],
      stats: { Impact: 85, Complexity: 75, Polish: 85 },
      repo: "",
      live: "https://connect-growthapp.lovable.app/",
    },
    {
      id: "queuebit",
      name: "ChatQueue AI",
      types: ["Tech", "Productivity"],
      blurb: "A local-first browser extension that queues prompts, auto-saves drafts, watches AI rate limits and resumes your chat the moment the agent is ready.",
      moves: ["Auto-Resume", "Draft Autosave", "Composer Sync", "Rate-Limit Watch"],
      stats: { Impact: 80, Complexity: 70, Polish: 75 },
      repo: "https://github.com/chennuru-tejith/Chat-Queue-AI",
      live: "",
    },
    {
      id: "queuebolt",
      name: "ChatQueue AI — Recycle Hub",
      types: ["Tech", "Productivity"],
      blurb: "v2 of ChatQueue AI: adds a recycle bin for deleted AI chats, automatic local chat backups and a multi-platform auto-resume queue (Claude, ChatGPT, Gemini, DeepSeek).",
      moves: ["Chat Recovery", "Local Backup", "Auto-Submit", "Multi-Platform"],
      stats: { Impact: 88, Complexity: 82, Polish: 80 },
      repo: "https://github.com/chennuru-tejith/Claude-Auto-Resume-Recycle-Bot",
      live: "",
    },
    {
      id: "candlox",
      name: "Indian Stock Analyzer",
      types: ["Finance", "Tech"],
      blurb: "A TradingView indicator & screener suite for NSE/BSE and NIFTY/BANKNIFTY options — 13 confluence engines, a live telemetry dashboard and a backtest companion with ATR-based risk management.",
      moves: ["Trend Engine", "VWAP Bands", "Smart-Money Scan", "Backtest"],
      stats: { Impact: 78, Complexity: 92, Polish: 72 },
      repo: "https://github.com/chennuru-tejith/Indian-Stock-Analyzer",
      live: "",
    },
    {
      id: "scoutling",
      name: "Outreach CRM & AI Lead Scout",
      types: ["Comms", "Tech"],
      blurb: "An AI-powered outreach CRM and Chrome extension for job seekers — lead tracking, pitch & cover-letter generator, resume ATS optimizer and a mock-interview simulator.",
      moves: ["Lead Scout", "Pitch Writer", "ATS Check", "Mock Interview"],
      stats: { Impact: 85, Complexity: 80, Polish: 74 },
      repo: "https://github.com/chennuru-tejith/Internship-Outreach",
      live: "",
    },
    {
      id: "notewing",
      name: "Send-A-Note — LinkedIn AI Smart Writer",
      types: ["Comms"],
      blurb: "A Chrome extension spec + build that writes personalized LinkedIn connection notes and messages right inside LinkedIn — no copy-pasting.",
      moves: ["Profile Parse", "Smart Note", "Inline Inject"],
      stats: { Impact: 70, Complexity: 65, Polish: 70 },
      repo: "https://github.com/chennuru-tejith/Send-A-Note",
      live: "",
    },
    {
      id: "prismo",
      name: "Personal Portfolio (v1)",
      types: ["Design", "Tech"],
      blurb: "My first portfolio — glassmorphism UI, particle canvas, an interactive terminal and live GitHub stats. The first version of my personal site.",
      moves: ["Glass UI", "Particle Field", "Terminal CLI"],
      stats: { Impact: 60, Complexity: 60, Polish: 78 },
      repo: "https://github.com/chennuru-tejith/Personal-Portfolio-Website",
      live: "",
    },
  ],

  // ---------- Used by the Quick View (recruiter résumé) ----------
  experience: [
    {
      role: "Operations Intern",
      org: "Round Table India — Hyderabad Titans Round Table Charitable Trust",
      when: "Jun 2026 – Jul 2026 · Hyderabad",
      points: [
        "Monitored on-site execution of a ₹4 Cr CSR-funded government school construction project (MPPS & ZPHS Integrated School, Phase II) across 23 site visits over 7 weeks, tracking progress against sanctioned drawings.",
        "Tracked CSR fund utilisation against the sanctioned budget and co-drafted progress-and-spend updates for CSR sponsor VST Industries Ltd., including a live sponsor update call.",
        "Verified contractor-reported material stock and spend figures against supervisor records, catching and resolving a reporting discrepancy before it reached the sponsor.",
      ],
    },
    {
      role: "Project Management Intern",
      org: "Dr. Reddy's Laboratories Ltd.",
      when: "Jun 2025 – Jul 2025 · Hyderabad",
      points: [
        "Conducted employee cost analysis across FY2021–FY2025, tracking trends in salaries, share-based payments, and welfare expenses to support cost-optimization discussions.",
        "Prepared structured management reports from multi-year workforce data, enabling leadership decisions on headcount budgeting and welfare spending.",
        "Strengthened financial data interpretation, cost analysis, and reporting using MS Office Suite.",
      ],
    },
    {
      role: "Finance Intern",
      org: "Ion Exchange India Ltd.",
      when: "Dec 2024 – Jan 2025 · Hyderabad",
      points: [
        "Streamlined daily transaction processing, improving departmental workflow efficiency and reducing documentation backlogs.",
        "Coordinated business partner communications and order confirmations, improving accuracy across stakeholder interactions.",
        "Standardized vendor records and aligned internal financial documentation, enhancing data consistency and audit readiness.",
      ],
    },
  ],

  leadership: [
    { role: "Head of Outreach", org: "ZAMAC — The Marketing Club, JGBS", when: "Feb 2026 – Present" },
    { role: "Member, Student Grievance Redressal Committee", org: "Food & Mess Committee, JGBS", when: "Aug 2026 – Present" },
    { role: "Student Representative, COGSASH", org: "O.P. Jindal Global University", when: "Nov 2025 – Present" },
    { role: "Member, Election Commission", org: "Jindal Global Business School", when: "Apr 2025 – Present" },
    { role: "Director", org: "JGU Entrepreneurship Club (200+ members)", when: "Feb 2026 – May 2026" },
  ],

  skills: [
    { group: "Finance & Analytics", icon: "coin", items: ["Financial Analysis", "Cost Analysis", "Budgeting", "Bookkeeping", "Financial Reporting", "Data Interpretation"] },
    { group: "Technology", icon: "chip", items: ["Microsoft Excel (Certified)", "MS Office Suite", "PowerPoint", "Tableau", "Python (Foundational)", "AI-assisted Development"] },
    { group: "Core Competencies", icon: "crown", items: ["Strategic Communication", "Stakeholder Management", "Report Writing", "Cross-functional Coordination", "Leadership"] },
  ],

  education: [
    {
      degree: "Integrated BBA (Hons.) + MBA, Business Administration & Management",
      school: "O.P. Jindal Global University (JGU), Sonipat, Haryana",
      when: "Aug 2024 – Aug 2029",
      score: "CGPA 7.9 / 8.00",
    },
    { degree: "Class XII, Commerce (MEC)", school: "Avinash College of Commerce, Hyderabad", when: "Apr 2024", score: "88.4%" },
    { degree: "Class X", school: "Geetanjali Olympiad High School, Hyderabad", when: "May 2022", score: "93.1%" },
  ],

  achievements: [
    { year: "2026", icon: "medal", text: "Batch Rank 3 and Certificate of Appreciation for Peer Support & Voluntary Contribution — JGU University Day." },
    { year: "2025", icon: "trophy", text: "Best Leader, Best All-Rounder and Rank 2 in IBM Batch — JGU University Day." },
    { year: "2025", icon: "star", text: "Certificate of Appreciation for volunteer leadership — JGU Alumni Day." },
    { year: "2024", icon: "scroll", text: "Letter of Appreciation for Exemplary Academic Performance." },
    { year: "2024", icon: "pillar", text: "Letter of Appreciation for the inauguration of India's First Constitution Museum & the National Convention on the Constitution of India." },
  ],

  certifications: [{ name: "Excel Skills for Business: Intermediate I", issuer: "Coursera · Macquarie University" }],

  // ---------- How I Work: each principle is backed by real evidence ----------
  principles: [
    {
      title: "Verify before you report",
      text: "Numbers that reach a sponsor or a manager carry my name, so I check them against the source first.",
      proof: "Caught a contractor's stock-and-spend discrepancy against supervisor records and resolved it before it reached the CSR sponsor.",
      where: "Round Table India · 2026",
    },
    {
      title: "Be there in person",
      text: "Progress reports are only as good as the person who checked the site.",
      proof: "Made 23 site visits in 7 weeks to monitor a ₹4 Cr government-school build against its sanctioned drawings.",
      where: "Round Table India · 2026",
    },
    {
      title: "Answer to whoever funds the work",
      text: "Clear, regular updates are how you keep the trust of the people paying for the work.",
      proof: "Co-drafted progress-and-spend updates for VST Industries and joined the live sponsor update call.",
      where: "Round Table India · 2026",
    },
    {
      title: "Earn trust, then keep it",
      text: "Responsibility is given to people who have handled it well before.",
      proof: "Elected student representative on JGU's Gender Sensitisation Committee, and trusted to run fair, transparent student elections.",
      where: "O.P. Jindal Global University · 2025–now",
    },
  ],

  // ---------- Research & Writing ----------
  // Add entries like this (newest first). "url" can be an external link or a PDF in assets/papers/.
  // {
  //   kind: "Research paper",            // or "Case study", "Essay", "Blog"
  //   title: "Title of the paper",
  //   venue: "Course / journal / blog name",
  //   date: "Nov 2026",
  //   summary: "Two-line abstract.",
  //   url: "assets/papers/my-paper.pdf",
  // },
  writing: [],

  // ---------- Recommendations ----------
  // Only add recommendations you've received in writing, with permission to publish.
  // {
  //   quote: "What they wrote about you.",
  //   name: "Dr. Firstname Lastname",
  //   role: "Professor of Finance",
  //   org: "Jindal Global Business School",
  //   relation: "Taught Tejith Corporate Finance, 2025",
  //   link: "https://www.linkedin.com/in/their-profile",   // lets recruiters verify
  // },
  recommendations: [],

  // ---------- Availability (confirmed by Tejith) ----------
  availability: {
    windows: ["December – January", "June – July"],
    type: "Internship · in person",
    roles: ["Finance", "Operations & Project Management", "Consulting & Strategy", "Marketing & Partnerships"],
    locations: "Hyderabad · Anywhere in India",
    response: "Within 48 hours",
  },

  // Programme timeline for the progress bar (from the CV: Aug 2024 – Aug 2029)
  programme: { name: "Integrated BBA (Hons.) + MBA", start: "2024-08-01", end: "2029-08-31" },

  // ---------- Abilities (who I am) vs Moves (what I use) ----------
  abilities: [
    { name: "Ownership", proof: "Monitored a ₹4 Cr build on site across 23 visits in 7 weeks." },
    { name: "Verification", proof: "Caught a reporting discrepancy before it reached the sponsor." },
    { name: "Stakeholder trust", proof: "Elected student representative; trusted to administer student elections." },
    { name: "Clear reporting", proof: "Wrote management reports and co-drafted sponsor updates." },
    { name: "Builder's initiative", proof: "Built a live outreach app and AI-chat tools alongside the degree." },
  ],
  moves: [
    { name: "Microsoft Excel", level: "Certified · Intermediate I" },
    { name: "Financial Analysis" },
    { name: "Cost Analysis" },
    { name: "Budgeting & Tracking" },
    { name: "Financial Reporting" },
    { name: "Tableau" },
    { name: "PowerPoint" },
    { name: "MS Office Suite" },
    { name: "Python", level: "Foundational" },
    { name: "AI-assisted Development" },
  ],

  // ---------- Journey map: where the work happened ----------
  places: [
    { city: "Sonipat", state: "Haryana", lat: 28.99, lon: 77.02, items: ["O.P. Jindal Global University: BBA + MBA (2024–2029)", "Head of Outreach, ZAMAC", "Director, JGU Entrepreneurship Club", "Student Representative, COGSASH", "Election Commission & Grievance Committee"] },
    { city: "Hyderabad", state: "Telangana", lat: 17.39, lon: 78.49, items: ["Operations Intern, Round Table India (2026)", "Project Management Intern, Dr. Reddy's (2025)", "Finance Intern, Ion Exchange India (2024–25)", "Schooling: Class X & XII"] },
  ],

  // ---------- Before → after, per internship (from CV results) ----------
  outcomes: {
    "Operations Intern": { before: "Contractor-reported stock and spend figures going to the sponsor unchecked.", after: "Figures verified against supervisor records; a discrepancy was resolved before the sponsor update." },
    "Project Management Intern": { before: "Five years of workforce cost data (FY2021–FY2025) spread across records.", after: "Structured management reports supporting decisions on headcount budgeting and welfare spending." },
    "Finance Intern": { before: "Documentation backlogs and inconsistent vendor records.", after: "Streamlined daily transaction processing; standardized, audit-ready vendor records." },
  },

  // ---------- Skill filter: which disciplines each item proves ----------
  // ledger = Finance, blueprint = Operations, summit = Leadership, signal = Communication, circuit = Tech
  skillTags: {
    "Operations Intern": ["blueprint", "ledger", "signal"],
    "Project Management Intern": ["ledger", "blueprint"],
    "Finance Intern": ["ledger", "signal"],
    "Head of Outreach": ["signal", "summit"],
    "Member, Student Grievance Redressal Committee": ["summit"],
    "Student Representative, COGSASH": ["summit"],
    "Member, Election Commission": ["summit"],
    "Director": ["summit"],
    reachly: ["signal", "circuit"],
    queuebit: ["circuit"],
    queuebolt: ["circuit"],
    candlox: ["ledger", "circuit"],
    scoutling: ["signal", "circuit"],
    notewing: ["signal", "circuit"],
    prismo: ["circuit"],
  },
  achievementTags: [["summit"], ["summit"], ["summit"], [], ["signal"]],

  // ---------- Recruiter Q&A (drafted from the CV — edit to your own words) ----------
  faq: [
    { q: "What do you bring to a team?", a: "Ownership of the details. At Round Table India I monitored a ₹4 Cr build across 23 site visits and checked contractor figures against supervisor records before they went to the sponsor." },
    { q: "How do you handle numbers that don't add up?", a: "I go back to the source. When contractor-reported stock and spend didn't match supervisor records, I traced the gap and got it resolved before the sponsor update." },
    { q: "Can you lead people?", a: "Yes. I directed programming for a 200+ member entrepreneurship club, I lead external outreach for the marketing club, and I was elected to a university committee." },
    { q: "Why business and technology together?", a: "I study business, but I like building the tools myself: a live outreach platform, AI-chat utilities and a stock-screening suite, all on my GitHub." },
    { q: "What are you looking for?", a: "An internship in finance, operations, consulting or marketing, in December–January or June–July, where I can own a real piece of work and be measured on the result." },
  ],
};
