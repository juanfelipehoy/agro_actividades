import { FormEvent, useState } from 'react';
import { ActividadHerramienta } from '../services/api';

interface HerramientaFormProps {
  initialData?: ActividadHerramienta;
  onSubmit: (data: Partial<ActividadHerramienta>) => Promise<void> | void;
  onCancel: () => void;
}

const HerramientaForm = ({ initialData, onSubmit, onCancel }: HerramientaFormProps) => {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nombre_herramienta: initialData?.nombre_herramienta || '',
    cantidad: initialData?.cantidad ?? '',
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.nombre_herramienta.trim()) return;

    try {
      setSubmitting(true);
      await onSubmit({
        nombre_herramienta: formData.nombre_herramienta.trim(),
        cantidad: formData.cantidad === '' ? null : Number(formData.cantidad),
      } as Partial<ActividadHerramienta>);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-800">
            {initialData ? 'Editar Herramienta' : 'Nueva Herramienta'}
          </h2>
          <button type="button" onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
            <input
              type="text"
              name="nombre_herramienta"
              value={formData.nombre_herramienta}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              placeholder="Ej:azada, rastrillo, manguera"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
            <input
              type="number"
              name="cantidad"
              value={formData.cantidad}
              onChange={handleChange}
              min="1"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              placeholder="Ej: 2"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onCancel} disabled={submitting} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50">
              Cancelar
            </button>
            <button type="submit" disabled={submitting} className="flex-1 py-2.5 btn-primary disabled:opacity-60 disabled:cursor-not-allowed">
              {submitting ? 'Guardando...' : initialData ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HerramientaForm;
