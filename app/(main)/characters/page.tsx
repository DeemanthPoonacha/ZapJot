"use client";
import CharactersList from "@/components/characters/CharactersList";
import { useNProgressRouter } from "@/components/layout/link/CustomLink";
import PageLayout from "@/components/layout/PageLayout";

const Characters = () => {
  const { routerPush } = useNProgressRouter();

  return (
    <PageLayout
      headerProps={{ title: "Characters" }}
      floatingButtonProps={{
        label: "New Character",
        onClick: () => routerPush("/characters/new"),
      }}
    >
      <CharactersList />
    </PageLayout>
  );
};

export default Characters;
