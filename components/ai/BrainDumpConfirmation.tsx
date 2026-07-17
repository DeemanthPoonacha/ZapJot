"use client";

import { useState } from "react";
import { 
  Check, 
  X, 
  Plus, 
  ListTodo, 
  Target, 
  Map as MapIcon, 
  User as UserIcon, 
  BookOpen, 
  Edit2,
  Save,
  Calendar,
  Trash2,
  RotateCcw
} from "lucide-react";
import { BrainDump } from "@/types/brain-dump";
import { Button } from "@/components/ui/button";
import { useBrainDump } from "@/lib/hooks/useBrainDump";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface SelectionState {
  tasks: number[];
  goals: number[];
  itineraries: number[];
  characters: number[];
  journals: number[];
  events: number[];
  chapters: number[];
}

export default function BrainDumpConfirmation({
  data,
  onConfirm,
  onCancel,
  onEditItem
}: {
  data: BrainDump;
  onConfirm: (results: any) => void;
  onCancel: () => void;
  onEditItem: (type: keyof BrainDump, index: number, item: any) => void;
}) {
  const { processBrainDump, isProcessing } = useBrainDump();
  
  const [selected, setSelected] = useState<SelectionState>({
    tasks: data.tasks?.map((_, i) => i) || [],
    goals: data.goals?.map((_, i) => i) || [],
    itineraries: data.itineraries?.map((_, i) => i) || [],
    characters: data.characters?.map((_, i) => i) || [],
    journals: data.journals?.map((_, i) => i) || [],
    events: data.events?.map((_, i) => i) || [],
    chapters: data.chapters?.map((_, i) => i) || [],
  });

  const toggleSelection = (type: keyof SelectionState, index: number) => {
    setSelected((prev) => {
      const current = prev[type];
      if (current.includes(index)) {
        return { ...prev, [type]: current.filter((i) => i !== index) };
      } else {
        return { ...prev, [type]: [...current, index] };
      }
    });
  };

  const handleProcess = async () => {
    // Cast to Record<string, number[]> to fix the type issue
    const results = await processBrainDump(data, selected as unknown as Record<string, number[]>);
    if (results && results.success > 0) {
      onConfirm(results);
    }
  };

  const renderCard = (type: keyof SelectionState, item: any, index: number) => {
    const isSelected = selected[type].includes(index);
    const icons = {
      tasks: <ListTodo className="h-4 w-4" />,
      goals: <Target className="h-4 w-4" />,
      itineraries: <MapIcon className="h-4 w-4" />,
      characters: <UserIcon className="h-4 w-4" />,
      journals: <BookOpen className="h-4 w-4" />,
      events: <Calendar className="h-4 w-4" />,
      chapters: <BookOpen className="h-4 w-4" />,
    };

    const typeLabels = {
      tasks: "Task",
      goals: "Goal",
      itineraries: "Itinerary",
      characters: "Character",
      journals: "Journal",
      events: "Event",
      chapters: "Chapter",
    };

    return (
      <motion.div
        key={`${type}-${index}`}
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={cn(
          "flex items-center gap-3 p-3 rounded-xl border transition-all relative overflow-hidden",
          isSelected 
            ? "border-primary/20 bg-card shadow-sm" 
            : "border-dashed border-muted bg-muted/10 opacity-50 grayscale-[0.5]"
        )}
      >
        <div className="flex-grow min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className={cn(
              "p-1 rounded",
              isSelected ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
            )}>
              {icons[type]}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {typeLabels[type]}
            </span>
          </div>
          <p className={cn(
            "text-sm font-semibold truncate",
            !isSelected && "line-through text-muted-foreground/60"
          )}>
            {item.title || item.name || "Untitled Item"}
          </p>
          {(item.description || item.content || item.destination || item.notes) && (
            <p className="text-xs text-muted-foreground line-clamp-1">
              {item.description || item.content || item.destination || item.notes}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary"
            onClick={() => onEditItem(type as keyof BrainDump, index, item)}
          >
            <Edit2 className="h-3.5 w-3.5" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8 rounded-full transition-colors",
              isSelected 
                ? "text-muted-foreground hover:bg-destructive/10 hover:text-destructive" 
                : "text-primary hover:bg-primary/10"
            )}
            onClick={() => toggleSelection(type, index)}
            title={isSelected ? "Ignore" : "Restore"}
          >
            {isSelected ? <Trash2 className="h-3.5 w-3.5" /> : <RotateCcw className="h-3.5 w-3.5" />}
          </Button>
        </div>
      </motion.div>
    );
  };

  const totalSelected = Object.values(selected).reduce((acc, curr) => acc + curr.length, 0);

  return (
    <div className="flex flex-col h-full max-h-[500px] gap-4">
      <div className="flex items-center justify-between px-1">
        <div>
          <h3 className="text-base font-bold">Review Brain Dump</h3>
          <p className="text-xs text-muted-foreground">Confirm items to add or ignore them</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onCancel} className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10">
          <X className="h-4 w-4 mr-1" />
          Cancel
        </Button>
      </div>

      <div className="flex-grow overflow-y-auto space-y-2 pr-2 scrollbar-thin">
        <AnimatePresence mode="popLayout">
          {data.tasks?.map((item, i) => renderCard("tasks", item, i))}
          {data.goals?.map((item, i) => renderCard("goals", item, i))}
          {data.itineraries?.map((item, i) => renderCard("itineraries", item, i))}
          {data.characters?.map((item, i) => renderCard("characters", item, i))}
          {data.journals?.map((item, i) => renderCard("journals", item, i))}
          {data.events?.map((item, i) => renderCard("events", item, i))}
          {data.chapters?.map((item, i) => renderCard("chapters", item, i))}
        </AnimatePresence>
      </div>

      <div className="flex gap-2 pt-2 border-t mt-auto">
        <Button 
          className="flex-grow rounded-xl h-12 shadow-lg" 
          onClick={handleProcess}
          disabled={totalSelected === 0 || isProcessing}
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              Processing...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save {totalSelected} Items
            </div>
          )}
        </Button>
      </div>
    </div>
  );
}
