import { Logo } from "@/components/landing-page/Logo";

import dynamic from "next/dynamic";
import { Link } from "../../layout/link/CustomLink";

const HeaderAction = dynamic(() => import("./header-action"), {});

export function Header() {
  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 w-full">
      <header className="w-full max-w-5xl h-14 rounded-full border border-border/40 bg-background/70 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] px-6 flex items-center justify-between transition-all">
        <Logo />
        <nav className="hidden md:flex gap-8 text-slate-700 dark:text-slate-300">
          <Link
            href="/#features"
            className="text-sm font-medium hover:text-primary transition-colors hover:scale-105 active:scale-95"
          >
            Features
          </Link>
          <Link
            href="/#how-it-works"
            className="text-sm font-medium hover:text-primary transition-colors hover:scale-105 active:scale-95"
          >
            How It Works
          </Link>
          <Link
            href="/#pricing"
            className="text-sm font-medium hover:text-primary transition-colors hover:scale-105 active:scale-95"
          >
            Pricing
          </Link>
          <Link
            href="/#contact"
            className="text-sm font-medium hover:text-primary transition-colors hover:scale-105 active:scale-95"
          >
            Contact
          </Link>
        </nav>
        <HeaderAction />
      </header>
    </div>
  );
}
