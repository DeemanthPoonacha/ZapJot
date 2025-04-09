import { useState } from "react";
import { Goal } from "@/types/goals";
import { CardContent, ListCard, ListCardFooter } from "../ui/card";
import {
  Edit,
  ChevronUp,
  Target,
  CircleCheckBig,
  CalendarX,
  ChevronRight,
  Loader,
} from "lucide-react";
import { Button } from "../ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "../ui/progress";
import { formatDate } from "@/lib/utils";
import QuickEdit from "./QuickEdit";

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

  return (
    <ListCard
      className="transition-colors gap-0 cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      <CardContent className="px-4 py-2">
        {/* Header section (always visible) */}
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {!isComplete ? <Loader /> : <CircleCheckBig />}
            <span className="font-semibold">{goal.title}</span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              className="cursor-pointer"
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onEditClick();
              }}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              className="cursor-pointer"
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
            >
              {expanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
        <div className="flex text-muted-foreground text-sm mb-2">
          {goal.description && (
            <span className="italic">{goal.description}</span>
          )}
          {goal.deadline && (
            <span
              className="ml-auto flex gap-1 items-center"
              color="bg-rose-100 text-rose-800"
            >
              <CalendarX className="w-4 h-4" />
              {formatDate(goal.deadline)}
            </span>
          )}
        </div>

        {/* Progress section (always visible) */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Progress value={percentComplete} className="h-2 flex-1" />
            <span className="font-medium text-sm whitespace-nowrap">
              {percentComplete}%
            </span>
          </div>
        </div>
      </CardContent>

      <ListCardFooter className="flex flex-col w-full">
        <div className="flex w-full justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="flex gap-1 items-center">
              <CircleCheckBig className="w-4 h-4" />
              Current
            </span>

            <span className="font-semibold">
              {goal.progress} {goal.unit}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex gap-1 items-center">
              <Target className="w-4 h-4" />
              Objective
            </span>

            <span className="font-semibold">
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
              className="overflow-hidden w-full border-t pt-2 mt-2"
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
