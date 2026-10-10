// ============================================================
//  ALL PORTFOLIO CONTENT LIVES HERE.
//  Edit this file to update the site, no other code changes needed.
// ============================================================

window.PORTFOLIO = {
  // Your live website address once deployed, e.g. "https://tejith.in" (enables absolute share links + sitemap)
  siteUrl: "",

  profile: {
    name: "Chennuru Tejith",
    shortName: "Tejith",
    title: "Business Strategist in Training",
    tagline: "BBA + MBA @ O.P. Jindal Global University · Finance · Operations · Leadership, and a builder of AI tools on the side.",
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
      { label: "Internships", value: "3", story: "Round Table India, Dr. Reddy's and Ion Exchange, 2024 to 2026." },
      { label: "CSR project monitored", value: "₹4 Cr", story: "Monitored on site across 23 visits in 7 weeks." },
      { label: "Member club directed", value: "200+", story: "JGU Entrepreneurship Club, Feb to May 2026." },
      { label: "CGPA", value: "7.9/8", story: "BBA + MBA, O.P. Jindal Global University." },
    ],
    // The quote shown between the Gyms and the Journey. Wrap words in *stars* to set them in italic gold.
    quote: {
      text: "Loyalty works both ways. *If you ask for it, be ready to give it.*",
      by: "What I believe",
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
      color: "#c8a96b",
      icon: "coin", medal: "Ledger Badge",
      intro: "Numbers tell stories. I track every rupee and explain every trend.",
      moves: ["Financial Analysis", "Cost Analysis", "Budgeting", "Bookkeeping", "Financial Reporting", "Data Interpretation"],
      battles: [
        {
          role: "Project Management Intern",
          org: "Dr. Reddy's Laboratories Ltd.",
          when: "Jun 2025 to Jul 2025 · Hyderabad",
          points: [
            "Conducted employee cost analysis across FY2021 to FY2025, tracking trends in salaries, share-based payments, and welfare expenses to support cost-optimization discussions.",
            "Prepared structured management reports from multi-year workforce data, enabling leadership decisions on headcount budgeting and welfare spending.",
          ],
        },
        {
          role: "Finance Intern",
          org: "Ion Exchange India Ltd.",
          when: "Dec 2024 to Jan 2025 · Hyderabad",
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
      color: "#d08a64",
      icon: "blueprint", medal: "Blueprint Badge",
      intro: "Plans are easy. Execution on the ground is the real battle.",
      moves: ["On-ground Monitoring", "Budget Tracking", "Sponsor Reporting", "Vendor Verification", "Cross-functional Coordination"],
      battles: [
        {
          role: "Operations Intern",
          org: "Round Table India, Hyderabad Titans Round Table Charitable Trust",
          when: "Jun 2026 to Jul 2026 · Hyderabad",
          points: [
            "Monitored on-site execution of a ₹4 Cr CSR-funded government school construction project (MPPS & ZPHS Integrated School, Phase II) across 23 site visits over 7 weeks.",
            "Tracked CSR fund utilisation against the sanctioned budget and co-drafted progress-and-spend updates for CSR sponsor VST Industries Ltd., including a live sponsor update call.",
            "Verified contractor-reported material stock and spend against supervisor records, catching and resolving a reporting discrepancy before it reached the sponsor.",
          ],
        },
      ],
    },
    {
      id: "summit",
      name: "Summit Gym",
      domain: "Leadership & Governance",
      type: "Leadership",
      color: "#9d8cc9",
      icon: "crown", medal: "Summit Badge",
      intro: "Leadership is learned by doing: through committees, clubs and communities.",
      moves: ["Leadership", "Institutional Governance", "Policy Deliberation", "Event Programming", "Mentorship"],
      battles: [
        {
          role: "Director",
          org: "JGU Entrepreneurship Club",
          when: "Feb 2026 to May 2026 · Sonipat",
          points: ["Oversaw entrepreneurial programming, mentorship activities, and startup events for a 200+ member student community."],
        },
        {
          role: "Student Representative, COGSASH",
          org: "O.P. Jindal Global University",
          when: "Nov 2025 to Present · Sonipat",
          points: ["Elected representative on JGU's Gender Sensitisation Committee: policy deliberations, awareness campaigns, and institutional governance."],
        },
        {
          role: "Member, Election Commission",
          org: "Jindal Global Business School (JGBS)",
          when: "Apr 2025 to Present · Sonipat",
          points: ["Administer student election processes ensuring compliance, transparency, and fair representation."],
        },
        {
          role: "Member, Student Grievance Redressal Committee",
          org: "Food & Mess Committee, JGBS",
          when: "Aug 2026 to Present · Sonipat",
          points: ["Represent student interests on food and mess service quality, handling grievance resolution and liaison with campus administration."],
        },
      ],
    },
    {
      id: "signal",
      name: "Signal Gym",
      domain: "Marketing & Communication",
      type: "Comms",
      color: "#c98c9b",
      icon: "signal", medal: "Signal Badge",
      intro: "A great idea is only as strong as the way you tell it.",
      moves: ["Strategic Communication", "Stakeholder Management", "Partnership Development", "Report Writing", "Public Outreach"],
      battles: [
        {
          role: "Head of Outreach",
          org: "ZAMAC, The Marketing Club, JGBS",
          when: "Feb 2026 to Present · Sonipat (member since Sep 2025)",
          points: ["Lead external partnership development and outreach strategy, managing stakeholder relationships and event visibility for the university's marketing club."],
        },
        {
          role: "Business Partner Communications",
          org: "Ion Exchange India Ltd.",
          when: "Dec 2024 to Jan 2025",
          points: ["Coordinated business partner communications and order confirmations, improving accuracy across stakeholder interactions."],
        },
      ],
    },
    {
      id: "circuit",
      name: "Circuit Gym",
      domain: "Tech & Automation",
      type: "Tech",
      color: "#7fae95",
      icon: "chip", medal: "Circuit Badge",
      intro: "A business mind that can also build, using AI-assisted development to ship real tools.",
      moves: ["Microsoft Excel (Certified)", "Tableau", "MS Office Suite", "Python (Foundational)", "AI-assisted Development", "Browser Extensions"],
      battles: [
        {
          role: "Independent Builder",
          org: "GitHub, chennuru-tejith",
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
      name: "Reachly: AI Networking & Outreach Strategist",
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
      name: "ChatQueue AI: Recycle Hub",
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
      blurb: "A TradingView indicator & screener suite for NSE/BSE and NIFTY/BANKNIFTY options: 13 confluence engines, a live telemetry dashboard and a backtest companion with ATR-based risk management.",
      moves: ["Trend Engine", "VWAP Bands", "Smart-Money Scan", "Backtest"],
      stats: { Impact: 78, Complexity: 92, Polish: 72 },
      repo: "https://github.com/chennuru-tejith/Indian-Stock-Analyzer",
      live: "",
    },
    {
      id: "scoutling",
      name: "Outreach CRM & AI Lead Scout",
      types: ["Comms", "Tech"],
      blurb: "An AI-powered outreach CRM and Chrome extension for job seekers: lead tracking, pitch & cover-letter generator, resume ATS optimizer and a mock-interview simulator.",
      moves: ["Lead Scout", "Pitch Writer", "ATS Check", "Mock Interview"],
      stats: { Impact: 85, Complexity: 80, Polish: 74 },
      repo: "https://github.com/chennuru-tejith/Internship-Outreach",
      live: "",
    },
    {
      id: "notewing",
      name: "Send-A-Note: LinkedIn AI Smart Writer",
      types: ["Comms"],
      blurb: "A Chrome extension spec + build that writes personalized LinkedIn connection notes and messages right inside LinkedIn, no copy-pasting.",
      moves: ["Profile Parse", "Smart Note", "Inline Inject"],
      stats: { Impact: 70, Complexity: 65, Polish: 70 },
      repo: "https://github.com/chennuru-tejith/Send-A-Note",
      live: "",
    },
    {
      id: "prismo",
      name: "Personal Portfolio (v1)",
      types: ["Design", "Tech"],
      blurb: "My first portfolio: glassmorphism UI, particle canvas, an interactive terminal and live GitHub stats. The first version of my personal site.",
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
      org: "Round Table India, Hyderabad Titans Round Table Charitable Trust",
      when: "Jun 2026 to Jul 2026 · Hyderabad",
      points: [
        "Monitored on-site execution of a ₹4 Cr CSR-funded government school construction project (MPPS & ZPHS Integrated School, Phase II) across 23 site visits over 7 weeks, tracking progress against sanctioned drawings.",
        "Tracked CSR fund utilisation against the sanctioned budget and co-drafted progress-and-spend updates for CSR sponsor VST Industries Ltd., including a live sponsor update call.",
        "Verified contractor-reported material stock and spend figures against supervisor records, catching and resolving a reporting discrepancy before it reached the sponsor.",
      ],
    },
    {
      role: "Project Management Intern",
      org: "Dr. Reddy's Laboratories Ltd.",
      when: "Jun 2025 to Jul 2025 · Hyderabad",
      points: [
        "Conducted employee cost analysis across FY2021 to FY2025, tracking trends in salaries, share-based payments, and welfare expenses to support cost-optimization discussions.",
        "Prepared structured management reports from multi-year workforce data, enabling leadership decisions on headcount budgeting and welfare spending.",
        "Strengthened financial data interpretation, cost analysis, and reporting using MS Office Suite.",
      ],
    },
    {
      role: "Finance Intern",
      org: "Ion Exchange India Ltd.",
      when: "Dec 2024 to Jan 2025 · Hyderabad",
      points: [
        "Streamlined daily transaction processing, improving departmental workflow efficiency and reducing documentation backlogs.",
        "Coordinated business partner communications and order confirmations, improving accuracy across stakeholder interactions.",
        "Standardized vendor records and aligned internal financial documentation, enhancing data consistency and audit readiness.",
      ],
    },
  ],

  leadership: [
    { role: "Head of Outreach", org: "ZAMAC, The Marketing Club, JGBS", when: "Feb 2026 to Present" },
    { role: "Member, Student Grievance Redressal Committee", org: "Food & Mess Committee, JGBS", when: "Aug 2026 to Present" },
    { role: "Student Representative, COGSASH", org: "O.P. Jindal Global University", when: "Nov 2025 to Present" },
    { role: "Member, Election Commission", org: "Jindal Global Business School", when: "Apr 2025 to Present" },
    { role: "Director", org: "JGU Entrepreneurship Club (200+ members)", when: "Feb 2026 to May 2026" },
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
      when: "Aug 2024 to Aug 2029",
      score: "CGPA 7.9 / 8.00",
    },
    { degree: "Class XII, Commerce (MEC)", school: "Avinash College of Commerce, Hyderabad", when: "Apr 2024", score: "88.4%" },
    { degree: "Class X", school: "Geetanjali Olympiad High School, Hyderabad", when: "May 2022", score: "93.1%" },
  ],

  // Add a scan to any honour with  image: "assets/proofs/your-file.jpg"  and it gets a "View certificate" button on the proof wall
  achievements: [
    { year: "2026", icon: "medal", text: "Batch Rank 3 and Certificate of Appreciation for Peer Support & Voluntary Contribution, JGU University Day." },
    { year: "2025", icon: "trophy", text: "Best Leader, Best All-Rounder and Rank 2 in IBM Batch, JGU University Day." },
    { year: "2025", icon: "star", text: "Certificate of Appreciation for volunteer leadership, JGU Alumni Day." },
    { year: "2024", icon: "scroll", text: "Letter of Appreciation for Exemplary Academic Performance." },
    { year: "2024", icon: "pillar", text: "Letter of Appreciation for the inauguration of India's First Constitution Museum & the National Convention on the Constitution of India." },
  ],

  certifications: [{ name: "Excel Skills for Business: Intermediate I", issuer: "Coursera · Macquarie University", verify: "https://www.linkedin.com/in/chennuru-tejith/details/certifications/" }],

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
      where: "O.P. Jindal Global University · 2025 to now",
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
  writing: [
    {
      kind: "Research paper",
      title: "From SEO to GEO: Navigating the Paradigm Shift from Search Engine Optimization to Generative Engine Optimization in the AI-First Search Era",
      venue: "Sole author · O.P. Jindal Global University",
      date: "2026",
      summary: "Argues that Generative Engine Optimization replaces SEO rather than evolving from it, and proposes the GEO Business Adoption Framework (GEO-BAF). Primary research compares how ChatGPT, Claude, Gemini, Grok and Perplexity choose and disclose their sources.",
      status: "In progress",
      url: "",
    },
  ],

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

  // ---------- Bios for the press kit and llms.txt (about 25 and 100 words) ----------
  bios: {
    short: "Chennuru Tejith is a BBA + MBA student at O.P. Jindal Global University with internships in operations, project management and finance, now writing a research paper on GEO.",
    long: "Chennuru Tejith is an integrated BBA (Hons.) + MBA student at O.P. Jindal Global University (2024 to 2029, CGPA 7.9/8), from Hyderabad. As an operations intern at Round Table India he monitored a ₹4 Cr CSR-funded government school build across 23 site visits in seven weeks, and caught a contractor reporting discrepancy before it reached the sponsor. He has also interned in project management at Dr. Reddy's Laboratories and in finance at Ion Exchange India. On campus he heads outreach for ZAMAC, sits on university committees and directed a 200+ member entrepreneurship club. He is researching Generative Engine Optimization.",
  },

  // ---------- Change log (newest first). Add a line whenever the site or your work changes ----------
  changelog: [
    { month: "Oct 2026", items: ["Site split into separate pages: Work, Arenas, Research, About, Ask and Contact", "Added an Ask page that answers questions about me from this site", "Added a press kit, a citation for the GEO paper and this change log", "Applied my paper's GEO Business Adoption Framework to the site", "Added a 60-second tour, a line-by-line reconciliation demo, a slider through the years, a proof wall, reading options and share cards for each page"] },
  ],


  // ---------- "Currently" line in the hero (leave a field empty to hide it) ----------
  currently: { working: "Generative Engine Optimization research paper", reading: "", learning: "" },

  // ---------- Off the clock ----------
  offClock: "Formula 1. I follow team strategy and race-day decisions.",

  // ---------- Portrait in the hero: put your photo in assets/ and its path here (empty = placeholder frame) ----------
  photo: "",

  // ---------- "What's new" strip ----------
  updates: [{ date: "Oct 2026", text: "Researching how AI search engines choose what to cite", link: "#research" }],

  // ---------- Booking link for "Book a 15-minute call" (e.g. a free Calendly link). Empty = email request instead ----------
  bookingUrl: "",

  // ---------- Visitor counter (optional). Set up a free GoatCounter site and put its code here, e.g. "tejith" ----------
  goatcounter: "",

  // ---------- Hidden details: hovering these words reveals a fact (all from the CV) ----------
  details: [
    { word: "O.P. Jindal Global University", fact: "CGPA 7.9 / 8.00 in the integrated BBA + MBA." },
    { word: "VST Industries", fact: "The CSR sponsor of the ₹4 Cr school build." },
    { word: "Hyderabad", fact: "Schooled here: Class X (93.1%) and Class XII (88.4%)." },
  ],

  // ============================================================
  //  Round 4 features
  // ============================================================

  // Your handwritten signature as an SVG file in assets/ (e.g. "assets/signature.svg").
  // Empty = an elegant script placeholder that "writes" itself.
  signature: "",

  // A short audio clip of you saying "Hi, I'm Tejith" (e.g. "assets/hello.mp3"). Empty = button hidden.
  voice: "",

  // One line about your hometown, shown on the map ("Home"). Empty = just the "Home" tag.
  homeNote: "",

  // GEO paper progress: one of "Research", "Draft", "Review", "Published"
  geoStage: "Research",

  // "A decision I'd make", DRAFT written from your principles; please review and rewrite in your words
  decision: {
    question: "A CSR sponsor asks: should we release the next tranche of funds for Phase III?",
    reasoning: [
      "Not on the progress report alone. First, match the reported spend against site records and supervisor logs.",
      "If they reconcile, release in stages tied to visible milestones, not in one lump.",
      "Report back to the sponsor on the same schedule, so trust is earned before it is asked for.",
    ],
    draft: true,
  },

  // Notes from the field, DRAFT from your CV; please review before sharing
  notes: [
    {
      title: "What 23 site visits taught me about reports",
      date: "Aug 2026",
      body: "A progress report is a claim, not a fact. Over seven weeks on a school construction site, I learned that the useful question is never 'what does the report say?' but 'what is it checked against?'. Drawings, supervisor records and the budget each tell part of the story. When one of them disagrees, that disagreement is the most valuable line in the report, and it is far cheaper to resolve before a sponsor reads it than after.",
      draft: true,
    },
  ],

  // Seasonal touches (month-day ranges, inclusive). Diwali moves every year, please confirm the date.
  seasons: [
    { from: "12-30", to: "01-02", greeting: "Happy New Year", accent: "#d8b4a0" },
    { from: "08-15", to: "08-15", greeting: "Happy Independence Day", accent: "#e0a07a" },
    { from: "11-07", to: "11-09", greeting: "Happy Diwali", accent: "#e8b06a" },
  ],

  // ---------- My research, applied to this site: GEO-BAF (status: "done" | "next") ----------
  geoBaf: [
    { phase: "Readiness audit", status: "done", detail: "Tested what an AI crawler sees without JavaScript. Before: almost nothing. After: about 970 words and 8 of 9 key facts on the home page, 9 of 9 on the text profile." },
    { phase: "Foundational signals", status: "done", detail: "Plain-HTML profile with question-led headings, llms.txt, ProfilePage / Person / FAQPage structured data, a visible last-updated date, and robots.txt that welcomes AI crawlers." },
    { phase: "Platform-specific calibration", status: "next", detail: "Once live: Bing Webmaster Tools (feeds ChatGPT search), Google Search Console (Gemini), and consistent facts across LinkedIn and GitHub for corroboration." },
    { phase: "Measurement and embedding", status: "next", detail: "Re-run the paper's own replication protocol on \"Who is Chennuru Tejith?\" across all five assistants, tracking inclusion, weighting and accuracy." },
  ],

  // ---------- Bookshelf (hidden until books are added) ----------
  // { title: "Book title", author: "Author", note: "One line on what it changed for me." }
  books: [],

  // ---------- Documents vault ----------
  documents: [
    { name: "Curriculum Vitae", type: "PDF", url: "assets/Chennuru_Tejith_CV.pdf" },
  ],

  // ---------- Case studies, one per internship (from CV facts; "takeaway" is drafted, edit freely) ----------
  cases: {
    "Project Management Intern": {
      context: "Dr. Reddy's Laboratories wanted a clearer view of five years of employee costs (FY2021 to FY2025) to support cost-optimization discussions.",
      actions: ["Analysed trends in salaries, share-based payments and welfare expenses across FY2021 to FY2025.", "Turned multi-year workforce data into structured management reports.", "Used the MS Office Suite for analysis and reporting."],
      outcome: "Reports that supported leadership decisions on headcount budgeting and welfare spending.",
      takeaway: "Data only helps a decision when it is structured around the question the decision-maker is asking.",
    },
    "Finance Intern": {
      context: "Ion Exchange India's finance team handled daily transactions, business-partner communication and vendor documentation.",
      actions: ["Streamlined daily transaction processing.", "Coordinated business-partner communications and order confirmations.", "Standardized vendor records and aligned internal financial documentation."],
      outcome: "Improved workflow efficiency, fewer documentation backlogs, and records that were more consistent and audit-ready.",
      takeaway: "Clean records upstream save hours of correction downstream.",
    },
  },

  // ---------- Availability (confirmed by Tejith) ----------
  availability: {
    windows: ["December to January", "June to July"],
    type: "Internship · in person",
    roles: ["Finance", "Operations & Project Management", "Consulting & Strategy", "Marketing & Partnerships"],
    locations: "Hyderabad · Anywhere in India",
    response: "Within 48 hours",
  },

  // Programme timeline for the progress bar (from the CV: Aug 2024 to Aug 2029)
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
    { city: "Sonipat", state: "Haryana", lat: 28.99, lon: 77.02, items: ["O.P. Jindal Global University: BBA + MBA (2024 to 2029)", "Head of Outreach, ZAMAC", "Director, JGU Entrepreneurship Club", "Student Representative, COGSASH", "Election Commission & Grievance Committee"] },
    { city: "Hyderabad", state: "Telangana", lat: 17.39, lon: 78.49, items: ["Operations Intern, Round Table India (2026)", "Project Management Intern, Dr. Reddy's (2025)", "Finance Intern, Ion Exchange India (Dec 2024 to Jan 2025)", "Schooling: Class X & XII"] },
  ],

  // ---------- Before → after, per internship (from CV results) ----------
  outcomes: {
    "Project Management Intern": { before: "Five years of workforce cost data (FY2021 to FY2025) spread across records.", after: "Structured management reports supporting decisions on headcount budgeting and welfare spending." },
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

  // ---------- Recruiter Q&A (drafted from the CV, edit to your own words) ----------
  faq: [
    { q: "Can you lead people?", a: "Yes. I directed programming for a 200+ member entrepreneurship club, I lead external outreach for the marketing club, and I was elected to a university committee." },
    { q: "Why business and technology together?", a: "I study business, but I like building the tools myself: a live outreach platform, AI-chat utilities and a stock-screening suite, all on my GitHub." },
    { q: "What are you looking for?", a: "An internship in finance, operations, consulting or marketing, in December to January or June to July, where I can own a real piece of work and be measured on the result." },
  ],
};
