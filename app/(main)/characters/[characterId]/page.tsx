"use client";
import CharacterCard from "@/components/characters/CharacterCard";
import CharacterForm from "@/components/characters/CharacterForm";
import { CustomLoader } from "@/components/layout/CustomLoader";
import { useNProgressRouter } from "@/components/layout/link/CustomLink";
import PageLayout from "@/components/layout/PageLayout";
import MenuDropdown from "@/components/MenuDropdown";
import EventsList from "@/components/planner/events/EventsList";
import { toast } from "@/components/ui/sonner";
import { useCharacter, useCharacterMutations } from "@/lib/hooks/useCharacters";
import { Plus } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useState } from "react";

const Character = () => {
  const { characterId } = useParams();
  const { routerPush } = useNProgressRouter();

  const { data: character, isLoading } = useCharacter(characterId! as string);

  const isNewCharacter = characterId === "new";
  const [isEditing, setIsEditing] = useState(isNewCharacter);

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
