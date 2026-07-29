"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/lib/context/AuthProvider";
import { Skeleton } from "../ui/skeleton";
import { useTasks } from "@/lib/hooks/useTasks";
import { useGoals } from "@/lib/hooks/useGoals";
import { useEvents } from "@/lib/hooks/useEvents";
import { useItineraries } from "@/lib/hooks/useItineraries";
import { useChapters } from "@/lib/hooks/useChapters";
import { useCharacters } from "@/lib/hooks/useCharacters";
import { useTotalJournalsCount } from "@/lib/hooks/useJournals";
import dayjs from "dayjs";
import { Timestamp } from "firebase/firestore";
import { getPluralWord } from "@/lib/utils";
import Image from "next/image";
import {
  ListChecks,
  Target,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  LandPlot,
  BookOpen,
  Sparkles,
  ArrowUpRight,
  Trophy,
  Compass,
  Clock,
  CheckCircle2,
  Users,
  Flame,
  Feather,
  CheckSquare,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@/components/layout/link/CustomLink";
import { Progress } from "@/components/ui/progress";
import usePlanner from "@/lib/hooks/usePlanner";
import { Badge } from "@/components/ui/badge";

export function StatChip({
  icon,
  loading,
  count,
  label,
}: {
  icon: React.ReactNode;
  loading: boolean;
  count?: number;
  label: string;
}) {
  if (loading)
    return (
      <Skeleton className="h-7 w-28 rounded-full bg-primary-foreground/20" />
    );
  if (count === undefined || count === null) return null;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/20 px-3.5 py-1.5 text-xs font-semibold backdrop-blur-xs border border-primary-foreground/30 shadow-xs text-primary-foreground">
      {icon}
      {count} {getPluralWord(label, count)}
    </span>
  );
}

