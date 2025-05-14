"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { SwipeableHandlers, useSwipeable } from "react-swipeable";
import { cn } from "@/lib/utils";

interface TabsProps extends React.ComponentProps<typeof TabsPrimitive.Root> {
  tabValues: string[];
  children: React.ReactNode;
}

function Tabs({
  className,
  tabValues,
  value: controlledValue,
  onValueChange: controlledOnChange,
  defaultValue,
  children,
  ...props
}: TabsProps) {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = React.useState(
    defaultValue ?? tabValues[0]
  );
  const value = isControlled ? controlledValue : internalValue;
  const setValue = (v: string) => {
    if (!isControlled) setInternalValue(v);
    controlledOnChange?.(v);
  };

  const index = tabValues?.indexOf(value ?? "");

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      const next = tabValues[index + 1];
      if (next) setValue(next);
    },
    onSwipedRight: () => {
      const prev = tabValues[index - 1];
      if (prev) setValue(prev);
    },
    trackTouch: true,
    trackMouse: false,
  });

  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      value={value}
      onValueChange={setValue}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (
          React.isValidElement(child) &&
          (child.type as any).displayName === "TabsContent"
        ) {
          return React.cloneElement(
            child as React.ReactElement<{ swipeHandlers?: SwipeableHandlers }>,
            { swipeHandlers }
          );
        }
        return child;
      })}
    </TabsPrimitive.Root>
  );
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-1",
        className
      )}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "cursor-pointer data-[state=active]:bg-background data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring inline-flex items-center justify-center gap-2 rounded-md px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  swipeHandlers,
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content> & {
  swipeHandlers?: SwipeableHandlers;
}) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    >
      <div {...(swipeHandlers ?? {})} className="h-full w-full">
        {children}
      </div>
    </TabsPrimitive.Content>
  );
}
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };
