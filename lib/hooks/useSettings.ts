"use client";
import { useTheme } from "next-themes";
import { useCustomThemes } from "./useCustomThemes";
import { useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import {
  NotificationsSettingsUpdate,
  SettingsUpdate,
  UserSettings,
} from "@/types/settings";

export const SETTINGS_QUERY_KEY = "settings";

export const useSettings = () => {
  const { user } = useAuth();
  const userId = user?.uid;
  const queryClient = useQueryClient();

  // Get the collection reference for the user's themes
  const userRef = useMemo(() => {
    if (!userId) return null;
    return doc(db, `users/${userId}`);
  }, [userId]);

  // Fetch themes from Firebase
  const { data: userData, isLoading: isSettingsLoading } = useQuery({
    queryKey: [SETTINGS_QUERY_KEY, userId!],
    queryFn: async () => {
      if (!userRef) return null;

      const snapshot = await getDoc(userRef);

      return snapshot.exists() ? (snapshot.data() as UserSettings) : null;
    },
    // Only run query if user is logged in
    enabled: !!userId,
  });

  //update settings
  const { mutateAsync: updateSettings, isPending: isSettingsUpdating } =
    useMutation({
      mutationFn: async (data: SettingsUpdate) => {
        if (!userRef) return {};
        await setDoc(userRef, {
          settings: {
            ...userData?.settings,
            ...data,
            updatedAt: new Date().toISOString(),
          },
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [SETTINGS_QUERY_KEY, userId!],
        });
      },
    });

  const updateNotificationSettings = async (
    notificationSettings: NotificationsSettingsUpdate
  ) => {
    await updateSettings({
      notifications: {
        ...userData?.settings?.notifications,
        ...notificationSettings,
      },
    });
  };

  const { theme, setTheme } = useTheme();
  const {
    allThemes,
    isLoading: isThemesLoading,
    deleteTheme,
  } = useCustomThemes();

  const updateTheme = async (themeId: string) => {
    await updateSettings({
      theme: themeId,
    });
  };

  const handleThemeChange = async (themeName: string) => {
    if (theme !== themeName) {
      // Clear all existing theme classes
      document.documentElement.className = "";
      setTheme(themeName);
    }
  };

  const handleDeleteTheme = async (themeId: string) => {
    try {
      await deleteTheme(themeId);

      // If we're deleting the active theme, switch to light
      if (theme === themeId) {
        setTheme("light");
      }
    } catch (error) {
      console.error("Failed to delete theme:", error);
    }
  };

  useEffect(() => {
    if (userData?.settings?.theme && userData?.settings?.theme !== theme) {
      handleThemeChange(userData.settings.theme);
    }
  }, [userData?.settings?.theme]);

  return {
    settings: userData?.settings,
    updateSettings,
    updateNotificationSettings,
    updateTheme,
    handleThemeChange,
    handleDeleteTheme,
    allThemes,
    isThemesLoading,
    currentTheme: theme,
    isSettingsLoading,
    isSettingsUpdating,
  };
};
