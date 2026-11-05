import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ActividadEvidenciaDomain,
  ActividadEvidenciaProps,
} from '../../domain/entities/actividad-evidencia.entity';
import type {
  ActividadEvidenciaRepositoryPort,
  ActividadEvidenciaUpdate,
} from '../../domain/ports/actividad-evidencia.repository.port';
import type {
  PaginatedResult,
  PaginationParams,
} from '../../../common/types/pagination';
import { normalizePagination } from '../../../common/types/pagination';
import { ActividadEvidenciaOrmEntity } from './actividad-evidencia.orm-entity';

@Injectable()
export class TypeOrmActividadEvidenciaRepository implements ActividadEvidenciaRepositoryPort {
  constructor(
    @InjectRepository(ActividadEvidenciaOrmEntity)
    private readonly repository: Repository<ActividadEvidenciaOrmEntity>,
  ) {}

  async create(
    evidencia: ActividadEvidenciaDomain,
  ): Promise<ActividadEvidenciaDomain> {
    const entity = this.repository.create(
      this.toPersistence(evidencia.toPrimitives()),
    );
    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async findAll(
    params?: PaginationParams,
  ): Promise<PaginatedResult<ActividadEvidenciaDomain>> {
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
  ): Promise<ActividadEvidenciaDomain[]> {
    const entities = await this.repository.find({
      where: { id_actividad: idActividad },
      order: { fecha_registro: 'DESC' },
    });
    return entities.map((entity) => this.toDomain(entity));
  }
  async findById(id: number): Promise<ActividadEvidenciaDomain | null> {
    const entity = await this.repository.findOne({
      where: { id_actividad_evidencia: id },
      relations: { actividad: true },
    });
    return entity ? this.toDomain(entity) : null;
  }

  async update(
    id: number,
    data: ActividadEvidenciaUpdate,
  ): Promise<ActividadEvidenciaDomain | null> {
    const existing = await this.repository.findOneBy({
      id_actividad_evidencia: id,
    });
    if (!existing) return null;
    await this.repository.update({ id_actividad_evidencia: id }, data);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete({ id_actividad_evidencia: id });
    return Boolean(result.affected);
  }

  private toPersistence(
    props: ActividadEvidenciaProps,
  ): Partial<ActividadEvidenciaOrmEntity> {
    return {
      id_actividad: props.id_actividad,
      tipo_evidencia: props.tipo_evidencia,
      archivo_url: props.archivo_url,
      descripcion: props.descripcion,
      observaciones: props.observaciones,
    };
  }

  private toDomain(
    entity: ActividadEvidenciaOrmEntity,
  ): ActividadEvidenciaDomain {
    return ActividadEvidenciaDomain.fromPersistence({
      id_actividad_evidencia: entity.id_actividad_evidencia,
      id_actividad: entity.id_actividad,
      tipo_evidencia: entity.tipo_evidencia,
      archivo_url: entity.archivo_url,
      descripcion: entity.descripcion,
      observaciones: entity.observaciones,
      fecha_registro: entity.fecha_registro,
    });
  }
}
