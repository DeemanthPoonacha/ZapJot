import { Sparkles } from "lucide-react";
import { FeatureCard } from "./feature-card";
import { features } from "../data";
import { CTAButton } from "../cta/cta-button";

export function Features() {
  return (
    <section className="relative py-24 md:py-32" id="features">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30" />
      <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <article className="relative container px-4 md:px-6">
        <div className="mx-auto text-center md:max-w-4xl mb-24">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-slate-100 dark:bg-slate-800/50 rounded-full border border-slate-200 dark:border-slate-700/50 text-sm font-semibold text-slate-800 dark:text-slate-200 mb-8 shadow-sm">
            <Sparkles className="h-4 w-4 text-purple-500" />
            Everything you need in one place
          </div>

          <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight tracking-tight">
            Your life.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">
              Organized.
            </span>
          </h2>

          <p className="mt-6 text-slate-600 text-xl md:text-2xl leading-relaxed">
            ZapJot brings journaling, planning, task management, and life
            tracking into one{" "}
            <span className="font-semibold text-slate-800">powerful</span> and{" "}
            <span className="font-semibold text-slate-800">personal</span>{" "}
            space.
          </p>
        </div>

        <div className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {features.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-20">
          <CTAButton
            extraBefore={<Sparkles className="h-5 w-5" />}
            text="Explore the Features"
            textWhenLoggedIn="Make the Most of Zapjot"
            className="rounded-full h-16"
          />
        </div>
      </article>
    </section>
  );
}
