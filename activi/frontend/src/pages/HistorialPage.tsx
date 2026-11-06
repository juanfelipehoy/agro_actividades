import { useState } from 'react';
import Pagination from '../components/Pagination';
import { useHistorial } from '../hooks/useHistorial';
import ActividadBadge from '../components/ActividadBadge';

const HistorialPage = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useHistorial(page, 15);

  const historial = data?.data ?? [];

  const getAccionColor = (accion: string) => {
    const colors: Record<string, string> = {
      creacion: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      edicion: 'bg-blue-50 text-blue-700 border-blue-200',
      cambio_estado: 'bg-amber-50 text-amber-700 border-amber-200',
      eliminacion: 'bg-red-50 text-red-700 border-red-200',
    };
    return colors[accion] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-emerald-200 border-t-emerald-500 rounded-full animate-spin"></div>
          <p className="text-sm text-gray-400 font-medium">Cargando historial...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Historial</h1>
        <p className="text-sm text-gray-400 mt-0.5">Registro de cambios en las actividades</p>
      </div>

      {/* Error */}
      {isError && (
        <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Error al cargar el historial
        </div>
      )}

      {/* Timeline */}
      {historial.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-emerald-100/60">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-1">Sin registros</h3>
          <p className="text-sm text-gray-400">Aún no hay movimientos en el historial</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-emerald-100/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-emerald-50">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Acción</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actividad</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Estado</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Usuario</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Observaciones</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {historial.map((item) => (
                  <tr key={item.id_actividad_historial} className="hover:bg-emerald-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium border ${getAccionColor(item.accion)}`}>
                        {item.accion.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4"><ActividadBadge idActividad={item.id_actividad} /></td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {item.estado_anterior && (
                        <span className="text-red-500">{item.estado_anterior.replace('_', ' ')}</span>
                      )}
                      {item.estado_anterior && item.estado_nuevo && (
                        <svg className="w-4 h-4 inline mx-1 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                      {item.estado_nuevo && (
                        <span className="text-emerald-600">{item.estado_nuevo.replace('_', ' ')}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">#{item.id_usuario}</td>
                    <td className="px-6 py-4 text-sm text-gray-400 max-w-xs truncate">{item.observaciones || '-'}</td>
                    <td className="px-6 py-4 text-xs text-gray-400">
                      {item.fecha_registro ? new Date(item.fecha_registro).toLocaleString('es-ES') : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Pagination
        page={page}
        totalPages={data?.totalPages ?? 0}
        total={data?.total ?? 0}
        onPageChange={setPage}
      />
    </div>
  );
};

export default HistorialPage;
