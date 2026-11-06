import { useActividadesOptions } from '../hooks/useActividades';

interface ActividadBadgeProps {
  idActividad: number;
}

const TIPOS_ACTIVIDAD: Record<string, string> = {
  siembra: 'Siembra',
  riego: 'Riego',
  fertilizacion: 'Fertilización',
  cosecha: 'Cosecha',
  poda: 'Poda',
  plagas: 'Control de plagas',
};

const ActividadBadge = ({ idActividad }: ActividadBadgeProps) => {
  const { data: actividades } = useActividadesOptions();
  const actividad = actividades?.find((a) => a.id_actividad === idActividad);

  const tipo = actividad ? (TIPOS_ACTIVIDAD[actividad.tipo_actividad] ?? actividad.tipo_actividad) : '';
  const fecha = actividad?.fecha_programada
    ? new Date(actividad.fecha_programada).toLocaleDateString('es-CO', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '';

  return (
    <span
      className="inline-flex max-w-full items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700"
      title={actividad ? `${tipo} · ${fecha}` : undefined}
    >
      <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
      <span className="truncate">{actividad ? actividad.titulo : `Actividad #${idActividad}`}</span>
    </span>
  );
};

export default ActividadBadge;
