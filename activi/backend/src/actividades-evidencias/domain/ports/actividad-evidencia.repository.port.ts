import {
  ActividadEvidenciaDomain,
  ActividadEvidenciaProps,
} from '../entities/actividad-evidencia.entity';
import type {
  PaginatedResult,
  PaginationParams,
} from '../../../common/types/pagination';

export const ACTIVIDAD_EVIDENCIA_REPOSITORY = Symbol(
  'ACTIVIDAD_EVIDENCIA_REPOSITORY',
);

export type ActividadEvidenciaUpdate = Partial<
  Omit<ActividadEvidenciaProps, 'id_actividad_evidencia' | 'fecha_registro'>
>;

export interface ActividadEvidenciaRepositoryPort {
  create(
    evidencia: ActividadEvidenciaDomain,
  ): Promise<ActividadEvidenciaDomain>;
  findAll(
    params?: PaginationParams,
  ): Promise<PaginatedResult<ActividadEvidenciaDomain>>;
  findByActividad(idActividad: number): Promise<ActividadEvidenciaDomain[]>;
  findById(id: number): Promise<ActividadEvidenciaDomain | null>;
  update(
    id: number,
    evidencia: ActividadEvidenciaUpdate,
  ): Promise<ActividadEvidenciaDomain | null>;
  delete(id: number): Promise<boolean>;
}
