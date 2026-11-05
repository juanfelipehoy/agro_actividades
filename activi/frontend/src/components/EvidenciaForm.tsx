import { FormEvent, useState } from 'react';


interface EvidenciaFormProps {
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
  submitting: boolean;
}

const EvidenciaForm = ({
  onSubmit,
  onCancel,
  submitting,
}: EvidenciaFormProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFile) {
      alert('Por favor selecciona un archivo');
      return;
    }

    const values = new FormData(event.currentTarget);
    values.append('file', selectedFile);

    try {
      await onSubmit(values);
      setSelectedFile(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
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
        aria-labelledby="evidencia-form-title"
        onSubmit={handleSubmit}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-emerald-50 px-6 py-5">
          <div>
            <h2 id="evidencia-form-title" className="text-lg font-semibold text-gray-800">
              Nueva evidencia
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Adjunta fotos o documentos de la actividad.
            </p>
          </div>
          <button
            type="button"
            onClick={() => { onCancel(); setSelectedFile(null); }}
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
              required
              autoFocus
              className="input-field"
              placeholder="ID de la actividad"
            />
          </div>

          <div>
            <label htmlFor="tipo_evidencia" className="mb-1.5 block text-sm font-medium text-gray-700">
              Tipo
            </label>
            <select
              id="tipo_evidencia"
              name="tipo_evidencia"
              required
              className="select-field"
              defaultValue="foto"
            >
              <option value="foto">Foto</option>
              <option value="documento">Documento</option>
              <option value="video">Video</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          <div>
            <label htmlFor="archivo" className="mb-1.5 block text-sm font-medium text-gray-700">
              Archivo
            </label>
            <input
              id="archivo"
              type="file"
              onChange={handleFileChange}
              required
              className="input-field"
              accept="image/*,.pdf,.doc,.docx,.mp4,.avi"
            />
            {selectedFile && (
              <p className="mt-1 text-xs text-gray-500">Archivo seleccionado: {selectedFile.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="descripcion" className="mb-1.5 block text-sm font-medium text-gray-700">
              Descripción <span className="font-normal text-gray-400">(opcional)</span>
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              rows={3}
              className="input-field resize-none"
              placeholder="Descripción de la evidencia"
            />
          </div>

          <div>
            <label htmlFor="observaciones" className="mb-1.5 block text-sm font-medium text-gray-700">
              Observaciones <span className="font-normal text-gray-400">(opcional)</span>
            </label>
            <input
              id="observaciones"
              name="observaciones"
              className="input-field"
              placeholder="Notas adicionales"
            />
          </div>
        </div>

        <div className="flex gap-3 border-t border-emerald-50 p-6">
          <button
            type="button"
            onClick={() => { onCancel(); setSelectedFile(null); }}
            disabled={submitting}
            className="btn-secondary flex-1 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary flex-1 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Guardando...' : 'Crear evidencia'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EvidenciaForm;
