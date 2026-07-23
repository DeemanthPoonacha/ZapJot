"use client";

import React from "react";
import { PublicShare } from "@/lib/services/publicShares";
import { THEME_PRESETS, CardTheme } from "./SocialCardCanvas";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Plus, Copy, MapPin, Calendar, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import DeleteConfirm from "@/components/ui/delete-confirm";

interface PublicShareCardProps {
  share: PublicShare;
  isOwner?: boolean;
  onImport?: (share: PublicShare) => void;
  onDelete?: (shareId: string) => void;
  onCopyLink?: (shareId: string) => void;
  isImporting?: boolean;
  demo?: boolean;
}

export const PublicShareCard: React.FC<PublicShareCardProps> = ({
  share,
  isOwner,
  onImport,
  onDelete,
  onCopyLink,
  isImporting,
  demo,
}) => {
  const themeKey = (share.theme as CardTheme) || "midnight";
  const selectedTheme = THEME_PRESETS[themeKey] || THEME_PRESETS.midnight;
  const excerptText =
    share.subtitle || share.content?.replace(/<[^>]*>?/gm, "");

  const dateFormatted = share.createdAt
    ? new Date(share.createdAt).toLocaleDateString(undefined, {
        dateStyle: "short",
      })
    : undefined;

  return (
    <div
      className={`group relative flex flex-col justify-between ${selectedTheme.bg} p-5 sm:p-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden font-sans border border-white/15 min-h-[300px] text-white`}
    >
      {/* Subtle background blur accents */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

      {/* Middle Content Body */}
      <div className="z-10 pb-2 space-y-3">
        <div className="relative w-full h-32 rounded-2xl overflow-hidden border border-white/15 shadow-md bg-white/10 backdrop-blur-sm p-3">
          {share.coverImage ? (
            <Image
              src={share.coverImage}
              alt={share.title}
              fill
              className="object-cover group-hover:scale-105 transition duration-500 !m-0"
              sizes="(max-width: 500px) 100vw, 400px"
            />
          ) : (
            excerptText && (
              <>
                <span className="block min-w-0 max-w-40 truncate text-xs text-white/90 font-semibold">
                  {share.title}
                </span>
                <p className="line-clamp-4 text-xs text-white/90 leading-relaxed italic text-wrap-balance mt-1">
                  “{excerptText}”
                </p>
              </>
            )
          )}
          <div
            className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider backdrop-blur-md border ${selectedTheme.badge}`}
          >
            <span className="text-white">
              {share.type === "itinerary" ? "Itinerary" : "Journal"}
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="text-xl font-black leading-snug tracking-tight text-white line-clamp-1 drop-shadow-sm">
            {share.title}
          </h3>

          {share.destination && (
            <p className="text-xs font-semibold text-purple-200/90 flex items-center gap-1">
              <MapPin className="h-3 w-3 text-purple-300 shrink-0" />
              <span className="truncate">{share.destination}</span>
            </p>
          )}
        </div>
      </div>

      {/* Bottom Footer & Actions */}
      <div className="z-10 pt-3 border-t border-white/15 space-y-3">
        {/* Author & Date Metadata */}
        <div className="flex items-center justify-between text-xs text-white/85 font-medium">
          {share.authorName ? (
            <div className="flex items-center gap-2">
              {share.authorPhoto ? (
                <div className="relative w-6 h-6 rounded-full overflow-hidden border border-white/30 shadow-xs shrink-0">
                  <Image
                    src={share.authorPhoto}
                    alt={share.authorName}
                    fill
                    className="object-cover !m-0"
                  />
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full bg-white/20 text-white font-extrabold text-[10px] flex items-center justify-center border border-white/30 shrink-0">
                  {share.authorName.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="font-semibold text-white/95 truncate max-w-[120px]">
                {share.authorName}
              </span>
            </div>
          ) : (
            <span />
          )}

          {demo ? (
            <Button
              size="sm"
              disabled={isImporting}
              className="gap-1 bg-white text-purple-950 hover:bg-white/90 font-extrabold text-xs rounded-xl shadow-md"
            >
              {share.type === "itinerary" ? (
                <Plus className="h-3.5 w-3.5 text-purple-700" />
              ) : (
                <BookOpen className="h-3.5 w-3.5 text-purple-700" />
              )}
              {share.type === "itinerary" ? "Import" : "View"}
            </Button>
          ) : (
            dateFormatted && (
              <div className="flex items-center gap-1 text-[11px] text-white/70">
                <Calendar className="h-3 w-3 text-white/60" />
                <span>{dateFormatted}</span>
              </div>
            )
          )}
        </div>

        {/* Action Buttons */}
        {!demo && (
          <div className="flex items-center justify-between gap-2 pt-1">
            <Link
              href={`/explore/${share.id}`}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition border border-white/20 backdrop-blur-md"
            >
              <BookOpen className="h-3.5 w-3.5 text-purple-200" />
              View Post
            </Link>

            {isOwner ? (
              <div className="flex items-center gap-1">
                {onCopyLink && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onCopyLink(share.id)}
                    className="h-8 w-8 text-white hover:bg-white/20 rounded-xl"
                    title="Copy Public Link"
                  >
                    <Copy className="h-4 w-4 text-purple-200" />
                  </Button>
                )}

                {onDelete && (
                  <DeleteConfirm
                    buttonVariant="ghost"
                    handleDelete={() => onDelete(share.id)}
                  />
                )}
              </div>
            ) : (
              share.type === "itinerary" &&
              onImport && (
                <Button
                  size="sm"
                  onClick={() => onImport(share)}
                  disabled={isImporting}
                  className="gap-1 bg-white text-purple-950 hover:bg-white/90 font-extrabold text-xs rounded-xl shadow-md"
                >
                  <Plus className="h-3.5 w-3.5 text-purple-700" />
                  {isImporting ? "Importing..." : "Import"}
                </Button>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};
