import { CheckSquare, Sparkles, ArrowRight, Play } from "lucide-react";

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
        <span className="text-slate-600 font-medium">It's free to use</span>
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

// Server Component - Static Background Elements
function HeroBackground() {
  return (
    <>
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] opacity-25"></div>
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/50 to-purple-50/50" />
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-40 right-32 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-400/5 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>
      {/* Animated background gradients */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse delay-1000"></div>
      <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse delay-2000"></div>
    </>
  );
}

// Client Component - Interactive Buttons
function InteractiveButtons() {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Primary CTA Button */}
      <button className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative flex items-center justify-center gap-2">
          <span>Get Started Free</span>
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </button>

      {/* Secondary Button */}
      <button className="group flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white/80 backdrop-blur-sm px-8 py-4 font-semibold text-slate-700 shadow-sm hover:shadow-md hover:border-purple-200 hover:bg-purple-50/50 transition-all duration-300">
        <Play className="h-4 w-4 group-hover:scale-110 transition-transform" />
        <span>Watch Demo</span>
      </button>
    </div>
  );
}

// Client Component - Animated Image
function AnimatedImage() {
  return (
    <div className="relative group">
      {/* Glow effect behind image */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500 scale-110"></div>

      {/* Main image container */}
      <div className="relative bg-white rounded-3xl p-4 shadow-2xl border border-white/20 backdrop-blur-sm group-hover:scale-105 transition-transform duration-500">
        <div className="w-96 h-96 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center">
          {/* Mock app interface */}
          <div className="w-80 h-80 bg-white rounded-xl shadow-lg p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg"></div>
              <div className="h-4 bg-slate-200 rounded w-20"></div>
            </div>
            <div className="space-y-3">
              <div className="h-3 bg-slate-100 rounded w-full"></div>
              <div className="h-3 bg-slate-100 rounded w-4/5"></div>
              <div className="h-3 bg-slate-100 rounded w-3/5"></div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="h-16 bg-purple-50 rounded-lg border border-purple-100"></div>
              <div className="h-16 bg-pink-50 rounded-lg border border-pink-100"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-bounce delay-1000"></div>
      <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-bounce delay-2000"></div>
    </div>
  );
}

// Main Server Component
export function Hero() {
  return (
    <section className="relative  py-24 md:py-32 px-4 md:px-6">
      <HeroBackground />

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
            <AnimatedImage />
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
