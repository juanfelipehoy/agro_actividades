import { NavLink, Outlet } from 'react-router-dom';
import {
  ClipboardList,
  Users,
  Image,
  Wrench,
  Handshake,
  History,
} from 'lucide-react';

const tabs = [
  { to: '/actividades', label: 'Actividades', icon: ClipboardList, end: true },
  { to: '/actividades/responsables', label: 'Responsables', icon: Users },
  { to: '/actividades/evidencias', label: 'Evidencias', icon: Image },
  { to: '/actividades/servicios', label: 'Servicios', icon: Handshake },
  { to: '/actividades/herramientas', label: 'Herramientas', icon: Wrench },
  { to: '/actividades/historial', label: 'Historial', icon: History },
];

const ActividadesLayout = () => {
  return (
    <div className="flex h-full flex-col">
      {/* Encabezado de sección */}
      <div className="border-b border-emerald-100/60 bg-white px-6 pt-6 pb-0">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Actividades</h1>
          <p className="mt-0.5 text-sm text-gray-400">
            Gestión de actividades agrícolas y su información relacionada
          </p>
        </div>

        {/* Tabs */}
        <nav className="flex gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                `flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'border-emerald-500 text-emerald-700'
                    : 'border-transparent text-gray-400 hover:border-emerald-200 hover:text-emerald-600'
                }`
              }
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Contenido del tab */}
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default ActividadesLayout;
