import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('actividades_responsables')
export class ActividadResponsableOrmEntity {
  @PrimaryGeneratedColumn()
  id_responsable!: number;

  @ManyToOne('ActividadOrmEntity', 'responsables', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_actividad' })
  actividad!: any;

  @Column({ nullable: true })
  id_actividad?: number;

  @Column()
  nombre_responsable!: string;

  @Column({ nullable: true })
  rol?: string;

  @Column({ default: 'asignado' })
  estado_asignacion!: string;

  @Column({ nullable: true })
  id_usuario?: number;
}
