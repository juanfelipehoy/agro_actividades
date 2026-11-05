import { useActividadesOptions } from '../hooks/useActividades';

interface ActividadSelectProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

const ActividadSelect = ({ value, onChange, required = true }: ActividadSelectProps) => {
  const { data: actividades, isLoading } = useActividadesOptions();

  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-500">
        Actividad relacionada *
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={isLoading}
        className="w-full rounded-xl border border-emerald-100 bg-emerald-50/50 px-4 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 disabled:opacity-60"
      >
        <option value="">
          {isLoading ? 'Cargando actividades...' : 'Selecciona una actividad'}
        </option>
        {(actividades ?? []).map((a) => (
          <option key={a.id_actividad} value={String(a.id_actividad)}>
            #{a.id_actividad} — {a.titulo}
          </option>
        ))}
      </select>
      {!isLoading && (actividades ?? []).length === 0 && (
        <p className="mt-1 text-xs text-amber-600">
          No hay actividades registradas. Crea una actividad primero.
        </p>
      )}
    </div>
  );
};

export default ActividadSelect;