export function HomeHeader() {
  const { user, loading: authLoading } = useAuth();
  const { setSelectedTab } = usePlanner();

  // Domain Insights Data Hooks
  const { data: tasks, isLoading: taskLoading } = useTasks({ limit: 50 });
  const { data: goals, isLoading: goalLoading } = useGoals();
  const { data: events, isLoading: eventLoading } = useEvents({
    onlyUpcoming: true,
  });
  const { data: itineraries } = useItineraries();
  const { data: chapters } = useChapters();
  const { data: characters } = useCharacters();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);

  const slidesCount = 7;

  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % slidesCount);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + slidesCount) % slidesCount);
  };

  const today = dayjs();
  const todayEvents = events?.filter((event) => {
    const occ = event.nextOccurrence || event.date;
    if (!occ) return false;
    const occDate =
      typeof (occ as any)?.toDate === "function"
        ? (occ as Timestamp).toDate()
        : occ;
    return dayjs(occDate as Date | string).isSame(today, "day");
  });

  const completedTasksCount =
    tasks?.filter((t) => t.status === "completed").length || 0;
  const totalTasksCount = tasks?.length || 0;
  const taskProgressPercent =
    totalTasksCount > 0
      ? Math.round((completedTasksCount / totalTasksCount) * 100)
      : 0;

  const totalGoals = goals?.length || 0;
  const avgGoalProgress =
    totalGoals > 0
      ? Math.round(
          goals!.reduce(
            (acc, g) => acc + Math.min((g.progress / g.objective) * 100, 100),
            0,
          ) / totalGoals,
        )
      : 0;

  const totalChapters = chapters?.length || 0;
  const chapterIds = chapters?.map((c) => c.id) || [];
  const { data: totalJournalsCount } = useTotalJournalsCount(chapterIds);
  const totalJournals = totalJournalsCount || 0;
  const totalCharacters = characters?.length || 0;

  const nextUpcomingEvent = events?.[0];

  const greet = () =>
    user
      ? `Hello, ${user.displayName || user.email?.split("@")[0]}!`
      : "Hello!";

  const nextSlideIndex = (currentSlide + 1) % slidesCount;

  // Render individual slide card with 100% SOLID opaque base fill (0% transparency)
  const renderCardContent = (index: number) => {
    switch (index) {
      case 0:
        return (
          <Card className="relative overflow-hidden p-6 sm:p-7 bg-primary text-primary-foreground border-none shadow-xl rounded-3xl h-full flex flex-col justify-between group">
            {/* Solid Brand Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-primary pointer-events-none" />
            <Image
              className="absolute opacity-20 right-2 top-1/2 -translate-y-1/2 w-48 sm:w-64 pointer-events-none mix-blend-overlay group-hover:scale-105 transition-transform duration-500"
              src="/z_icon.webp"
              alt="logo"
              width={300}
              height={300}
              priority
            />

            {/* Header Row */}
            <div className="flex items-center justify-between z-10 relative">
              <Badge
                variant="secondary"
                className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30 font-bold text-xs uppercase tracking-widest px-3 py-1 backdrop-blur-xs"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1 animate-pulse" /> Daily
                Digest
              </Badge>
            </div>

            {/* Hero Middle Row */}
            <div className="z-10 relative space-y-1">
              <h1 className="text-2xl sm:text-3xl font-serif italic font-medium tracking-tight">
                {greet()}
              </h1>
              <p className="text-xs sm:text-sm opacity-90 font-medium">
                Here&apos;s your daily productivity & workspace snapshot.
              </p>
            </div>

            {/* Footer Meta Row */}
            <div className="flex flex-wrap items-center gap-2 z-10 relative pt-1">
              <StatChip
                icon={<ListChecks className="h-3.5 w-3.5" />}
                loading={taskLoading}
                count={tasks?.length}
                label="task"
              />
              <StatChip
                icon={<Target className="h-3.5 w-3.5" />}
                loading={goalLoading}
                count={goals?.length}
                label="goal"
              />
              <StatChip
                icon={<CalendarDays className="h-3.5 w-3.5" />}
                loading={eventLoading}
                count={todayEvents?.length}
                label="event"
              />
            </div>
          </Card>
        );

      case 1:
        return (
          <Card className="relative overflow-hidden p-6 sm:p-7 bg-background text-foreground border-2 shadow-xl rounded-3xl h-full flex flex-col justify-between">
            {/* Solid Base Fill + Accent Gradient */}
            <div className="absolute inset-0 bg-background pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background pointer-events-none" />
            <Image
              className="absolute right-2 top-1/2 -translate-y-1/2 w-48 sm:w-64 pointer-events-none mix-blend-overlay group-hover:scale-105 transition-transform duration-500"
              src="/z_icon.webp"
              alt="logo"
              width={300}
              height={300}
              priority
            />
            {/* Header Row */}
            <div className="flex items-center justify-between z-10 relative">
              <Badge
                variant="outline"
                className="bg-primary/15 text-primary border-primary/30 font-extrabold text-xs uppercase tracking-widest px-3 py-1 shadow-xs"
              >
                <Flame className="w-3.5 h-3.5 mr-1 fill-primary text-primary" />{" "}
                Task Mastery
              </Badge>
              <Link
                href="/planner"
                onClick={() => setSelectedTab("tasks")}
                className="px-3 py-1.5 rounded-xl bg-gradient-primary text-primary-foreground font-bold shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1 text-xs shrink-0"
              >
                <span>Tasks</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Hero Middle Row */}
            <div className="z-10 relative space-y-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                <span className="text-primary text-5xl">
                  {completedTasksCount}
                </span>{" "}
                of{" "}
                <span className="text-primary text-5xl">{totalTasksCount}</span>{" "}
                Tasks Done
              </h2>
            </div>

            {/* Footer Meta Row */}
            <div className="space-y-1.5 z-10 relative">
              <div className="flex justify-between text-xs font-extrabold text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CheckSquare className="w-3.5 h-3.5 text-primary" /> Overall
                  Productivity Gauge
                </span>
                <span className="text-primary font-bold text-sm">
                  {taskProgressPercent}%
                </span>
              </div>
              <Progress
                value={taskProgressPercent}
                className="h-2.5 bg-muted rounded-full"
              />
            </div>
          </Card>
        );

      case 2:
        return (
          <Card className="relative overflow-hidden p-6 sm:p-7 bg-background text-foreground border-2 shadow-xl rounded-3xl h-full flex flex-col justify-between">
            {/* Solid Base Fill + Accent Gradient */}
            <div className="absolute inset-0 bg-background pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-primary/20 to-background pointer-events-none" />
            <Image
              className="absolute opacity-50 right-2 top-1/2 -translate-y-1/2 w-48 sm:w-64 pointer-events-none mix-blend-overlay group-hover:scale-105 transition-transform duration-500"
              src="/z_icon.webp"
              alt="logo"
              width={300}
              height={300}
              priority
            />
            {/* Header Row */}
            <div className="flex items-center justify-between z-10 relative">
              <Badge
                variant="outline"
                className="bg-primary/15 text-primary border-primary/30 font-extrabold text-xs uppercase tracking-widest px-3 py-1 shadow-xs"
              >
                <CalendarDays className="w-3.5 h-3.5 mr-1 text-primary" />{" "}
                Agenda Spotlight
              </Badge>
              <Link
                href="/planner"
                onClick={() => setSelectedTab("events")}
                className="px-3 py-1.5 rounded-xl bg-gradient-primary text-primary-foreground font-bold shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1 text-xs shrink-0"
              >
                <span>Calendar</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Hero Middle Row */}
            <div className="z-10 relative space-y-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                <span className="text-primary text-5xl">
                  {events?.length || 0}
                </span>{" "}
                Upcoming {getPluralWord("Event", events?.length || 0)}
              </h2>
            </div>

            {/* Footer Meta Row */}
            <div className="z-10 relative">
              {nextUpcomingEvent ? (
                <div className="flex items-center gap-3 bg-muted border border-border p-2.5 rounded-2xl text-xs text-foreground font-semibold truncate shadow-xs">
                  <Clock
                    className="w-4 h-4 text-primary shrink-0 animate-spin"
                    style={{ animationDuration: "12s" }}
                  />
                  <span className="truncate">
                    Next:{" "}
                    <strong className="font-bold text-foreground">
                      {nextUpcomingEvent.title}
                    </strong>
                  </span>
                  {nextUpcomingEvent.time && (
                    <span className="ml-auto bg-primary/20 text-primary border border-primary/30 px-2.5 py-0.5 rounded-lg font-bold shrink-0">
                      {nextUpcomingEvent.time}
                    </span>
                  )}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">
                  No upcoming events scheduled right now.
                </p>
              )}
            </div>
          </Card>
        );

      case 3:
        return (
          <Card className="relative overflow-hidden p-6 sm:p-7 bg-background text-foreground border-2 shadow-xl rounded-3xl h-full flex flex-col justify-between">
            {/* Solid Base Fill + Accent Gradient */}
            <div className="absolute inset-0 bg-background pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-tl from-primary/25 via-background to-background pointer-events-none" />
            <Image
              className="absolute right-2 top-1/2 -translate-y-1/2 w-48 sm:w-64 pointer-events-none mix-blend-overlay group-hover:scale-105 transition-transform duration-500"
              src="/z_icon.webp"
              alt="logo"
              width={300}
              height={300}
              priority
            />
            {/* Header Row */}
            <div className="flex items-center justify-between z-10 relative">
              <Badge
                variant="outline"
                className="bg-primary/15 text-primary border-primary/30 font-extrabold text-xs uppercase tracking-widest px-3 py-1 shadow-xs"
              >
                <Trophy className="w-3.5 h-3.5 mr-1 text-primary" /> Goal
                Milestones
              </Badge>
              <Link
                href="/planner"
                onClick={() => setSelectedTab("goals")}
                className="px-3 py-1.5 rounded-xl bg-gradient-primary text-primary-foreground font-bold shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1 text-xs shrink-0"
              >
                <span>Goals</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Hero Middle Row */}
            <div className="z-10 relative space-y-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                <span className="text-primary text-5xl">
                  {avgGoalProgress}%
                </span>{" "}
                Avg. Completion
              </h2>
            </div>

            {/* Footer Meta Row */}
            <div className="flex items-center gap-2 z-10 relative">
              <Badge
                variant="secondary"
                className="px-3.5 py-1 rounded-full font-bold text-xs bg-primary/15 text-primary border border-primary/30 shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-primary" />
                {totalGoals} Active {getPluralWord("Goal", totalGoals)} Tracked
              </Badge>
            </div>
          </Card>
        );

      case 4:
        return (
          <Card className="relative overflow-hidden p-6 sm:p-7 bg-background text-foreground border-2 shadow-xl rounded-3xl h-full flex flex-col justify-between">
            {/* Solid Base Fill + Accent Gradient */}
            <div className="absolute inset-0 bg-background pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-tr from-background via-background to-primary/25 pointer-events-none" />
            <Image
              className="absolute right-2 top-1/2 -translate-y-1/2 w-48 sm:w-64 pointer-events-none mix-blend-overlay group-hover:scale-105 transition-transform duration-500"
              src="/z_icon.webp"
              alt="logo"
              width={300}
              height={300}
              priority
            />
            {/* Header Row */}
            <div className="flex items-center justify-between z-10 relative">
              <Badge
                variant="outline"
                className="bg-primary/15 text-primary border-primary/30 font-extrabold text-xs uppercase tracking-widest px-3 py-1 shadow-xs"
              >
                <Compass className="w-3.5 h-3.5 mr-1 text-primary" /> Travel &
                Journeys
              </Badge>
              <Link
                href="/planner"
                onClick={() => setSelectedTab("itineraries")}
                className="px-3 py-1.5 rounded-xl bg-gradient-primary text-primary-foreground font-bold shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1 text-xs shrink-0"
              >
                <span>Itineraries</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Hero Middle Row */}
            <div className="z-10 relative space-y-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                <span className="text-primary text-5xl">
                  {itineraries?.length || 0}
                </span>{" "}
                Planned {getPluralWord("Trip", itineraries?.length || 0)}
              </h2>
            </div>

            {/* Footer Meta Row */}
            <p className="text-xs text-muted-foreground font-medium z-10 relative">
              Organize daily trip itineraries, packing checklists, and travel
              budgets.
            </p>
          </Card>
        );

      case 5:
        return (
          <Card className="relative overflow-hidden p-6 sm:p-7 bg-background text-foreground border-2 shadow-xl rounded-3xl h-full flex flex-col justify-between">
            {/* Solid Base Fill + Accent Gradient */}
            <div className="absolute inset-0 bg-background pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-bl from-primary/25 via-background to-background pointer-events-none" />
            <Image
              className="absolute right-2 top-1/2 -translate-y-1/2 w-48 sm:w-64 pointer-events-none mix-blend-overlay group-hover:scale-105 transition-transform duration-500"
              src="/z_icon.webp"
              alt="logo"
              width={300}
              height={300}
              priority
            />
            {/* Header Row */}
            <div className="flex items-center justify-between z-10 relative">
              <Badge
                variant="outline"
                className="bg-primary/15 text-primary border-primary/30 font-extrabold text-xs uppercase tracking-widest px-3 py-1 shadow-xs"
              >
                <BookOpen className="w-3.5 h-3.5 mr-1 text-primary" /> Chapters
                & Journal
              </Badge>
              <Link
                href="/chapters"
                className="px-3 py-1.5 rounded-xl bg-gradient-primary text-primary-foreground font-bold shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1 text-xs shrink-0"
              >
                <span>Chapters</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Hero Middle Row */}
            <div className="z-10 relative space-y-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                <span className="text-primary text-5xl">{totalChapters}</span>{" "}
                {getPluralWord("Chapter", totalChapters)}
              </h2>
            </div>

            {/* Footer Meta Row */}
            <div className="flex items-center gap-2 z-10 relative">
              <Badge
                variant="secondary"
                className="px-3 py-1 rounded-full font-bold text-xs bg-primary/10 text-primary border border-primary/20"
              >
                <Feather className="w-3.5 h-3.5 mr-1.5 text-primary" />
                {totalJournals} {getPluralWord("Journal Note", totalJournals)}
                Encrypted Journals
              </Badge>
            </div>
          </Card>
        );

      case 6:
      default:
        return (
          <Card className="relative overflow-hidden p-6 sm:p-7 bg-background text-foreground border-2 shadow-xl rounded-3xl h-full flex flex-col justify-between">
            {/* Solid Base Fill + Accent Gradient */}
            <div className="absolute inset-0 bg-background pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-primary/25 to-background pointer-events-none" />
            <Image
              className="absolute opacity-50 right-2 top-1/2 -translate-y-1/2 w-48 sm:w-64 pointer-events-none mix-blend-overlay group-hover:scale-105 transition-transform duration-500"
              src="/z_icon.webp"
              alt="logo"
              width={300}
              height={300}
              priority
            />
            {/* Header Row */}
            <div className="flex items-center justify-between z-10 relative">
              <Badge
                variant="outline"
                className="bg-primary/15 text-primary border-primary/30 font-extrabold text-xs uppercase tracking-widest px-3 py-1 shadow-xs"
              >
                <Users className="w-3.5 h-3.5 mr-1 text-primary" /> Characters &
                Cast
              </Badge>
              <Link
                href="/characters"
                className="px-3 py-1.5 rounded-xl bg-gradient-primary text-primary-foreground font-bold shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1 text-xs shrink-0"
              >
                <span>Characters</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Hero Middle Row */}
            <div className="z-10 relative space-y-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                <span className="text-primary text-5xl">{totalCharacters}</span>{" "}
                Created {getPluralWord("Character", totalCharacters)}
              </h2>
            </div>

            {/* Footer Meta Row */}
            <p className="text-xs text-muted-foreground font-medium z-10 relative">
              Manage character bios, traits, relationships, and story cast
              profiles.
            </p>
          </Card>
        );
    }
  };

  if (authLoading) return <Skeleton className="h-56 rounded-3xl" />;

  return (
    <div className="space-y-4 w-full select-none">
      {/* Physical Card Deck Container (Fixed Height: h-[225px]) */}
      <div className="relative w-full h-[225px] p-1 overflow-visible">
        {/* CARD BEHIND IN THE DECK (Sitting underneath at scale 0.94, y: 8, opacity: 0.6) */}
        <motion.div
          animate={{
            scale: 0.94,
            y: 8,
            opacity: 0.6,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 28,
          }}
          style={{ willChange: "transform, opacity" }}
          className="absolute inset-1 z-0 pointer-events-none transform-gpu rounded-3xl overflow-hidden shadow-md"
        >
          {renderCardContent(nextSlideIndex)}
        </motion.div>

        {/* ACTIVE CARD ON TOP OF THE DECK (Swipes away to the left / Swipes on top from left) */}
        <AnimatePresence mode="popLayout" initial={false} custom={direction}>
          <motion.div
            key={currentSlide}
            custom={direction}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={(_, { offset, velocity }) => {
              const swipe = offset.x;
              if (swipe < -35 || velocity.x < -200) {
                nextSlide();
              } else if (swipe > 35 || velocity.x > 200) {
                prevSlide();
              }
            }}
            initial={
              direction > 0
                ? { opacity: 1, x: 0, scale: 0.94, y: 8 }
                : { opacity: 0, x: -350, scale: 0.96, rotate: -10 }
            }
            animate={{
              opacity: 1,
              x: 0,
              scale: 1,
              y: 0,
              rotate: 0,
            }}
            exit={
              direction > 0
                ? { opacity: 0, x: -350, scale: 0.96, rotate: -10 }
                : { opacity: 0, x: 350, scale: 0.96, rotate: 10 }
            }
            transition={{
              type: "spring",
              stiffness: 350,
              damping: 30,
              mass: 0.8,
            }}
            style={{ willChange: "transform, opacity" }}
            className="absolute inset-1 z-10 cursor-grab active:cursor-grabbing transform-gpu rounded-3xl overflow-hidden shadow-xl"
          >
            {renderCardContent(currentSlide)}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* EXTERNAL CONTROLS (Placed Outside Below - Hidden Arrow Buttons on Small Mobile Screens) */}
      <div className="flex items-center justify-center sm:justify-between px-1 pt-1">
        {/* Pagination Dots Indicator */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: slidesCount }).map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setDirection(idx > currentSlide ? 1 : -1);
                setCurrentSlide(idx);
              }}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentSlide
                  ? "w-8 bg-primary shadow-xs"
                  : "w-2.5 bg-muted-foreground/30 hover:bg-primary/50"
              }`}
              title={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* External Previous / Next Arrow Controls (Hidden on small mobile screens: hidden sm:flex) */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            type="button"
            onClick={prevSlide}
            className="p-2 rounded-xl bg-card border border-border/80 shadow-xs hover:bg-primary/10 hover:border-primary/40 text-foreground transition-all cursor-pointer"
            title="Previous insight"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            className="p-2 rounded-xl bg-card border border-border/80 shadow-xs hover:bg-primary/10 hover:border-primary/40 text-foreground transition-all cursor-pointer"
            title="Next insight"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
