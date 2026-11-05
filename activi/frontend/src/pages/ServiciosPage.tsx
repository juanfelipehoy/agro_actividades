import { useEffect, useState } from 'react';
import axios from 'axios';
import ServicioForm from '../components/ServicioForm';
import { serviciosApi, ActividadServicio } from '../services/api';

const getRequestErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    const details = error.response?.data?.message;
    if (Array.isArray(details)) return details[0];
    if (typeof details === 'string') return details;
  }
  return fallback;
};

const ServiciosPage = () => {
  const [servicios, setServicios] = useState<ActividadServicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingServicio, setEditingServicio] = useState<ActividadServicio | null>(null);

  const loadServicios = async () => {
    try {
      setLoading(true);
      const response = await serviciosApi.getAll();
      setServicios(response.data);
      setError(null);
    } catch (requestError) {
      setError('Error al cargar servicios.');
      console.error(requestError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadServicios();
  }, []);

  const handleCreate = async (data: Partial<ActividadServicio>) => {
    try {
      await serviciosApi.create(data);
      setShowForm(false);
      await loadServicios();
    } catch (requestError) {
      setError(getRequestErrorMessage(requestError, 'No se pudo crear el servicio.'));
      console.error(requestError);
    }
  };

  const handleUpdate = async (data: Partial<ActividadServicio>) => {
    try {
      await serviciosApi.update(editingServicio!.id_servicio!, data);
      setShowForm(false);
      setEditingServicio(null);
      await loadServicios();
    } catch (requestError) {
      setError(getRequestErrorMessage(requestError, 'No se pudo actualizar el servicio.'));
      console.error(requestError);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estas seguro de eliminar este servicio?')) {
      try {
        await serviciosApi.delete(id);
        await loadServicios();
      } catch (requestError) {
        setError(getRequestErrorMessage(requestError, 'No se pudo eliminar el servicio.'));
        console.error(requestError);
      }
    }
  };

  const handleEdit = (servicio: ActividadServicio) => {
    setEditingServicio(servicio);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingServicio(null);
  };

  if (loading) {
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
          <p className="mt-0.5 text-sm text-gray-400">Gestiona los servicios contratados para las actividades</p>
        </div>
        <button onClick={() => { setError(null); setShowForm(true); }} className="btn-primary">Nuevo servicio</button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {servicios.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-emerald-100/60">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-1">Sin servicios</h3>
          <p className="text-sm text-gray-400">Aún no hay servicios registrados</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {servicios.map((servicio) => (
            <div
              key={servicio.id_servicio}
              className="bg-white rounded-2xl border border-emerald-100/60 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-800">{servicio.nombre_servicio}</h3>
                  <p className="text-sm text-gray-400 mt-1">Actividad #{servicio.id_actividad}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEdit(servicio)}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(servicio.id_servicio!)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              {servicio.proveedor && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 text-xs font-medium">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  {servicio.proveedor}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <ServicioForm
          initialData={editingServicio ?? undefined}
          onSubmit={editingServicio ? handleUpdate : handleCreate}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default ServiciosPage;
