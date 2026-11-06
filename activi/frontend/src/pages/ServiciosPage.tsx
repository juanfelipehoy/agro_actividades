import { useState } from 'react';
import ServicioForm from '../components/ServicioForm';
import Pagination from '../components/Pagination';
import ActividadBadge from '../components/ActividadBadge';
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

  const { data, isLoading, isError } = useServicios(page, 12);
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
    value != null ? `$${value.toLocaleString('es-CO', { minimumFractionDigits: 0 })}` : null;

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

      {servicios.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-emerald-100/60">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-1">No hay servicios</h3>
          <p className="text-sm text-gray-400">Registra el primer servicio contratado para una actividad</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {servicios.map((s) => (
            <article
              key={s.id_actividad_servicio}
              className="rounded-2xl border border-emerald-100/60 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-100/40"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-gray-800">{s.nombre_servicio}</h3>
                    <p className="mt-0.5 text-xs text-gray-500">
                      Proveedor: {s.proveedor || 'Sin proveedor'}
                    </p>
                  </div>
                </div>
                {s.costo != null && (
                  <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    {formatCurrency(s.costo)}
                  </span>
                )}
              </div>

              {s.descripcion && (
                <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-gray-600">{s.descripcion}</p>
              )}

              {s.id_actividad != null && (
                <div className="mb-4 flex flex-wrap items-center gap-2 border-t border-gray-50 pt-3">
                  <ActividadBadge idActividad={s.id_actividad} />
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setEditingItem(s); setShowForm(true); }}
                  className="btn-secondary flex-1"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(s.id_actividad_servicio!)}
                  className="rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
                  aria-label={`Eliminar ${s.nombre_servicio}`}
                >
                  Eliminar
                </button>
              </div>
            </article>
          ))}
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

export default ServiciosPage;
