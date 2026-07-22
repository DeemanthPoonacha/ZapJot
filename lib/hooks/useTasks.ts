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
    onSuccess: (newTask) => {
      queryClient.setQueriesData(
        { queryKey: [TASK_QUERY_KEY, userId] },
        (oldData: any) => {
          if (!oldData) return oldData;
          if (Array.isArray(oldData)) {
            return [newTask, ...oldData];
          }
          if (typeof oldData === "object" && "pages" in oldData) {
            return {
              ...oldData,
              pages: oldData.pages.map((page: any, index: number) =>
                index === 0
                  ? { ...page, tasks: [newTask, ...(page.tasks || [])] }
                  : page
              ),
            };
          }
          return oldData;
        }
      );
      queryClient.invalidateQueries({ queryKey: [TASK_QUERY_KEY, userId] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: TaskCreate }) =>
      updateTask(userId!, id, data),
    onSuccess: (_data, variables) => {
      queryClient.setQueriesData(
        { queryKey: [TASK_QUERY_KEY, userId] },
        (oldData: any) => {
          if (!oldData) return oldData;
          if (Array.isArray(oldData)) {
            return oldData.map((task: Task) =>
              task.id === variables.id ? { ...task, ...variables.data } : task
            );
          }
          if (typeof oldData === "object" && "pages" in oldData) {
            return {
              ...oldData,
              pages: oldData.pages.map((page: any) => ({
                ...page,
                tasks: page.tasks?.map((task: Task) =>
                  task.id === variables.id
                    ? { ...task, ...variables.data }
                    : task
                ),
              })),
            };
          }
          return oldData;
        }
      );
      queryClient.invalidateQueries({ queryKey: [TASK_QUERY_KEY, userId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTask(userId!, id),
    onSuccess: (_data, id) => {
      queryClient.setQueriesData(
        { queryKey: [TASK_QUERY_KEY, userId] },
        (oldData: any) => {
          if (!oldData) return oldData;
          if (Array.isArray(oldData)) {
            return oldData.filter((task: Task) => task.id !== id);
          }
          if (typeof oldData === "object" && "pages" in oldData) {
            return {
              ...oldData,
              pages: oldData.pages.map((page: any) => ({
                ...page,
                tasks: page.tasks?.filter((task: Task) => task.id !== id),
              })),
            };
          }
          return oldData;
        }
      );
      queryClient.invalidateQueries({ queryKey: [TASK_QUERY_KEY, userId] });
    },
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
    onSuccess: (_data, task) => {
      const newStatus = task.status === "completed" ? "pending" : "completed";
      const updatedSubtasks = (task.subtasks || []).map((subtask) => ({
        ...subtask,
        status: newStatus,
      }));
      queryClient.setQueriesData(
        { queryKey: [TASK_QUERY_KEY, userId] },
        (oldData: any) => {
          if (!oldData) return oldData;
          const updateItem = (t: Task) =>
            t.id === task.id
              ? { ...t, status: newStatus, subtasks: updatedSubtasks }
              : t;
          if (Array.isArray(oldData)) {
            return oldData.map(updateItem);
          }
          if (typeof oldData === "object" && "pages" in oldData) {
            return {
              ...oldData,
              pages: oldData.pages.map((page: any) => ({
                ...page,
                tasks: page.tasks?.map(updateItem),
              })),
            };
          }
          return oldData;
        }
      );
      queryClient.invalidateQueries({ queryKey: [TASK_QUERY_KEY, userId] });
    },
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
    onSuccess: (_data, { task, subtaskId }) => {
      queryClient.setQueriesData(
        { queryKey: [TASK_QUERY_KEY, userId] },
        (oldData: any) => {
          if (!oldData) return oldData;
          const updateItem = (t: Task) => {
            if (t.id !== task.id) return t;
            return {
              ...t,
              subtasks: (t.subtasks || []).map((s) =>
                s.id === subtaskId
                  ? {
                      ...s,
                      status:
                        s.status === "completed" ? "pending" : "completed",
                    }
                  : s
              ),
            };
          };
          if (Array.isArray(oldData)) {
            return oldData.map(updateItem);
          }
          if (typeof oldData === "object" && "pages" in oldData) {
            return {
              ...oldData,
              pages: oldData.pages.map((page: any) => ({
                ...page,
                tasks: page.tasks?.map(updateItem),
              })),
            };
          }
          return oldData;
        }
      );
      queryClient.invalidateQueries({ queryKey: [TASK_QUERY_KEY, userId] });
    },
  });

  return {
    addMutation,
    updateMutation,
    deleteMutation,
    toggleTaskCompletion,
    toggleSubtaskCompletion,
  };
};
