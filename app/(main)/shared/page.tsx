"use client";

import React, { useEffect, useState } from "react";
import {
  getPublicShares,
  getUserPublicShares,
  deletePublicShare,
  PublicShare,
} from "@/lib/services/publicShares";
import { importPublicItinerary } from "@/lib/services/itineraries";
import { useAuth } from "@/lib/context/AuthProvider";
import { toast } from "@/components/ui/sonner";
import PageLayout from "@/components/layout/PageLayout";
import { CustomLoader } from "@/components/layout/CustomLoader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Share2,
  Globe,
  UserCheck,
  Search,
  MapPin,
  Calendar,
  Sparkles,
  Plus,
  Trash2,
  Copy,
  BookOpen,
  Link2,
} from "lucide-react";
import { PublicShareCard } from "@/components/social-card/PublicShareCard";
import Image from "next/image";
import { useRouter } from "next/navigation";
import DeleteConfirm from "@/components/ui/delete-confirm";

export default function SharedPage() {
  const router = useRouter();
  const { user } = useAuth();

  // Section mode: "public" vs "mine"
  const [sectionMode, setSectionMode] = useState<"public" | "mine">("mine");
  const [typeFilter, setTypeFilter] = useState<"all" | "itinerary" | "journal">(
    "all",
  );
  const [searchQuery, setSearchQuery] = useState("");

  const [publicShares, setPublicShares] = useState<PublicShare[]>([]);
  const [myShares, setMyShares] = useState<PublicShare[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [importingId, setImportingId] = useState<string | null>(null);

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      if (sectionMode === "public") {
        const data = await getPublicShares(typeFilter);
        setPublicShares(data);
      } else if (user) {
        const data = await getUserPublicShares(user.uid);
        setMyShares(data);
      }
    } catch (err) {
      console.error("Error fetching shares:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [sectionMode, typeFilter, user]);

  const handleImportItinerary = async (
    share: PublicShare,
    e?: React.MouseEvent,
  ) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!user) {
      toast.error("Please sign in to import itineraries into your planner");
      router.push("/auth/sign-in");
      return;
    }

    setImportingId(share.id);
    try {
      await importPublicItinerary(user.uid, share);
      toast.success("Itinerary imported into your planner!");
      router.push("/planner");
    } catch (err) {
      console.error("Error importing itinerary:", err);
      toast.error("Failed to import itinerary");
    } finally {
      setImportingId(null);
    }
  };

  const handleDeletePublicShare = async (shareId: string) => {
    try {
      await deletePublicShare(shareId);
      toast.success("Public share deleted successfully!");
      setMyShares((prev) => prev.filter((item) => item.id !== shareId));
      setPublicShares((prev) => prev.filter((item) => item.id !== shareId));
    } catch (err) {
      console.error("Error deleting share:", err);
      toast.error("Failed to delete public share");
    }
  };

  const handleCopyLink = async (shareId: string) => {
    const url = `${window.location.origin}/explore/${shareId}`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      toast.success("Public link copied to clipboard!");
    } else {
      toast.success(`Public link: ${url}`);
    }
  };

  const currentList = sectionMode === "public" ? publicShares : myShares;

  const filteredShares = currentList.filter((share) => {
    // Type filter for "mine" mode
    if (
      sectionMode === "mine" &&
      typeFilter !== "all" &&
      share.type !== typeFilter
    ) {
      return false;
    }
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      share.title.toLowerCase().includes(query) ||
      share.destination?.toLowerCase().includes(query) ||
      share.authorName?.toLowerCase().includes(query) ||
      share.content?.toLowerCase().includes(query)
    );
  });

  return (
    <PageLayout headerProps={{ title: "Shared Hub" }}>
      <div className="space-y-6 max-w-6xl mx-auto pb-12">
        {/* Main Section Mode Switcher (Public vs My Shares) */}
        <div className="flex items-center justify-center sm:justify-start gap-2 bg-muted p-1.5 rounded-2xl w-full sm:w-fit border border-border shadow-xs">
          <button
            type="button"
            onClick={() => setSectionMode("mine")}
            className={`flex-1 sm:flex-none px-5 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              sectionMode === "mine"
                ? "bg-gradient-primary text-primary-foreground shadow-md shadow-primary/20"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <UserCheck className="h-4 w-4" />
            My Public Shares ({myShares.length})
          </button>
          <button
            type="button"
            onClick={() => setSectionMode("public")}
            className={`flex-1 sm:flex-none px-5 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              sectionMode === "public"
                ? "bg-gradient-primary text-primary-foreground shadow-md shadow-primary/20"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Globe className="h-4 w-4" />
            Public Hub
          </button>
        </div>

        {/* Filter & Search Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card p-4 rounded-2xl border border-border shadow-xs">
          <div className="flex items-center gap-1.5 bg-muted p-1 rounded-xl w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setTypeFilter("all")}
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
                typeFilter === "all"
                  ? "bg-background text-primary shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All Types
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter("itinerary")}
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
                typeFilter === "itinerary"
                  ? "bg-background text-primary shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Itineraries
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter("journal")}
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
                typeFilter === "journal"
                  ? "bg-background text-primary shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Journals
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search title or destination..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs rounded-xl bg-background border-border"
            />
          </div>
        </div>

        {/* Content Body */}
        {isLoading ? (
          <div className="py-20 flex justify-center items-center">
            <CustomLoader />
          </div>
        ) : filteredShares.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-2xl border border-border p-8 space-y-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 dark:bg-purple-950/60 flex items-center justify-center mx-auto text-purple-600">
              <Share2 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-foreground">
              {sectionMode === "mine"
                ? "No Public Shares Yet"
                : "No Items Found"}
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              {sectionMode === "mine"
                ? "You haven't shared any journals or itineraries publicly. Open a journal or itinerary detail card to generate a public share link!"
                : searchQuery
                  ? `No posts matched "${searchQuery}".`
                  : "No shared items available right now."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredShares.map((share) => (
              <PublicShareCard
                key={share.id}
                share={share}
                isOwner={sectionMode === "mine"}
                onImport={(item) => handleImportItinerary(item)}
                onDelete={(id) => handleDeletePublicShare(id)}
                onCopyLink={(id) => handleCopyLink(id)}
                isImporting={importingId === share.id}
              />
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
