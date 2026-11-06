import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  User,
  Sprout,
  Map,
  Pill,
  Bug,
  Package,
  DollarSign,
  Wifi,
  ShieldAlert,
  GraduationCap,
  BarChart3,
  Users,
  Settings,
  LogOut,
  ChevronRight,
  Leaf,
  ClipboardList,
  type LucideIcon,
} from 'lucide-react';

interface MenuItem {
  name?: string;
  to?: string;
  icon?: LucideIcon;
  divider?: boolean;
  hasSubmenu?: boolean;
}

const menuItems: MenuItem[] = [
  { name: 'Inicio', to: '/', icon: Home },
  { name: 'Perfil', to: '/perfil', icon: User },
  { name: 'Cultivos', to: '/cultivos', icon: Sprout },
  { name: 'Lotes', to: '/lotes', icon: Map },
  { name: 'Actividades', to: '/actividades', icon: ClipboardList },
  { divider: true },
  { name: 'Tratamientos', to: '/tratamientos', icon: Pill },
  { name: 'Enfermedades', to: '/enfermedades', icon: Bug },
  { divider: true },
  { name: 'Stock', to: '/stock', icon: Package },
  { name: 'Ventas', to: '/ventas', icon: DollarSign },
  { name: 'IoT / Sensores', to: '/iot', icon: Wifi },
  { divider: true },
  { name: 'Sanidad', to: '/sanidad', icon: ShieldAlert, hasSubmenu: true },
  { name: 'Administración', to: '/administracion', icon: GraduationCap, hasSubmenu: true },
  { divider: true },
  { name: 'Estadísticas', to: '/estadisticas', icon: BarChart3 },
  { name: 'Usuarios', to: '/usuarios', icon: Users },
  { name: 'Configuración', to: '/configuracion', icon: Settings },
];

const BarraLateral = () => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState('Inicio');

  const isActive = (item: MenuItem) => {
    if (!item.to) return false;
    if (item.to === '/') return location.pathname === '/';
    return location.pathname.startsWith(item.to);
  };

  return (
    <aside className="w-[270px] bg-[#12241C] text-[#9CA3AF] h-screen flex flex-col justify-between select-none font-sans border-r border-[#1B362B] flex-shrink-0">
      {/* Contenedor Superior (Logo + Navegación) */}
      <div className="flex flex-col h-full overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-[#1B362B]">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 pt-6 pb-4">
          <div className="w-9 h-9 bg-[#22c55e] rounded-xl flex items-center justify-center shadow-md">
            <Leaf className="w-5 h-5 text-white fill-current" />
          </div>
          <div>
            <h1 className="text-white font-extrabold text-[15px] tracking-wider leading-none">AGROSOFT</h1>
            <span className="text-[11px] text-[#8C9893] tracking-wide mt-1 block font-medium">Gestión de finca</span>
          </div>
        </div>

        {/* Opciones de menu */}
        <nav className="px-3 py-1 space-y-0.5 flex-1">
          {menuItems.map((item, index) => {
            if (item.divider) {
              return <div key={index} className="h-[1px] bg-[#1C3329] my-2 mx-3" />;
            }

            const Icon = item.icon!;
            const active = isActive(item) || activeItem === item.name;

            return (
              <NavLink
                key={item.name}
                to={item.to!}
                onClick={() => item.name && setActiveItem(item.name)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-all group ${
                  active
                    ? 'bg-[#214232] text-white shadow-sm'
                    : 'hover:bg-[#183126] text-[#9CA3AF] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-[#8C9893] group-hover:text-white'}`} />
                  <span className="tracking-tight">{item.name}</span>
                </div>

                {item.hasSubmenu && (
                  <ChevronRight className="w-4 h-4 text-[#6B7280] group-hover:text-gray-300" />
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Cerrar sesión */}
      <div className="p-3 border-t border-[#1C3329] bg-[#12241C]">
        <button
          onClick={() => console.log('Cerrar sesión')}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-medium text-[#9CA3AF] hover:bg-[#183126] hover:text-white transition-colors"
        >
          <LogOut className="w-4 h-4 text-[#8C9893]" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
};

export default BarraLateral;
