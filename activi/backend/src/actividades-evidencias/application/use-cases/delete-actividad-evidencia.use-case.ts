import { Inject, Injectable } from '@nestjs/common';
import { ACTIVIDAD_EVIDENCIA_REPOSITORY } from '../../domain/ports/actividad-evidencia.repository.port';
import type { ActividadEvidenciaRepositoryPort } from '../../domain/ports/actividad-evidencia.repository.port';
import { FileStorageService } from '../../../common/storage/file-storage.service';

@Injectable()
export class DeleteActividadEvidenciaUseCase {
  constructor(
    @Inject(ACTIVIDAD_EVIDENCIA_REPOSITORY)
    private readonly repository: ActividadEvidenciaRepositoryPort,
    private readonly fileStorage: FileStorageService,
  ) {}

  async execute(id: number): Promise<boolean> {
    // Primero se obtiene la URL del archivo, luego se borra el registro
    // y finalmente el archivo físico para no dejar huérfanos en uploads/.
    const evidencia = await this.repository.findById(id);
    if (!evidencia) return false;

    const deleted = await this.repository.delete(id);
    if (!deleted) return false;

    const { archivo_url } = evidencia.toPrimitives();
    if (archivo_url) {
      await this.fileStorage.deleteFile(archivo_url);
    }

    return true;
  }
}
