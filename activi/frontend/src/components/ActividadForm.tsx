import { FormEvent, useState } from 'react';
import { Actividad } from '../services/api';

interface ActividadFormProps {
  onSubmit: (data: Partial<Actividad>) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<Actividad>;
}

const ActividadForm = ({
  onSubmit,
  onCancel,
  initialData = {},
}: ActividadFormProps) => {
  const isEditing = Boolean(initialData.id_actividad);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    titulo: initialData.titulo || '',
    descripcion: initialData.descripcion || '',
    tipo_actividad: initialData.tipo_actividad || 'siembra',
    estado: initialData.estado || 'pendiente',
    prioridad: initialData.prioridad || 'media',
    fecha_programada: initialData.fecha_programada || '',
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData.titulo.trim() || formData.titulo.trim().length < 3) return;

    try {
      setSubmitting(true);
      const dataToSubmit = {
        titulo: formData.titulo.trim(),
        descripcion: formData.descripcion.trim() || undefined,
        tipo_actividad: formData.tipo_actividad,
        estado: formData.estado,
        prioridad: formData.prioridad,
        fecha_programada: formData.fecha_programada || undefined,
        fecha_inicio: undefined,
        fecha_fin: undefined,
      };
      await onSubmit(dataToSubmit);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/40 p-4 backdrop-blur-sm sm:p-6"
      role="presentation"
      onClick={onCancel}
    >
      <form
        className="mx-auto w-full max-w-lg rounded-2xl bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="actividad-form-title"
        onSubmit={handleSubmit}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-emerald-50 px-6 py-5">
          <div>
            <h2 id="actividad-form-title" className="text-lg font-semibold text-gray-800">
              {isEditing ? 'Editar actividad' : 'Nueva actividad'}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {isEditing
                ? 'Actualiza la información necesaria.'
                : 'Completa los datos para programar el trabajo.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="rounded-lg px-2 py-1 text-xl leading-none text-gray-400 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50"
            aria-label="Cerrar formulario"
          >
            ×
          </button>
        </div>

        <div className="space-y-5 p-6">
          <div>
            <label htmlFor="titulo" className="mb-1.5 block text-sm font-medium text-gray-700">
              Nombre de la actividad
            </label>
            <input
              id="titulo"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              required
              minLength={3}
              maxLength={150}
              autoFocus
              className="input-field"
              placeholder="Por ejemplo: Riego del lote norte"
            />
          </div>

          <div>
            <label htmlFor="descripcion" className="mb-1.5 block text-sm font-medium text-gray-700">
              Descripción <span className="font-normal text-gray-400">(opcional)</span>
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows={3}
              className="input-field resize-none"
              placeholder="Agrega una nota útil para el equipo"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="tipo_actividad" className="mb-1.5 block text-sm font-medium text-gray-700">Tipo de trabajo</label>
              <select id="tipo_actividad" name="tipo_actividad" value={formData.tipo_actividad} onChange={handleChange} className="select-field">
                <option value="siembra">Siembra</option>
                <option value="riego">Riego</option>
                <option value="fertilizacion">Fertilización</option>
                <option value="cosecha">Cosecha</option>
                <option value="poda">Poda</option>
                <option value="plagas">Control de plagas</option>
              </select>
            </div>
            <div>
              <label htmlFor="fecha_programada" className="mb-1.5 block text-sm font-medium text-gray-700">Fecha programada <span className="font-normal text-gray-400">(opcional)</span></label>
              <input id="fecha_programada" name="fecha_programada" type="date" value={formData.fecha_programada} onChange={handleChange} className="input-field" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="estado" className="mb-1.5 block text-sm font-medium text-gray-700">Estado inicial</label>
              <select id="estado" name="estado" value={formData.estado} onChange={handleChange} className="select-field">
                <option value="pendiente">Pendiente</option>
                <option value="en_proceso">En proceso</option>
                <option value="completada">Completada</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>
            <div>
              <label htmlFor="prioridad" className="mb-1.5 block text-sm font-medium text-gray-700">Prioridad</label>
              <select id="prioridad" name="prioridad" value={formData.prioridad} onChange={handleChange} className="select-field">
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-3 border-t border-emerald-50 p-6">
          <button type="button" onClick={onCancel} disabled={submitting} className="btn-secondary flex-1 disabled:opacity-50">
            Cancelar
          </button>
          <button type="submit" disabled={submitting} className="btn-primary flex-1 disabled:cursor-not-allowed disabled:opacity-60">
            {submitting ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear actividad'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ActividadForm;
