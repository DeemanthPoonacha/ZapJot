import { useCharacters } from "@/lib/hooks/useCharacters";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const CharactersList = () => {
  const { data: characters, isLoading } = useCharacters();
  const router = useRouter();

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="grid gap-4 p-4">
      {characters?.map((character) => (
        <Link href={`/characters/${character.id}`} key={character.id}>
          <Card className="flex items-center gap-4 p-4 hover:bg-accent transition-colors">
            <div className="relative h-16 w-16 rounded-full overflow-hidden">
              <Image
                src={character.image || "/placeholder.svg"}
                alt={character.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold">{character.name}</h3>
              {character.title && (
                <p className="text-sm text-muted-foreground">
                  {character.title}
                </p>
              )}
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default CharactersList;
