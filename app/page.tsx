import StatsSection from "@/components/stats-section";
import FeaturesSection from "@/components/features-section";
import { HeroHeader } from "@/components/header";
import HeroSection from "@/components/hero-section";
import FooterSection from "@/components/footer-section";

export default function Home() {
  return (
    <main>
      <HeroHeader />
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <FooterSection />
    </main>
  );
}
