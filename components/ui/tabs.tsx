"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { useSwipeable } from "react-swipeable";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface TabsContextValue {
  value: string;
  direction: number;
  setValue: (value: string) => void;
  currentIndex: number;
  extractedTabValues: string[];
  tabsId: string;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

interface TabsProps extends React.ComponentProps<typeof TabsPrimitive.Root> {
  tabValues?: string[];
  isSwipeEnabled?: boolean;
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
  const tabsId = React.useId();

  const extractedTabValues = React.useMemo(() => {
    if (tabValues && tabValues.length > 0) return tabValues;
    const values: string[] = [];
    const findValues = (node: React.ReactNode) => {
      React.Children.forEach(node, (child) => {
        if (React.isValidElement(child)) {
          const childProps = child.props as {
            value?: unknown;
            children?: React.ReactNode;
          };
          if (typeof childProps.value === "string") {
            if (!values.includes(childProps.value))
              values.push(childProps.value);
          }
          if (childProps.children) {
            findValues(childProps.children);
          }
        }
      });
    };
    findValues(children);
    return values;
  }, [tabValues, children]);

  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = React.useState(
    defaultValue ?? extractedTabValues[0] ?? "",
  );
  const value = isControlled ? (controlledValue ?? "") : internalValue;

  const [direction, setDirection] = React.useState(1);

  const setValue = (newVal: string) => {
    const oldIdx = extractedTabValues.indexOf(value);
    const newIdx = extractedTabValues.indexOf(newVal);
    if (newIdx !== -1 && oldIdx !== -1 && newIdx !== oldIdx) {
      setDirection(newIdx > oldIdx ? 1 : -1);
    }
    if (!isControlled) setInternalValue(newVal);
    controlledOnChange?.(newVal);
  };

  const currentIndex = extractedTabValues.indexOf(value);

  return (
    <TabsContext.Provider
      value={{
        value,
        direction,
        setValue,
        currentIndex,
        extractedTabValues,
        tabsId,
      }}
    >
      <TabsPrimitive.Root
        data-slot="tabs"
        className={cn(
          "flex flex-col gap-2 relative w-full max-w-full overflow-hidden text-left",
          className,
        )}
        value={value}
        onValueChange={setValue}
        {...props}
      >
        {children}
      </TabsPrimitive.Root>
    </TabsContext.Provider>
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
        "bg-muted/80 text-muted-foreground inline-flex h-10 w-fit items-center justify-center rounded-xl p-1 relative",
        className,
      )}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  value: triggerValue,
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const context = React.useContext(TabsContext);
  const isActive = context?.value === triggerValue;

  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      value={triggerValue}
      className={cn(
        "relative cursor-pointer inline-flex items-center justify-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 text-muted-foreground data-[state=active]:text-foreground z-10 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      {isActive && (
        <motion.div
          layoutId={`active-tab-indicator-${context?.tabsId}`}
          className={cn(
            "absolute inset-0 rounded-lg bg-gradient-primary shadow-sm border border-border -z-10",
            // className,
          )}
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
        />
      )}
      <span
        className={cn(
          "relative z-10 flex items-center gap-2",
          isActive ? "text-primary-foreground" : "",
        )}
      >
        {children}
      </span>
    </TabsPrimitive.Trigger>
  );
}

function TabsContent({
  className,
  value: contentValue,
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  const context = React.useContext(TabsContext);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: (eventData) => {
      // Allow vertical scrolling when vertical movement exceeds horizontal
      if (eventData.absY > eventData.absX) return;
      const el = (eventData.event.target as HTMLElement | null)?.closest(
        '[class*="overflow-x-auto"], [class*="overflow-x-scroll"], [class*="overflow-auto"], [class*="swipe-stop"]',
      );
      if (el) return;
      if (!context) return;
      const { currentIndex, extractedTabValues, setValue } = context;
      const next = extractedTabValues[currentIndex + 1];
      if (next) setValue(next);
    },
    onSwipedRight: (eventData) => {
      // Allow vertical scrolling when vertical movement exceeds horizontal
      if (eventData.absY > eventData.absX) return;
      const el = (eventData.event.target as HTMLElement | null)?.closest(
        '[class*="overflow-x-auto"], [class*="overflow-x-scroll"], [class*="overflow-auto"], [class*="swipe-stop"]',
      );
      if (el) return;
      if (!context) return;
      const { currentIndex, extractedTabValues, setValue } = context;
      const prev = extractedTabValues[currentIndex - 1];
      if (prev) setValue(prev);
    },
    onTouchStartOrOnMouseDown: ({ event }) => {
      event.stopPropagation();
    },
    delta: 100,
    trackTouch: true,
    trackMouse: false,
    preventScrollOnSwipe: false,
  });

  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      value={contentValue}
      className={cn(
        "flex-1 outline-none w-full max-w-full min-w-0 flex flex-col text-left",
        className,
      )}
      {...props}
    >
      <div
        {...swipeHandlers}
        className="w-full max-w-full min-w-0 flex-1 flex flex-col text-left"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={contentValue}
            initial={{
              opacity: 0,
              x: (context?.direction ?? 1) > 0 ? 40 : -40,
            }}
            animate={{ opacity: 1, x: 0 }}
            exit={{
              opacity: 0,
              x: (context?.direction ?? 1) > 0 ? -40 : 40,
            }}
            transition={{
              type: "spring",
              stiffness: 320,
              damping: 28,
              mass: 0.8,
            }}
            className="w-full max-w-full min-w-0 flex-1 flex flex-col text-left"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </TabsPrimitive.Content>
  );
}
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };
