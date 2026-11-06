import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('actividades_evidencias')
export class ActividadEvidenciaOrmEntity {
  @PrimaryGeneratedColumn()
  id_actividad_evidencia!: number;

  @ManyToOne('ActividadOrmEntity', 'evidencias', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_actividad' })
  actividad!: any;

  @Column({ nullable: true })
  id_actividad?: number;

  @Column()
  tipo_evidencia!: string;

  @Column()
  archivo_url!: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  @Column({ nullable: true })
  observaciones?: string;

  @CreateDateColumn()
  fecha_registro!: Date;
}
