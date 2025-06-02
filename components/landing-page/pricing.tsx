import { CheckSquare, Sparkles, Zap, Star } from "lucide-react";
import { CTAButton } from "./cta-button";
import { Link } from "../layout/link/CustomLink";

export function Pricing() {
  return (
    <section id="pricing" className="relative py-20 md:py-32 px-4 md:px-6 ">
      <article className="container relative z-10">
        {/* Header */}
        <div className="mx-auto text-center md:max-w-[58rem] animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-sm font-medium mb-6 shadow-sm">
            <Sparkles className="w-4 h-4" />
            Pricing Plans
          </div>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-6 text-xl text-gray-600 leading-relaxed">
            Start for free and unlock the full potential of your productivity.
          </p>
        </div>

        {/* Hero Free Banner */}
        <div className="mt-12 relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
          <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-center py-8 sm:py-16 rounded-2xl shadow-2xl">
            <div className="absolute top-4 left-4">
              <div className="flex space-x-1">
                <div className="w-3 h-3 bg-white/20 rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-white/20 rounded-full animate-pulse delay-100"></div>
                <div className="w-3 h-3 bg-white/20 rounded-full animate-pulse delay-200"></div>
              </div>
            </div>
            <div className="relative">
              <div className="inline-flex items-center gap-2 mb-4">
                <Star className="w-6 h-6 text-yellow-300" />
                <Star className="w-6 h-6 text-yellow-300" />
                <Star className="w-6 h-6 text-yellow-300" />
              </div>
              <p className="text-xl sm:text-3xl font-bold mb-2">
                🎉 ZapJot is{" "}
                <span className="underline underline-offset-4 decoration-yellow-300 decoration-2 font-black">
                  completely free
                </span>
              </p>

              <CTAButton
                extraBefore={<Sparkles className="h-5 w-5" />}
                // text="Get Started Now"
                // textWhenLoggedIn="Jump Into My Workspace"
                className="rounded-full h-14 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors mt-6"
              />
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: Zap,
              title: "Instant Capture",
              desc: "Quickly jot down thoughts without delay",
            },
            {
              icon: CheckSquare,
              title: "Everything You Need",
              desc: "Powerful features without the clutter",
            },
            {
              icon: Sparkles,
              title: "Delightfully Minimal",
              desc: "Simple, distraction-free design",
            },
          ].map((feature, index) => (
            <div key={index} className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
              <div className="relative bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Coming Soon Section */}
        <div className="mx-auto mt-20 max-w-4xl relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
          <div className="relative bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-10 shadow-xl">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4 animate-spin" />
                Coming Soon
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Looking for more?
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
                We&apos;re constantly improving ZapJot. Premium features with
                advanced capabilities are coming soon. Stay tuned for
                subscription options that will take your productivity to the
                next level.
              </p>
              <div className="mt-8">
                <Link href="#contact">
                  <button className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
                    <Zap className="w-5 h-5" />
                    Contact Us for Updates
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-500 mb-6">
            Join thousands of productive users today
          </p>
          <div className="flex justify-center items-center space-x-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-sm font-bold animate-bounce"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      </article>
    </section>
  );
}
