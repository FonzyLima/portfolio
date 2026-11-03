export const profile = {
  name: "Alfonso Lima",
  title: "Full Stack Software Developer",
  location: "Manila, Philippines",
  email: "alfonsogvlima@gmail.com",
  summary:
    "Software Engineer with 4 years of professional experience building mobile, web, and AI-enabled applications using React Native, TypeScript, Next.js, Django, Node.js, Firebase, and REST APIs.",
  intro:
    "I build production-ready mobile, web, and AI-enabled applications across the full stack, from clean React Native and Next.js interfaces to backend APIs, release workflows, and shipped iOS/Android apps.",
  education:
    "I graduated from De La Salle University - Manila with a BS in Computer Science, specializing in Software Technology with a minor in Social Technopreneurship.",
  // Short forms of `education` for compact fact lists on the About page.
  degree: "BS Computer Science",
  school: "De La Salle University - Manila",
  skillsPrimary: "Backend Frontend Mobile Web AI Product Development\u00a0",
  skillsSecondary:
    "React Native TypeScript Next.js Django Node.js Firebase REST APIs Figma LLMs OpenAI Claude\u00a0",
};

// `badge` picks the trainer-card badge icon for that job: spark, phone, rocket,
// heart or gear (see BADGE_ICONS in components/TrainerCard.js). Leave it out
// to fall back to the company's initials.
export const experiences = [
  {
    company: "Tenext AI",
    badge: "spark",
    location: "Rockwell, Makati City",
    role: "AI Engineer",
    period: "May 2026 - Present",
    highlights: [
      "Developed a full-stack AI voice call platform in Next.js for creating, customizing, and managing AI-generated voice call experiences.",
      "Integrated ElevenLabs for realistic AI voice generation based on user-created scripts and call scenarios.",
      "Built backend APIs for call creation, script management, voice generation requests, and call flow configuration.",
    ],
  },
  {
    company: "The Mobile App Factory",
    badge: "phone",
    location: "Loyola Heights, Quezon City",
    role: "Software Engineer",
    period: "June 2024 - May 2026",
    highlights: [
      "Built and maintained full-stack web and mobile applications using React Native and Django across frontend, backend, and API work.",
      "Took features from development through testing and production for apps including Natasha, Filicoola, and HiDoc.",
      "Managed App Store and Google Play releases, updates, and release requirements.",
    ],
  },
  {
    company: "Serbiz",
    badge: "rocket",
    location: "Taft, Manila City",
    role: "Founding Engineer",
    period: "August 2023 - September 2024",
    highlights: [
      "Led development for a flagship web application using Next.js, Node.js, and Firebase.",
      "Designed and implemented a cross-platform mobile application with React Native and Django.",
    ],
  },
  {
    company: "WRSHealth",
    badge: "heart",
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
    badge: "gear",
    location: "Bonifacio Global City, Taguig City",
    role: "DevOps Intern",
    period: "April 2022 - October 2022",
    highlights: [
      "Led development for an internal application that organized team DevOps processes using .NET, ReactJS, and Azure technologies.",
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
    tools: ["Python", "Discord.py", "GitHub"],
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
    tools: ["React", "CSS", "Responsive UI"],
    featured: false,
  },
  {
    name: "Ashure",
    date: "April 2023",
    category: "Website",
    image: "/Ashure.png",
    description:
      "A polished web interface project with brand-forward visuals, structured content sections, and responsive presentation.",
    tools: ["React", "CSS", "UI Design"],
    featured: false,
  },
];

// "GitHub Activity" (last row of Technical Skills on the About page, plus the
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

// Shared by the footer and the mobile menu.
export const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/alfonso-lima/" },
  { label: "GitHub", href: "https://github.com/FonzyLima" },
  { label: "Discord", href: "https://discord.com/users/702050752490897479" },
  { label: "Instagram", href: "https://www.instagram.com/fonzylima/" },
];
