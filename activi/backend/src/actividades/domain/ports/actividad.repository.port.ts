import { ActividadDomain, ActividadProps } from '../entities/actividad.entity';
import type {
  PaginatedResult,
  PaginationParams,
} from '../../../common/types/pagination';

export const ACTIVIDAD_REPOSITORY = Symbol('ACTIVIDAD_REPOSITORY');

export type ActividadUpdate = Partial<
  Omit<
    ActividadProps,
    | 'id_actividad'
    | 'fecha_creacion'
    | 'fecha_actualizacion'
    | 'responsables'
    | 'evidencias'
    | 'servicios'
    | 'herramientas'
    | 'historial'
  >
>;

export interface ActividadRepositoryPort {
  create(actividad: ActividadDomain): Promise<ActividadDomain>;
  findAll(params?: PaginationParams): Promise<PaginatedResult<ActividadDomain>>;
  findById(id: number): Promise<ActividadDomain | null>;
  countByEstado(): Promise<{ estado: string; total: number }[]>;
  update(
    id: number,
    actividad: ActividadUpdate,
  ): Promise<ActividadDomain | null>;
  delete(id: number): Promise<boolean>;
}
