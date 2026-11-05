/* eslint-disable @typescript-eslint/unbound-method */
import { DeleteActividadUseCase } from './delete-actividad.use-case';
import type { ActividadRepositoryPort } from '../../domain/ports/actividad.repository.port';
import { ActividadDomain } from '../../domain/entities/actividad.entity';
import { FileStorageService } from '../../../common/storage/file-storage.service';

describe('DeleteActividadUseCase', () => {
  let useCase: DeleteActividadUseCase;
  let repository: jest.Mocked<ActividadRepositoryPort>;
  let fileStorage: { saveFile: jest.Mock; deleteFile: jest.Mock };

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      countByEstado: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    fileStorage = {
      saveFile: jest.fn(),
      deleteFile: jest.fn().mockResolvedValue(undefined),
    };

    useCase = new DeleteActividadUseCase(
      repository,
      fileStorage as unknown as FileStorageService,
    );
  });

  it('debe devolver false si la actividad no existe', async () => {
    repository.findById.mockResolvedValue(null);

    const result = await useCase.execute(1);

    expect(result).toBe(false);
    expect(repository.delete).not.toHaveBeenCalled();
  });

  it('debe eliminar el registro y los archivos de evidencias asociados', async () => {
    const actividad = ActividadDomain.fromPersistence({
      id_actividad: 5,
      titulo: 'Cosecha',
      tipo_actividad: 'cosecha',
      evidencias: [
        { archivo_url: '/uploads/foto1.jpg' },
        { archivo_url: '/uploads/video1.mp4' },
        { archivo_url: undefined },
      ],
    });
    repository.findById.mockResolvedValue(actividad);
    repository.delete.mockResolvedValue(true);

    const result = await useCase.execute(5);

    expect(result).toBe(true);
    expect(repository.delete).toHaveBeenCalledWith(5);
    expect(fileStorage.deleteFile).toHaveBeenCalledTimes(2);
    expect(fileStorage.deleteFile).toHaveBeenCalledWith('/uploads/foto1.jpg');
    expect(fileStorage.deleteFile).toHaveBeenCalledWith('/uploads/video1.mp4');
  });

  it('debe devolver false si el borrado en base de datos falla', async () => {
    const actividad = ActividadDomain.fromPersistence({
      id_actividad: 7,
      titulo: 'Poda',
      tipo_actividad: 'poda',
    });
    repository.findById.mockResolvedValue(actividad);
    repository.delete.mockResolvedValue(false);

    const result = await useCase.execute(7);

    expect(result).toBe(false);
    expect(fileStorage.deleteFile).not.toHaveBeenCalled();
  });
});
