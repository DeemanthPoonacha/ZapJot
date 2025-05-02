import { Logo } from "@/components/landing-page/Logo";
import { Link } from "@/components/layout/link/CustomLink";
import { CTAButton } from "./cta-section";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Logo />
        <nav className="hidden md:flex gap-6">
          <Link
            href="#features"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            How It Works
          </Link>
          <Link
            href="#testimonials"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Testimonials
          </Link>
          <Link
            href="#pricing"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Pricing
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link
            href="/auth/sign-in"
            className="hidden md:inline-flex text-sm font-medium hover:text-primary transition-colors"
          >
            Log in
          </Link>
          <CTAButton size="default" className="" withArrow={false} />
        </div>
      </div>
    </header>
  );
}
