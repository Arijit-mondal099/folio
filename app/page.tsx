import type { Metadata } from "next";

import FeaturesSection from "@/components/features-section";
import { HeroHeader } from "@/components/header";
import HeroSection from "@/components/hero-section";
import FooterSection from "@/components/footer-section";
import Pricing from "@/components/pricing-section";
import FAQsTwo from "@/components/faqs-section";
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
      <FeaturesSection />
      <Pricing />
      <FAQsTwo />
      <FooterSection />
    </main>
  );
}
