import type { Metadata } from "next";

import StatsSection from "@/components/stats-section";
import FeaturesSection from "@/components/features-section";
import { HeroHeader } from "@/components/header";
import HeroSection from "@/components/hero-section";
import FooterSection from "@/components/footer-section";
import Pricing from "@/components/pricing-section";
import FAQsTwo from "@/components/faqs-section";

export const metadata: Metadata = {
  title: { absolute: "folio — your notebook, supercharged with AI" },
  description:
    "Capture, organise, and refine notes in beautiful notebooks. Folio pairs a clean editor with built-in AI to help you write, summarise, and translate faster.",
  alternates: { canonical: "/" }
};

export default function Home() {
  return (
    <main>
      <HeroHeader />
      <HeroSection />
      <FeaturesSection />
      <Pricing />
      <StatsSection />
      <FAQsTwo />
      <FooterSection />
    </main>
  );
}
