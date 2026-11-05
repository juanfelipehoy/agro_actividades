import { useEffect, useState } from 'react';
import axios from 'axios';
import ResponsableForm from '../components/ResponsableForm';
import { responsablesApi, ActividadResponsable } from '../services/api';

const getRequestErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    const details = error.response?.data?.message;
    if (Array.isArray(details)) return details[0];
    if (typeof details === 'string') return details;
  }
  return fallback;
};

const RESPONSABLES_ROLES = ['instructor', 'aprendiz'];

const ResponsablesPage = () => {
  const [responsables, setResponsables] = useState<ActividadResponsable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingResponsable, setEditingResponsable] = useState<ActividadResponsable | null>(null);
  const [showAddRole, setShowAddRole] = useState(false);
  const [newRole, setNewRole] = useState('');
  const [customRoles, setCustomRoles] = useState<string[]>([]);

  const loadResponsables = async () => {
    try {
      setLoading(true);
      const response = await responsablesApi.getAll();
      setResponsables(response.data);
      setError(null);
    } catch (requestError) {
      setError('Error al cargar responsables.');
      console.error(requestError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadResponsables();
  }, []);

  const handleCreate = async (data: Partial<ActividadResponsable>) => {
    try {
      await responsablesApi.create(data);
      setShowForm(false);
      await loadResponsables();
    } catch (requestError) {
      setError(getRequestErrorMessage(requestError, 'No se pudo crear el responsable.'));
      console.error(requestError);
    }
  };

  const handleUpdate = async (data: Partial<ActividadResponsable>) => {
    try {
      await responsablesApi.update(editingResponsable!.id_responsable!, data);
      setShowForm(false);
      setEditingResponsable(null);
      await loadResponsables();
    } catch (requestError) {
      setError(getRequestErrorMessage(requestError, 'No se pudo actualizar el responsable.'));
      console.error(requestError);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estas seguro de eliminar este responsable?')) {
      try {
        await responsablesApi.delete(id);
        await loadResponsables();
      } catch (requestError) {
        setError(getRequestErrorMessage(requestError, 'No se pudo eliminar el responsable.'));
        console.error(requestError);
      }
    }
  };

  const handleEdit = (responsable: ActividadResponsable) => {
    setEditingResponsable(responsable);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingResponsable(null);
  };

  const handleAddRole = () => {
    if (newRole.trim() && !customRoles.includes(newRole.trim())) {
      setCustomRoles([...customRoles, newRole.trim()]);
      setNewRole('');
      setShowAddRole(false);
    }
  };

  const handleDeleteRole = (role: string) => {
    setCustomRoles(customRoles.filter((r) => r !== role));
  };

  const allRoles = [...RESPONSABLES_ROLES, ...customRoles];

  if (loading) {
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
          <p className="mt-0.5 text-sm text-gray-400">Gestiona los responsables de las actividades</p>
        </div>
        <button onClick={() => { setError(null); setShowForm(true); }} className="btn-primary">Nuevo responsable</button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {/* Roles Section */}
      <div className="bg-white rounded-2xl border border-emerald-100/60 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-800">Roles disponibles</h3>
          <button
            onClick={() => setShowAddRole(!showAddRole)}
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Añadir nuevo rol
          </button>
        </div>

        {showAddRole && (
          <div className="flex items-center gap-2 mb-4">
            <input
              type="text"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              placeholder="Nombre del nuevo rol"
              className="flex-1 input-field"
              onKeyPress={(e) => e.key === 'Enter' && handleAddRole()}
            />
            <button
              onClick={handleAddRole}
              className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 transition-colors"
            >
              Añadir
            </button>
            <button
              onClick={() => { setShowAddRole(false); setNewRole(''); }}
              className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {RESPONSABLES_ROLES.map((role) => (
            <span
              key={role}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-sm font-medium"
            >
              {role}
            </span>
          ))}
          {customRoles.map((role) => (
            <span
              key={role}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-sm font-medium"
            >
              {role}
              <button
                onClick={() => handleDeleteRole(role)}
                className="hover:text-red-600 transition-colors"
                title="Eliminar rol"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      </div>

      {responsables.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-emerald-100/60">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-1">Sin responsables</h3>
          <p className="text-sm text-gray-400">Aún no hay responsables registrados</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {responsables.map((responsable) => (
            <div
              key={responsable.id_responsable}
              className="bg-white rounded-2xl border border-emerald-100/60 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-800">{responsable.nombre_responsable}</h3>
                  <p className="text-sm text-gray-400 mt-1">Actividad #{responsable.id_actividad}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEdit(responsable)}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(responsable.id_responsable!)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              {responsable.rol && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-medium">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  {responsable.rol}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <ResponsableForm
          initialData={editingResponsable ?? undefined}
          onSubmit={editingResponsable ? handleUpdate : handleCreate}
          onCancel={handleCancel}
          availableRoles={allRoles}
        />
      )}
    </div>
  );
};

export default ResponsablesPage;
