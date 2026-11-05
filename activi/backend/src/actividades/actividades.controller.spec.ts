import { Test, TestingModule } from '@nestjs/testing';
import { ActividadController } from './infrastructure/http/controllers/actividad.controller';
import { CreateActividadUseCase } from './application/use-cases/create-actividad.use-case';
import { GetActividadUseCase } from './application/use-cases/get-actividad.use-case';
import { SaveActividadUseCase } from './application/use-cases/save-actividad.use-case';
import { DeleteActividadUseCase } from './application/use-cases/delete-actividad.use-case';
import { ActividadDomain } from './domain/entities/actividad.entity';

describe('ActividadController', () => {
  let controller: ActividadController;

  const actividad = ActividadDomain.fromPersistence({
    id_actividad: 1,
    titulo: 'Riego',
    tipo_actividad: 'riego',
    estado: 'pendiente',
  });

  const createUseCase = { execute: jest.fn().mockResolvedValue(actividad) };
  const getUseCase = {
    findAll: jest.fn().mockResolvedValue({
      data: [actividad],
      total: 1,
      page: 1,
      limit: 20,
      totalPages: 1,
    }),
    execute: jest.fn().mockResolvedValue(actividad),
  };
  const saveUseCase = { execute: jest.fn().mockResolvedValue(actividad) };
  const deleteUseCase = { execute: jest.fn().mockResolvedValue(true) };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActividadController],
      providers: [
        { provide: CreateActividadUseCase, useValue: createUseCase },
        { provide: GetActividadUseCase, useValue: getUseCase },
        { provide: SaveActividadUseCase, useValue: saveUseCase },
        { provide: DeleteActividadUseCase, useValue: deleteUseCase },
      ],
    }).compile();

    controller = module.get(ActividadController);
  });

  it('crea una actividad', async () => {
    const dto = { titulo: 'Riego', tipo_actividad: 'riego' } as never;
    const result = await controller.create(dto);

    expect(createUseCase.execute).toHaveBeenCalledWith(dto);
    expect(result).toMatchObject({ id_actividad: 1, titulo: 'Riego' });
  });

  it('lista actividades de forma paginada', async () => {
    const result = await controller.findAll({ page: 1, limit: 20 });

    expect(getUseCase.findAll).toHaveBeenCalledWith({ page: 1, limit: 20 });
    expect(result).toMatchObject({ total: 1, page: 1 });
    expect(result.data).toHaveLength(1);
  });

  it('actualiza una actividad existente', async () => {
    const result = await controller.update(1, {
      titulo: 'Riego',
      tipo_actividad: 'riego',
    } as never);

    expect(saveUseCase.execute).toHaveBeenCalledWith(1, {
      titulo: 'Riego',
      tipo_actividad: 'riego',
    });
    expect(result).toMatchObject({ id_actividad: 1 });
  });

  it('elimina una actividad', async () => {
    const result = await controller.remove(1);

    expect(deleteUseCase.execute).toHaveBeenCalledWith(1);
    expect(result).toEqual({ deleted: true });
  });
});
