export type ActividadEstado = string;
export type ActividadPrioridad = string;

export interface ActividadProps {
  id_actividad?: number;
  titulo: string;
  descripcion?: string;
  tipo_actividad: string;
  estado?: ActividadEstado;
  prioridad?: ActividadPrioridad;
  fecha_programada?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  fecha_creacion?: Date;
  fecha_actualizacion?: Date;
  responsables?: unknown[];
  evidencias?: unknown[];
  servicios?: unknown[];
  herramientas?: unknown[];
  historial?: unknown[];
}

export class ActividadDomain {
  private constructor(private readonly props: ActividadProps) {}

  static create(props: ActividadProps): ActividadDomain {
    return new ActividadDomain({
      ...props,
      estado: props.estado ?? 'pendiente',
      prioridad: props.prioridad ?? 'media',
    });
  }

  static fromPersistence(props: ActividadProps): ActividadDomain {
    return new ActividadDomain(props);
  }

  toPrimitives(): ActividadProps {
    return { ...this.props };
  }
}
