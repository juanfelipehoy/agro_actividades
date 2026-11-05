import { useLocation } from 'react-router-dom';

interface ModuloProximamenteProps {
  titulo: string;
  descripcion: string;
}

const ModuloProximamente = ({ titulo, descripcion }: ModuloProximamenteProps) => {
  const location = useLocation();

  return (
    <div className="flex min-h-[70vh] items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-emerald-100/60 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50">
          <svg className="h-8 w-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-gray-800">{titulo}</h1>
        <p className="mt-2 text-sm text-gray-400">{descripcion}</p>
        <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700">
          Módulo en desarrollo — disponible próximamente
        </p>
        <p className="mt-3 text-xs text-gray-300">Ruta: {location.pathname}</p>
      </div>
    </div>
  );
};

export default ModuloProximamente;
