import React, { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Download, Share2, Sparkles, Check, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/sonner";
import { SocialCardCanvas, CardTheme, THEME_PRESETS } from "./SocialCardCanvas";
import { useAuth } from "@/lib/context/AuthProvider";
import { createPublicShare, getShareId } from "@/lib/services/publicShares";

import Image from "next/image";

interface SocialCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  excerpt?: string;
  date?: string;
  coverImage?: string;
  type?: "journal" | "itinerary";
  itemId?: string;
  rawItem?: any;
}

export const SocialCardModal: React.FC<SocialCardModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  excerpt,
  date,
  coverImage,
  type = "journal",
  itemId,
  rawItem,
}) => {
  const { user } = useAuth();
  const [selectedTheme, setSelectedTheme] = useState<CardTheme>("midnight");
  const [isGenerating, setIsGenerating] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleCreatePublicLink = async () => {
    if (!user) {
      toast.error("Please sign in to generate a public link");
      return;
    }
    setIsGenerating(true);
    try {
      const shareId = getShareId(
        type,
        itemId || title.toLowerCase().replace(/[^a-z0-9]/g, ""),
      );

      const authorName =
        user.displayName || user.email?.split("@")[0] || "ZapJot User";
      const authorPhoto = user.photoURL || undefined;

      const payload: any = {
        id: shareId,
        type,
        title,
        authorName,
      };

      if (authorPhoto) payload.authorPhoto = authorPhoto;
      if (subtitle) payload.subtitle = subtitle;
      if (rawItem?.content || excerpt)
        payload.content = rawItem?.content || excerpt;
      if (coverImage) payload.coverImage = coverImage;
      if (rawItem?.destination || rawItem?.location || subtitle)
        payload.destination =
          rawItem?.destination ||
          rawItem?.location ||
          subtitle?.replace("📍 ", "");
      if (rawItem?.days) payload.days = rawItem.days;

      const publicDoc = await createPublicShare(user.uid, payload);

      const publicUrl = `${window.location.origin}/share/${publicDoc.id}`;

      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(publicUrl);
        toast.success("Public Share Link copied to clipboard!");
      } else {
        toast.success(`Public Link: ${publicUrl}`);
      }
    } catch (err) {
      console.error("Error creating public link:", err);
      toast.error("Failed to generate public share link");
    } finally {
      setIsGenerating(false);
    }
  };

  const generatePngBlob = async () => {
    if (!cardRef.current) return null;
    return await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 });
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);
    try {
      const dataUrl = await generatePngBlob();
      if (!dataUrl) throw new Error("Could not generate image");

      const link = document.createElement("a");
      const filename = `${title.toLowerCase().replace(/[^a-z0-9]/g, "-")}-zapjot.png`;
      link.download = filename;
      link.href = dataUrl;
      link.click();
      toast.success("Social Card downloaded successfully!");
    } catch (err) {
      console.error("Error generating social card:", err);
      toast.error("Failed to generate image download");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShareImage = async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);
    try {
      const dataUrl = await generatePngBlob();
      if (!dataUrl) throw new Error("Could not generate image");

      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const filename = `${title.toLowerCase().replace(/[^a-z0-9]/g, "-")}-zapjot.png`;
      const file = new File([blob], filename, { type: "image/png" });

      if (
        typeof navigator !== "undefined" &&
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({
          files: [file],
          title: title,
          text: `Check out my ${type} on ZapJot!`,
        });
        toast.success("Shared successfully!");
      } else {
        // Fallback: download file
        const link = document.createElement("a");
        link.download = filename;
        link.href = dataUrl;
        link.click();
        toast.success("Saved image to device!");
      }
    } catch (err: any) {
      if (err?.name !== "AbortError") {
        console.error("Error sharing image:", err);
        toast.error("Sharing image failed");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2.5 text-xl font-extrabold">
            <Image
              src="/logo.webp"
              width={26}
              height={27}
              alt="ZapJot Logo"
              className="shadow-sm"
            />
            Social Media Card Generator
          </DialogTitle>
          <DialogDescription>
            Export a graphic post card to share on Instagram, Twitter, WhatsApp,
            or LinkedIn.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-2">
          {/* Theme Selector */}
          <div className="w-full">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
              Choose Card Theme
            </label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(THEME_PRESETS) as CardTheme[]).map((themeKey) => {
                const preset = THEME_PRESETS[themeKey];
                const isSelected = selectedTheme === themeKey;
                return (
                  <button
                    key={themeKey}
                    type="button"
                    onClick={() => setSelectedTheme(themeKey)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 border ${
                      isSelected
                        ? "ring-2 ring-purple-600 ring-offset-2 border-transparent font-semibold shadow-sm"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    <span className={`w-3 h-3 rounded-full ${preset.bg}`} />
                    {preset.name}
                    {isSelected && (
                      <Check className="h-3 w-3 text-purple-600 ml-0.5" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Card Canvas Live Preview */}
          <div className="w-full flex justify-center py-2 bg-muted/40 rounded-2xl p-4 border border-border">
            <SocialCardCanvas
              ref={cardRef}
              title={title}
              subtitle={subtitle}
              excerpt={excerpt}
              date={date}
              coverImage={coverImage}
              theme={selectedTheme}
              type={type}
              authorName={
                user?.displayName || user?.email?.split("@")[0] || "ZapJot User"
              }
              authorPhoto={user?.photoURL || undefined}
            />
          </div>

          {/* Export Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full">
            <Button
              className="w-full sm:flex-1 gap-2 bg-purple-600 hover:bg-purple-700 text-white"
              onClick={handleCreatePublicLink}
              disabled={isGenerating}
            >
              <Link2 className="h-4 w-4" />
              Copy Public Link
            </Button>
            <Button
              variant="outline"
              className="w-full sm:flex-1 gap-2"
              onClick={handleDownload}
              disabled={isGenerating}
            >
              <Download className="h-4 w-4" />
              Download PNG
            </Button>
            <Button
              variant="outline"
              className="w-full sm:flex-1 gap-2"
              onClick={handleShareImage}
              disabled={isGenerating}
            >
              <Share2 className="h-4 w-4" />
              Share Card
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
