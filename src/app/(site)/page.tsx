import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { Hero } from "@/components/sections/hero";
import { NotesPreview } from "@/components/sections/notes";
import { Skills } from "@/components/sections/skills";
import { Timeline } from "@/components/sections/timeline";

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <FeaturedProjects />
      <Skills />
      <Timeline />
      <NotesPreview />
      <Contact />
    </>
  );
}
