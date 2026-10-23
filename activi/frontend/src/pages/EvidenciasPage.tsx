import { FormEvent, useEffect, useState } from 'react';
import EntityModal from '../components/EntityModal';
import { evidenciasApi, ActividadEvidencia } from '../services/api';

const EvidenciasPage = () => {
  const [evidencias, setEvidencias] = useState<ActividadEvidencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadEvidencias = async () => {
    try {
      setLoading(true);
      const response = await evidenciasApi.getAll();
      setEvidencias(response.data);
      setError(null);
    } catch (requestError) {
      setError('Error al cargar evidencias.');
      console.error(requestError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadEvidencias();
  }, []);

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    try {
      setSubmitting(true);
      await evidenciasApi.create({
        id_actividad: Number(values.get('id_actividad')),
        tipo_evidencia: String(values.get('tipo_evidencia')),
        archivo_url: String(values.get('archivo_url')),
        descripcion: String(values.get('descripcion') || '') || undefined,
        observaciones: String(values.get('observaciones') || '') || undefined,
      });
      setShowForm(false);
      await loadEvidencias();
    } catch (requestError) {
      setError('No se pudo crear la evidencia.');
      console.error(requestError);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex h-80 items-center justify-center text-sm text-gray-400">Cargando evidencias...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Evidencias</h1>
          <p className="mt-0.5 text-sm text-gray-400">Fotos y documentos de las actividades</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">Nueva evidencia</button>
      </div>

      {error && <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

      {evidencias.length === 0 ? (
        <div className="rounded-2xl border border-emerald-100/60 bg-white py-16 text-center text-sm text-gray-400">
          Aún no hay evidencias registradas.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {evidencias.map((evidencia) => (
            <a
              key={evidencia.id_actividad_evidencia}
              href={evidencia.archivo_url}
              target="_blank"
              rel="noreferrer"
              className="overflow-hidden rounded-2xl border border-emerald-100/60 bg-white transition hover:-translate-y-0.5 hover:shadow-lg"
              aria-label={`Abrir evidencia de la actividad ${evidencia.id_actividad}`}
            >
              {evidencia.tipo_evidencia === 'foto' ? (
                <img src={evidencia.archivo_url} alt={evidencia.descripcion || 'Evidencia de actividad'} className="aspect-video w-full object-cover" />
              ) : (
                <div className="flex aspect-video items-center justify-center bg-emerald-50 text-sm font-medium text-emerald-700">
                  Abrir {evidencia.tipo_evidencia}
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-gray-700">Actividad #{evidencia.id_actividad}</p>
                  <span className="text-xs text-gray-400">{evidencia.fecha_registro ? new Date(evidencia.fecha_registro).toLocaleDateString('es-ES') : ''}</span>
                </div>
                {evidencia.descripcion && <p className="mt-1 text-xs text-gray-400">{evidencia.descripcion}</p>}
              </div>
            </a>
          ))}
        </div>
      )}

      {showForm && (
        <EntityModal title="Nueva evidencia" onClose={() => setShowForm(false)} onSubmit={handleCreate} submitting={submitting}>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-600">Actividad</label>
            <input name="id_actividad" type="number" min="1" required className="input-field" placeholder="ID de actividad" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-600">Tipo</label>
            <select name="tipo_evidencia" required className="select-field" defaultValue="foto">
              <option value="foto">Foto</option>
              <option value="documento">Documento</option>
              <option value="video">Video</option>
              <option value="otro">Otro</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-600">URL del archivo</label>
            <input name="archivo_url" type="url" required className="input-field" placeholder="https://..." />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-600">Descripción</label>
            <textarea name="descripcion" rows={3} className="input-field resize-none" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-600">Observaciones</label>
            <input name="observaciones" className="input-field" />
          </div>
        </EntityModal>
      )}
    </div>
  );
};

export default EvidenciasPage;
