import { useState } from "react";
import { useCharacters } from "@/lib/hooks/useCharacters";
import { CardContent, ListCard, ListCardFooter } from "@/components/ui/card";
import { UserCircle, Download, UserPlus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useNProgressRouter } from "../layout/link/CustomLink";
import CharacterCard from "./CharacterCard";
import Empty from "../Empty";
import { ImportContactsDialog } from "./ImportContactsDialog";

const CharactersList = () => {
  const { data: characters, isLoading } = useCharacters();
  const { routerPush } = useNProgressRouter();
  const [isImportOpen, setIsImportOpen] = useState(false);

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
      <>
        <div className="flex justify-center pb-2">
          <Button
            variant="outline"
            onClick={() => setIsImportOpen(true)}
            className="gap-2 border-dashed border-primary/40 hover:border-primary text-primary"
          >
            <Download className="w-4 h-4" />
            <span>Import Contacts (Google / Phone)</span>
          </Button>
        </div>

        <Empty
          icon={<UserCircle className="emptyIcon" />}
          handleCreateClick={() => routerPush("/characters/new")}
          title="No characters yet"
          subtitle="Add characters to keep track of important people in your life"
          buttonTitle="Create First Character"
        />

        <ImportContactsDialog open={isImportOpen} onOpenChange={setIsImportOpen} />
      </>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions Bar */}
      <div className="flex items-center justify-between gap-3 border-b border-border/60 pb-3">
        <p className="text-xs font-semibold text-muted-foreground">
          {characters.length} Character{characters.length !== 1 ? "s" : ""}
        </p>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsImportOpen(true)}
          className="gap-1.5 text-xs border-primary/30 hover:bg-primary/10 text-primary font-medium"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Import Contacts</span>
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {characters.map((character) => (
          <CharacterCard key={character.id} character={character} />
        ))}
      </div>

      <ImportContactsDialog open={isImportOpen} onOpenChange={setIsImportOpen} />
    </div>
  );
};

export default CharactersList;
