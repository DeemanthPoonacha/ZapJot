import {
  Globe,
  Plus,
  Sparkles,
  Share2,
  ArrowRight,
  MapPin,
  Compass,
} from "lucide-react";
import { Link } from "@/components/layout/link/CustomLink";
import Image from "next/image";

export function CommunitySection() {
  const sampleCards = [
    {
      title: "Tokyo 7-Day Food & Shrine Expedition",
      destination: "Tokyo, Japan",
      type: "Itinerary",
      themeBg: "bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900",
      themeBadge: "bg-indigo-500/30 border-indigo-400/40 text-indigo-200",
      author: "Alex Rivera",
      authorPhoto:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      coverImage:
        "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    },
    {
      title: "Solo Backpacking across Amalfi Coast",
      destination: "Positano, Italy",
      type: "Journal",
      themeBg: "bg-gradient-to-br from-amber-600 via-rose-600 to-purple-900",
      themeBadge: "bg-amber-500/30 border-amber-400/40 text-amber-100",
      author: "Sophia Lin",
      authorPhoto:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
      coverImage:
        "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80",
    },
    {
      title: "Nordic Lights & Iceland Road Trip",
      destination: "Reykjavik, Iceland",
      type: "Itinerary",
      themeBg: "bg-gradient-to-br from-emerald-900 via-teal-950 to-slate-900",
      themeBadge: "bg-emerald-500/30 border-emerald-400/40 text-emerald-200",
      author: "Marcus Thorne",
      authorPhoto:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      coverImage:
        "https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=600&q=80",
    },
  ];

  return (
    <section className="relative py-24 md:py-32" id="community">
      {/* Background accents */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/5 via-slate-50 to-pink-900/5 -z-10" />

      <article className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mx-auto text-center md:max-w-4xl mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full text-sm font-semibold text-purple-800 mb-6 shadow-sm">
            <Globe className="h-4 w-4 text-purple-600" />
            Community & Public Sharing
          </div>

          <h2 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 bg-clip-text text-transparent leading-tight">
            Explore, Share &{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Import Trip Plans
            </span>
          </h2>

          <p className="mt-6 text-slate-600 text-xl md:text-2xl leading-relaxed max-w-3xl mx-auto">
            Discover community-created itineraries and public journals, export
            stunning social cards, or import shared travel plans into your own
            profile with 1 click.
          </p>
        </div>

        {/* Feature Cards Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {sampleCards.map((card, idx) => (
            <div
              key={idx}
              className={`group relative flex flex-col justify-between ${card.themeBg} p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 text-white border border-white/20 overflow-hidden min-h-[380px]`}
            >
              {/* Background Glow */}
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />

              {/* Header */}
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                  <Image
                    src="/logo.webp"
                    width={24}
                    height={25}
                    alt="ZapJot Logo"
                    className="rounded-lg shadow-sm"
                  />
                  <span className="font-extrabold tracking-tight text-white text-sm">
                    ZapJot
                  </span>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border ${card.themeBadge}`}
                >
                  {card.type}
                </span>
              </div>

              {/* Body Content */}
              <div className="my-auto z-10 py-4 space-y-3">
                <div className="relative w-full h-36 rounded-2xl overflow-hidden border border-white/20 shadow-md">
                  <Image
                    src={card.coverImage}
                    alt={card.title}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-500"
                    sizes="400px"
                  />
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-bold leading-snug text-white line-clamp-2">
                    {card.title}
                  </h3>
                  <p className="text-xs font-semibold text-purple-200 flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-purple-300 shrink-0" />
                    {card.destination}
                  </p>
                </div>
              </div>

              {/* Footer Row */}
              <div className="z-10 pt-3 border-t border-white/15 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="relative w-6 h-6 rounded-full overflow-hidden border border-white/40 shadow-xs">
                    <Image
                      src={card.authorPhoto}
                      alt={card.author}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="text-xs font-semibold text-white/90">
                    {card.author}
                  </span>
                </div>

                <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-xl backdrop-blur-md border border-white/20 transition">
                  <Plus className="h-3 w-3 text-purple-200" />
                  Import
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Feature Highlights Banner */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl border border-white/10 max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/30 text-xs font-semibold uppercase tracking-wider">
              <Compass className="h-3.5 w-3.5" />
              Community Discover Hub
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold leading-tight">
              Ready to Explore Shared Itineraries?
            </h3>
            <p className="text-sm text-purple-200/90 leading-relaxed">
              Browse public trip guides, share your travel stories with graphic
              social cards, and duplicate itineraries straight into your
              planner.
            </p>
          </div>

          <Link href="/explore">
            <button className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-extrabold text-sm shadow-xl transition-all duration-300 transform hover:scale-105 shrink-0">
              <span>Explore Community Hub</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </article>
    </section>
  );
}
