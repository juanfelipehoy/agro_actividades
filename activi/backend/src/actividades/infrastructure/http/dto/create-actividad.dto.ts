import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import {
  ActividadEstado,
  ActividadPrioridad,
  TipoActividad,
} from './actividad.enums';

export class CreateActividadDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 150, { message: 'El título debe tener entre 3 y 150 caracteres' })
  titulo!: string;

  @IsString()
  @IsOptional()
  @Length(0, 2000, {
    message: 'La descripción no puede exceder 2000 caracteres',
  })
  descripcion?: string;

  @IsEnum(TipoActividad, { message: 'Tipo de actividad inválido' })
  tipo_actividad!: TipoActividad;

  @IsEnum(ActividadEstado, { message: 'Estado inválido' })
  @IsOptional()
  estado?: ActividadEstado;

  @IsEnum(ActividadPrioridad, { message: 'Prioridad inválida' })
  @IsOptional()
  prioridad?: ActividadPrioridad;

  @IsString()
  @IsOptional()
  fecha_programada?: string;

  @IsString()
  @IsOptional()
  fecha_inicio?: string;

  @IsString()
  @IsOptional()
  fecha_fin?: string;

  @IsInt()
  @Min(1, { message: 'ID de cultivo debe ser positivo' })
  @IsOptional()
  id_cultivo_real?: number;
}
