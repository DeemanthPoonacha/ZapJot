"use client";

import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "@/components/ui/sonner";
import {
  Loader2,
  Search,
  CheckCircle2,
  Phone,
  UserCheck,
  Download,
  AlertCircle,
  Smartphone,
} from "lucide-react";
import { useAuth } from "@/lib/context/AuthProvider";
import {
  useCharacters,
  useCharacterMutations,
} from "@/lib/hooks/useCharacters";
import { linkGoogleContacts } from "@/lib/services/auth";
import {
  getContactsAccessToken,
  setContactsAccessToken,
  fetchGoogleContacts,
  mapGoogleContactToCharacter,
  GoogleContactRaw,
} from "@/lib/services/googleContacts";
import {
  isContactPickerSupported,
  pickPhoneContacts,
  mapPhoneContactToCharacter,
  PhoneContactRaw,
} from "@/lib/services/phoneContacts";
import { CharacterCreate } from "@/types/characters";
import { Google } from "@/components/ui/google-icon";

interface ImportContactsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ImportCandidate {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  image?: string;
  isAlreadyImported: boolean;
  existingCharacterId?: string;
  characterPayload: CharacterCreate;
}

export function ImportContactsDialog({
  open,
  onOpenChange,
}: ImportContactsDialogProps) {
  const { user } = useAuth();
  const userId = user?.uid;
  const { data: existingCharacters } = useCharacters();
  const { addMutation, updateMutation } = useCharacterMutations();

  const [isLoading, setIsLoading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [candidates, setCandidates] = useState<ImportCandidate[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [activeSource, setActiveSource] = useState<"google" | "phone" | null>(
    null,
  );

  // Map of existing googleContactId & normalized names to character ID
  const existingCharacterMap = useMemo(() => {
    const googleMap = new Map<string, string>();
    const nameMap = new Map<string, string>();
    existingCharacters?.forEach((char) => {
      if (char.googleContactId) {
        googleMap.set(char.googleContactId, char.id);
      }
      if (char.name) {
        nameMap.set(char.name.toLowerCase().trim(), char.id);
      }
    });
    return { googleMap, nameMap };
  }, [existingCharacters]);

  const handleFetchGoogleContacts = async () => {
    if (!userId) {
      toast.error("Please sign in to import contacts.");
      return;
    }

    setIsLoading(true);
    setActiveSource("google");
    try {
      let token = getContactsAccessToken();

      if (!token) {
        const credential = await linkGoogleContacts();
        if (credential && credential.accessToken) {
          token = credential.accessToken;
          setContactsAccessToken(token);
        } else {
          throw new Error("Could not obtain access token for Google Contacts.");
        }
      }

      const rawContacts = await fetchGoogleContacts(token);

      const parsedCandidates: ImportCandidate[] = rawContacts.map((raw) => {
        const payload = mapGoogleContactToCharacter(raw, userId);
        const existingCharacterId =
          (payload.googleContactId &&
            existingCharacterMap.googleMap.get(payload.googleContactId)) ||
          existingCharacterMap.nameMap.get(payload.name.toLowerCase().trim());

        return {
          id: raw.resourceName,
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          image: payload.image,
          isAlreadyImported: Boolean(existingCharacterId),
          existingCharacterId,
          characterPayload: payload,
        };
      });

      setCandidates(parsedCandidates);

      // Pre-select all candidates that are NOT already imported
      const initialSelected = new Set<string>();
      parsedCandidates.forEach((c) => {
        if (!c.isAlreadyImported) {
          initialSelected.add(c.id);
        }
      });
      setSelectedIds(initialSelected);

      if (parsedCandidates.length === 0) {
        toast.info("No contacts found in your Google account.");
      }
    } catch (err: any) {
      console.error("Failed to fetch Google contacts:", err);
      toast.error(err?.message || "Failed to load Google Contacts.");
      setActiveSource(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFetchPhoneContacts = async () => {
    if (!userId) {
      toast.error("Please sign in to import contacts.");
      return;
    }

    setIsLoading(true);
    setActiveSource("phone");
    try {
      const rawContacts = await pickPhoneContacts();

      const parsedCandidates: ImportCandidate[] = rawContacts.map(
        (raw, idx) => {
          const payload = mapPhoneContactToCharacter(raw, userId);
          const existingCharacterId = existingCharacterMap.nameMap.get(
            payload.name.toLowerCase().trim(),
          );

          return {
            id: `phone-${idx}-${payload.name}`,
            name: payload.name,
            email: payload.email,
            phone: payload.phone,
            isAlreadyImported: Boolean(existingCharacterId),
            existingCharacterId,
            characterPayload: payload,
          };
        },
      );

      setCandidates(parsedCandidates);

      const initialSelected = new Set<string>();
      parsedCandidates.forEach((c) => {
        if (!c.isAlreadyImported) {
          initialSelected.add(c.id);
        }
      });
      setSelectedIds(initialSelected);
    } catch (err: any) {
      console.error("Failed to pick phone contacts:", err);
      toast.error(err?.message || "Failed to pick phone contacts.");
      setActiveSource(null);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCandidates = useMemo(() => {
    if (!searchQuery.trim()) return candidates;
    const q = searchQuery.toLowerCase().trim();
    return candidates.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.phone?.includes(q),
    );
  }, [candidates, searchQuery]);

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredCandidates.length) {
      setSelectedIds(new Set());
    } else {
      const newSet = new Set<string>();
      filteredCandidates.forEach((c) => newSet.add(c.id));
      setSelectedIds(newSet);
    }
  };

  const toggleCandidate = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleImportSelected = async () => {
    const toImport = candidates.filter((c) => selectedIds.has(c.id));
    if (!toImport.length) {
      toast.error("Please select at least one contact to import.");
      return;
    }

    setIsImporting(true);
    let createdCount = 0;
    let updatedCount = 0;

    for (const candidate of toImport) {
      try {
        if (candidate.existingCharacterId) {
          // Update existing character with new/updated fields
          await updateMutation.mutateAsync({
            id: candidate.existingCharacterId,
            data: candidate.characterPayload,
          });
          updatedCount++;
        } else {
          // Add new character
          await addMutation.mutateAsync(candidate.characterPayload);
          createdCount++;
        }
      } catch (err) {
        console.error(`Failed to import/sync ${candidate.name}:`, err);
      }
    }

    setIsImporting(false);
    const messages = [];
    if (createdCount > 0) messages.push(`Created ${createdCount} character(s)`);
    if (updatedCount > 0)
      messages.push(`Updated ${updatedCount} existing character(s)`);
    toast.success(messages.join(" • ") || "Contacts processed successfully!");

    onOpenChange(false);
    // Reset state
    setCandidates([]);
    setSelectedIds(new Set());
    setActiveSource(null);
  };

  const hasPhoneSupport = isContactPickerSupported();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[85vh] flex flex-col p-6 gap-4 overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Download className="w-5 h-5 text-primary" /> Import Contacts to
            Characters
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Select Google Contacts or Phone Contacts to add them directly into
            your workspace characters list.
          </DialogDescription>
        </DialogHeader>

        {/* Source Selector Buttons */}
        {!activeSource && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-4">
            <Button
              variant="outline"
              onClick={handleFetchGoogleContacts}
              disabled={isLoading}
              className="h-24 flex flex-col items-center justify-center gap-2 border-2 border-dashed hover:border-primary hover:bg-primary/5 transition-all"
            >
              {isLoading && activeSource === "google" ? (
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              ) : (
                <Google className="w-6 h-6" />
              )}
              <span className="font-bold text-sm">Google Contacts</span>
              <span className="text-[11px] text-muted-foreground">
                Sync from Google Account
              </span>
            </Button>

            <Button
              variant="outline"
              onClick={handleFetchPhoneContacts}
              disabled={isLoading || !hasPhoneSupport}
              className="h-24 flex flex-col items-center justify-center gap-2 border-2 border-dashed hover:border-primary hover:bg-primary/5 transition-all disabled:opacity-50"
            >
              {isLoading && activeSource === "phone" ? (
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              ) : (
                <Smartphone className="w-6 h-6 text-primary" />
              )}
              <span className="font-bold text-sm">Phone Contacts</span>
              <span className="text-[11px] text-muted-foreground">
                {hasPhoneSupport
                  ? "Pick from device contacts"
                  : "Supported on Android Chrome"}
              </span>
            </Button>
          </div>
        )}

        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm font-medium text-muted-foreground">
              Fetching contacts...
            </p>
          </div>
        )}

        {/* Candidate Contacts List */}
        {!isLoading && candidates.length > 0 && (
          <div className="flex flex-col space-y-3 flex-1 overflow-hidden">
            {/* Search & Action Bar */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search contacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 text-xs"
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setCandidates([]);
                  setActiveSource(null);
                }}
                className="text-xs"
              >
                Change Source
              </Button>
            </div>

            {/* Select All Row */}
            <div className="flex items-center justify-between px-1 text-xs font-semibold text-muted-foreground border-b pb-2">
              <button
                type="button"
                onClick={toggleSelectAll}
                className="flex items-center gap-2 hover:text-foreground cursor-pointer"
              >
                <Checkbox
                  checked={
                    selectedIds.size === filteredCandidates.length &&
                    filteredCandidates.length > 0
                  }
                  onCheckedChange={toggleSelectAll}
                />
                <span>Select All ({selectedIds.size} selected)</span>
              </button>
              <span>{filteredCandidates.length} Contacts Found</span>
            </div>

            {/* Scrollable Contacts List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-[220px] max-h-[360px]">
              {filteredCandidates.map((c) => (
                <div
                  key={c.id}
                  onClick={() => toggleCandidate(c.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedIds.has(c.id)
                      ? "border-primary bg-primary/5 shadow-xs"
                      : "border-border/60 hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Checkbox
                      checked={selectedIds.has(c.id)}
                      onCheckedChange={() => toggleCandidate(c.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Avatar className="h-9 w-9 border shrink-0">
                      <AvatarImage src={c.image} alt={c.name} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                        {c.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {c.name}
                        </p>
                        {c.isAlreadyImported && (
                          <Badge
                            variant="outline"
                            className="text-[10px] px-1.5 py-0 border-primary/40 bg-primary/10 text-primary font-semibold"
                          >
                            Sync / Update
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {[c.email, c.phone].filter(Boolean).join(" • ") ||
                          "No email/phone"}
                      </p>
                      {c.isAlreadyImported && (
                        <span className="text-[10px] px-1.5 py-0 bg-muted text-muted-foreground font-normal">
                          Contact already added, can only sync/update from the
                          respective source
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <DialogFooter className="pt-2 border-t flex items-center justify-between sm:justify-between w-full">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          {candidates.length > 0 && (
            <Button
              size="sm"
              onClick={handleImportSelected}
              disabled={isImporting || selectedIds.size === 0}
              className="gap-2"
            >
              {isImporting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <UserCheck className="w-4 h-4" />
              )}
              {isImporting ? "Importing..." : `Import (${selectedIds.size})`}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
