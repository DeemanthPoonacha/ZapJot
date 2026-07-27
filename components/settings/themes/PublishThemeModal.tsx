import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Globe, Link2, Trash2, Sparkles, Palette } from "lucide-react";
import { Theme } from "@/types/themes";
import { useAuth } from "@/lib/context/AuthProvider";
import {
  createPublicShare,
  deletePublicShare,
  getPublicShare,
  getShareId,
} from "@/lib/services/publicShares";
import { toast } from "@/components/ui/sonner";
import { ThemePreviewCard } from "./ThemePreviewCard";
import { PublicShareCard } from "@/components/social-card/PublicShareCard";

interface PublishThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: Theme;
  onPublishStateChange?: (published: boolean) => void;
}

export function PublishThemeModal({
  isOpen,
  onClose,
  theme,
  onPublishStateChange,
}: PublishThemeModalProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState(theme.name || "");
  const [description, setDescription] = useState(
    `A custom ${theme.name} color palette created for ZapJot.`,
  );
  const [isPublished, setIsPublished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  const shareId = getShareId("theme", theme.id);

  // Check if theme is currently published
  useEffect(() => {
    let isMounted = true;
    if (user && theme.id && isOpen) {
      setTitle(theme.name);
      setDescription(
        `A custom ${theme.name} color palette created for ZapJot.`,
      );

      getPublicShare(shareId).then((existingShare) => {
        if (isMounted && existingShare) {
          setIsPublished(true);
          setTitle(existingShare.title || theme.name);
          if (existingShare.subtitle) setDescription(existingShare.subtitle);
          setShareUrl(`${window.location.origin}/explore/${shareId}`);
        } else if (isMounted) {
          setIsPublished(false);
          setShareUrl(null);
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, [user, theme.id, isOpen, shareId]);

  const handlePublish = async () => {
    if (!user) {
      toast.error("Please sign in to publish themes to the Hub");
      return;
    }

    setIsSubmitting(true);
    try {
      const publicDoc = await createPublicShare(user.uid, {
        id: shareId,
        type: "theme",
        title: title || theme.name,
        subtitle: description,
        themeColors: theme.colors,
        authorName:
          user.displayName || user.email?.split("@")[0] || "ZapJot Creator",
        authorPhoto: user.photoURL || undefined,
      });

      const generatedUrl = `${window.location.origin}/explore/${publicDoc.id}`;
      setShareUrl(generatedUrl);
      setIsPublished(true);
      if (onPublishStateChange) onPublishStateChange(true);
      toast.success("Theme published to Explore Hub!");
    } catch (err) {
      console.error("Error publishing theme:", err);
      toast.error("Failed to publish theme to Hub");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUnpublish = async () => {
    setIsSubmitting(true);
    try {
      await deletePublicShare(shareId);
      setIsPublished(false);
      setShareUrl(null);
      if (onPublishStateChange) onPublishStateChange(false);
      toast.success("Theme unpublished from Hub");
    } catch (err) {
      console.error("Error unpublishing theme:", err);
      toast.error("Failed to unpublish theme");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyLink = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Public theme share link copied!");
    } catch (err) {
      toast.error(`Public Link: ${shareUrl}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Globe className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            Publish Theme to Community Hub
          </DialogTitle>
          <DialogDescription>
            Share your custom color palette and gradients with the ZapJot
            community.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Theme Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Display Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Neon Cyberpunk Glow"
              className="text-sm font-medium"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Description / Tagline
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your theme palette..."
              rows={2}
              className="text-xs resize-none"
            />
          </div>

          {/* Live Preview Card */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Hub Card Preview
            </label>
            <div className="overflow-hidden rounded-xl p-4 border shadow-xs pointer-events-none">
              <PublicShareCard
                share={{
                  id: shareId,
                  type: "theme",
                  title: title || theme.name,
                  subtitle: description,
                  themeColors: theme.colors,
                  authorName:
                    user?.displayName ||
                    user?.email?.split("@")[0] ||
                    "ZapJot Creator",
                  authorPhoto: user?.photoURL || undefined,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  userId: user?.uid || "",
                }}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          {isPublished ? (
            <>
              <Button
                variant="outline"
                onClick={handleCopyLink}
                className="flex-1 gap-1.5 text-xs border-purple-400 text-purple-600 dark:text-purple-300"
              >
                <Link2 className="w-4 h-4" />
                Copy Share Link
              </Button>

              <Button
                variant="destructive"
                onClick={handleUnpublish}
                disabled={isSubmitting}
                className="gap-1.5 text-xs"
              >
                <Trash2 className="w-4 h-4" />
                Unpublish
              </Button>
            </>
          ) : (
            <Button
              onClick={handlePublish}
              disabled={isSubmitting}
              className="w-full gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold"
            >
              <Globe className="w-4 h-4" />
              {isSubmitting ? "Publishing..." : "Publish to Hub"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
