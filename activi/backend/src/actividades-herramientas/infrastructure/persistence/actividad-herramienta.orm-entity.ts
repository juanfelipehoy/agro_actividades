import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('actividades_herramientas')
export class ActividadHerramientaOrmEntity {
  @PrimaryGeneratedColumn()
  id_herramienta!: number;

  @ManyToOne('ActividadOrmEntity', 'herramientas', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_actividad' })
  actividad!: any;

  @Column()
  id_actividad!: number;

  @Column()
  nombre_herramienta!: string;

  @Column({ type: 'int', default: 1 })
  cantidad!: number;

  @Column({ nullable: true })
  unidad_medida?: string;

  @Column({ nullable: true })
  estado_uso?: string;

  @Column({ type: 'text', nullable: true })
  observaciones?: string;
}
