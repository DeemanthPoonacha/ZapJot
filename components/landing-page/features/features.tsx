import { Sparkles } from "lucide-react";
import { FeatureCard } from "./feature-card";
import { features } from "../data";

export function Features() {
  return (
    <section className="relative py-24 md:py-32" id="features">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30" />
      <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <article className="relative container px-4 md:px-6">
        <div className="mx-auto text-center md:max-w-4xl mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full text-sm font-medium text-purple-700 mb-6">
            <Sparkles className="h-4 w-4" />
            Everything you need in one place
          </div>

          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 bg-clip-text text-transparent leading-tight">
            Your life.{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
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
          <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
            <Sparkles className="h-5 w-5" />
            Get Started Today
            <svg
              className="h-5 w-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5-5 5M6 12h12"
              />
            </svg>
          </div>
        </div>
      </article>
    </section>
  );
}
