import { Inject, Injectable } from '@nestjs/common';
import { ActividadEvidenciaDomain } from '../../domain/entities/actividad-evidencia.entity';
import { ACTIVIDAD_EVIDENCIA_REPOSITORY } from '../../domain/ports/actividad-evidencia.repository.port';
import type { ActividadEvidenciaRepositoryPort } from '../../domain/ports/actividad-evidencia.repository.port';
import type {
  PaginatedResult,
  PaginationParams,
} from '../../../common/types/pagination';

@Injectable()
export class GetActividadEvidenciaUseCase {
  constructor(
    @Inject(ACTIVIDAD_EVIDENCIA_REPOSITORY)
    private readonly repository: ActividadEvidenciaRepositoryPort,
  ) {}

  findAll(
    params?: PaginationParams,
  ): Promise<PaginatedResult<ActividadEvidenciaDomain>> {
    return this.repository.findAll(params);
  }

  findByActividad(idActividad: number): Promise<ActividadEvidenciaDomain[]> {
    return this.repository.findByActividad(idActividad);
  }
  findById(id: number): Promise<ActividadEvidenciaDomain | null> {
    return this.repository.findById(id);
  }
}
