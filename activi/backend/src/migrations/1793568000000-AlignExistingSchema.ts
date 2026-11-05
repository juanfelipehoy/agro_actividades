import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Alinea el esquema existente con las entidades TypeORM.
 * Cubre bases de datos creadas con versiones anteriores del esquema,
 * donde faltaban columnas o los tipos no coincidían.
 * Idempotente: todos los ALTER usan IF NOT EXISTS / verificaciones.
 */
export class AlignExistingSchema1793568000000 implements MigrationInterface {
  name = 'AlignExistingSchema1793568000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // actividades_responsables
    await queryRunner.query(
      "ALTER TABLE actividades_responsables ADD COLUMN IF NOT EXISTS estado_asignacion VARCHAR NOT NULL DEFAULT 'asignado'",
    );
    await queryRunner.query(
      'ALTER TABLE actividades_responsables ADD COLUMN IF NOT EXISTS id_usuario INTEGER',
    );

    // actividades_servicios
    await queryRunner.query(
      'ALTER TABLE actividades_servicios ADD COLUMN IF NOT EXISTS descripcion TEXT',
    );
    await queryRunner.query(
      'ALTER TABLE actividades_servicios ADD COLUMN IF NOT EXISTS costo NUMERIC(10,2) NOT NULL DEFAULT 0',
    );

    // actividades: las fechas deben ser DATE (las entidades usan type: 'date')
    for (const column of ['fecha_programada', 'fecha_inicio', 'fecha_fin']) {
      await queryRunner.query(`
        DO $$
        BEGIN
          IF EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'actividades' AND column_name = '${column}'
              AND data_type = 'timestamp without time zone'
          ) THEN
            ALTER TABLE actividades ALTER COLUMN ${column} TYPE date
              USING ${column}::date;
          END IF;
        END $$
      `);
    }
  }

  public async down(): Promise<void> {
    // No destructiva: las columnas añadidas son compatibles con el esquema base.
  }
}
