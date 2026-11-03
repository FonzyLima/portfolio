import {
  SiDjango,
  SiDocker,
  SiFirebase,
  SiGit,
  SiGithub,
  SiGitlab,
  SiLaravel,
  SiMongodb,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiOpenai,
  SiPostgresql,
  SiPostman,
  SiReact,
  SiSupabase,
  SiSymfony,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
} from "react-icons/si";
import {
  TbApi,
  TbBrandReactNative,
  TbDatabaseSearch,
  TbLink,
  TbSparkles,
  TbWaveSine,
} from "react-icons/tb";

// LangChain, Anthropic and ElevenLabs have no brand icon in react-icons 4.x,
// so they use the closest generic Tabler icon.
//
// `color` is the brand colour used by the colourful chip styles. Brands whose
// mark is black or near-black (Next.js, Django, GitHub, Vercel, OpenAI, ...)
// have no colour and fall back to the text colour so they work in dark mode.
export const technicalSkills = [
  {
    id: "frontend",
    category: "Frontend & Mobile",
    short: "Frontend",
    description: "Responsive web apps and cross-platform mobile experiences.",
    skills: [
      { name: "React", icon: SiReact, color: "#149ECA" },
      { name: "Next.js", icon: SiNextdotjs },
      { name: "React Native", icon: TbBrandReactNative, color: "#149ECA" },
      { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
      { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4" },
    ],
  },
  {
    id: "ai",
    category: "AI & Automation",
    short: "AI",
    description: "LLM-powered features, retrieval pipelines and voice.",
    skills: [
      { name: "OpenAI API", icon: SiOpenai },
      { name: "LangChain", icon: TbLink },
      { name: "Anthropic / Claude", icon: TbSparkles, color: "#D97757" },
      { name: "RAG", icon: TbDatabaseSearch },
      { name: "ElevenLabs", icon: TbWaveSine },
    ],
  },
  {
    id: "backend",
    category: "Backend & APIs",
    short: "Backend",
    description: "Services, APIs and the business logic behind them.",
    skills: [
      { name: "Node.js", icon: SiNodedotjs, color: "#5FA04E" },
      { name: "Django", icon: SiDjango },
      { name: "REST APIs", icon: TbApi },
      { name: "Laravel", icon: SiLaravel, color: "#FF2D20" },
      { name: "Symfony", icon: SiSymfony },
    ],
  },
  {
    id: "data",
    category: "Databases & Cloud Data",
    short: "Data",
    description: "Relational, document and realtime data stores.",
    skills: [
      { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
      { name: "MySQL", icon: SiMysql, color: "#4479A1" },
      { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
      { name: "Firebase", icon: SiFirebase, color: "#FFA000" },
      { name: "Supabase", icon: SiSupabase, color: "#3FCF8E" },
    ],
  },
  {
    id: "devops",
    category: "DevOps & Tools",
    short: "DevOps",
    description: "Version control, containers, deploys and API testing.",
    skills: [
      { name: "Git", icon: SiGit, color: "#F05032" },
      { name: "GitHub", icon: SiGithub },
      { name: "GitLab", icon: SiGitlab, color: "#FC6D26" },
      { name: "Docker", icon: SiDocker, color: "#2496ED" },
      { name: "Vercel", icon: SiVercel },
      { name: "Postman", icon: SiPostman, color: "#FF6C37" },
    ],
  },
];
