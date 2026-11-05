import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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
  responsables!: any[];

  @OneToMany('ActividadEvidenciaOrmEntity', 'actividad')
  evidencias!: any[];

  @OneToMany('ActividadServicioOrmEntity', 'actividad')
  servicios!: any[];

  @OneToMany('ActividadHerramientaOrmEntity', 'actividad')
  herramientas!: any[];

  @OneToMany('ActividadHistorialOrmEntity', 'actividad')
  historial!: any[];
}
