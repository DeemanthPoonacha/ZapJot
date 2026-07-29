"use client";

import CharacterCard from "@/components/characters/CharacterCard";
import CharacterForm from "@/components/characters/CharacterForm";
import { CustomLoader } from "@/components/layout/CustomLoader";
import { useNProgressRouter } from "@/components/layout/link/CustomLink";
import PageLayout from "@/components/layout/PageLayout";
import MenuDropdown from "@/components/MenuDropdown";
import EventsList from "@/components/planner/events/EventsList";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { useCharacter, useCharacterMutations } from "@/lib/hooks/useCharacters";
import { Plus, UserPlus, Calendar, Sparkles } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { InviteDialog } from "@/components/characters/InviteDialog";

const Character = () => {
  const { characterId } = useParams();
  const { routerPush } = useNProgressRouter();

  const { data: character, isLoading } = useCharacter(characterId! as string);

  const isNewCharacter = characterId === "new";
  const [isEditing, setIsEditing] = useState(isNewCharacter);
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const { deleteMutation } = useCharacterMutations();
  const handleDelete = async () => {
    try {
      if (character?.id) {
        await deleteMutation.mutateAsync(character.id);
        routerPush(`/characters`);
        toast.success("Character deleted successfully");
      }
    } catch (error) {
      console.error("🚀 ~ handleDelete ~ error:", error);
      toast.error("Error deleting character");
    }
  };

  if (isLoading) return <CustomLoader />;

  return (
    <PageLayout
      headerProps={{
        title: isEditing
          ? isNewCharacter
            ? "New Character"
            : `Edit ${character?.name || "Character"}`
          : character?.name || "Character Details",
        backLink: "/characters",
        extra: character?.id && (
          <MenuDropdown
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            handleDelete={handleDelete}
            deleteItemName="Character"
          />
        ),
      }}
    >
      <div className="container max-w-4xl mx-auto space-y-8 pb-20">
        {isEditing ? (
          <div className="rounded-3xl border border-border/70 bg-card/60 p-6 sm:p-8 shadow-sm backdrop-blur-md">
            <CharacterForm
              character={character}
              onCancel={() => setIsEditing(false)}
              onAdd={(id: string) => routerPush(`/characters/${id}`)}
            />
          </div>
        ) : character ? (
          <>
            {/* Hero Character Card */}
            <CharacterCard character={character} vertical />

            {/* Invite & Quick Action Bar */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsInviteOpen(true)}
                className="gap-2 border-primary/30 text-primary hover:bg-primary/10 font-semibold rounded-xl px-4 shadow-xs"
              >
                <UserPlus className="w-4 h-4" />
                <span>Invite {character.name.split(" ")[0]} to ZapJot</span>
              </Button>
            </div>

            {/* Linked Events & Reminders Section */}
            <div className="space-y-4 pt-4 border-t border-border/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <h2 className="text-lg font-bold">Linked Events & Reminders</h2>
                </div>
              </div>

              {!!character?.reminders && (
                <EventsList
                  key={character.reminders.length}
                  query={{ eventIds: character?.reminders || [] }}
                  addNewButton={
                    <>
                      <Plus className="h-4 w-4" /> Add Event
                    </>
                  }
                  defaultNewEvent={{
                    participants: [{ label: character.name, value: character.id }],
                  }}
                  groupByDate={false}
                />
              )}
            </div>

            <InviteDialog
              character={character}
              open={isInviteOpen}
              onOpenChange={setIsInviteOpen}
            />
          </>
        ) : (
          <div className="flex h-[50vh] items-center justify-center text-muted-foreground text-sm font-medium">
            Could not load character details
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Character;
