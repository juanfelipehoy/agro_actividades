import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateActividadEvidenciaDto {
  // En multipart/form-data todos los campos llegan como string,
  // por lo que se convierte a number antes de validar (@IsInt).
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  id_actividad?: number;

  @IsString()
  @IsNotEmpty()
  tipo_evidencia!: string;

  @IsString()
  @IsOptional()
  archivo_url?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  @IsOptional()
  observaciones?: string;
}
