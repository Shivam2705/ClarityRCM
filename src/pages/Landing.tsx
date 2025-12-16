import { LandingNav } from "@/components/landing/LandingNav";
import { HeroSection } from "@/components/landing/HeroSection";
import { WorkflowSection } from "@/components/landing/WorkflowSection";
import { CapabilitiesSection } from "@/components/landing/CapabilitiesSection";
import { PersonaSection } from "@/components/landing/PersonaSection";
import { Footer } from "@/components/landing/Footer";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      <main>
        <HeroSection />
        <section id="workflow">
          <WorkflowSection />
        </section>
        <section id="capabilities">
          <CapabilitiesSection />
        </section>
        <section id="personas">
          <PersonaSection />
        </section>
      </main>
      <Footer />
    </div>
  );
}
