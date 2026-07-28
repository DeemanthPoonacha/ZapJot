import { useState } from "react";
import { Goal, GOAL_CATEGORIES } from "@/types/goals";
import { CardContent, ListCard, ListCardFooter } from "../../ui/card";
import {
  Edit,
  ChevronUp,
  Target,
  CircleCheckBig,
  CalendarX,
  ChevronRight,
  Loader,
  Trophy,
  Sparkles,
} from "lucide-react";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "../../ui/progress";
import { formatDate } from "@/lib/utils/date-time";
import QuickEdit from "./QuickEdit";
import { cn } from "@/lib/utils";

export default function GoalCard({
  goal,
  onEditClick,
}: {
  goal: Goal;
  onEditClick: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const percentComplete = Math.round((goal.progress / goal.objective) * 100);
  const isComplete = goal.progress >= goal.objective;

  const categoryObj = GOAL_CATEGORIES.find((c) => c.id === goal.category);
  const categoryLabel = categoryObj ? categoryObj.label : "Personal 🎯";

  return (
    <ListCard
      className={cn(
        "transition-all gap-0 cursor-pointer border",
        isComplete
          ? "border-primary/50 shadow-md bg-gradient-to-r from-primary/5 via-card to-card"
          : "border-border/80"
      )}
      onClick={() => setExpanded(!expanded)}
    >
      <CardContent className="px-4 py-3 space-y-2">
        {/* Header section */}
        <div className="flex justify-between items-center gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {isComplete ? (
              <Trophy className="w-5 h-5 text-primary shrink-0 animate-bounce" />
            ) : (
              <Loader className="w-4 h-4 text-muted-foreground shrink-0" />
            )}
            <span className="font-bold text-base text-foreground truncate">
              {goal.title}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {/* Category Badge */}
            <Badge
              variant="outline"
              className="text-[10px] font-bold px-2 py-0.5 bg-primary/10 text-primary border-primary/30"
            >
              {categoryLabel}
            </Badge>

            <Button
              className="cursor-pointer h-7 w-7"
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onEditClick();
              }}
            >
              <Edit className="w-3.5 h-3.5" />
            </Button>
            <Button
              className="cursor-pointer h-7 w-7"
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
            >
              {expanded ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </Button>
          </div>
        </div>

        {/* Milestone Celebration Banner */}
        {isComplete && (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/15 border border-primary/40 rounded-xl text-xs font-bold text-primary">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Milestone Achieved! 100% Complete 🎉</span>
          </div>
        )}

        <div className="flex text-muted-foreground text-xs justify-between items-center">
          {goal.description && (
            <span className="italic truncate max-w-[60%]">{goal.description}</span>
          )}
          {goal.deadline && (
            <span className="ml-auto flex gap-1 items-center font-medium text-foreground bg-muted/40 px-2 py-0.5 rounded-md">
              <CalendarX className="w-3.5 h-3.5 text-primary" />
              {formatDate(goal.deadline)}
            </span>
          )}
        </div>

        {/* Progress bar */}
        <div className="space-y-1 pt-1">
          <div className="flex items-center gap-2">
            <Progress value={Math.min(percentComplete, 100)} className="h-2 flex-1" />
            <span className="font-bold text-xs whitespace-nowrap text-primary">
              {percentComplete}%
            </span>
          </div>
        </div>
      </CardContent>

      <ListCardFooter className="flex flex-col w-full px-4 py-2 bg-muted/20 border-t border-border/40">
        <div className="flex w-full justify-between text-xs text-muted-foreground font-medium">
          <div className="flex items-center gap-1.5">
            <CircleCheckBig className="w-3.5 h-3.5 text-primary" />
            <span>Current:</span>
            <span className="font-bold text-foreground">
              {goal.progress} {goal.unit}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-primary" />
            <span>Objective:</span>
            <span className="font-bold text-foreground">
              {goal.objective} {goal.unit}
            </span>
          </div>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden w-full border-t border-border/50 pt-2 mt-2"
            >
              <QuickEdit
                key={goal.id + goal.progress + goal.objective}
                goal={goal}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </ListCardFooter>
    </ListCard>
  );
}
