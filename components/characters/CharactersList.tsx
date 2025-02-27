import { useCharacters } from "@/lib/hooks/useCharacters";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { User, Bell, UserCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const CharactersList = () => {
  const { data: characters, isLoading } = useCharacters();

  if (isLoading) {
    return (
      <div className="grid gap-4 p-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2 w-full">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!characters?.length) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <UserCircle className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2">No characters yet</h3>
        <p className="text-muted-foreground">
          Create your first character to get started
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 p-4 ">
      {characters.map((character) => (
        <Link
          href={`/characters/${character.id}`}
          key={character.id}
          className="transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
        >
          <Card className="h-full overflow-hidden hover:shadow-md transition-all">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 flex-shrink-0">
                  {character.image ? (
                    <Image
                      src={character.image}
                      alt={character.name}
                      width={64}
                      height={64}
                      className="object-cover w-16 h-16 rounded-full border-2 border-background"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full">
                      <User className="h-8 w-8 text-primary" />
                    </div>
                  )}
                </div>

                <div className="flex flex-col w-full overflow-hidden">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="font-semibold text-xl truncate">
                      {character.name}
                    </h2>

                    {character.reminders?.length > 0 && (
                      <div className="flex items-center gap-1 text-primary">
                        <Bell size={16} />
                        <span>{character.reminders.length}</span>
                      </div>
                    )}
                  </div>

                  {character.title && (
                    <p className="text-sm text-muted-foreground truncate">
                      {character.title}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default CharactersList;
