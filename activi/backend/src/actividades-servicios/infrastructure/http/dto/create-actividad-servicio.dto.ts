import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateActividadServicioDto {
  @IsInt()
  @IsOptional()
  id_actividad?: number;

  @IsString()
  @IsNotEmpty()
  nombre_servicio!: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsNumber()
  @IsOptional()
  costo?: number;

  @IsString()
  @IsOptional()
  proveedor?: string;
}
