import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
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

  @IsDateString(
    {},
    { message: 'La fecha programada debe tener formato ISO (YYYY-MM-DD)' },
  )
  @IsOptional()
  fecha_programada?: string;

  @IsDateString(
    {},
    { message: 'La fecha de inicio debe tener formato ISO (YYYY-MM-DD)' },
  )
  @IsOptional()
  fecha_inicio?: string;

  @IsDateString(
    {},
    { message: 'La fecha de fin debe tener formato ISO (YYYY-MM-DD)' },
  )
  @IsOptional()
  fecha_fin?: string;
}
