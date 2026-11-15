/** Static identity used across metadata, JSON-LD, footer and contact. */
export const site = {
  name: "Debjyoti Sarkar",
  shortName: "Deb",
  role: "Software Engineer",
  headline: "I build secure, real-time systems for safety, finance and accessibility.",
  description:
    "Debjyoti Sarkar (Deb) — final-year B.Tech CSE (Data Science) student building secure, real-time systems across full-stack mobile, cloud backends, DevOps and embedded/IoT. SIH 2025 National Finalist.",
  location: "Bangalore, India",
  email: "debjyoti.sarkar257@gmail.com",
  phone: { display: "+91 72097 99940", href: "tel:+917209799940" },
  resumePath: "/resume.pdf",
  socials: {
    github: "https://github.com/Debjyoti-sarkar",
    linkedin: "https://www.linkedin.com/in/debjyotisarkar13",
  },
  education: {
    school: "SJB Institute of Technology",
    degree: "B.Tech in Computer Science and Engineering (Data Science)",
  },
} as const;

export const navItems = [
  { label: "About", href: "/#about" },
  { label: "Projects", href: "/projects" },
  { label: "Experience", href: "/#experience" },
  { label: "Notes", href: "/notes" },
  { label: "Contact", href: "/#contact" },
] as const;

/** Human labels for project categories stored in the database. */
export const categoryLabels: Record<string, string> = {
  "social-impact": "Social impact",
  fintech: "Fintech",
  "ai-ml": "AI / ML",
  iot: "IoT & embedded",
  mobile: "Mobile",
  web: "Web",
};
