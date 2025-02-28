"use client";
import PageLayout from "@/components/PageLayout";
import React, { useCallback, useState } from "react";
import PlannerPage from "@/components/Planner";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FloatingButtonProps } from "@/components/ui/floating-button";

const Planner = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "tasks";
  const selectedId = searchParams.get("id");
  const [activeTab, setActiveTab] = useState(tab);

  // Create a new URLSearchParams instance for each update
  const createQueryString = useCallback(
    (params: { [key: string]: string | null }) => {
      const newParams = new URLSearchParams(searchParams.toString());

      // Update or delete each parameter
      Object.entries(params).forEach(([name, value]) => {
        if (value === null) {
          newParams.delete(name);
        } else {
          newParams.set(name, value);
        }
      });

      return newParams.toString();
    },
    [searchParams]
  );

  const handleTabChange = (tab: string, id?: string) => {
    setActiveTab(tab);

    // Build parameters object
    const params: { [key: string]: string | null } = { tab };

    // Only include id if it exists, otherwise remove it
    if (id) {
      params.id = id;
    } else {
      params.id = null;
    }

    // Create the query string and navigate
    const queryString = createQueryString(params);
    router.push(`${pathname}?${queryString}`);
  };

  const actions: Record<string, FloatingButtonProps> = {
    tasks: {
      label: "New Task",
      onClick: () => handleTabChange("tasks", "new"),
    },
    events: {
      label: "New Event",
      onClick: () => handleTabChange("events", "new"),
    },
    goals: {
      label: "New Goal",
      onClick: () => handleTabChange("goals", "new"),
    },
    itineraries: {
      label: "New Itinerary",
      onClick: () => handleTabChange("itineraries", "new"),
    },
  };

  return (
    <PageLayout
      headerProps={{ title: "Planner" }}
      floatingButtonProps={actions[activeTab]}
    >
      <PlannerPage
        onTabChange={handleTabChange}
        activeTab={activeTab}
        selectedId={selectedId!}
      />
    </PageLayout>
  );
};

export default Planner;
