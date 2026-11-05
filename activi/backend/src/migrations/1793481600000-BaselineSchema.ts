import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migración base del esquema AGROSOFT.
 *
 * Es idempotente: usa CREATE TABLE IF NOT EXISTS y bloques DO con
 * verificaciones en information_schema, por lo que puede ejecutarse
 * sobre bases de datos nuevas o existentes sin fallar.
 */
export class BaselineSchema1793481600000 implements MigrationInterface {
  name = 'BaselineSchema1793481600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ---------------------------------------------------------------
    // Tabla principal: actividades
    // ---------------------------------------------------------------
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS actividades (
        id_actividad          SERIAL PRIMARY KEY,
        titulo                VARCHAR NOT NULL,
        descripcion           TEXT,
        tipo_actividad        VARCHAR NOT NULL,
        estado                VARCHAR NOT NULL DEFAULT 'pendiente',
        prioridad             VARCHAR NOT NULL DEFAULT 'media',
        fecha_programada      DATE,
        fecha_inicio          DATE,
        fecha_fin             DATE,
        fecha_creacion        TIMESTAMP NOT NULL DEFAULT now(),
        fecha_actualizacion   TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    // ---------------------------------------------------------------
    // Historial de cambios de actividades
    // ---------------------------------------------------------------
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS actividad_historial (
        id_actividad_historial SERIAL PRIMARY KEY,
        id_actividad           INTEGER NOT NULL,
        accion                 VARCHAR NOT NULL,
        estado_anterior        VARCHAR,
        estado_nuevo           VARCHAR,
        id_usuario             INTEGER NOT NULL,
        observaciones          TEXT,
        fecha_registro         TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    // Compatibilidad con el esquema anterior (renombres de columnas)
    await this.renameColumnIfNeeded(
      queryRunner,
      'actividad_historial',
      'id_historial',
      'id_actividad_historial',
    );
    await this.renameColumnIfNeeded(
      queryRunner,
      'actividad_historial',
      'fecha_cambio',
      'fecha_registro',
    );
    await queryRunner.query(
      'ALTER TABLE actividad_historial ADD COLUMN IF NOT EXISTS estado_anterior VARCHAR',
    );
    await queryRunner.query(
      'ALTER TABLE actividad_historial ADD COLUMN IF NOT EXISTS estado_nuevo VARCHAR',
    );
    await queryRunner.query(
      'ALTER TABLE actividad_historial ADD COLUMN IF NOT EXISTS id_usuario INTEGER',
    );
    await queryRunner.query(
      'ALTER TABLE actividad_historial ADD COLUMN IF NOT EXISTS observaciones TEXT',
    );
    await queryRunner.query(
      'ALTER TABLE actividad_historial ALTER COLUMN id_usuario SET NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE actividad_historial ALTER COLUMN id_usuario SET DEFAULT 1',
    );

    // ---------------------------------------------------------------
    // Evidencias de actividades (fotos, videos, documentos)
    // ---------------------------------------------------------------
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS actividades_evidencias (
        id_actividad_evidencia SERIAL PRIMARY KEY,
        id_actividad           INTEGER NOT NULL,
        tipo_evidencia         VARCHAR NOT NULL DEFAULT 'documento',
        archivo_url            VARCHAR NOT NULL,
        descripcion            TEXT,
        observaciones          VARCHAR,
        fecha_registro         TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    await this.renameColumnIfNeeded(
      queryRunner,
      'actividades_evidencias',
      'id_evidencia',
      'id_actividad_evidencia',
    );
    await this.renameColumnIfNeeded(
      queryRunner,
      'actividades_evidencias',
      'url_archivo',
      'archivo_url',
    );
    await this.renameColumnIfNeeded(
      queryRunner,
      'actividades_evidencias',
      'fecha_subida',
      'fecha_registro',
    );
    await queryRunner.query(
      "ALTER TABLE actividades_evidencias ADD COLUMN IF NOT EXISTS tipo_evidencia VARCHAR NOT NULL DEFAULT 'documento'",
    );
    await queryRunner.query(
      'ALTER TABLE actividades_evidencias ADD COLUMN IF NOT EXISTS observaciones VARCHAR',
    );
    await queryRunner.query(
      "UPDATE actividades_evidencias SET archivo_url = '' WHERE archivo_url IS NULL",
    );
    await queryRunner.query(
      'ALTER TABLE actividades_evidencias ALTER COLUMN archivo_url SET NOT NULL',
    );

    // ---------------------------------------------------------------
    // Herramientas utilizadas en actividades
    // ---------------------------------------------------------------
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS actividades_herramientas (
        id_actividad_herramienta SERIAL PRIMARY KEY,
        id_actividad              INTEGER NOT NULL,
        nombre_herramienta        VARCHAR NOT NULL,
        cantidad                  INTEGER
      )
    `);

    await this.renameColumnIfNeeded(
      queryRunner,
      'actividades_herramientas',
      'id_herramienta',
      'id_actividad_herramienta',
    );
    await queryRunner.query(
      'ALTER TABLE actividades_herramientas ADD COLUMN IF NOT EXISTS cantidad INTEGER',
    );

    // ---------------------------------------------------------------
    // Responsables de actividades
    // ---------------------------------------------------------------
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS actividades_responsables (
        id_responsable        SERIAL PRIMARY KEY,
        id_actividad          INTEGER NOT NULL,
        nombre_responsable    VARCHAR NOT NULL,
        rol                   VARCHAR,
        estado_asignacion     VARCHAR NOT NULL DEFAULT 'asignado',
        id_usuario            INTEGER
      )
    `);

    // ---------------------------------------------------------------
    // Servicios contratados para actividades
    // ---------------------------------------------------------------
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS actividades_servicios (
        id_servicio    SERIAL PRIMARY KEY,
        id_actividad   INTEGER NOT NULL,
        nombre_servicio VARCHAR NOT NULL,
        descripcion    TEXT,
        costo          NUMERIC(10,2) NOT NULL DEFAULT 0,
        proveedor      VARCHAR
      )
    `);

    // ---------------------------------------------------------------
    // Llaves foráneas (solo se crean si no existen)
    // ---------------------------------------------------------------
    await this.addForeignKeyIfMissing(
      queryRunner,
      'actividad_historial',
      'fk_historial_actividad',
      'id_actividad',
    );
    await this.addForeignKeyIfMissing(
      queryRunner,
      'actividades_evidencias',
      'fk_evidencias_actividad',
      'id_actividad',
    );
    await this.addForeignKeyIfMissing(
      queryRunner,
      'actividades_herramientas',
      'fk_herramientas_actividad',
      'id_actividad',
    );
    await this.addForeignKeyIfMissing(
      queryRunner,
      'actividades_responsables',
      'fk_responsables_actividad',
      'id_actividad',
    );
    await this.addForeignKeyIfMissing(
      queryRunner,
      'actividades_servicios',
      'fk_servicios_actividad',
      'id_actividad',
    );

    // ---------------------------------------------------------------
    // Índices para consultas frecuentes
    // ---------------------------------------------------------------
    await queryRunner.query(
      'CREATE INDEX IF NOT EXISTS idx_historial_actividad ON actividad_historial (id_actividad)',
    );
    await queryRunner.query(
      'CREATE INDEX IF NOT EXISTS idx_historial_fecha ON actividad_historial (fecha_registro DESC)',
    );
    await queryRunner.query(
      'CREATE INDEX IF NOT EXISTS idx_evidencias_actividad ON actividades_evidencias (id_actividad)',
    );
    await queryRunner.query(
      'CREATE INDEX IF NOT EXISTS idx_herramientas_actividad ON actividades_herramientas (id_actividad)',
    );
    await queryRunner.query(
      'CREATE INDEX IF NOT EXISTS idx_responsables_actividad ON actividades_responsables (id_actividad)',
    );
    await queryRunner.query(
      'CREATE INDEX IF NOT EXISTS idx_servicios_actividad ON actividades_servicios (id_actividad)',
    );
    await queryRunner.query(
      'CREATE INDEX IF NOT EXISTS idx_actividades_estado ON actividades (estado)',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS actividades_servicios');
    await queryRunner.query('DROP TABLE IF EXISTS actividades_responsables');
    await queryRunner.query('DROP TABLE IF EXISTS actividades_herramientas');
    await queryRunner.query('DROP TABLE IF EXISTS actividades_evidencias');
    await queryRunner.query('DROP TABLE IF EXISTS actividad_historial');
    await queryRunner.query('DROP TABLE IF EXISTS actividades');
  }

  private async renameColumnIfNeeded(
    queryRunner: QueryRunner,
    table: string,
    oldName: string,
    newName: string,
  ): Promise<void> {
    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = '${table}' AND column_name = '${oldName}'
        ) AND NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = '${table}' AND column_name = '${newName}'
        ) THEN
          ALTER TABLE ${table} RENAME COLUMN ${oldName} TO ${newName};
        END IF;
      END $$
    `);
  }

  private async addForeignKeyIfMissing(
    queryRunner: QueryRunner,
    table: string,
    constraintName: string,
    column: string,
  ): Promise<void> {
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.table_constraints
          WHERE table_name = '${table}' AND constraint_name = '${constraintName}'
        ) THEN
          ALTER TABLE ${table}
            ADD CONSTRAINT ${constraintName}
            FOREIGN KEY (${column})
            REFERENCES actividades (id_actividad)
            ON DELETE CASCADE;
        END IF;
      END $$
    `);
  }
}
