"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getPublicShare, PublicShare } from "@/lib/services/publicShares";
import { CustomLoader } from "@/components/layout/CustomLoader";
import { WysiwygViewer } from "@/components/wysiwyg/viewer";
import { Sparkles, Calendar, MapPin, CheckSquare, Clock } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export default function PublicSharePage() {
  const { shareId } = useParams<{ shareId: string }>();
  const [share, setShare] = useState<PublicShare | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!shareId) return;

    let isMounted = true;
    getPublicShare(shareId as string)
      .then((data) => {
        if (isMounted) setShare(data);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [shareId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <CustomLoader />
      </div>
    );
  }

  if (!share) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background text-center">
        <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center mb-4 text-purple-600">
          <Sparkles className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Post Not Found</h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-sm">
          This share link might have expired, been unpublished, or is invalid.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-purple-600 text-white font-medium text-sm hover:bg-purple-700 transition"
        >
          Explore ZapJot
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-foreground flex flex-col">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-md">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-bold text-lg tracking-tight">ZapJot</span>
          </Link>

          <div className="flex items-center gap-3">
            <Badge variant="outline" className="hidden sm:inline-flex text-xs font-semibold uppercase tracking-wider text-purple-600 border-purple-200">
              Shared {share.type === "itinerary" ? "Itinerary" : "Journal"}
            </Badge>
            <Link
              href="/auth/sign-in"
              className="px-4 py-1.5 rounded-full bg-purple-600 text-white text-xs font-semibold hover:bg-purple-700 transition"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-8 space-y-6 my-4">
        {/* Title Header Card */}
        <div className="space-y-3 border-b border-border pb-6">
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
            <Calendar className="h-3.5 w-3.5 text-purple-600" />
            <span>{new Date(share.createdAt).toLocaleDateString(undefined, { dateStyle: "medium" })}</span>
            {share.authorName && (
              <>
                <span>•</span>
                <span>By {share.authorName}</span>
              </>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
            {share.title}
          </h1>

          {share.destination && (
            <p className="text-sm font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {share.destination}
            </p>
          )}
        </div>

        {/* Cover Image */}
        {share.coverImage && (
          <div className="relative w-full h-64 sm:h-96 rounded-3xl overflow-hidden shadow-lg border border-border">
            <Image src={share.coverImage} alt={share.title} fill className="object-cover" />
          </div>
        )}

        {/* Journal Content */}
        {share.type === "journal" && share.content && (
          <div className="prose dark:prose-invert max-w-none text-foreground leading-relaxed">
            <WysiwygViewer html={share.content} />
          </div>
        )}

        {/* Itinerary Days Content */}
        {share.type === "itinerary" && share.days && (
          <div className="space-y-6">
            {share.days.map((day, idx) => (
              <Card key={day.id || idx} className="border-border shadow-sm">
                <CardContent className="p-5 space-y-3">
                  <div className="flex justify-between items-baseline border-b border-border pb-2">
                    <h3 className="font-bold text-lg text-foreground">
                      {day.title || `Day ${idx + 1}`}
                    </h3>
                    {day.budget > 0 && (
                      <span className="text-xs font-semibold text-muted-foreground">
                        Budget: ${day.budget}
                      </span>
                    )}
                  </div>

                  {day.tasks && day.tasks.length > 0 ? (
                    <div className="space-y-2 pt-1">
                      {day.tasks.map((task: any) => (
                        <div key={task.id} className="flex items-center justify-between text-sm py-1 border-b border-border/40 last:border-0">
                          <div className="flex items-center gap-2">
                            <CheckSquare className={`h-4 w-4 ${task.completed ? "text-emerald-500" : "text-muted-foreground"}`} />
                            <span className={task.completed ? "line-through text-muted-foreground" : "text-foreground"}>
                              {task.title}
                            </span>
                          </div>
                          {task.time && (
                            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded flex items-center gap-1 font-mono">
                              <Clock className="h-3 w-3" />
                              {task.time}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">No activities listed for this day.</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4 text-center bg-background text-xs text-muted-foreground mt-auto">
        <div className="max-w-md mx-auto space-y-3">
          <p className="font-semibold text-foreground">Organize your life with ZapJot</p>
          <p className="text-muted-foreground">Journaling, task planning, and life tracking all in one place.</p>
          <Link
            href="/"
            className="inline-block px-5 py-2 rounded-full bg-purple-600 text-white font-medium hover:bg-purple-700 transition"
          >
            Create Your ZapJot Account
          </Link>
        </div>
      </footer>
    </div>
  );
}
