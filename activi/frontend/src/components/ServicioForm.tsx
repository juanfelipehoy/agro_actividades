import { useState } from 'react';
import { ActividadServicio } from '../services/api';
import ActividadSelect from './ActividadSelect';

interface ServicioFormProps {
  initialData?: ActividadServicio;
  onSubmit: (data: Partial<ActividadServicio>) => void;
  onCancel: () => void;
}

const ServicioForm = ({ initialData, onSubmit, onCancel }: ServicioFormProps) => {
  const [formData, setFormData] = useState<Partial<ActividadServicio>>({
    id_actividad: initialData?.id_actividad,
    nombre_servicio: initialData?.nombre_servicio || '',
    descripcion: initialData?.descripcion || '',
    costo: initialData?.costo,
    proveedor: initialData?.proveedor || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id_actividad || !formData.nombre_servicio) return;
    onSubmit({
      ...formData,
      descripcion: formData.descripcion || null,
      proveedor: formData.proveedor || null,
    } as Partial<ActividadServicio>);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (name === 'id_actividad') {
      setFormData((prev) => ({ ...prev, [name]: Number(value) }));
    } else if (type === 'number') {
      setFormData((prev) => ({ ...prev, [name]: value === '' ? undefined : Number(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-800">
            {initialData ? 'Editar Servicio' : 'Nuevo Servicio'}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del servicio *</label>
            <input
              type="text"
              name="nombre_servicio"
              value={formData.nombre_servicio}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              placeholder="Ej: fumigación, fertilización"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion || ''}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-none"
              placeholder="Descripción del servicio"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Costo</label>
            <input
              type="number"
              name="costo"
              value={formData.costo ?? ''}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor</label>
            <input
              type="text"
              name="proveedor"
              value={formData.proveedor || ''}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              placeholder="Nombre del proveedor"
            />
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

export default ServicioForm;
