import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  herramientasApi,
  responsablesApi,
  serviciosApi,
  ActividadHerramienta,
  ActividadResponsable,
  ActividadServicio,
} from '../services/api';

// ---------- Herramientas ----------

export function useHerramientas(page = 1, limit = 12) {
  return useQuery({
    queryKey: ['herramientas', page, limit],
    queryFn: async () => (await herramientasApi.getAll(page, limit)).data,
  });
}

export function useCrearHerramienta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<ActividadHerramienta>) =>
      herramientasApi.create(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['herramientas'] }),
  });
}

export function useActualizarHerramienta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ActividadHerramienta> }) =>
      herramientasApi.update(id, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['herramientas'] }),
  });
}

export function useEliminarHerramienta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => herramientasApi.delete(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['herramientas'] }),
  });
}

// ---------- Responsables ----------

export function useResponsables(page = 1, limit = 12) {
  return useQuery({
    queryKey: ['responsables', page, limit],
    queryFn: async () => (await responsablesApi.getAll(page, limit)).data,
  });
}

export function useCrearResponsable() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<ActividadResponsable>) =>
      responsablesApi.create(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['responsables'] }),
  });
}

export function useActualizarResponsable() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ActividadResponsable> }) =>
      responsablesApi.update(id, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['responsables'] }),
  });
}

export function useEliminarResponsable() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => responsablesApi.delete(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['responsables'] }),
  });
}

// ---------- Servicios ----------

export function useServicios(page = 1, limit = 12) {
  return useQuery({
    queryKey: ['servicios', page, limit],
    queryFn: async () => (await serviciosApi.getAll(page, limit)).data,
  });
}

export function useCrearServicio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<ActividadServicio>) => serviciosApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['servicios'] }),
  });
}

export function useActualizarServicio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ActividadServicio> }) =>
      serviciosApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['servicios'] }),
  });
}

export function useEliminarServicio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => serviciosApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['servicios'] }),
  });
}

export type { ActividadHerramienta, ActividadResponsable, ActividadServicio };
