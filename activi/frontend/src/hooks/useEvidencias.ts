import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { evidenciasApi, ActividadEvidencia } from '../services/api';

const QUERY_KEY = 'evidencias';

export function useEvidencias(page = 1, limit = 12) {
  return useQuery({
    queryKey: [QUERY_KEY, page, limit],
    queryFn: async () => (await evidenciasApi.getAll(page, limit)).data,
  });
}

function useInvalidarEvidencias() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
}

export function useCrearEvidencia() {
  const invalidar = useInvalidarEvidencias();
  return useMutation({
    mutationFn: (data: FormData) => evidenciasApi.create(data),
    onSuccess: invalidar,
  });
}

export function useEliminarEvidencia() {
  const invalidar = useInvalidarEvidencias();
  return useMutation({
    mutationFn: (id: number) => evidenciasApi.delete(id),
    onSuccess: invalidar,
  });
}

export type { ActividadEvidencia };
