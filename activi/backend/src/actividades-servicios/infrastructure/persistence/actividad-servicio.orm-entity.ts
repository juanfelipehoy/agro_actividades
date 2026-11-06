import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('actividades_servicios')
export class ActividadServicioOrmEntity {
  @PrimaryGeneratedColumn()
  id_servicio!: number;

  @ManyToOne('ActividadOrmEntity', 'servicios', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_actividad' })
  actividad!: any;

  @Column({ nullable: true })
  id_actividad?: number;

  @Column()
  nombre_servicio!: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  costo!: number;

  @Column({ nullable: true })
  proveedor?: string;
}
