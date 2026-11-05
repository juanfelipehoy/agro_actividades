import { Inject, Injectable } from '@nestjs/common';
import { ActividadDomain } from '../../domain/entities/actividad.entity';
import { ACTIVIDAD_REPOSITORY } from '../../domain/ports/actividad.repository.port';
import type { ActividadRepositoryPort } from '../../domain/ports/actividad.repository.port';
import type {
  PaginatedResult,
  PaginationParams,
} from '../../../common/types/pagination';

@Injectable()
export class GetActividadUseCase {
  constructor(
    @Inject(ACTIVIDAD_REPOSITORY)
    private readonly actividadRepository: ActividadRepositoryPort,
  ) {}

  findAll(
    params?: PaginationParams,
  ): Promise<PaginatedResult<ActividadDomain>> {
    return this.actividadRepository.findAll(params);
  }

  execute(id: number): Promise<ActividadDomain | null> {
    return this.actividadRepository.findById(id);
  }

  countByEstado(): Promise<{ estado: string; total: number }[]> {
    return this.actividadRepository.countByEstado();
  }
}
