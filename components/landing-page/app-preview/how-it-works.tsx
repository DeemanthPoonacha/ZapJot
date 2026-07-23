import { Sparkles, ArrowRight } from "lucide-react";
import Slides from "./slides";
import { steps } from "../data";
import { CTAButton } from "../cta/cta-button";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 md:py-28 relative">
      <article className="container mx-auto px-4 md:px-6 relative z-10 max-w-6xl">
        {/* Section Header */}
        <div className="mx-auto text-center md:max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-950/80 dark:to-indigo-950/80 border border-purple-200/60 dark:border-purple-800/40 text-purple-800 dark:text-purple-300 text-xs sm:text-sm font-semibold mb-6 shadow-xs">
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            Simple 3-Step Process
          </div>

          <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
            <span className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 dark:from-white dark:via-purple-200 dark:to-white bg-clip-text text-transparent">
              How ZapJot Works
            </span>
          </h2>

          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Transform your daily journaling and travel planning in three effortless steps.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid gap-8 md:grid-cols-3 mb-12">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="relative group bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-7 rounded-3xl border border-purple-100/60 dark:border-slate-800 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-md">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-black text-purple-200 dark:text-purple-900/60">
                      0{step.number}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    {step.title}
                  </h3>

                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                    {step.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
                  <p className="text-xs text-purple-700 dark:text-purple-300 font-semibold italic">
                    {step.details}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live App Showcase Component */}
        <Slides />

        {/* CTA Button */}
        <div className="text-center mt-12">
          <CTAButton className="h-14 rounded-2xl px-8 shadow-lg" />
        </div>
      </article>
    </section>
  );
}
