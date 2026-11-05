import { useState } from 'react';
import HerramientaForm from '../components/HerramientaForm';
import Pagination from '../components/Pagination';
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

  const { data, isLoading, isError } = useHerramientas(page, 15);
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

      <div className="bg-white rounded-2xl border border-emerald-100/60 overflow-hidden">
        {herramientas.length === 0 ? (
          <p className="text-center text-gray-400 py-10">No hay herramientas registradas.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-emerald-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Actividad</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Herramienta</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Cantidad</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {herramientas.map((h) => (
                  <tr key={h.id_actividad_herramienta} className="hover:bg-emerald-50/30 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-600">#{h.id_actividad}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">{h.nombre_herramienta}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{h.cantidad ?? '-'}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => { setEditingItem(h); setShowForm(true); }}
                          className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(h.id_actividad_herramienta!)}
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

export default HerramientasPage;
