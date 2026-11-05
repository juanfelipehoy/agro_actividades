import { Inject, Injectable } from '@nestjs/common';
import { ActividadResponsableDomain } from '../../domain/entities/actividad-responsable.entity';
import { ACTIVIDAD_RESPONSABLE_REPOSITORY } from '../../domain/ports/actividad-responsable.repository.port';
import type { ActividadResponsableRepositoryPort } from '../../domain/ports/actividad-responsable.repository.port';
import type {
  PaginatedResult,
  PaginationParams,
} from '../../../common/types/pagination';

@Injectable()
export class GetActividadResponsableUseCase {
  constructor(
    @Inject(ACTIVIDAD_RESPONSABLE_REPOSITORY)
    private readonly repository: ActividadResponsableRepositoryPort,
  ) {}

  findAll(
    params?: PaginationParams,
  ): Promise<PaginatedResult<ActividadResponsableDomain>> {
    return this.repository.findAll(params);
  }

  findByActividad(idActividad: number): Promise<ActividadResponsableDomain[]> {
    return this.repository.findByActividad(idActividad);
  }

  findById(id: number): Promise<ActividadResponsableDomain | null> {
    return this.repository.findById(id);
  }
}
