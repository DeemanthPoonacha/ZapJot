import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Edit3,
  Share2,
  Globe,
  Eye,
  EllipsisVertical,
  Trash2,
} from "lucide-react";
import { Theme } from "@/types/themes";
import { ThemePreviewCard } from "./ThemePreviewCard";
import DeleteConfirm from "@/components/ui/delete-confirm";
import ThemedCanvasImage from "@/components/layout/themed-image";
import { useAuth } from "@/lib/context/AuthProvider";
import { getPublicShare, getShareId } from "@/lib/services/publicShares";
import { PublishThemeModal } from "./PublishThemeModal";
import { ThemePreviewModal } from "./ThemePreviewModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ThemeCardProps {
  theme: Theme;
  isActive: boolean;
  onThemeSelect: (themeId: string) => void;
  onEditTheme: (themeId: string) => void;
  onDeleteTheme: (themeId: string) => void;
}

export function ThemeCard({
  theme,
  isActive,
  onThemeSelect,
  onEditTheme,
  onDeleteTheme,
}: ThemeCardProps) {
  const { colors } = theme;
  const { user } = useAuth();
  const [isPublished, setIsPublished] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // Check if this theme is published to the Hub
  useEffect(() => {
    let isMounted = true;
    if (user && theme.id) {
      const shareId = getShareId("theme", theme.id);
      getPublicShare(shareId).then((share) => {
        if (isMounted) setIsPublished(!!share);
      });
    }
    return () => {
      isMounted = false;
    };
  }, [user, theme.id]);

  return (
    <>
      <Card
        className={`cursor-pointer flex flex-col rounded-xl border-2 transition-all duration-300 ${
          isActive
            ? "border-primary shadow-lg ring-2 ring-primary/30"
            : "border-muted/70 hover:border-primary/40"
        } overflow-hidden`}
        onClick={() => onThemeSelect(theme.id)}
        style={{
          backgroundColor: colors.background,
          backgroundImage: colors.cardGradient,
          color: colors.foreground,
        }}
      >
        {/* Header */}
        <div
          className="p-3 font-medium text-center border-b flex justify-between items-center"
          style={{ borderColor: colors.border }}
        >
          <div className="flex items-center gap-2">
            <ThemedCanvasImage
              src="/greyed_out_logo_md.svg"
              width={42}
              height={44}
              alt="logo"
              color={colors.primary}
              className={"shadow-sm rounded-[18%]"}
            />
            <span className="font-bold text-sm">{theme.name}</span>
            {isActive && (
              <span
                className="ml-1 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider"
                style={{
                  backgroundColor: colors.primary,
                  color: colors.background,
                }}
              >
                Active
              </span>
            )}
            {isPublished && (
              <span className="ml-1 flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-semibold bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/30">
                <Globe className="w-2.5 h-2.5" /> Hub
              </span>
            )}
          </div>

          <div
            className="flex gap-1 items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Eye Preview Modal Button */}
            <Button
              size="icon"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                setIsPreviewModalOpen(true);
              }}
              title="Preview Theme UI Components"
              className="h-8 w-8 text-xs"
              style={{
                backgroundColor: colors.background,
                color: colors.primary,
                borderColor: colors.primary,
              }}
            >
              <Eye className="w-3.5 h-3.5" />
            </Button>

            {theme.type === "custom" && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={(e) => e.stopPropagation()}
                    className="h-8 w-8 text-xs rounded-lg"
                    style={{
                      color: colors.foreground,
                    }}
                    title="Theme Options"
                  >
                    <EllipsisVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditTheme(theme.id);
                    }}
                    className="cursor-pointer flex items-center gap-2 text-xs font-semibold"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Theme</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsPublishModalOpen(true);
                    }}
                    className="cursor-pointer flex items-center gap-2 text-xs font-semibold"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>
                      {isPublished ? "Manage Hub Share" : "Publish to Hub"}
                    </span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <DeleteConfirm
                      itemName="theme"
                      handleDelete={(e) => {
                        e.stopPropagation();
                        onDeleteTheme(theme.id);
                      }}
                      trigger={
                        <span className="w-full flex items-center gap-2 text-xs font-semibold text-red-500 hover:text-red-600">
                          <Trash2 className="w-3.5 h-3.5 text-red-500" />
                          <span>Delete Theme</span>
                        </span>
                      }
                    />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Content preview */}
        <ThemePreviewCard colors={colors} />
      </Card>

      {/* Theme Preview Eye Modal */}
      {isPreviewModalOpen && (
        <ThemePreviewModal
          isOpen={isPreviewModalOpen}
          onClose={() => setIsPreviewModalOpen(false)}
          theme={theme}
          onThemeSelect={(themeId) => {
            onThemeSelect(themeId);
            setIsPreviewModalOpen(false);
          }}
        />
      )}

      {/* Publish Theme Dialog */}
      {isPublishModalOpen && (
        <PublishThemeModal
          isOpen={isPublishModalOpen}
          onClose={() => setIsPublishModalOpen(false)}
          theme={theme}
          onPublishStateChange={(published) => setIsPublished(published)}
        />
      )}
    </>
  );
}
