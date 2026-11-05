import { Link } from 'react-router-dom';
import {
  useActividades,
  useActividadStats,
} from '../hooks/useActividades';
import { useHistorial } from '../hooks/useHistorial';
import { useEvidencias } from '../hooks/useEvidencias';
import { useHerramientas, useResponsables, useServicios } from '../hooks/useRecursos';
import { getErrorMessage } from '../utils/errors';

const HomePage = () => {
  const { data: actividades, isError: errorActividades } = useActividades(1, 5);
  const { data: stats } = useActividadStats();
  const { data: historial, isError: errorHistorial } = useHistorial(1, 5);
  const { data: evidencias, isError: errorEvidencias } = useEvidencias(1, 4);
  const { data: herramientas, isError: errorHerramientas } = useHerramientas(1, 1);
  const { data: responsables, isError: errorResponsables } = useResponsables(1, 1);
  const { data: servicios, isError: errorServicios } = useServicios(1, 1);

  const hayError =
    errorActividades || errorHistorial || errorEvidencias ||
    errorHerramientas || errorResponsables || errorServicios;

  const conteo = (estado: string) =>
    stats?.find((s) => s.estado === estado)?.total ?? 0;

  const resumen = [
    { label: 'Total actividades', value: actividades?.total ?? 0, color: 'bg-emerald-500' },
    { label: 'Pendientes', value: conteo('pendiente'), color: 'bg-amber-400' },
    { label: 'En proceso', value: conteo('en_proceso'), color: 'bg-blue-500' },
    { label: 'Completadas', value: conteo('completada'), color: 'bg-teal-500' },
    { label: 'Historial', value: historial?.total ?? 0, color: 'bg-violet-500' },
    { label: 'Evidencias', value: evidencias?.total ?? 0, color: 'bg-pink-500' },
    { label: 'Herramientas', value: herramientas?.total ?? 0, color: 'bg-orange-500' },
    { label: 'Responsables', value: responsables?.total ?? 0, color: 'bg-cyan-500' },
    { label: 'Servicios', value: servicios?.total ?? 0, color: 'bg-indigo-500' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Panel de control</h1>
          <p className="text-sm text-gray-400 mt-0.5">Resumen general de tu finca</p>
        </div>
        <Link to="/actividades" className="btn-primary">
          Ver actividades
        </Link>
      </div>

      {hayError && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {getErrorMessage(new Error('backend'), 'No se pudo conectar con el servidor. Verifica que el backend esté activo.')}
        </div>
      )}

      {/* Resumen */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        {resumen.map((item) => (
          <div key={item.label} className="rounded-2xl border border-emerald-100/60 bg-white p-4">
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
              <p className="text-xs font-medium text-gray-400">{item.label}</p>
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-800">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Actividades recientes */}
      <div className="rounded-2xl border border-emerald-100/60 bg-white">
        <div className="flex items-center justify-between border-b border-emerald-50 px-6 py-4">
          <h2 className="font-semibold text-gray-800">Actividades recientes</h2>
          <Link to="/actividades" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
            Ver todas
          </Link>
        </div>
        {(actividades?.data ?? []).length === 0 ? (
          <p className="py-10 text-center text-sm text-gray-400">Aún no hay actividades registradas.</p>
        ) : (
          <ul className="divide-y divide-gray-50">
            {(actividades?.data ?? []).map((actividad) => (
              <li key={actividad.id_actividad} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="text-sm font-medium text-gray-800">{actividad.titulo}</p>
                  <p className="text-xs text-gray-400">
                    {actividad.tipo_actividad.replace('_', ' ')}
                    {actividad.fecha_programada && ` · ${actividad.fecha_programada}`}
                  </p>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                  {actividad.estado?.replace('_', ' ') ?? 'sin estado'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Últimos movimientos */}
      <div className="rounded-2xl border border-emerald-100/60 bg-white">
        <div className="border-b border-emerald-50 px-6 py-4">
          <h2 className="font-semibold text-gray-800">Últimos movimientos</h2>
        </div>
        {(historial?.data ?? []).length === 0 ? (
          <p className="py-10 text-center text-sm text-gray-400">Sin movimientos registrados.</p>
        ) : (
          <ul className="divide-y divide-gray-50">
            {(historial?.data ?? []).map((item) => (
              <li key={item.id_actividad_historial} className="flex items-center justify-between px-6 py-3">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">{item.accion.replace('_', ' ')}</span>
                  {' '}en actividad #{item.id_actividad}
                </p>
                <span className="text-xs text-gray-400">
                  {item.fecha_registro ? new Date(item.fecha_registro).toLocaleDateString('es-ES') : ''}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default HomePage;
