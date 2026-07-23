import {
  CheckSquare,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  Compass,
  Calendar,
} from "lucide-react";
import ZapJotAnimation from "@/components/landing-page/hero/hero-animation";
import { CTAButton } from "../cta/cta-button";
import { Link } from "../../layout/link/CustomLink";

const appVersion = process.env.APP_VERSION || "1.5.0";

function VersionBadge() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-100 via-indigo-100 to-pink-100 dark:from-purple-950/80 dark:to-pink-950/80 px-4 py-2 text-xs sm:text-sm font-semibold text-purple-900 dark:text-purple-200 border border-purple-200/60 dark:border-purple-800/40 shadow-xs">
      <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400 animate-spin" />
      <span>ZapJot Release</span>
      <span className="rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-2.5 py-0.5 text-xs font-bold text-white shadow-xs">
        v{appVersion}
      </span>
    </div>
  );
}

function TrustPills() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-200/60 dark:border-slate-800">
      {[
        { icon: Zap, label: "0ms Offline Sync" },
        { icon: Calendar, label: "Google Calendar Sync" },
        { icon: ShieldCheck, label: "End-to-End Private" },
        { icon: Globe, label: "Community Hub" },
      ].map((pill, idx) => (
        <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <div className="w-7 h-7 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200/50 dark:border-purple-800/40 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
            <pill.icon className="h-3.5 w-3.5" />
          </div>
          <span className="truncate">{pill.label}</span>
        </div>
      ))}
    </div>
  );
}

function InteractiveButtons() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 max-w-lg">
      <CTAButton className="h-14 rounded-2xl w-full text-base font-bold shadow-lg" />

      <Link href="/explore" className="w-full sm:w-auto">
        <button className="w-full h-14 group flex items-center justify-center gap-2 rounded-2xl border border-purple-200 dark:border-purple-900/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 font-bold text-slate-800 dark:text-slate-100 shadow-sm hover:shadow-md hover:border-purple-400 hover:bg-purple-50/50 dark:hover:bg-purple-950/40 transition-all duration-300">
          <Compass className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          <span>Explore Community</span>
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </Link>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative py-16 md:py-28 px-4 md:px-6 overflow-hidden">
      <article className="relative container mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-2 xl:gap-16 items-center">
          {/* Content Column */}
          <div className="space-y-8 text-center lg:text-left">
            <VersionBadge />

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight">
                <span className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 dark:from-white dark:via-purple-200 dark:to-white bg-clip-text text-transparent">
                  Turn Moments Into{" "}
                </span>
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
                  Memories
                </span>
                <span className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 dark:from-white dark:via-purple-200 dark:to-white bg-clip-text text-transparent">
                  , Ideas Into{" "}
                </span>
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
                  Actions
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Journal your life, plan multi-day travel itineraries, sync with Google Calendar, and explore community trip guides — all in one <span className="font-bold text-slate-900 dark:text-white">beautiful</span> place.
              </p>
            </div>

            <InteractiveButtons />

            <TrustPills />
          </div>

          {/* Animation Column */}
          <div className="flex justify-center lg:justify-end h-full order-first lg:order-last">
            <ZapJotAnimation />
          </div>
        </div>
      </article>
    </section>
  );
}
