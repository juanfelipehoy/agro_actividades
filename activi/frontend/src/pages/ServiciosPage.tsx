import { useState } from 'react';
import ServicioForm from '../components/ServicioForm';
import Pagination from '../components/Pagination';
import { ActividadServicio } from '../services/api';
import {
  useServicios,
  useCrearServicio,
  useActualizarServicio,
  useEliminarServicio,
} from '../hooks/useRecursos';
import { getErrorMessage } from '../utils/errors';

const ServiciosPage = () => {
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<ActividadServicio | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading, isError } = useServicios(page, 15);
  const crearServicio = useCrearServicio();
  const actualizarServicio = useActualizarServicio();
  const eliminarServicio = useEliminarServicio();

  const servicios = data?.data ?? [];

  const handleCreate = async (formData: Partial<ActividadServicio>) => {
    try {
      await crearServicio.mutateAsync(formData);
      setShowForm(false);
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo crear el servicio.'));
    }
  };

  const handleUpdate = async (formData: Partial<ActividadServicio>) => {
    try {
      await actualizarServicio.mutateAsync({
        id: editingItem!.id_actividad_servicio!,
        data: formData,
      });
      setShowForm(false);
      setEditingItem(null);
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo actualizar el servicio.'));
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar este servicio?')) return;
    try {
      await eliminarServicio.mutateAsync(id);
      setError(null);
      if (servicios.length === 1 && page > 1) setPage(page - 1);
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo eliminar el servicio.'));
    }
  };

  const formatCurrency = (value?: number) =>
    value != null ? `$${value.toLocaleString('es-CO', { minimumFractionDigits: 0 })}` : '-';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-emerald-200 border-t-emerald-500 rounded-full animate-spin"></div>
          <p className="text-sm text-gray-400 font-medium">Cargando servicios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Servicios</h1>
          <p className="text-sm text-gray-400 mt-0.5">Servicios contratados para las actividades</p>
        </div>
        <button
          onClick={() => { setError(null); setEditingItem(null); setShowForm(true); }}
          className="btn-primary"
        >
          Nuevo Servicio
        </button>
      </div>

      {(error || isError) && (
        <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm">
          {error ?? 'Error al cargar servicios'}
        </div>
      )}

      {showForm && (
        <ServicioForm
          initialData={editingItem ?? undefined}
          onSubmit={editingItem ? handleUpdate : handleCreate}
          onCancel={() => { setShowForm(false); setEditingItem(null); }}
        />
      )}

      <div className="bg-white rounded-2xl border border-emerald-100/60 overflow-hidden">
        {servicios.length === 0 ? (
          <p className="text-center text-gray-400 py-10">No hay servicios registrados.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-emerald-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Actividad</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Servicio</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Proveedor</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Costo</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {servicios.map((s) => (
                  <tr key={s.id_actividad_servicio} className="hover:bg-emerald-50/30 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-600">#{s.id_actividad}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">{s.nombre_servicio}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{s.proveedor ?? '-'}</td>
                    <td className="px-6 py-4 text-right text-sm font-medium text-gray-700">{formatCurrency(s.costo)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => { setEditingItem(s); setShowForm(true); }}
                          className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(s.id_actividad_servicio!)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Pagination
        page={page}
        totalPages={data?.totalPages ?? 0}
        total={data?.total ?? 0}
        onPageChange={setPage}
      />
    </div>
  );
};

export default ServiciosPage;
