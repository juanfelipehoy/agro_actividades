import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateActividadUseCase } from './application/use-cases/create-actividad.use-case';
import { GetActividadUseCase } from './application/use-cases/get-actividad.use-case';
import { SaveActividadUseCase } from './application/use-cases/save-actividad.use-case';
import { DeleteActividadUseCase } from './application/use-cases/delete-actividad.use-case';
import { ActividadController } from './infrastructure/http/controllers/actividad.controller';
import { ACTIVIDAD_REPOSITORY } from './domain/ports/actividad.repository.port';
import { ActividadOrmEntity } from './infrastructure/persistence/actividad.orm-entity';
import { TypeOrmActividadRepository } from './infrastructure/persistence/actividad-typeorm.repository';
import { ActividadHistorialModule } from '../actividad-historial/actividad-historial.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ActividadOrmEntity]),
    ActividadHistorialModule,
  ],
  controllers: [ActividadController],
  providers: [
    CreateActividadUseCase,
    GetActividadUseCase,
    SaveActividadUseCase,
    DeleteActividadUseCase,
    {
      provide: ACTIVIDAD_REPOSITORY,
      useClass: TypeOrmActividadRepository,
    },
  ],
  exports: [ACTIVIDAD_REPOSITORY],
})
export class ActividadesModule {}
