import { Inject, Injectable } from '@nestjs/common';
import { ActividadServicioDomain } from '../../domain/entities/actividad-servicio.entity';
import { ACTIVIDAD_SERVICIO_REPOSITORY } from '../../domain/ports/actividad-servicio.repository.port';
import type { ActividadServicioRepositoryPort } from '../../domain/ports/actividad-servicio.repository.port';
import type {
  PaginatedResult,
  PaginationParams,
} from '../../../common/types/pagination';

@Injectable()
export class GetActividadServicioUseCase {
  constructor(
    @Inject(ACTIVIDAD_SERVICIO_REPOSITORY)
    private readonly repository: ActividadServicioRepositoryPort,
  ) {}

  findAll(
    params?: PaginationParams,
  ): Promise<PaginatedResult<ActividadServicioDomain>> {
    return this.repository.findAll(params);
  }

  findByActividad(idActividad: number): Promise<ActividadServicioDomain[]> {
    return this.repository.findByActividad(idActividad);
  }

  findById(id: number): Promise<ActividadServicioDomain | null> {
    return this.repository.findById(id);
  }
}
