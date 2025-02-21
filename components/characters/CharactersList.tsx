import { useCharacters } from "@/lib/hooks/useCharacters";
import CharacterForm from "./CharacterForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";

const CharactersList = () => {
  const { data: characters, isLoading } = useCharacters();
  const router = useRouter();

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {characters?.map((character) => (
          <Card
            key={character.id}
            onClick={() => router.push(`/characters/${character.id}`)}
          >
            <CardContent className="p-4 cursor-pointer">
              <h3 className="font-bold">{character.name}</h3>
              <p className="text-sm text-gray-600">{character.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Button>Add Character</Button>
      <CharacterForm />
    </div>
  );
};

export default CharactersList;
