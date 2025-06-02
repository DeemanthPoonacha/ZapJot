import { ArrowRight, Sparkles, Zap, Users } from "lucide-react";
import { Button } from "../ui/button";
import { CTAButton } from "./cta-button";
import { Link } from "../layout/link/CustomLink";

export function CTASection() {
  return (
    <section className="relative bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950/30 py-20 md:py-32">
      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-30 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <article className="relative container px-4 md:px-6">
        <div className="mx-auto max-w-4xl">
          {/* Stats row */}
          <div className="flex justify-center mb-12">
            <div className="flex flex-wrap gap-8 items-center justify-center text-center">
              <div className="flex items-center gap-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20 dark:border-slate-700/20">
                <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  10K+ Users
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20 dark:border-slate-700/20">
                <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  100% Free
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20 dark:border-slate-700/20">
                <Zap className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Instant Setup
                </span>
              </div>
            </div>
          </div>

          {/* Main CTA Card */}
          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-500" />

            <div className="relative rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/20 p-8 text-center md:p-12 lg:p-16 shadow-2xl">
              {/* Decorative elements */}
              <div className="absolute top-6 left-6 w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse" />
              <div className="absolute top-6 right-6 w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse delay-300" />
              <div className="absolute bottom-6 left-8 w-4 h-4 bg-gradient-to-r from-indigo-400 to-cyan-400 rounded-full animate-pulse delay-700" />

              {/* Main content */}
              <div className="relative">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                  <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400 animate-spin-slow" />
                  <span className="text-sm font-semibold uppercase tracking-wider">
                    Transform Your Productivity
                  </span>
                </div>

                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl mb-6">
                  <span className="bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent">
                    Ready to revolutionize
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    your workflow?
                  </span>
                </h2>

                <p className="mt-6 text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
                  Join thousands of users who have already revolutionized how
                  they journal, plan, and manage their lives with our powerful
                  productivity suite.
                </p>

                {/* CTA Buttons */}
                <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-6">
                  <CTAButton />
                  <Link href="#how-it-works" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full h-12 px-8 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 hover:scale-105 transition-all duration-200 group"
                    >
                      <span>See How It Works</span>
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>

                {/* Trust indicators */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span>No credit card required</span>
                  </div>
                  <div className="hidden sm:block w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full" />
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-300" />
                    <span>Setup in under a minute</span>
                  </div>
                  <div className="hidden sm:block w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full" />
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-500" />
                    <span>Free to use</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom testimonial */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/20 dark:border-slate-700/20">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 border-2 border-white dark:border-slate-800 flex items-center justify-center text-white text-xs font-bold"
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  &quot;Game-changing productivity tool!&quot;
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  - Sarah, Product Manager
                </p>
              </div>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}
