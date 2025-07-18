import {
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";

export function useGlobalState<T>(
  queryKey: unknown,
  initialData?: T | null,
  options?: UseQueryOptions<T | null | undefined>
): [
  T,
  (data: T) => void,
  () => void,
  (updater: (prev: T) => T) => void,
  (data: Partial<T>) => void
] {
  const queryClient = useQueryClient();
  const { data } = useQuery({
    initialData,
    queryKey: [queryKey],
    queryFn: () => Promise.resolve(initialData),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
    refetchInterval: false,
    refetchOnReconnect: false,
    ...options,
  });

  const setPartialData = (newData: Partial<T>): void => {
    queryClient.setQueryData<T | undefined>([queryKey], (prev) => {
      if (!prev) return newData as T;
      return { ...prev, ...newData };
    });
  };

  const setData = (newData: T): void => {
    queryClient.setQueryData<T | undefined>([queryKey], newData);
  };

  const updateData = (updater: (prev: T) => T): void => {
    queryClient.setQueryData<T | undefined>([queryKey], (prev) => {
      return updater(prev as T);
    });
  };

  const resetData = (): void => {
    setData(initialData as T);
  };

  return [data as T, setData, resetData, updateData, setPartialData];
}
