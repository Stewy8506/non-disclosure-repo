import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="bg-background">
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Footer />
    </main>
  );
}
