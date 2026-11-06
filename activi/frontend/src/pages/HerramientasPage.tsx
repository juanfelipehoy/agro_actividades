import { useState } from 'react';
import HerramientaForm from '../components/HerramientaForm';
import Pagination from '../components/Pagination';
import ActividadBadge from '../components/ActividadBadge';
import { ActividadHerramienta } from '../services/api';
import {
  useHerramientas,
  useCrearHerramienta,
  useActualizarHerramienta,
  useEliminarHerramienta,
} from '../hooks/useRecursos';
import { getErrorMessage } from '../utils/errors';

const HerramientasPage = () => {
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<ActividadHerramienta | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading, isError } = useHerramientas(page, 12);
  const crearHerramienta = useCrearHerramienta();
  const actualizarHerramienta = useActualizarHerramienta();
  const eliminarHerramienta = useEliminarHerramienta();

  const herramientas = data?.data ?? [];

  const handleCreate = async (formData: Partial<ActividadHerramienta>) => {
    try {
      await crearHerramienta.mutateAsync(formData);
      setShowForm(false);
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo crear la herramienta.'));
    }
  };

  const handleUpdate = async (formData: Partial<ActividadHerramienta>) => {
    try {
      await actualizarHerramienta.mutateAsync({
        id: editingItem!.id_actividad_herramienta!,
        data: formData,
      });
      setShowForm(false);
      setEditingItem(null);
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo actualizar la herramienta.'));
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar esta herramienta?')) return;
    try {
      await eliminarHerramienta.mutateAsync(id);
      setError(null);
      if (herramientas.length === 1 && page > 1) setPage(page - 1);
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo eliminar la herramienta.'));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-emerald-200 border-t-emerald-500 rounded-full animate-spin"></div>
          <p className="text-sm text-gray-400 font-medium">Cargando herramientas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Herramientas</h1>
          <p className="text-sm text-gray-400 mt-0.5">Herramientas utilizadas en las actividades</p>
        </div>
        <button
          onClick={() => { setError(null); setEditingItem(null); setShowForm(true); }}
          className="btn-primary"
        >
          Nueva Herramienta
        </button>
      </div>

      {(error || isError) && (
        <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm">
          {error ?? 'Error al cargar herramientas'}
        </div>
      )}

      {showForm && (
        <HerramientaForm
          initialData={editingItem ?? undefined}
          onSubmit={editingItem ? handleUpdate : handleCreate}
          onCancel={() => { setShowForm(false); setEditingItem(null); }}
        />
      )}

      {herramientas.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-emerald-100/60">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-1">No hay herramientas</h3>
          <p className="text-sm text-gray-400">Registra la primera herramienta utilizada en una actividad</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {herramientas.map((h) => (
            <article
              key={h.id_actividad_herramienta}
              className="rounded-2xl border border-emerald-100/60 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-100/40"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-gray-800">{h.nombre_herramienta}</h3>
                    <p className="mt-0.5 text-xs text-gray-500">
                      Cantidad: {h.cantidad ?? '—'}
                    </p>
                  </div>
                </div>
              </div>

              {h.id_actividad != null && (
                <div className="mb-4 flex flex-wrap items-center gap-2 border-t border-gray-50 pt-3">
                  <ActividadBadge idActividad={h.id_actividad} />
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setEditingItem(h); setShowForm(true); }}
                  className="btn-secondary flex-1"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(h.id_actividad_herramienta!)}
                  className="rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
                  aria-label={`Eliminar ${h.nombre_herramienta}`}
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

export default HerramientasPage;
