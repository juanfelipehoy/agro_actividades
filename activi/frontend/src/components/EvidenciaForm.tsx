import { useState } from 'react';
import { ActividadEvidencia } from '../services/api';
import ActividadSelect from './ActividadSelect';

interface EvidenciaFormProps {
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
  submitting?: boolean;
}

const EvidenciaForm = ({ onSubmit, onCancel, submitting = false }: EvidenciaFormProps) => {
  const [formData, setFormData] = useState<Partial<ActividadEvidencia> & { file?: File }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id_actividad) return;
    if (!formData.file) {
      alert('Por favor selecciona un archivo');
      return;
    }
    const submitData = new FormData();
    submitData.append('id_actividad', String(formData.id_actividad));
    submitData.append('tipo_evidencia', formData.tipo_evidencia || 'foto');
    if (formData.descripcion) submitData.append('descripcion', formData.descripcion);
    if (formData.observaciones) submitData.append('observaciones', formData.observaciones);
    submitData.append('file', formData.file);
    onSubmit(submitData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'file') {
      const file = (e.target as HTMLInputElement).files?.[0];
      setFormData((prev) => ({ ...prev, file }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: name === 'id_actividad' ? Number(value) : value }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-800">Nueva Evidencia</h2>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de evidencia *</label>
            <select
              name="tipo_evidencia"
              value={formData.tipo_evidencia}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              required
            >
              <option value="">Seleccionar tipo</option>
              <option value="foto">Foto</option>
              <option value="video">Video</option>
              <option value="documento">Documento</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Archivo *</label>
            <input
              type="file"
              name="file"
              onChange={handleChange}
              accept="image/*,video/*,.pdf,.doc,.docx"
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              required
            />
            <p className="mt-1 text-xs text-gray-400">Máximo 10MB. Imágenes, videos, PDF y documentos.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <input
              type="text"
              name="descripcion"
              value={formData.descripcion || ''}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              placeholder="Descripción breve"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
            <textarea
              name="observaciones"
              value={formData.observaciones || ''}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-none"
              placeholder="Observaciones adicionales"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onCancel} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={submitting} className="flex-1 py-2.5 btn-primary disabled:opacity-60 disabled:cursor-not-allowed">
              {submitting ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EvidenciaForm;
