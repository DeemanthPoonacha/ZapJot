import { useCharacters } from "@/lib/hooks/useCharacters";
import { Card, CardContent } from "@/components/ui/card";
import { UserCircle, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import CharacterCard from "./CharacterCard";

const CharactersList = () => {
  const { data: characters, isLoading } = useCharacters();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="grid gap-4 p-4 sm:grid-cols-1 md:garid-cols-2 lg:garid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-full flex-shrink-0" />
                <div className="space-y-2 w-full">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!characters?.length) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center h-64">
        <UserCircle className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2">No characters yet</h3>
        <p className="text-muted-foreground mb-6">
          Add characters to keep track of important people in your life
        </p>
        <Button onClick={() => router.push("/characters/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Create First Character
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <div className="grid gap-4 sm:grid-cols-1 md:garid-cols-2 lg:garid-cols-3">
        {characters.map((character) => (
          <CharacterCard key={character.id} character={character} />
        ))}
      </div>
    </div>
  );
};

export default CharactersList;
