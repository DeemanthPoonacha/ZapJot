"use client";
import { useTheme } from "next-themes";
import { useCustomThemes } from "./useCustomThemes";
import { useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../services/firebase";

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
  const {
    data: userData,
    isLoading,
    error,
  } = useQuery({
    queryKey: [SETTINGS_QUERY_KEY, userId!],
    queryFn: async () => {
      if (!userRef) return {};

      const snapshot = await getDoc(userRef);
      return snapshot.exists() ? snapshot.data() : {};
    },
    // Only run query if user is logged in
    enabled: !!userId,
  });

  //update settings
  const { mutateAsync: updateSettings } = useMutation({
    mutationFn: async (data: { theme: string }) => {
      if (!userRef) return {};
      await setDoc(userRef, { settings: data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [SETTINGS_QUERY_KEY, userId!],
      });
    },
  });

  const { theme, setTheme } = useTheme();
  const {
    allThemes,
    isLoading: isThemesLoading,
    deleteTheme,
  } = useCustomThemes();

  const updateTheme = async (themeId: string) => {
    await updateSettings({ theme: themeId });
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
    updateTheme,
    handleThemeChange,
    handleDeleteTheme,
    allThemes,
    isThemesLoading,
    currentTheme: theme,
  };
};
