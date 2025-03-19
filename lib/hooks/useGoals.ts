import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getGoals,
  getGoalById,
  addGoal,
  updateGoal,
  deleteGoal,
} from "@/lib/services/goals";
import { useAuth } from "@/lib/context/AuthProvider";

import { GoalCreate, GoalUpdate } from "@/types/goals";

// Query Key
const GOAL_QUERY_KEY = "goals";

/** Fetch all goals for the logged-in user */
export const useGoals = () => {
  const { user } = useAuth();
  const userId = user?.uid;

  return useQuery({
    queryKey: [GOAL_QUERY_KEY, userId],
    queryFn: () => (userId ? getGoals(userId) : Promise.resolve([])),
    enabled: !!userId,
  });
};

/** Fetch a single goal by ID */
export const useGoal = (goalId?: string) => {
  const { user } = useAuth();
  const userId = user?.uid;

  return useQuery({
    queryKey: [GOAL_QUERY_KEY, goalId],
    queryFn: () =>
      userId && goalId ? getGoalById(userId, goalId) : Promise.resolve(null),
    enabled: !!userId && !!goalId,
  });
};

/** Mutations */
export const useGoalMutations = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?.uid;

  const addMutation = useMutation({
    mutationFn: (data: GoalCreate) => addGoal(userId!, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [GOAL_QUERY_KEY, userId] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: GoalUpdate }) =>
      updateGoal(userId!, id, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [GOAL_QUERY_KEY, userId] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteGoal(userId!, id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [GOAL_QUERY_KEY, userId] }),
  });

  return { addMutation, updateMutation, deleteMutation };
};
