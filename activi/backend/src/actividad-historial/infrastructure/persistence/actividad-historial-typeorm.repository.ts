import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ActividadHistorialDomain,
  ActividadHistorialProps,
} from '../../domain/entities/actividad-historial.entity';
import type {
  ActividadHistorialRepositoryPort,
  ActividadHistorialUpdate,
} from '../../domain/ports/actividad-historial.repository.port';
import type {
  PaginatedResult,
  PaginationParams,
} from '../../../common/types/pagination';
import { normalizePagination } from '../../../common/types/pagination';
import { ActividadHistorialOrmEntity } from './actividad-historial.orm-entity';

@Injectable()
export class TypeOrmActividadHistorialRepository implements ActividadHistorialRepositoryPort {
  constructor(
    @InjectRepository(ActividadHistorialOrmEntity)
    private readonly repository: Repository<ActividadHistorialOrmEntity>,
  ) {}

  async create(
    historial: ActividadHistorialDomain,
  ): Promise<ActividadHistorialDomain> {
    const entity = this.repository.create(
      this.toPersistence(historial.toPrimitives()),
    );
    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async findAll(
    params?: PaginationParams,
  ): Promise<PaginatedResult<ActividadHistorialDomain>> {
    const { page, limit } = normalizePagination(params);

    const [entities, total] = await this.repository.findAndCount({
      relations: { actividad: true },
      order: { fecha_registro: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: entities.map((e) => this.toDomain(e)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findByActividad(
    idActividad: number,
  ): Promise<ActividadHistorialDomain[]> {
    const entities = await this.repository.find({
      where: { id_actividad: idActividad },
      order: { fecha_registro: 'DESC' },
    });
    return entities.map((entity) => this.toDomain(entity));
  }
  async findById(id: number): Promise<ActividadHistorialDomain | null> {
    const entity = await this.repository.findOne({
      where: { id_actividad_historial: id },
      relations: { actividad: true },
    });
    return entity ? this.toDomain(entity) : null;
  }

  async update(
    id: number,
    data: ActividadHistorialUpdate,
  ): Promise<ActividadHistorialDomain | null> {
    const existing = await this.repository.findOneBy({
      id_actividad_historial: id,
    });
    if (!existing) return null;
    await this.repository.update({ id_actividad_historial: id }, data);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete({ id_actividad_historial: id });
    return Boolean(result.affected);
  }

  private toPersistence(
    props: ActividadHistorialProps,
  ): Partial<ActividadHistorialOrmEntity> {
    return {
      id_actividad: props.id_actividad,
      accion: props.accion,
      estado_anterior: props.estado_anterior,
      estado_nuevo: props.estado_nuevo,
      id_usuario: props.id_usuario,
      observaciones: props.observaciones,
    };
  }

  private toDomain(
    entity: ActividadHistorialOrmEntity,
  ): ActividadHistorialDomain {
    return ActividadHistorialDomain.fromPersistence({
      id_actividad_historial: entity.id_actividad_historial,
      id_actividad: entity.id_actividad,
      accion: entity.accion,
      estado_anterior: entity.estado_anterior,
      estado_nuevo: entity.estado_nuevo,
      id_usuario: entity.id_usuario,
      observaciones: entity.observaciones,
      fecha_registro: entity.fecha_registro,
    });
  }
}
