import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ActividadHerramientaDomain,
  ActividadHerramientaProps,
} from '../../domain/entities/actividad-herramienta.entity';
import type {
  ActividadHerramientaRepositoryPort,
  ActividadHerramientaUpdate,
} from '../../domain/ports/actividad-herramienta.repository.port';
import { ActividadHerramientaOrmEntity } from './actividad-herramienta.orm-entity';

@Injectable()
export class TypeOrmActividadHerramientaRepository implements ActividadHerramientaRepositoryPort {
  constructor(
    @InjectRepository(ActividadHerramientaOrmEntity)
    private readonly repository: Repository<ActividadHerramientaOrmEntity>,
  ) {}

  async create(
    herramienta: ActividadHerramientaDomain,
  ): Promise<ActividadHerramientaDomain> {
    const entity = this.repository.create(
      this.toPersistence(herramienta.toPrimitives()),
    );
    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async findAll(): Promise<ActividadHerramientaDomain[]> {
    const entities = await this.repository.find({
      relations: { actividad: true },
    });
    return entities.map((e) => this.toDomain(e));
  }

  async findById(id: number): Promise<ActividadHerramientaDomain | null> {
    const entity = await this.repository.findOne({
      where: { id_herramienta: id },
      relations: { actividad: true },
    });
    return entity ? this.toDomain(entity) : null;
  }

  async update(
    id: number,
    data: ActividadHerramientaUpdate,
  ): Promise<ActividadHerramientaDomain | null> {
    const existing = await this.repository.findOneBy({
      id_herramienta: id,
    });
    if (!existing) return null;
    await this.repository.update({ id_herramienta: id }, data);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete({
      id_herramienta: id,
    });
    return Boolean(result.affected);
  }

  private toPersistence(
    props: ActividadHerramientaProps,
  ): Partial<ActividadHerramientaOrmEntity> {
    return {
      id_actividad: props.id_actividad,
      nombre_herramienta: props.nombre_herramienta,
      cantidad: props.cantidad,
      unidad_medida: props.unidad_medida,
      estado_uso: props.estado_uso,
      observaciones: props.observaciones,
    };
  }

  private toDomain(
    entity: ActividadHerramientaOrmEntity,
  ): ActividadHerramientaDomain {
    return ActividadHerramientaDomain.fromPersistence({
      id_actividad_herramienta: entity.id_herramienta,
      id_actividad: entity.id_actividad,
      nombre_herramienta: entity.nombre_herramienta,
      cantidad: entity.cantidad,
      unidad_medida: entity.unidad_medida,
      estado_uso: entity.estado_uso,
      observaciones: entity.observaciones,
    });
  }
}
