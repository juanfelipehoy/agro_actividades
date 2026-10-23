import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ActividadServicioDomain,
  ActividadServicioProps,
} from '../../domain/entities/actividad-servicio.entity';
import type {
  ActividadServicioRepositoryPort,
  ActividadServicioUpdate,
} from '../../domain/ports/actividad-servicio.repository.port';
import { ActividadServicioOrmEntity } from './actividad-servicio.orm-entity';

@Injectable()
export class TypeOrmActividadServicioRepository implements ActividadServicioRepositoryPort {
  constructor(
    @InjectRepository(ActividadServicioOrmEntity)
    private readonly repository: Repository<ActividadServicioOrmEntity>,
  ) {}

  async create(
    servicio: ActividadServicioDomain,
  ): Promise<ActividadServicioDomain> {
    const entity = this.repository.create(
      this.toPersistence(servicio.toPrimitives()),
    );
    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async findAll(): Promise<ActividadServicioDomain[]> {
    const entities = await this.repository.find({
      relations: { actividad: true },
    });
    return entities.map((e) => this.toDomain(e));
  }

  async findById(id: number): Promise<ActividadServicioDomain | null> {
    const entity = await this.repository.findOne({
      where: { id_servicio: id },
      relations: { actividad: true },
    });
    return entity ? this.toDomain(entity) : null;
  }

  async update(
    id: number,
    data: ActividadServicioUpdate,
  ): Promise<ActividadServicioDomain | null> {
    const existing = await this.repository.findOneBy({
      id_servicio: id,
    });
    if (!existing) return null;
    await this.repository.update({ id_servicio: id }, data);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete({ id_servicio: id });
    return Boolean(result.affected);
  }

  private toPersistence(
    props: ActividadServicioProps,
  ): Partial<ActividadServicioOrmEntity> {
    return {
      id_actividad: props.id_actividad,
      nombre_servicio: props.nombre_servicio,
      descripcion: props.descripcion,
      costo: props.costo,
      proveedor: props.proveedor,
    };
  }

  private toDomain(
    entity: ActividadServicioOrmEntity,
  ): ActividadServicioDomain {
    return ActividadServicioDomain.fromPersistence({
      id_actividad_servicio: entity.id_servicio,
      id_actividad: entity.id_actividad,
      nombre_servicio: entity.nombre_servicio,
      descripcion: entity.descripcion,
      costo: entity.costo,
      proveedor: entity.proveedor,
    });
  }
}
