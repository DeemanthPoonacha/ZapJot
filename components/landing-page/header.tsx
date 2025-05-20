import { Logo } from "@/components/landing-page/Logo";

import dynamic from "next/dynamic";
import { Link } from "../layout/link/CustomLink";

const HeaderAction = dynamic(() => import("./HeaderAction"), {});

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 container flex items-center justify-between px-4 md:px-6">
      <Logo />
      <nav className="hidden md:flex gap-6">
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
