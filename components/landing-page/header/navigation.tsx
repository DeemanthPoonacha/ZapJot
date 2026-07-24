"use client";

import { useState } from "react";
import { Link } from "../../layout/link/CustomLink";
import dynamic from "next/dynamic";
import { Menu, X, Compass, LogIn } from "lucide-react";

const HeaderAction = dynamic(() => import("./header-action"), { ssr: false });

export default function HeaderNavigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/#features", label: "Features" },
    { href: "/#how-it-works", label: "How It Works" },
    { href: "/#pricing", label: "Pricing" },
    { href: "/#contact", label: "Contact" },
    { href: "/explore", label: "Explore Hub", highlight: true, icon: Compass },
  ];

  return (
    <>
      {/* Desktop Navigation Links */}
      <nav className="hidden lg:flex items-center gap-6">
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
          className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>
      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed w-full top-16 left-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-b border-purple-100 shadow-xl px-4 py-4 space-y-3 animate-in slide-in-from-top-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-semibold transition ${
                  link.highlight
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold justify-center"
                    : "text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-purple-950/40"
                }`}
              >
                {Icon && <Icon className="h-3.5 w-3.5" />}

                {link.label}
              </Link>
            );
          })}
          <Link
            href="/auth/sign-in"
            className="flex md:hidden text-sm font-medium transition-colors cursor-pointer px-4 py-2 rounded-md justify-center items-center gap-1 border border-primary text-primary hover:bg-secondary"
          >
            Log In
            <LogIn className="w-4 h-4" />
          </Link>
        </div>
      )}
    </>
  );
}
