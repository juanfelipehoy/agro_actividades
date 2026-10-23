import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class InitialSetup1700010000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Tabla actividades
    await queryRunner.createTable(
      new Table({
        name: 'actividades',
        columns: [
          {
            name: 'id_actividad',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'titulo',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'descripcion',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'tipo_actividad',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'estado',
            type: 'varchar',
            default: "'pendiente'",
          },
          {
            name: 'prioridad',
            type: 'varchar',
            default: "'media'",
          },
          {
            name: 'fecha_programada',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'fecha_inicio',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'fecha_fin',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'id_cultivo_real',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'fecha_creacion',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'fecha_actualizacion',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // Tabla actividad_historial
    await queryRunner.createTable(
      new Table({
        name: 'actividad_historial',
        columns: [
          {
            name: 'id_historial',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'id_actividad',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'accion',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'descripcion',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'fecha_cambio',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'usuario',
            type: 'varchar',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // Tabla actividades_evidencias
    await queryRunner.createTable(
      new Table({
        name: 'actividades_evidencias',
        columns: [
          {
            name: 'id_evidencia',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'id_actividad',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'descripcion',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'url_archivo',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'fecha_subida',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    // Tabla actividades_herramientas
    await queryRunner.createTable(
      new Table({
        name: 'actividades_herramientas',
        columns: [
          {
            name: 'id_herramienta',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'id_actividad',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'nombre_herramienta',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'cantidad',
            type: 'integer',
            default: 1,
          },
          {
            name: 'unidad_medida',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'estado_uso',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'observaciones',
            type: 'text',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // Tabla actividades_responsables
    await queryRunner.createTable(
      new Table({
        name: 'actividades_responsables',
        columns: [
          {
            name: 'id_responsable',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'id_actividad',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'nombre_responsable',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'rol',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'estado_asignacion',
            type: 'varchar',
            default: "'asignado'",
          },
          {
            name: 'id_usuario',
            type: 'integer',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // Tabla actividades_servicios
    await queryRunner.createTable(
      new Table({
        name: 'actividades_servicios',
        columns: [
          {
            name: 'id_servicio',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'id_actividad',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'nombre_servicio',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'descripcion',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'costo',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: 0,
          },
          {
            name: 'proveedor',
            type: 'varchar',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // Foreign Keys
    await queryRunner.createForeignKey(
      'actividad_historial',
      new TableForeignKey({
        columnNames: ['id_actividad'],
        referencedColumnNames: ['id_actividad'],
        referencedTableName: 'actividades',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'actividades_evidencias',
      new TableForeignKey({
        columnNames: ['id_actividad'],
        referencedColumnNames: ['id_actividad'],
        referencedTableName: 'actividades',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'actividades_herramientas',
      new TableForeignKey({
        columnNames: ['id_actividad'],
        referencedColumnNames: ['id_actividad'],
        referencedTableName: 'actividades',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'actividades_responsables',
      new TableForeignKey({
        columnNames: ['id_actividad'],
        referencedColumnNames: ['id_actividad'],
        referencedTableName: 'actividades',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'actividades_servicios',
      new TableForeignKey({
        columnNames: ['id_actividad'],
        referencedColumnNames: ['id_actividad'],
        referencedTableName: 'actividades',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('actividades_servicios');
    await queryRunner.dropTable('actividades_responsables');
    await queryRunner.dropTable('actividades_herramientas');
    await queryRunner.dropTable('actividades_evidencias');
    await queryRunner.dropTable('actividad_historial');
    await queryRunner.dropTable('actividades');
  }
}
