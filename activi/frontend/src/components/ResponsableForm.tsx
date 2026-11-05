import { FormEvent, useState } from 'react';
import { ActividadResponsable } from '../services/api';

interface ResponsableFormProps {
  onSubmit: (data: Partial<ActividadResponsable>) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<ActividadResponsable>;
  availableRoles: string[];
}

const ResponsableForm = ({
  onSubmit,
  onCancel,
  initialData = {},
  availableRoles,
}: ResponsableFormProps) => {
  const isEditing = Boolean(initialData.id_responsable);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    id_actividad: initialData.id_actividad || '',
    nombre_responsable: initialData.nombre_responsable || '',
    rol: initialData.rol || availableRoles[0] || '',
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData.nombre_responsable.trim() || formData.nombre_responsable.trim().length < 2) return;
    if (!formData.id_actividad || Number(formData.id_actividad) < 1) return;

    try {
      setSubmitting(true);
      const dataToSubmit = {
        id_actividad: Number(formData.id_actividad),
        nombre_responsable: formData.nombre_responsable.trim(),
        rol: formData.rol,
      };
      await onSubmit(dataToSubmit);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
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
        aria-labelledby="responsable-form-title"
        onSubmit={handleSubmit}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-emerald-50 px-6 py-5">
          <div>
            <h2 id="responsable-form-title" className="text-lg font-semibold text-gray-800">
              {isEditing ? 'Editar responsable' : 'Nuevo responsable'}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {isEditing
                ? 'Actualiza la información del responsable.'
                : 'Asigna un responsable a la actividad.'}
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
            <label htmlFor="id_actividad" className="mb-1.5 block text-sm font-medium text-gray-700">
              Actividad
            </label>
            <input
              id="id_actividad"
              name="id_actividad"
              type="number"
              min="1"
              value={formData.id_actividad}
              onChange={handleChange}
              required
              autoFocus
              className="input-field"
              placeholder="ID de la actividad"
            />
          </div>

          <div>
            <label htmlFor="nombre_responsable" className="mb-1.5 block text-sm font-medium text-gray-700">
              Nombre del responsable
            </label>
            <input
              id="nombre_responsable"
              name="nombre_responsable"
              value={formData.nombre_responsable}
              onChange={handleChange}
              required
              minLength={2}
              maxLength={100}
              className="input-field"
              placeholder="Nombre completo"
            />
          </div>

          <div>
            <label htmlFor="rol" className="mb-1.5 block text-sm font-medium text-gray-700">
              Rol
            </label>
            <select
              id="rol"
              name="rol"
              value={formData.rol}
              onChange={handleChange}
              required
              className="select-field"
            >
              {availableRoles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3 border-t border-emerald-50 p-6">
          <button type="button" onClick={onCancel} disabled={submitting} className="btn-secondary flex-1 disabled:opacity-50">
            Cancelar
          </button>
          <button type="submit" disabled={submitting} className="btn-primary flex-1 disabled:cursor-not-allowed disabled:opacity-60">
            {submitting ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear responsable'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResponsableForm;
