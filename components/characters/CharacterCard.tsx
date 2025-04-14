import { CardContent, ListCard } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "@/components/layout/link/CustomLink";
import { User, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Character } from "@/types/characters";

const CharacterCard = ({ character }: { character: Character }) => {
  return (
    <Link
      href={`/characters/${character.id}`}
      key={character.id}
      className="transition-transform hover:scale-[1.02] focus:outline-none rounded-lg"
    >
      <ListCard>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-background">
              <AvatarImage
                src={character.image}
                alt={character.name}
                className="object-cover"
              />
              <AvatarFallback className="bg-primary/10">
                <User className="h-8 w-8 text-primary" />
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col w-full overflow-hidden">
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-semibold text-xl truncate">
                  {character.name}
                </h2>

                {character.reminders?.length > 0 && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge
                          variant="secondary"
                          className="flex items-center gap-1 px-2"
                        >
                          <Bell size={14} />
                          <span>{character.reminders.length}</span>
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {character.reminders.length} reminder
                          {character.reminders.length !== 1 ? "s" : ""}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>

              {character.title && (
                <p className="text-sm text-muted-foreground truncate">
                  {character.title}
                </p>
              )}

              {character.notes && (
                <p className="text-sm mt-2 line-clamp-2 text-muted-foreground">
                  {character.notes}
                </p>
              )}
            </div>
          </div>
        </CardContent>

        {/* <ListCardFooter>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>
              {character.updatedAt
                ? new Date(character.updatedAt).toLocaleDateString()
                : "No updates"}
            </span>
          </div>

          {character.reminders && character.reminders.length > 0 && (
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>
                {character.reminders.length} event
                {character.reminders.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </ListCardFooter> */}
      </ListCard>
    </Link>
  );
};

export default CharacterCard;
