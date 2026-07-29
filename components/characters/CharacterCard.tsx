"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "@/components/layout/link/CustomLink";
import {
  User,
  Bell,
  Mail,
  Phone,
  Calendar,
  Sparkles,
  ExternalLink,
  BookUser,
  Contact,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Character } from "@/types/characters";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CardContent, ListCard } from "../ui/card";
import { Google } from "@/components/ui/google-icon";

interface CharacterCardProps {
  character: Character;
  vertical?: boolean;
}

const CharacterCard = ({ character, vertical }: CharacterCardProps) => {
  const reminderCount = character.reminders?.length || 0;

  // Vertical Hero Card View (Used in Character Detail Page)
  if (vertical) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-br from-primary/15 via-card to-card p-6 sm:p-8 shadow-sm backdrop-blur-md">
        {/* Subtle Ambient Glow Effect */}
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col items-center text-center space-y-5 relative z-10">
          {/* Avatar with Theme Ring */}
          <div className="relative">
            <Avatar className="h-28 w-28 sm:h-36 sm:w-36 border-4 border-background shadow-xl ring-2 ring-primary/20">
              <AvatarImage
                src={character.image}
                alt={character.name}
                className="object-cover"
              />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-3xl">
                <User className="h-14 w-14 text-primary" />
              </AvatarFallback>
            </Avatar>
            {character.source && character.source !== "manual" && (
              <span className="absolute flex gap-1 bottom-0 right-0 bg-background text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-primary shadow">
                {character.source === "google" ? (
                  <>
                    <Google className="w-3 h-3 shrink-0" />
                    <span>Google import</span>
                  </>
                ) : (
                  <>
                    <Contact className="w-3 h-3 shrink-0" />
                    <span>Contacts Import</span>
                  </>
                )}
              </span>
            )}
          </div>

          {/* Character Name & Title */}
          <div className="space-y-1.5 max-w-md">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {character.name}
            </h1>
            {character.title && (
              <p className="text-sm font-medium text-muted-foreground bg-primary/5 border border-primary/10 px-3 py-1 rounded-full inline-block">
                {character.title}
              </p>
            )}
          </div>

          {/* Quick Contact Chips & Actions */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {character.email && (
              <a
                href={`mailto:${character.email}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card hover:bg-muted text-xs font-medium border border-border/80 text-foreground transition-all hover:border-primary/40 shadow-xs"
              >
                <Mail className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>{character.email}</span>
                <ExternalLink className="w-3 h-3 opacity-50 ml-0.5" />
              </a>
            )}

            {character.phone && (
              <a
                href={`tel:${character.phone}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card hover:bg-muted text-xs font-medium border border-border/80 text-foreground transition-all hover:border-primary/40 shadow-xs"
              >
                <Phone className="w-3 h-3 text-primary shrink-0" />
                <span>{character.phone}</span>
              </a>
            )}

            {reminderCount > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
                <Bell className="w-3.5 h-3.5" />
                <span>
                  {reminderCount} Linked Event{reminderCount !== 1 ? "s" : ""}
                </span>
              </span>
            )}
          </div>

          {/* Personal Notes Card Block */}
          {character.notes && (
            <div className="w-full mt-4 p-4 rounded-2xl bg-card/80 border border-border/60 text-left text-sm text-muted-foreground leading-relaxed shadow-xs">
              <span className="block text-xs font-bold uppercase tracking-wider text-primary mb-1">
                Notes
              </span>
              <p className="whitespace-pre-line">{character.notes}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Grid / List Card View
  return (
    <Link href={`/characters/${character.id}`}>
      <ListCard className="group">
        <CardContent className="p-4">
          {/* Subtle hover accent line */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/0 group-hover:bg-primary transition-all duration-300" />

          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="h-14 w-14 border-2 border-border/70 group-hover:border-primary/40 transition-colors shrink-0">
                <AvatarImage
                  src={character.image}
                  alt={character.name}
                  className="object-cover"
                />
                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                  <User className="h-7 w-7 text-primary" />
                </AvatarFallback>
              </Avatar>
              {character.source && character.source !== "manual" && (
                <span className="absolute bottom-0 right-0 bg-background text-primary-foreground text-[10px] font-bold p-0.5 rounded-full border-2 border-background shadow flex items-center gap-1">
                  {character.source === "google" ? (
                    <Google className="w-3 h-3 shrink-0" />
                  ) : (
                    <Contact className="w-3 h-3 shrink-0 text-primary" />
                  )}
                </span>
              )}
            </div>

            {/* Content Details */}
            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-semibold text-base sm:text-lg truncate group-hover:text-primary transition-colors">
                  {character.name}
                </h2>

                <div className="flex">
                  {reminderCount > 0 && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge
                            variant="secondary"
                            className="flex items-center gap-1 px-2 py-0.5 text-xs bg-primary/10 text-primary border border-primary/20 shrink-0 font-medium"
                          >
                            <Bell className="h-3 w-3" />
                            <span>{reminderCount}</span>
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent className="rounded-lg text-xs">
                          <p>
                            {reminderCount} linked event
                            {reminderCount !== 1 ? "s" : ""}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </div>

              <div className="w-full flex items-center justify-between">
                {(character.title || character.phone || character.email) && (
                  <p className="text-xs font-medium text-muted-foreground truncate">
                    {character.title || character.phone || character.email}
                  </p>
                )}

                {(character.email || character.phone) && (
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground ml-auto pt-1">
                    {character.email && (
                      <span className="flex items-center gap-1.5 truncate">
                        <Mail className="w-3 h-3 text-primary shrink-0" />
                        {/* <span className="truncate">{character.email}</span> */}
                      </span>
                    )}
                    {character.phone && (
                      <span className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-primary shrink-0" />
                        {/* <span>{character.phone}</span> */}
                      </span>
                    )}
                  </div>
                )}
              </div>
              {/* 
            {character.notes && (
              <p className="text-xs text-muted-foreground/80 line-clamp-1 pt-1 border-t border-border/40 mt-2">
                {character.notes}
              </p>
            )} */}
            </div>
          </div>
        </CardContent>
      </ListCard>
    </Link>
  );
};

export default CharacterCard;
