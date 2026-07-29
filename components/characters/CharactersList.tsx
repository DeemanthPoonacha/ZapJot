"use client";

import { useState, useMemo } from "react";
import { useCharacters } from "@/lib/hooks/useCharacters";
import { ListCard, CardContent, ListCardFooter } from "@/components/ui/card";
import { UserCircle, Download, UserPlus, Search, X, Users, Filter } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNProgressRouter } from "../layout/link/CustomLink";
import CharacterCard from "./CharacterCard";
import Empty from "../Empty";
import { ImportContactsDialog } from "./ImportContactsDialog";
import { motion, AnimatePresence } from "framer-motion";

type FilterSource = "all" | "google" | "manual";

const CharactersList = () => {
  const { data: characters, isLoading } = useCharacters();
  const { routerPush } = useNProgressRouter();
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState<FilterSource>("all");

  const filteredCharacters = useMemo(() => {
    if (!characters) return [];
    return characters.filter((char) => {
      // Search matching
      const matchesSearch =
        searchQuery.trim() === "" ||
        char.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (char.title && char.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (char.email && char.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (char.phone && char.phone.includes(searchQuery));

      // Source filter matching
      const matchesSource =
        sourceFilter === "all" ||
        (sourceFilter === "google" && char.source === "google") ||
        (sourceFilter === "manual" && (!char.source || char.source === "manual"));

      return matchesSearch && matchesSource;
    });
  }, [characters, searchQuery, sourceFilter]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-muted/60 rounded-xl animate-pulse w-full max-w-sm" />
        <div className="grid md:grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-card/60 border border-border/60 p-4 animate-pulse flex items-center gap-4">
              <Skeleton className="h-14 w-14 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!characters?.length) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center pb-2">
          <Button
            variant="outline"
            onClick={() => setIsImportOpen(true)}
            className="gap-2 border-dashed border-primary/40 hover:border-primary text-primary"
          >
            <Download className="w-4 h-4" />
            <span>Import Contacts (Google / Phone)</span>
          </Button>
        </div>

        <Empty
          icon={<UserCircle className="emptyIcon text-primary/60" />}
          handleCreateClick={() => routerPush("/characters/new")}
          title="No characters yet"
          subtitle="Add characters to keep track of important people in your life"
          buttonTitle="Create First Character"
        />

        <ImportContactsDialog open={isImportOpen} onOpenChange={setIsImportOpen} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search & Filter Toolbar Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search characters by name, title, email..."
            className="pl-10 pr-9 bg-card/70 border-border/70 rounded-xl focus:border-primary"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter Pills & Actions */}
        <div className="flex items-center justify-between sm:justify-end gap-3 flex-wrap">
          <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border/60">
            <button
              onClick={() => setSourceFilter("all")}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                sourceFilter === "all"
                  ? "bg-card text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All ({characters.length})
            </button>
            <button
              onClick={() => setSourceFilter("google")}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                sourceFilter === "google"
                  ? "bg-card text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Google
            </button>
            <button
              onClick={() => setSourceFilter("manual")}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                sourceFilter === "manual"
                  ? "bg-card text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Manual
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsImportOpen(true)}
            className="gap-1.5 text-xs border-primary/30 hover:bg-primary/10 text-primary font-medium rounded-xl"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Import Contacts</span>
          </Button>
        </div>
      </div>

      {/* Characters Cards Grid */}
      {filteredCharacters.length > 0 ? (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredCharacters.map((character) => (
              <motion.div
                key={character.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <CharacterCard character={character} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="text-center py-12 rounded-2xl border border-dashed border-border/60 bg-muted/20 space-y-3">
          <UserCircle className="h-10 w-10 text-muted-foreground mx-auto" />
          <p className="text-sm font-medium text-muted-foreground">
            No characters found matching "{searchQuery}"
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchQuery("");
              setSourceFilter("all");
            }}
            className="text-xs text-primary"
          >
            Reset Filters
          </Button>
        </div>
      )}

      <ImportContactsDialog open={isImportOpen} onOpenChange={setIsImportOpen} />
    </div>
  );
};

export default CharactersList;
