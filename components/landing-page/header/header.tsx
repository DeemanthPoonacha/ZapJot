import { Logo } from "@/components/landing-page/Logo";

import dynamic from "next/dynamic";
import { Link } from "../../layout/link/CustomLink";

const HeaderAction = dynamic(() => import("./header-action"), {});

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full h-16 border-b container flex items-center justify-between px-4 md:px-6">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/90 to-purple-50/90 -z-10" />
      <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <Logo />
      <nav className="hidden md:flex gap-6 text-slate-800">
        <Link
          href="/#features"
          className="text-sm font-medium hover:text-primary transition-colors"
        >
          Features
        </Link>
        <Link
          href="/#how-it-works"
          className="text-sm font-medium hover:text-primary transition-colors"
        >
          How It Works
        </Link>
        <Link
          href="/#testimonials"
          className="text-sm font-medium hover:text-primary transition-colors"
        >
          Testimonials
        </Link>
        <Link
          href="/#pricing"
          className="text-sm font-medium hover:text-primary transition-colors"
        >
          Pricing
        </Link>
        <Link
          href="/#contact"
          className="text-sm font-medium hover:text-primary transition-colors"
        >
          Contact
        </Link>
      </nav>
      <HeaderAction />
    </header>
  );
}
