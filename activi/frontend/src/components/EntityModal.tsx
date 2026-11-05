import { FormEvent, ReactNode } from 'react';

interface EntityModalProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  submitting: boolean;
}

const EntityModal = ({ title, children, onClose, onSubmit, submitting }: EntityModalProps) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm sm:p-6" role="presentation" onClick={onClose}>
    <form className="mx-auto w-full max-w-lg rounded-2xl bg-white shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="entity-modal-title" onSubmit={onSubmit} onClick={(event) => event.stopPropagation()}>
      <div className="flex items-center justify-between border-b border-emerald-50 px-6 py-5">
        <h2 id="entity-modal-title" className="text-lg font-semibold text-gray-800">{title}</h2>
        <button type="button" onClick={onClose} className="rounded-xl p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-600" aria-label="Cerrar">×</button>
      </div>
      <div className="space-y-4 p-6">
        <>{children}</>
      </div>
      <div className="flex gap-3 border-t border-emerald-50 p-4 sm:p-6">
        <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancelar</button>
        <button type="submit" disabled={submitting} className="btn-primary flex-1 disabled:cursor-not-allowed disabled:opacity-60">{submitting ? 'Guardando...' : 'Guardar'}</button>
      </div>
    </form>
  </div>
);

export default EntityModal;