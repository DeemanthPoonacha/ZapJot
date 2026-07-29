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
import { Plus, UserPlus } from "lucide-react";
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
      console.log("🚀 ~ handleDelete ~ error:", error);
      toast.error("Error deleting character");
    }
  };

  if (isLoading) return <CustomLoader />;

  return (
    <PageLayout
      headerProps={{
        title: character?.name || "Character",
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
      {isEditing ? (
        <CharacterForm
          character={character}
          // onUpdate={() => routerPush(`/characters`)}
          onCancel={() => setIsEditing(false)}
          onAdd={(id: string) => routerPush(`/characters/${id}`)}
        />
      ) : character ? (
        <>
          <CharacterCard character={character} vertical />

          {/* Invite to App Action Bar */}
          <div className="flex justify-center my-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsInviteOpen(true)}
              className="gap-2 border-primary/30 text-primary hover:bg-primary/10 font-medium"
            >
              <UserPlus className="w-4 h-4" />
              <span>Invite {character.name} to ZapJot</span>
            </Button>
          </div>

          {!!character?.reminders && (
            <EventsList
              key={character.reminders.length}
              query={{ eventIds: character?.reminders || [] }}
              addNewButton={
                <>
                  <Plus /> Add New
                </>
              }
              defaultNewEvent={{
                participants: [{ label: character.name, value: character.id }],
              }}
              groupByDate={false}
            />
          )}

          <InviteDialog
            character={character}
            open={isInviteOpen}
            onOpenChange={setIsInviteOpen}
          />
        </>
      ) : (
        <div className="flex h-[80vh] items-center justify-center">
          Could not load character data
        </div>
      )}
    </PageLayout>
  );
};

export default Character;
