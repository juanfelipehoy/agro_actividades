import { Inject, Injectable } from '@nestjs/common';
import { ActividadHistorialDomain } from '../../domain/entities/actividad-historial.entity';
import { ACTIVIDAD_HISTORIAL_REPOSITORY } from '../../domain/ports/actividad-historial.repository.port';
import type { ActividadHistorialRepositoryPort } from '../../domain/ports/actividad-historial.repository.port';
import type {
  PaginatedResult,
  PaginationParams,
} from '../../../common/types/pagination';

@Injectable()
export class GetActividadHistorialUseCase {
  constructor(
    @Inject(ACTIVIDAD_HISTORIAL_REPOSITORY)
    private readonly repository: ActividadHistorialRepositoryPort,
  ) {}

  findAll(
    params?: PaginationParams,
  ): Promise<PaginatedResult<ActividadHistorialDomain>> {
    return this.repository.findAll(params);
  }

  findByActividad(idActividad: number): Promise<ActividadHistorialDomain[]> {
    return this.repository.findByActividad(idActividad);
  }
  findById(id: number): Promise<ActividadHistorialDomain | null> {
    return this.repository.findById(id);
  }
}
