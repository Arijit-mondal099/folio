import type { Metadata } from "next";

import FAQsTwo from "@/components/faqs-section";
import FeaturesSection from "@/components/features-section";
import FinalCtaSection from "@/components/final-cta-section";
import FooterSection from "@/components/footer-section";
import { HeroHeader } from "@/components/header";
import HeroSection from "@/components/hero-section";
import HowItWorksSection from "@/components/how-it-works-section";
import OpenSourceSection from "@/components/open-source-section";
import PersonasSection from "@/components/personas-section";
import Pricing from "@/components/pricing-section";
import { SITE_DESCRIPTION, SITE_TITLE } from "@/lib/constants";

export const metadata: Metadata = {
  title: { absolute: SITE_TITLE },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" }
};

export default function Home() {
  return (
    <main>
      <HeroHeader />
      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <PersonasSection />
      <OpenSourceSection />
      <Pricing />
      <FAQsTwo />
      <FinalCtaSection />
      <FooterSection />
    </main>
  );
}
