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
import type {
  PaginatedResult,
  PaginationParams,
} from '../../../common/types/pagination';
import { normalizePagination } from '../../../common/types/pagination';
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

  async findAll(
    params?: PaginationParams,
  ): Promise<PaginatedResult<ActividadHerramientaDomain>> {
    const { page, limit } = normalizePagination(params);

    const [entities, total] = await this.repository.findAndCount({
      order: { id_actividad_herramienta: 'DESC' },
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
  ): Promise<ActividadHerramientaDomain[]> {
    const entities = await this.repository.find({
      where: { id_actividad: idActividad },
      order: { id_actividad_herramienta: 'ASC' },
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  async findById(id: number): Promise<ActividadHerramientaDomain | null> {
    const entity = await this.repository.findOne({
      where: { id_actividad_herramienta: id },
    });
    return entity ? this.toDomain(entity) : null;
  }

  async update(
    id: number,
    data: ActividadHerramientaUpdate,
  ): Promise<ActividadHerramientaDomain | null> {
    const existing = await this.repository.findOneBy({
      id_actividad_herramienta: id,
    });
    if (!existing) return null;
    await this.repository.update({ id_actividad_herramienta: id }, data);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete({
      id_actividad_herramienta: id,
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
    };
  }

  private toDomain(
    entity: ActividadHerramientaOrmEntity,
  ): ActividadHerramientaDomain {
    return ActividadHerramientaDomain.fromPersistence({
      id_actividad_herramienta: entity.id_actividad_herramienta,
      id_actividad: entity.id_actividad ?? undefined,
      nombre_herramienta: entity.nombre_herramienta,
      cantidad: entity.cantidad,
    });
  }
}
