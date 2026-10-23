import { Inject, Injectable } from '@nestjs/common';
import { ActividadDomain } from '../../domain/entities/actividad.entity';
import { ACTIVIDAD_REPOSITORY } from '../../domain/ports/actividad.repository.port';
import type {
  ActividadRepositoryPort,
  ActividadUpdate,
} from '../../domain/ports/actividad.repository.port';
import { ActividadHistorialDomain } from '../../../actividad-historial/domain/entities/actividad-historial.entity';
import { ACTIVIDAD_HISTORIAL_REPOSITORY } from '../../../actividad-historial/domain/ports/actividad-historial.repository.port';
import type { ActividadHistorialRepositoryPort } from '../../../actividad-historial/domain/ports/actividad-historial.repository.port';

@Injectable()
export class SaveActividadUseCase {
  constructor(
    @Inject(ACTIVIDAD_REPOSITORY)
    private readonly repository: ActividadRepositoryPort,
    @Inject(ACTIVIDAD_HISTORIAL_REPOSITORY)
    private readonly historialRepository: ActividadHistorialRepositoryPort,
  ) {}

  async execute(
    id: number,
    data: ActividadUpdate,
  ): Promise<ActividadDomain | null> {
    const anterior = await this.repository.findById(id);
    if (!anterior) return null;

    const actividad = await this.repository.update(id, data);
    if (!actividad) return null;

    const estadoAnterior = anterior.toPrimitives().estado;
    const estadoNuevo = actividad.toPrimitives().estado;
    await this.historialRepository.create(
      ActividadHistorialDomain.create({
        id_actividad: id,
        accion:
          data.estado !== undefined && data.estado !== estadoAnterior
            ? 'cambio_estado'
            : 'edicion',
        estado_anterior: estadoAnterior,
        estado_nuevo: estadoNuevo,
        id_usuario: 1,
        observaciones: 'Actividad actualizada',
      }),
    );

    return actividad;
  }
}
