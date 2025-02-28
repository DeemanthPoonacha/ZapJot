"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DayPicker } from "react-day-picker";
import { FormControl } from "./form";

function DatePicker({
  placeholder = "Select a date",
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  placeholder?: string;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant={"outline"}
            className={cn(
              "w-[240px] justify-start text-left font-normal",
              !props.selected && "text-muted-foreground"
            )}
          >
            <CalendarIcon />
            {props.selected ? (
              format(props.selected as Date, "PPP")
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar {...props} initialFocus />
      </PopoverContent>
    </Popover>
  );
}
export default DatePicker;
