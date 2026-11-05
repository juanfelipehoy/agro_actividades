import { useEffect, useState } from 'react';
import axios from 'axios';
import HerramientaForm from '../components/HerramientaForm';
import { herramientasApi, ActividadHerramienta } from '../services/api';

const getRequestErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    const details = error.response?.data?.message;
    if (Array.isArray(details)) return details[0];
    if (typeof details === 'string') return details;
  }
  return fallback;
};

const HerramientasPage = () => {
  const [herramientas, setHerramientas] = useState<ActividadHerramienta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingHerramienta, setEditingHerramienta] = useState<ActividadHerramienta | null>(null);

  const loadHerramientas = async () => {
    try {
      setLoading(true);
      const response = await herramientasApi.getAll();
      setHerramientas(response.data);
      setError(null);
    } catch (requestError) {
      setError('Error al cargar herramientas.');
      console.error(requestError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadHerramientas();
  }, []);

  const handleCreate = async (data: Partial<ActividadHerramienta>) => {
    try {
      console.log('Enviando datos al backend:', data);
      const response = await herramientasApi.create(data);
      console.log('Respuesta del backend:', response);
      setShowForm(false);
      await loadHerramientas();
    } catch (requestError) {
      const errorMessage = getRequestErrorMessage(requestError, 'No se pudo crear la herramienta.');
      setError(errorMessage);
      console.error('Error completo:', requestError);
    }
  };

  const handleUpdate = async (data: Partial<ActividadHerramienta>) => {
    try {
      await herramientasApi.update(editingHerramienta!.id_actividad_herramienta!, data);
      setShowForm(false);
      setEditingHerramienta(null);
      await loadHerramientas();
    } catch (requestError) {
      setError(getRequestErrorMessage(requestError, 'No se pudo actualizar la herramienta.'));
      console.error(requestError);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar esta herramienta?')) {
      try {
        await herramientasApi.delete(id);
        await loadHerramientas();
      } catch (requestError) {
        setError(getRequestErrorMessage(requestError, 'No se pudo eliminar la herramienta.'));
        console.error(requestError);
      }
    }
  };

  const handleEdit = (herramienta: ActividadHerramienta) => {
    setEditingHerramienta(herramienta);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingHerramienta(null);
  };

  if (loading) {
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
          <p className="mt-0.5 text-sm text-gray-400">Gestiona las herramientas utilizadas en las actividades</p>
        </div>
        <button onClick={() => { setError(null); setShowForm(true); }} className="btn-primary">Nueva herramienta</button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {herramientas.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-emerald-100/60">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-1">Sin herramientas</h3>
          <p className="text-sm text-gray-400">Aún no hay herramientas registradas</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {herramientas.map((herramienta) => (
            <div
              key={herramienta.id_actividad_herramienta}
              className="bg-white rounded-2xl border border-emerald-100/60 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-800">{herramienta.nombre_herramienta}</h3>
                  <p className="text-sm text-gray-400 mt-1">Actividad #{herramienta.id_actividad}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEdit(herramienta)}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(herramienta.id_actividad_herramienta!)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {herramienta.cantidad && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-medium">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                    </svg>
                    Cantidad: {herramienta.cantidad}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <HerramientaForm
          initialData={editingHerramienta ?? undefined}
          onSubmit={editingHerramienta ? handleUpdate : handleCreate}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default HerramientasPage;
