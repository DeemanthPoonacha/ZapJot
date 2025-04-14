import { useState } from "react";
import { format } from "date-fns";
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
} from "lucide-react";
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
    {}
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
    itinerary.days.forEach((day: ItineraryDayType) => {
      expanded[day.id] = true;
    });
    setExpandedDays(expanded);
  };

  const collapseAllDays = () => {
    setExpandedDays({});
  };

  // Calculate completed tasks
  const totalTasks = itinerary.days.reduce(
    (acc: number, day: ItineraryDayType) => acc + day.tasks.length,
    0
  );
  const completedTasks = itinerary.days.reduce(
    (acc: number, day: ItineraryDayType) =>
      acc + day.tasks.filter((task: ItineraryTask) => task.completed).length,
    0
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

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMMM d, yyyy");
    } catch (e) {
      console.log("🚀 ~ formatDate ~ e:", e);
      return dateString;
    }
  };

  const toggleExpand = () => {
    setSelectedItineraryId(
      selectedItineraryId === itinerary.id ? null : itinerary.id
    );
  };

  return (
    <ListCard className="w-full shadow-md gap-0">
      <CardHeader onClick={toggleExpand} className="cursor-pointer px-4 py-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-bold flex items-center gap-1">
            {itinerary.title}
          </CardTitle>

          <div
            className="flex items-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedItineraryId === itinerary.id && (
              <>
                {onEditClick && (
                  <Button
                    className="cursor-pointer"
                    variant="ghost"
                    size="icon"
                    onClick={onEditClick}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                )}
                <DeleteConfirm
                  buttonVariant={"ghost"}
                  handleDelete={handleDelete}
                />
              </>
            )}

            <Button
              className="cursor-pointer"
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
        <span className="text-sm flex justify-between">
          <span className="flex items-center gap-1">
            {formatDate(itinerary.startDate)}
            <Badge
              variant={
                tripStarted ? (tripEnded ? "secondary" : "default") : "outline"
              }
              className="flex items-center"
            >
              {!tripStarted
                ? "Upcoming"
                : tripEnded
                ? "Completed"
                : "In Progress"}
            </Badge>
          </span>
          <span className="flex items-center gap-1">
            Budget: ${itinerary.budget}
          </span>
        </span>
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
              <Tabs defaultValue="overview">
                <TabsList className="mb-4 grid w-full grid-cols-3 bg-muted/50">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="schedule">Schedule</TabsTrigger>
                  <TabsTrigger value="budget">Budget</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 md:garid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Dates</p>
                          <p className="text-sm">
                            {formatDate(itinerary.startDate)} -{" "}
                            {formatDate(itinerary.endDate)}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2">
                        <div className="flex items-center gap-2">
                          <Wallet className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Budget</p>
                            <p className="text-sm">
                              ${itinerary.budget.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <CreditCard className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Actual Cost</p>
                            <p className="text-sm">
                              ${itinerary.actualCost.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <p className="text-sm font-medium">
                            Completion Progress
                          </p>
                          <p className="text-sm">{completionPercentage}%</p>
                        </div>
                        <Progress
                          value={completionPercentage}
                          className="h-2"
                        />
                        <p className="text-xs text-muted-foreground mt-1 flex justify-between">
                          <span>
                            {completedTasks} of {totalTasks} tasks completed
                          </span>
                          <span>{remainingTasks} tasks remaining</span>
                        </p>
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <p className="text-sm font-medium">Budget Usage</p>
                          <p className="text-sm">
                            {Math.round(
                              (itinerary.actualCost / itinerary.budget) * 100
                            )}
                            %
                          </p>
                        </div>
                        <Progress
                          value={
                            (itinerary.actualCost / itinerary.budget) * 100
                          }
                          className="h-2"
                        />
                        <p className="text-xs text-muted-foreground mt-1 flex justify-between">
                          <span>
                            ${itinerary.actualCost.toLocaleString()} of $
                            {itinerary.budget.toLocaleString()} used
                          </span>
                          <span>
                            $
                            {(
                              itinerary.budget - itinerary.actualCost
                            ).toLocaleString()}{" "}
                            remaining
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
                  <div className="flex justify-between items-center">
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
                        Expand All
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={collapseAllDays}
                      >
                        <CopyMinus className="h-4 w-4 mr-1" />
                        Collapse All
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {itinerary.days.map((day, index) => (
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
              </Tabs>
            </motion.div>
          </CardContent>
        )}
      </AnimatePresence>
      <ListCardFooter>
        <span className="flex items-center">
          <CalendarDays className="h-3 w-3 mr-1" />
          Duration: {itinerary.totalDays}{" "}
          {itinerary.totalDays === 1 ? "day" : "days"}
        </span>
        <span className="flex items-center">
          <MapPin className="h-4 w-4 mr-1" />
          {itinerary.destination || "N/A"}
        </span>
      </ListCardFooter>
    </ListCard>
  );
};

export default ItineraryDetailCard;
