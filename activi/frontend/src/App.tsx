import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import ActividadesLayout from './pages/ActividadesLayout';
import ActividadesPage from './pages/ActividadesPage';
import HistorialPage from './pages/HistorialPage';
import EvidenciasPage from './pages/EvidenciasPage';
import HerramientasPage from './pages/HerramientasPage';
import ResponsablesPage from './pages/ResponsablesPage';
import ServiciosPage from './pages/ServiciosPage';
import ModuloProximamente from './pages/ModuloProximamente';

const proximos: Record<string, { titulo: string; descripcion: string }> = {
  perfil: { titulo: 'Perfil', descripcion: 'Datos del usuario y de la finca.' },
  cultivos: { titulo: 'Cultivos', descripcion: 'Registro y seguimiento de cultivos por lote.' },
  lotes: { titulo: 'Lotes', descripcion: 'División y administración de lotes de la finca.' },
  tratamientos: { titulo: 'Tratamientos', descripcion: 'Planes y aplicaciones fitosanitarias programadas.' },
  enfermedades: { titulo: 'Enfermedades', descripcion: 'Control y registro de enfermedades y plagas.' },
  stock: { titulo: 'Stock', descripcion: 'Inventario de insumos, herramientas y materiales.' },
  ventas: { titulo: 'Ventas', descripcion: 'Registro de ventas y trazabilidad de cosecha.' },
  iot: { titulo: 'IoT / Sensores', descripcion: 'Monitoreo de sensores de humedad, temperatura y suelo.' },
  sanidad: { titulo: 'Sanidad', descripcion: 'Planes de sanidad vegetal y alertas fitosanitarias.' },
  administracion: { titulo: 'Administración', descripcion: 'Gestión de personal, turnos y recursos.' },
  estadisticas: { titulo: 'Estadísticas', descripcion: 'Métricas y reportes de producción.' },
  usuarios: { titulo: 'Usuarios', descripcion: 'Administración de usuarios y permisos.' },
  configuracion: { titulo: 'Configuración', descripcion: 'Ajustes del sistema y parámetros de la finca.' },
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />

        {/* Sección Tratamientos / Actividades con tabs */}
        <Route path="actividades" element={<ActividadesLayout />}>
          <Route index element={<ActividadesPage />} />
          <Route path="responsables" element={<ResponsablesPage />} />
          <Route path="evidencias" element={<EvidenciasPage />} />
          <Route path="servicios" element={<ServiciosPage />} />
          <Route path="herramientas" element={<HerramientasPage />} />
          <Route path="historial" element={<HistorialPage />} />
        </Route>

        {/* Módulos próximos */}
        {Object.entries(proximos).map(([path, info]) => (
          <Route
            key={path}
            path={path}
            element={<ModuloProximamente titulo={info.titulo} descripcion={info.descripcion} />}
          />
        ))}

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
