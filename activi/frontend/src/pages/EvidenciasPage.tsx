import { useEffect, useState } from 'react';
import EvidenciaForm from '../components/EvidenciaForm';
import { evidenciasApi, ActividadEvidencia, API_URL } from '../services/api';

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

  const handleCreate = async (formData: FormData) => {
    try {
      setSubmitting(true);
      await evidenciasApi.create(formData);
      setShowForm(false);
      await loadEvidencias();
    } catch (requestError) {
      setError('No se pudo crear la evidencia.');
      console.error(requestError);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar esta evidencia?')) {
      try {
        await evidenciasApi.delete(id);
        await loadEvidencias();
      } catch (requestError) {
        setError('No se pudo eliminar la evidencia.');
        console.error(requestError);
      }
    }
  };

  if (loading) {
    return <div className="flex h-80 items-center justify-center text-sm text-gray-400">Cargando evidencias...</div>;
  }

  return (
    <div className="p-6 space-y-6">
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
            <div
              key={evidencia.id_actividad_evidencia}
              className="overflow-hidden rounded-2xl border border-emerald-100/60 bg-white transition hover:-translate-y-0.5 hover:shadow-lg relative group"
            >
              <a
                href={`${API_URL}${evidencia.archivo_url}`}
                target="_blank"
                rel="noreferrer"
                aria-label={`Abrir evidencia de la actividad ${evidencia.id_actividad}`}
              >
                {evidencia.tipo_evidencia === 'foto' ? (
                  <img src={`${API_URL}${evidencia.archivo_url}`} alt={evidencia.descripcion || 'Evidencia de actividad'} className="aspect-video w-full object-cover" />
                ) : (
                  <div className="flex aspect-video items-center justify-center bg-emerald-50 text-sm font-medium text-emerald-700">
                    Abrir {evidencia.tipo_evidencia}
                  </div>
                )}
              </a>
              <div className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-gray-700">Actividad #{evidencia.id_actividad}</p>
                  <span className="text-xs text-gray-400">{evidencia.fecha_registro ? new Date(evidencia.fecha_registro).toLocaleDateString('es-ES') : ''}</span>
                </div>
                {evidencia.descripcion && <p className="mt-1 text-xs text-gray-400">{evidencia.descripcion}</p>}
              </div>
              <button
                onClick={() => handleDelete(evidencia.id_actividad_evidencia!)}
                className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                title="Eliminar evidencia"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <EvidenciaForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
          submitting={submitting}
        />
      )}
    </div>
  );
};

export default EvidenciasPage;
