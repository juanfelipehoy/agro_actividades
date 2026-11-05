import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { historialApi, ActividadHistorial } from '../services/api';

const QUERY_KEY = 'historial';

export function useHistorial(page = 1, limit = 15) {
  return useQuery({
    queryKey: [QUERY_KEY, page, limit],
    queryFn: async () => (await historialApi.getAll(page, limit)).data,
  });
}

export function useEliminarHistorial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => historialApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
}

export type { ActividadHistorial };
