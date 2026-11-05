export const profile = {
  name: "Alfonso Lima",
  title: "Full Stack & AI Engineer",
  location: "Manila, Philippines",
  email: "alfonsogvlima@gmail.com",
  // Home "Who I am" lead: what I build. Keep it distinct from `summary`.
  intro:
    "I build web, mobile, and AI apps end to end, from React Native and Next.js front ends to Django and Node.js APIs, through to App Store and Google Play releases.",
  // About page lead: the story so far. Keep it distinct from `intro`.
  summary:
    "I've spent 4 years building software. Right now I'm an AI Engineer at Tenext AI, building a Next.js platform for AI voice calls with ElevenLabs. Before that, I spent two years at The Mobile App Factory shipping React Native and Django apps like Natasha, Filicoola, and HiDoc, and I was the founding engineer at Serbiz.",
  education:
    "I graduated from De La Salle University - Manila with a BS in Computer Science, specializing in Software Technology with a minor in Social Technopreneurship.",
  // Short forms of `education` for the fact lists on the home and About pages.
  degree: "BS Computer Science",
  school: "De La Salle University - Manila",
  // Marquee rows: shown space-separated, read to screen readers as a list.
  skillsPrimary: ["Backend", "Frontend", "Mobile", "Web", "AI", "Product development"],
  skillsSecondary: [
    "React Native", "TypeScript", "Next.js", "Django", "Node.js", "Firebase",
    "REST APIs", "Figma", "LLMs", "OpenAI", "Claude", "ElevenLabs",
  ],
};

export const experiences = [
  {
    company: "Tenext AI",
    location: "Rockwell, Makati City",
    role: "AI Engineer",
    period: "May 2026 - Present",
    highlights: [
      "Built a full-stack Next.js platform where users create, customize, and manage AI voice calls.",
      "Integrated ElevenLabs for realistic AI voice generation based on user-created scripts and call scenarios.",
      "Built backend APIs for call creation, script management, voice generation requests, and call flow configuration.",
    ],
  },
  {
    company: "The Mobile App Factory",
    location: "Loyola Heights, Quezon City",
    role: "Software Engineer",
    period: "June 2024 - May 2026",
    highlights: [
      "Built and maintained full-stack web and mobile applications using React Native and Django across frontend, backend, and API work.",
      "Took features from development through testing and production for apps including Natasha, Filicoola, and HiDoc.",
      "Ran App Store and Google Play releases end to end, including store requirements.",
    ],
  },
  {
    company: "Serbiz",
    location: "Taft, Manila City",
    role: "Founding Engineer",
    period: "August 2023 - September 2024",
    highlights: [
      "Led development of a flagship web application using Next.js, Node.js, and Firebase.",
      "Designed and implemented a cross-platform mobile application with React Native and Django.",
    ],
  },
  {
    company: "WRSHealth",
    location: "Goshen, New York City",
    role: "Software Engineer",
    period: "July 2023 - October 2023",
    highlights: [
      "Implemented new features and resolved bugs in the company's web application.",
      "Used Laravel and Symfony to improve application performance and user experience.",
    ],
  },
  {
    company: "Willis Towers Watson",
    location: "Bonifacio Global City, Taguig City",
    role: "DevOps Intern",
    period: "April 2022 - October 2022",
    highlights: [
      "Led development of an internal application that organized team DevOps processes using .NET, React, and Azure.",
      "Designed the UI prototype for the Service Management Application in Figma.",
    ],
  },
];

export const projects = [
  {
    name: "925 Wear",
    date: "October 2023",
    category: "Website",
    image: "/925.png",
    description:
      "A storefront website for a clothing studio, built around clean product browsing and a lightweight brand experience.",
    link: "https://925studio.online",
    tools: ["Next.js", "Tailwind CSS", "Vercel"],
    featured: true,
  },
  {
    name: "Mutya (2D Game)",
    date: "December 2022",
    category: "Game",
    image: "/mutya.png",
    description:
      "A 2D narrative game project with custom scenes, character interactions, and a browser-playable release.",
    link: "https://alfygl.itch.io/mutya",
    git: "https://github.com/FonzyLima/mutya",
    tools: ["Unity", "C#", "Itch.io"],
    featured: true,
  },
  {
    name: "Bok Fried Chicken",
    date: "December 2021",
    category: "Website",
    image: "/bok.png",
    description:
      "A restaurant website designed to present the brand, menu, and customer-facing information in a fast, direct layout.",
    link: "https://bokfriedchicken.com",
    tools: ["Next.js", "CSS", "Vercel"],
    featured: true,
  },
  {
    name: "Blitz (Wordle Discord Bot)",
    date: "March 2022",
    category: "Bot",
    image: "/blitz.png",
    description:
      "A Discord bot that brings a Wordle-style game loop into servers with automated prompts and player interaction.",
    git: "https://github.com/FonzyLima/blitz-bot",
    tools: ["Python", "Discord.py"],
    featured: true,
  },
  {
    name: "Serbiz Mobile App",
    date: "September 2024",
    category: "Mobile App",
    image: "/serbiz.png",
    description:
      "A cross-platform mobile application for service discovery and booking flows, built with a React Native frontend and backend APIs.",
    tools: ["React Native", "Django", "REST APIs"],
    featured: true,
  },
  {
    name: "Qup",
    date: "May 2023",
    category: "Website",
    image: "/qup.png",
    description:
      "A web project focused on clear product presentation, responsive layouts, and a concise user flow.",
    tools: ["React", "CSS"],
    featured: false,
  },
  {
    name: "Ashure",
    date: "April 2023",
    category: "Website",
    image: "/Ashure.png",
    description:
      "A polished web interface project with brand-forward visuals, structured content sections, and responsive presentation.",
    tools: ["React", "CSS"],
    featured: false,
  },
];

// "GitHub activity" (last row of Technical skills on the About page, plus the
// Contributions line on the trainer card). Just paste links, no token needed.
// Refreshes every hour.
export const github = {
  // Profile for the contribution graph.
  profile: "https://github.com/FonzyLima",
  // Repos linked under the graph, in this order. Any public repo works, even
  // one from another account. Leave the list empty to hide them.
  repos: [
    "https://github.com/FonzyLima/mutya",
    "https://github.com/FonzyLima/blitz-bot",
    "https://github.com/FonzyLima/FonzyLima.github.io",
  ],
};

// Footer visitor counter ("Trainers met"). A hits.sh badge link: the counter
// is keyed by the path, so any link works and nothing needs an account. Leave
// it empty to hide the counter. See src/app/lib/visitors.js.
export const visitors = {
  counter: "https://hits.sh/github.com/FonzyLima/portfolio.svg",
};

// Shared by the footer and the mobile menu.
export const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/alfonso-lima/" },
  { label: "GitHub", href: "https://github.com/FonzyLima" },
  { label: "Discord", href: "https://discord.com/users/702050752490897479" },
  { label: "Instagram", href: "https://www.instagram.com/fonzylima/" },
];
