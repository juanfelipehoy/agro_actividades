import { useState } from 'react';
import ResponsableForm from '../components/ResponsableForm';
import Pagination from '../components/Pagination';
import ActividadBadge from '../components/ActividadBadge';
import { ActividadResponsable } from '../services/api';
import {
  useResponsables,
  useCrearResponsable,
  useActualizarResponsable,
  useEliminarResponsable,
} from '../hooks/useRecursos';
import { getErrorMessage } from '../utils/errors';

const ESTADOS_ASIGNACION: Record<string, { label: string; className: string }> = {
  asignado: { label: 'Asignado', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  activo: { label: 'Activo', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  inactivo: { label: 'Inactivo', className: 'bg-gray-50 text-gray-600 border-gray-200' },
  finalizado: { label: 'Finalizado', className: 'bg-amber-50 text-amber-700 border-amber-200' },
};

const ResponsablesPage = () => {
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<ActividadResponsable | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading, isError } = useResponsables(page, 12);
  const crearResponsable = useCrearResponsable();
  const actualizarResponsable = useActualizarResponsable();
  const eliminarResponsable = useEliminarResponsable();

  const responsables = data?.data ?? [];

  const handleCreate = async (formData: Partial<ActividadResponsable>) => {
    try {
      await crearResponsable.mutateAsync(formData);
      setShowForm(false);
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo crear el responsable.'));
    }
  };

  const handleUpdate = async (formData: Partial<ActividadResponsable>) => {
    try {
      await actualizarResponsable.mutateAsync({
        id: editingItem!.id_actividad_responsable!,
        data: formData,
      });
      setShowForm(false);
      setEditingItem(null);
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo actualizar el responsable.'));
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar este responsable?')) return;
    try {
      await eliminarResponsable.mutateAsync(id);
      setError(null);
      if (responsables.length === 1 && page > 1) setPage(page - 1);
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo eliminar el responsable.'));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-emerald-200 border-t-emerald-500 rounded-full animate-spin"></div>
          <p className="text-sm text-gray-400 font-medium">Cargando responsables...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Responsables</h1>
          <p className="text-sm text-gray-400 mt-0.5">Personas asignadas a las actividades</p>
        </div>
        <button
          onClick={() => { setError(null); setEditingItem(null); setShowForm(true); }}
          className="btn-primary"
        >
          Nuevo Responsable
        </button>
      </div>

      {(error || isError) && (
        <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm">
          {error ?? 'Error al cargar responsables'}
        </div>
      )}

      {showForm && (
        <ResponsableForm
          initialData={editingItem ?? undefined}
          onSubmit={editingItem ? handleUpdate : handleCreate}
          onCancel={() => { setShowForm(false); setEditingItem(null); }}
        />
      )}

      {responsables.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-emerald-100/60">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-1">No hay responsables</h3>
          <p className="text-sm text-gray-400">Asigna la primera persona responsable de una actividad</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {responsables.map((r) => {
            const estadoInfo = ESTADOS_ASIGNACION[r.estado_asignacion ?? ''] ?? {
              label: r.estado_asignacion ?? 'Sin estado',
              className: 'bg-gray-50 text-gray-600 border-gray-200',
            };
            return (
              <article
                key={r.id_actividad_responsable}
                className="rounded-2xl border border-emerald-100/60 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-100/40"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-gray-800">{r.nombre_responsable}</h3>
                      <p className="mt-0.5 text-xs text-gray-500">{r.rol || 'Sin rol asignado'}</p>
                    </div>
                  </div>
                  <span className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium ${estadoInfo.className}`}>
                    {estadoInfo.label}
                  </span>
                </div>

                {r.id_actividad != null && (
                  <div className="mb-4 flex flex-wrap items-center gap-2 border-t border-gray-50 pt-3">
                    <ActividadBadge idActividad={r.id_actividad} />
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setEditingItem(r); setShowForm(true); }}
                    className="btn-secondary flex-1"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(r.id_actividad_responsable!)}
                    className="rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
                    aria-label={`Eliminar ${r.nombre_responsable}`}
                  >
                    Eliminar
                  </button>
                </div>
              </article>
            );
          })}
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

export default ResponsablesPage;
