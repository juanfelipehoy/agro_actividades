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
  id_actividad_herramienta!: number;

  @ManyToOne('ActividadOrmEntity', 'herramientas', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_actividad' })
  actividad!: any;

  @Column()
  id_actividad!: number;

  @Column()
  nombre_herramienta!: string;

  @Column({ type: 'int', nullable: true })
  cantidad?: number;
}
