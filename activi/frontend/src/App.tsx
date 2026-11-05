import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import ActividadesPage from './pages/ActividadesPage';
import HistorialPage from './pages/HistorialPage';
import EvidenciasPage from './pages/EvidenciasPage';
import HerramientasPage from './pages/HerramientasPage';
import ResponsablesPage from './pages/ResponsablesPage';
import ServiciosPage from './pages/ServiciosPage';
import ModuloProximamente from './pages/ModuloProximamente';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="actividades" element={<ActividadesPage />} />
        <Route path="historial" element={<HistorialPage />} />
        <Route path="evidencias" element={<EvidenciasPage />} />
        <Route path="herramientas" element={<HerramientasPage />} />
        <Route path="responsables" element={<ResponsablesPage />} />
        <Route path="servicios" element={<ServiciosPage />} />
        <Route
          path="reportes"
          element={<ModuloProximamente titulo="Reportes" descripcion="Genera reportes de producción, costos y avance de actividades." />}
        />
        <Route
          path="alertas"
          element={<ModuloProximamente titulo="Alertas" descripcion="Configura alertas por vencimiento de actividades y evidencias pendientes." />}
        />
        <Route
          path="configuracion"
          element={<ModuloProximamente titulo="Configuración" descripcion="Ajustes del sistema, usuarios y parámetros de la finca." />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
