import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { ActividadResponsableOrmEntity } from '../../../actividades-responsables/infrastructure/persistence/actividad-responsable.orm-entity';
import type { ActividadEvidenciaOrmEntity } from '../../../actividades-evidencias/infrastructure/persistence/actividad-evidencia.orm-entity';
import type { ActividadServicioOrmEntity } from '../../../actividades-servicios/infrastructure/persistence/actividad-servicio.orm-entity';
import type { ActividadHerramientaOrmEntity } from '../../../actividades-herramientas/infrastructure/persistence/actividad-herramienta.orm-entity';
import type { ActividadHistorialOrmEntity } from '../../../actividad-historial/infrastructure/persistence/actividad-historial.orm-entity';

@Entity('actividades')
export class ActividadOrmEntity {
  @PrimaryGeneratedColumn()
  id_actividad!: number;

  @Column()
  titulo!: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  @Column()
  tipo_actividad!: string;

  @Column({ default: 'pendiente' })
  estado!: string;

  @Column({ default: 'media' })
  prioridad!: string;

  @Column({ type: 'date', nullable: true })
  fecha_programada?: string;

  @Column({ type: 'date', nullable: true })
  fecha_inicio?: string;

  @Column({ type: 'date', nullable: true })
  fecha_fin?: string;

  @CreateDateColumn()
  fecha_creacion!: Date;

  @UpdateDateColumn()
  fecha_actualizacion!: Date;

  @OneToMany('ActividadResponsableOrmEntity', 'actividad')
  responsables!: ActividadResponsableOrmEntity[];

  @OneToMany('ActividadEvidenciaOrmEntity', 'actividad')
  evidencias!: ActividadEvidenciaOrmEntity[];

  @OneToMany('ActividadServicioOrmEntity', 'actividad')
  servicios!: ActividadServicioOrmEntity[];

  @OneToMany('ActividadHerramientaOrmEntity', 'actividad')
  herramientas!: ActividadHerramientaOrmEntity[];

  @OneToMany('ActividadHistorialOrmEntity', 'actividad')
  historial!: ActividadHistorialOrmEntity[];
}
