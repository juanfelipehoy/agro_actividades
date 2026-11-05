import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('actividades_herramientas')
export class ActividadHerramientaOrmEntity {
  @PrimaryGeneratedColumn()
  id_herramienta!: number;

  @Column()
  id_actividad!: number;

  @Column()
  nombre_herramienta!: string;

  @Column({ type: 'int', nullable: true })
  cantidad?: number;
}
