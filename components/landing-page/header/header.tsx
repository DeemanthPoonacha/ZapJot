"use client";

import { useState } from "react";
import { Logo } from "@/components/landing-page/Logo";
import { Link } from "../../layout/link/CustomLink";
import dynamic from "next/dynamic";
import { Menu, X, Compass, Sparkles } from "lucide-react";

const HeaderAction = dynamic(() => import("./header-action"), { ssr: false });

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/explore", label: "Explore Hub", highlight: true, icon: Compass },
    { href: "/#features", label: "Features" },
    { href: "/#how-it-works", label: "How It Works" },
    { href: "/#pricing", label: "Pricing" },
    { href: "/#contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-purple-100/60 dark:border-slate-800 transition-all duration-300">
      <div className="container mx-auto h-full flex items-center justify-between px-4 md:px-6">
        <Logo />

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                  link.highlight
                    ? "px-3.5 py-1.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 hover:bg-purple-200 shadow-xs border border-purple-200/50"
                    : "text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400"
                }`}
              >
                {Icon && <Icon className="h-3.5 w-3.5" />}
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Button & Mobile Menu Toggle */}
        <div className="flex items-center gap-3">
          <HeaderAction />

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-b border-purple-100 shadow-xl px-4 py-4 space-y-3 animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                link.highlight
                  ? "bg-purple-600 text-white font-bold"
                  : "text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-purple-950/40"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
