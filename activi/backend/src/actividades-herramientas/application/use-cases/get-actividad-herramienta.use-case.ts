import { Inject, Injectable } from '@nestjs/common';
import { ActividadHerramientaDomain } from '../../domain/entities/actividad-herramienta.entity';
import { ACTIVIDAD_HERRAMIENTA_REPOSITORY } from '../../domain/ports/actividad-herramienta.repository.port';
import type { ActividadHerramientaRepositoryPort } from '../../domain/ports/actividad-herramienta.repository.port';
import type {
  PaginatedResult,
  PaginationParams,
} from '../../../common/types/pagination';

@Injectable()
export class GetActividadHerramientaUseCase {
  constructor(
    @Inject(ACTIVIDAD_HERRAMIENTA_REPOSITORY)
    private readonly repository: ActividadHerramientaRepositoryPort,
  ) {}

  findAll(
    params?: PaginationParams,
  ): Promise<PaginatedResult<ActividadHerramientaDomain>> {
    return this.repository.findAll(params);
  }

  findByActividad(idActividad: number): Promise<ActividadHerramientaDomain[]> {
    return this.repository.findByActividad(idActividad);
  }

  findById(id: number): Promise<ActividadHerramientaDomain | null> {
    return this.repository.findById(id);
  }
}
