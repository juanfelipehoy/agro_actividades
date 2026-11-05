import { Injectable, Logger } from '@nestjs/common';
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
  private readonly logger = new Logger(
    TypeOrmActividadHerramientaRepository.name,
  );

  constructor(
    @InjectRepository(ActividadHerramientaOrmEntity)
    private readonly repository: Repository<ActividadHerramientaOrmEntity>,
  ) {}

  async create(
    herramienta: ActividadHerramientaDomain,
  ): Promise<ActividadHerramientaDomain> {
    try {
      const props = herramienta.toPrimitives();
      this.logger?.log(
        `Creating herramienta with props: ${JSON.stringify(props)}`,
      );

      const entity = this.repository.create(this.toPersistence(props));
      const saved = await this.repository.save(entity);
      this.logger?.log(`Herramienta saved with ID: ${saved.id_herramienta}`);
      return this.toDomain(saved);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const stack = error instanceof Error ? error.stack : undefined;
      this.logger?.error(`Error in repository create: ${message}`, stack);
      throw error;
    }
  }

  async findAll(): Promise<ActividadHerramientaDomain[]> {
    const entities = await this.repository.find();
    return entities.map((e) => this.toDomain(e));
  }

  async findById(id: number): Promise<ActividadHerramientaDomain | null> {
    const entity = await this.repository.findOne({
      where: { id_herramienta: id },
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
    });
  }
}
