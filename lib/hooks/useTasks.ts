import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import {
  getTasks,
  getTasksPaginated,
  getTaskById,
  addTask,
  updateTask,
  deleteTask,
} from "@/lib/services/tasks";
import { useAuth } from "@/lib/context/AuthProvider";

import { Task, TaskCreate, TaskFilter } from "@/types/tasks";

// Query Key
const TASK_QUERY_KEY = "tasks";

/** Fetch all tasks for the logged-in user */
export const useTasks = (query?: TaskFilter) => {
  const { user } = useAuth();
  const userId = user?.uid;
  return useQuery({
    queryKey: [TASK_QUERY_KEY, userId, query],
    queryFn: () => (userId ? getTasks(userId, query) : Promise.resolve([])),
    enabled: !!userId,
  });
};

/** Fetch tasks with infinite scroll cursor-based pagination */
export const useInfiniteTasks = (query?: TaskFilter, pageSize: number = 25) => {
  const { user } = useAuth();
  const userId = user?.uid;
  return useInfiniteQuery({
    queryKey: [TASK_QUERY_KEY, userId, "infinite", query, pageSize],
    queryFn: ({ pageParam }) =>
      userId
        ? getTasksPaginated(userId, {
            ...query,
            limit: pageSize,
            startAfterDoc: pageParam as any,
          })
        : Promise.resolve({ tasks: [], lastDoc: null }),
    initialPageParam: null as any,
    getNextPageParam: (lastPage) => lastPage.lastDoc,
    enabled: !!userId,
  });
};

/** Fetch a single task by ID */
export const useTask = (id?: string) => {
  const { user } = useAuth();
  const userId = user?.uid;
  return useQuery({
    queryKey: [TASK_QUERY_KEY, id],
    queryFn: () =>
      userId && id ? getTaskById(userId, id) : Promise.resolve(null),
    enabled: !!id,
  });
};

/** Mutations */
export const useTaskMutations = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?.uid;

  const addMutation = useMutation({
    mutationFn: (data: TaskCreate) => addTask(userId!, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [TASK_QUERY_KEY, userId] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: TaskCreate }) =>
      updateTask(userId!, id, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [TASK_QUERY_KEY, userId] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTask(userId!, id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [TASK_QUERY_KEY, userId] }),
  });

  const toggleTaskCompletion = useMutation({
    mutationFn: (task: Task) =>
      updateTask(userId!, task.id, {
        status: task.status === "completed" ? "pending" : "completed",
        subtasks: task.subtasks.map((subtask) => ({
          ...subtask,
          status: task.status === "completed" ? "pending" : "completed",
        })),
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [TASK_QUERY_KEY, userId] }),
  });

  const toggleSubtaskCompletion = useMutation({
    mutationFn: ({ task, subtaskId }: { task: Task; subtaskId: string }) =>
      updateTask(userId!, task.id, {
        subtasks: task.subtasks.map((subtask) =>
          subtask.id === subtaskId
            ? {
                ...subtask,
                status:
                  subtask.status === "completed" ? "pending" : "completed",
              }
            : subtask
        ),
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [TASK_QUERY_KEY, userId] }),
  });

  return {
    addMutation,
    updateMutation,
    deleteMutation,
    toggleTaskCompletion,
    toggleSubtaskCompletion,
  };
};
