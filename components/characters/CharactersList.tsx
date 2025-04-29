import { useCharacters } from "@/lib/hooks/useCharacters";
import { CardContent, ListCard, ListCardFooter } from "@/components/ui/card";
import { UserCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useNProgressRouter } from "../layout/link/CustomLink";
import CharacterCard from "./CharacterCard";
import Empty from "../Empty";

const CharactersList = () => {
  const { data: characters, isLoading } = useCharacters();
  const { routerPush } = useNProgressRouter();

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <ListCard key={i} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-full flex-shrink-0" />
                <div className="space-y-2 w-full">
                  <div className="flex items-center justify-between w-full">
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-5 w-10" />
                  </div>
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
            </CardContent>
            <ListCardFooter>
              <div className="flex items-center justify-between w-full">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-24" />
              </div>
            </ListCardFooter>
          </ListCard>
        ))}
      </div>
    );
  }

  if (!characters?.length) {
    return (
      <Empty
        icon={<UserCircle className="emptyIcon" />}
        handleCreateClick={() => routerPush("/characters/new")}
        title="No characters yet"
        subtitle="Add characters to keep track of important people in your life"
        buttonTitle="Create First Character"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        {characters.map((character) => (
          <CharacterCard key={character.id} character={character} />
        ))}
      </div>
    </div>
  );
};

export default CharactersList;
