import React from "react";
import { Sparkles, Calendar, MapPin } from "lucide-react";
import Image from "next/image";

export type CardTheme = "midnight" | "sunset" | "emerald" | "rose" | "nordic";

export interface SocialCardProps {
  title: string;
  subtitle?: string;
  excerpt?: string;
  date?: string;
  coverImage?: string;
  theme?: CardTheme;
  type?: "journal" | "itinerary";
  authorName?: string;
  authorPhoto?: string;
}

export const THEME_PRESETS: Record<
  CardTheme,
  { name: string; bg: string; text: string; badge: string }
> = {
  midnight: {
    name: "Midnight Sparkle",
    bg: "bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-900",
    text: "text-white",
    badge: "bg-indigo-500/30 border-indigo-400/40 text-indigo-200",
  },
  sunset: {
    name: "Sunset Glow",
    bg: "bg-gradient-to-br from-amber-600 via-rose-600 to-purple-900",
    text: "text-white",
    badge: "bg-amber-500/30 border-amber-400/40 text-amber-100",
  },
  emerald: {
    name: "Deep Emerald",
    bg: "bg-gradient-to-br from-emerald-900 via-teal-950 to-slate-900",
    text: "text-white",
    badge: "bg-emerald-500/30 border-emerald-400/40 text-emerald-200",
  },
  rose: {
    name: "Rose Quartz",
    bg: "bg-gradient-to-br from-pink-900 via-rose-950 to-purple-950",
    text: "text-white",
    badge: "bg-rose-500/30 border-rose-400/40 text-rose-200",
  },
  nordic: {
    name: "Nordic Slate",
    bg: "bg-gradient-to-br from-slate-800 via-slate-900 to-zinc-950",
    text: "text-slate-100",
    badge: "bg-slate-700/40 border-slate-600/40 text-slate-300",
  },
};

export const SocialCardCanvas = React.forwardRef<
  HTMLDivElement,
  SocialCardProps
>(
  (
    {
      title,
      subtitle,
      excerpt,
      date,
      coverImage,
      theme = "midnight",
      type = "journal",
      authorName,
      authorPhoto,
    },
    ref,
  ) => {
    const selectedTheme = THEME_PRESETS[theme] || THEME_PRESETS.midnight;

    return (
      <div
        ref={ref}
        className={`w-full max-w-full aspect-[4/5] ${selectedTheme.bg} p-6 sm:p-8 rounded-3xl shadow-2xl flex flex-col justify-between relative overflow-hidden font-sans border border-white/10`}
      >
        {/* Subtle background blur accents */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Row */}
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.webp"
              width={28}
              height={29}
              alt="ZapJot Logo"
              className="shadow-sm"
            />
            <span className="font-extrabold tracking-tight text-white text-base">
              ZapJot
            </span>
          </div>

          <div
            className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-md border ${selectedTheme.badge}`}
          >
            {type === "itinerary" ? "Trip Itinerary" : "Journal Entry"}
          </div>
        </div>

        {/* Middle Content Section */}
        <div className="my-auto z-10 py-4 flex flex-col gap-4">
          {coverImage && (
            <div className="relative w-full h-40 rounded-2xl overflow-hidden border border-white/15 shadow-md">
              <Image
                src={coverImage}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 500px) 100vw, 500px"
              />
            </div>
          )}

          <div className="space-y-2">
            <h2
              className={`text-2xl sm:text-3xl font-extrabold leading-tight tracking-tight ${selectedTheme.text} drop-shadow-sm line-clamp-2`}
            >
              {title}
            </h2>

            {subtitle && (
              <p className="text-sm font-medium text-white/80 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-purple-300" />
                {subtitle}
              </p>
            )}
          </div>

          {excerpt && (
            <div className=" bg-white/5 rounded-2xl border border-white/10 p-4">
              <p className="line-clamp-4 text-sm text-white/90 leading-relaxed font-normal italic">
                “{excerpt}”
              </p>
            </div>
          )}
        </div>

        {/* Bottom Footer Row */}
        <div className="flex items-center justify-between z-10 pt-3 border-t border-white/15 text-xs text-white/85 font-medium">
          <div className="flex items-center gap-3 w-full justify-between">
            {authorName && (
              <div className="flex items-center gap-2">
                {authorPhoto ? (
                  <div className="relative w-6 h-6 rounded-full overflow-hidden border border-white/30 shadow-sm shrink-0">
                    <Image
                      src={authorPhoto}
                      alt={authorName}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-white/20 text-white font-extrabold text-[10px] flex items-center justify-center border border-white/30 shrink-0">
                    {authorName.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="font-semibold text-white/95">
                  {authorName}
                </span>
              </div>
            )}

            {date && (
              <div className="flex items-center gap-1 text-white/70 text-[11px]">
                <Calendar className="h-3 w-3 text-white/60" />
                <span>{date}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
);

SocialCardCanvas.displayName = "SocialCardCanvas";
