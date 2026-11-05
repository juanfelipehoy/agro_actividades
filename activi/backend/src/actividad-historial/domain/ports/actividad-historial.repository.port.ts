import {
  ActividadHistorialDomain,
  ActividadHistorialProps,
} from '../entities/actividad-historial.entity';
import type {
  PaginatedResult,
  PaginationParams,
} from '../../../common/types/pagination';

export const ACTIVIDAD_HISTORIAL_REPOSITORY = Symbol(
  'ACTIVIDAD_HISTORIAL_REPOSITORY',
);

export type ActividadHistorialUpdate = Partial<
  Omit<ActividadHistorialProps, 'id_actividad_historial' | 'fecha_registro'>
>;

export interface ActividadHistorialRepositoryPort {
  create(
    historial: ActividadHistorialDomain,
  ): Promise<ActividadHistorialDomain>;
  findAll(
    params?: PaginationParams,
  ): Promise<PaginatedResult<ActividadHistorialDomain>>;
  findByActividad(idActividad: number): Promise<ActividadHistorialDomain[]>;
  findById(id: number): Promise<ActividadHistorialDomain | null>;
  update(
    id: number,
    historial: ActividadHistorialUpdate,
  ): Promise<ActividadHistorialDomain | null>;
  delete(id: number): Promise<boolean>;
}
