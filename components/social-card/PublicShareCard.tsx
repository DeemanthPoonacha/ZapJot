"use client";

import React from "react";
import { PublicShare } from "@/lib/services/publicShares";
import { THEME_PRESETS, CardTheme } from "./SocialCardCanvas";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Plus,
  Copy,
  MapPin,
  Calendar,
  Palette,
  Sparkles,
  Eye,
  LandPlot,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import DeleteConfirm from "@/components/ui/delete-confirm";
import ThemedCanvasImage from "@/components/layout/themed-image";
import { invertColor } from "@/lib/utils/colors";
import { Card } from "../ui/card";

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

  // Render Premium Theme Card for share.type === "theme"
  if (share.type === "theme" && share.themeColors) {
    const {
      primary,
      accent,
      background,
      foreground,
      secondary,
      border,
      gradient,
      ambientGradient,
      cardGradient,
    } = share.themeColors;

    const bgGradient =
      gradient || `linear-gradient(135deg, ${primary}, ${accent || secondary})`;
    const contrastPrimaryText = invertColor(primary);

    return (
      <Card
        className="group relative flex flex-col justify-between p-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden font-sans border border-white/15 min-h-[300px] text-foreground bg-card"
        style={{
          backgroundColor: background,
          color: foreground,
          backgroundImage: cardGradient,
          borderColor: border,
        }}
      >
        {/* Subtle background blur accents */}
        <div
          className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-2xl pointer-events-none opacity-40 transition-opacity group-hover:opacity-60"
          style={{ background: bgGradient }}
        />
        <div
          className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full blur-2xl pointer-events-none opacity-30"
          style={{ background: ambientGradient || bgGradient }}
        />

        {/* Content Body */}
        <div className="z-10 pb-2 space-y-3">
          {/* Top Preview Canvas Box */}
          <div
            className="relative w-full h-32 rounded-2xl overflow-hidden shadow-xs transition-all p-3 flex flex-col justify-between"
            // style={{
            //   borderColor: `color-mix(in srgb, ${border || primary} 35%, transparent)`,
            //   background:
            //     cardGradient ||
            //     `linear-gradient(135deg, color-mix(in srgb, ${background} 92%, ${primary} 8%), color-mix(in srgb, ${background} 78%, ${accent} 22%))`,
            // }}
            style={{
              background: bgGradient,
              color: contrastPrimaryText,
            }}
          >
            {/* Ambient Background Glow Effect */}
            <div
              className="absolute -top-10 -right-10 w-28 h-28 rounded-full blur-xl opacity-40 pointer-events-none"
              style={{ background: bgGradient }}
            />

            {/* Badge in Top Right */}
            <div
              className="absolute top-4.5 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-2xs z-20 flex items-center gap-1 border backdrop-blur-md"
              style={{
                backgroundColor: primary,
                color: contrastPrimaryText,
                borderColor: `color-mix(in srgb, ${contrastPrimaryText} 30%, transparent)`,
              }}
            >
              <Palette className="w-3 h-3" />
              Theme
            </div>

            {/* Header & Canvas Component Mockup */}
            <div className="space-y-2 z-10 pt-0.5">
              <Image
                className="absolute opacity-15 right-0 top-1/2 -translate-y-1/2 w-1/2 sm:w-1/3 pointer-events-none mix-blend-overlay"
                src="/z_icon.webp"
                alt="logo"
                width={300}
                height={300}
              />
              {/* Dashboard Sheen Card Component Mockup */}
              <div
                className="px-2.5 py-1.5 rounded-lg border text-[10px] font-medium flex items-center justify-between shadow-2xs backdrop-blur-xs "
                style={{
                  background:
                    ambientGradient ||
                    `linear-gradient(135deg, color-mix(in srgb, ${accent} 50%, transparent), ${background})`,
                  borderColor: `color-mix(in srgb, ${border || primary} 30%, transparent)`,
                  color: foreground,
                }}
              >
                <span className="opacity-80 text-xs truncate">
                  {share.title}
                </span>
                <span
                  className="w-2.5 h-2.5 rounded-full border shadow-2xs shrink-0"
                  style={{ backgroundColor: accent, borderColor: border }}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 px-1 pt-1.5 border-t border-border/30 z-10">
              <button
                className="px-3 py-1 rounded-md text-xs font-medium shadow-xs truncate"
                style={{
                  backgroundColor: primary,
                  color: contrastPrimaryText,
                }}
              >
                Primary
              </button>
              <button
                className="px-3 py-1 rounded-md text-xs font-medium shadow-xs truncate"
                style={{
                  background: accent,
                  color: invertColor(accent),
                }}
              >
                Accent
              </button>
              <button
                className="px-3 py-1 rounded-md text-xs font-medium shadow-xs truncate"
                style={{
                  backgroundColor: secondary,
                  color: foreground,
                }}
              >
                Secondary
              </button>
              <button
                className="px-3 py-1 rounded-md text-xs font-medium shadow-xs truncate"
                style={{
                  background: background,
                  color: foreground,
                }}
              >
                Background
              </button>
            </div>
            {/* Color Palette Swatches Row */}
            {/* <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div
                  className="w-full h-3.5 shadow-2xs shrink-0 transition-transform hover:scale-110"
                  style={{ backgroundColor: primary, borderColor: border }}
                  title={`Primary: ${primary}`}
                />
                <span className="text-[9px] font-mono opacity-70">Pri</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div
                  className="w-full h-3.5 shadow-2xs shrink-0 transition-transform hover:scale-110"
                  style={{ backgroundColor: accent, borderColor: border }}
                  title={`Accent: ${accent}`}
                />
                <span className="text-[9px] font-mono opacity-70">Acc</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div
                  className="w-full h-3.5 shadow-2xs shrink-0 transition-transform hover:scale-110"
                  style={{ backgroundColor: background, borderColor: border }}
                  title={`Background: ${background}`}
                />
                <span className="text-[9px] font-mono opacity-70">Bg</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div
                  className="w-full h-3.5 shadow-2xs shrink-0 transition-transform hover:scale-110"
                  style={{ backgroundColor: foreground, borderColor: border }}
                  title={`Foreground: ${foreground}`}
                />
                <span className="text-[9px] font-mono opacity-70">Fg</span>
              </div>
            </div> */}
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-1">
            <h3 className="text-xl font-black leading-snug tracking-tight line-clamp-1 drop-shadow-sm">
              {share.title}
            </h3>
            {share.subtitle && (
              <p className="text-xs font-semibold opacity-80 line-clamp-2 italic">
                “{share.subtitle}”
              </p>
            )}
          </div>
        </div>

        {/* Bottom Footer & Actions */}
        <div className="z-10 pt-3 border-t border-border/60 space-y-3">
          {/* Author & Date Metadata */}
          <div className="flex items-center justify-between text-xs opacity-90 font-medium">
            {share.authorName ? (
              <div className="flex items-center gap-2">
                {share.authorPhoto ? (
                  <div className="relative w-6 h-6 rounded-full overflow-hidden border border-border/40 shadow-xs shrink-0">
                    <Image
                      src={share.authorPhoto}
                      alt={share.authorName}
                      fill
                      className="object-cover !m-0"
                    />
                  </div>
                ) : (
                  <div
                    className="w-6 h-6 rounded-full font-extrabold text-[10px] flex items-center justify-center border shrink-0"
                    style={{
                      backgroundColor: primary,
                      color: contrastPrimaryText,
                    }}
                  >
                    {share.authorName.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="semibold truncate max-w-[120px]">
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
                onClick={() => onImport?.(share)}
                className="gap-1 font-extrabold text-xs rounded-xl shadow-md"
                style={{
                  backgroundColor: primary,
                  color: contrastPrimaryText,
                }}
              >
                <Sparkles className="h-3.5 w-3.5" />
                Install
              </Button>
            ) : (
              dateFormatted && (
                <div className="flex items-center gap-1 text-[11px] opacity-70">
                  <Calendar className="h-3 w-3" />
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
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition border shadow-xs hover:opacity-80"
                style={{
                  borderColor: border || primary,
                  color: foreground,
                  backgroundColor: `color-mix(in srgb, ${background} 80%, ${primary} 20%)`,
                }}
              >
                <Eye className="h-3.5 w-3.5" />
                View Theme
              </Link>

              {onImport && (
                <Button
                  size="sm"
                  onClick={() => onImport(share)}
                  disabled={isImporting}
                  className="gap-1 bg-white text-purple-950 hover:bg-white/90 font-extrabold text-xs rounded-xl shadow-md"
                  style={{
                    background: gradient,
                    color: contrastPrimaryText,
                  }}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  {isImporting ? "Applying..." : isOwner ? "Apply" : "Install"}
                </Button>
              )}

              {isOwner && (
                <div className="flex items-center gap-1">
                  {onDelete && (
                    <DeleteConfirm
                      buttonVariant="ghost"
                      handleDelete={() => onDelete(share.id)}
                    />
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    );
  }

  // Default Journal & Itinerary Card
  return (
    <div
      className={`group relative flex flex-col justify-between ${selectedTheme.bg} p-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden font-sans border border-white/15 min-h-[300px] text-white`}
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
            <span className="text-white flex items-center gap-1">
              {share.type === "itinerary" ? (
                <LandPlot className="h-3 w-3 text-white shrink-0" />
              ) : (
                <BookOpen className="h-3 w-3 text-white shrink-0" />
              )}
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
              <span className="semibold text-white/95 truncate max-w-[120px]">
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
