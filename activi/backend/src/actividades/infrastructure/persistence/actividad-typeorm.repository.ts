import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ActividadDomain,
  ActividadProps,
} from '../../domain/entities/actividad.entity';
import type {
  ActividadRepositoryPort,
  ActividadUpdate,
} from '../../domain/ports/actividad.repository.port';
import type {
  PaginatedResult,
  PaginationParams,
} from '../../../common/types/pagination';
import { normalizePagination } from '../../../common/types/pagination';
import { ActividadOrmEntity } from './actividad.orm-entity';

@Injectable()
export class TypeOrmActividadRepository implements ActividadRepositoryPort {
  constructor(
    @InjectRepository(ActividadOrmEntity)
    private readonly actividadesRepository: Repository<ActividadOrmEntity>,
  ) {}

  async create(actividad: ActividadDomain): Promise<ActividadDomain> {
    const persistence = this.actividadesRepository.create(
      this.toPersistence(actividad.toPrimitives()),
    );
    const saved = await this.actividadesRepository.save(persistence);
    const withRelations = await this.findById(saved.id_actividad);
    return withRelations ?? this.toDomain(saved);
  }

  async findAll(
    params?: PaginationParams,
  ): Promise<PaginatedResult<ActividadDomain>> {
    const { page, limit } = normalizePagination(params);

    const [actividades, total] = await this.actividadesRepository.findAndCount({
      relations: ['historial'],
      order: { fecha_creacion: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: actividades.map((actividad) => this.toDomain(actividad)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: number): Promise<ActividadDomain | null> {
    const actividad = await this.actividadesRepository.findOne({
      where: { id_actividad: id },
      relations: [
        'historial',
        'responsables',
        'evidencias',
        'herramientas',
        'servicios',
      ],
    });

    return actividad ? this.toDomain(actividad) : null;
  }

  async countByEstado(): Promise<{ estado: string; total: number }[]> {
    const rows = await this.actividadesRepository
      .createQueryBuilder('actividad')
      .select('actividad.estado', 'estado')
      .addSelect('COUNT(*)', 'total')
      .groupBy('actividad.estado')
      .getRawMany<{ estado: string; total: string }>();

    return rows.map((row) => ({
      estado: row.estado,
      total: Number(row.total),
    }));
  }

  async update(
    id: number,
    actividad: ActividadUpdate,
  ): Promise<ActividadDomain | null> {
    const existing = await this.actividadesRepository.findOne({
      where: { id_actividad: id },
    });

    if (!existing) {
      return null;
    }

    await this.actividadesRepository.update({ id_actividad: id }, actividad);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.actividadesRepository.delete({
      id_actividad: id,
    });
    return Boolean(result.affected);
  }

  private toPersistence(
    actividad: ActividadProps,
  ): Partial<ActividadOrmEntity> {
    return {
      id_actividad: actividad.id_actividad,
      titulo: actividad.titulo,
      descripcion: actividad.descripcion,
      tipo_actividad: actividad.tipo_actividad,
      estado: actividad.estado,
      prioridad: actividad.prioridad,
      fecha_programada: actividad.fecha_programada,
      fecha_inicio: actividad.fecha_inicio,
      fecha_fin: actividad.fecha_fin,
    };
  }

  private toDomain(actividad: ActividadOrmEntity): ActividadDomain {
    const data: ActividadProps = {
      id_actividad: actividad.id_actividad,
      titulo: actividad.titulo,
      descripcion: actividad.descripcion,
      tipo_actividad: actividad.tipo_actividad,
      estado: actividad.estado,
      prioridad: actividad.prioridad,
      fecha_programada: actividad.fecha_programada,
      fecha_inicio: actividad.fecha_inicio,
      fecha_fin: actividad.fecha_fin,
      fecha_creacion: actividad.fecha_creacion,
      fecha_actualizacion: actividad.fecha_actualizacion,
      responsables: actividad.responsables,
      evidencias: actividad.evidencias,
      servicios: actividad.servicios,
      herramientas: actividad.herramientas,
      historial: actividad.historial,
    };

    return ActividadDomain.fromPersistence(data);
  }
}
