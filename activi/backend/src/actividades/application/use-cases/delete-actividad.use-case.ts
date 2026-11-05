import { Inject, Injectable, Logger } from '@nestjs/common';
import { ACTIVIDAD_REPOSITORY } from '../../domain/ports/actividad.repository.port';
import type { ActividadRepositoryPort } from '../../domain/ports/actividad.repository.port';
import { FileStorageService } from '../../../common/storage/file-storage.service';

interface EvidenciaConArchivo {
  archivo_url?: string;
}

@Injectable()
export class DeleteActividadUseCase {
  private readonly logger = new Logger(DeleteActividadUseCase.name);

  constructor(
    @Inject(ACTIVIDAD_REPOSITORY)
    private readonly repository: ActividadRepositoryPort,
    private readonly fileStorage: FileStorageService,
  ) {}

  async execute(id: number): Promise<boolean> {
    // Se consultan las evidencias antes de borrar para poder eliminar
    // también los archivos físicos y no dejar huérfanos en uploads/.
    const actividad = await this.repository.findById(id);
    if (!actividad) return false;

    const deleted = await this.repository.delete(id);
    if (!deleted) return false;

    const evidencias = (actividad.toPrimitives().evidencias ??
      []) as EvidenciaConArchivo[];
    await Promise.all(
      evidencias.map((evidencia) =>
        evidencia.archivo_url
          ? this.fileStorage.deleteFile(evidencia.archivo_url)
          : Promise.resolve(),
      ),
    );

    this.logger.log(`Actividad ${id} eliminada con sus evidencias asociadas`);
    return true;
  }
}
