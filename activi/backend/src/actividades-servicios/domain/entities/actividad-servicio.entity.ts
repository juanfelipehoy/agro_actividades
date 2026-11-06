export interface ActividadServicioProps {
  id_actividad_servicio?: number;
  id_actividad?: number;
  nombre_servicio: string;
  descripcion?: string;
  costo?: number;
  proveedor?: string;
}

export class ActividadServicioDomain {
  private constructor(private readonly props: ActividadServicioProps) {}

  static create(props: ActividadServicioProps): ActividadServicioDomain {
    return new ActividadServicioDomain({
      ...props,
      costo: props.costo ?? 0,
    });
  }

  static fromPersistence(
    props: ActividadServicioProps,
  ): ActividadServicioDomain {
    return new ActividadServicioDomain(props);
  }

  toPrimitives(): ActividadServicioProps {
    return { ...this.props };
  }
}
