import { useGlobalState } from "./global-state";

const usePlanner = () => {
  const [selectedTab, setSelectedTab] = useGlobalState<string>(
    ["selectedTab"],
    "tasks"
  );
  const [selectedEventId, setSelectedEventId] = useGlobalState<string | null>(
    ["selectedEvent"],
    null
  );
  const [selectedGoalId, setSelectedGoalId] = useGlobalState<string | null>(
    ["selectedGoal"],
    null
  );
  const [selectedTaskId, setSelectedTaskId] = useGlobalState<string | null>(
    ["selectedTask"],
    null
  );
  const [selectedItineraryId, setSelectedItineraryId] = useGlobalState<
    string | null
  >(["selectedItinerary"], null);

  return {
    selectedTab,
    setSelectedTab,
    selectedEventId,
    setSelectedEventId,
    selectedItineraryId,
    setSelectedItineraryId,
    selectedGoalId,
    setSelectedGoalId,
    selectedTaskId,
    setSelectedTaskId,
  };
};

export default usePlanner;
