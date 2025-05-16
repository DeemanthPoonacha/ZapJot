import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { Theme, ThemeCreate, ThemeUpdate } from "@/types/themes";
import { defaultThemes } from "@/lib/constants";
import { useAuth } from "../context/AuthProvider";
import { db } from "../services/firebase";
import {
  addCustomCssVariables,
  removeCustomCssVariables,
} from "../utils/colors";
import { useTheme } from "next-themes";

export const THEMES_QUERY_KEY = "themes";

export function useCustomThemes() {
  const { systemTheme } = useTheme();

  const { user } = useAuth();
  const userId = user?.uid;
  const queryClient = useQueryClient();

  // Get the collection reference for the user's themes
  const themesCollectionRef = useMemo(() => {
    if (!userId) return null;
    return collection(db, `users/${userId}/themes`);
  }, [userId]);

  // Fetch themes from Firebase
  const {
    data: customThemes = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: [THEMES_QUERY_KEY, userId],
    queryFn: async () => {
      if (!themesCollectionRef) return [];

      const snapshot = await getDocs(themesCollectionRef);
      const themes: Theme[] = [];

      snapshot.forEach((doc) => {
        themes.push({ id: doc.id, ...doc.data() } as Theme);
      });

      return themes;
    },
    // Only run query if user is logged in
    enabled: !!userId,
  });

  // Add theme mutation
  const addThemeMutation = useMutation({
    mutationFn: async (theme: ThemeCreate) => {
      if (!themesCollectionRef) throw new Error("User not authenticated");

      // Use theme.id as document ID
      const themeDocRef = doc(themesCollectionRef);
      console.log("🚀 ~ mutationFn: ~ themeDocRef:", themeDocRef);
      const newTheme = {
        ...theme,
        id: themeDocRef.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await setDoc(themeDocRef, newTheme);
      return newTheme;
    },
    onSuccess: (newTheme) => {
      // Apply CSS variables
      addCustomCssVariables(newTheme);

      // Update cache
      queryClient.setQueryData(
        [THEMES_QUERY_KEY, userId],
        (oldData: Theme[] = []) => {
          return [...oldData.filter((t) => t.id !== newTheme.id), newTheme];
        }
      );
    },
  });

  // Update theme mutation
  const updateThemeMutation = useMutation({
    mutationFn: async ({
      themeId,
      theme,
    }: {
      themeId: string;
      theme: ThemeUpdate;
    }) => {
      if (!themesCollectionRef) throw new Error("User not authenticated");

      const themeDocRef = doc(themesCollectionRef, themeId);
      if (!themeDocRef) throw new Error("Theme not found");

      const updatedTheme = {
        ...theme,
        id: themeId,
        updatedAt: new Date().toISOString(),
      };
      await updateDoc(themeDocRef, updatedTheme);

      return updatedTheme;
    },
    onSuccess: (updatedTheme) => {
      // Apply CSS variables
      addCustomCssVariables(updatedTheme);

      // Update cache
      queryClient.setQueryData(
        [THEMES_QUERY_KEY, userId],
        (oldData: Theme[] = []) => {
          return oldData.map((t) =>
            t.id === updatedTheme.id ? updatedTheme : t
          );
        }
      );
    },
  });

  // Delete theme mutation
  const deleteThemeMutation = useMutation({
    mutationFn: async (themeId: string) => {
      if (!themesCollectionRef) throw new Error("User not authenticated");

      const themeDocRef = doc(themesCollectionRef, themeId);
      await deleteDoc(themeDocRef);

      return themeId;
    },
    onSuccess: (deletedThemeId) => {
      // Remove CSS style element
      removeCustomCssVariables(deletedThemeId);

      // Update cache
      queryClient.setQueryData(
        [THEMES_QUERY_KEY, userId],
        (oldData: Theme[] = []) => {
          return oldData.filter((t) => t.id !== deletedThemeId);
        }
      );
    },
  });

  // Combine default themes with custom themes
  const allThemes = useMemo(() => {
    defaultThemes[2] = {
      ...defaultThemes[2],
      colors:
        systemTheme === "dark"
          ? defaultThemes[1].colors
          : defaultThemes[0].colors,
    };
    return [...defaultThemes, ...customThemes];
  }, [customThemes, systemTheme]);

  // Apply CSS variables for all custom themes when loaded
  useMemo(() => {
    if (customThemes.length > 0) {
      customThemes.forEach((theme) => {
        addCustomCssVariables(theme);
      });
    }
  }, [customThemes]);

  return {
    customThemes,
    allThemes,
    isLoading,
    error,
    addTheme: addThemeMutation.mutateAsync,
    updateTheme: updateThemeMutation.mutateAsync,
    deleteTheme: deleteThemeMutation.mutateAsync,
    isCreating: addThemeMutation.isPending,
    isUpdating: updateThemeMutation.isPending,
    isDeleting: deleteThemeMutation.isPending,
  };
}
