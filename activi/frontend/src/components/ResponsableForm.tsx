import { useState } from 'react';
import { ActividadResponsable } from '../services/api';
import ActividadSelect from './ActividadSelect';

interface ResponsableFormProps {
  initialData?: ActividadResponsable;
  onSubmit: (data: Partial<ActividadResponsable>) => void;
  onCancel: () => void;
}

const ResponsableForm = ({ initialData, onSubmit, onCancel }: ResponsableFormProps) => {
  const [formData, setFormData] = useState<Partial<ActividadResponsable>>({
    id_actividad: initialData?.id_actividad,
    nombre_responsable: initialData?.nombre_responsable || '',
    rol: initialData?.rol || '',
    estado_asignacion: initialData?.estado_asignacion || 'asignado',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id_actividad || !formData.nombre_responsable) return;
    onSubmit({
      ...formData,
      rol: formData.rol || null,
    } as Partial<ActividadResponsable>);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'id_actividad') {
      setFormData((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-800">
            {initialData ? 'Editar Responsable' : 'Nuevo Responsable'}
          </h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <ActividadSelect
            value={formData.id_actividad ? String(formData.id_actividad) : ''}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, id_actividad: Number(value) }))
            }
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
            <input
              type="text"
              name="nombre_responsable"
              value={formData.nombre_responsable}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              placeholder="Nombre completo"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
            <input
              type="text"
              name="rol"
              value={formData.rol || ''}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              placeholder="Ej: Operario, Supervisor"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado de asignación</label>
            <select
              name="estado_asignacion"
              value={formData.estado_asignacion}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
            >
              <option value="asignado">Asignado</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
              <option value="finalizado">Finalizado</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onCancel} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-colors">
              Cancelar
            </button>
            <button type="submit" className="flex-1 py-2.5 btn-primary">
              {initialData ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResponsableForm;
