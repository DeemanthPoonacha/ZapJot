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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-purple-50/40 to-slate-100 dark:from-slate-950 dark:via-purple-950/20 dark:to-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/95 text-white border-b border-slate-800 px-4 py-3 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/logo.webp"
              width={34}
              height={35}
              alt="ZapJot Logo"
              className="shadow-md"
            />
            <span className="font-extrabold text-xl tracking-tight text-white">
              ZapJot
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className="hidden sm:inline-flex text-xs font-semibold uppercase tracking-wider text-purple-300 border-purple-400/40 bg-purple-500/10 px-3 py-1"
            >
              Shared {share.type === "itinerary" ? "Itinerary" : "Journal"}
            </Badge>
            <Link
              href="/auth/sign-in"
              className="px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-purple-600/20 transition"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 sm:py-12">
        {/* Main Content Card Container */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200/80 dark:border-slate-800 space-y-6">
          {/* Title & Metadata */}
          <div className="space-y-3 border-b border-slate-100 dark:border-slate-800 pb-6">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-purple-700 dark:text-purple-300 font-semibold">
              <Calendar className="h-4 w-4 text-purple-600" />
              <span>
                {new Date(share.createdAt).toLocaleDateString(undefined, {
                  dateStyle: "long",
                })}
              </span>
              {share.authorName && (
                <>
                  <span className="text-slate-400">•</span>
                  <span>By {share.authorName}</span>
                </>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-slate-50 leading-tight">
              {share.title}
            </h1>

            {share.destination && (
              <p className="text-base font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                <MapPin className="h-4.5 w-4.5" />
                {share.destination}
              </p>
            )}
          </div>

          {/* Cover Image */}
          {share.coverImage && (
            <div className="relative w-full h-64 sm:h-96 rounded-2xl overflow-hidden shadow-md border border-slate-200 dark:border-slate-800">
              <Image
                src={share.coverImage}
                alt={share.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Journal Rich Text Body */}
          {share.type === "journal" && share.content && (
            <div className="text-slate-800 dark:text-slate-200 text-base sm:text-lg leading-relaxed space-y-4 font-normal [&_*]:!text-slate-800 dark:[&_*]:!text-slate-200">
              <WysiwygViewer html={share.content} />
            </div>
          )}

          {/* Itinerary Days List */}
          {share.type === "itinerary" && share.days && (
            <div className="space-y-6 pt-2">
              {share.days.map((day, idx) => (
                <Card
                  key={day.id || idx}
                  className="border border-slate-200 dark:border-slate-800 shadow-sm bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl"
                >
                  <CardContent className="p-5 space-y-4">
                    <div className="flex justify-between items-baseline border-b border-slate-200 dark:border-slate-800 pb-2">
                      <h3 className="font-extrabold text-lg text-slate-900 dark:text-slate-100">
                        {day.title || `Day ${idx + 1}`}
                      </h3>
                      {day.budget > 0 && (
                        <span className="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/40 px-2.5 py-1 rounded-full">
                          Budget: ${day.budget}
                        </span>
                      )}
                    </div>

                    {day.tasks && day.tasks.length > 0 ? (
                      <div className="space-y-2.5">
                        {day.tasks.map((task: any) => (
                          <div
                            key={task.id}
                            className="flex items-center justify-between text-sm py-1.5 border-b border-slate-100 dark:border-slate-800/60 last:border-0"
                          >
                            <div className="flex items-center gap-2.5">
                              <CheckSquare
                                className={`h-4 w-4 ${task.completed ? "text-emerald-500" : "text-slate-400"}`}
                              />
                              <span
                                className={`font-medium ${task.completed ? "line-through text-slate-400" : "text-slate-800 dark:text-slate-200"}`}
                              >
                                {task.title}
                              </span>
                            </div>
                            {task.time && (
                              <span className="text-xs text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-950/60 font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 font-mono">
                                <Clock className="h-3 w-3" />
                                {task.time}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">
                        No activities listed for this day.
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-10 px-4 text-center bg-white dark:bg-slate-900 text-xs text-slate-500 dark:text-slate-400 mt-auto">
        <div className="max-w-md mx-auto space-y-3">
          <p className="font-bold text-base text-slate-900 dark:text-slate-100">
            Organize your life with ZapJot
          </p>
          <p className="text-slate-600 dark:text-slate-400">
            Journaling, task planning, and life tracking all in one place.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold hover:from-purple-500 hover:to-indigo-500 transition shadow-md"
          >
            Create Your ZapJot Account
          </Link>
        </div>
      </footer>
    </div>
  );
}
