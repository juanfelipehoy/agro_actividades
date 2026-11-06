import { useState } from 'react';
import EvidenciaForm from '../components/EvidenciaForm';
import Pagination from '../components/Pagination';
import ActividadBadge from '../components/ActividadBadge';
import { API_URL } from '../services/api';
import { useEvidencias, useCrearEvidencia, useEliminarEvidencia } from '../hooks/useEvidencias';
import { getErrorMessage } from '../utils/errors';

const TIPOS_EVIDENCIA: Record<string, string> = {
  foto: 'Foto',
  video: 'Video',
  documento: 'Documento',
  otro: 'Otro',
};

const EvidenciasPage = () => {
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading, isError } = useEvidencias(page, 12);
  const crearEvidencia = useCrearEvidencia();
  const eliminarEvidencia = useEliminarEvidencia();

  const evidencias = data?.data ?? [];

  const handleCreate = async (formData: FormData) => {
    try {
      await crearEvidencia.mutateAsync(formData);
      setShowForm(false);
      setError(null);
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'No se pudo crear la evidencia. Verifica el archivo y los datos.'));
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar esta evidencia? El archivo también se eliminará permanentemente.')) {
      return;
    }
    try {
      await eliminarEvidencia.mutateAsync(id);
      setError(null);
      if (evidencias.length === 1 && page > 1) setPage(page - 1);
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'No se pudo eliminar la evidencia. Inténtalo de nuevo.'));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-emerald-200 border-t-emerald-500 rounded-full animate-spin"></div>
          <p className="text-sm text-gray-400 font-medium">Cargando evidencias...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Evidencias</h1>
          <p className="mt-0.5 text-sm text-gray-400">Fotos, videos y documentos de las actividades</p>
        </div>
        <button onClick={() => { setError(null); setShowForm(true); }} className="btn-primary">Nueva evidencia</button>
      </div>

      {(error || isError) && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error ?? 'Error al cargar las evidencias'}
        </div>
      )}

      {evidencias.length === 0 ? (
        <div className="rounded-2xl border border-emerald-100/60 bg-white py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-1">Sin evidencias</h3>
          <p className="text-sm text-gray-400">Aún no hay evidencias registradas.</p>
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
                    Abrir {TIPOS_EVIDENCIA[evidencia.tipo_evidencia] ?? evidencia.tipo_evidencia}
                  </div>
                )}
              </a>
              <div className="p-4">
                <div className="flex items-center justify-between gap-3">
                  {evidencia.id_actividad != null && <ActividadBadge idActividad={evidencia.id_actividad} />}
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

      <Pagination
        page={page}
        totalPages={data?.totalPages ?? 0}
        total={data?.total ?? 0}
        onPageChange={setPage}
      />

      {showForm && (
        <EvidenciaForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
          submitting={crearEvidencia.isPending}
        />
      )}
    </div>
  );
};

export default EvidenciasPage;
