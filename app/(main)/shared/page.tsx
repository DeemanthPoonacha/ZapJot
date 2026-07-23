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
import Link from "next/link";
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
    const url = `${window.location.origin}/share/${shareId}`;
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
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
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
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
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
                  ? "bg-background text-foreground shadow-xs"
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
                  ? "bg-background text-foreground shadow-xs"
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
                  ? "bg-background text-foreground shadow-xs"
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
            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-950/60 flex items-center justify-center mx-auto text-purple-600">
              <Share2 className="h-6 w-6" />
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
                        className="object-cover group-hover:scale-105 transition duration-500"
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

                  {/* Body Content */}
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
                      {share.authorName ? (
                        <div className="flex items-center gap-2">
                          {share.authorPhoto ? (
                            <div className="relative w-6 h-6 rounded-full overflow-hidden border border-border shadow-xs shrink-0">
                              <Image
                                src={share.authorPhoto}
                                alt={share.authorName}
                                fill
                                className="object-cover"
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

                    <h3 className="font-bold text-lg text-foreground group-hover:text-purple-600 transition-colors line-clamp-2 leading-snug">
                      {share.title}
                    </h3>

                    {(share.subtitle || share.content) && (
                      <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                        {share.subtitle ||
                          share.content?.replace(/<[^>]*>?/gm, "")}
                      </p>
                    )}
                  </CardContent>
                </div>

                {/* Footer Actions */}
                <div className="p-4 pt-0 border-t border-border/50 mt-2 flex items-center gap-2">
                  <Link
                    href={`/share/${share.id}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-muted hover:bg-purple-100 dark:hover:bg-purple-950/40 text-foreground text-xs font-semibold transition"
                  >
                    <BookOpen className="h-3.5 w-3.5 text-purple-600" />
                    View Post
                  </Link>

                  {sectionMode === "mine" ? (
                    <>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleCopyLink(share.id)}
                        className="h-9 w-9 rounded-xl"
                        title="Copy Public Link"
                      >
                        <Copy className="h-4 w-4 text-purple-600" />
                      </Button>

                      <DeleteConfirm
                        buttonVariant="ghost"
                        handleDelete={() => handleDeletePublicShare(share.id)}
                      />
                    </>
                  ) : (
                    share.type === "itinerary" && (
                      <Button
                        size="sm"
                        onClick={(e) => handleImportItinerary(e, share)}
                        disabled={importingId === share.id}
                        className="gap-1 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        {importingId === share.id ? "Importing..." : "Import"}
                      </Button>
                    )
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
