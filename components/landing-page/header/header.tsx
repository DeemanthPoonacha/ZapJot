import { Logo } from "@/components/landing-page/Logo";
import HeaderNavigation from "./navigation";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-purple-100/60 dark:border-slate-800 transition-all duration-300">
      <div className="container mx-auto h-full flex items-center justify-between px-4 md:px-6">
        <Logo />
        <HeaderNavigation />
      </div>
    </header>
  );
}
