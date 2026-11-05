import { Inject, Injectable } from '@nestjs/common';
import { runInTransaction } from 'typeorm-transactional';
import {
  ActividadDomain,
  ActividadProps,
} from '../../domain/entities/actividad.entity';
import { ACTIVIDAD_REPOSITORY } from '../../domain/ports/actividad.repository.port';
import type { ActividadRepositoryPort } from '../../domain/ports/actividad.repository.port';
import { ActividadHistorialDomain } from '../../../actividad-historial/domain/entities/actividad-historial.entity';
import { ACTIVIDAD_HISTORIAL_REPOSITORY } from '../../../actividad-historial/domain/ports/actividad-historial.repository.port';
import type { ActividadHistorialRepositoryPort } from '../../../actividad-historial/domain/ports/actividad-historial.repository.port';

@Injectable()
export class CreateActividadUseCase {
  constructor(
    @Inject(ACTIVIDAD_REPOSITORY)
    private readonly actividadRepository: ActividadRepositoryPort,
    @Inject(ACTIVIDAD_HISTORIAL_REPOSITORY)
    private readonly historialRepository: ActividadHistorialRepositoryPort,
  ) {}

  execute(data: ActividadProps): Promise<ActividadDomain> {
    // Actividad e historial se crean en la misma transacción:
    // si el historial falla, la actividad tampoco queda guardada.
    return runInTransaction(async () => {
      const actividad = await this.actividadRepository.create(
        ActividadDomain.create(data),
      );
      const props = actividad.toPrimitives();

      await this.historialRepository.create(
        ActividadHistorialDomain.create({
          id_actividad: props.id_actividad!,
          accion: 'creacion',
          estado_nuevo: props.estado,
          id_usuario: 1,
          observaciones: `Actividad creada: ${props.titulo}`,
        }),
      );

      return actividad;
    });
  }
}
