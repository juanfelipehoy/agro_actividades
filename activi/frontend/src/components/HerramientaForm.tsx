import { FormEvent, useState } from 'react';
import { ActividadHerramienta } from '../services/api';

interface HerramientaFormProps {
  onSubmit: (data: Partial<ActividadHerramienta>) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<ActividadHerramienta>;
}

const HerramientaForm = ({
  onSubmit,
  onCancel,
  initialData = {},
}: HerramientaFormProps) => {
  const isEditing = Boolean(initialData.id_actividad_herramienta);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    id_actividad: initialData.id_actividad || '',
    nombre_herramienta: initialData.nombre_herramienta || '',
    cantidad: initialData.cantidad || '',
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData.nombre_herramienta.trim() || formData.nombre_herramienta.trim().length < 2) {
      alert('El nombre de la herramienta debe tener al menos 2 caracteres');
      return;
    }
    if (!formData.id_actividad || Number(formData.id_actividad) < 1) {
      alert('Debe seleccionar una actividad válida');
      return;
    }

    try {
      setSubmitting(true);
      const dataToSubmit: Partial<ActividadHerramienta> = {
        id_actividad: Number(formData.id_actividad),
        nombre_herramienta: formData.nombre_herramienta.trim(),
      };

      if (formData.cantidad) {
        dataToSubmit.cantidad = Number(formData.cantidad);
      }

      console.log('Datos a enviar:', dataToSubmit);
      await onSubmit(dataToSubmit);
    } catch (error) {
      console.error('Error al guardar herramienta:', error);
      throw error;
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
        aria-labelledby="herramienta-form-title"
        onSubmit={handleSubmit}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-emerald-50 px-6 py-5">
          <div>
            <h2 id="herramienta-form-title" className="text-lg font-semibold text-gray-800">
              {isEditing ? 'Editar herramienta' : 'Nueva herramienta'}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {isEditing
                ? 'Actualiza la información de la herramienta.'
                : 'Registra una herramienta utilizada en la actividad.'}
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
            <label htmlFor="nombre_herramienta" className="mb-1.5 block text-sm font-medium text-gray-700">
              Nombre de la herramienta
            </label>
            <input
              id="nombre_herramienta"
              name="nombre_herramienta"
              value={formData.nombre_herramienta}
              onChange={handleChange}
              required
              minLength={2}
              maxLength={100}
              className="input-field"
              placeholder="Ej: Tractor, Azada, Pala, etc."
            />
          </div>

          <div>
            <label htmlFor="cantidad" className="mb-1.5 block text-sm font-medium text-gray-700">
              Cantidad <span className="font-normal text-gray-400">(opcional)</span>
            </label>
            <input
              id="cantidad"
              name="cantidad"
              type="number"
              min="1"
              value={formData.cantidad}
              onChange={handleChange}
              className="input-field"
              placeholder="Cantidad utilizada"
            />
          </div>
        </div>

        <div className="flex gap-3 border-t border-emerald-50 p-6">
          <button type="button" onClick={onCancel} disabled={submitting} className="btn-secondary flex-1 disabled:opacity-50">
            Cancelar
          </button>
          <button type="submit" disabled={submitting} className="btn-primary flex-1 disabled:cursor-not-allowed disabled:opacity-60">
            {submitting ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear herramienta'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HerramientaForm;
