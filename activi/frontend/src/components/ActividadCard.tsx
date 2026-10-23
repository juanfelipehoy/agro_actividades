import { Actividad } from '../services/api';

interface ActividadCardProps {
  actividad: Actividad;
  onEdit: (actividad: Actividad) => void;
  onDelete: (id: number) => void;
}

const estados = {
  pendiente: 'bg-amber-50 text-amber-700 border-amber-200',
  en_proceso: 'bg-blue-50 text-blue-700 border-blue-200',
  completada: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelada: 'bg-red-50 text-red-700 border-red-200',
};

const prioridades = {
  alta: 'bg-red-50 text-red-700',
  media: 'bg-amber-50 text-amber-700',
  baja: 'bg-emerald-50 text-emerald-700',
};

const ActividadCard = ({ actividad, onEdit, onDelete }: ActividadCardProps) => {
  const estado = actividad.estado || 'pendiente';
  const prioridad = actividad.prioridad || 'media';

  return (
    <article className="rounded-2xl border border-emerald-100/60 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-100/40">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 20V10m0 0c-2.7 0-5-1.5-6-4 3.5-.5 5.5.5 6 4Zm0 0c2.7 0 5-1.5 6-4-3.5-.5-5.5.5-6 4Z" />
            </svg>
          </div>
          <div className="min-w-0">
            <h3 className="truncate font-semibold text-gray-800">{actividad.titulo}</h3>
            <p className="mt-0.5 text-xs capitalize text-gray-500">{actividad.tipo_actividad.replace('_', ' ')}</p>
          </div>
        </div>
        <span className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium ${estados[estado as keyof typeof estados] || estados.pendiente}`}>
          {estado.replace('_', ' ')}
        </span>
      </div>

      {actividad.descripcion ? (
        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-gray-600">{actividad.descripcion}</p>
      ) : (
        <p className="mb-4 text-sm text-gray-400">Sin descripción</p>
      )}

      <div className="mb-4 flex items-center justify-between border-t border-gray-50 pt-3 text-xs text-gray-500">
        <span>{actividad.fecha_programada ? new Date(actividad.fecha_programada).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Sin fecha programada'}</span>
        <span className={`rounded-md px-2 py-1 font-medium ${prioridades[prioridad as keyof typeof prioridades] || prioridades.media}`}>
          Prioridad {prioridad}
        </span>
      </div>

      <div className="flex gap-2">
        <button type="button" onClick={() => onEdit(actividad)} className="btn-secondary flex-1">
          Editar
        </button>
        <button
          type="button"
          onClick={() => actividad.id_actividad !== undefined && onDelete(actividad.id_actividad)}
          className="rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
          aria-label={`Eliminar ${actividad.titulo}`}
        >
          Eliminar
        </button>
      </div>
    </article>
  );
};

export default ActividadCard;
