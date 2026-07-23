"use client";

import React, { useEffect, useState } from "react";
import { getPublicShares, PublicShare } from "@/lib/services/publicShares";
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
  Compass,
  Search,
  MapPin,
  Calendar,
  Sparkles,
  Plus,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PublicShareCard } from "@/components/social-card/PublicShareCard";

export default function ExplorePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [shares, setShares] = useState<PublicShare[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "itinerary" | "journal">(
    "all",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [importingId, setImportingId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    getPublicShares(activeTab)
      .then((data) => {
        if (isMounted) setShares(data);
      })
      .catch((err) => {
        console.error("Error fetching explore items:", err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [activeTab]);

  const handleImportItinerary = async (share: PublicShare) => {
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

  const filteredShares = shares.filter((share) => {
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
    <div className="flex min-h-screen flex-col items-center w-full py-6 gap-4">
      {/* Banner Section */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 p-6 sm:p-10 text-white shadow-xl border border-white/10 w-full">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3 max-w-2xl">
          <Badge className="bg-purple-500/20 text-purple-200 border-purple-400/30 uppercase tracking-wider text-xs font-semibold px-3 py-1">
            <Compass className="h-3.5 w-3.5 mr-1 text-purple-300" />
            Community Discover
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Explore Shared Itineraries & Journals
          </h1>
          <p className="text-purple-200/90 text-sm sm:text-base leading-relaxed">
            Discover hand-crafted travel guides, trip itineraries, and journal
            entries shared by the ZapJot community. Import itineraries into your
            planner with one click!
          </p>
        </div>
      </div>

      {/* Filter & Search Bar Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card p-4 rounded-2xl border border-border shadow-sm w-full">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 bg-muted p-1 rounded-xl w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === "all"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All Posts
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("itinerary")}
            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === "itinerary"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Itineraries
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("journal")}
            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === "journal"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Journals
          </button>
        </div>

        {/* Keyword Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search guides, destinations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs rounded-xl bg-background border-border"
          />
        </div>
      </div>

      {/* Content Loading State */}
      {isLoading ? (
        <div className="py-20 flex justify-center items-center">
          <CustomLoader />
        </div>
      ) : filteredShares.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-2xl border border-border p-8 space-y-3 w-full">
          <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-950/60 flex items-center justify-center mx-auto text-purple-600">
            <Compass className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-foreground">
            No Shared Items Found
          </h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            {searchQuery
              ? `No posts matched "${searchQuery}". Try a different search term.`
              : "No publicly shared items yet. Be the first to share your trip or journal!"}
          </p>
        </div>
      ) : (
        /* Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
          {filteredShares.map((share) => (
            <PublicShareCard
              key={share.id}
              share={share}
              onImport={(item) => handleImportItinerary(item)}
              isImporting={importingId === share.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
