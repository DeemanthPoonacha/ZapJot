import { useState } from "react";
import { format } from "date-fns";
import Image from "next/image";
import {
  CalendarDays,
  MapPin,
  Wallet,
  ChevronUp,
  Calendar,
  CreditCard,
  Edit,
  ChevronRight,
  CopyMinus,
  CopyPlus,
  Printer,
  Sparkles,
  FileText,
  Copy,
  MoreVertical,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  CardContent,
  CardHeader,
  CardTitle,
  ListCard,
  ListCardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DeleteConfirm from "../../ui/delete-confirm";
import {
  Itinerary,
  ItineraryDayType,
  ItineraryTask,
} from "@/types/itineraries";
import { toast } from "../../ui/sonner";
import { useItineraryMutations } from "@/lib/hooks/useItineraries";
import { AnimatePresence, motion } from "framer-motion";
import usePlanner from "@/lib/hooks/usePlanner";
import { ItineraryDay } from "./ItineraryItemCard";
import { BudgetSummary } from "./BudgetSummary";
import { shareContent } from "@/lib/utils/share";
import { PrintableItinerary } from "./PrintableItinerary";
import { SocialCardModal } from "@/components/social-card/SocialCardModal";
import { cn } from "@/lib/utils";
// import dayjs from "dayjs";

interface ItineraryDetailProps {
  itinerary: Itinerary;
  onEditClick?: () => void;
  onDelete?: () => void;
}

const ItineraryDetailCard: React.FC<ItineraryDetailProps> = ({
  itinerary,
  onEditClick,
  onDelete,
}) => {
  const { selectedItineraryId, setSelectedItineraryId } = usePlanner();
  const { deleteMutation } = useItineraryMutations();
  const [isSocialCardOpen, setIsSocialCardOpen] = useState(false);

  const expandedMain = selectedItineraryId === itinerary.id;

  // Check if the day is today by start date and index
  // const currentDay = itinerary.days.find(
  //   (day: any, index) =>
  //     dayjs(itinerary.startDate).add(index, "day").format("YYYY-MM-DD") ===
  //     dayjs().format("YYYY-MM-DD")
  // );
  // console.log("🚀 ~ currentDay:", currentDay);

  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>(
    // currentDay?.id
    //   ? {
    //       [currentDay.id]: true,
    //     }
    //   :
    {},
  );

  const handleDelete = async () => {
    if (!itinerary.id) return;

    try {
      await deleteMutation.mutateAsync(itinerary.id);
      toast.success("Itinerary deleted successfully");
      setSelectedItineraryId(null);
      onDelete?.();
    } catch (error) {
      toast.error("Error deleting itinerary");
      console.error(error);
    }
  };

  const toggleExpandDay = (dayId: string, value?: boolean) => {
    setExpandedDays((prev) => ({
      ...prev,
      [dayId]: value ?? !prev[dayId],
    }));
  };

  const expandAllDays = () => {
    const expanded: Record<string, boolean> = {};
    itinerary.days?.forEach((day: ItineraryDayType) => {
      expanded[day.id] = true;
    });
    setExpandedDays(expanded);
  };

  const collapseAllDays = () => {
    setExpandedDays({});
  };

  // Calculate completed tasks
  const totalTasks = itinerary.days?.reduce(
    (acc: number, day: ItineraryDayType) => acc + day.tasks.length,
    0,
  );
  const completedTasks = itinerary.days?.reduce(
    (acc: number, day: ItineraryDayType) =>
      acc + day.tasks.filter((task: ItineraryTask) => task.completed).length,
    0,
  );

  const remainingTasks = totalTasks - completedTasks;

  const completionPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Calculate days remaining
  const currentDate = new Date();
  const startDate = new Date(itinerary.startDate);
  const endDate = new Date(itinerary.endDate);
  const tripStarted = currentDate >= startDate;
  const tripEnded = currentDate > endDate;

  // Calculate safe budget metrics
  const safeBudget = itinerary.budget ?? 0;
  const safeActualCost = itinerary.actualCost ?? 0;
  const budgetUsagePercentage =
    safeBudget > 0
      ? Math.min(Math.round((safeActualCost / safeBudget) * 100), 100)
      : 0;
  const remainingBudget = safeBudget - safeActualCost;

  const formatDate = (dateString: string, formatString = "MMMM d, yyyy") => {
    try {
      return format(new Date(dateString), formatString);
    } catch (e) {
      console.log("🚀 ~ formatDate ~ e:", e);
      return dateString;
    }
  };

  const toggleExpand = () => {
    setSelectedItineraryId(
      selectedItineraryId === itinerary.id ? null : itinerary.id,
    );
  };

  const handleShareItinerary = () => {
    const summary = `${itinerary.title}${itinerary.destination ? ` (📍 ${itinerary.destination})` : ""}\nDates: ${formatDate(itinerary.startDate)} - ${formatDate(itinerary.endDate)} (${itinerary.totalDays} Days)\nTotal Activities: ${totalTasks}`;
    shareContent({
      title: itinerary.title,
      text: summary,
    });
  };

  const handlePrintItinerary = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <ListCard className="w-full shadow-md gap-0">
      <CardHeader
        onClick={toggleExpand}
        className="cursor-pointer px-4 py-3 relative overflow-hidden group select-none transition-colors"
      >
        {itinerary.coverImage && (
          <>
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <Image
                src={itinerary.coverImage}
                alt={itinerary.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            {/* Scrim gradient overlay ensuring text readability in both dark and light modes */}
            <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/10 pointer-events-none" />
          </>
        )}
        <div className="relative z-10 space-y-2">
          <div className="flex justify-between items-center gap-2">
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              <CardTitle className="text-lg font-bold flex items-center gap-1.5 text-foreground truncate">
                {itinerary.title}
              </CardTitle>
            </div>

            <div
              className="flex items-center gap-1 sm:gap-2 shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedItineraryId === itinerary.id && (
                <>
                  {/* Desktop view: inline action buttons with background chips */}
                  <div className="hidden sm:flex items-center gap-0.5 bg-background/60 dark:bg-background/40 backdrop-blur-xs p-0.5 rounded-lg border border-border/40 shadow-2xs">
                    <Button
                      className="cursor-pointer text-purple-600 dark:text-purple-400 hover:text-purple-700 hover:bg-purple-500/10 h-8 w-8"
                      variant="ghost"
                      size="icon"
                      title="Create Social Card"
                      onClick={() => setIsSocialCardOpen(true)}
                    >
                      <Sparkles className="w-4 h-4" />
                    </Button>
                    <Button
                      className="cursor-pointer h-8 w-8 hover:bg-accent"
                      variant="ghost"
                      size="icon"
                      title="Copy Summary"
                      onClick={handleShareItinerary}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      className="cursor-pointer h-8 w-8 hover:bg-accent"
                      variant="ghost"
                      size="icon"
                      title="Print / Save PDF"
                      onClick={handlePrintItinerary}
                    >
                      <Printer className="w-4 h-4" />
                    </Button>
                    {onEditClick && (
                      <Button
                        className="cursor-pointer h-8 w-8 hover:bg-accent"
                        variant="ghost"
                        size="icon"
                        title="Edit"
                        onClick={onEditClick}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}
                    <DeleteConfirm
                      buttonVariant={"ghost"}
                      buttonClassName="h-8 w-8 hover:bg-destructive/10"
                      handleDelete={handleDelete}
                    />
                  </div>

                  {/* Mobile view: dropdown menu */}
                  <div className="sm:hidden">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="cursor-pointer h-8 w-8 bg-background/60 dark:bg-background/40 backdrop-blur-xs border border-border/40 shadow-2xs"
                          title="Actions"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => setIsSocialCardOpen(true)}
                          className="cursor-pointer gap-2"
                        >
                          <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          <span>Create Social Card</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={handleShareItinerary}
                          className="cursor-pointer gap-2"
                        >
                          <Copy className="w-4 h-4" />
                          <span>Copy Summary</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={handlePrintItinerary}
                          className="cursor-pointer gap-2"
                        >
                          <Printer className="w-4 h-4" />
                          <span>Print / Save PDF</span>
                        </DropdownMenuItem>
                        {onEditClick && (
                          <DropdownMenuItem
                            onClick={onEditClick}
                            className="cursor-pointer gap-2"
                          >
                            <Edit className="w-4 h-4" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onSelect={(e) => e.preventDefault()}
                          className="cursor-pointer gap-2 text-destructive focus:text-destructive"
                        >
                          <DeleteConfirm
                            handleDelete={handleDelete}
                            trigger={
                              <div className="flex items-center gap-2 w-full cursor-pointer">
                                <Trash2 className="w-4 h-4" />
                                <span>Delete</span>
                              </div>
                            }
                          />
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </>
              )}

              <Button
                className="cursor-pointer h-8 w-8 bg-background/60 dark:bg-background/40 backdrop-blur-xs border border-border/40 shadow-2xs hover:bg-accent"
                variant="ghost"
                size="icon"
                onClick={toggleExpand}
              >
                {expandedMain ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
          <div className="text-sm flex justify-between items-end gap-2 pt-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs sm:text-sm font-medium text-foreground flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                {formatDate(itinerary.startDate)}
                {itinerary.endDate &&
                  itinerary.endDate !== itinerary.startDate && (
                    <span className="">- {formatDate(itinerary.endDate)}</span>
                  )}
              </span>
              <Badge
                variant="outline"
                className={cn(
                  "flex items-center text-xs font-semibold px-2 py-0.5 shadow-2xs border",
                  tripEnded
                    ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 dark:bg-emerald-500/20 border-emerald-500/30"
                    : tripStarted
                      ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 dark:bg-amber-500/20 border-amber-500/30"
                      : "bg-blue-500/15 text-blue-700 dark:text-blue-300 dark:bg-blue-500/20 border-blue-500/30",
                )}
              >
                {!tripStarted
                  ? "Upcoming"
                  : tripEnded
                    ? "Completed"
                    : "In Progress"}
              </Badge>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-background/80 dark:bg-card/90 text-foreground border border-border/60 shadow-2xs flex items-center gap-1.5 backdrop-blur-xs shrink-0">
              <CalendarDays className="h-3.5 w-3.5 text-primary" />
              <span>
                {itinerary.totalDays}{" "}
                {itinerary.totalDays === 1 ? "day" : "days"}
              </span>
            </span>
          </div>
        </div>
      </CardHeader>
      <AnimatePresence>
        {expandedMain && (
          <CardContent className="px-4 py-2">
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden w-full border-t pt-2"
            >
              <Tabs
                tabValues={["overview", "schedule", "budget", "notes"]}
                defaultValue="overview"
              >
                <TabsList className="mb-4 grid w-full grid-cols-4 bg-muted/50">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="schedule">Schedule</TabsTrigger>
                  <TabsTrigger value="budget">Budget</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  {/* {itinerary.coverImage && (
                    <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-border shadow-sm">
                      <Image
                        src={itinerary.coverImage}
                        alt={itinerary.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )} */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-muted/20">
                        <div className="p-2 rounded-md bg-primary/10 text-primary">
                          <Calendar className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground font-medium">
                            Dates
                          </p>
                          <p className="text-sm font-semibold text-foreground">
                            {formatDate(itinerary.startDate)} -{" "}
                            {formatDate(itinerary.endDate)}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2.5 p-3 rounded-lg border border-border/50 bg-muted/20">
                          <div className="p-2 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            <Wallet className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground font-medium">
                              Budget
                            </p>
                            <p className="text-sm font-semibold text-foreground">
                              ${safeBudget.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 p-3 rounded-lg border border-border/50 bg-muted/20">
                          <div className="p-2 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400">
                            <CreditCard className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground font-medium">
                              Actual Cost
                            </p>
                            <p className="text-sm font-semibold text-foreground">
                              ${safeActualCost.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 p-3 rounded-lg border border-border/50 bg-muted/20">
                      <div>
                        <div className="flex justify-between mb-1">
                          <p className="text-sm font-medium">
                            Completion Progress
                          </p>
                          <p className="text-sm font-semibold text-primary">
                            {completionPercentage}%
                          </p>
                        </div>
                        <Progress
                          value={completionPercentage}
                          className="h-2"
                        />
                        <p className="text-xs text-muted-foreground mt-1.5 flex justify-between">
                          <span>
                            {completedTasks} of {totalTasks} tasks completed
                          </span>
                          <span>{remainingTasks} remaining</span>
                        </p>
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <p className="text-sm font-medium">Budget Usage</p>
                          <p className="text-sm font-semibold text-foreground">
                            {budgetUsagePercentage}%
                          </p>
                        </div>
                        <Progress
                          value={budgetUsagePercentage}
                          className="h-2"
                        />
                        <p className="text-xs text-muted-foreground mt-1.5 flex justify-between">
                          <span>
                            ${safeActualCost.toLocaleString()} of $
                            {safeBudget.toLocaleString()} used
                          </span>
                          <span>
                            ${remainingBudget.toLocaleString()} remaining
                          </span>
                        </p>
                      </div>
                    </div>
                    {/* {currentDay && (
                      <div className="space-y-4 border-t pt-4">
                        <h3 className="text-lg font-semibold">Today</h3>
                        <ItineraryDay
                          key={currentDay.id}
                          day={currentDay}
                          isExpanded
                          index={0}
                          toggleExpandDay={toggleExpandDay}
                          itineraryId={itinerary.id}
                        />
                      </div>
                    )} */}
                  </div>
                </TabsContent>

                <TabsContent value="schedule" className="space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">
                      Itinerary Schedule
                    </h3>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={expandAllDays}
                      >
                        <CopyPlus className="h-4 w-4 mr-1" />
                        <span className="hidden sm:inline">Expand All</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={collapseAllDays}
                      >
                        <CopyMinus className="h-4 w-4 mr-1" />
                        <span className="hidden sm:inline">Collapse All</span>
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {itinerary.days?.map((day, index) => (
                      <ItineraryDay
                        key={day.id}
                        day={day}
                        isExpanded={expandedDays[day.id] || false}
                        index={index}
                        toggleExpandDay={toggleExpandDay}
                        itineraryId={itinerary.id}
                      />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="budget" className="space-y-4">
                  <BudgetSummary itinerary={itinerary} />
                </TabsContent>

                <TabsContent value="notes" className="space-y-4">
                  <div className="bg-muted/30 p-4 rounded-xl border border-border min-h-32">
                    <h3 className="text-sm font-semibold mb-2 flex items-center gap-1.5 text-muted-foreground">
                      <FileText className="h-4 w-4" /> Trip Notes & Travel Info
                    </h3>
                    {itinerary.notes ? (
                      <p className="text-sm whitespace-pre-wrap leading-relaxed text-foreground">
                        {itinerary.notes}
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground italic py-4 text-center">
                        No trip notes added yet. Click edit to add flight
                        numbers, hotel details, or packing lists.
                      </p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </CardContent>
        )}
      </AnimatePresence>
      <ListCardFooter>
        <span className="flex items-center gap-1">
          <CalendarDays className="w-3 h-3 text-primary" />
          Duration: {itinerary.totalDays}{" "}
          {itinerary.totalDays === 1 ? "day" : "days"}
        </span>
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3 text-primary" />
          {itinerary.destination || "N/A"}
        </span>
      </ListCardFooter>

      {/* Hidden container that displays only during window.print() */}
      <PrintableItinerary itinerary={itinerary} />

      {/* Social Card Generator Modal */}
      <SocialCardModal
        isOpen={isSocialCardOpen}
        onClose={() => setIsSocialCardOpen(false)}
        title={itinerary.title}
        coverImage={itinerary.coverImage}
        subtitle={
          itinerary.destination ? `${itinerary.destination} 📍` : undefined
        }
        excerpt={
          itinerary.notes ||
          `Trip dates: ${formatDate(itinerary.startDate)} to ${formatDate(
            itinerary.endDate,
          )} (${itinerary.totalDays} Days). Total activities planned: ${totalTasks}.`
        }
        date={`${formatDate(itinerary.startDate, "MMM d, yyyy")} - ${formatDate(itinerary.endDate, "MMM d, yyyy")}`}
        type="itinerary"
        itemId={itinerary.id}
        rawItem={itinerary}
      />
    </ListCard>
  );
};

export default ItineraryDetailCard;
