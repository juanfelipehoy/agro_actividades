import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ActividadResponsableDomain,
  ActividadResponsableProps,
} from '../../domain/entities/actividad-responsable.entity';
import type {
  ActividadResponsableRepositoryPort,
  ActividadResponsableUpdate,
} from '../../domain/ports/actividad-responsable.repository.port';
import { ActividadResponsableOrmEntity } from './actividad-responsable.orm-entity';

@Injectable()
export class TypeOrmActividadResponsableRepository implements ActividadResponsableRepositoryPort {
  constructor(
    @InjectRepository(ActividadResponsableOrmEntity)
    private readonly repository: Repository<ActividadResponsableOrmEntity>,
  ) {}

  async create(
    responsable: ActividadResponsableDomain,
  ): Promise<ActividadResponsableDomain> {
    const entity = this.repository.create(
      this.toPersistence(responsable.toPrimitives()),
    );
    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async findAll(): Promise<ActividadResponsableDomain[]> {
    const entities = await this.repository.find({
      relations: { actividad: true },
    });
    return entities.map((e) => this.toDomain(e));
  }

  async findById(id: number): Promise<ActividadResponsableDomain | null> {
    const entity = await this.repository.findOne({
      where: { id_responsable: id },
      relations: { actividad: true },
    });
    return entity ? this.toDomain(entity) : null;
  }

  async update(
    id: number,
    data: ActividadResponsableUpdate,
  ): Promise<ActividadResponsableDomain | null> {
    const existing = await this.repository.findOneBy({
      id_responsable: id,
    });
    if (!existing) return null;
    await this.repository.update({ id_responsable: id }, data);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete({
      id_responsable: id,
    });
    return Boolean(result.affected);
  }

  private toPersistence(
    props: ActividadResponsableProps,
  ): Partial<ActividadResponsableOrmEntity> {
    return {
      id_actividad: props.id_actividad,
      nombre_responsable: props.nombre_responsable,
      id_usuario: props.id_usuario,
      rol: props.rol,
      estado_asignacion: props.estado_asignacion,
    };
  }

  private toDomain(
    entity: ActividadResponsableOrmEntity,
  ): ActividadResponsableDomain {
    return ActividadResponsableDomain.fromPersistence({
      id_actividad_responsable: entity.id_responsable,
      id_actividad: entity.id_actividad,
      nombre_responsable: entity.nombre_responsable,
      id_usuario: entity.id_usuario,
      rol: entity.rol,
      estado_asignacion: entity.estado_asignacion,
    });
  }
}
