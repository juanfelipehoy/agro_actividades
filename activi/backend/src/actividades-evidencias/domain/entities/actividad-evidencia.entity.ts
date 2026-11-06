export interface ActividadEvidenciaProps {
  id_actividad_evidencia?: number;
  id_actividad?: number;
  tipo_evidencia: string;
  archivo_url: string;
  descripcion?: string;
  observaciones?: string;
  fecha_registro?: Date;
}

export class ActividadEvidenciaDomain {
  private constructor(private readonly props: ActividadEvidenciaProps) {}

  static create(props: ActividadEvidenciaProps): ActividadEvidenciaDomain {
    return new ActividadEvidenciaDomain(props);
  }

  static fromPersistence(
    props: ActividadEvidenciaProps,
  ): ActividadEvidenciaDomain {
    return new ActividadEvidenciaDomain(props);
  }

  toPrimitives(): ActividadEvidenciaProps {
    return { ...this.props };
  }
}
