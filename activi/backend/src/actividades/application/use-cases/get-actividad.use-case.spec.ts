/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { GetActividadUseCase } from './get-actividad.use-case';
import { ACTIVIDAD_REPOSITORY } from '../../domain/ports/actividad.repository.port';
import type { ActividadRepositoryPort } from '../../domain/ports/actividad.repository.port';
import { ActividadDomain } from '../../domain/entities/actividad.entity';

describe('GetActividadUseCase', () => {
  let useCase: GetActividadUseCase;
  let repository: jest.Mocked<ActividadRepositoryPort>;

  beforeEach(async () => {
    repository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      countByEstado: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetActividadUseCase,
        { provide: ACTIVIDAD_REPOSITORY, useValue: repository },
      ],
    }).compile();

    useCase = module.get(GetActividadUseCase);
  });

  it('debe devolver las actividades delegando al repositorio', async () => {
    const actividad = ActividadDomain.fromPersistence({
      id_actividad: 1,
      titulo: 'Riego',
      tipo_actividad: 'riego',
    });
    repository.findById.mockResolvedValue(actividad);

    const result = await useCase.execute(1);

    expect(repository.findById).toHaveBeenCalledWith(1);
    expect(result).toBe(actividad);
  });

  it('debe devolver null cuando la actividad no existe', async () => {
    repository.findById.mockResolvedValue(null);

    const result = await useCase.execute(999);

    expect(result).toBeNull();
  });

  it('debe propagar los parámetros de paginación al repositorio', async () => {
    repository.findAll.mockResolvedValue({
      data: [],
      total: 0,
      page: 2,
      limit: 10,
      totalPages: 0,
    });

    await useCase.findAll({ page: 2, limit: 10 });

    expect(repository.findAll).toHaveBeenCalledWith({ page: 2, limit: 10 });
  });
});
