export interface ActividadHerramientaProps {
  id_actividad_herramienta?: number;
  id_actividad: number;
  nombre_herramienta: string;
  cantidad?: number;
}

export class ActividadHerramientaDomain {
  private constructor(private readonly props: ActividadHerramientaProps) {}

  static create(props: ActividadHerramientaProps): ActividadHerramientaDomain {
    return new ActividadHerramientaDomain({
      ...props,
      cantidad: props.cantidad ?? undefined,
    });
  }

  static fromPersistence(
    props: ActividadHerramientaProps,
  ): ActividadHerramientaDomain {
    return new ActividadHerramientaDomain(props);
  }

  toPrimitives(): ActividadHerramientaProps {
    return { ...this.props };
  }
}
