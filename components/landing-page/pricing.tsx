import { Check, Sparkles, Zap, Shield, RefreshCw, Star } from "lucide-react";
import { CTAButton } from "./cta/cta-button";
import { Link } from "@/components/layout/link/CustomLink";

export function Pricing() {
  const freeFeatures = [
    "Unlimited Journal Entries & Chapters",
    "Multi-Day Travel Itineraries & Checklists",
    "Real-Time Google Calendar Synchronization",
    "Zappy AI Assistant for Instant Capture & Briefings",
    "100% Offline Access with Automatic PWA Sync",
    "Social Media Card Graphic Generator & Exports",
    "Community Explore Hub & 1-Click Itinerary Import",
    "Client-Side Journal Encryption & Privacy",
  ];

  return (
    <section id="pricing" className="relative py-16 md:py-28 px-4 md:px-6">
      <article className="container relative z-10 mx-auto max-w-5xl">
        {/* Section Header */}
        <div className="mx-auto text-center md:max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-950/80 dark:to-indigo-950/80 border border-purple-200/60 dark:border-purple-800/40 text-purple-800 dark:text-purple-300 text-xs sm:text-sm font-semibold mb-6 shadow-xs">
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            Flexible & Transparent Pricing
          </div>

          <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
            <span className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 dark:from-white dark:via-purple-200 dark:to-white bg-clip-text text-transparent">
              Simple Plans for Everyone
            </span>
          </h2>

          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Get started for free with full access to core features, with powerful pro capabilities planned for the future.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          {/* Free Tier Card */}
          <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-purple-100/60 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-xs uppercase tracking-wider rounded-full">
                    Starter
                  </span>
                  <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-3">
                    Free Tier
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Everything you need to get organized today.
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-black text-purple-600 dark:text-purple-400">$0</div>
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Free
                  </div>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-3 py-4 border-t border-slate-100 dark:border-slate-800">
                {freeFeatures.map((feat, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
                      {feat}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
              <CTAButton
                extraBefore={<Sparkles className="h-4 w-4" />}
                className="w-full h-12 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md"
              />
            </div>
          </div>

          {/* Pro Tier Card */}
          <div className="relative bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white rounded-3xl p-8 shadow-xl border border-white/10 flex flex-col justify-between overflow-hidden">
            <div className="absolute top-6 right-6">
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-400/30 font-bold text-[10px] uppercase tracking-wider rounded-full backdrop-blur-md">
                Coming Soon
              </span>
            </div>

            <div>
              <div className="mb-6">
                <span className="px-3 py-1 bg-white/10 text-purple-200 font-bold text-xs uppercase tracking-wider rounded-full backdrop-blur-md">
                  Pro
                </span>
                <h3 className="text-2xl font-extrabold text-white mt-3 flex items-center gap-2">
                  Advanced Pro
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                </h3>
                <p className="text-xs text-purple-200/80 mt-1">
                  Enhanced capabilities for power users and collaborators.
                </p>
              </div>

              {/* Upcoming Pro Features List */}
              <div className="relative space-y-3 py-4 border-t h-full border-white/15">
                {[
                  "Advanced AI Knowledge Retrieval & Multi-Model Support",
                  "Team & Shared Family Workspaces",
                  "Custom Domain & Portfolio Publishing for Shares",
                  "Priority Real-Time Sync & Extended Backup Retention",
                  "Advanced Export Formats (Markdown, PDF, HTML, JSON)",
                ].map((feat, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-4 h-4 rounded-full bg-purple-500/30 text-purple-300 shrink-0 border border-purple-400/30">
                      <Zap className="w-2.5 h-2.5" />
                    </div>
                    <span className="text-xs font-medium text-purple-100/90">
                      {feat}
                    </span>
                  </div>
                ))}
                <Link
                  href="/#contact"
                  className="absolute bottom-0 left-0 w-full flex items-center justify-center h-full py-8 bg-white/5 backdrop-blur-sm rounded-xl text-purple-200 font-bold text-base"
                >
                  Contact for customization
                </Link>
              </div>
            </div>

            <div className="pt-6 border-t border-white/15 text-center">
              <span className="inline-block text-xs font-semibold text-purple-200/70 italic">
                Stay tuned for future subscription options & updates.
              </span>
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Zap,
              title: "0ms Offline Latency",
              desc: "Instant local caching and automatic PWA background sync when back online.",
            },
            {
              icon: Shield,
              title: "Private & Encrypted",
              desc: "Your journals are encrypted so your personal thoughts remain private.",
            },
            {
              icon: RefreshCw,
              title: "Google Calendar Sync",
              desc: "Seamless 2-way event synchronization with your Google Calendar.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl border border-purple-100/60 dark:border-slate-800 shadow-xs hover:shadow-md transition"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4 border border-purple-200/50 dark:border-purple-800/40">
                <feature.icon className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1">
                {feature.title}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
