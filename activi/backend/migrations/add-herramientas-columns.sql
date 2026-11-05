-- Agregar columnas faltantes a la tabla actividades_herramientas
ALTER TABLE actividades_herramientas 
ADD COLUMN IF NOT EXISTS unidad_medida VARCHAR(50),
ADD COLUMN IF NOT EXISTS estado_uso VARCHAR(50),
ADD COLUMN IF NOT EXISTS observaciones TEXT;

-- Modificar cantidad para que sea nullable
ALTER TABLE actividades_herramientas 
ALTER COLUMN cantidad DROP NOT NULL;
