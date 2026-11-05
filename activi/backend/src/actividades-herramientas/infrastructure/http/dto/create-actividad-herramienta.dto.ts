import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateActividadHerramientaDto {
  @IsInt()
  @IsNotEmpty()
  id_actividad!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre_herramienta!: string;

  @IsInt()
  @IsOptional()
  cantidad?: number;
}
