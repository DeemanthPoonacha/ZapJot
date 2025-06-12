import { Header } from "@/components/landing-page/header/header";
import { Hero } from "@/components/landing-page/hero/hero";
import { Features } from "@/components/landing-page/features/features";
import { Testimonials } from "../components/landing-page/testimonials";
import { HowItWorks } from "../components/landing-page/app-preview/how-it-works";
import { Footer } from "../components/landing-page/footer";
import { CTASection } from "@/components/landing-page/cta/cta-section";
import { Pricing } from "../components/landing-page/pricing";
import { Contact } from "@/components/landing-page/contact/contact";
import { Background } from "../components/landing-page/bg/Background";
import "./landing-page.css";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center">
      <Background />
      <Header />
      <main className="flex-1 container">
        {/* Hero Section */}
        <Hero />

        {/* Features Section */}
        <Features />

        {/* How It Works Section */}
        <HowItWorks />

        {/* Testimonials Section */}
        <Testimonials />

        {/* Pricing Section */}
        <Pricing />

        {/* CTA Section */}
        <CTASection />

        {/* Contact Section */}
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
