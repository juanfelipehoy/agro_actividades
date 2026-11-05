import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { actividadesApi, Actividad } from '../services/api';

const QUERY_KEY = 'actividades';

export function useActividades(page = 1, limit = 12) {
  return useQuery({
    queryKey: [QUERY_KEY, page, limit],
    queryFn: async () => (await actividadesApi.getAll(page, limit)).data,
  });
}

// Lista ligera de actividades para selects de los formularios hijos
export function useActividadesOptions() {
  return useQuery({
    queryKey: [QUERY_KEY, 'options'],
    queryFn: async () => (await actividadesApi.getAll(1, 100)).data.data,
    staleTime: 60_000,
  });
}

// Conteo de actividades por estado (tarjetas de resumen)
export function useActividadStats() {
  return useQuery({
    queryKey: [QUERY_KEY, 'stats'],
    queryFn: async () => (await actividadesApi.getStats()).data,
  });
}

function useInvalidarActividades() {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
}

export function useCrearActividad() {
  const invalidar = useInvalidarActividades();
  return useMutation({
    mutationFn: (data: Partial<Actividad>) => actividadesApi.create(data),
    onSuccess: invalidar,
  });
}

export function useActualizarActividad() {
  const invalidar = useInvalidarActividades();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Actividad> }) =>
      actividadesApi.update(id, data),
    onSuccess: invalidar,
  });
}

export function useEliminarActividad() {
  const invalidar = useInvalidarActividades();
  return useMutation({
    mutationFn: (id: number) => actividadesApi.delete(id),
    onSuccess: invalidar,
  });
}
