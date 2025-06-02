import { CheckSquare, Sparkles, ArrowRight } from "lucide-react";
import ZapJotAnimation from "@/components/landing-page/hero-animation";
import { CTAButton } from "./cta-button";
import { Link } from "../layout/link/CustomLink";

const appVersion = process.env.APP_VERSION || "1.0.0";

// Server Component - Static Badge
function VersionBadge() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 text-sm font-medium text-purple-700 shadow-sm">
      <Sparkles className="h-4 w-4" />
      <span>New Release</span>
      <span className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-2 py-0.5 text-xs text-white shadow-sm">
        v{appVersion}
      </span>
    </div>
  );
}

// Server Component - Static Features List
function FeaturesList() {
  return (
    <div className="flex flex-col sm:flex-row gap-6 text-sm">
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500">
          <CheckSquare className="h-3 w-3 text-white" />
        </div>
        <span className="text-slate-600 font-medium">
          It&apos;s free to use
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500">
          <CheckSquare className="h-3 w-3 text-white" />
        </div>
        <span className="text-slate-600 font-medium">
          No credit card required
        </span>
      </div>
    </div>
  );
}

// Client Component - Interactive Buttons
function InteractiveButtons() {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <CTAButton className="h-15 rounded-xl" />

      {/* Secondary Button */}
      <Link href="#how-it-works" className="w-full">
        <button className="group flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white/80 backdrop-blur-sm px-8 py-4 font-semibold text-slate-700 shadow-sm hover:shadow-md hover:border-purple-200 hover:bg-purple-50/50 transition-all duration-300">
          <span>Learn More</span>
          <ArrowRight className="h-4 w-4 group-hover:scale-110 transition-transform" />
        </button>
      </Link>
    </div>
  );
}

// Main Server Component
export function Hero() {
  return (
    <section className="relative  py-24 md:py-32 px-4 md:px-6">
      <article className="relative container mx-auto">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20 items-center">
          {/* Content Column */}
          <div className="space-y-8 lg:pr-8">
            <VersionBadge />

            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Turn Moments Into{" "}
                </span>
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Memories
                </span>
                <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  , Ideas Into{" "}
                </span>
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Actions
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-slate-600 leading-relaxed max-w-2xl">
                Journal your life, plan events, manage tasks, and keep track of
                important people and moments — all in one{" "}
                <span className="font-semibold text-slate-800">beautiful</span>{" "}
                place.
              </p>
            </div>

            <InteractiveButtons />

            <FeaturesList />

            {/* Social proof or stats */}
            <div className="flex items-center gap-8 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">10k+</div>
                <div className="text-sm text-slate-600">Happy Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">4.9</div>
                <div className="text-sm text-slate-600">App Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">50k+</div>
                <div className="text-sm text-slate-600">Memories Captured</div>
              </div>
            </div>
          </div>

          {/* Image Column */}
          <div className="flex justify-center lg:justify-end">
            <ZapJotAnimation />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="flex justify-center mt-16">
          <div className="animate-bounce">
            <div className="w-6 h-10 border-2 border-slate-300 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-slate-400 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}
