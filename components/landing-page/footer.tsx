import { Logo } from "@/components/landing-page/Logo";
import { Link } from "../layout/link/CustomLink";
import { CTAButton } from "./cta/cta-button";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/90 to-purple-50/90 -z-10" />
      <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative container px-4 py-16 md:px-6 md:py-20 lg:py-24">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <Logo />
            </div>
            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              Turn moments into memories, ideas into actions. Your all-in-one
              productivity companion.
            </p>

            {/* Social Media Icons */}
            <div className="flex gap-3">
              {[
                {
                  name: "Facebook",
                  href: "/#",
                  path: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
                },
                {
                  name: "Instagram",
                  href: "/#",
                  paths: [
                    "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z",
                    "M17.5 6.5h.01",
                  ],
                  rect: "M2 2h20v20H2z",
                },
                {
                  name: "Twitter",
                  href: "/#",
                  path: "M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z",
                },
                {
                  name: "LinkedIn",
                  href: "/#",
                  paths: [
                    "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z",
                    "M2 9h4v12H2z",
                    "M4 4a2 2 0 1 1 0 4 2 2 0 0 1 0-4z",
                  ],
                },
              ].map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="group p-2 rounded-full bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:scale-110 transition-all duration-200 hover:shadow-lg"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors"
                  >
                    {social.rect && (
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    )}
                    {social.path && <path d={social.path} />}
                    {social.paths &&
                      social.paths.map((path, index) => (
                        <path key={index} d={path} />
                      ))}
                  </svg>
                  <span className="sr-only">{social.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Navigation Sections */}
          {[
            {
              title: "Product",
              links: [
                { href: "/#features", label: "Features" },
                { href: "/#pricing", label: "Pricing" },
                { href: "/#how-it-works", label: "How It Works" },
                { href: "/#testimonials", label: "Testimonials" },
              ],
            },
            {
              title: "Legal",
              links: [
                { href: "/privacy-policy", label: "Privacy Policy" },
                { href: "/terms-of-service", label: "Terms of Service" },
              ],
            },
            {
              title: "Support",
              links: [{ href: "/#contact", label: "Contact" }],
            },
          ].map((section) => (
            <div key={section.title}>
              <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                {section.title}
              </h3>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors duration-200 hover:translate-x-1 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="mt-16 relative">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-2xl shadow-2xl shadow-purple-500/25 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/90 via-purple-600/90 to-pink-600/90" />
            <div
              className={`absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" fill="none" fill-rule="evenodd" fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="7" cy="7" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"`}
            />

            <div className="relative text-center py-8 px-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="text-3xl animate-bounce">🎉</span>
                <h2 className="text-2xl sm:text-3xl font-bold">
                  ZapJot is{" "}
                  <span className="relative">
                    <span className="relative z-10 bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent font-black">
                      completely free
                    </span>
                    <span className="absolute inset-0 bg-white/20 blur-sm rounded-lg transform -skew-x-12" />
                  </span>
                </h2>
              </div>

              <CTAButton
                // extraBefore={<Sparkles className="h-5 w-5" />}
                // text="Get Started Now"
                // textWhenLoggedIn="Jump Into My Workspace"
                className="rounded-full h-14 bg-white/20 hover:bg-white/30 border border-white/30 text-white transition-colors mt-6"
              />
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-slate-200/50 dark:border-slate-700/50">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              © {new Date().getFullYear()} ZapJot. All rights reserved.
            </p>

            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <span>Made with</span>
              <span className="text-red-500 animate-pulse">❤️</span>
              <span>for productivity enthusiasts</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
