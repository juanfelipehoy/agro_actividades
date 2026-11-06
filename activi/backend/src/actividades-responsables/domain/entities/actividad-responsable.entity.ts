export interface ActividadResponsableProps {
  id_actividad_responsable?: number;
  id_actividad?: number;
  nombre_responsable: string;
  id_usuario?: number;
  rol?: string;
  estado_asignacion?: string;
}

export class ActividadResponsableDomain {
  private constructor(private readonly props: ActividadResponsableProps) {}

  static create(props: ActividadResponsableProps): ActividadResponsableDomain {
    return new ActividadResponsableDomain({
      ...props,
      estado_asignacion: props.estado_asignacion ?? 'asignado',
    });
  }

  static fromPersistence(
    props: ActividadResponsableProps,
  ): ActividadResponsableDomain {
    return new ActividadResponsableDomain(props);
  }

  toPrimitives(): ActividadResponsableProps {
    return { ...this.props };
  }
}
