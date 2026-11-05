import { useState, useEffect } from 'react';
import axios from 'axios';
import { actividadesApi, Actividad } from '../services/api';
import ActividadCard from '../components/ActividadCard';
import ActividadForm from '../components/ActividadForm';

const getRequestErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    const details = error.response?.data?.message;
    if (Array.isArray(details)) return details[0];
    if (typeof details === 'string') return details;
  }
  return fallback;
};

const ActividadesPage = () => {
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingActividad, setEditingActividad] = useState<Actividad | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filtroEstado, setFiltroEstado] = useState('todos');

  useEffect(() => {
    loadActividades();
  }, []);

  const loadActividades = async () => {
    try {
      setLoading(true);
      const response = await actividadesApi.getAll();
      setActividades(response.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar actividades');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (formData: Partial<Actividad>) => {
    try {
      await actividadesApi.create(formData);
      setShowForm(false);
      loadActividades();
    } catch (err) {
      setError(getRequestErrorMessage(err, 'No se pudo crear la actividad. Revisa los campos obligatorios e inténtalo de nuevo.'));
      console.error('Error:', err);
    }
  };

  const handleUpdate = async (formData: Partial<Actividad>) => {
    try {
      await actividadesApi.update(editingActividad!.id_actividad!, formData);
      setShowForm(false);
      setEditingActividad(null);
      loadActividades();
    } catch (err) {
      setError(getRequestErrorMessage(err, 'No se pudo actualizar la actividad. Revisa los datos e inténtalo de nuevo.'));
      console.error('Error:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estas seguro de eliminar esta actividad?')) {
      try {
        await actividadesApi.delete(id);
        loadActividades();
      } catch (err) {
        setError(getRequestErrorMessage(err, 'No se pudo eliminar la actividad. Inténtalo de nuevo.'));
        console.error('Error:', err);
      }
    }
  };

  const handleEdit = (actividad: Actividad) => {
    setEditingActividad(actividad);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingActividad(null);
  };

  const actividadesFiltradas = filtroEstado === 'todos'
    ? actividades
    : actividades.filter((a) => a.estado === filtroEstado);

  const stats = {
    total: actividades.length,
    pendientes: actividades.filter((a) => a.estado === 'pendiente').length,
    enProceso: actividades.filter((a) => a.estado === 'en_proceso').length,
    completadas: actividades.filter((a) => a.estado === 'completada').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-emerald-200 border-t-emerald-500 rounded-full animate-spin"></div>
          <p className="text-sm text-gray-400 font-medium">Cargando actividades...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stats.total, color: 'from-emerald-500 to-green-600' },
          { label: 'Pendientes', value: stats.pendientes, color: 'from-amber-400 to-orange-500' },
          { label: 'En Proceso', value: stats.enProceso, color: 'from-blue-400 to-blue-600' },
          { label: 'Completadas', value: stats.completadas, color: 'from-emerald-400 to-teal-500' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-emerald-100/60 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-sm`}>
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Header + Filters */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Actividades</h1>
          <p className="text-sm text-gray-400 mt-0.5">Gestiona las actividades de tus cultivos</p>
        </div>
        <button onClick={() => { setError(null); setShowForm(true); }} className="btn-primary flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Nueva Actividad
        </button>
      </div>

      {/* Filter Pills */}
      <div className="flex items-center gap-2">
        {[
          { key: 'todos', label: 'Todas' },
          { key: 'pendiente', label: 'Pendientes' },
          { key: 'en_proceso', label: 'En Proceso' },
          { key: 'completada', label: 'Completadas' },
        ].map((filter) => (
          <button
            key={filter.key}
            onClick={() => setFiltroEstado(filter.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filtroEstado === filter.key
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200'
                : 'bg-white text-gray-500 border border-gray-100 hover:border-emerald-200 hover:text-emerald-600'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <ActividadForm
          initialData={editingActividad ?? undefined}
          onSubmit={editingActividad ? handleUpdate : handleCreate}
          onCancel={handleCancel}
        />
      )}

      {/* Grid */}
      {actividadesFiltradas.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-emerald-100/60">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-1">No hay actividades</h3>
          <p className="text-sm text-gray-400 mb-5">Comienza creando tu primera actividad agricola</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {actividadesFiltradas.map((actividad) => (
            <ActividadCard
              key={actividad.id_actividad}
              actividad={actividad}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ActividadesPage;
