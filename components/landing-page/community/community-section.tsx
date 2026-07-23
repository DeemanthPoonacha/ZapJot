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
import { PublicShareCard } from "@/components/social-card/PublicShareCard";
import { PublicShare } from "@/lib/services/publicShares";

export function CommunitySection() {
  const sampleCards: PublicShare[] = [
    {
      id: "pub_itinerary_1",
      userId: "user1",
      title: "Tokyo 7-Day Food & Shrine Expedition",
      destination: "Tokyo, Japan",
      type: "itinerary",
      theme: "midnight",
      authorName: "Alex Rivera",
      authorPhoto:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      coverImage:
        "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
      createdAt: "",
      updatedAt: "",
      subtitle:
        "A week of city thrills, food adventures, and spiritual escapes.",
    },
    {
      id: "pub_journal_1",
      userId: "user2",
      title: "Solo Backpacking across Amalfi Coast",
      destination: "Positano, Italy",
      type: "journal",
      theme: "sunset",
      authorName: "Sophia Lin",
      authorPhoto:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
      coverImage:
        "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80",
      createdAt: "",
      updatedAt: "",
      subtitle:
        "Chasing waterfalls, lemon groves, and sunset hues on the Italian coast.",
    },
    {
      id: "pub_itinerary_2",
      userId: "user3",
      title: "Nordic Lights & Iceland Road Trip",
      destination: "Reykjavik, Iceland",
      type: "itinerary",
      theme: "emerald",
      authorName: "Marcus Thorne",
      authorPhoto:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      coverImage:
        "https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=600&q=80",
      createdAt: "",
      updatedAt: "",
      subtitle:
        "Chasing waterfalls, lemon groves, and sunset hues on the Italian coast.",
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
            <PublicShareCard
              key={idx}
              share={{
                ...(card as any),
              }}
              demo
            />
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
