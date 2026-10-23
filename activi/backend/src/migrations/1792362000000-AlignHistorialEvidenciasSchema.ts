import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlignHistorialEvidenciasSchema1792362000000 implements MigrationInterface {
  name = 'AlignHistorialEvidenciasSchema1792362000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'actividad_historial' AND column_name = 'id_historial'
        ) AND NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'actividad_historial' AND column_name = 'id_actividad_historial'
        ) THEN
          ALTER TABLE actividad_historial RENAME COLUMN id_historial TO id_actividad_historial;
        END IF;

        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'actividad_historial' AND column_name = 'fecha_cambio'
        ) AND NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'actividad_historial' AND column_name = 'fecha_registro'
        ) THEN
          ALTER TABLE actividad_historial RENAME COLUMN fecha_cambio TO fecha_registro;
        END IF;
      END $$;
    `);

    await queryRunner.query(
      'ALTER TABLE actividad_historial ADD COLUMN IF NOT EXISTS estado_anterior varchar',
    );
    await queryRunner.query(
      'ALTER TABLE actividad_historial ADD COLUMN IF NOT EXISTS estado_nuevo varchar',
    );
    await queryRunner.query(
      'ALTER TABLE actividad_historial ADD COLUMN IF NOT EXISTS id_usuario integer NOT NULL DEFAULT 1',
    );
    await queryRunner.query(
      'ALTER TABLE actividad_historial ADD COLUMN IF NOT EXISTS observaciones text',
    );

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'actividades_evidencias' AND column_name = 'id_evidencia'
        ) AND NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'actividades_evidencias' AND column_name = 'id_actividad_evidencia'
        ) THEN
          ALTER TABLE actividades_evidencias RENAME COLUMN id_evidencia TO id_actividad_evidencia;
        END IF;

        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'actividades_evidencias' AND column_name = 'url_archivo'
        ) AND NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'actividades_evidencias' AND column_name = 'archivo_url'
        ) THEN
          ALTER TABLE actividades_evidencias RENAME COLUMN url_archivo TO archivo_url;
        END IF;

        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'actividades_evidencias' AND column_name = 'fecha_subida'
        ) AND NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'actividades_evidencias' AND column_name = 'fecha_registro'
        ) THEN
          ALTER TABLE actividades_evidencias RENAME COLUMN fecha_subida TO fecha_registro;
        END IF;
      END $$;
    `);

    await queryRunner.query(
      "ALTER TABLE actividades_evidencias ADD COLUMN IF NOT EXISTS tipo_evidencia varchar NOT NULL DEFAULT 'documento'",
    );
    await queryRunner.query(
      'ALTER TABLE actividades_evidencias ADD COLUMN IF NOT EXISTS observaciones varchar',
    );
    await queryRunner.query(
      "UPDATE actividades_evidencias SET archivo_url = '' WHERE archivo_url IS NULL",
    );
    await queryRunner.query(
      'ALTER TABLE actividades_evidencias ALTER COLUMN archivo_url SET NOT NULL',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE actividades_evidencias ALTER COLUMN archivo_url DROP NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE actividades_evidencias DROP COLUMN IF EXISTS observaciones',
    );
    await queryRunner.query(
      'ALTER TABLE actividades_evidencias DROP COLUMN IF EXISTS tipo_evidencia',
    );
    await queryRunner.query(
      'ALTER TABLE actividad_historial DROP COLUMN IF EXISTS observaciones',
    );
    await queryRunner.query(
      'ALTER TABLE actividad_historial DROP COLUMN IF EXISTS id_usuario',
    );
    await queryRunner.query(
      'ALTER TABLE actividad_historial DROP COLUMN IF EXISTS estado_nuevo',
    );
    await queryRunner.query(
      'ALTER TABLE actividad_historial DROP COLUMN IF EXISTS estado_anterior',
    );
  }
}
