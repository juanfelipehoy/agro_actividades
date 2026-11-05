import {
  ActividadHerramientaDomain,
  ActividadHerramientaProps,
} from '../entities/actividad-herramienta.entity';
import type {
  PaginatedResult,
  PaginationParams,
} from '../../../common/types/pagination';

export const ACTIVIDAD_HERRAMIENTA_REPOSITORY = Symbol(
  'ACTIVIDAD_HERRAMIENTA_REPOSITORY',
);

export type ActividadHerramientaUpdate = Partial<
  Omit<ActividadHerramientaProps, 'id_actividad_herramienta'>
>;

export interface ActividadHerramientaRepositoryPort {
  create(
    herramienta: ActividadHerramientaDomain,
  ): Promise<ActividadHerramientaDomain>;
  findAll(
    params?: PaginationParams,
  ): Promise<PaginatedResult<ActividadHerramientaDomain>>;
  findByActividad(idActividad: number): Promise<ActividadHerramientaDomain[]>;
  findById(id: number): Promise<ActividadHerramientaDomain | null>;
  update(
    id: number,
    herramienta: ActividadHerramientaUpdate,
  ): Promise<ActividadHerramientaDomain | null>;
  delete(id: number): Promise<boolean>;
}
