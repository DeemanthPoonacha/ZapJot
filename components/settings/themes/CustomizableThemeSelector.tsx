"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ThemeCard } from "./ThemeCard";
import { ThemeFormDialog } from "./ThemeEditorDialog";
import { useSettings } from "@/lib/hooks/useSettings";

export function CustomizableThemeSelector() {
  const [mounted, setMounted] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditingId, setIsEditingId] = useState<string | null>(null);

  const {
    allThemes,
    handleDeleteTheme,
    handleThemeChange,
    isThemesLoading,
    currentTheme,
    updateTheme,
  } = useSettings();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCreateClick = () => {
    setIsEditingId(null);
    setIsDialogOpen(true);
  };

  const handleCreatedOrUpdated = async (themeId: string) => {
    closeDialog();
    // Force a small delay before switching themes
    setTimeout(() => handleThemeChange(themeId), 500);
  };

  const handleEditTheme = (themeId: string) => {
    const themeToEdit = allThemes.find((t) => t.id === themeId);
    if (themeToEdit) {
      setIsEditingId(themeId);
      setIsDialogOpen(true);
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setIsEditingId(null);
  };

  if (!mounted) {
    return null;
  }

  if (isThemesLoading) {
    return <div className="text-center py-8">Loading themes...</div>;
  }

  const groupedThemes = Object.groupBy(allThemes, ({ type }) => type);

  return (
    <div className="">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Themes</h2>

        <Button variant="outline" onClick={handleCreateClick}>
          <Plus /> Create Custom Theme
        </Button>
      </div>

      {Object.entries(groupedThemes).map(([key, themes]) => (
        <div className="mb-8" key={key}>
          <span className="flex items-center gap-2 mb-3 justify-between">
            {key.charAt(0).toUpperCase() + key.slice(1)} themes
            {key === "custom" && (
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditingId(null);
                  setIsDialogOpen(true);
                }}
              >
                <Plus /> Create Custom Theme
              </Button>
            )}
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {themes?.map((themeOption) => (
              <ThemeCard
                key={themeOption.id}
                theme={themeOption}
                isActive={currentTheme === themeOption.id}
                onThemeSelect={(themeId) => {
                  updateTheme(themeId);
                  handleThemeChange(themeId);
                }}
                onEditTheme={handleEditTheme}
                onDeleteTheme={handleDeleteTheme}
              />
            ))}
          </div>
        </div>
      ))}

      <ThemeFormDialog
        isOpen={isDialogOpen}
        onClose={closeDialog}
        onFinish={handleCreatedOrUpdated}
        editingTheme={
          isEditingId ? allThemes.find((t) => t.id === isEditingId) : undefined
        }
      />
    </div>
  );
}
