import { Sparkles } from "lucide-react";
import { FeatureCard } from "./feature-card";
import { features } from "../data";
import { CTAButton } from "../cta/cta-button";

export function Features() {
  return (
    <section className="relative py-16 md:py-28" id="features">
      <article className="relative container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="mx-auto text-center md:max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-950/80 dark:to-indigo-950/80 border border-purple-200/60 dark:border-purple-800/40 rounded-full text-xs sm:text-sm font-semibold text-purple-800 dark:text-purple-300 mb-6 shadow-xs">
            <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            Everything You Need in One Place
          </div>

          <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 dark:from-white dark:via-purple-200 dark:to-white bg-clip-text text-transparent leading-tight">
            Your Life.{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Organized.
            </span>
          </h2>

          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            ZapJot brings journaling, trip planning, task tracking, and community sharing into one personal space.
          </p>
        </div>

        <div className="mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {features.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-14">
          <CTAButton
            extraBefore={<Sparkles className="h-5 w-5" />}
            text="Get Started for Free"
            textWhenLoggedIn="Open My Workspace"
            className="rounded-2xl h-14 px-8 shadow-lg"
          />
        </div>
      </article>
    </section>
  );
}
