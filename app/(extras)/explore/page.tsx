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

  const handleImportItinerary = async (
    e: React.MouseEvent,
    share: PublicShare,
  ) => {
    e.preventDefault();
    e.stopPropagation();

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {filteredShares.map((share) => (
            <Card
              key={share.id}
              className="group hover:shadow-xl transition-all duration-300 border-border overflow-hidden flex flex-col justify-between rounded-2xl bg-card"
            >
              <div>
                {/* Banner / Cover Image */}
                <div className="relative w-full h-44 bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 overflow-hidden">
                  {share.coverImage ? (
                    <Image
                      src={share.coverImage}
                      alt={share.title}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-500 !m-0"
                      sizes="(max-width: 768px) 100vw, 400px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-6 text-center text-white/80">
                      <Sparkles className="h-8 w-8 text-purple-300 opacity-60 mb-2" />
                    </div>
                  )}

                  <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-10">
                    <Badge
                      variant="secondary"
                      className="bg-black/60 backdrop-blur-md text-white border border-white/20 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5"
                    >
                      {share.type === "itinerary" ? "Itinerary" : "Journal"}
                    </Badge>

                    {share.destination && (
                      <Badge
                        variant="secondary"
                        className="bg-purple-950/80 backdrop-blur-md text-purple-200 border border-purple-400/30 text-[10px] font-semibold flex items-center gap-1 max-w-[150px] truncate"
                      >
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="truncate">{share.destination}</span>
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Card Content Body */}
                <CardContent className="p-5 space-y-3">
                  {/* Author & Date Meta */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
                    {share.authorName ? (
                      <div className="flex items-center gap-2">
                        {share.authorPhoto ? (
                          <div className="relative w-6 h-6 rounded-full overflow-hidden border border-border shadow-xs shrink-0">
                            <Image
                              src={share.authorPhoto}
                              alt={share.authorName}
                              fill
                              className="object-cover !m-0"
                            />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-purple-600 text-white font-extrabold text-[10px] flex items-center justify-center shrink-0">
                            {share.authorName.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="font-semibold text-foreground truncate max-w-[120px]">
                          {share.authorName}
                        </span>
                      </div>
                    ) : (
                      <span />
                    )}

                    <div className="flex items-center gap-1 text-[11px]">
                      <Calendar className="h-3 w-3 text-purple-600" />
                      <span>
                        {new Date(share.createdAt).toLocaleDateString(
                          undefined,
                          {
                            dateStyle: "short",
                          },
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-lg text-foreground group-hover:text-purple-600 transition-colors line-clamp-2 leading-snug">
                    {share.title}
                  </h3>

                  {/* Excerpt / Subtitle */}
                  {(share.subtitle || share.content) && (
                    <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                      {share.subtitle ||
                        share.content?.replace(/<[^>]*>?/gm, "")}
                    </p>
                  )}
                </CardContent>
              </div>

              {/* Card Actions Footer */}
              <div className="p-4 pt-0 border-t border-border/50 mt-2 flex items-center gap-2">
                <Link
                  href={`/share/${share.id}`}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-muted hover:bg-purple-100 dark:hover:bg-purple-950/40 text-foreground text-xs font-semibold transition"
                >
                  {share.type === "itinerary" ? (
                    <>
                      <BookOpen className="h-3.5 w-3.5 text-purple-600" />
                      View Itinerary
                    </>
                  ) : (
                    <>
                      <BookOpen className="h-3.5 w-3.5 text-purple-600" />
                      Read Journal
                    </>
                  )}
                </Link>

                {share.type === "itinerary" && (
                  <Button
                    size="sm"
                    onClick={(e) => handleImportItinerary(e, share)}
                    disabled={importingId === share.id}
                    className="gap-1 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    {importingId === share.id ? "Importing..." : "Import"}
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
